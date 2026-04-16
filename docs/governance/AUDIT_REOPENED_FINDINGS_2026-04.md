# Audit Reopened Findings -- 2026-04

> **Classification: Supporting Operational Artifact** -- This is NOT a canonical governance document.
> This file records findings discovered after the April 2026 remediation closure pass and defines the next remediation slices required to restore doc-to-code alignment.

Status: active
Authority: operational (supporting artifact)
Surface: cross-surface
Domains: governance-remediation, reopened-findings, audit-follow-up
Last updated: 2026-04-15
Last verified: 2026-04-15
Retrieve when:
- reopening the April 2026 audit set after a follow-up verification pass
- planning remediation for newly discovered governance contradictions
- reconciling closure claims with current repo evidence
Related files:
- docs/governance/AUDIT_CLOSURE_VERIFICATION_2026-04.md
- docs/governance/AUDIT_REMEDIATION_CHECKLIST_2026-04.md
- docs/governance/ORDER_IDEMPOTENCY_IMPLEMENTATION_DESIGN_2026-04.md
- docs/governance/ORDER_FLOW_COMPLIANCE_AUDIT_2026-04-16.md
- docs/governance/ADMIN_GOVERNANCE_CAPABILITY_AUDIT_2026-04-16.md
- docs/governance/RUNTIME_TRUTH_DOCUMENTATION_AUDIT_2026-04-16.md
- docs/governance/FLOW.md
- docs/governance/DOMAIN_MAPPING_MATRIX.md
- docs/full-project-audit-verdict-2026-04-08.md

## Purpose

This addendum records governance findings that were not captured in the original April 2026 remediation batches.

It exists so the closure note, execution checklist, and overall verdict can all point to the same reopened state without rewriting the original remediation history.

## Reopened Finding 1 -- Order Idempotency Gap

Finding ID: R-FLOW-IDEMPOTENCY
Severity: high
Track type: implementation and governance reconciliation
Status: resolved in source -- 2026-04-15

### Binding source

- `docs/governance/FLOW.md` Section 6.1 requires every order mutation to be idempotent.
- The same section requires each mutation request to include an `idempotency_key`.
- Duplicate requests with the same `idempotency_key` must return the first result without re-executing the mutation.

### Evidence

- `docs/governance/FLOW.md`
- `supabase/migrations/20260408113000_customer_security_boundary_hardening.sql`
- `supabase/migrations/20260408140000_merchant_admin_security_hardening.sql`
- `merchant-console/src/features/orders/server/order-actions.ts`
- `merchant-console/src/shared/data/merchant-order-runtime-service.ts`

### Resolved state

The runtime now carries and enforces `idempotency_key` for the live governed order mutation paths.

Confirmed examples:

- `public.create_customer_order(...)` now accepts and enforces `p_idempotency_key`
- `public.update_order_status_with_audit(...)` now accepts and enforces `p_idempotency_key`
- customer and merchant live callers now forward the key through their runtime layers

### Resolution evidence

- `docs/governance/ORDER_IDEMPOTENCY_IMPLEMENTATION_DESIGN_2026-04.md`
- `docs/governance/FLOW.md`
- `supabase/migrations/20260415173000_order_mutation_idempotency.sql`
- `customer-app/lib/core/data/customer_runtime_controller.dart`
- `customer-app/lib/core/data/customer_runtime_gateway.dart`
- `customer-app/lib/core/data/supabase_customer_runtime_gateway.dart`
- `merchant-console/src/features/orders/server/order-actions.ts`
- `merchant-console/src/shared/data/merchant-order-runtime-service.ts`
- `merchant-console/src/shared/data/supabase-merchant-runtime-repository.ts`

### Closing note

The chosen direction was end-to-end implementation rather than rule narrowing.

The remaining residual risk is verification depth, not doc-to-code contradiction:

- runtime duplicate-replay behavior still needs live Supabase execution verification outside this source-only pass

## Reopened Finding 2 -- Domain Mapping Matrix Drift

Finding ID: R-DOMAIN-MATRIX-DRIFT
Severity: medium
Track type: documentation reconciliation
Status: resolved in docs -- 2026-04-15

### Binding source

- `AGENTS.md` and the architecture set require docs to remain the source of truth.
- the April remediation batches claimed documentation alignment and closure.

### Evidence

- `docs/governance/DOMAIN_MAPPING_MATRIX.md`
- `docs/runtime-truth/admin-orders-truth.md`
- `docs/runtime-truth/admin-disputes-truth.md`
- `docs/runtime-truth/merchant-orders-truth.md`
- `supabase/migrations/20260408113000_customer_security_boundary_hardening.sql`
- `supabase/migrations/20260408140000_merchant_admin_security_hardening.sql`

### Resolved state

`DOMAIN_MAPPING_MATRIX.md` now reflects current runtime maturity for the order, admin-governance, and support-adjacent rows that had drifted behind the implementation.

### Resolution evidence

- `docs/governance/DOMAIN_MAPPING_MATRIX.md`
- `docs/runtime-truth/admin-orders-truth.md`
- `docs/runtime-truth/admin-disputes-truth.md`
- `docs/runtime-truth/merchant-orders-truth.md`
- `docs/full-project-audit-verdict-2026-04-08.md`

### Closing note

The matrix remains a supporting artifact, but it no longer materially understates runtime maturity in the rows that triggered the reopened finding.

## Recommended Execution Order

1. Run live verification against Supabase for duplicate replay behavior.
2. If production apply succeeds, update any rollout note that references the April governance closure state.

## Current State Summary

The April 2026 remediation remains valid for the originally tracked findings, and the reopened follow-up items are now resolved in source and docs.

It is now more accurate to say:

- the original high-risk contradictions were remediated or formally governed
- two follow-up findings were discovered during re-verification
- both reopened findings now have committed source or documentation resolution evidence

## Later Re-Audit Reports

The reopened findings above were resolved, but later re-audit passes identified additional contradictions that remain open.

Focused reports:

- `docs/governance/ORDER_FLOW_COMPLIANCE_AUDIT_2026-04-16.md`
- `docs/governance/ADMIN_GOVERNANCE_CAPABILITY_AUDIT_2026-04-16.md`
- `docs/governance/RUNTIME_TRUTH_DOCUMENTATION_AUDIT_2026-04-16.md`
