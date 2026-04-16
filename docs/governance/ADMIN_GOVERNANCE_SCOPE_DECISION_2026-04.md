# Admin Governance Scope Decision -- 2026-04

> **Classification: Supporting Operational Artifact** -- This is NOT a canonical governance document.
> This file records the approved direction for the admin governance capability contradiction found in the 2026-04-16 re-audit.

Status: active
Authority: operational (supporting artifact)
Surface: admin-console
Domains: admin-governance, orders, disputes, scope-reconciliation
Last updated: 2026-04-16
Last verified: 2026-04-16
Retrieve when:
- deciding whether admin order/dispute mutation authority is current-state or future-state
- reconciling binding governance with read-only admin runtime
- planning any future admin order/dispute write implementation
Related files:
- docs/governance/FLOW.md
- docs/governance/IDENTITY.md
- docs/governance/ADMIN_GOVERNANCE_CAPABILITY_AUDIT_2026-04-16.md
- docs/governance/REAUDIT_REMEDIATION_PLAN_2026-04-16.md
- docs/runtime-truth/admin-orders-truth.md
- docs/runtime-truth/admin-disputes-truth.md

## Decision

The approved direction is:

- treat admin order/dispute mutation authority as future-state deferred scope
- narrow the binding governance chain so it no longer implies that the current admin runtime already implements those mutations

This means the current admin-console remains:

- runtime-real for governed read visibility
- not yet runtime-real for order override/cancel writes
- not yet runtime-real for dispute progression writes

## Reason

This direction was chosen because:

- the currently verified admin surface is explicitly read-only across orders and disputes
- no live admin mutation path or admin-authorized dispute workflow was found in runtime code or migrations
- implementing those writes correctly would require new owner paths, RBAC checks, audit coverage, and UI workflow design
- the contradiction is best resolved first by making the binding governance accurately describe current runtime obligations

## Rejected Direction

Rejected direction:

- immediately treat admin order/dispute writes as current-state required scope and implement them in this remediation slice

Reason for rejection:

- that path is materially larger than a documentation reconciliation
- it would introduce new governed mutation surfaces without prior scope hardening or dedicated implementation design
- no evidence showed that this functionality was intentionally omitted only by accident rather than deferred by phase

## Interpretation Rule

Until a later implementation decision supersedes this one:

- admin read authority remains current-state
- admin order/dispute mutation authority is deferred
- supporting docs must not describe the current admin-console as if those writes already exist

## Required Follow-Through

1. Amend `docs/governance/FLOW.md` so admin order/dispute mutation authority is described as deferred where appropriate.
2. Amend `docs/governance/IDENTITY.md` so the actor-action matrix does not overstate live admin capability.
3. Reconcile supporting runtime-truth and flow docs so they match the deferred model.
4. If admin mutation work is later prioritized, create a dedicated implementation design before code changes begin.

## Rollback Position

If governance later decides these admin mutations are required immediately, rollback is to:

- reopen the deferred-scope decision
- restore broader binding capability language
- launch a dedicated implementation track for admin order/dispute writes

## Current Conclusion

The decision gate for admin governance scope is now closed.

Documentation reconciliation is still pending.
