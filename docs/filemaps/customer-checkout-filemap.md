# Customer Checkout Filemap

Status: active
Authority: operational
Surface: customer-app
Domains: checkout, cart, submission, addresses
Last updated: 2026-03-16
Last verified: 2026-03-16
Retrieve when:
- changing checkout submission or totals
- debugging cart-to-checkout-to-order-status continuity
Related files:
- customer-app/lib/features/checkout/presentation/checkout_screen.dart
- customer-app/lib/core/data/customer_runtime_controller.dart
- customer-app/lib/features/cart/README.md

## Purpose

Point to the smallest file cluster for checkout behavior, submission truth, and adjacent cart/address/order handoff.

## When to retrieve this filemap

- Checkout totals or empty-state behavior are wrong.
- Address changes do not appear in checkout.
- Submitting checkout does not create the expected order or route correctly.

## Entry files

- [checkout_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/checkout/presentation/checkout_screen.dart)
- [customer_runtime_controller.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/data/customer_runtime_controller.dart)

## Adjacent files usually read together

- [cart_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/cart/presentation/cart_screen.dart)
- [order_status_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/orders/presentation/order_status_screen.dart)
- [orders_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/orders/presentation/orders_screen.dart)
- [addresses_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/addresses/presentation/addresses_screen.dart)
- [app_router.dart](/Users/andremacmini/Deliberry/customer-app/lib/app/router/app_router.dart)
- [route_names.dart](/Users/andremacmini/Deliberry/customer-app/lib/app/router/route_names.dart)

## Source-of-truth files

- [customer_runtime_controller.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/data/customer_runtime_controller.dart)
  - cart snapshot
  - selected address
  - promo and totals
  - `submitOrder`
- [app_router.dart](/Users/andremacmini/Deliberry/customer-app/lib/app/router/app_router.dart)
  - `/checkout` and `/orders/status` route wiring

## Files that are often mistaken as source of truth but are not

- [checkout_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/checkout/presentation/checkout_screen.dart)
  - owns presentation and local submit UI state, not persisted order truth
- [mock_data.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/data/mock_data.dart)
  - provides fixture values, not authoritative checkout state
- [widgets.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/common/presentation/widgets.dart)
  - shared UI only

## High-risk edit points

- `_placeOrder()` in [checkout_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/checkout/presentation/checkout_screen.dart)
- `submitOrder`, `cartTotal`, `deliveryAddress`, and cart snapshot fields in [customer_runtime_controller.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/data/customer_runtime_controller.dart)
- route transition to `RouteNames.orderStatus` in [checkout_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/checkout/presentation/checkout_screen.dart) and [app_router.dart](/Users/andremacmini/Deliberry/customer-app/lib/app/router/app_router.dart)

## Related governance docs

- [NAVIGATION_TRUTH_MAP.md](/Users/andremacmini/Deliberry/docs/ui-governance/NAVIGATION_TRUTH_MAP.md)
- [RUNTIME_REALITY_MAP.md](/Users/andremacmini/Deliberry/docs/ui-governance/RUNTIME_REALITY_MAP.md)
- [STABILIZATION_REPORT.md](/Users/andremacmini/Deliberry/docs/ui-governance/STABILIZATION_REPORT.md)
- [STATE_MODELING_RULES.md](/Users/andremacmini/Deliberry/docs/ui-governance/STATE_MODELING_RULES.md)

## Related local feature READMEs

- [checkout/README.md](/Users/andremacmini/Deliberry/customer-app/lib/features/checkout/README.md)
- [cart/README.md](/Users/andremacmini/Deliberry/customer-app/lib/features/cart/README.md)
- [orders/README.md](/Users/andremacmini/Deliberry/customer-app/lib/features/orders/README.md)

## Safe edit sequence

1. Confirm the intended flow contract in [checkout/README.md](/Users/andremacmini/Deliberry/customer-app/lib/features/checkout/README.md) and [NAVIGATION_TRUTH_MAP.md](/Users/andremacmini/Deliberry/docs/ui-governance/NAVIGATION_TRUTH_MAP.md).
2. Change runtime submission or totals in [customer_runtime_controller.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/data/customer_runtime_controller.dart) first.
3. Update [checkout_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/checkout/presentation/checkout_screen.dart) to reflect the new truth.
4. Verify the adjacent order-status and orders-list read path.
5. Re-check address handoff if the change touches delivery context.
