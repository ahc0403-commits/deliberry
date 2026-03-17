# Customer Search Filter Truth

Status: active
Authority: operational
Surface: customer-app
Domains: search, filters, recent-searches, discovery-results
Last updated: 2026-03-16
Last verified: 2026-03-16
Retrieve when:
- changing query/filter persistence or result filtering behavior
- debugging search, filter, discovery, and store-entry continuity
Related files:
- customer-app/lib/core/data/customer_runtime_controller.dart
- docs/filemaps/customer-search-filter-filemap.md
- customer-app/lib/features/search/README.md

## Purpose

Document where durable-in-session search and filter truth lives and what remains fixture-backed.

## Real source-of-truth location(s)

- Authoritative mutable owner: [customer_runtime_controller.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/data/customer_runtime_controller.dart)
  - `_searchQuery`
  - `_recentSearches`
  - `_filterSelections`
- Route owner: [app_router.dart](/Users/andremacmini/Deliberry/customer-app/lib/app/router/app_router.dart)

## What state is owned there

- current search query
- recent searches list
- applied filter selections
- shared result filtering logic for search and discovery

## What screens depend on it

- [search_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/search/presentation/search_screen.dart)
- [filter_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/search/presentation/filter_screen.dart)
- [discovery_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/home/presentation/discovery_screen.dart)
- [home_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/home/presentation/home_screen.dart) for search-entry shortcuts
- [menu_browsing_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/store/presentation/menu_browsing_screen.dart) for store-name-to-search handoff

## What is derived vs authoritative

- Authoritative:
  - `_searchQuery`
  - `_recentSearches`
  - `_filterSelections`
  - `setSearchQuery`
  - `setFilters`
  - `resetFilters`
  - `clearRecentSearches`
- Derived:
  - `activeFilterCount`
  - `getSearchResults()`
  - `getDiscoveryResults()`
- Fixture-only:
  - store and category content from [mock_data.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/data/mock_data.dart)
  - filter option labels from `MockData.filterOptions`

## What is still shallow / partial / local-only

- Search/filter truth survives expected in-app route transitions, but only inside the current session.
- Search is store/discovery scoped. It is not a full menu or backend search system.
- Filter options and search results are driven by fixtures, not a live catalog.

## Known risks

- `SearchScreen` has a local `TextEditingController`; controller sync can drift if runtime and widget logic diverge.
- `FilterScreen` owns temporary local selection state until Apply; bypassing apply would bypass the durable state owner.
- Discovery and search share filter truth, so changes to one result algorithm can create inconsistent browse behavior quickly.

## Safe modification guidance

- Change durable query/filter state and result filtering in [customer_runtime_controller.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/data/customer_runtime_controller.dart) first.
- Then update [search_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/search/presentation/search_screen.dart) and [filter_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/search/presentation/filter_screen.dart).
- Verify discovery and store-entry behavior after any filter or query logic change.
- Keep `FilterScreen` as a temporary editor over shared state, not a second durable owner.

## Related filemaps

- [customer-search-filter-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/customer-search-filter-filemap.md)
- [customer-runtime-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/customer-runtime-filemap.md)

## Related governance docs

- [RUNTIME_REALITY_MAP.md](/Users/andremacmini/Deliberry/docs/ui-governance/RUNTIME_REALITY_MAP.md)
- [NAVIGATION_TRUTH_MAP.md](/Users/andremacmini/Deliberry/docs/ui-governance/NAVIGATION_TRUTH_MAP.md)
- [INTERACTION_PATTERNS.md](/Users/andremacmini/Deliberry/docs/ui-governance/INTERACTION_PATTERNS.md)
- [STATE_MODELING_RULES.md](/Users/andremacmini/Deliberry/docs/ui-governance/STATE_MODELING_RULES.md)
