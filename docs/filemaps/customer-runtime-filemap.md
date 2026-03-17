# Customer Runtime Filemap

Status: active
Authority: operational
Surface: customer-app
Domains: runtime, routing, cart, orders, search
Last updated: 2026-03-16
Last verified: 2026-03-16
Retrieve when:
- changing shared customer runtime behavior across multiple screens
- debugging route-to-runtime continuity in the customer app
Related files:
- customer-app/lib/core/data/customer_runtime_controller.dart
- customer-app/lib/app/router/app_router.dart
- docs/ui-governance/RUNTIME_REALITY_MAP.md

## Purpose

Point to the narrow file cluster for customer runtime-sensitive work that crosses feature boundaries.

## When to retrieve this filemap

- A bug spans store, cart, checkout, orders, or search.
- A route now opens but reads stale or inconsistent state.
- A change touches selected store, cart truth, order truth, address truth, query state, or filters.

## Entry files

- [customer_runtime_controller.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/data/customer_runtime_controller.dart)
- [app_router.dart](/Users/andremacmini/Deliberry/customer-app/lib/app/router/app_router.dart)
- [route_names.dart](/Users/andremacmini/Deliberry/customer-app/lib/app/router/route_names.dart)

## Adjacent files usually read together

- [store_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/store/presentation/store_screen.dart)
- [menu_browsing_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/store/presentation/menu_browsing_screen.dart)
- [cart_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/cart/presentation/cart_screen.dart)
- [checkout_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/checkout/presentation/checkout_screen.dart)
- [orders_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/orders/presentation/orders_screen.dart)
- [order_detail_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/orders/presentation/order_detail_screen.dart)
- [order_status_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/orders/presentation/order_status_screen.dart)
- [search_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/search/presentation/search_screen.dart)
- [filter_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/search/presentation/filter_screen.dart)

## Source-of-truth files

- [customer_runtime_controller.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/data/customer_runtime_controller.dart)
  - selected store
  - cart items and totals
  - promo code state
  - active/past orders and reorder
  - addresses
  - search query, recent searches, filters
- [app_router.dart](/Users/andremacmini/Deliberry/customer-app/lib/app/router/app_router.dart)
  - route ownership
  - route argument threading
  - shell vs standalone flow boundaries

## Files that are often mistaken as source of truth but are not

- [mock_data.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/data/mock_data.dart)
  - fixture content only, not mutable runtime truth
- [in_memory_customer_repository.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/data/in_memory_customer_repository.dart)
  - read-only section labels, not route or state ownership
- presentation files under `customer-app/lib/features/*/presentation/`
  - render and trigger actions, but should not become parallel state owners

## High-risk edit points

- `submitOrder`, `reorder`, `addMenuItem`, `openStore`, `setSearchQuery`, `setFilters`, `applyPromoCode` in [customer_runtime_controller.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/data/customer_runtime_controller.dart)
- route argument handling for `storeId`, `orderId`, and guarded routes in [app_router.dart](/Users/andremacmini/Deliberry/customer-app/lib/app/router/app_router.dart)
- any screen that copies runtime logic locally instead of reading from the controller

## Related governance docs

- [NAVIGATION_TRUTH_MAP.md](/Users/andremacmini/Deliberry/docs/ui-governance/NAVIGATION_TRUTH_MAP.md)
- [RUNTIME_REALITY_MAP.md](/Users/andremacmini/Deliberry/docs/ui-governance/RUNTIME_REALITY_MAP.md)
- [STABILIZATION_REPORT.md](/Users/andremacmini/Deliberry/docs/ui-governance/STABILIZATION_REPORT.md)

## Related local feature READMEs

- [store/README.md](/Users/andremacmini/Deliberry/customer-app/lib/features/store/README.md)
- [cart/README.md](/Users/andremacmini/Deliberry/customer-app/lib/features/cart/README.md)
- [checkout/README.md](/Users/andremacmini/Deliberry/customer-app/lib/features/checkout/README.md)
- [orders/README.md](/Users/andremacmini/Deliberry/customer-app/lib/features/orders/README.md)
- [search/README.md](/Users/andremacmini/Deliberry/customer-app/lib/features/search/README.md)

## Safe edit sequence

1. Confirm route ownership and intended flow in [NAVIGATION_TRUTH_MAP.md](/Users/andremacmini/Deliberry/docs/ui-governance/NAVIGATION_TRUTH_MAP.md).
2. Update runtime truth in [customer_runtime_controller.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/data/customer_runtime_controller.dart) if behavior changes.
3. Update [app_router.dart](/Users/andremacmini/Deliberry/customer-app/lib/app/router/app_router.dart) only if route arguments or access boundaries change.
4. Adjust the affected presentation screens.
5. Re-check the relevant feature README and runtime-reality classification.
