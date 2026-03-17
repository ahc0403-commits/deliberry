# Customer Notifications

Status: Active
Authority: Operational
Surface: customer-app
Domains: notifications, inbox, customer
Last updated: 2026-03-17
Retrieve when:
- editing the customer notifications screen
- checking whether notification state is runtime-owned or mock-backed
Related files:
- customer-app/lib/features/notifications/presentation/notifications_screen.dart
- customer-app/lib/core/data/customer_runtime_controller.dart
- customer-app/lib/core/data/mock_data.dart
- customer-app/lib/app/router/app_router.dart

## Purpose

Owns the customer notifications screen and its local inbox-style list.

## Primary Routes and Screens

- `/notifications` -> `notifications_screen.dart`

## Source of Truth

- Route ownership lives in `customer-app/lib/app/router/app_router.dart`
- Seed notification content comes from `customer-app/lib/core/data/mock_data.dart`
- Supporting customer runtime context lives in `customer-app/lib/core/data/customer_runtime_controller.dart`

The screen is route-real but notification content remains mock-backed and local-session only.

## Key Files to Read First

- `customer-app/lib/features/notifications/presentation/notifications_screen.dart`
- `customer-app/lib/core/data/mock_data.dart`
- `customer-app/lib/core/data/customer_runtime_controller.dart`
- `customer-app/lib/app/router/app_router.dart`

## Related Shared Widgets and Patterns

- `customer-app/lib/features/common/presentation/widgets.dart`

## Related Governance Docs

- `docs/flows/customer-profile-settings-flow.md`
- `docs/ui-governance/RUNTIME_REALITY_MAP.md`
- `docs/ui-governance/STATE_MODELING_RULES.md`

## Known Limitations

- Notifications are mock-backed.
- Read/dismiss behavior is local UI only.
- There is no push or backend inbox system.

## Safe Modification Guidance

- Change list composition and local state behavior in `notifications_screen.dart`.
- Change seed data shape in `mock_data.dart` only if the screen model changes.
- Keep route ownership in `app_router.dart`.

## What Not to Change Casually

- Do not treat mock notification data as durable runtime truth.
- Do not imply live push or synced inbox behavior.
- Do not move route ownership into the screen.
