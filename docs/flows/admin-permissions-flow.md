# Admin Permissions Flow

Status: Active
Authority: Operational
Surface: admin-console
Domains: permissions, role-selection, access-boundary
Last updated: 2026-03-17
Retrieve when:
- changing admin role selection or access-boundary routing
- debugging why role selection appears to succeed but platform access does not change
- checking whether the current permissions flow is enforced or only structural
Related files:
- admin-console/src/app/(platform)/access-boundary/page.tsx
- admin-console/src/features/permissions/server/permission-actions.ts
- admin-console/src/shared/auth/admin-session.ts

## Purpose

Describe the current admin role-selection path from the access-boundary screen into route-enforced platform access.

## Entry Points

- `admin-console/src/app/(platform)/access-boundary/page.tsx`
- `admin-console/src/features/permissions/presentation/access-boundary-screen.tsx`
- platform routes under `admin-console/src/app/(platform)/`

## Main Route Sequence

- `/access-boundary` -> render `AdminAccessBoundaryScreen`
- user selects a role card -> `setAdminRoleAction()`
- `setAdminRoleAction()` -> validate role -> write `ADMIN_ROLE_COOKIE` -> redirect to the role-allowed home route
- protected platform routes -> middleware and platform layout reject missing, invalid, or unauthorized roles before render

## Source-of-Truth Files Involved

- `admin-console/src/shared/auth/admin-session.ts`
- `admin-console/src/features/permissions/server/permission-actions.ts`
- `admin-console/src/app/(platform)/layout.tsx`
- `admin-console/src/shared/auth/admin-access.ts`
- `admin-console/src/features/auth/server/access.ts`
- `admin-console/middleware.ts`

## Key Dependent Screens and Files

- `admin-console/src/features/permissions/presentation/access-boundary-screen.tsx`
- `admin-console/src/features/permissions/state/permissions-placeholder-state.ts`
- `admin-console/src/app/(platform)/dashboard/page.tsx`
- `admin-console/src/app/(platform)/layout.tsx`
- protected route pages under `admin-console/src/app/(platform)/`

## What Is Authoritative vs Derived In This Flow

- Authoritative:
  - role cookie value written by `setAdminRoleAction()`
  - role cookie value returned by `readAdminRole()`
  - route matrix in `admin-access.ts`
  - redirect target inside `permission-actions.ts`
- Derived:
  - role titles, icons, and descriptions
  - the current platform navigation set

## Known Shallow, Partial, Fixture-Backed, or Local-Only Limits

- Role selection is cookie-real and route-enforced.
- The platform shell does not filter links by role.
- The permission model is still local-only and demo-safe.
- The access-boundary flow is runtime-real for route access, but not a full IAM system.

## Common Edit Mistakes

- Treating role-card copy as if it already matches enforced permissions.
- Changing route access in middleware or layout without updating the shared role matrix first.
- Assuming link visibility and route access are already equivalent.

## Related Filemaps

- `docs/filemaps/admin-permissions-filemap.md`
- `docs/filemaps/admin-auth-filemap.md`

## Related Runtime-Truth Docs

- `docs/runtime-truth/admin-permissions-truth.md`
- `docs/runtime-truth/admin-auth-session-truth.md`

## Related Governance Docs

- `docs/02-surface-ownership.md`
- `docs/03-navigation-ia.md`
- `docs/05-implementation-phases.md`
- `docs/08-auth-session-strategy.md`
- `shared/docs/architecture-boundaries.md`
