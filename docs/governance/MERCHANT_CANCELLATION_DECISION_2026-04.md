# Merchant Cancellation Decision -- 2026-04

> **Classification: Supporting Operational Artifact** -- This is NOT a canonical governance document.
> This file records the approved direction for the merchant cancellation contradiction found in the 2026-04-16 re-audit.

Status: active
Authority: operational (supporting artifact)
Surface: merchant-console, supabase
Domains: orders, cancellation, flow-reconciliation
Last updated: 2026-04-16
Last verified: 2026-04-16
Retrieve when:
- deciding how merchant cancellation should behave in runtime
- implementing the fix for the 2026-04-16 order flow compliance finding
- checking whether `FLOW.md` or runtime should move
Related files:
- docs/governance/FLOW.md
- docs/governance/ORDER_FLOW_COMPLIANCE_AUDIT_2026-04-16.md
- docs/governance/REAUDIT_REMEDIATION_PLAN_2026-04-16.md
- merchant-console/src/features/orders/presentation/orders-screen.tsx
- supabase/migrations/20260415173000_order_mutation_idempotency.sql

## Decision

The approved direction is:

- keep the binding order flow as written
- widen runtime so merchant cancellation is allowed from `confirmed` and `preparing`

This means merchant cancellation authority remains:

- `pending`
- `confirmed`
- `preparing`

## Reason

This direction was chosen because:

- `docs/governance/FLOW.md` is binding and already defines the broader merchant cancellation rule
- the current contradiction is runtime narrowing, not documentation ambiguity
- the live order mutation path and idempotency layer already exist, so expanding the transition guard is a contained change
- narrowing the governance rule would turn an implementation gap into a retroactive policy reduction without stronger product evidence

## Rejected Direction

Rejected direction:

- narrow `docs/governance/FLOW.md` so merchant cancellation is limited to `pending`

Reason for rejection:

- no stronger governing artifact was found that supersedes the current flow rule
- the narrower runtime behavior appears accidental or unfinished rather than explicitly approved policy
- changing the binding flow would create a weaker merchant-operational model without clear constitutional justification

## Required Follow-Through

1. Update the live order mutation guard to allow:
   - `confirmed -> cancelled`
   - `preparing -> cancelled`
2. Update merchant orders UI so cancel actions exist for those states.
3. Verify audit and idempotency behavior for the expanded cancellation paths.
4. Reconcile any supporting runtime-truth wording that still implies `pending`-only merchant cancellation.

## Rollback Position

If widening runtime causes unacceptable operational behavior, rollback is to:

- restore the narrower runtime behavior
- mark the wider merchant cancellation rule in `FLOW.md` as explicitly deferred or revised through a new governance change

## Current Conclusion

The decision gate for merchant cancellation is now closed.

Implementation is still pending.
