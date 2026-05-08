# Customer Checkout Orders Flow

Status: active
Authority: operational
Surface: customer-app
Domains: checkout, orders, status, reorder
Last updated: 2026-05-06
Last verified: 2026-05-06
Retrieve when:
- changing checkout submission or downstream order reading
- debugging cart -> checkout -> order status -> orders continuity
Related files:
- customer-app/lib/core/data/customer_runtime_controller.dart
- docs/filemaps/customer-checkout-filemap.md
- docs/filemaps/customer-orders-filemap.md

## Purpose

Document the transactional flow from an existing cart into persisted order creation and later order follow-up routes.

## Entry points

- `/cart`
- `/checkout`
- `/orders`
- `/orders/detail`

## Main route sequence

- Primary transaction path:
  - `/cart` -> `/checkout` -> `/orders/status` -> `/orders`
- History/detail path:
  - `/orders` -> `/orders/detail` -> `/reviews`
- Reorder path:
  - `/orders` or `/orders/detail` -> reorder -> `/cart`

## Source-of-truth files involved

- [customer_runtime_controller.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/data/customer_runtime_controller.dart)
  - cart snapshot
  - delivery address
  - `submitOrder`
  - active/past order records
  - `findOrderRecordById`
  - `reorder`
- [app_router.dart](/Users/andremacmini/Deliberry/customer-app/lib/app/router/app_router.dart)
  - route gating and order-id route threading

## Key dependent screens/files

- [cart_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/cart/presentation/cart_screen.dart)
- [checkout_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/checkout/presentation/checkout_screen.dart)
- [orders_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/orders/presentation/orders_screen.dart)
- [order_status_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/orders/presentation/order_status_screen.dart)
- [order_detail_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/orders/presentation/order_detail_screen.dart)
- [reviews_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/reviews/presentation/reviews_screen.dart)
- [addresses_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/addresses/presentation/addresses_screen.dart)

## What is authoritative vs derived in this flow

- Authoritative:
  - cart items at submit time
  - selected address at submit time
  - active/past order records
  - signed-in order-linked review persistence keyed by `orderId`
  - route-owned `orderId`
- Derived:
  - totals shown on checkout and detail screens
  - active/history tab lists
  - detail/status presentation content resolved from a record
- Presentation-only:
  - status timeline visuals
  - payment option UI chrome

## Payment handoff truth

- `submitOrder` persists the order first and keeps `payment_status = pending`.
- If the selected payment method is a VNPAY sandbox option, checkout then asks `create-vnpay-sandbox-payment` for a signed hosted URL.
- Card checkout may omit `bank_code`, which means VNPAY owns the issuing-bank selection and issuer-specific authentication UX.
- VNPAY return and IPN remain display/verification-only at this stage and do not transition Deliberry payment state.

## Known shallow / partial / local-only limits

- Payment is placeholder-only in the product sense: sandbox URL creation exists for contract readiness, but Deliberry still does not treat provider callbacks as payment completion.
- Order creation is persisted for authenticated customers.
- Order status is not realtime.
- Reviews are flow-connected and persisted for signed-in customers, and the saved review now hydrates back into runtime so `/orders/detail` and `/reviews` resolve the same signed-in review state after refresh.
- Reviews still require valid order-linked context; when that context is missing, the screen falls back to an honest no-context state.

## Common edit mistakes

- Changing checkout fields without checking order detail/status read paths.
- Treating `order_status_screen.dart` as status truth instead of a presentation over a record.
- Breaking reorder by changing record item structure without updating `reorder()`.
- Allowing missing `orderId` route arguments to hide errors behind fallback behavior.
- Letting the order-detail review CTA imply writable review access before delivery is complete.

## Related filemaps

- [customer-checkout-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/customer-checkout-filemap.md)
- [customer-orders-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/customer-orders-filemap.md)
- [customer-runtime-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/customer-runtime-filemap.md)

## Related runtime-truth docs

- [customer-runtime-truth.md](/Users/andremacmini/Deliberry/docs/runtime-truth/customer-runtime-truth.md)
- [customer-cart-truth.md](/Users/andremacmini/Deliberry/docs/runtime-truth/customer-cart-truth.md)
- [customer-address-truth.md](/Users/andremacmini/Deliberry/docs/runtime-truth/customer-address-truth.md)
- [customer-orders-truth.md](/Users/andremacmini/Deliberry/docs/runtime-truth/customer-orders-truth.md)

## Related governance docs

- [NAVIGATION_TRUTH_MAP.md](/Users/andremacmini/Deliberry/docs/ui-governance/NAVIGATION_TRUTH_MAP.md)
- [RUNTIME_REALITY_MAP.md](/Users/andremacmini/Deliberry/docs/ui-governance/RUNTIME_REALITY_MAP.md)
- [STABILIZATION_REPORT.md](/Users/andremacmini/Deliberry/docs/ui-governance/STABILIZATION_REPORT.md)
