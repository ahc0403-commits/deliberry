# Merchant Auth Onboarding Flow

Status: Active
Authority: Operational
Surface: merchant-console
Domains: auth, onboarding, entry, redirects
Last updated: 2026-03-16
Retrieve when:
- changing merchant login, onboarding, or initial console entry behavior
- debugging redirects between `/login`, `/onboarding`, and `/select-store`
- checking whether the auth/onboarding handoff is route-real or only presentational
Related files:
- merchant-console/src/app/(auth)/login/page.tsx
- merchant-console/src/app/(auth)/onboarding/page.tsx
- merchant-console/src/features/auth/server/access.ts
- merchant-console/src/features/auth/server/auth-actions.ts

## Purpose

Describe the real current merchant entry flow from login into onboarding and then toward store selection.

## Entry Points

- `merchant-console/src/app/(auth)/login/page.tsx`
- `merchant-console/src/app/(auth)/onboarding/page.tsx`
- guarded merchant console routes under `merchant-console/src/app/(console)/`

## Main Route Sequence

- `/login` -> `redirectMerchantIfSessionExists()` decides whether to stay on login or redirect onward
- `signInMerchantAction()` -> `/onboarding`
- `/onboarding` -> if no session, redirect to `/login`
- `/onboarding` -> if onboarding already complete and selected store exists, redirect to `/${storeId}/dashboard`
- `/onboarding` -> if onboarding already complete and no selected store exists, redirect to `/select-store`
- `completeMerchantOnboardingAction()` -> `/select-store`

## Source-of-Truth Files Involved

- `merchant-console/src/shared/auth/merchant-session.ts`
- `merchant-console/src/features/auth/server/access.ts`
- `merchant-console/src/features/auth/server/auth-actions.ts`

## Key Dependent Screens and Files

- `merchant-console/src/features/auth/presentation/login-screen.tsx`
- `merchant-console/src/features/onboarding/presentation/onboarding-screen.tsx`
- `merchant-console/src/app/(console)/layout.tsx`
- `merchant-console/src/app/(console)/select-store/page.tsx`

## What Is Authoritative vs Derived In This Flow

- Authoritative:
  - session and onboarding cookie values
  - redirect decisions in auth access helpers
  - cookie writes in server actions
- Derived:
  - `readMerchantAccessState()` aggregate object
  - visible login and onboarding copy
  - any screen-level implication that credentials or onboarding steps are validated externally

## Known Shallow, Partial, Fixture-Backed, or Local-Only Limits

- Login is demo-safe only; credentials are not validated.
- Merchant identity is hardcoded during sign-in.
- Onboarding completion is only a cookie flag.
- The flow is route-real and coherent, but it is not backed by a real auth provider or merchant verification process.

## Common Edit Mistakes

- Changing login or onboarding copy without checking redirect semantics.
- Editing redirect targets in pages while leaving `access.ts` and `auth-actions.ts` unchanged.
- Treating the login screen as the truth owner instead of the cookie/session layer.

## Related Filemaps

- `docs/filemaps/merchant-auth-filemap.md`
- `docs/filemaps/merchant-store-selection-filemap.md`

## Related Runtime-Truth Docs

- `docs/runtime-truth/merchant-auth-session-truth.md`
- `docs/runtime-truth/merchant-store-selection-truth.md`

## Related Governance Docs

- `docs/02-surface-ownership.md`
- `docs/03-navigation-ia.md`
- `docs/05-implementation-phases.md`
- `docs/08-auth-session-strategy.md`
- `shared/docs/architecture-boundaries.md`
