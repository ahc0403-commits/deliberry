# Admin Auth Flow

Status: Active
Authority: Operational
Surface: admin-console
Domains: auth, session, platform-entry
Last updated: 2026-04-24
Retrieve when:
- changing admin login, sign-out, or initial route entry behavior
- debugging why admin session cookies and visible route access do not match
- checking whether auth is route-real or only structurally present
Related files:
- admin-console/src/app/(auth)/login/page.tsx
- admin-console/src/features/auth/server/auth-actions.ts
- admin-console/src/shared/auth/admin-session.ts

## Purpose

Describe the real current admin auth path from login entry into the platform shell, including the current runtime enforcement points.

## Entry Points

- `admin-console/src/app/page.tsx`
- `admin-console/src/app/(auth)/login/page.tsx`
- `admin-console/src/app/(platform)/layout.tsx`

## Main Route Sequence

- `/` -> redirect to `/login`
- `/login` -> render `AdminLoginScreen`
- `signInAdminAction()` -> validate Supabase Auth credentials, load `actor_profiles` and `admin_profiles`, write `ADMIN_SESSION_COOKIE`, clear `ADMIN_ROLE_COOKIE`, redirect to `/access-boundary`
- `/access-boundary` -> requires session, renders role selection when role is unresolved, redirects to the role home route when the role is already valid
- protected platform route -> middleware and platform layout both require session and valid role before render
- `signOutAdminAction()` from the platform shell -> clear cookies -> redirect to `/login`

## Source-of-Truth Files Involved

- `admin-console/src/shared/auth/admin-session.ts`
- `admin-console/src/features/auth/server/auth-actions.ts`
- `admin-console/src/app/(platform)/layout.tsx`
- `admin-console/src/features/auth/server/access.ts`
- `admin-console/middleware.ts`

## Key Dependent Screens and Files

- `admin-console/src/features/auth/presentation/login-screen.tsx`
- `admin-console/src/app/(auth)/layout.tsx`
- `admin-console/src/app/(platform)/access-boundary/page.tsx`
- `admin-console/src/features/permissions/presentation/access-boundary-screen.tsx`

## What Is Authoritative vs Derived In This Flow

- Authoritative:
  - Supabase Auth password validation
  - `public.actor_profiles.actor_type = 'admin'`
  - `public.admin_profiles.role`
  - session cookie value written by `signInAdminAction()`
  - session cookie deletion in `signOutAdminAction()`
  - redirect targets inside auth actions
- Derived:
  - login form defaults and copy
  - any assumption that platform routes are protected because a sign-out button exists
  - any “signed-in” state implied only by layout presence

## Known Shallow, Partial, Fixture-Backed, or Local-Only Limits

- Local seed includes `admin@deliberry.local / admin1234` for smoke tests only.
- Session truth is Supabase-authenticated, cookie-real, and route-enforced.
- Production admin accounts still need to be provisioned in Supabase/Auth and `admin_profiles` outside the local seed path.

## Common Edit Mistakes

- Changing redirect targets in UI copy instead of in `auth-actions.ts`.
- Changing layout or middleware behavior without keeping the shared admin access rules aligned.

## Related Filemaps

- `docs/filemaps/admin-auth-filemap.md`
- `docs/filemaps/admin-permissions-filemap.md`

## Related Runtime-Truth Docs

- `docs/runtime-truth/admin-auth-session-truth.md`
- `docs/runtime-truth/admin-permissions-truth.md`

## Related Governance Docs

- `docs/02-surface-ownership.md`
- `docs/03-navigation-ia.md`
- `docs/05-implementation-phases.md`
- `docs/08-auth-session-strategy.md`
- `shared/docs/architecture-boundaries.md`
