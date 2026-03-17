# Merchant Auth

Status: Active
Authority: Operational
Surface: merchant-console
Domains: auth, session, onboarding-handoff, access-boundary
Last updated: 2026-03-16
Retrieve when:
- editing merchant login, onboarding handoff, or sign-out behavior
- changing store-scoped access guards or redirect logic
- checking whether merchant session truth lives in cookies, UI, or routes
Related files:
- merchant-console/src/app/(auth)/login/page.tsx
- merchant-console/src/app/(auth)/onboarding/page.tsx
- merchant-console/src/app/(auth)/layout.tsx
- merchant-console/src/features/auth/presentation/login-screen.tsx
- merchant-console/src/features/auth/server/auth-actions.ts
- merchant-console/src/features/auth/server/access.ts
- merchant-console/src/shared/auth/merchant-session.ts
- merchant-console/src/features/onboarding/presentation/onboarding-screen.tsx

## Purpose

Owns merchant login, onboarding gating, sign-out, and route access control for the merchant surface.

## Primary Routes and Screens

- `/(auth)/login` -> `merchant-console/src/app/(auth)/login/page.tsx`
- `/(auth)/onboarding` -> `merchant-console/src/app/(auth)/onboarding/page.tsx`
- Login screen -> `merchant-console/src/features/auth/presentation/login-screen.tsx`
- Onboarding continuation screen depends on `merchant-console/src/features/onboarding/presentation/onboarding-screen.tsx`

## Source of Truth

- Session and access cookies: `merchant-console/src/shared/auth/merchant-session.ts`
- Sign-in, onboarding-complete, and sign-out writes: `merchant-console/src/features/auth/server/auth-actions.ts`
- Redirect and access boundary rules: `merchant-console/src/features/auth/server/access.ts`

The authoritative truth is server-side cookie state plus redirect logic. The login screen itself is presentation-only.

## Key Files to Read First

- `merchant-console/src/shared/auth/merchant-session.ts`
- `merchant-console/src/features/auth/server/access.ts`
- `merchant-console/src/features/auth/server/auth-actions.ts`
- `merchant-console/src/features/auth/presentation/login-screen.tsx`
- `merchant-console/src/app/(auth)/login/page.tsx`
- `merchant-console/src/app/(auth)/onboarding/page.tsx`

## Related Shared and Domain Files

- `merchant-console/src/shared/domain.ts`
- `merchant-console/src/features/auth/state/auth-placeholder-state.ts`
- `merchant-console/src/features/onboarding/state/onboarding-placeholder-state.ts`

## Related Governance Docs

- `docs/02-surface-ownership.md`
- `docs/03-navigation-ia.md`
- `docs/05-implementation-phases.md`
- `docs/08-auth-session-strategy.md`
- `docs/governance/FLOW.md`
- `shared/docs/architecture-boundaries.md`

## Known Limitations

- Auth is demo-safe cookie orchestration only.
- Credentials are not validated against a real provider.
- Onboarding completion is a cookie flag, not a verified business process.
- Store-selection continuity depends on a selected-store cookie, not a backend merchant/store relationship.

## Safe Modification Guidance

- Edit session semantics in `merchant-session.ts` first.
- Edit redirects and guard behavior in `access.ts` before touching route pages.
- Keep server actions as the only place that mutates auth cookies.

## What Not to Change Casually

- Do not move session truth into client state.
- Do not bypass redirect helpers from route pages or layouts.
- Do not make the login screen appear more real than the current demo-safe session behavior supports.
