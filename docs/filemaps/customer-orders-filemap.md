# Customer Orders Filemap

Status: active
Authority: operational
Surface: customer-app
Domains: orders, detail, status, reorder
Last updated: 2026-03-16
Last verified: 2026-03-16
Retrieve when:
- changing order list/detail/status behavior
- debugging order-id continuity or reorder behavior
Related files:
- customer-app/lib/features/orders/presentation/orders_screen.dart
- customer-app/lib/core/data/customer_runtime_controller.dart
- customer-app/lib/features/orders/README.md

## Purpose

Point to the narrow file cluster for order history, order follow-up routes, and reorder handoff.

## When to retrieve this filemap

- Orders list and detail disagree.
- Order status opens the wrong record or falls back unexpectedly.
- Reorder no longer rebuilds the expected cart.

## Entry files

- [orders_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/orders/presentation/orders_screen.dart)
- [order_detail_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/orders/presentation/order_detail_screen.dart)
- [order_status_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/orders/presentation/order_status_screen.dart)
- [customer_runtime_controller.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/data/customer_runtime_controller.dart)

## Adjacent files usually read together

- [checkout_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/checkout/presentation/checkout_screen.dart)
- [reviews_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/reviews/presentation/reviews_screen.dart)
- [cart_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/cart/presentation/cart_screen.dart)
- [app_router.dart](/Users/andremacmini/Deliberry/customer-app/lib/app/router/app_router.dart)
- [route_names.dart](/Users/andremacmini/Deliberry/customer-app/lib/app/router/route_names.dart)

## Source-of-truth files

- [customer_runtime_controller.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/data/customer_runtime_controller.dart)
  - active and past order records
  - `findOrderRecordById`
  - `submitOrder`
  - `reorder`
- [app_router.dart](/Users/andremacmini/Deliberry/customer-app/lib/app/router/app_router.dart)
  - order route argument threading and auth gating

## Files that are often mistaken as source of truth but are not

- [order_status_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/orders/presentation/order_status_screen.dart)
  - renders a static local timeline, not realtime status truth
- [orders_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/orders/presentation/orders_screen.dart)
  - presentation for active/history tabs, not authoritative order storage
- [mock_data.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/data/mock_data.dart)
  - fixture content and labels only

## High-risk edit points

- `findOrderRecordById`, `submitOrder`, and `reorder` in [customer_runtime_controller.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/data/customer_runtime_controller.dart)
- route argument usage in [order_detail_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/orders/presentation/order_detail_screen.dart) and [order_status_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/orders/presentation/order_status_screen.dart)
- back-navigation behavior from status/detail to `/orders`

## Related governance docs

- [NAVIGATION_TRUTH_MAP.md](/Users/andremacmini/Deliberry/docs/ui-governance/NAVIGATION_TRUTH_MAP.md)
- [RUNTIME_REALITY_MAP.md](/Users/andremacmini/Deliberry/docs/ui-governance/RUNTIME_REALITY_MAP.md)
- [INTERACTION_PATTERNS.md](/Users/andremacmini/Deliberry/docs/ui-governance/INTERACTION_PATTERNS.md)
- [STABILIZATION_REPORT.md](/Users/andremacmini/Deliberry/docs/ui-governance/STABILIZATION_REPORT.md)

## Related local feature READMEs

- [orders/README.md](/Users/andremacmini/Deliberry/customer-app/lib/features/orders/README.md)
- [checkout/README.md](/Users/andremacmini/Deliberry/customer-app/lib/features/checkout/README.md)
- [cart/README.md](/Users/andremacmini/Deliberry/customer-app/lib/features/cart/README.md)

## Safe edit sequence

1. Confirm intended route ownership and back path in [NAVIGATION_TRUTH_MAP.md](/Users/andremacmini/Deliberry/docs/ui-governance/NAVIGATION_TRUTH_MAP.md).
2. Change shared order truth in [customer_runtime_controller.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/data/customer_runtime_controller.dart) first.
3. Update list/detail/status screens to read the new truth without adding local caches.
4. Re-check reorder into cart and review handoff into `/reviews`.
5. Re-check the runtime reality notes if behavior moved from mock-backed to state-real or vice versa.
