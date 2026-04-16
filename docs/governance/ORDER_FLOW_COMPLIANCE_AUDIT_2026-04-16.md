# Order Flow Compliance Audit -- 2026-04-16

> **Classification: Supporting Operational Artifact** -- This is NOT a canonical governance document.
> This file records a focused re-audit of live order flow behavior against the binding governance flow.

Status: resolved in source and locally/remote verified
Authority: operational (supporting artifact)
Surface: merchant-console, supabase
Domains: orders, flow-compliance, governance-remediation
Last updated: 2026-04-16
Last verified: 2026-04-16
Retrieve when:
- reconciling merchant order transition behavior against the binding state machine
- planning runtime changes for merchant cancellation authority
- deciding whether to narrow or preserve the current order flow contract
Related files:
- docs/governance/FLOW.md
- docs/governance/AUDIT_REOPENED_FINDINGS_2026-04.md
- merchant-console/src/features/orders/presentation/orders-screen.tsx
- supabase/migrations/20260415173000_order_mutation_idempotency.sql

## Purpose

This report isolates the order-flow contradiction that remains after the April 2026 remediation closure work.

It exists so implementation planning can focus on one concrete inconsistency: merchant cancellation authority in live runtime is narrower than the binding governance flow.

## Audit Verdict

Verdict: fail
Severity: high
Finding ID: OF-2026-04-16-01

The live merchant order mutation path does not fully implement the cancellation transitions required by the binding order flow.

## Binding Requirement

The canonical state machine in `docs/governance/FLOW.md` defines the merchant order flow as:

- `pending -> confirmed` by merchant
- `pending -> cancelled` by merchant
- `confirmed -> preparing` by merchant
- `confirmed -> cancelled` by merchant
- `preparing -> ready` by merchant
- `preparing -> cancelled` by merchant

This means merchant cancellation authority must remain available through `pending`, `confirmed`, and `preparing`.

## Implementation Evidence

### SQL mutation guard

`supabase/migrations/20260415173000_order_mutation_idempotency.sql` currently allows:

- `pending -> confirmed`
- `pending -> preparing`
- `pending -> cancelled`
- `confirmed -> preparing`
- `preparing -> ready`

The relevant live guard is:

- [20260415173000_order_mutation_idempotency.sql](/Users/andremacmini/Deliberry/supabase/migrations/20260415173000_order_mutation_idempotency.sql:495)
- [20260415173000_order_mutation_idempotency.sql](/Users/andremacmini/Deliberry/supabase/migrations/20260415173000_order_mutation_idempotency.sql:496)
- [20260415173000_order_mutation_idempotency.sql](/Users/andremacmini/Deliberry/supabase/migrations/20260415173000_order_mutation_idempotency.sql:497)

No branch permits:

- `confirmed -> cancelled`
- `preparing -> cancelled`

### Merchant UI affordance

The merchant orders UI exposes cancel/reject only while status is `pending`.

Evidence:

- [orders-screen.tsx](/Users/andremacmini/Deliberry/merchant-console/src/features/orders/presentation/orders-screen.tsx:436)
- [orders-screen.tsx](/Users/andremacmini/Deliberry/merchant-console/src/features/orders/presentation/orders-screen.tsx:437)

No equivalent cancel affordance exists for `confirmed` or `preparing`.

## Impact

- The live runtime violates the binding order flow.
- Merchant operators cannot perform a cancellation action that governance says is valid.
- Future audits will continue to report a high-severity doc-to-code contradiction until one side is changed.
- The current implementation creates hidden policy by runtime behavior instead of by documented governance.

## Remediation Options

### Option A -- Align runtime to governance

Change the live mutation guard and merchant UI so merchants may cancel while status is `confirmed` or `preparing`.

Required work:

- widen `update_order_status_with_audit(...)` transition guard
- expose cancel action in merchant orders UI for `confirmed` and `preparing`
- verify audit output and idempotency replay behavior still hold for the expanded transitions
- update runtime-truth docs if any wording still assumes `pending`-only cancellation

### Option B -- Align governance to runtime

If the real product policy is that merchants may cancel only while `pending`, amend the binding flow and any dependent docs to say so explicitly.

Required work:

- update `docs/governance/FLOW.md`
- update any runtime-truth or domain docs that mention merchant cancellation authority
- document why narrower merchant authority is the intended control model

## Recommended Direction

Recommended: Option A unless product governance explicitly rejects post-confirmation merchant cancellation.

Reason:

- the current contradiction is in a binding flow document, not a low-priority supporting note
- runtime already supports adjacent governed mutations through the same RPC path
- widening the transition model is more consistent with the current canonical order state machine than narrowing the docs after the fact

## Acceptance Criteria

- Merchant can cancel a `confirmed` order through the live runtime path.
- Merchant can cancel a `preparing` order through the live runtime path.
- Duplicate requests with the same `idempotency_key` still do not duplicate order or audit rows.
- Merchant UI exposes only the transitions that the binding flow allows.
- `docs/governance/FLOW.md` and live runtime behavior say the same thing.

## Current Conclusion

This finding is resolved in source.

Resolution evidence:

- `supabase/migrations/20260416103000_expand_merchant_cancellation_paths.sql`
- `merchant-console/src/features/orders/presentation/orders-screen.tsx`

Verification on 2026-04-16 confirmed in both local and linked remote Supabase environments:

- `confirmed -> cancelled` succeeds
- `preparing -> cancelled` succeeds
- replay with the same `idempotency_key` returns the original result without duplicating order or audit rows
