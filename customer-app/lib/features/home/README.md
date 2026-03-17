# Customer Home

Status: Active
Authority: Operational
Surface: customer-app
Domains: home, discovery, shell-entry
Last updated: 2026-03-17
Retrieve when:
- editing the home tab, discovery route, or browse-entry CTAs
- checking whether store and address data come from fixtures or runtime state
Related files:
- customer-app/lib/features/home/presentation/home_screen.dart
- customer-app/lib/features/home/presentation/discovery_screen.dart
- customer-app/lib/core/data/customer_runtime_controller.dart
- customer-app/lib/core/data/mock_data.dart

## Purpose

Owns the shell home tab and the discovery route for the customer app.

## Primary Routes and Screens

- `/home` -> `home_screen.dart`
- `/home/discovery` -> `discovery_screen.dart`

## Source of Truth

- Delivery-address and discovery-filter truth live in `customer_runtime_controller.dart`
- Home and discovery composition live in `home_screen.dart` and `discovery_screen.dart`
- Many promo/category/store fixtures still come from `mock_data.dart`

## Key Files to Read First

- `customer-app/lib/features/home/presentation/home_screen.dart`
- `customer-app/lib/features/home/presentation/discovery_screen.dart`
- `customer-app/lib/core/data/customer_runtime_controller.dart`
- `customer-app/lib/core/data/mock_data.dart`
- `customer-app/lib/app/router/app_router.dart`

## Related Shared Widgets and Patterns

- `customer-app/lib/features/common/presentation/widgets.dart`
- `customer-app/lib/features/store/README.md`
- `customer-app/lib/features/search/README.md`

## Related Governance Docs

- `docs/ui-governance/NAVIGATION_TRUTH_MAP.md`
- `docs/ui-governance/RUNTIME_REALITY_MAP.md`
- `docs/flows/customer-browse-store-cart-flow.md`

## Known Limitations

- Store and promotion content are still mock-backed.
- Address and filter continuity are runtime-real only within the running app session.
- Discovery category selection is widget-local state layered on top of runtime filters.

## Safe Modification Guidance

- Change home/discovery composition in the screen files.
- Change address, selected store, and discovery result logic in `customer_runtime_controller.dart`.
- Treat `mock_data.dart` as seed/display data, not mutable runtime truth.

## What Not to Change Casually

- Do not bypass `deliveryAddress` and read address fixtures directly.
- Do not treat `mock_data.dart` as the mutable owner of discovery state.
- Do not break route handoff into `/store` or `/search` when editing home CTAs.
