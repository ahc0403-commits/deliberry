# Merchant Auth Session Truth

Status: Active
Authority: Operational
Surface: merchant-console
Domains: auth, session, onboarding, access-boundary
Last updated: 2026-05-06
Last verified: 2026-05-06
Retrieve when:
- changing merchant login, onboarding, or sign-out behavior
- debugging merchant auth redirects or unexpected session loss
- checking where merchant auth state is actually stored
Related files:
- merchant-console/src/shared/auth/merchant-session.ts
- merchant-console/src/features/auth/server/access.ts
- merchant-console/src/features/auth/server/auth-actions.ts
- merchant-console/src/shared/auth/supabase-merchant-auth-adapter.ts
- merchant-console/middleware.ts
- docs/operations/merchant-registration-first-use-audit-2026-04-22.md

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
- Supabase-authority onboarding persistence in `public.merchant_profiles.onboarding_complete`

## What Screens and Routes Depend on It

- `merchant-console/src/app/(auth)/login/page.tsx`
- `merchant-console/src/app/(auth)/onboarding/page.tsx`
- `merchant-console/src/app/(console)/layout.tsx`
- `merchant-console/src/app/(console)/select-store/page.tsx`
- `merchant-console/src/app/(console)/[storeId]/layout.tsx`
- `merchant-console/src/features/auth/presentation/login-screen.tsx`
- `merchant-console/src/features/onboarding/presentation/onboarding-screen.tsx`
- merchant first-use path verified on 2026-04-22:
  - `/login`
  - `/onboarding`
  - `/select-store`
  - `/${storeId}/dashboard`

## What Is Authoritative vs Derived

- Authoritative:
  - `readMerchantAccessState()` and related session writes in `merchant-session.ts`
  - Supabase session snapshot and merchant-profile persistence in `supabase-merchant-auth-adapter.ts`
  - server redirect decisions in `ensureMerchantConsoleAccess`, `ensureMerchantStoreScope`, and `redirectMerchantIfSessionExists`
- Derived:
  - `resolveMerchantAccessPath()` return value
  - any login or onboarding text rendered by presentation components

## What Is Still Shallow, Partial, Fixture-Backed, or Local-Only

- Under `demo-cookie` authority, auth remains demo-safe for sign-in credential flow and merchant identity is still locally seeded.
- Under demo-cookie authority, onboarding completion is still represented by a cookie flag. Under Supabase authority, it persists through `public.merchant_profiles.onboarding_complete`. Neither path is a verified business approval workflow yet.
- Session continuity now supports a Supabase authority branch in `merchant-session.ts`; middleware should stay permissive there so cookie-only demo guards do not override the server access helpers.
- Merchant login may still lead into a fixture-backed dashboard after first use; route continuity is real, but first-use operational visibility is not fully live.
- Redirects now carry explicit reasons such as `session_required`, `onboarding_required`, `no_store_selected`, `no_store_membership`, and `store_scope_mismatch` so login, onboarding, and store-selection screens can explain the current access boundary.
- Demo-cookie authority is now surfaced on login, onboarding, and store-selection screens instead of only being implicit in config.

## Known Risks

- Changing cookie names or shapes will break redirect behavior across the whole merchant surface.
- Presentation screens can make auth look more complete than the actual cookie-only behavior supports.
- Auth and store-selection truth are coupled through redirect logic; changing one without the other can break entry handoff.

## Safe Modification Guidance

- Change session shape and cookie semantics in `merchant-session.ts` first.
- Keep `middleware.ts` aligned with the current authority model before changing route-edge behavior.
- Change redirect rules in `access.ts` second.
- Change adapter-backed persistence in `supabase-merchant-auth-adapter.ts` third.
- Change write behavior in `auth-actions.ts` fourth.
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
