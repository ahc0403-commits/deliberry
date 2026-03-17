# Merchant Auth Filemap

Status: Active
Authority: Operational
Surface: merchant-console
Domains: auth, session, onboarding, access-boundary
Last updated: 2026-03-16
Retrieve when:
- changing merchant login, sign-out, or onboarding redirects
- debugging why a merchant route redirects to login, onboarding, or store selection
- checking where merchant session truth is written and read
Related files:
- merchant-console/src/shared/auth/merchant-session.ts
- merchant-console/src/features/auth/server/access.ts
- merchant-console/src/features/auth/server/auth-actions.ts

## Purpose

Shows the smallest file cluster for merchant auth, cookie session state, and onboarding access control.

## When To Retrieve This Filemap

- before changing any merchant auth redirect
- before changing session cookie shape or selected-store handoff
- when a merchant route renders but should redirect

## Entry Files

- `merchant-console/src/app/(auth)/login/page.tsx`
- `merchant-console/src/app/(auth)/onboarding/page.tsx`
- `merchant-console/src/app/(auth)/layout.tsx`
- `merchant-console/src/app/(console)/layout.tsx`

## Adjacent Files Usually Read Together

- `merchant-console/src/features/auth/presentation/login-screen.tsx`
- `merchant-console/src/features/onboarding/presentation/onboarding-screen.tsx`
- `merchant-console/src/app/(console)/select-store/page.tsx`
- `merchant-console/src/app/(console)/[storeId]/layout.tsx`

## Source-of-Truth Files

- `merchant-console/src/shared/auth/merchant-session.ts`
- `merchant-console/src/features/auth/server/access.ts`
- `merchant-console/src/features/auth/server/auth-actions.ts`

The source of truth is split: cookie/session reads live in `merchant-session.ts`, while redirect policy and write paths live in `access.ts` and `auth-actions.ts`.

## Files Often Mistaken as Source of Truth but Are Not

- `merchant-console/src/features/auth/presentation/login-screen.tsx`
- `merchant-console/src/features/onboarding/presentation/onboarding-screen.tsx`
- `merchant-console/src/features/auth/state/auth-placeholder-state.ts`

These files describe or render auth UI, but they do not own session truth.

## High-Risk Edit Points

- Cookie names and parsing in `merchant-console/src/shared/auth/merchant-session.ts`
- Redirect decisions in `merchant-console/src/features/auth/server/access.ts`
- Cookie writes and redirect targets in `merchant-console/src/features/auth/server/auth-actions.ts`
- Layout-level guards in `merchant-console/src/app/(console)/layout.tsx`
- Store-scope enforcement in `merchant-console/src/app/(console)/[storeId]/layout.tsx`

## Related Governance Docs

- `docs/02-surface-ownership.md`
- `docs/03-navigation-ia.md`
- `docs/05-implementation-phases.md`
- `docs/08-auth-session-strategy.md`
- `shared/docs/architecture-boundaries.md`

## Related Local Feature READMEs

- `merchant-console/src/features/auth/README.md`
- `merchant-console/src/features/store-selection/README.md`

## Safe Edit Sequence

1. Read `merchant-session.ts` to confirm current cookie truth.
2. Read `access.ts` to confirm redirect expectations.
3. Update `auth-actions.ts` if write behavior must change.
4. Verify affected route pages and layouts still use the same guard path.
5. Only then adjust presentation files if the UI needs to match new behavior.
