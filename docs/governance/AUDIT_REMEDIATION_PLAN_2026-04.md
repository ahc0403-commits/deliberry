# Audit Remediation Plan -- 2026-04

> **Classification: Supporting Operational Artifact** -- This is NOT a canonical governance document.
> This file converts the April 2026 repository audit into an execution-ready remediation plan.

Status: active
Authority: operational (supporting artifact)
Surface: cross-surface
Domains: governance-remediation, audit-follow-up, sequencing
Last updated: 2026-04-15
Last verified: 2026-04-15
Retrieve when:
- converting audit findings into implementation work
- deciding remediation order across customer, merchant, admin, public, shared, and Supabase
- checking acceptance criteria for governance-alignment cleanup
Related files:
- docs/governance/CONSTITUTION.md
- docs/governance/IDENTITY.md
- docs/governance/FLOW.md
- docs/governance/STRUCTURE.md
- docs/governance/AUDIT_REMEDIATION_CHECKLIST_2026-04.md
- docs/governance/EXECUTION_PLAN.md
- docs/governance/WAVE_TRACKER.md
- docs/governance/ENFORCEMENT_CHECKLIST.md
- docs/governance/AUDIT_CLOSURE_VERIFICATION_2026-04.md

Closure status:
- Tracks A through F were executed on 2026-04-15.
- Closing verification is recorded in `docs/governance/AUDIT_CLOSURE_VERIFICATION_2026-04.md`.
- Reopened follow-up track R1 was implemented in source/docs on 2026-04-15.

## Purpose

This document turns the repository-wide April 2026 audit into a concrete remediation plan.

It exists to answer five operational questions:

1. Which findings must be fixed first
2. Which findings are true governance violations versus documentation drift
3. Which changes require architectural decisions before implementation
4. Which work can proceed in parallel without creating merge or rollout risk
5. What "done" means for each remediation track

This document does not replace any binding governance file. If this plan conflicts with a binding document, the binding document wins.

## Source Inputs

This plan is based on the audited state of:

- required surface docs in `docs/01-product-architecture.md` through `docs/06-guardrails.md`
- governance docs under `docs/governance/`
- runtime-truth, flow, and filemap docs under `docs/runtime-truth/`, `docs/flows/`, and `docs/filemaps/`
- runtime code across `customer-app/`, `merchant-console/`, `admin-console/`, `public-website/`, `shared/`
- Supabase migrations and Edge Functions in `supabase/migrations/` and `supabase/functions/`

## Scope

This plan covers all confirmed audit findings from the April 2026 review:

- public auth ownership boundary conflict
- admin actor taxonomy drift
- currency-rule violations in merchant and customer mutation paths
- incomplete audit-trail coverage
- stale runtime-truth, README, and filemap documents
- legacy query-service and mock-owner drift after persisted runtime adoption
- excluded-feature wording leakage
- governance path drift in a small number of docs

This plan does not include:

- visual redesign work
- feature expansion beyond documented scope
- payment verification or payment completion
- map autocomplete, QR generation/scanning, or real-time tracking implementation
- broad monorepo or tooling redesign

## Priority Model

Use the following priority model for remediation sequencing.

### P0 -- Binding rule violation with live runtime impact

Fix immediately if the issue:

- violates a binding governance rule
- affects authenticated ownership, money integrity, or audit integrity
- can create wrong data, wrong attribution, or incorrect access boundaries

### P1 -- Runtime truth mismatch with high operational risk

Fix next if the issue:

- misdirects future implementation into the wrong files or layers
- creates ambiguity about authoritative runtime ownership
- increases the chance of introducing regressions

### P2 -- Honesty, clarity, and maintenance drift

Fix after P0 and P1 if the issue:

- misstates capability without changing runtime behavior
- creates stale wording or governance-path confusion
- does not directly compromise auth, money, or mutation correctness

## Remediation Tracks

## Track A -- Surface Boundary and Auth Ownership

Priority: P0

### Problem Statement

`public-website` currently owns a customer auth/session exchange path, which conflicts with the intended public-surface boundary.

### Confirmed Evidence

- `docs/governance/STRUCTURE.md`
- `docs/08-auth-session-strategy.md`
- `public-website/src/app/customer-zalo-auth-exchange/route.ts`

### Goal

Resolve the contradiction between governance structure and operational auth behavior without creating a hidden or undocumented exception.

### Required Decisions

1. Decide whether public auth exchange is a sanctioned exception or an architectural mistake.
2. If it is an exception, create a formal governance exception record with sunset and owner.
3. If it is not an exception, move ownership to the correct surface or backend boundary.

### Work Items

1. Produce a decision memo: "keep as governed exception" versus "relocate ownership".
2. If keeping:
   - add `docs/governance/exceptions/YYYY-MM-DD-R-001-R-073-public-auth-exchange.md`
   - define allowed scope, forbidden expansion, and sunset review date
   - update `docs/governance/STRUCTURE.md` and `docs/08-auth-session-strategy.md` to explicitly cross-reference the exception
3. If relocating:
   - define the new owner boundary
   - update route ownership docs
   - remove public-surface mutation/session ownership
   - preserve current customer login continuity during the move
4. Add an enforcement check so future public routes cannot silently re-acquire authenticated business ownership.

### Acceptance Criteria

- No undocumented contradiction remains between `STRUCTURE.md` and runtime auth ownership.
- The public auth path is either formally excepted or fully relocated.
- Future reviewers can identify the approved owner from one authoritative document chain.

### Rollback Notes

- If relocation causes auth instability, rollback is to the current route plus a formal temporary exception record.

## Track B -- Identity and Taxonomy Alignment

Priority: P0

### Problem Statement

Binding identity docs define role-specific admin actor types, but shared constants, runtime code, and database schema still use generic `"admin"`.

### Confirmed Evidence

- `docs/governance/IDENTITY.md`
- `shared/constants/domain.constants.ts`
- `shared/constants/domain.constants.json`
- `admin-console/src/shared/auth/admin-session.ts`
- `admin-console/src/shared/auth/admin-auth-adapter.ts`
- `supabase/migrations/20260317150000_phase_1_runtime_foundation.sql`

### Goal

Choose one canonical admin identity model and align docs, shared contracts, runtime code, and schema to it.

### Options

Option 1: `actor_type = admin` plus `role = PERMISSION_ROLE`

- Lowest migration cost
- Fits current schema and code better
- Requires updating binding docs that currently treat admin roles as actor types

Option 2: role-specific admin actor types

- Matches current binding `IDENTITY.md`
- Increases schema and runtime churn
- Requires broader changes across audit logs, actor tables, and auth/session code

### Recommendation

Adopt Option 1 unless governance explicitly rejects it.

Reason:

- the database, shared constants, audit schema, and admin runtime already converge on `actor_type = admin`
- the system already stores role separately and server-side RBAC is role-driven
- changing one binding doc set is safer than rewriting identity storage, session payloads, audit checks, and migration constraints

### Work Items

1. Write a governance reconciliation note that declares the canonical admin model.
2. Update `IDENTITY.md`, `DOMAIN_MAPPING_MATRIX.md`, and any role docs to reflect the chosen model.
3. Ensure all auth/session docs state:
   - `actor_type = admin`
   - `role in PERMISSION_ROLES`
4. Verify audit-log consumers and future audit UI use `actor_type + role` together.
5. Remove stale references that imply role-specific actor types are already persisted in runtime storage.

### Acceptance Criteria

- One canonical admin identity model is documented without contradiction.
- Shared constants, runtime code, and schema match the same model.
- Audit semantics for admin actors are explicitly documented and reviewable.

### Rollback Notes

- If doc reconciliation creates wider confusion, rollback is to preserve current code/schema and narrow the doc change to a temporary reconciliation memo.

## Track C -- Currency and Money Integrity

Priority: P0

### Problem Statement

Two live mutation paths violate currency governance:

- merchant external sales writes `VND`
- customer order creation hardcodes `USD`

### Confirmed Evidence

- `docs/governance/CONSTITUTION.md`
- `merchant-console/src/shared/data/external-sales-service.ts`
- `supabase/migrations/20260408113000_customer_security_boundary_hardening.sql`

### Goal

Make all persisted write paths comply with canonical money rules:

- ARS is primary
- USD is secondary only when explicitly justified
- VND is never used

### Work Items

1. Fix `merchant-console/src/shared/data/external-sales-service.ts` to stop writing `VND`.
2. Decide whether `create_customer_order` should default to `ARS` or derive currency from store/platform settings.
3. Remove any implicit `USD` default that lacks a documented business basis.
4. Search all write paths, seeders, migrations, and service functions for hardcoded currency values.
5. Add a lightweight enforcement check in code review or CI:
   - fail on new `"VND"` literals in governed code
   - flag hardcoded `"USD"` in write paths unless explicitly allowed
6. Reconcile any docs still describing outdated currency assumptions.

### Acceptance Criteria

- No governed mutation path writes `VND`.
- Customer order creation uses an approved currency rule.
- Shared types, schema constraints, and runtime writes are aligned.

### Rollback Notes

- Currency fixes must not rewrite historic records blindly.
- If historical cleanup is needed, perform it as an explicit data-repair step with audit notes.

## Track D -- Audit Trail and RPC Hardening

Priority: P0

### Problem Statement

Audit infrastructure exists but is incomplete, and governed mutation coverage is not yet comprehensive.

### Confirmed Evidence

- `docs/governance/CONSTITUTION.md`
- `docs/governance/EXECUTION_PLAN.md`
- `supabase/migrations/20260317150000_phase_1_runtime_foundation.sql`
- `supabase/migrations/20260408113000_customer_security_boundary_hardening.sql`
- `supabase/migrations/20260408140000_merchant_admin_security_hardening.sql`

### Goal

Reach constitutional audit coverage for governed entities and ensure hardened RPC ownership rules stay consistent.

### Work Items

1. Build a governed-mutation inventory:
   - orders
   - payments
   - settlements
   - users
   - merchants
   - stores
   - disputes
   - support tickets
2. Mark each mutation path as one of:
   - audited and hardened
   - hardened but not audited
   - unaudited and unhardened
3. Add missing audit writes for governed customer mutations where required.
4. Add missing audit writes for governed admin mutations where required.
5. Verify `actor_id`, `actor_type`, `resource_type`, and before/after snapshots match constitutional shape.
6. Implement admin audit-log read API.
7. Implement admin audit-log viewer.
8. Add a verification document or checklist proving coverage after rollout.

### Specific Constraint

Do not expand payment functionality into verification or completion logic while adding audit coverage.

### Acceptance Criteria

- Every governed mutation has an identified audit path.
- Missing audit paths are either implemented or explicitly documented as deferred with owner and reason.
- Admin can read audit logs through a supported runtime path.
- Audit entries remain immutable and non-user-writable.

### Rollback Notes

- Audit coverage can be rolled out incrementally by entity class.
- Do not remove existing immutability or service-role protections during rollback.

## Track E -- Runtime-Truth, README, and Filemap Reconciliation

Priority: P1

### Problem Statement

Large sections of customer, merchant, and admin operational docs still describe fixture-backed or local-only behavior after the runtime moved to persisted Supabase-backed paths.

### Confirmed Evidence

Affected areas include:

- customer addresses
- customer checkout/orders
- customer reviews
- merchant auth
- merchant orders
- merchant reviews
- merchant settings
- merchant store management
- admin orders
- admin disputes

### Goal

Restore document honesty so engineers edit the actual runtime owner instead of stale legacy paths.

### Work Items

1. Create one reconciliation pass per surface:
   - customer-app
   - merchant-console
   - admin-console
   - public-website
2. For each affected feature, update:
   - feature README
   - runtime-truth doc
   - filemap
   - flow doc, if it makes runtime claims
3. Standardize wording:
   - "fixture-backed"
   - "local-only"
   - "persisted"
   - "read-only"
   - "preview-only"
4. Remove legacy query-service or repository references from docs where pages no longer use them.
5. Where legacy layers remain in code, label them explicitly as structural leftovers or future refactor targets.

### Recommended Order

1. customer
2. merchant
3. admin
4. public

Reason:

- customer and merchant docs are currently the most misleading about mutation and persistence
- admin drift is real but narrower
- public is mostly honest already

### Acceptance Criteria

- Every audited feature doc points to the real read/write owner.
- No README says "fixture-backed" or "local-only" when the live route is persisted.
- Runtime-truth, filemap, and flow docs agree with each other for each remediated feature.

### Rollback Notes

- Documentation-only changes are safe to ship independently.

## Track F -- Legacy Runtime Owner Cleanup

Priority: P1

### Problem Statement

Several surfaces still retain legacy query-service or mock-owner layers after live routes moved to runtime repositories or runtime services.

### Confirmed Evidence

- `admin-console/src/shared/data/admin-query-services.ts`
- `admin-console/src/shared/data/admin-repository.ts`
- `merchant-console/src/shared/data/merchant-query-services.ts`
- related filemaps and READMEs

### Goal

Decide whether these layers remain intentional compatibility boundaries or should be retired to reduce confusion.

### Work Items

1. Inventory every page that bypasses a query-service layer and reads runtime repositories directly.
2. For each case, choose one direction:
   - rewire query service to be the true runtime abstraction
   - retire legacy query service from the live path
3. Update docs to match the chosen owner.
4. Remove dead or misleading mock-read references from high-risk routes first:
   - merchant orders
   - admin orders
   - admin disputes

### Acceptance Criteria

- High-risk routes have a single clearly documented runtime owner.
- Legacy abstraction layers are either realigned or marked as non-authoritative.

### Rollback Notes

- Prefer documentation first, code-layer retirement second.
- Do not remove legacy layers until import ownership is fully understood.

## Track G -- Exclusion and Product Copy Cleanup

Priority: P2

### Problem Statement

Some user-facing copy and mock data imply excluded or not-yet-real capabilities, especially around tracking and live behavior.

### Confirmed Evidence

- `public-website/src/features/landing/presentation/landing-screen.tsx`
- `admin-console/src/shared/data/admin-mock-data.ts`
- `customer-app/lib/features/orders/presentation/order_status_screen.dart`
- other small wording leaks found during the audit

### Goal

Bring product language back into line with guardrails without reducing approved feature scope.

### Work Items

1. Define approved wording for:
   - order status presentation
   - milestone updates
   - checkout payment selection
   - support pathways
2. Remove copy that implies:
   - real-time tracking
   - live payment verification
   - completed operational flows that are still preview-only
3. Clean mock announcements and testimonials that overstate excluded features.
4. Add a small copy-review section to the relevant PR checklist if needed.

### Acceptance Criteria

- No public or in-app copy claims excluded capabilities as live.
- Placeholder and preview states are described honestly and consistently.

## Track H -- Governance Path and Mapping Cleanup

Priority: P2

### Problem Statement

A small number of governance docs reference outdated route groups or paths.

### Confirmed Evidence

- `docs/governance/DOMAIN_MAPPING_MATRIX.md`
- current `public-website/src/app/(marketing)/...` tree

### Goal

Remove stale path references that can mislead future governance reviews.

### Work Items

1. Scan governance docs for outdated route-group names.
2. Correct path references to current route ownership.
3. Add a lightweight review step when route groups change.

### Acceptance Criteria

- Governance docs no longer point to outdated route trees for audited areas.

## Sequencing

Use this sequence unless an active incident or release deadline changes the order.

### Phase 1 -- Decision and Containment

1. Resolve Track A decision on public auth ownership.
2. Resolve Track B decision on admin identity model.
3. Freeze new currency or audit-related write paths until Track C and Track D owners are assigned.

### Phase 2 -- High-Risk Runtime Corrections

1. Fix currency write violations.
2. Expand audit coverage for highest-risk governed mutations.
3. Document any temporary exceptions explicitly.

### Phase 3 -- Runtime Owner Reconciliation

1. Reconcile customer docs.
2. Reconcile merchant docs.
3. Reconcile admin docs.
4. Decide fate of legacy query-service layers.

### Phase 4 -- Honesty and Governance Cleanup

1. Remove excluded-feature wording leakage.
2. Clean governance path drift.
3. Close remaining low-risk doc inconsistencies.

## Parallelization Guidance

The following work can proceed in parallel after Phase 1 decisions:

- Track C and Track E
- Track D implementation planning and Track G copy cleanup
- customer doc reconciliation and merchant doc reconciliation

The following work should not proceed in parallel without coordination:

- Track A relocation work and auth/session documentation edits
- Track B taxonomy decision and audit-schema changes
- Track F query-service refactors and large doc rewrites for the same routes

## Dependency Map

```text
[Track A boundary decision] ----\
                                 \
[Track B identity decision] -------> [Track D audit completion]
                                 /
[Track C currency fixes] --------/

[Track E doc reconciliation] ---> [Track F legacy owner cleanup]

[Track G copy cleanup] ----------> independent after P0 containment
[Track H path cleanup] ----------> independent after route ownership confirmed
```

## Test and Verification Matrix

Every remediation PR should list the relevant paths below.

### Happy Paths

- customer authenticated order creation still succeeds
- merchant store-scoped reads and updates still succeed
- admin role-gated access still succeeds
- public marketing routes still render correctly
- audit-log write path works for newly covered governed mutations

### Error Paths

- unauthenticated customer cannot place order
- merchant without membership cannot access another store
- invalid admin role cannot access protected route
- hardened RPC rejects missing or mismatched authenticated identity
- unsupported currency values cannot be written by governed mutation paths

### Edge Cases

- repeated write or retry path does not duplicate governed records incorrectly
- address default repair remains coherent after delete
- review upsert remains order-scoped to authenticated customer
- doc updates do not preserve stale dual-owner claims

## Risks

### Risk 1 -- Decision churn on admin identity model

If the team cannot settle the admin model quickly, Track D audit work may branch in the wrong direction.

Mitigation:

- decide Track B before expanding admin audit semantics

### Risk 2 -- Boundary fix causes auth regression

If public auth exchange ownership is moved too early, customer login continuity may break.

Mitigation:

- treat Track A as a guarded migration or a formal exception, not an implicit rewrite

### Risk 3 -- Documentation cleanup gets deferred forever

If code fixes ship without doc reconciliation, the repo remains misleading.

Mitigation:

- require doc-owner updates in the same remediation milestone for affected features

### Risk 4 -- Audit scope expands into payment implementation

Audit work may tempt implementers to add real payment lifecycle behavior.

Mitigation:

- keep payment verification and completion explicitly out of scope

## Rollback Strategy

This remediation program is designed for low-cost rollback.

- P0 documentation decisions can be rolled back by reverting the supporting artifact or exception memo.
- Currency fixes should avoid rewriting historic data unless a dedicated repair step is approved.
- Audit coverage can expand incrementally by entity class without requiring one big-bang release.
- Documentation reconciliation can ship independently of runtime code changes.

## Definition of Done

This audit remediation plan is considered complete when all of the following are true:

1. The public auth ownership contradiction is resolved or formally excepted.
2. Admin identity taxonomy has one canonical model across docs, shared, code, and schema.
3. No governed write path persists `VND`, and customer order currency follows an approved rule.
4. Governed mutations have declared audit coverage with implemented critical-path entries.
5. Customer, merchant, and admin docs identify the true runtime owner for audited features.
6. Excluded-feature wording leakage is removed from high-visibility product surfaces.
7. Governance mapping docs no longer point to stale route groups in audited areas.

## Immediate Next Actions

The first implementation slice should be:

1. Track A decision memo
2. Track B decision memo
3. Track C currency fixes
4. Track D audit coverage inventory
5. Track E customer + merchant doc reconciliation

This is the shortest path to reducing real platform risk while also lowering future implementation confusion.

Execution checklist companion:

- `docs/governance/AUDIT_REMEDIATION_CHECKLIST_2026-04.md`
