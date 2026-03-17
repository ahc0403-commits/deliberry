# Customer Browse Store Cart Flow

Status: active
Authority: operational
Surface: customer-app
Domains: browse, store, menu, cart
Last updated: 2026-03-16
Last verified: 2026-03-16
Retrieve when:
- changing browse-to-store-to-cart continuity
- debugging selected-store, add-to-cart, or cart entry behavior
Related files:
- customer-app/lib/core/data/customer_runtime_controller.dart
- docs/filemaps/customer-runtime-filemap.md
- customer-app/lib/features/store/README.md

## Purpose

Document the main browse-led ordering entry flow before checkout begins.

## Entry points

- `/home`
- `/home/discovery`
- `/search`
- `/search/filter`
- reorder path into `/cart`

## Main route sequence

- Home/discovery path:
  - `/home` -> `/store` -> `/store/menu` -> `/cart`
- Search path:
  - `/search` -> `/search/filter` -> `/store` -> `/store/menu` -> `/cart`
- Reorder shortcut:
  - `/orders` or `/orders/detail` -> reorder action -> `/cart`

## Source-of-truth files involved

- [customer_runtime_controller.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/data/customer_runtime_controller.dart)
  - `openStore`
  - `addMenuItem`
  - cart state and selected-store truth
  - search/filter state used by browse entry points
- [app_router.dart](/Users/andremacmini/Deliberry/customer-app/lib/app/router/app_router.dart)
  - route ownership and shell vs flow routing

## Key dependent screens/files

- [home_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/home/presentation/home_screen.dart)
- [discovery_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/home/presentation/discovery_screen.dart)
- [search_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/search/presentation/search_screen.dart)
- [filter_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/search/presentation/filter_screen.dart)
- [store_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/store/presentation/store_screen.dart)
- [menu_browsing_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/store/presentation/menu_browsing_screen.dart)
- [cart_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/cart/presentation/cart_screen.dart)

## What is authoritative vs derived in this flow

- Authoritative:
  - selected store id
  - cart items
  - search query and filter selections
- Derived:
  - discovery result lists
  - search result lists
  - menu section/category display
  - cart totals and item counts
- Presentation-only:
  - promo banners, category visuals, and store card composition

## Known shallow / partial / local-only limits

- Browse content is mock-backed.
- Search/filter continuity is real in-session only.
- Favorites and some store actions remain honesty-limited instead of live.
- Cart is local-session only and tied to one selected store at a time.

## Common edit mistakes

- Changing store/menu behavior in one route and forgetting the other store route.
- Treating `MockData` store/menu fixtures as mutable truth.
- Losing search/filter context when navigating back from store/detail.
- Reimplementing add-to-cart logic in widget code instead of the runtime controller.

## Related filemaps

- [customer-runtime-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/customer-runtime-filemap.md)
- [customer-search-filter-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/customer-search-filter-filemap.md)

## Related runtime-truth docs

- [customer-runtime-truth.md](/Users/andremacmini/Deliberry/docs/runtime-truth/customer-runtime-truth.md)
- [customer-cart-truth.md](/Users/andremacmini/Deliberry/docs/runtime-truth/customer-cart-truth.md)
- [customer-search-filter-truth.md](/Users/andremacmini/Deliberry/docs/runtime-truth/customer-search-filter-truth.md)

## Related governance docs

- [NAVIGATION_TRUTH_MAP.md](/Users/andremacmini/Deliberry/docs/ui-governance/NAVIGATION_TRUTH_MAP.md)
- [RUNTIME_REALITY_MAP.md](/Users/andremacmini/Deliberry/docs/ui-governance/RUNTIME_REALITY_MAP.md)
- [STABILIZATION_REPORT.md](/Users/andremacmini/Deliberry/docs/ui-governance/STABILIZATION_REPORT.md)
