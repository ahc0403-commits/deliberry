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
  - `merchant-console/src/shared/auth/merchant-session.ts` access-state composition
  - redirect decisions in auth access helpers
  - session and onboarding writes in server actions / auth adapter
- Derived:
  - `readMerchantAccessState()` aggregate object
  - visible login and onboarding copy
  - any screen-level implication that credentials or onboarding steps are validated externally

## Known Shallow, Partial, Fixture-Backed, or Local-Only Limits

- Under `demo-cookie` authority, login is demo-safe only; credentials are not validated and merchant identity is seeded locally.
- Under `supabase` authority, merchant sign-in is real Supabase password auth and onboarding completion persists to `public.merchant_profiles.onboarding_complete`.
- Neither authority path represents a verified merchant approval or business-review workflow yet.
- The flow is route-real and coherent, but public merchant acquisition still happens separately through the manual `/merchant` handoff route on `public-website`.

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
