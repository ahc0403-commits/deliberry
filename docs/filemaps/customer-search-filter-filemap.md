# Customer Search Filter Filemap

Status: active
Authority: operational
Surface: customer-app
Domains: search, filters, discovery, route-context
Last updated: 2026-03-16
Last verified: 2026-03-16
Retrieve when:
- changing search query persistence or filter semantics
- debugging search/discovery/store return-context behavior
Related files:
- customer-app/lib/features/search/presentation/search_screen.dart
- customer-app/lib/core/data/customer_runtime_controller.dart
- customer-app/lib/features/search/README.md

## Purpose

Point to the smallest file cluster for search query truth, filter application, and search-driven store navigation.

## When to retrieve this filemap

- Search input and visible results disagree.
- Applying or resetting filters does not affect search/discovery correctly.
- Returning from store/detail unexpectedly clears search context.

## Entry files

- [search_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/search/presentation/search_screen.dart)
- [filter_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/search/presentation/filter_screen.dart)
- [customer_runtime_controller.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/data/customer_runtime_controller.dart)

## Adjacent files usually read together

- [discovery_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/home/presentation/discovery_screen.dart)
- [home_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/home/presentation/home_screen.dart)
- [store_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/store/presentation/store_screen.dart)
- [app_router.dart](/Users/andremacmini/Deliberry/customer-app/lib/app/router/app_router.dart)
- [route_names.dart](/Users/andremacmini/Deliberry/customer-app/lib/app/router/route_names.dart)
- [mock_data.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/data/mock_data.dart)

## Source-of-truth files

- [customer_runtime_controller.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/data/customer_runtime_controller.dart)
  - `searchQuery`
  - `recentSearches`
  - filter selections
  - search result filtering
- [app_router.dart](/Users/andremacmini/Deliberry/customer-app/lib/app/router/app_router.dart)
  - `/search` and `/search/filter` route ownership

## Files that are often mistaken as source of truth but are not

- [filter_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/search/presentation/filter_screen.dart)
  - owns temporary selection UI until apply, not durable filter truth
- [search_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/search/presentation/search_screen.dart)
  - renders and triggers, but should not own a second search state model
- [mock_data.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/data/mock_data.dart)
  - provides option labels and store fixtures, not query/filter persistence

## High-risk edit points

- `setSearchQuery`, `clearSearchQuery`, `clearRecentSearches`, `setFilters`, and `resetFilters` in [customer_runtime_controller.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/data/customer_runtime_controller.dart)
- `_controller` synchronization and query-triggered rendering in [search_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/search/presentation/search_screen.dart)
- local temporary `_selectedIndices` handling in [filter_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/search/presentation/filter_screen.dart)

## Related governance docs

- [NAVIGATION_TRUTH_MAP.md](/Users/andremacmini/Deliberry/docs/ui-governance/NAVIGATION_TRUTH_MAP.md)
- [RUNTIME_REALITY_MAP.md](/Users/andremacmini/Deliberry/docs/ui-governance/RUNTIME_REALITY_MAP.md)
- [INTERACTION_PATTERNS.md](/Users/andremacmini/Deliberry/docs/ui-governance/INTERACTION_PATTERNS.md)
- [STATE_MODELING_RULES.md](/Users/andremacmini/Deliberry/docs/ui-governance/STATE_MODELING_RULES.md)

## Related local feature READMEs

- [search/README.md](/Users/andremacmini/Deliberry/customer-app/lib/features/search/README.md)
- [store/README.md](/Users/andremacmini/Deliberry/customer-app/lib/features/store/README.md)

## Safe edit sequence

1. Confirm expected return-context and child-route behavior in [NAVIGATION_TRUTH_MAP.md](/Users/andremacmini/Deliberry/docs/ui-governance/NAVIGATION_TRUTH_MAP.md).
2. Change durable query/filter logic in [customer_runtime_controller.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/data/customer_runtime_controller.dart).
3. Update [search_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/search/presentation/search_screen.dart) and [filter_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/search/presentation/filter_screen.dart) to match.
4. Verify adjacent discovery and store-entry behavior.
5. Re-check runtime-reality classification if the change affects durability or honesty.
