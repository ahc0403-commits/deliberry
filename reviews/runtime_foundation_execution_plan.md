Status: active
Authority: execution planning
Surface: cross-surface
Domains: runtime-foundation, persistence, auth, mutation-boundaries, live-transition
Last updated: 2026-03-17
Last verified: 2026-03-17
Retrieve when:
- starting the first backend-backed runtime foundation wave after redesign closure
- deciding what to implement first for real persistence, auth, mutation logging, and lifecycle truth
Related files:
- /Users/andremacmini/Deliberry/reviews/wave_6_runtime_integration_report.md
- /Users/andremacmini/Deliberry/docs/ui-governance/RUNTIME_REALITY_MAP.md
- /Users/andremacmini/Deliberry/docs/08-auth-session-strategy.md
- /Users/andremacmini/Deliberry/shared/utils/transitions.ts
- /Users/andremacmini/Deliberry/customer-app/lib/core/data/customer_runtime_controller.dart
- /Users/andremacmini/Deliberry/merchant-console/src/shared/data/merchant-repository.ts
- /Users/andremacmini/Deliberry/admin-console/src/shared/data/admin-repository.ts

# Runtime Foundation Execution Plan

## Objective

Prepare the repository for live transition by replacing local-only, fixture-backed, and cookie-only mutation paths with one real persistence and auth foundation.

This wave is not a presentation wave.
This wave is not a feature-expansion wave.
This wave is the first real runtime infrastructure wave that makes future product behavior durable, attributable, and enforceable.

Primary workstream:

- data and persistence foundation

Connected workstream:

- auth and session foundation

Those two must be implemented as one runtime program, but data should lead the sequence.

## Current Runtime Reality

The repository is structurally ready for runtime wiring, but the live mutation layer does not exist yet.

### Customer App

Current truth:

- `customer-app/lib/core/data/customer_runtime_controller.dart` owns cart, address, order, promo, and local order-record truth.
- `customer-app/lib/core/session/customer_session_controller.dart` owns auth state.
- `customer-app/lib/core/session/customer_session_store.dart` persists only to in-memory process state through `MemoryCustomerSessionStore`.
- `submitOrder()` creates a local `MockOrder` and local milestones only.

Implication:

- Customer ordering is coherent but not durable.
- No order lifecycle, audit trail, or backend-backed account truth exists.

### Merchant Console

Current truth:

- `merchant-console/src/features/auth/server/auth-actions.ts` writes merchant auth state to cookies.
- `merchant-console/src/features/store-selection/server/store-selection-actions.ts` writes selected-store truth to cookies.
- `merchant-console/src/shared/auth/merchant-session.ts` reads cookie-backed session/store state.
- `merchant-console/src/shared/data/merchant-repository.ts` is an in-memory repository seeded from fixtures.
- `merchant-console/src/shared/data/merchant-query-services.ts` exposes read/query behavior plus one in-memory order-status mutation.

Implication:

- Merchant route protection and store scope are runtime-real.
- Merchant data is still process-local and fixture-backed.
- Order progression is coherent only inside the current process and session.

### Admin Console

Current truth:

- `admin-console/src/features/auth/server/auth-actions.ts` writes admin session cookies.
- `admin-console/src/features/permissions/server/permission-actions.ts` writes role cookies and mirrors role into the session cookie.
- `admin-console/src/shared/auth/admin-session.ts` reads cookie-backed session truth.
- `admin-console/src/shared/auth/admin-access.ts` owns role-to-route access mapping.
- `admin-console/src/shared/data/admin-repository.ts` is a pure fixture-backed repository with no mutations.

Implication:

- Admin access control is runtime-enforced.
- Admin identity, role selection, and all oversight data remain cookie/local/fixture-backed.
- No real admin action, audit event, dispute transition, or support-ticket mutation exists.

### Shared Layer

Current truth:

- `shared/utils/transitions.ts` already defines canonical transition validators.
- audit schemas and audit types already exist.
- order schemas already define per-status timestamps.

Implication:

- Contract and validation readiness is good.
- Runtime wiring is absent.

## Target Architecture

## Core Target

Introduce one real backend foundation that provides:

- persistent domain data
- authenticated actors
- mutation entrypoints
- audit/event capture
- state transition enforcement
- timestamp population at write time

## Architectural Rule

The backend foundation should be shared as infrastructure and contracts, not as shared UI/runtime orchestration inside repo-level `shared/`.

That means:

- one backend project
- one canonical persistence schema
- one canonical event/audit model
- one canonical auth identity source
- surface-local adapters and runtime clients per surface

It must not mean:

- moving auth/session orchestration into repo-level `shared/`
- merging surface ownership boundaries

## Recommended Runtime Shape

### Backend

- one backend project with persistent storage and auth provider
- one database schema for users, merchants, stores, orders, disputes, support tickets, settlements, and audit logs
- one mutation layer that enforces canonical transitions and timestamp writes

### Surface Runtime Clients

- `customer-app`: customer-local auth client + repository adapters
- `merchant-console`: merchant-local session/auth adapter + store-scoped repositories
- `admin-console`: admin-local session/auth adapter + platform repositories

### Shared Layer Role

`shared/` continues to own:

- contracts
- types
- validation schemas
- constants
- pure utilities

`shared/` must still not own:

- auth/session storage
- route guards
- runtime repositories
- surface-specific orchestration

## Source-of-Truth Boundaries

### Identity and Session Truth

- Customer session truth should move from `CustomerSessionController` + `MemoryCustomerSessionStore` to a provider-backed customer-local session adapter.
- Merchant session truth should move from cookies written in `merchant-console/src/features/auth/server/auth-actions.ts` to provider-backed merchant auth plus merchant-local session handling.
- Admin session truth should move from cookies written in `admin-console/src/features/auth/server/auth-actions.ts` to provider-backed admin auth plus admin-local role/session handling.

### Domain Mutation Truth

- Order creation and status changes must move out of local controller/repository state and into real mutation handlers.
- Disputes, support tickets, settlements, and finance visibility should remain read-oriented until each domain gets an approved mutation model, but they must read from persistent data once the backend exists.

### Audit Truth

- Audit logging must be generated at mutation boundaries, not in UI code.
- Audit events should be created from actor identity + domain mutation request + before/after state snapshot.

### Transition Truth

- `shared/utils/transitions.ts` remains the canonical validator source.
- Validation must be called at backend mutation time before write commit.

### Timestamp Truth

- Per-status order timestamps must be populated by the mutation layer whenever status changes occur.
- UI code must stop manufacturing lifecycle timestamps locally beyond preview-only fallback behavior during migration.

## Phase Breakdown

## Phase 1 — Backend Foundation Bootstrap

Objective:

- Stand up the backend base needed for all later runtime work.

Required outputs:

- backend project selection and initialization
- environment and secrets strategy
- initial persistent schema for:
  - users / customer identities
  - merchants
  - stores
  - orders
  - audit logs
- auth provider configuration skeleton

Implement first:

- backend project and migration scaffold
- audit log table/schema
- order table/schema aligned to shared order schema
- identity/session tables or provider integration baseline

Do not implement yet:

- full domain migrations for every admin route
- payment verification
- real-time tracking

## Phase 2 — Surface-Local Auth Foundation

Objective:

- Replace local/cookie-only auth truth with provider-backed session truth while preserving surface separation.

Customer:

- replace `MemoryCustomerSessionStore` with a real customer-local persistence/provider adapter
- keep guest mode explicit
- keep phone/OTP structure, but route it through real backend auth

Merchant:

- replace merchant cookie-only sign-in bootstrap with provider-backed merchant auth
- keep merchant-local onboarding and selected-store gating
- preserve selected-store as merchant-local runtime state, but back it with persistent actor/store membership truth

Admin:

- replace admin cookie-only sign-in bootstrap with provider-backed admin auth
- preserve admin-local role routing
- move role resolution from demo cookie state to persistent identity/role claims

## Phase 3 — Order Persistence Cutover

Objective:

- Move customer and merchant order truth to persistent storage first, because order flow is the highest-leverage shared domain.

Implement:

- customer checkout mutation writes persistent order records
- merchant order list/detail reads from persistent orders
- merchant order progression writes persistent status updates
- customer orders/detail/status read the same persisted records

Wire in:

- `shared/utils/transitions.ts` for order transitions
- status timestamp writes
- audit events for order creation and status changes

This is the first phase where the repo begins to behave like one real runtime system instead of separate demo-safe surfaces.

## Phase 4 — Audit and Event Wiring

Objective:

- Make mutation truth attributable and reviewable.

Implement:

- mutation interceptor or service-layer audit writer
- actor attribution from real session identity
- after-state capture and minimal before-state capture where needed

Start with:

- order create
- order status transition
- merchant sign-in / store selection if needed for operational audit
- admin role access changes only if they remain explicit domain events

## Phase 5 — Admin and Merchant Operational Data Cutover

Objective:

- Replace fixture-backed repository reads with persistent reads for the next high-value console domains.

Priority order:

1. merchant dashboard/orders/menu dependencies
2. admin dashboard/orders/disputes/customer-service dependencies
3. reporting/settlements/finance read models

Defer lower-value admin content/governance sections until core oversight reads are persistent.

## Phase 6 — Secondary Domain Mutation Expansion

Objective:

- Expand beyond orders only after the backend foundation is proven.

Candidates:

- support ticket status transitions
- dispute lifecycle transitions
- merchant menu mutations
- store-management mutations

This phase should not start until Phases 1–5 are stable.

## Exact Target Files and Areas By Surface

### Shared

Read first / preserve as canonical:

- `shared/utils/transitions.ts`
- `shared/validation/order.schema.json`
- `shared/validation/audit.schema.json`
- `shared/types/audit.types.ts`
- `shared/models/domain.models.ts`

Expected work:

- schema alignment only
- no runtime orchestration moved here

### Customer App

Primary cutover points:

- `customer-app/lib/core/session/customer_session_controller.dart`
- `customer-app/lib/core/session/customer_session_store.dart`
- `customer-app/lib/core/data/customer_runtime_controller.dart`
- checkout/order flows under:
  - `customer-app/lib/features/checkout/`
  - `customer-app/lib/features/orders/`

What changes later:

- controller stops being the durable source of truth for orders
- session store stops being in-memory only
- local order records become client-side cache/view models over backend truth

### Merchant Console

Primary cutover points:

- `merchant-console/src/features/auth/server/auth-actions.ts`
- `merchant-console/src/features/store-selection/server/store-selection-actions.ts`
- `merchant-console/src/shared/auth/merchant-session.ts`
- `merchant-console/src/shared/data/merchant-repository.ts`
- `merchant-console/src/shared/data/merchant-query-services.ts`

What changes later:

- sign-in and selected-store truth move from cookies-only to provider + persistent store membership truth
- in-memory repository becomes backend-backed repository
- `updateOrderStatus()` becomes a real mutation boundary with transition validation and audit logging

### Admin Console

Primary cutover points:

- `admin-console/src/features/auth/server/auth-actions.ts`
- `admin-console/src/features/permissions/server/permission-actions.ts`
- `admin-console/src/shared/auth/admin-session.ts`
- `admin-console/src/shared/auth/admin-access.ts`
- `admin-console/src/shared/data/admin-repository.ts`
- `admin-console/src/shared/data/admin-query-services.ts`

What changes later:

- session and role truth move from cookies to provider-backed identity and persistent role claims
- fixture-backed dashboard/oversight reads move to persistent repositories
- admin route guards stay local, but read real session/role truth

## Dependency Order

Sequential first:

1. Backend project/bootstrap and persistence schema baseline
2. Auth provider baseline and environment wiring
3. Order persistence model and audit log model
4. Customer/merchant/admin local auth adapters against the real backend
5. Customer checkout and merchant order mutation cutover

Parallel once backend bootstrap exists:

- customer session adapter work
- merchant auth/store membership adapter work
- admin auth/role adapter work

Parallel once order persistence exists:

- customer order reads
- merchant order reads
- audit event sink wiring

Later sequential:

- admin oversight read-model cutover
- non-order domain mutations

## High-Risk Migration Points

### 1. Duplicated Truth During Cutover

Risk:

- Local controller/repository state and backend state can diverge if both remain writable.

Protection:

- introduce one temporary adapter boundary per surface
- allow local fallback reads only behind explicit migration flags
- stop local writes as soon as the backend write path is available

### 2. Surface Boundary Collapse

Risk:

- pressure to centralize auth/session logic into repo-level `shared/`

Protection:

- keep provider clients and session orchestration surface-local
- share only contracts, schema shapes, and pure utilities

### 3. Merchant/Admin Cookie Compatibility

Risk:

- existing route guards depend on current cookie/session behavior

Protection:

- migrate via adapter functions that can read both legacy cookie truth and new provider truth during a short transition window
- remove legacy cookie path only after guards and server actions are cut over

### 4. Customer Order Flow Regression

Risk:

- checkout/order/detail/status/review continuity is currently coherent and can break if backend IDs or timestamps drift

Protection:

- preserve one canonical order-id path
- cut over checkout + order reads as one sub-wave
- verify reorder and review-entry immediately after each cutover

### 5. Transition Validator Underuse

Risk:

- backend writes may bypass `shared/utils/transitions.ts`

Protection:

- require all order/dispute/support/settlement mutations to route through one service-layer validator wrapper before commit

## What Must Be Implemented First vs Later

### First

- backend foundation bootstrap
- auth provider baseline
- persistent order schema
- audit log schema
- session adapter boundaries

### Next

- customer checkout -> persistent order create
- merchant order status -> persistent order transition
- audit event writes for those order mutations
- per-status timestamp population

### Later

- admin oversight read-model persistence
- dispute/support/settlement transitions
- richer customer account hydration
- broad non-order domain write paths

## Explicit Non-Goals

- payment verification
- real-time tracking
- broad redesign or UI work
- moving runtime orchestration into repo-level `shared/`
- implementing every admin mutation at once
- replacing all fixture-backed reads before the order domain is persistent

## Validation Gates

Before Phase 1 is considered ready:

- backend schema plan matches shared contract shapes
- auth/session plan preserves surface-local ownership
- no runtime orchestration is moved into `shared/`

Before Phase 2 is considered ready:

- customer, merchant, and admin session flows can all resolve authenticated vs unauthenticated state from real provider truth
- route guards still work for merchant selected-store and admin role gating

Before Phase 3 is considered ready:

- customer checkout writes a durable order
- merchant order status updates change the same durable order
- customer orders/detail/status read the persisted order consistently
- audit log entries are emitted for create and status transitions
- per-status timestamps are written during transitions

Before broader domain expansion:

- legacy local write paths are removed or hard-disabled
- migration fallbacks are no longer masking backend failures

## Rollback and Safety Notes

- Keep the first live domain small: orders only.
- Use a compatibility layer during cutover rather than replacing all local truth at once.
- Preserve the ability to fall back to current fixture/local read behavior behind an explicit flag while backend plumbing stabilizes.
- Do not start dispute/support/settlement mutation work until order persistence and auth are demonstrably stable.

## Recommended First Implementation Phase

Start with:

**Phase 1 — Backend Foundation Bootstrap**

Reason:

- Every blocked runtime item in `wave_6_runtime_integration_report.md` depends on real persistence and auth existing first.
- Without that foundation, any surface-level mutation work will recreate temporary local solutions instead of solving the real runtime gap.

## Exact Areas To Start With

1. Shared contract alignment inputs
- `shared/utils/transitions.ts`
- `shared/validation/order.schema.json`
- `shared/validation/audit.schema.json`
- `shared/types/audit.types.ts`

2. Customer durability cutover boundary
- `customer-app/lib/core/session/customer_session_controller.dart`
- `customer-app/lib/core/session/customer_session_store.dart`
- `customer-app/lib/core/data/customer_runtime_controller.dart`

3. Merchant runtime auth/data boundary
- `merchant-console/src/features/auth/server/auth-actions.ts`
- `merchant-console/src/features/store-selection/server/store-selection-actions.ts`
- `merchant-console/src/shared/auth/merchant-session.ts`
- `merchant-console/src/shared/data/merchant-repository.ts`

4. Admin runtime auth/data boundary
- `admin-console/src/features/auth/server/auth-actions.ts`
- `admin-console/src/features/permissions/server/permission-actions.ts`
- `admin-console/src/shared/auth/admin-session.ts`
- `admin-console/src/shared/data/admin-repository.ts`

## Execution Summary

Use one backend foundation, but keep runtime clients surface-local.

Sequential:

- backend bootstrap
- auth baseline
- order + audit schema
- order mutation cutover

Parallel after bootstrap:

- customer session adapter planning
- merchant auth/store adapter planning
- admin auth/role adapter planning

Parallel after order persistence exists:

- customer order reads
- merchant order reads
- audit sink wiring

This is the smallest honest path from a structurally complete demo-safe repository to a live-capable runtime foundation.
