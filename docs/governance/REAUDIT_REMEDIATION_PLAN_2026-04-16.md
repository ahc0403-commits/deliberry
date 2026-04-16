# Re-Audit Remediation Plan -- 2026-04-16

> **Classification: Supporting Operational Artifact** -- This is NOT a canonical governance document.
> This file converts the 2026-04-16 follow-up audit reports into an execution-ready remediation plan.

Status: active
Authority: operational (supporting artifact)
Surface: cross-surface
Domains: governance-remediation, re-audit-follow-up, sequencing
Last updated: 2026-04-16
Last verified: 2026-04-16
Retrieve when:
- converting the 2026-04-16 re-audit reports into implementation work
- deciding remediation order for newly reopened flow, admin-capability, and runtime-truth contradictions
- checking acceptance criteria for closing the latest audit findings
Related files:
- docs/governance/ORDER_FLOW_COMPLIANCE_AUDIT_2026-04-16.md
- docs/governance/ADMIN_GOVERNANCE_CAPABILITY_AUDIT_2026-04-16.md
- docs/governance/RUNTIME_TRUTH_DOCUMENTATION_AUDIT_2026-04-16.md
- docs/governance/MERCHANT_CANCELLATION_DECISION_2026-04.md
- docs/governance/ADMIN_GOVERNANCE_SCOPE_DECISION_2026-04.md
- docs/governance/AUDIT_REOPENED_FINDINGS_2026-04.md
- docs/governance/AUDIT_CLOSURE_VERIFICATION_2026-04.md
- docs/full-project-audit-verdict-2026-04-08.md

## Purpose

This document turns the 2026-04-16 focused re-audit reports into a concrete remediation plan.

It exists to answer four operational questions:

1. Which newly found contradictions are true binding-runtime violations
2. Which findings require governance decisions before implementation
3. Which items can be fixed directly without reopening architectural debates
4. What "done" means for the 2026-04-16 follow-up set

This document does not replace any binding governance file. If this plan conflicts with a binding document, the binding document wins.

## Source Inputs

This plan is based on:

- `docs/governance/ORDER_FLOW_COMPLIANCE_AUDIT_2026-04-16.md`
- `docs/governance/ADMIN_GOVERNANCE_CAPABILITY_AUDIT_2026-04-16.md`
- `docs/governance/RUNTIME_TRUTH_DOCUMENTATION_AUDIT_2026-04-16.md`
- `docs/governance/FLOW.md`
- `docs/governance/IDENTITY.md`
- `docs/runtime-truth/customer-orders-truth.md`
- the currently verified runtime in `merchant-console/`, `admin-console/`, `customer-app/`, and `supabase/migrations/`

## Scope

This plan covers exactly three confirmed re-audit findings:

- merchant cancellation authority mismatch against the binding order flow
- admin order/dispute governance capability mismatch against binding flow and identity docs
- customer orders runtime-truth drift about persisted review submission

This plan does not include:

- redoing already closed currency, idempotency, or public-auth exception work
- visual redesign or feature expansion beyond documented scope
- payment verification, QR, map autocomplete, or real-time tracking implementation

## Priority Model

### P0 -- Binding flow or authority contradiction with live runtime impact

Use for findings where:

- a binding governance document says one thing
- live runtime enforces another
- the contradiction affects allowed mutations or actor authority

### P1 -- Runtime-truth or supporting source-of-truth drift

Use for findings where:

- runtime behavior is already correct or at least understood
- but the runtime-truth documentation still misstates actual behavior

## Remediation Tracks

## Track G -- Merchant Cancellation Flow Alignment

Priority: P0
Source report: `docs/governance/ORDER_FLOW_COMPLIANCE_AUDIT_2026-04-16.md`

### Problem Statement

Binding order flow allows merchant cancellation in `pending`, `confirmed`, and `preparing`, but live runtime only allows `pending -> cancelled`.

### Goal

Make runtime and binding governance say the same thing.

### Decision Gate

Choose exactly one direction:

1. Keep binding flow and widen runtime
2. Keep runtime and narrow binding flow

### Recommended Direction

Recommended: keep binding flow and widen runtime.

Reason:

- the contradiction is in a binding flow file
- runtime already has a governed mutation path and idempotency support in place
- widening behavior is smaller churn than re-documenting a narrower operational policy across the governance chain

### Work Items

1. Confirm whether merchant cancellation after confirmation/preparation is still product-approved.
2. If approved:
   - widen `update_order_status_with_audit(...)` to allow `confirmed -> cancelled`
   - widen `update_order_status_with_audit(...)` to allow `preparing -> cancelled`
   - expose cancel affordances in merchant orders UI for those states
   - verify audit rows and idempotency replay remain correct
3. If not approved:
   - amend `docs/governance/FLOW.md`
   - amend any dependent docs that imply wider merchant authority
   - document why merchant cancellation is intentionally narrower

### Acceptance Criteria

- Merchant cancellation authority is identical in runtime and `FLOW.md`.
- Merchant UI exposes only the allowed transitions.
- Audit and idempotency behavior remain correct for every allowed cancel path.

## Track H -- Admin Governance Capability Alignment

Priority: P0
Source report: `docs/governance/ADMIN_GOVERNANCE_CAPABILITY_AUDIT_2026-04-16.md`

### Problem Statement

Binding governance assigns order/dispute mutation authority to admin actors, but current admin runtime is read-only.

### Goal

Resolve whether admin mutation authority is a current runtime obligation or a future-state governance target.

### Decision Gate

Choose exactly one direction:

1. Build admin mutation capability
2. Narrow binding governance to current read-only admin runtime

### Recommended Direction

Recommended: governance decision first, implementation second.

Reason:

- this finding spans actor authority, admin scope, audit requirements, and dispute policy
- implementing immediately may build authority that is not actually desired live
- narrowing immediately may erase intended constitutional scope

### Work Items

1. Write a short decision note naming one of:
   - current-state requirement
   - future-state deferred requirement
2. If current-state requirement:
   - define admin order-governance mutation owner path
   - define admin dispute mutation owner path
   - define audit requirements for those writes
   - add UI and runtime implementation plan
3. If future-state deferred:
   - amend `FLOW.md` and `IDENTITY.md` to clearly mark the deferred scope
   - amend supporting docs so they no longer imply the runtime already has those capabilities
   - record the future implementation dependency explicitly

### Acceptance Criteria

Exactly one capability model is true and documented:

- admin runtime supports the governed mutations, or
- binding governance clearly says those admin mutations are not currently implemented obligations

In either case:

- `FLOW.md`
- `IDENTITY.md`
- admin runtime-truth docs
- admin UI copy

must all agree.

## Track I -- Customer Orders Runtime-Truth Correction

Priority: P1
Source report: `docs/governance/RUNTIME_TRUTH_DOCUMENTATION_AUDIT_2026-04-16.md`

### Problem Statement

`customer-orders-truth.md` still says review save is preview-only even though the live runtime persists review submission.

### Goal

Restore runtime-truth accuracy for customer review submission.

### Work Items

1. Update `docs/runtime-truth/customer-orders-truth.md` to describe persisted review submission accurately.
2. Distinguish persisted runtime behavior from any preview-only fallback or missing-context screen state.
3. Recheck adjacent customer README or flow docs for repeated stale wording.

### Acceptance Criteria

- `customer-orders-truth.md` matches the controller, gateway, and RPC path.
- No nearby customer doc still states that review save is local preview only unless that statement is explicitly scoped to a fallback state.

## Sequencing

Recommended execution order:

1. Track H decision gate
2. Track G decision gate
3. Track I direct documentation fix
4. Track G runtime/doc change
5. Track H runtime/doc change depending on decision
6. closure verification and verdict update

Track I can be completed immediately and independently.

Tracks G and H should not start implementation until their decision gates are closed.

## Verification Requirements

Track G verification:

- merchant-console typecheck
- live or local replay check for expanded cancel transitions if runtime is widened
- doc-to-runtime comparison against `FLOW.md`

Track H verification:

- if runtime implemented: admin-console typecheck plus mutation-path verification plus audit verification
- if governance narrowed: compare `FLOW.md`, `IDENTITY.md`, runtime-truth docs, and admin UI wording for consistency

Track I verification:

- source-only doc review against current runtime code paths

## Closure Rule

This follow-up plan may be marked closed only when:

- all three reports have either implementation evidence or governance-decision evidence
- `AUDIT_CLOSURE_VERIFICATION_2026-04.md` and `full-project-audit-verdict-2026-04-08.md` no longer overstate closure for these findings
- no active contradiction remains between the relevant binding docs and current runtime behavior
