# Customer Auth Onboarding Flow

Status: active
Authority: operational
Surface: customer-app
Domains: auth, guest, onboarding, session
Last updated: 2026-05-06
Last verified: 2026-05-06
Retrieve when:
- changing signed-out entry, phone auth, guest entry, or onboarding handoff
- debugging why a user lands on the wrong auth/onboarding route
Related files:
- customer-app/lib/app/router/app_router.dart
- customer-app/lib/core/session/customer_session_controller.dart
- docs/ui-governance/NAVIGATION_TRUTH_MAP.md

## Purpose

Document the real current auth, guest, and onboarding route flow in the customer app.

## Entry points

- app launch into `/` or `/entry`
- explicit auth entry from `CustomerEntryScreen`
- guest branch from `AuthScreen`
- otp-pending or onboarding-required redirects handled by `AppRouter`

## Main route sequence

- Signed-out phone path:
  - `/entry` -> `/auth/login` -> `/auth/phone` -> `/auth/otp` -> `/onboarding` -> `/home`
- Guest path:
  - `/entry` -> `/auth/login` -> `/guest` -> `/home`
- Social callback path:
  - provider launch -> normalized callback detection -> `CustomerSessionController.handleAuthCallback(...)` -> onboarding/home redirect
- Redirect path:
  - `/` or `/entry` -> router redirect based on `CustomerSessionController.status`

## Source-of-truth files involved

- [customer_session_controller.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/session/customer_session_controller.dart)
  - auth status
  - phone number
  - guest vs authenticated vs onboarding state
  - normalized callback completion consumption
  - sole session adoption ownership
- [app_router.dart](/Users/andremacmini/Deliberry/customer-app/lib/app/router/app_router.dart)
  - redirect and guard logic for auth/onboarding routes

## Key dependent screens/files

- [customer_entry_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/app/entry/customer_entry_screen.dart)
- [auth_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/auth/presentation/auth_screen.dart)
- [auth_phone_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/auth/presentation/auth_phone_screen.dart)
- [auth_otp_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/auth/presentation/auth_otp_screen.dart)
- [guest_entry_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/auth/presentation/guest_entry_screen.dart)
- [onboarding_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/onboarding/presentation/onboarding_screen.dart)

## What is authoritative vs derived in this flow

- Authoritative:
  - `CustomerSessionController.status`
  - normalized callback detector in `customer_auth_adapter.dart`
  - normalized callback completion result returned by provider adapters
  - router guard and redirect decisions in `AppRouter`
- Derived:
  - which screen appears first after launch
  - whether the user is pushed to otp, onboarding, or home
- Not authoritative:
  - auth screen button layout or marketing copy

## Known shallow / partial / local-only limits

- Phone auth and OTP now use Supabase-backed customer session adoption, but end-to-end live verification still depends on the linked project's phone provider/test OTP readiness. As of 2026-04-17, the linked project still reports `phone: false` from `/auth/v1/settings`.
- This is an intentional hold. We are keeping the phone fallback code path ready while deferring hosted SMS provider onboarding until final integration / pre-QA closure.
- Customer-facing auth copy should describe phone sign-in as environment-dependent while that provider-disabled hold remains in place.
- Callback, phone-entry, and OTP surfaces now normalize common auth failure states before rendering them, so provider-disabled, runtime-missing, invalid-code, and callback-adoption failures do not fall through as raw infrastructure strings.
- Onboarding completion changes local session state first, then clears the remote `needs_onboarding` flag best-effort.
- Kakao and Zalo now share one callback detector and one session adoption owner, but provider launch remains adapter-local.
- The approved visible social provider set is now Zalo, Google, and Kakao. Apple is held out of the customer UI until there is an explicit product decision to absorb Apple Developer paid enrollment.
- Final auth UI copy cleanup is not part of this callback architecture refactor.

## Common edit mistakes

- Changing auth screen behavior without checking router redirects.
- Treating widget-local input state as the real auth truth instead of `CustomerSessionController`.
- Forgetting the guest path when tightening auth-only routes.
- Bypassing onboarding-required routing rules.

## Related filemaps

- [customer-runtime-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/customer-runtime-filemap.md)

## Related runtime-truth docs

- [customer-runtime-truth.md](/Users/andremacmini/Deliberry/docs/runtime-truth/customer-runtime-truth.md)

## Related governance docs

- [NAVIGATION_TRUTH_MAP.md](/Users/andremacmini/Deliberry/docs/ui-governance/NAVIGATION_TRUTH_MAP.md)
- [RUNTIME_REALITY_MAP.md](/Users/andremacmini/Deliberry/docs/ui-governance/RUNTIME_REALITY_MAP.md)
- [STABILIZATION_REPORT.md](/Users/andremacmini/Deliberry/docs/ui-governance/STABILIZATION_REPORT.md)
