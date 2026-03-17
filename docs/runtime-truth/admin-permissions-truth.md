# Admin Permissions Truth

Status: Active
Authority: Operational
Surface: admin-console
Domains: permissions, role-selection, access-boundary
Last updated: 2026-03-17
Retrieve when:
- changing admin role selection or access-boundary behavior
- checking where admin role state is actually stored
- debugging why role selection does not affect platform access
Related files:
- admin-console/src/shared/auth/admin-session.ts
- admin-console/src/features/permissions/server/permission-actions.ts
- admin-console/src/features/permissions/presentation/access-boundary-screen.tsx
- admin-console/src/shared/auth/admin-access.ts
- admin-console/src/features/auth/server/access.ts
- admin-console/middleware.ts

## Purpose

Identify where admin role-selection truth lives today and how it is enforced at route entry.

## Real Source-of-Truth Locations

- Role cookie definition and reads: `admin-console/src/shared/auth/admin-session.ts`
- Role cookie write and redirect: `admin-console/src/features/permissions/server/permission-actions.ts`
- Role validation and route matrix: `admin-console/src/shared/auth/admin-access.ts`
- Platform-route guard: `admin-console/src/features/auth/server/access.ts`
- Request-entry enforcement: `admin-console/middleware.ts`

## What State Is Owned There

- `ADMIN_ROLE_COOKIE`
- selected admin role value
- mirrored session role value inside `ADMIN_SESSION_COOKIE`
- validated redirect from role selection to the role-allowed home route
- route-allowance checks for protected admin paths

## What Screens and Routes Depend on It

- `admin-console/src/app/(platform)/access-boundary/page.tsx`
- `admin-console/src/features/permissions/presentation/access-boundary-screen.tsx`
- protected routes under `admin-console/src/app/(platform)/`

## What Is Authoritative vs Derived

- Authoritative:
  - role value returned by `readAdminRole()`
  - role value written by `setAdminRoleAction()`
  - mirrored role value written back into `ADMIN_SESSION_COOKIE` by `setAdminRoleAction()`
  - role validation against the canonical admin role list
  - role-route checks in the admin-local access layer
- Derived:
  - role titles, icons, and descriptions shown in the access-boundary screen
  - placeholder-state descriptions
  - the unfiltered platform navigation set

## What Is Still Shallow, Partial, Fixture-Backed, or Local-Only

- Role selection is demo-safe only.
- Roles are stored in a cookie and enforced at route entry, but not against any live IAM provider.
- The role boundary is runtime-real for route access, but still shallow compared with a full permission system.
- The access-boundary route now uses sign-out as the truthful account-exit path instead of a broken loop back to `/login`.

## Known Risks

- Future route and nav filtering can diverge from cookie semantics if the role list changes casually.
- Shell badge counts are now derived from fixture-backed route datasets, so they remain internally aligned but not backend-real.

## Safe Modification Guidance

- Change role values in `admin-session.ts` and `permission-actions.ts` together.
- Keep `admin-access.ts`, `permission-actions.ts`, `access.ts`, and `middleware.ts` aligned from the same role source first.
- Keep shell nav filtering wired from the same route matrix instead of inventing a second permission map.

## Related Filemaps

- `docs/filemaps/admin-permissions-filemap.md`
- `docs/filemaps/admin-auth-filemap.md`

## Related Governance Docs

- `docs/02-surface-ownership.md`
- `docs/03-navigation-ia.md`
- `docs/05-implementation-phases.md`
- `docs/08-auth-session-strategy.md`
- `shared/docs/architecture-boundaries.md`
