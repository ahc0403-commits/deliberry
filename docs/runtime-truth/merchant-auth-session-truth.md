# Merchant Auth Session Truth

Status: Active
Authority: Operational
Surface: merchant-console
Domains: auth, session, onboarding, access-boundary
Last updated: 2026-04-15
Retrieve when:
- changing merchant login, onboarding, or sign-out behavior
- debugging merchant auth redirects or unexpected session loss
- checking where merchant auth state is actually stored
Related files:
- merchant-console/src/shared/auth/merchant-session.ts
- merchant-console/src/features/auth/server/access.ts
- merchant-console/src/features/auth/server/auth-actions.ts

## Purpose

Identify where merchant auth and onboarding access truth actually lives today.

## Real Source-of-Truth Locations

- Cookie/session reads: `merchant-console/src/shared/auth/merchant-session.ts`
- Auth and onboarding writes: `merchant-console/src/features/auth/server/auth-actions.ts`
- Redirect and guard policy: `merchant-console/src/features/auth/server/access.ts`

## What State Is Owned There

- `MERCHANT_SESSION_COOKIE`: serialized `merchantId`, `merchantName`, and `actorType`
- `MERCHANT_ONBOARDING_COOKIE`: onboarding completion flag
- Redirect state derived from `session`, `onboardingComplete`, and `selectedStoreId`

## What Screens and Routes Depend on It

- `merchant-console/src/app/(auth)/login/page.tsx`
- `merchant-console/src/app/(auth)/onboarding/page.tsx`
- `merchant-console/src/app/(console)/layout.tsx`
- `merchant-console/src/app/(console)/select-store/page.tsx`
- `merchant-console/src/app/(console)/[storeId]/layout.tsx`
- `merchant-console/src/features/auth/presentation/login-screen.tsx`
- `merchant-console/src/features/onboarding/presentation/onboarding-screen.tsx`

## What Is Authoritative vs Derived

- Authoritative:
  - cookie values read by `readMerchantSession`
  - cookie value read by `isMerchantOnboardingComplete`
  - server redirect decisions in `ensureMerchantConsoleAccess`, `ensureMerchantStoreScope`, and `redirectMerchantIfSessionExists`
- Derived:
  - `readMerchantAccessState()` object composed from cookie reads
  - `resolveMerchantAccessPath()` return value
  - any login or onboarding text rendered by presentation components

## What Is Still Shallow, Partial, Fixture-Backed, or Local-Only

- Auth remains demo-safe for sign-in credential flow.
- Merchant identity is still seeded by `signInMerchantAction`.
- Onboarding completion is still represented by a cookie flag, not a verified business workflow.
- Session continuity now supports a Supabase authority branch in `merchant-session.ts`, even though cookie/session orchestration is still the dominant route-level owner.

## Known Risks

- Changing cookie names or shapes will break redirect behavior across the whole merchant surface.
- Presentation screens can make auth look more complete than the actual cookie-only behavior supports.
- Auth and store-selection truth are coupled through redirect logic; changing one without the other can break entry handoff.

## Safe Modification Guidance

- Change session shape and cookie semantics in `merchant-session.ts` first.
- Change redirect rules in `access.ts` second.
- Change cookie write behavior in `auth-actions.ts` third.
- Change presentation files last, after route and cookie behavior are stable.

## Related Filemaps

- `docs/filemaps/merchant-auth-filemap.md`
- `docs/filemaps/merchant-store-selection-filemap.md`

## Related Governance Docs

- `docs/02-surface-ownership.md`
- `docs/03-navigation-ia.md`
- `docs/05-implementation-phases.md`
- `docs/08-auth-session-strategy.md`
- `shared/docs/architecture-boundaries.md`
