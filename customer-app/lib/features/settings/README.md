# Customer Settings

Status: Active
Authority: Operational
Surface: customer-app
Domains: settings, account-preferences, customer
Last updated: 2026-03-17
Retrieve when:
- editing customer settings rows or toggles
- checking which settings behavior is local-only versus session-owned
Related files:
- customer-app/lib/features/settings/presentation/settings_screen.dart
- customer-app/lib/features/common/presentation/widgets.dart
- customer-app/lib/core/session/customer_session_controller.dart
- customer-app/lib/app/router/app_router.dart

## Purpose

Owns the customer settings screen and its account, help, legal, and sign-out controls.

## Primary Routes and Screens

- `/settings` -> `settings_screen.dart`

## Source of Truth

- Session/sign-out truth lives in `customer-app/lib/core/session/customer_session_controller.dart`
- Route ownership lives in `customer-app/lib/app/router/app_router.dart`
- Most toggle and preference behavior stays local to `settings_screen.dart`

The route is real, but many settings controls remain local/demo-safe UI state.

## Key Files to Read First

- `customer-app/lib/features/settings/presentation/settings_screen.dart`
- `customer-app/lib/features/common/presentation/widgets.dart`
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

- Most settings toggles are local-only.
- Help/legal/account rows are route handoffs or honest limited actions.
- There is no persisted settings backend.

## Safe Modification Guidance

- Change row composition and local control behavior in `settings_screen.dart`.
- Change sign-out behavior in `customer_session_controller.dart`.
- Reuse the shared account-row pattern instead of introducing a new variant.

## What Not to Change Casually

- Do not describe local toggle state as persisted account preference truth.
- Do not bypass session-owned sign-out behavior.
- Do not add polished no-op settings actions.
