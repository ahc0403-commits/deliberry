# Admin Permissions

Status: Active
Authority: Operational
Surface: admin-console
Domains: permissions, role-boundary, access-boundary
Last updated: 2026-03-17
Retrieve when:
- editing admin role selection or access-boundary behavior
- checking where the selected admin role is stored
- verifying whether permissions are enforced or only presented structurally
Related files:
- admin-console/src/app/(platform)/access-boundary/page.tsx
- admin-console/src/features/permissions/presentation/access-boundary-screen.tsx
- admin-console/src/features/permissions/server/permission-actions.ts
- admin-console/src/shared/auth/admin-session.ts
- admin-console/src/shared/auth/admin-access.ts
- admin-console/src/features/auth/server/access.ts
- admin-console/middleware.ts

## Purpose

Owns the admin role-selection boundary and the current admin role cookie write path.

## Primary Routes and Screens

- `/(platform)/access-boundary` -> `admin-console/src/app/(platform)/access-boundary/page.tsx`
- Access-boundary screen -> `admin-console/src/features/permissions/presentation/access-boundary-screen.tsx`

## Source of Truth

- Role cookie definition and reads: `admin-console/src/shared/auth/admin-session.ts`
- Role write path: `admin-console/src/features/permissions/server/permission-actions.ts`

This source of truth is split: role cookies live in the admin session layer, role validation and route rules live in the admin-local access helpers, and the access-boundary screen remains the role-selection surface over that state.

## Key Files to Read First

- `admin-console/src/shared/auth/admin-session.ts`
- `admin-console/src/shared/auth/admin-access.ts`
- `admin-console/src/features/permissions/server/permission-actions.ts`
- `admin-console/src/features/auth/server/access.ts`
- `admin-console/src/features/permissions/presentation/access-boundary-screen.tsx`
- `admin-console/src/app/(platform)/access-boundary/page.tsx`
- `admin-console/middleware.ts`

## Related Shared and Domain Files

- `admin-console/src/shared/domain.ts`
- `admin-console/src/features/permissions/state/permissions-placeholder-state.ts`

## Related Governance Docs

- `docs/02-surface-ownership.md`
- `docs/03-navigation-ia.md`
- `docs/05-implementation-phases.md`
- `docs/08-auth-session-strategy.md`
- `shared/docs/architecture-boundaries.md`

## Known Limitations

- Role selection is demo-safe only.
- `setAdminRoleAction` now validates submitted role values against the canonical admin role list before writing the cookie.
- Protected platform routes are now blocked at runtime when the session is missing, the role is missing or invalid, or the role does not allow the route.
- The platform shell now filters navigation links by role, but the displayed counts are still fixture-backed summaries rather than live backend metrics.

## Safe Modification Guidance

- Change role semantics in `admin-session.ts` and `permission-actions.ts` together.
- Keep `admin-access.ts`, `permission-actions.ts`, `access.ts`, and `middleware.ts` aligned from the same role model.
- Treat role-card copy as descriptive of the current route gate, not of hidden future capabilities.

## What Not to Change Casually

- Do not drift role values away from the canonical `PERMISSION_ROLES` list.
- Do not bypass `admin-console/src/shared/domain.ts` for repo-level shared imports.
- Do not scatter route permission checks into individual screens when the platform boundary already owns them.
