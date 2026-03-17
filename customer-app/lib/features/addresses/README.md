# Customer Addresses

Status: Active
Authority: Operational
Surface: customer-app
Domains: addresses, delivery-address, account-child-route
Last updated: 2026-03-17
Retrieve when:
- editing saved-address behavior or the address form sheet
- checking whether address truth lives in the screen or the runtime controller
Related files:
- customer-app/lib/features/addresses/presentation/addresses_screen.dart
- customer-app/lib/core/data/customer_runtime_controller.dart
- customer-app/lib/features/checkout/README.md

## Purpose

Owns the saved-addresses route and its add, edit, delete, and default-address UI.

## Primary Routes and Screens

- `/addresses` -> `addresses_screen.dart`

## Source of Truth

- Mutable address truth lives in `customer-app/lib/core/data/customer_runtime_controller.dart`
- Address list and bottom-sheet form presentation live in `addresses_screen.dart`

## Key Files to Read First

- `customer-app/lib/core/data/customer_runtime_controller.dart`
- `customer-app/lib/features/addresses/presentation/addresses_screen.dart`
- `customer-app/lib/app/router/app_router.dart`

## Related Shared Widgets and Patterns

- `customer-app/lib/features/common/presentation/widgets.dart`
- `customer-app/lib/features/checkout/README.md`

## Related Governance Docs

- `docs/runtime-truth/customer-address-truth.md`
- `docs/flows/customer-profile-settings-flow.md`
- `docs/ui-governance/RUNTIME_REALITY_MAP.md`

## Known Limitations

- Addresses are local-session only.
- Validation is minimal and UI-driven.
- There is no geocoding, normalization, or backend persistence.

## Safe Modification Guidance

- Change address mutation logic in `customer_runtime_controller.dart` first.
- Then update form or list presentation in `addresses_screen.dart`.
- Re-check checkout delivery-address display after address behavior changes.

## What Not to Change Casually

- Do not move mutable address ownership into the screen.
- Do not read seed fixtures as if they are the current address source of truth.
- Do not change default-address rules without checking order and checkout side effects.
