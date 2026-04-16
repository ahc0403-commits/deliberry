# Admin Governance Capability Audit -- 2026-04-16

> **Classification: Supporting Operational Artifact** -- This is NOT a canonical governance document.
> This file records a focused re-audit of admin governance capabilities against the binding identity and flow model.

Status: resolved in docs as deferred scope
Authority: operational (supporting artifact)
Surface: admin-console
Domains: admin-governance, orders, disputes, capability-gap
Last updated: 2026-04-16
Last verified: 2026-04-16
Retrieve when:
- deciding whether admin order/dispute actions are current-state requirements or future-state targets
- planning admin write paths for order governance and dispute progression
- reconciling binding admin actor authority with current admin-console behavior
Related files:
- docs/governance/FLOW.md
- docs/governance/IDENTITY.md
- docs/governance/AUDIT_REOPENED_FINDINGS_2026-04.md
- docs/runtime-truth/admin-orders-truth.md
- docs/runtime-truth/admin-disputes-truth.md

## Purpose

This report isolates the admin-governance contradiction that remains after the April 2026 remediation closure work.

It exists because the binding governance model assigns real operational authority to admin actors, while the current admin runtime remains read-only in those same domains.

## Audit Verdict

Verdict: fail
Severity: high
Finding ID: AG-2026-04-16-01

The current admin-console does not implement the order and dispute governance mutations required by the binding identity and flow model.

## Binding Requirement

### Orders

`docs/governance/IDENTITY.md` assigns `operations_admin` authority to read all orders and override status.

`docs/governance/FLOW.md` defines admin-handled order intervention authority in pre-delivery states.

### Disputes

`docs/governance/IDENTITY.md` assigns dispute-management authority to admin actors.

`docs/governance/FLOW.md` defines a dispute lifecycle that includes:

- `open -> investigating`
- `investigating -> escalated`
- `investigating -> resolved`

The same governance set states that all surfaces must implement transitions according to these definitions.

## Implementation Evidence

### Orders runtime is read-only

The admin orders runtime-truth document explicitly states there is no write path for order governance actions.

Evidence:

- [admin-orders-truth.md](/Users/andremacmini/Deliberry/docs/runtime-truth/admin-orders-truth.md:35)
- [admin-orders-flow.md](/Users/andremacmini/Deliberry/docs/flows/admin-orders-flow.md:35)

The UI also presents the screen as read-only governance review.

Evidence:

- [orders-screen.tsx](/Users/andremacmini/Deliberry/admin-console/src/features/orders/presentation/orders-screen.tsx:43)
- [orders-screen.tsx](/Users/andremacmini/Deliberry/admin-console/src/features/orders/presentation/orders-screen.tsx:192)

### Disputes runtime is read-only

The admin disputes runtime-truth document explicitly states there is no assignment, review, or case-mutation path.

Evidence:

- [admin-disputes-truth.md](/Users/andremacmini/Deliberry/docs/runtime-truth/admin-disputes-truth.md:31)
- [admin-disputes-flow.md](/Users/andremacmini/Deliberry/docs/flows/admin-disputes-flow.md:34)

The UI keeps all action affordances preview-only.

Evidence:

- [disputes-screen.tsx](/Users/andremacmini/Deliberry/admin-console/src/features/disputes/presentation/disputes-screen.tsx:21)
- [disputes-screen.tsx](/Users/andremacmini/Deliberry/admin-console/src/features/disputes/presentation/disputes-screen.tsx:28)
- [disputes-screen.tsx](/Users/andremacmini/Deliberry/admin-console/src/features/disputes/presentation/disputes-screen.tsx:130)

## Impact

- The binding governance model overstates live admin operational capability.
- Admin actor taxonomy now has reconciled identity semantics, but not matching operational execution paths.
- Runtime-truth docs correctly describe read-only behavior, which means the contradiction sits between binding governance and actual product scope.
- Governance reviewers cannot reliably tell whether admin authority is required now or is still future-state.

## Remediation Options

### Option A -- Implement admin governance writes

Build the missing admin order and dispute mutation paths.

Required work:

- add admin-authorized order-governance RPC or server action path
- add admin-authorized dispute progression and ownership workflow
- wire audit logging for those governed mutations
- update admin runtime-truth docs from read-only to runtime-real

### Option B -- Narrow binding governance to current runtime

If admin order/dispute governance is intentionally deferred, revise binding docs so they no longer claim those actions are currently implemented surface obligations.

Required work:

- amend `docs/governance/FLOW.md`
- amend `docs/governance/IDENTITY.md` if needed
- clearly mark admin order/dispute mutation authority as future-state or deferred
- ensure supporting docs and verdict artifacts do not imply implementation completeness

## Recommended Direction

Recommended: explicit governance decision first, then implementation or narrowing.

Reason:

- this contradiction is cross-cutting and touches actor authority, flow ownership, audit policy, and admin surface scope
- implementing blindly risks building authority that product governance may not want live yet
- narrowing blindly risks erasing a genuinely intended governance responsibility

## Acceptance Criteria

One of the following must become true:

- admin-console supports real order-governance and dispute-governance mutations with audit coverage, or
- binding governance clearly states those actions are not part of the current runtime obligation

In either case:

- `FLOW.md`
- `IDENTITY.md`
- admin runtime-truth docs
- admin UI behavior

must all describe the same capability level.

## Current Conclusion

This finding is resolved in docs.

Resolution evidence:

- `docs/governance/ADMIN_GOVERNANCE_SCOPE_DECISION_2026-04.md`
- `docs/governance/FLOW.md`
- `docs/governance/IDENTITY.md`
- `docs/runtime-truth/admin-orders-truth.md`
- `docs/runtime-truth/admin-disputes-truth.md`
- `docs/flows/admin-orders-flow.md`
- `docs/flows/admin-disputes-flow.md`

The chosen resolution was governance narrowing to current deferred scope rather than immediate admin write implementation.
