# Customer Settings

Status: Active
Authority: Operational
Surface: customer-app
Domains: settings, account-preferences, customer
Last updated: 2026-05-05
Retrieve when:
- editing customer settings rows or toggles
- checking which settings behavior is runtime-owned versus session-owned
Related files:
- customer-app/lib/features/settings/presentation/settings_screen.dart
- customer-app/lib/features/common/presentation/widgets.dart
- customer-app/lib/core/data/customer_runtime_controller.dart
- customer-app/lib/core/session/customer_session_controller.dart
- customer-app/lib/app/router/app_router.dart

## Purpose

Owns the customer settings screen and its account, help, legal, and sign-out controls.

## Primary Routes and Screens

- `/settings` -> `settings_screen.dart`

## Source of Truth

- Session/sign-out truth lives in `customer-app/lib/core/session/customer_session_controller.dart`
- Runtime-owned preference and current-device reset behavior lives in `customer-app/lib/core/data/customer_runtime_controller.dart`
- Route ownership lives in `customer-app/lib/app/router/app_router.dart`

The route is real. Notification and dark-mode toggles now resolve through runtime-owned preference state, profile-name editing now resolves through runtime-owned identity state, change-phone now hands off into the existing phone-auth flow after a current-device sign-out/reset step, and support/legal rows now hand off to the public website routes that own that content.

## Key Files to Read First

- `customer-app/lib/features/settings/presentation/settings_screen.dart`
- `customer-app/lib/features/common/presentation/widgets.dart`
- `customer-app/lib/core/data/customer_runtime_controller.dart`
- `customer-app/lib/core/session/customer_session_controller.dart`
- `customer-app/lib/app/router/app_router.dart`

## Related Shared Widgets and Patterns

- `customer-app/lib/features/common/presentation/widgets.dart`
- `customer-app/lib/features/profile/presentation/profile_screen.dart`

## Related Governance Docs

- `docs/flows/customer-profile-settings-flow.md`
- `docs/ui-governance/RUNTIME_REALITY_MAP.md`
- `docs/ui-governance/STABILIZATION_REPORT.md`

## Known Limitations

- Preference persistence only closes for signed-in Supabase-backed customer sessions.
- Profile-name persistence only closes for signed-in Supabase-backed customer sessions.
- Change-phone does not mutate the existing account's phone number server-side; it is a current-device re-auth handoff into `/auth/phone`.
- Help/legal rows and `Rate the App` now hand off into the public website; some deeper account actions still remain honest limited actions.
- The destructive account action clears current-device session/runtime data; it is not a server-side account-erasure workflow.

## Safe Modification Guidance

- Change row composition in `settings_screen.dart`.
- Change runtime-owned preference/reset behavior in `customer_runtime_controller.dart`.
- Change sign-out behavior in `customer_session_controller.dart`.
- Reuse the shared account-row pattern instead of introducing a new variant.

## What Not to Change Casually

- Do not describe guest-only in-memory preference state as durable account truth.
- Do not bypass session-owned sign-out behavior.
- Do not add polished no-op settings actions.
