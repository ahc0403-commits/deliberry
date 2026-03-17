# Customer Search Feature

Status: active
Authority: operational
Surface: customer-app
Domains: search, filters, discovery-context
Last updated: 2026-03-16
Last verified: 2026-03-16
Retrieve when:
- editing search query persistence, recent searches, or filter application
- changing search-to-store navigation or return-context behavior
Related files:
- customer-app/lib/features/search/presentation/search_screen.dart
- customer-app/lib/features/search/presentation/filter_screen.dart
- customer-app/lib/core/data/customer_runtime_controller.dart

## Purpose

Own customer search query state, recent searches, filter state, and search-driven store discovery.

## Primary routes/screens

- `/search` -> `SearchScreen`
- `/search/filter` -> `FilterScreen`

## Source of truth

- Query, recent searches, selected filters, and search result filtering live in [customer_runtime_controller.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/data/customer_runtime_controller.dart)
- Visual filter option labels and static category data come from [mock_data.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/data/mock_data.dart)
- Route ownership lives in [app_router.dart](/Users/andremacmini/Deliberry/customer-app/lib/app/router/app_router.dart)

## Key files to read first

- [search_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/search/presentation/search_screen.dart)
- [filter_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/search/presentation/filter_screen.dart)
- [customer_runtime_controller.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/data/customer_runtime_controller.dart)
- [route_names.dart](/Users/andremacmini/Deliberry/customer-app/lib/app/router/route_names.dart)

## Related shared widgets/patterns

- [widgets.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/common/presentation/widgets.dart)
  - `AppSearchBar`
  - `SectionHeader`
  - `StoreCard`
  - `EmptyState`
- Governed as `Search / Filter` in [SCREEN_TYPES.md](/Users/andremacmini/Deliberry/docs/ui-governance/SCREEN_TYPES.md)

## Related governance docs

- [NAVIGATION_TRUTH_MAP.md](/Users/andremacmini/Deliberry/docs/ui-governance/NAVIGATION_TRUTH_MAP.md)
- [RUNTIME_REALITY_MAP.md](/Users/andremacmini/Deliberry/docs/ui-governance/RUNTIME_REALITY_MAP.md)
- [INTERACTION_PATTERNS.md](/Users/andremacmini/Deliberry/docs/ui-governance/INTERACTION_PATTERNS.md)
- [STATE_MODELING_RULES.md](/Users/andremacmini/Deliberry/docs/ui-governance/STATE_MODELING_RULES.md)

## Known limitations / partial-support truth

- Search results are runtime-real for the current session, but they still filter mock-backed store data.
- Filter state is durable across expected route transitions, but the option catalog itself is still static fixture data.
- Search scope is store/discovery oriented. It is not full-text menu search.

## Safe modification guidance

- Keep query and filter mutation in [customer_runtime_controller.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/data/customer_runtime_controller.dart), not duplicated inside the widgets.
- If you change filter semantics, verify both `SearchScreen` and `DiscoveryScreen` because they share runtime filter truth.
- Preserve the return-context rule: going into store/detail from search should not destroy expected query/filter state.

## What not to change casually

- Do not make `FilterScreen` own persistent truth by itself.
- Do not clear query/filter/recent state on incidental navigation.
- Do not introduce a second search result algorithm in the widget layer.
