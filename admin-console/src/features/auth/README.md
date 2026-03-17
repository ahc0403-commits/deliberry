# Admin Auth

Status: Active
Authority: Operational
Surface: admin-console
Domains: auth, session, platform-entry
Last updated: 2026-03-17
Retrieve when:
- editing admin login or sign-out behavior
- checking where admin session cookies are written or read
- verifying whether admin auth is actually enforced or only structural
Related files:
- admin-console/src/app/(auth)/login/page.tsx
- admin-console/src/features/auth/presentation/login-screen.tsx
- admin-console/src/features/auth/server/auth-actions.ts
- admin-console/src/shared/auth/admin-session.ts
- admin-console/src/app/(platform)/layout.tsx
- admin-console/src/features/auth/server/access.ts
- admin-console/middleware.ts

## Purpose

Owns admin login entry, sign-out, and the current admin session cookie write path.

## Primary Routes and Screens

- `/(auth)/login` -> `admin-console/src/app/(auth)/login/page.tsx`
- Login screen -> `admin-console/src/features/auth/presentation/login-screen.tsx`
- Sign-out action is triggered from `admin-console/src/app/(platform)/layout.tsx`

## Source of Truth

- Session cookie definitions and reads: `admin-console/src/shared/auth/admin-session.ts`
- Sign-in and sign-out writes: `admin-console/src/features/auth/server/auth-actions.ts`

This source of truth is split: cookies are written and read in the auth/session layer, while protected route enforcement now lives in the admin-local access guard used by the platform layout and middleware.

## Key Files to Read First

- `admin-console/src/shared/auth/admin-session.ts`
- `admin-console/src/features/auth/server/auth-actions.ts`
- `admin-console/src/features/auth/server/access.ts`
- `admin-console/src/features/auth/presentation/login-screen.tsx`
- `admin-console/src/app/(auth)/login/page.tsx`
- `admin-console/src/app/(platform)/layout.tsx`
- `admin-console/middleware.ts`

## Related Shared and Domain Files

- `admin-console/src/shared/domain.ts`
- `admin-console/src/features/auth/state/auth-placeholder-state.ts`

## Related Governance Docs

- `docs/02-surface-ownership.md`
- `docs/03-navigation-ia.md`
- `docs/05-implementation-phases.md`
- `docs/08-auth-session-strategy.md`
- `shared/docs/architecture-boundaries.md`

## Known Limitations

- Login is demo-safe only. Credentials are not validated.
- Admin identity is hardcoded in `signInAdminAction`.
- Session presence is now enforced before protected platform routes render.
- Auth remains demo-safe despite the runtime guard because there is still no real provider-backed identity.

## Safe Modification Guidance

- Change cookie semantics in `admin-session.ts` before changing write actions.
- Change `auth-actions.ts` and `access.ts` together before changing any routing expectations.
- Keep middleware and layout enforcement aligned through the same admin-local access helpers.

## What Not to Change Casually

- Do not move session truth into client-only state.
- Do not make the login UI imply real provider-backed auth.
- Do not bypass the admin-local guard layer with ad-hoc checks inside individual platform screens.
