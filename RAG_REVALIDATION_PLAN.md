# Deliberry RAG Re-Validation Plan

## 1. Objective

Claude should re-validate the current Deliberry repository using the existing docs and code as source material.

Goal:
- efficient repository-wide verification
- contradiction detection
- boundary validation
- release-readiness review at the current non-live scope

Non-goal:
- speculative redesign
- reopening completed tracks without evidence

## 2. Repository Snapshot

Deliberry currently has five repository surfaces:
- `customer-app`
- `merchant-console`
- `admin-console`
- `public-website`
- `shared`

Current state:
- phases 1 through 8 are structurally complete
- post-phase tracks A through G were completed
- cross-surface hardening and cleanup were completed
- dead placeholder-state residue was reduced
- validation checks pass

Structurally complete:
- route ownership per surface
- shell ownership per surface
- feature ownership per surface
- local auth/session/runtime boundaries
- local repository/query-service boundaries
- shared contract-only layer

Intentionally non-live:
- no real backend/provider integration
- no production-grade sync/refresh
- no payment verification
- no realtime tracking
- no QR/map integrations

## 3. Source of Truth for RAG

### Must-read first
- `AGENTS.md`
- `CLAUDE.md`
- `docs/01-product-architecture.md`
- `docs/02-surface-ownership.md`
- `docs/03-navigation-ia.md`
- `docs/04-feature-inventory.md`
- `docs/05-implementation-phases.md`
- `docs/06-guardrails.md`
- `docs/07-post-phase-roadmap.md`
- `docs/08-auth-session-strategy.md`
- `shared/docs/architecture-boundaries.md`
- `shared/docs/contracts-inventory.md`
- `shared/docs/customer-app-shared-adoption-strategy.md`

### Second-pass review
- `customer-app/lib/app/router/app_router.dart`
- `customer-app/lib/app/router/route_names.dart`
- `customer-app/lib/core/session/customer_session_controller.dart`
- `customer-app/lib/core/session/customer_session_store.dart`
- `customer-app/lib/core/data/customer_repository.dart`
- `customer-app/lib/core/data/customer_query_services.dart`
- `customer-app/lib/core/data/in_memory_customer_repository.dart`
- `customer-app/lib/core/shared_contracts/domain_contract_bridge.dart`
- `merchant-console/src/shared/auth/merchant-session.ts`
- `merchant-console/src/features/auth/server/access.ts`
- `merchant-console/src/shared/data/merchant-repository.ts`
- `merchant-console/src/shared/data/merchant-query-services.ts`
- `admin-console/src/shared/auth/admin-session.ts`
- `admin-console/src/features/permissions/server/permission-actions.ts`
- `admin-console/src/shared/data/admin-repository.ts`
- `admin-console/src/shared/data/admin-query-services.ts`
- `public-website/src/shared/data/public-content-repository.ts`
- `public-website/src/shared/data/content-service.ts`

### Targeted deep-check files
- `customer-app/lib/app/entry/customer_entry_screen.dart`
- `customer-app/lib/features/auth/presentation/auth_screen.dart`
- `customer-app/lib/features/auth/presentation/auth_phone_screen.dart`
- `customer-app/lib/features/auth/presentation/auth_otp_screen.dart`
- `customer-app/lib/features/auth/presentation/guest_entry_screen.dart`
- `customer-app/lib/features/onboarding/presentation/onboarding_screen.dart`
- `customer-app/lib/features/common/presentation/customer_flow_scaffold.dart`
- `merchant-console/src/features/common/presentation/merchant_feature_scaffold.tsx`
- `merchant-console/src/features/onboarding/presentation/onboarding-screen.tsx`
- `merchant-console/src/features/store-selection/presentation/store-selection-screen.tsx`
- representative merchant screens under:
  - `dashboard`
  - `orders`
  - `menu`
  - `store-management`
  - `reviews`
  - `promotions`
  - `settlement`
  - `analytics`
  - `settings`
- `admin-console/src/features/common/presentation/admin_feature_scaffold.tsx`
- `admin-console/src/features/permissions/presentation/access-boundary-screen.tsx`
- representative admin screens under:
  - `dashboard`
  - `users`
  - `merchants`
  - `stores`
  - `orders`
  - `disputes`
  - `customer-service`
  - `settlements`
  - `finance`
  - `marketing`
  - `announcements`
  - `catalog`
  - `b2b`
  - `analytics`
  - `reporting`
  - `system-management`
- `public-website/src/features/common/presentation/public_feature_scaffold.tsx`
- representative public screens under:
  - `landing`
  - `service-introduction`
  - `merchant-onboarding`
  - `customer-support`
  - `legal`
  - `app-download`
- shared contract sources:
  - `shared/constants/domain.constants.ts`
  - `shared/constants/domain.constants.json`
  - `shared/types/*`
  - `shared/models/*`
  - `shared/api/*.json`
  - `shared/validation/*.json`
  - `shared/utils/*`

## 4. Completed Work Baseline

Codex already completed:
- phases 1 through 8
- shared adoption track
- auth/session track
- data/repository track
- customer deepening
- merchant deepening
- admin deepening
- public deepening
- cross-surface hardening and release-readiness pass

Claude should treat those as completed baseline work unless code/docs contradiction is found.

## 5. Re-Validation Goals

Claude should verify:
- docs/code alignment
- surface ownership integrity
- shared contract-only compliance
- auth/session/runtime ownership integrity
- repository/query-service seam consistency
- route/shell/access boundary consistency
- public-only website integrity
- absence of forbidden integrations
- dead-code / drift / placeholder misuse residue
- release-readiness at the current non-live scope

## 6. RAG Retrieval Strategy

1. Start with docs and handoff files.
- Build the expected-state model before reading product code.

2. Inspect root architecture and route boundaries.
- Read the route owners and shell owners first.
- Confirm surface separation before feature review.

3. Inspect surface-local runtime/auth/session boundaries.
- Customer session/controller
- Merchant session + access gate
- Admin session + permission boundary
- Public public-only rule

4. Inspect repository/query-service boundaries.
- Confirm each surface uses local repository/query-service layers.
- Confirm runtime/data orchestration did not drift into `shared`.

5. Inspect representative feature screens.
- Sample deepened screens per surface instead of reading every file first.
- Expand only where contradictions or drift appear.

6. Inspect shared contracts/constants/types/models/schemas/utils.
- Verify contract-only compliance.
- Verify surfaces consume shared artifacts without leaking runtime logic back into `shared`.

7. Run consistency checks against docs.
- Compare route groups, ownership, exclusions, and placeholder-only rules against code.

Efficiency rules:
- Do not bulk-read every feature file before checking docs and core boundaries.
- Start from governing docs, then route/runtime boundaries, then seams, then screens.
- If a contradiction is found, narrow retrieval around that contradiction instead of expanding to the whole codebase immediately.

How to detect contradictions:
- docs say surface-local, code imports cross-surface runtime
- docs say public-only, code introduces authenticated behavior in `public-website`
- docs say shared contract-only, code adds runtime logic to `shared`
- docs say placeholder-only, code behaves like live integration

## 7. Validation Checklist by Surface

### customer-app
- structural ownership
  - confirm customer-only feature ownership
  - confirm route ownership stays in `lib/app/router/`
- auth/session/runtime boundaries
  - confirm local session store/controller
  - confirm auth/OTP/guest/onboarding remain customer-local
- data/repository boundaries
  - confirm local repository/query-service usage
  - confirm no direct runtime coupling to repo-level `shared`
- feature-flow depth status
  - auth/onboarding
  - home/discovery
  - search/filter
  - store/menu
  - cart/checkout
  - orders/reviews/profile/addresses/notifications/settings
- forbidden-scope checks
  - no payment verification
  - no realtime tracking
  - no map/QR work
- docs/code consistency checks
  - route names match docs
  - guarded flows match docs

### merchant-console
- structural ownership
  - confirm store-scoped merchant routes
  - confirm no admin-governance workflow drift
- auth/session/runtime boundaries
  - confirm merchant-local session
  - confirm onboarding/store-selection/store-scope gates
- data/repository boundaries
  - confirm merchant query-service usage
  - confirm no runtime moved into `shared`
- feature-flow depth status
  - onboarding/store selection
  - dashboard/orders/menu/store
  - reviews/promotions
  - settlement/analytics/settings
- forbidden-scope checks
  - no admin-only governance behavior
  - no payment verification
- docs/code consistency checks
  - store-scoped routing preserved

### admin-console
- structural ownership
  - confirm platform-scoped admin routes
  - confirm no merchant self-service flow reuse
- auth/session/runtime boundaries
  - confirm admin-local session
  - confirm permission boundary stays local
- data/repository boundaries
  - confirm admin query-service usage
  - confirm no permission/runtime logic moved into `shared`
- feature-flow depth status
  - permissions/dashboard
  - users/merchants/stores
  - orders/disputes/customer-service
  - settlements/finance
  - marketing/announcements
  - catalog/b2b
  - analytics/reporting/system-management
- forbidden-scope checks
  - no merchant console cloning
  - no payment verification
- docs/code consistency checks
  - platform grouping preserved

### public-website
- structural ownership
  - confirm content-first route ownership
  - confirm no internal operations UI
- auth/session/runtime boundaries
  - confirm public-only behavior
  - confirm no authenticated console entry
- data/repository boundaries
  - confirm public content-service usage
  - confirm no runtime auth/data orchestration added
- feature-flow depth status
  - landing
  - service introduction
  - merchant onboarding
  - support
  - legal
  - app download
- forbidden-scope checks
  - no dashboard behavior
  - no customer checkout/order runtime
- docs/code consistency checks
  - marketing/legal grouping preserved

### shared
- structural ownership
  - confirm contract-only contents
- auth/session/runtime boundaries
  - confirm no shared runtime auth/session/permission engine
- data/repository boundaries
  - confirm no repository/service orchestration moved into `shared`
- feature-flow depth status
  - not applicable; verify neutral contract inventory only
- forbidden-scope checks
  - no UI
  - no router
  - no app state
  - no runtime orchestration
- docs/code consistency checks
  - confirm contents align with `contracts-inventory.md` and `architecture-boundaries.md`

## 8. High-Risk Review Areas

- route handoff logic
- session gating
- onboarding/store gating
- admin permission boundary
- customer auth/onboarding flow
- shared adoption boundaries
- placeholder-state residue
- repository/query-service misuse
- direct surface-to-surface coupling
- docs drift

## 9. Explicit Non-Goals

Claude should not:
- redesign the architecture
- invent new product scope
- reopen completed tracks without evidence
- treat intentional non-live limitations as bugs unless docs are contradicted
- move runtime logic into `shared`
- collapse surface boundaries

## 10. Recommended Verification Sequence

1. Read `AGENTS.md`, `CLAUDE.md`, and the governing docs.
2. Build the expected architecture and boundary map from docs only.
3. Verify root surface split and route ownership files.
4. Verify customer auth/session/router boundaries.
5. Verify merchant auth/session/store-gating boundaries.
6. Verify admin auth/session/permission boundaries.
7. Verify public route grouping and public-only behavior.
8. Verify repository/query-service seams per surface.
9. Verify representative deepened feature screens per surface.
10. Verify repo-level `shared` contents against contract-only rules.
11. Run consistency checks for forbidden integrations, drift, and boundary violations.
12. Produce findings and risk summary without implementing changes unless explicitly requested.

## 11. Expected Deliverables from Claude

Claude should produce:
- findings summary
- docs/code mismatch list
- boundary violation list
- release-readiness risk list
- prioritized fix list
- quick wins vs deeper risks

Claude should not implement unnecessary fixes unless explicitly requested.

## 12. Fast Start Prompt for Claude

```text
Read AGENTS.md, CLAUDE.md, docs/01-08, and the shared docs first.
Use RAG_REVALIDATION_PLAN.md as the retrieval order.
Re-validate the full Deliberry repository for:
- docs/code contradictions
- structural drift
- boundary violations
- release-readiness risks at the current non-live scope

Focus on:
- surface ownership
- auth/session/runtime boundaries
- repository/query-service seams
- shared contract-only compliance
- public-only website integrity
- forbidden integration absence

Report findings clearly and concretely.
Do not redesign the architecture.
Do not reopen completed tracks without evidence.
Do not implement fixes unless explicitly requested.
```
- docs/code consistency checks
  - confirm contents match `contracts-inventory.md` and `architecture-boundaries.md`

## 8. High-Risk Review Areas

- route handoff logic
- session gating
- onboarding/store gating
- admin permission boundary
- customer auth/onboarding flow
- shared adoption boundaries
- placeholder-state residue
- repository/query-service misuse
- direct surface-to-surface coupling
- docs drift

## 9. Explicit Non-Goals

Claude should not:
- redesign the architecture
- invent new product scope
- reopen completed tracks without evidence
- treat intentional non-live limitations as bugs unless docs are contradicted
- move runtime logic into `shared`
- collapse surface boundaries

## 10. Recommended Verification Sequence

1. Read `AGENTS.md`, `CLAUDE.md`, and all governing docs.
2. Build the expected architecture/boundary map from docs only.
3. Verify root surface split and route ownership files.
4. Verify customer auth/session/router boundary files.
5. Verify merchant auth/session/store-gate boundary files.
6. Verify admin auth/session/permission boundary files.
7. Verify public public-only rule and route grouping.
8. Verify repository/query-service seams for all surfaces.
9. Verify representative deepened feature screens per surface.
10. Verify repo-level `shared` contents against allowed contract-only inventory.
11. Run consistency checks for forbidden integrations, dead drift, and boundary violations.
12. Produce findings and risk summary without implementing changes unless explicitly asked.

## 11. Expected Deliverables from Claude

After re-validation, Claude should produce:
- findings summary
- docs/code mismatch list
- boundary violation list
- release-readiness risk list
- prioritized fix list
- quick wins vs deeper risks

Do not implement unnecessary changes unless explicitly requested.

## 12. Fast Start Prompt for Claude

```text
Read AGENTS.md, CLAUDE.md, docs/01-08, and the shared docs first.
Use RAG_REVALIDATION_PLAN.md as the retrieval order.
Re-validate the full Deliberry repository for:
- docs/code contradictions
- structural drift
- boundary violations
- release-readiness risks at the current non-live scope

Focus on:
- surface ownership
- auth/session/runtime boundaries
- repository/query-service seams
- shared contract-only compliance
- public-only website integrity
- forbidden integration absence

Report findings clearly and concretely.
Do not redesign the architecture.
Do not reopen completed tracks without evidence.
Do not implement fixes unless explicitly requested.
```
