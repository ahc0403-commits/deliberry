# Admin Auth Session Truth

Status: Active
Authority: Operational
Surface: admin-console
Domains: auth, session, platform-entry
Last updated: 2026-03-17
Retrieve when:
- changing admin login or sign-out behavior
- checking where admin session state is actually stored
- debugging why admin cookies exist without route enforcement
Related files:
- admin-console/src/shared/auth/admin-session.ts
- admin-console/src/features/auth/server/auth-actions.ts
- admin-console/src/app/(platform)/layout.tsx
- admin-console/src/features/auth/server/access.ts
- admin-console/middleware.ts

## Purpose

Identify where admin session truth actually lives today and how it is enforced at the admin platform boundary.

## Real Source-of-Truth Locations

- Session cookie definitions and reads: `admin-console/src/shared/auth/admin-session.ts`
- Session writes and auth redirects: `admin-console/src/features/auth/server/auth-actions.ts`
- Session-aware platform guard: `admin-console/src/features/auth/server/access.ts`
- Request-entry enforcement: `admin-console/middleware.ts`

## What State Is Owned There

- `ADMIN_SESSION_COOKIE`
- serialized `adminId`, `adminName`, `actorType`, and mirrored role value
- sign-in redirect to `/access-boundary`
- sign-out redirect to `/login`
- protected platform-route session requirement

## What Screens and Routes Depend on It

- `admin-console/src/app/(auth)/login/page.tsx`
- `admin-console/src/features/auth/presentation/login-screen.tsx`
- `admin-console/src/app/(platform)/layout.tsx`
- `admin-console/src/app/(platform)/access-boundary/page.tsx`
- protected routes under `admin-console/src/app/(platform)/`

## What Is Authoritative vs Derived

- Authoritative:
  - cookie value returned by `readAdminSession()`
  - session writes in `signInAdminAction()`
  - session-role sync performed in `setAdminRoleAction()`
  - session deletion in `signOutAdminAction()`
  - guard redirects in `ensureAdminPlatformAccess()`
  - middleware redirects for missing session on protected routes
- Derived:
  - login UI copy and field defaults
  - any visible “signed in” feeling created by the shell itself

## What Is Still Shallow, Partial, Fixture-Backed, or Local-Only

- Auth is demo-safe only.
- Credentials are not validated against a real provider.
- Admin identity is hardcoded during sign-in.
- Session truth is enforced at runtime and now carries actor attribution fields in the cookie, but it is still only cookie-backed and demo-safe.

## Known Risks

- Changing the cookie shape or key will silently break future enforcement work.
- Middleware and layout guards can drift if they stop reading the same admin-local access rules.

## Safe Modification Guidance

- Change cookie semantics in `admin-session.ts` before changing sign-in or sign-out actions.
- Change `auth-actions.ts` and `access.ts` together before changing any routing expectations.
- Keep `admin-console/middleware.ts` aligned with the same admin-local access helpers used by the platform layout.

## Related Filemaps

- `docs/filemaps/admin-auth-filemap.md`
- `docs/filemaps/admin-permissions-filemap.md`

## Related Governance Docs

- `docs/02-surface-ownership.md`
- `docs/03-navigation-ia.md`
- `docs/05-implementation-phases.md`
- `docs/08-auth-session-strategy.md`
- `shared/docs/architecture-boundaries.md`
