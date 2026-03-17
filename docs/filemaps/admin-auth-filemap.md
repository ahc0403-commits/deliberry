# Admin Auth Filemap

Status: Active
Authority: Operational
Surface: admin-console
Domains: auth, session, platform-entry
Last updated: 2026-03-17
Retrieve when:
- changing admin login or sign-out behavior
- debugging why admin cookies and route enforcement disagree
- checking where admin session state is written and read
Related files:
- admin-console/src/shared/auth/admin-session.ts
- admin-console/src/features/auth/server/auth-actions.ts
- admin-console/src/app/(auth)/login/page.tsx
- admin-console/src/features/auth/server/access.ts
- admin-console/middleware.ts

## Purpose

Show the smallest file cluster for admin login, sign-out, and the current session cookie shape.

## When To Retrieve This Filemap

- before changing admin sign-in or sign-out semantics
- before adding real admin route enforcement
- when session state appears inconsistent with visible route access

## Entry Files

- `admin-console/src/app/(auth)/login/page.tsx`
- `admin-console/src/app/(auth)/layout.tsx`
- `admin-console/src/app/(platform)/layout.tsx`

## Adjacent Files Usually Read Together

- `admin-console/src/features/auth/presentation/login-screen.tsx`
- `admin-console/src/features/auth/server/auth-actions.ts`
- `admin-console/src/features/auth/server/access.ts`
- `admin-console/src/shared/auth/admin-session.ts`
- `admin-console/src/shared/auth/admin-access.ts`
- `admin-console/src/app/page.tsx`
- `admin-console/src/app/(platform)/access-boundary/page.tsx`
- `admin-console/middleware.ts`

## Source-of-Truth Files

- `admin-console/src/shared/auth/admin-session.ts`
- `admin-console/src/features/auth/server/auth-actions.ts`
- `admin-console/src/features/auth/server/access.ts`

The source of truth is split: session cookies are defined and read in `admin-session.ts`, write behavior lives in `auth-actions.ts`, and route enforcement lives in `access.ts` plus `middleware.ts`.

## Files Often Mistaken as Source of Truth but Are Not

- `admin-console/src/features/auth/presentation/login-screen.tsx`
- `admin-console/src/app/(platform)/layout.tsx`
- `admin-console/src/features/auth/state/auth-placeholder-state.ts`

These files render UI or describe the auth boundary, but they do not own session truth.

## High-Risk Edit Points

- `ADMIN_SESSION_COOKIE` shape and parsing in `admin-console/src/shared/auth/admin-session.ts`
- redirect targets in `admin-console/src/features/auth/server/auth-actions.ts`
- guard redirects in `admin-console/src/features/auth/server/access.ts`
- request-entry enforcement in `admin-console/middleware.ts`

## Related Governance Docs

- `docs/02-surface-ownership.md`
- `docs/03-navigation-ia.md`
- `docs/05-implementation-phases.md`
- `docs/08-auth-session-strategy.md`
- `shared/docs/architecture-boundaries.md`

## Related Local Feature READMEs

- `admin-console/src/features/auth/README.md`
- `admin-console/src/features/permissions/README.md`

## Safe Edit Sequence

1. Read `admin-session.ts` to confirm current cookie truth.
2. Read `auth-actions.ts` to confirm current write and redirect behavior.
3. Verify affected route pages and layouts still match the same entry assumptions.
4. Update login UI last, after cookie and redirect behavior is stable.
