# Customer Profile

Status: Active
Authority: Operational
Surface: customer-app
Domains: profile, account-hub, customer
Last updated: 2026-03-17
Retrieve when:
- editing the customer profile hub
- checking whether profile actions are route-real, runtime-real, or presentation-only
Related files:
- customer-app/lib/features/profile/presentation/profile_screen.dart
- customer-app/lib/app/router/app_router.dart
- customer-app/lib/core/session/customer_session_controller.dart
- customer-app/lib/core/data/customer_runtime_controller.dart

## Purpose

Owns the customer profile hub and its handoffs into account-side routes such as settings, addresses, notifications, and reviews.

## Primary Routes and Screens

- `/profile` -> `profile_screen.dart`

## Source of Truth

- Session truth lives in `customer-app/lib/core/session/customer_session_controller.dart`
- Route ownership lives in `customer-app/lib/app/router/app_router.dart`
- Supporting local runtime state lives in `customer-app/lib/core/data/customer_runtime_controller.dart`
- Most profile row taps are route handoffs or honest local/demo-safe actions

## Key Files to Read First

- `customer-app/lib/features/profile/presentation/profile_screen.dart`
- `customer-app/lib/app/router/app_router.dart`
- `customer-app/lib/core/session/customer_session_controller.dart`
- `customer-app/lib/core/data/customer_runtime_controller.dart`

## Related Shared Widgets and Patterns

- `customer-app/lib/features/common/presentation/widgets.dart`
- `customer-app/lib/features/settings/presentation/settings_screen.dart`

## Related Governance Docs

- `docs/flows/customer-profile-settings-flow.md`
- `docs/ui-governance/NAVIGATION_TRUTH_MAP.md`
- `docs/ui-governance/RUNTIME_REALITY_MAP.md`

## Known Limitations

- Profile is mostly a route hub, not a deep persisted account editor.
- Some rows hand off to local/demo-safe surfaces rather than live account systems.
- Signed-in truth is local-session only.
- Profile identity now derives from the local session phone number when available; richer account identity fields are still not persisted.

## Safe Modification Guidance

- Change route handoffs in `profile_screen.dart` and `app_router.dart`.
- Change session-dependent display in `customer_session_controller.dart`.
- Reuse existing account-row patterns instead of creating a new one-off layout.

## What Not to Change Casually

- Do not treat profile rows as runtime truth owners.
- Do not bypass router-owned handoffs for account surfaces.
- Do not make local/demo-safe actions look backend-backed.
