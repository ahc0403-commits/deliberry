# Customer Runtime Truth

Status: active
Authority: operational
Surface: customer-app
Domains: runtime-truth, cart, addresses, orders, search
Last updated: 2026-03-16
Last verified: 2026-03-16
Retrieve when:
- identifying where mutable customer-app truth actually lives
- debugging state continuity across store, cart, checkout, orders, and search
Related files:
- customer-app/lib/core/data/customer_runtime_controller.dart
- docs/filemaps/customer-runtime-filemap.md
- docs/ui-governance/RUNTIME_REALITY_MAP.md

## Purpose

Give one surface-level answer to the customer-app runtime question: what mutable truth is actually authoritative today.

## Real source-of-truth location(s)

- Primary mutable owner: [customer_runtime_controller.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/data/customer_runtime_controller.dart)
- Route and access owner: [app_router.dart](/Users/andremacmini/Deliberry/customer-app/lib/app/router/app_router.dart)
- Session-entry owner for auth/guest/onboarding gating: [customer_session_controller.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/session/customer_session_controller.dart)

## What state is owned there

- `CustomerRuntimeController`
  - selected store id
  - cart items, promo state, totals
  - addresses and default address
  - active and past order records
  - reorder path
  - search query
  - recent searches
  - filter selections
- `AppRouter`
  - route ownership
  - shell vs standalone flow boundary
  - route argument threading for store/order detail flows
- `CustomerSessionController`
  - signed-in vs guest vs onboarding vs otp-pending access state

## What screens depend on it

- Store and menu: [store_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/store/presentation/store_screen.dart), [menu_browsing_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/store/presentation/menu_browsing_screen.dart)
- Cart and checkout: [cart_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/cart/presentation/cart_screen.dart), [checkout_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/checkout/presentation/checkout_screen.dart)
- Orders: [orders_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/orders/presentation/orders_screen.dart), [order_detail_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/orders/presentation/order_detail_screen.dart), [order_status_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/orders/presentation/order_status_screen.dart)
- Search and discovery: [search_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/search/presentation/search_screen.dart), [filter_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/search/presentation/filter_screen.dart), [discovery_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/home/presentation/discovery_screen.dart)
- Addresses: [addresses_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/addresses/presentation/addresses_screen.dart)

## What is derived vs authoritative

- Authoritative today:
  - mutable fields inside `CustomerRuntimeController`
  - route ownership inside `AppRouter`
  - session/access state inside `CustomerSessionController`
- Derived:
  - `cartItemCount`, `cartSubtotal`, `cartDeliveryFee`, `cartServiceFee`, `cartTotal`, `activeFilterCount`, `deliveryAddress`, `selectedStore`, `activeOrders`, `pastOrders`
  - search and discovery results from `getSearchResults()` and `getDiscoveryResults()`
- Fixture-only, not authoritative:
  - [mock_data.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/data/mock_data.dart)
  - [in_memory_customer_repository.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/data/in_memory_customer_repository.dart)

## What is still shallow / partial / local-only

- All runtime truth here is local-session only. There is no backend persistence.
- Payment remains placeholder-only.
- Order status UI is route-real but timeline progression is static.
- Search/filter durability is real inside the running surface, but still operates on mock-backed stores.
- Some screens remain mock-backed even when flow-connected, as called out in [RUNTIME_REALITY_MAP.md](/Users/andremacmini/Deliberry/docs/ui-governance/RUNTIME_REALITY_MAP.md).

## Known risks

- `CustomerRuntimeController` is a single mutable cluster; careless edits can break multiple flows at once.
- Screens can regress by reintroducing screen-local state ownership instead of reading the controller.
- Route changes in `AppRouter` can silently break shell/flow boundaries if not checked against navigation truth.

## Safe modification guidance

- Change mutable behavior in `CustomerRuntimeController` first.
- Change routing behavior in `AppRouter` only when route ownership or route arguments truly need to move.
- Treat `MockData` as fixtures only. Do not mistake fixture values for authoritative runtime state.
- Re-check [RUNTIME_REALITY_MAP.md](/Users/andremacmini/Deliberry/docs/ui-governance/RUNTIME_REALITY_MAP.md) after any change that alters what is state-real vs mock-backed.

## Related filemaps

- [customer-runtime-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/customer-runtime-filemap.md)
- [customer-checkout-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/customer-checkout-filemap.md)
- [customer-orders-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/customer-orders-filemap.md)
- [customer-search-filter-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/customer-search-filter-filemap.md)

## Related governance docs

- [RUNTIME_REALITY_MAP.md](/Users/andremacmini/Deliberry/docs/ui-governance/RUNTIME_REALITY_MAP.md)
- [NAVIGATION_TRUTH_MAP.md](/Users/andremacmini/Deliberry/docs/ui-governance/NAVIGATION_TRUTH_MAP.md)
- [STABILIZATION_REPORT.md](/Users/andremacmini/Deliberry/docs/ui-governance/STABILIZATION_REPORT.md)
