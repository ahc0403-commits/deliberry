# Customer Phone Auth Hold — 2026-04-17

Status: active
Authority: operational
Surface: customer-app
Domains: auth, phone-otp, rollout
Last updated: 2026-04-17
Last verified: 2026-04-17
Related files:
- docs/08-auth-session-strategy.md
- docs/flows/customer-auth-onboarding-flow.md
- docs/runtime-truth/customer-runtime-truth.md
- customer-app/lib/core/session/customer_session_controller.dart
- customer-app/lib/features/auth/presentation/auth_phone_screen.dart
- customer-app/lib/features/auth/presentation/auth_otp_screen.dart

## Summary

Customer phone/OTP fallback is now implemented as a Supabase-backed session adoption path in code.

However, Deliberry is intentionally not enabling the hosted phone provider yet.

Current approved state:

- code path: ready
- linked hosted provider: disabled
- reason: external SMS provider onboarding is deferred until final integration / pre-QA closure

## What was completed

- `requestOtp()` now calls Supabase phone OTP dispatch
- `verifyOtp()` now calls Supabase OTP verification and adopts a real authenticated session
- auth screens now surface provider-disabled and invalid-code states honestly
- customer auth docs were updated to reflect the runtime-ready but provider-disabled state

## What was intentionally not completed

- Twilio / Vonage / MessageBird / Textlocal provider onboarding
- hosted dashboard phone-provider enablement
- live SMS deliverability testing in Vietnam
- end-to-end phone-auth QA against merchant/admin reflection

## Why this is deferred

1. Provider onboarding is external-ops work, not product-structure work
2. Vietnam SMS routing and registration constraints can consume implementation time without moving core product scope
3. Current product work can continue with the phone fallback code path prepared but not switched on

## Reopen conditions

1. Customer product flows that depend on authenticated persisted mutation are otherwise ready
2. Final integration / pre-QA closure begins
3. SMS provider is chosen for Vietnam
4. Hosted provider is enabled
5. Test OTP or deliverability path is available for emulator validation
