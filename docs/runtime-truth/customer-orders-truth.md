# Customer Orders Truth

Status: active
Authority: operational
Surface: customer-app
Domains: orders, order-records, reorder, status
Last updated: 2026-03-28
Last verified: 2026-03-28
Retrieve when:
- changing order creation, lookup, detail rendering, or reorder behavior
- debugging order-id continuity across list, detail, status, and reviews
Related files:
- customer-app/lib/core/data/customer_runtime_controller.dart
- docs/filemaps/customer-orders-filemap.md
- customer-app/lib/features/orders/README.md

## Purpose

Document where order truth lives after checkout and how list/detail/status screens read it.

## Real source-of-truth location(s)

- Runtime owner: [customer_runtime_controller.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/data/customer_runtime_controller.dart)
- Persisted read/write gateway: [supabase_customer_runtime_gateway.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/data/supabase_customer_runtime_gateway.dart)
- Route threading owner: [app_router.dart](/Users/andremacmini/Deliberry/customer-app/lib/app/router/app_router.dart)

## What state is owned there

- hydrated active/history order records for the signed-in customer
- persisted order creation input and line items
- order lookup by id
- reorder source items and selected store restoration

## What screens depend on it

- [orders_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/orders/presentation/orders_screen.dart)
- [order_detail_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/orders/presentation/order_detail_screen.dart)
- [order_status_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/orders/presentation/order_status_screen.dart)
- [reviews_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/reviews/presentation/reviews_screen.dart)
- checkout submission path in [checkout_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/checkout/presentation/checkout_screen.dart)

## What is derived vs authoritative

- Authoritative:
  - persisted orders coordinated by `submitOrder`, `refreshPersistedRuntime`, and the Supabase gateway
  - `submitOrder`
  - `findOrderRecordById`
  - `reorder`
- Derived:
  - `activeOrders`
  - `pastOrders`
  - order detail/status/review screen content that resolves from a record
- Presentation-only:
  - static timeline rendering in [order_status_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/orders/presentation/order_status_screen.dart)

## What is still shallow / partial / local-only

- Order creation and order reads are persisted for authenticated customers.
- Order status progression is not live and not event-driven.
- Order records are still normalized into screen-facing view models inside `CustomerRuntimeController`.
- Reviews read order identity coherently, but review save is still local preview behavior only.
- `/reviews` now expects a valid order-linked context; without one, the screen degrades to an honest preview state and sends the user back to `/orders`.

## Known risks

- `findOrderRecordById()` has a fallback path when `orderId` is null; careless route changes can hide missing arguments.
- `submitOrder()` creates a new active order and clears the cart in the same method.
- `reorder()` repopulates the cart from the order record; changing order item structure can break reorder silently.

## Safe modification guidance

- Change record creation or lookup in [customer_runtime_controller.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/data/customer_runtime_controller.dart) first.
- Then verify:
  - orders tab behavior
  - detail/status route reads
  - reorder into cart
  - reviews entry from order detail
- Preserve one `orderId` path across router and screen constructors.

## Related filemaps

- [customer-orders-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/customer-orders-filemap.md)
- [customer-checkout-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/customer-checkout-filemap.md)
- [customer-runtime-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/customer-runtime-filemap.md)

## Related governance docs

- [RUNTIME_REALITY_MAP.md](/Users/andremacmini/Deliberry/docs/ui-governance/RUNTIME_REALITY_MAP.md)
- [NAVIGATION_TRUTH_MAP.md](/Users/andremacmini/Deliberry/docs/ui-governance/NAVIGATION_TRUTH_MAP.md)
- [STABILIZATION_REPORT.md](/Users/andremacmini/Deliberry/docs/ui-governance/STABILIZATION_REPORT.md)
