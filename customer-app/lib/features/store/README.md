# Customer Store Feature

Status: active
Authority: operational
Surface: customer-app
Domains: store, menu, cart-entry
Last updated: 2026-03-16
Last verified: 2026-03-16
Retrieve when:
- editing store detail or menu browsing routes
- changing selected-store truth, add-to-cart behavior, or menu composition
Related files:
- customer-app/lib/features/store/presentation/store_screen.dart
- customer-app/lib/features/store/presentation/menu_browsing_screen.dart
- customer-app/lib/core/data/customer_runtime_controller.dart

## Purpose

Own the customer browse-to-menu entry for one selected store and hand off into cart.

## Primary routes/screens

- `/store` -> `StoreDetailScreen`
- `/store/menu` -> `MenuBrowsingScreen`

## Source of truth

- Mutable truth is split:
  - selected store, menu add-to-cart, and cart continuity live in [customer_runtime_controller.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/data/customer_runtime_controller.dart)
  - menu/store fixture content comes from [mock_data.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/data/mock_data.dart)
- Route ownership and shell boundaries come from [app_router.dart](/Users/andremacmini/Deliberry/customer-app/lib/app/router/app_router.dart) and [NAVIGATION_TRUTH_MAP.md](/Users/andremacmini/Deliberry/docs/ui-governance/NAVIGATION_TRUTH_MAP.md)

## Key files to read first

- [store_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/store/presentation/store_screen.dart)
- [menu_browsing_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/store/presentation/menu_browsing_screen.dart)
- [customer_runtime_controller.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/data/customer_runtime_controller.dart)
- [route_names.dart](/Users/andremacmini/Deliberry/customer-app/lib/app/router/route_names.dart)

## Related shared widgets/patterns

- [widgets.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/common/presentation/widgets.dart)
  - `CategoryChipRow`
  - `MenuSectionList`
  - `BottomCTABar`
- Governed as `Detail / Menu Browsing` screens in [SCREEN_TYPES.md](/Users/andremacmini/Deliberry/docs/ui-governance/SCREEN_TYPES.md)

## Related governance docs

- [NAVIGATION_TRUTH_MAP.md](/Users/andremacmini/Deliberry/docs/ui-governance/NAVIGATION_TRUTH_MAP.md)
- [RUNTIME_REALITY_MAP.md](/Users/andremacmini/Deliberry/docs/ui-governance/RUNTIME_REALITY_MAP.md)
- [STABILIZATION_REPORT.md](/Users/andremacmini/Deliberry/docs/ui-governance/STABILIZATION_REPORT.md)
- [UI_GAP_AUDIT.md](/Users/andremacmini/Deliberry/docs/ui-governance/UI_GAP_AUDIT.md)

## Known limitations / partial-support truth

- Store content is mock-backed, not backend-backed.
- `StoreDetailScreen` still contains honesty-limited actions such as unavailable favorites.
- `store_screen.dart` and `menu_browsing_screen.dart` intentionally share the same runtime truth, but they still remain two separate route implementations and can drift if edited independently.

## Safe modification guidance

- Change selected-store behavior in [customer_runtime_controller.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/data/customer_runtime_controller.dart) first, then update both store screens.
- Preserve route argument handling for `storeId`; these routes must not silently fall back to unrelated stores during flow changes.
- Reuse `MenuSectionList` and existing shared customer primitives before introducing new menu/list widgets.

## What not to change casually

- Do not move `/store` or `/store/menu` into `MainShell`.
- Do not fork add-to-cart logic away from `CustomerRuntimeController`.
- Do not let store detail and menu browsing diverge on category behavior, cart CTA behavior, or selected-store resolution without an explicit documented reason.
