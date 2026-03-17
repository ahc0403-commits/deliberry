# Retrieval Entry: Customer

Status: Active
Authority: Operational
Surface: customer-app
Domains: retrieval, customer-app, runtime-truth, flows, profile, settings, notifications, reviews
Last updated: 2026-03-17
Retrieve when:
- starting any customer-app implementation, bug fix, or UI/state change
- determining which customer authority, runtime-truth, filemap, and local README docs to open first
Related files:
- docs/rag-architecture/RAG_ACTIVE_INDEX.md
- docs/ui-governance/NAVIGATION_TRUTH_MAP.md
- docs/ui-governance/RUNTIME_REALITY_MAP.md
- docs/runtime-truth/customer-runtime-truth.md

## Surface Purpose

Customer-facing mobile app flow for browse, cart, checkout, orders, account, and supporting customer journeys.

## Start Here First

1. [docs/rag-architecture/RAG_ACTIVE_INDEX.md](/Users/andremacmini/Deliberry/docs/rag-architecture/RAG_ACTIVE_INDEX.md)
2. [docs/02-surface-ownership.md](/Users/andremacmini/Deliberry/docs/02-surface-ownership.md)
3. [docs/ui-governance/NAVIGATION_TRUTH_MAP.md](/Users/andremacmini/Deliberry/docs/ui-governance/NAVIGATION_TRUTH_MAP.md)
4. [docs/ui-governance/RUNTIME_REALITY_MAP.md](/Users/andremacmini/Deliberry/docs/ui-governance/RUNTIME_REALITY_MAP.md)

## Binding Authority Docs

- [docs/governance/CONSTITUTION.md](/Users/andremacmini/Deliberry/docs/governance/CONSTITUTION.md)
- [docs/governance/STRUCTURE.md](/Users/andremacmini/Deliberry/docs/governance/STRUCTURE.md)
- [docs/governance/FLOW.md](/Users/andremacmini/Deliberry/docs/governance/FLOW.md)
- [docs/02-surface-ownership.md](/Users/andremacmini/Deliberry/docs/02-surface-ownership.md)
- [docs/03-navigation-ia.md](/Users/andremacmini/Deliberry/docs/03-navigation-ia.md)
- Customer UI work also binds:
  - [docs/ui-governance/README.md](/Users/andremacmini/Deliberry/docs/ui-governance/README.md)
  - [docs/ui-governance/SCREEN_TYPES.md](/Users/andremacmini/Deliberry/docs/ui-governance/SCREEN_TYPES.md)
  - [docs/ui-governance/INTERACTION_PATTERNS.md](/Users/andremacmini/Deliberry/docs/ui-governance/INTERACTION_PATTERNS.md)
  - [docs/ui-governance/STATE_MODELING_RULES.md](/Users/andremacmini/Deliberry/docs/ui-governance/STATE_MODELING_RULES.md)

## Runtime-Truth Docs to Read Next

- [docs/runtime-truth/customer-runtime-truth.md](/Users/andremacmini/Deliberry/docs/runtime-truth/customer-runtime-truth.md)
- [docs/runtime-truth/customer-cart-truth.md](/Users/andremacmini/Deliberry/docs/runtime-truth/customer-cart-truth.md)
- [docs/runtime-truth/customer-orders-truth.md](/Users/andremacmini/Deliberry/docs/runtime-truth/customer-orders-truth.md)
- [docs/runtime-truth/customer-search-filter-truth.md](/Users/andremacmini/Deliberry/docs/runtime-truth/customer-search-filter-truth.md)
- [docs/runtime-truth/customer-address-truth.md](/Users/andremacmini/Deliberry/docs/runtime-truth/customer-address-truth.md)

## Filemaps to Read Next

- [docs/filemaps/customer-runtime-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/customer-runtime-filemap.md)
- [docs/filemaps/customer-checkout-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/customer-checkout-filemap.md)
- [docs/filemaps/customer-orders-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/customer-orders-filemap.md)
- [docs/filemaps/customer-search-filter-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/customer-search-filter-filemap.md)

## Local Feature READMEs to Read Next

- [customer-app/lib/features/store/README.md](/Users/andremacmini/Deliberry/customer-app/lib/features/store/README.md)
- [customer-app/lib/features/cart/README.md](/Users/andremacmini/Deliberry/customer-app/lib/features/cart/README.md)
- [customer-app/lib/features/checkout/README.md](/Users/andremacmini/Deliberry/customer-app/lib/features/checkout/README.md)
- [customer-app/lib/features/orders/README.md](/Users/andremacmini/Deliberry/customer-app/lib/features/orders/README.md)
- [customer-app/lib/features/search/README.md](/Users/andremacmini/Deliberry/customer-app/lib/features/search/README.md)
- [customer-app/lib/features/auth/README.md](/Users/andremacmini/Deliberry/customer-app/lib/features/auth/README.md)
- [customer-app/lib/features/home/README.md](/Users/andremacmini/Deliberry/customer-app/lib/features/home/README.md)
- [customer-app/lib/features/addresses/README.md](/Users/andremacmini/Deliberry/customer-app/lib/features/addresses/README.md)
- [customer-app/lib/features/group_order/README.md](/Users/andremacmini/Deliberry/customer-app/lib/features/group_order/README.md)
- [customer-app/lib/features/profile/README.md](/Users/andremacmini/Deliberry/customer-app/lib/features/profile/README.md)
- [customer-app/lib/features/settings/README.md](/Users/andremacmini/Deliberry/customer-app/lib/features/settings/README.md)
- [customer-app/lib/features/notifications/README.md](/Users/andremacmini/Deliberry/customer-app/lib/features/notifications/README.md)
- [customer-app/lib/features/reviews/README.md](/Users/andremacmini/Deliberry/customer-app/lib/features/reviews/README.md)

## Flow Docs to Read Next

- [docs/flows/customer-browse-store-cart-flow.md](/Users/andremacmini/Deliberry/docs/flows/customer-browse-store-cart-flow.md)
- [docs/flows/customer-checkout-orders-flow.md](/Users/andremacmini/Deliberry/docs/flows/customer-checkout-orders-flow.md)
- [docs/flows/customer-auth-onboarding-flow.md](/Users/andremacmini/Deliberry/docs/flows/customer-auth-onboarding-flow.md)
- [docs/flows/customer-profile-settings-flow.md](/Users/andremacmini/Deliberry/docs/flows/customer-profile-settings-flow.md)
- [docs/flows/customer-group-order-flow.md](/Users/andremacmini/Deliberry/docs/flows/customer-group-order-flow.md)

## Common Task Categories

- Route and shell navigation bugs
- Auth and guest-entry behavior
- Home and discovery browse-entry behavior
- CTA wiring and no-op cleanup
- Cart, checkout, and orders continuity
- Search and filter durability
- Customer screen copy, state, and UI-governance compliance
- Profile, settings, notifications, and reviews secondary-surface work

## Common Traps and False Source-of-Truth Locations

- Do not start in presentation widgets when the bug is really owned by [customer_runtime_controller.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/data/customer_runtime_controller.dart).
- Do not treat [mock_data.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/data/mock_data.dart) as mutable runtime truth.
- Do not use historical review docs in `reviews/` as current authority when active UI-governance docs already supersede them.
- Do not assume polished customer UI means backend truth exists. Many flows are coherent local runtime only.

## Fast Retrieval Sequence Examples

- Route bug in store/cart/orders:
  - [docs/ui-governance/NAVIGATION_TRUTH_MAP.md](/Users/andremacmini/Deliberry/docs/ui-governance/NAVIGATION_TRUTH_MAP.md) -> [docs/filemaps/customer-runtime-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/customer-runtime-filemap.md) -> [customer-app/lib/app/router/app_router.dart](/Users/andremacmini/Deliberry/customer-app/lib/app/router/app_router.dart)
- Cart or checkout behavior change:
  - [docs/runtime-truth/customer-cart-truth.md](/Users/andremacmini/Deliberry/docs/runtime-truth/customer-cart-truth.md) -> [docs/filemaps/customer-checkout-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/customer-checkout-filemap.md) -> [customer-app/lib/features/cart/README.md](/Users/andremacmini/Deliberry/customer-app/lib/features/cart/README.md)
- Customer screen copy/state/UI fix:
  - [docs/ui-governance/SCREEN_TYPES.md](/Users/andremacmini/Deliberry/docs/ui-governance/SCREEN_TYPES.md) -> [docs/ui-governance/COPY_TONE_RULES.md](/Users/andremacmini/Deliberry/docs/ui-governance/COPY_TONE_RULES.md) -> relevant local README
- Auth or guest-entry change:
  - [docs/flows/customer-auth-onboarding-flow.md](/Users/andremacmini/Deliberry/docs/flows/customer-auth-onboarding-flow.md) -> [customer-app/lib/features/auth/README.md](/Users/andremacmini/Deliberry/customer-app/lib/features/auth/README.md)
- Home, addresses, or group-order change:
  - relevant runtime-truth or flow doc -> relevant local README -> screen code
- Profile, settings, notifications, or reviews change:
  - [docs/flows/customer-profile-settings-flow.md](/Users/andremacmini/Deliberry/docs/flows/customer-profile-settings-flow.md) -> relevant local README -> screen code
