# Customer Auth Onboarding Flow

Status: active
Authority: operational
Surface: customer-app
Domains: auth, guest, onboarding, session
Last updated: 2026-03-16
Last verified: 2026-03-16
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
- Redirect path:
  - `/` or `/entry` -> router redirect based on `CustomerSessionController.status`

## Source-of-truth files involved

- [customer_session_controller.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/session/customer_session_controller.dart)
  - auth status
  - phone number
  - guest vs authenticated vs onboarding state
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
  - router guard and redirect decisions in `AppRouter`
- Derived:
  - which screen appears first after launch
  - whether the user is pushed to otp, onboarding, or home
- Not authoritative:
  - auth screen button layout or marketing copy

## Known shallow / partial / local-only limits

- Session truth is local-memory only through `MemoryCustomerSessionStore`.
- Phone auth and OTP are local/demo-safe flows, not backend verification.
- Onboarding completion changes local session state only.
- Social sign-in actions are intentionally unavailable.

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
