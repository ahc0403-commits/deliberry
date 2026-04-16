# Re-Audit Remediation Checklist -- 2026-04-16

> **Classification: Supporting Operational Artifact** -- This is NOT a canonical governance document.
> This file is the execution checklist companion to `REAUDIT_REMEDIATION_PLAN_2026-04-16.md`.

Status: active
Authority: operational (supporting artifact)
Surface: cross-surface
Domains: governance-remediation, re-audit-follow-up, execution-checklist
Last updated: 2026-04-16
Last verified: 2026-04-16
Retrieve when:
- turning the 2026-04-16 re-audit reports into concrete work
- checking whether each follow-up finding is ready to close
- collecting closure evidence for the latest governance contradictions
Related files:
- docs/governance/REAUDIT_REMEDIATION_PLAN_2026-04-16.md
- docs/governance/ORDER_FLOW_COMPLIANCE_AUDIT_2026-04-16.md
- docs/governance/ADMIN_GOVERNANCE_CAPABILITY_AUDIT_2026-04-16.md
- docs/governance/RUNTIME_TRUTH_DOCUMENTATION_AUDIT_2026-04-16.md

## Purpose

This checklist turns the 2026-04-16 re-audit reports into explicit work slices with closure evidence.

Use `REAUDIT_REMEDIATION_PLAN_2026-04-16.md` for rationale and sequencing.

## Re-Track 0 -- Decision Gates

Status: COMPLETE -- 2026-04-16

### 0A -- Admin Governance Direction

- [x] Decide whether admin order/dispute mutation authority is current-state runtime scope or future-state deferred scope.
- [x] Record the decision in one committed note or direct governance doc change.
- [x] Record who owns the decision and what doc chain is authoritative afterward.

Evidence required:

- one committed decision artifact under `docs/governance/`

### 0B -- Merchant Cancellation Direction

- [x] Decide whether merchant cancellation should remain allowed in `confirmed` and `preparing`.
- [x] Record whether runtime will widen or governance will narrow.
- [x] Record the approved owner of the decision.

Evidence required:

- one committed decision artifact or direct binding-doc update

## Re-Track 1 -- Merchant Order Flow Alignment

Status: COMPLETE -- 2026-04-16

### 1A -- If Runtime Widens

- [x] Update the live order mutation guard to allow `confirmed -> cancelled`.
- [x] Update the live order mutation guard to allow `preparing -> cancelled`.
- [x] Expose merchant UI cancel affordances for the newly allowed states.
- [x] Verify audit rows still write correctly for the expanded transitions.
- [x] Verify idempotency replay still prevents duplicate writes for the expanded transitions.

Evidence required:

- code or migration diff
- merchant UI diff
- verification note

### 1B -- If Governance Narrows

- [ ] Update `docs/governance/FLOW.md`.
- [ ] Update any dependent docs that still describe wider merchant cancellation authority.
- [ ] Document why narrower merchant authority is the intended operational rule.

Evidence required:

- committed doc diff across all affected files

## Re-Track 2 -- Admin Capability Alignment

Status: COMPLETE -- 2026-04-16

### 2A -- If Runtime Implements Admin Writes

- [ ] Add admin order-governance mutation path.
- [ ] Add admin dispute-governance mutation path.
- [ ] Add required audit coverage for those mutations.
- [ ] Update admin runtime-truth docs and UI wording to reflect live capability.

Evidence required:

- runtime code
- UI code
- audit evidence
- doc updates

### 2B -- If Governance Defers Admin Writes

- [x] Amend `docs/governance/FLOW.md` to mark the admin mutation scope accurately.
- [x] Amend `docs/governance/IDENTITY.md` if the actor-action matrix currently overstates live admin capability.
- [x] Amend supporting docs so admin surfaces are not described as already mutation-capable.

Evidence required:

- committed governance and supporting doc diff

## Re-Track 3 -- Runtime-Truth Correction

Status: COMPLETE -- 2026-04-16

### 3A -- Customer Orders Review Persistence

- [x] Update `docs/runtime-truth/customer-orders-truth.md` to describe persisted review submission.
- [x] Distinguish persisted runtime behavior from any preview-only fallback state.
- [x] Recheck nearby customer docs for repeated preview-only wording.

Evidence required:

- committed doc diff

### Re-Track 0 Completion Record

Track: Re-Track 0 -- Decision Gates
Date: 2026-04-16
Owner: governance remediation track

Completed items:
- Admin order/dispute mutation authority resolved as future-state deferred scope
- Merchant cancellation direction resolved to runtime widening rather than governance narrowing

Evidence:
- `docs/governance/ADMIN_GOVERNANCE_SCOPE_DECISION_2026-04.md`
- `docs/governance/MERCHANT_CANCELLATION_DECISION_2026-04.md`

Residual risk:
- Track G runtime verification is still pending
- Track H is doc-reconciled, but a future implementation design is still needed if admin writes are ever promoted

### Re-Track 1 Completion Record

Track: Re-Track 1 -- Merchant Order Flow Alignment
Date: 2026-04-16
Owner: governance remediation track

Completed items:
- merchant order mutation guard now allows `confirmed -> cancelled`
- merchant order mutation guard now allows `preparing -> cancelled`
- merchant order UI now exposes cancel actions for `confirmed` and `preparing`

Evidence:
- `supabase/migrations/20260416103000_expand_merchant_cancellation_paths.sql`
- `merchant-console/src/features/orders/presentation/orders-screen.tsx`

Residual risk:
- none for this track within the audited local and linked remote environments

### Re-Track 2 Completion Record

Track: Re-Track 2 -- Admin Capability Alignment
Date: 2026-04-16
Owner: governance remediation track

Completed items:
- binding governance no longer overstates live admin order mutation capability
- binding governance no longer overstates live admin dispute mutation capability
- admin runtime-truth and flow docs now explicitly describe deferred mutation scope

Evidence:
- `docs/governance/FLOW.md`
- `docs/governance/IDENTITY.md`
- `docs/runtime-truth/admin-orders-truth.md`
- `docs/runtime-truth/admin-disputes-truth.md`
- `docs/flows/admin-orders-flow.md`
- `docs/flows/admin-disputes-flow.md`

Residual risk:
- if admin mutation work is later prioritized, a separate implementation design is still required

### Re-Track 3 Completion Record

Track: Re-Track 3 -- Runtime-Truth Correction
Date: 2026-04-16
Owner: governance remediation track

Completed items:
- `customer-orders-truth.md` now describes persisted review submission accurately
- preview-only wording is now limited to the no-context fallback state

Evidence:
- `docs/runtime-truth/customer-orders-truth.md`

Residual risk:
- adjacent customer docs may still need future spot checks as review UX evolves

## Closure Pass

Status: COMPLETE -- 2026-04-16

- [x] Update `docs/governance/AUDIT_CLOSURE_VERIFICATION_2026-04.md` to reflect the latest open or closed state.
- [x] Update `docs/full-project-audit-verdict-2026-04-08.md` so it does not overstate closure.
- [x] If all items close, add a short closure note naming the final evidence chain.

Evidence required:

- committed closure/verdict updates

### Closure Record

Date: 2026-04-16
Owner: governance remediation track

Final evidence chain:
- `docs/governance/ORDER_FLOW_COMPLIANCE_AUDIT_2026-04-16.md`
- `docs/governance/ADMIN_GOVERNANCE_CAPABILITY_AUDIT_2026-04-16.md`
- `docs/governance/RUNTIME_TRUTH_DOCUMENTATION_AUDIT_2026-04-16.md`
- `docs/governance/MERCHANT_CANCELLATION_DECISION_2026-04.md`
- `docs/governance/ADMIN_GOVERNANCE_SCOPE_DECISION_2026-04.md`
- `supabase/migrations/20260416103000_expand_merchant_cancellation_paths.sql`
- `merchant-console/src/features/orders/presentation/orders-screen.tsx`
- local replay verification for `confirmed -> cancelled` and `preparing -> cancelled`
- linked remote replay verification for `confirmed -> cancelled` and `preparing -> cancelled`
