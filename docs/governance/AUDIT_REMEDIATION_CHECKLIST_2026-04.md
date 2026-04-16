# Audit Remediation Checklist -- 2026-04

> **Classification: Supporting Operational Artifact** -- This is NOT a canonical governance document.
> This file is the execution checklist companion to `AUDIT_REMEDIATION_PLAN_2026-04.md`.

Status: active
Authority: operational (supporting artifact)
Surface: cross-surface
Domains: governance-remediation, execution-checklist, audit-follow-up
Last updated: 2026-04-15
Last verified: 2026-04-15
Retrieve when:
- converting the April 2026 audit into implementation batches
- checking whether a remediation slice is ready to start or close
- collecting completion evidence for governance cleanup work
Related files:
- docs/governance/AUDIT_REMEDIATION_PLAN_2026-04.md
- docs/governance/EXECUTION_PLAN.md
- docs/governance/WAVE_TRACKER.md
- docs/governance/ENFORCEMENT_CHECKLIST.md

## Purpose

This checklist turns the audit remediation plan into concrete work batches with explicit closure evidence.

Use it for day-to-day execution.

Use `AUDIT_REMEDIATION_PLAN_2026-04.md` for rationale, sequencing, and risk context.

## How To Use This Checklist

- Start with Batch 0 and do not begin code changes until the required decisions are made.
- Check items only when the required evidence exists.
- If a decision changes the implementation path, update both this checklist and the plan document in the same change.
- If a task reveals a new governance contradiction, add it under `New Findings During Remediation` before continuing.

## Batch 0 -- Decision Gate

Status: COMPLETE -- 2026-04-15

### 0A -- Public Auth Ownership Decision

- [x] Write a short decision memo for the public customer auth exchange path.
- [x] Choose exactly one direction:
  - [x] keep as formal exception
  - [ ] relocate to the correct owner boundary
- [x] Record the owner of the decision.
- [x] Record the rollback position if the chosen direction fails.

Evidence required:

- one memo or exception record committed under `docs/governance/`
- affected docs cross-reference the decision

### 0B -- Admin Identity Model Decision

- [x] Choose the canonical admin identity model:
  - [x] `actor_type = admin` plus `role`
  - [ ] role-specific admin actor types
- [x] Record why the rejected option was not chosen.
- [x] Confirm the decision applies to docs, shared constants, runtime code, and schema.

Evidence required:

- one reconciliation note or direct doc update that names the canonical model

### 0C -- Currency Policy Clarification

- [x] Decide whether customer order creation defaults to `ARS` or derives currency from a documented rule.
- [x] Confirm whether any runtime path is legitimately allowed to write `USD`.
- [x] Confirm no path may write `VND`.

Evidence required:

- explicit rule in a committed governance or supporting operational document

### Batch 0 Completion Record

Batch: Batch 0 -- Decision Gate
Date: 2026-04-15
Owner: governance remediation track

Completed items:
- Public customer auth exchange resolved as a formal temporary exception
- Canonical admin identity model resolved to `actor_type = admin` plus `role`
- Currency remediation rule clarified: ARS default, USD explicit secondary only, VND forbidden

Evidence:
- `docs/governance/exceptions/2026-04-15-R-001-R-073-public-auth-exchange.md`
- `docs/governance/ADMIN_IDENTITY_RECONCILIATION_2026-04.md`
- `docs/governance/CURRENCY_POLICY_CLARIFICATION_2026-04.md`
- `docs/08-auth-session-strategy.md`
- `docs/governance/STRUCTURE.md`
- `docs/governance/IDENTITY.md`
- `docs/governance/DOMAIN_MAPPING_MATRIX.md`

Residual risk:
- Track A remains a temporary exception, not a structural elimination of the public auth bridge
- Track B still requires code and schema follow-through in later batches
- Track C still requires runtime fixes in customer and merchant write paths

Follow-up batch:
- Batch 1 -- P0 Runtime Corrections

## Batch 1 -- P0 Runtime Corrections

Status: COMPLETE -- 2026-04-15

### 1A -- Remove Merchant `VND` Write

- [x] Fix `merchant-console/src/shared/data/external-sales-service.ts`.
- [x] Search the repo for remaining governed `VND` writes.
- [x] Confirm shared types, runtime code, and migrations no longer conflict on merchant currency writes.

Evidence required:

- code diff removing the `VND` write
- search result proving no governed write path still uses `VND`

### 1B -- Correct Customer Order Currency Rule

- [x] Update `create_customer_order` to use the approved currency rule.
- [ ] Confirm order creation still succeeds for authenticated customers.
- [x] Confirm the resulting order record is consistent with shared contracts and schema rules.

Evidence required:

- migration or function update
- verification note showing created orders store the approved currency

### 1C -- Freeze New Money Drift

- [x] Add one enforcement mechanism for currency literals in governed write paths.
- [x] Document how reviewers should apply it.

Allowed forms:

- CI grep check
- repo script
- checklist addition with explicit command

Evidence required:

- committed enforcement step
- documentation of how to run it

### Batch 1 Completion Record

Batch: Batch 1 -- P0 Runtime Corrections
Date: 2026-04-15
Owner: governance remediation track

Completed items:
- Merchant governed write path no longer persists `VND`
- Customer order creation no longer defaults to `USD`
- Currency literal enforcement script added for governed write paths
- PR checklist updated to require the enforcement script

Evidence:
- `merchant-console/src/shared/data/external-sales-service.ts`
- `supabase/migrations/20260408113000_customer_security_boundary_hardening.sql`
- `scripts/check-governed-currency-literals.sh`
- `docs/governance/PR_CHECKLIST_CONSTITUTIONAL.md`

Residual risk:
- End-to-end runtime verification for authenticated customer order creation is still pending
- Non-governed prompt, archive, or historical docs may still mention `VND`
- Additional governed `USD` write paths could surface in future migrations and should now be caught by the script

Follow-up batch:
- Batch 2 -- Audit Trail Completion

## Batch 2 -- Audit Trail Completion

Status: COMPLETE -- 2026-04-15

### 2A -- Governed Mutation Inventory

- [x] Inventory all governed mutations for:
  - [x] Order
  - [x] Payment
  - [x] Settlement
  - [x] User
  - [x] Merchant
  - [x] Store
  - [x] Dispute
  - [x] SupportTicket
- [x] Mark each one:
  - [x] audited and hardened
  - [x] hardened but not audited
  - [x] neither

Evidence required:

- committed inventory document or committed section inside an existing operational doc

### 2B -- Cover Missing Critical Audit Paths

- [x] Add audit coverage for any customer governed mutation missing it.
- [x] Add audit coverage for any admin governed mutation missing it.
- [x] Verify merchant audited mutations still conform after any identity decision.

Evidence required:

- code or migration changes for missing audit writes
- proof each new audit entry carries `actor_id`, `actor_type`, `resource_type`, `resource_id`, `timestamp_utc`

### 2C -- Admin Audit Read Path

- [x] Implement a supported audit-log read path for admin-console.
- [x] Implement an admin audit viewer or minimally useful reader UI.
- [x] Confirm audit logs remain immutable and not directly writable by triggering actors.

Evidence required:

- admin runtime read path in code
- admin UI path in code
- verification note for immutability and access rules

### Batch 2 Completion Record

Batch: Batch 2 -- Audit Trail Completion
Date: 2026-04-15
Owner: governance remediation track

Completed items:
- Governed mutation inventory committed for all constitutional resource classes
- `create_customer_order` now writes an immutable audit record with actor and resource metadata
- `admin-console` gained a supported read-only audit-log visibility path in system-management
- Merchant audited mutations were rechecked and remain consistent with the reconciled admin identity decision
- No separate admin governed write mutation was confirmed in current runtime code, so no additional admin audit-write patch was required in this batch

Evidence:
- `docs/governance/AUDIT_MUTATION_INVENTORY_2026-04.md`
- `supabase/migrations/20260408113000_customer_security_boundary_hardening.sql`
- `supabase/migrations/20260317150000_phase_1_runtime_foundation.sql`
- `supabase/migrations/20260408140000_merchant_admin_security_hardening.sql`
- `admin-console/src/app/(platform)/system-management/page.tsx`
- `admin-console/src/features/system-management/presentation/system-management-screen.tsx`
- `admin-console/src/features/system-management/README.md`
- `admin-console/src/shared/data/supabase-admin-runtime-repository.ts`

Residual risk:
- Several governed resource classes still remain `neither` because the runtime mutation path itself is not yet implemented
- User-profile preference persistence is still hardened but not audited
- This batch added audit coverage to the order-create migration, but no end-to-end runtime execution against a live Supabase environment was performed here

Follow-up batch:
- Batch 3 -- P1 Documentation Reconciliation

## Batch 3 -- P1 Documentation Reconciliation

Status: COMPLETE -- 2026-04-15

### 3A -- Customer Surface Reconciliation

- [x] Update customer address docs to reflect persisted behavior.
- [x] Update customer checkout/orders docs to reflect persisted order creation.
- [x] Update customer review docs to reflect persisted review submission.
- [x] Reconcile any stale “local-only” wording that is now false.

Evidence required:

- updated README, runtime-truth, filemap, and flow docs where applicable

### 3B -- Merchant Surface Reconciliation

- [x] Update merchant auth docs to reflect Supabase authority branch reality.
- [x] Update merchant orders docs to reflect runtime-service ownership.
- [x] Update merchant reviews/settings/store-management docs to reflect persisted runtime behavior.
- [x] Remove stale fixture-backed claims where routes are persisted.

Evidence required:

- updated README, runtime-truth, and filemap docs

### 3C -- Admin Surface Reconciliation

- [x] Update admin orders docs to reflect direct runtime repository ownership.
- [x] Update admin disputes docs to reflect direct runtime repository ownership.
- [x] Remove stale ungated/fixture-backed claims in feature README files.

Evidence required:

- updated README, runtime-truth, filemap, and flow docs

### 3D -- Public and Governance Path Cleanup

- [x] Correct stale route-group references in governance docs.
- [x] Confirm public runtime-truth docs still match actual route ownership after cleanup.

Evidence required:

- updated governance path references

### Batch 3 Completion Record

Batch: Batch 3 -- P1 Documentation Reconciliation
Date: 2026-04-15
Owner: governance remediation track

Completed items:
- Customer address, checkout, orders, and review docs now reflect persisted runtime behavior
- Merchant auth and orders docs now point to the real runtime owners
- Merchant reviews, settings, and store-management docs no longer describe persisted routes as fixture-backed
- Admin orders and disputes docs now point to direct page plus runtime-repository ownership
- Governance support-path drift for the public marketing route was corrected

Evidence:
- `docs/runtime-truth/customer-address-truth.md`
- `customer-app/lib/features/addresses/README.md`
- `customer-app/lib/features/checkout/README.md`
- `customer-app/lib/features/orders/README.md`
- `customer-app/lib/features/reviews/README.md`
- `docs/flows/customer-checkout-orders-flow.md`
- `docs/flows/customer-profile-settings-flow.md`
- `docs/runtime-truth/merchant-auth-session-truth.md`
- `docs/filemaps/merchant-orders-filemap.md`
- `merchant-console/src/features/reviews/README.md`
- `merchant-console/src/features/settings/README.md`
- `merchant-console/src/features/store-management/README.md`
- `docs/runtime-truth/admin-orders-truth.md`
- `docs/runtime-truth/admin-disputes-truth.md`
- `admin-console/src/features/orders/README.md`
- `admin-console/src/features/disputes/README.md`
- `docs/filemaps/admin-orders-filemap.md`
- `docs/filemaps/admin-disputes-filemap.md`
- `docs/flows/admin-orders-flow.md`
- `docs/flows/admin-disputes-flow.md`
- `docs/governance/DOMAIN_MAPPING_MATRIX.md`

Residual risk:
- Some lower-priority runtime-truth and filemap documents outside these audited routes may still contain historical language
- Product copy honesty cleanup for excluded features remains a separate batch

Follow-up batch:
- Batch 4 -- Legacy Owner Cleanup

## Batch 4 -- Legacy Owner Cleanup

Status: COMPLETE -- 2026-04-15

### 4A -- Admin Owner Decision

- [x] Decide whether `adminQueryServices` becomes the live abstraction or remains legacy.
- [x] If legacy, mark it non-authoritative in docs.
- [x] Keep migrated admin routes and shell counts on the real runtime repository path.

Evidence required:

- one committed decision reflected in code and docs

### 4B -- Merchant Owner Decision

- [x] Decide whether `merchantQueryServices` remains active only for fixture-backed routes or should be retired from affected runtime docs.
- [x] Remove mixed-owner claims from high-risk merchant routes.
- [x] Keep migrated merchant routes and shell badge counts on runtime-service ownership.

Evidence required:

- docs and code point to one owner per affected route

### Batch 4 Completion Record

Batch: Batch 4 -- Legacy Owner Cleanup
Date: 2026-04-15
Owner: governance remediation track

Completed items:
- `adminQueryServices` was explicitly retained as a legacy fixture abstraction rather than promoted to a live runtime owner
- `merchantQueryServices` was explicitly retained as a fixture-only legacy abstraction for non-migrated routes
- Admin platform layout counts for users, orders, and disputes now read from the runtime repository
- Merchant store layout badge counts for orders and reviews now read from runtime services
- High-risk merchant orders docs were updated to remove mixed-owner claims

Evidence:
- `docs/governance/LEGACY_OWNER_DECISION_2026-04.md`
- `admin-console/src/shared/data/admin-query-services.ts`
- `merchant-console/src/shared/data/merchant-query-services.ts`
- `admin-console/src/app/(platform)/layout.tsx`
- `merchant-console/src/app/(console)/[storeId]/layout.tsx`
- `docs/runtime-truth/merchant-orders-truth.md`
- `docs/flows/merchant-orders-flow.md`

Residual risk:
- Fixture-backed routes still legitimately depend on the query-service layers, so the classes remain a potential source of future ambiguity if new docs are careless
- A broader abstraction unification could still be chosen later, but that would be a new architectural change rather than a remediation follow-through

Follow-up batch:
- Batch 5 -- P2 Honesty Cleanup

## Batch 5 -- P2 Honesty Cleanup

Status: COMPLETE -- 2026-04-15

### 5A -- Excluded Feature Wording Cleanup

- [x] Remove copy that implies real-time tracking is live.
- [x] Remove copy that implies live payment verification is already implemented.
- [x] Clean mock announcements or testimonials that overstate excluded capabilities.

Evidence required:

- updated copy in public, customer, and admin audited locations

### 5B -- Wording Guardrail

- [x] Add one repeatable review step for copy that touches excluded or placeholder features.

Allowed forms:

- governance checklist addition
- PR checklist addition
- dedicated wording note in the remediation plan

Evidence required:

- committed review rule

### Batch 5 Completion Record

Batch: Batch 5 -- P2 Honesty Cleanup
Date: 2026-04-15
Owner: governance remediation track

Completed items:
- Public marketing copy no longer describes live tracking or live payment processing as present-day capabilities
- Customer order-status wording now uses status-update language instead of live-tracking language
- Admin mock announcements and support-ticket seed copy no longer imply an excluded delivery-tracking feature
- Merchant loading-state wording no longer calls the queue live by default
- PR review checklist now includes a repeatable wording check for excluded or placeholder capabilities

Evidence:
- `public-website/src/features/landing/presentation/landing-screen.tsx`
- `public-website/src/features/app-download/presentation/app-download-screen.tsx`
- `public-website/src/features/service-introduction/presentation/service-introduction-screen.tsx`
- `public-website/src/features/legal/presentation/privacy-screen.tsx`
- `customer-app/lib/features/orders/presentation/order_status_screen.dart`
- `customer-app/lib/features/orders/presentation/orders_screen.dart`
- `customer-app/lib/features/home/presentation/home_screen.dart`
- `admin-console/src/shared/data/admin-mock-data.ts`
- `merchant-console/src/app/(console)/[storeId]/orders/loading.tsx`
- `docs/governance/PR_CHECKLIST_CONSTITUTIONAL.md`

Residual risk:
- Some archived or historical docs still mention excluded capabilities intentionally as roadmap or audit history
- Flutter runtime copy was updated, but no dedicated Dart analyzer or widget test was run in this batch

Follow-up batch:
- Batch 6 -- Closure Pass

## Batch 6 -- Closure Pass

Status: COMPLETE -- 2026-04-15

### 6A -- Re-Audit High-Risk Findings

- [x] Re-check public auth ownership.
- [x] Re-check admin identity alignment.
- [x] Re-check merchant and customer currency writes.
- [x] Re-check audit coverage claims.

Evidence required:

- one closing verification note with file references

### 6B -- Update Operational Tracking Docs

- [x] Update `AUDIT_REMEDIATION_PLAN_2026-04.md` to reflect completed tracks.
- [x] Update `WAVE_TRACKER.md` if any wave-level status changed materially.
- [x] Update `EXECUTION_PLAN.md` only if wave assumptions or acceptance criteria changed.

Evidence required:

- committed tracking updates

### Batch 6 Completion Record

Batch: Batch 6 -- Closure Pass
Date: 2026-04-15
Owner: governance remediation track

Completed items:
- High-risk findings were re-audited against the remediated repo state
- Closing verification note committed with resolved versus intentionally open status
- Remediation plan and wave tracker now reference the closure state
- `EXECUTION_PLAN.md` was intentionally left unchanged because wave assumptions and acceptance criteria did not materially change during this remediation

Evidence:
- `docs/governance/AUDIT_CLOSURE_VERIFICATION_2026-04.md`
- `docs/governance/AUDIT_REMEDIATION_PLAN_2026-04.md`
- `docs/governance/WAVE_TRACKER.md`
- `scripts/check-governed-currency-literals.sh`
- `docs/governance/exceptions/2026-04-15-R-001-R-073-public-auth-exchange.md`
- `docs/governance/ADMIN_IDENTITY_RECONCILIATION_2026-04.md`
- `docs/governance/AUDIT_MUTATION_INVENTORY_2026-04.md`

Residual risk:
- The public auth bridge remains a temporary exception rather than a removed boundary crossing
- Audit coverage is governed and inventoried, but not all entity classes have a live audited mutation path yet
- Historical governance artifacts still intentionally contain past-state references

Follow-up batch:
- Reopened Track R1 -- Post-Closure Findings

## Completion Evidence Template

Use the following structure when closing a batch:

```text
Batch:
Date:
Owner:

Completed items:
- ...

Evidence:
- file/path:line
- file/path:line

Residual risk:
- ...

Follow-up batch:
- ...
```

## New Findings During Remediation

Add newly discovered issues here before changing the main plan.

- 2026-04-15 -- `R-FLOW-IDEMPOTENCY`
  - `docs/governance/FLOW.md` still requires `idempotency_key` for all order mutations.
  - current customer and merchant order mutation paths do not yet implement that contract.
  - canonical record: `docs/governance/AUDIT_REOPENED_FINDINGS_2026-04.md`

- 2026-04-15 -- `R-DOMAIN-MATRIX-DRIFT`
  - `docs/governance/DOMAIN_MAPPING_MATRIX.md` still understates current runtime maturity in order and support-adjacent areas.
  - this now contradicts the stronger documentation-alignment claim made during closure.
  - canonical record: `docs/governance/AUDIT_REOPENED_FINDINGS_2026-04.md`

## Reopened Track R1 -- Post-Closure Findings

Status: COMPLETE -- 2026-04-15

### R1A -- Order Idempotency Decision and Reconciliation

- [x] Decide whether governed order mutations will implement `idempotency_key` end to end or whether `FLOW.md` will be narrowed.
- [x] Record the owner layer for the chosen guarantee.
- [x] Reconcile customer order create path with the chosen guarantee.
- [x] Reconcile merchant or admin order-status mutation path with the chosen guarantee.

Evidence required:

- one committed design note or implementation batch record
- matching updates across `FLOW.md`, runtime code, and migrations

Current design artifact:

- `docs/governance/ORDER_IDEMPOTENCY_IMPLEMENTATION_DESIGN_2026-04.md`

### R1B -- Domain Mapping Matrix Reconciliation

- [x] Update `DOMAIN_MAPPING_MATRIX.md` so current maturity language matches runtime-truth and persisted behavior.
- [x] Remove "No real backend" or equivalent wording where persisted runtime paths already exist.
- [x] Reconcile closure and verdict docs after the matrix is updated.

Evidence required:

- committed matrix update
- committed closure and verdict sync

### Reopened Track R1 Completion Record

Batch: Reopened Track R1 -- Post-Closure Findings
Date: 2026-04-15
Owner: governance remediation track

Completed items:
- Implemented order-mutation idempotency for customer create and merchant status updates
- Added a dedicated order idempotency storage table and replay contract in Supabase
- Propagated `idempotencyKey` through customer and merchant live order mutation callers
- Reconciled `FLOW.md` and `DOMAIN_MAPPING_MATRIX.md` to the implemented runtime state
- Synced reopened-finding, closure, and verdict documents back to closed status

Evidence:
- `docs/governance/ORDER_IDEMPOTENCY_IMPLEMENTATION_DESIGN_2026-04.md`
- `docs/governance/FLOW.md`
- `docs/governance/DOMAIN_MAPPING_MATRIX.md`
- `docs/governance/AUDIT_REOPENED_FINDINGS_2026-04.md`
- `docs/governance/AUDIT_CLOSURE_VERIFICATION_2026-04.md`
- `docs/full-project-audit-verdict-2026-04-08.md`
- `supabase/migrations/20260415173000_order_mutation_idempotency.sql`
- `customer-app/lib/core/data/customer_runtime_controller.dart`
- `customer-app/lib/core/data/customer_runtime_gateway.dart`
- `customer-app/lib/core/data/supabase_customer_runtime_gateway.dart`
- `merchant-console/src/features/orders/server/order-actions.ts`
- `merchant-console/src/shared/data/merchant-order-runtime-service.ts`
- `merchant-console/src/shared/data/supabase-merchant-runtime-repository.ts`

Residual risk:
- Live Supabase replay verification is still required before calling the duplicate-replay behavior production-verified
- Existing production environments still need the new migration applied before runtime behavior matches source

Follow-up batch:
- None -- reopened track closed in source/docs pending normal rollout verification

## Current Recommended Start Order

1. Batch 0A
2. Batch 0B
3. Batch 0C
4. Batch 1A
5. Batch 1B
6. Batch 2A
7. Batch 3A
8. Batch 3B

This is the shortest path to reducing live governance risk without opening too many parallel decision branches.
