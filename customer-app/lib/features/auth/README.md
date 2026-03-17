# Customer Auth

Status: Active
Authority: Operational
Surface: customer-app
Domains: auth, guest, onboarding-handoff
Last updated: 2026-03-17
Retrieve when:
- editing phone auth, guest entry, or auth-screen CTA behavior
- checking whether auth truth lives in widgets, router, or session controller
Related files:
- customer-app/lib/features/auth/presentation/auth_screen.dart
- customer-app/lib/features/auth/presentation/auth_phone_screen.dart
- customer-app/lib/features/auth/presentation/auth_otp_screen.dart
- customer-app/lib/core/session/customer_session_controller.dart

## Purpose

Owns the signed-out and guest-entry screens for the customer app.

## Primary Routes and Screens

- `/auth/login` -> `auth_screen.dart`
- `/auth/phone` -> `auth_phone_screen.dart`
- `/auth/otp` -> `auth_otp_screen.dart`
- `/guest` -> `guest_entry_screen.dart`

## Source of Truth

- Session/auth truth lives in `customer-app/lib/core/session/customer_session_controller.dart`
- Route and redirect ownership live in `customer-app/lib/app/router/app_router.dart`
- Widget-local field state stays inside the auth screens

## Key Files to Read First

- `customer-app/lib/core/session/customer_session_controller.dart`
- `customer-app/lib/app/router/app_router.dart`
- `customer-app/lib/features/auth/presentation/auth_screen.dart`
- `customer-app/lib/features/auth/presentation/auth_phone_screen.dart`
- `customer-app/lib/features/auth/presentation/auth_otp_screen.dart`
- `customer-app/lib/features/auth/presentation/guest_entry_screen.dart`

## Related Shared Widgets and Patterns

- `customer-app/lib/app/entry/customer_entry_screen.dart`
- `customer-app/lib/features/common/presentation/widgets.dart`

## Related Governance Docs

- `docs/flows/customer-auth-onboarding-flow.md`
- `docs/ui-governance/NAVIGATION_TRUTH_MAP.md`
- `docs/ui-governance/RUNTIME_REALITY_MAP.md`

## Known Limitations

- Phone auth and OTP are local/demo-safe flows only.
- Guest entry is real local session behavior, not backend identity.
- Social sign-in buttons are honest unavailable actions.

## Safe Modification Guidance

- Change session-state transitions in `customer_session_controller.dart`.
- Change auth route rules in `app_router.dart`.
- Change presentation and input behavior in the auth screens.

## What Not to Change Casually

- Do not treat widget-local text fields as the real auth truth.
- Do not bypass router redirects when changing auth behavior.
- Do not make unavailable social sign-in look live without real runtime support.
