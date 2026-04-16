# Admin Identity Reconciliation -- 2026-04

> **Classification: Supporting Operational Artifact** -- This is NOT a canonical governance document.
> This file records the resolved admin identity model after the April 2026 audit.

Status: active
Authority: operational (supporting artifact)
Surface: cross-surface
Domains: identity, admin-auth, taxonomy-reconciliation
Last updated: 2026-04-15
Last verified: 2026-04-15
Retrieve when:
- reconciling admin actor taxonomy across docs, schema, and runtime code
- deciding how `actor_type` and `role` should be interpreted for admin identities
Related files:
- docs/governance/IDENTITY.md
- docs/governance/CONSTITUTION.md
- docs/governance/DOMAIN_MAPPING_MATRIX.md
- shared/constants/domain.constants.ts
- admin-console/src/shared/auth/admin-session.ts
- supabase/migrations/20260317150000_phase_1_runtime_foundation.sql

## Decision

The canonical admin identity model is:

- `actor_type = admin`
- `role in PERMISSION_ROLES`

This decision applies to:

- governance interpretation
- shared constants
- runtime session payloads
- audit-log interpretation
- database schema alignment

## Rejected Option

Rejected option:

- role-specific admin actor types such as `support_admin`, `finance_admin`, `operations_admin`, `marketing_admin`, `platform_admin`

Reason for rejection:

- current shared constants, runtime code, and database schema already converge on generic `admin`
- admin access enforcement is already role-driven rather than actor-type-driven
- converting storage and audit schema to role-specific actor types would create broader migration and compatibility risk than updating the binding docs to match the existing stable model

## Interpretation Rule

When a document discusses admin capability, it must distinguish between:

- runtime actor type: `admin`
- permission scope: `role`

Examples:

- correct: `actor_type = admin`, `role = support_admin`
- correct: `actor_type = admin`, `role = platform_admin`
- incorrect: treating `support_admin` itself as the persisted `actor_type`

## Required Follow-Through

1. Binding identity docs must describe admin roles as role values under the generic admin actor.
2. Supporting governance docs must stop describing admin roles as separate persisted actor types.
3. Audit semantics must be reviewed using `actor_type + role` together.

## Rollback Position

If this reconciliation introduces unacceptable governance confusion, rollback is to:

- preserve current code and schema behavior
- narrow the reconciliation note
- reopen the identity decision explicitly before any schema rewrite

