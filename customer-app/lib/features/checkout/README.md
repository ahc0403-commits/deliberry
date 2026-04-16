# Customer Checkout Feature

Status: active
Authority: operational
Surface: customer-app
Domains: checkout, order-submission, address-handoff
Last updated: 2026-04-15
Last verified: 2026-04-15
Retrieve when:
- editing checkout submission, payment selection, or address/order handoff
- changing the transition from cart to order status
Related files:
- customer-app/lib/features/checkout/presentation/checkout_screen.dart
- customer-app/lib/core/data/customer_runtime_controller.dart
- customer-app/lib/features/addresses/presentation/addresses_screen.dart

## Purpose

Own the final order-confirmation step from cart snapshot to authenticated persisted order creation.

## Primary routes/screens

- `/checkout` -> `CheckoutScreen`

## Source of truth

- Cart snapshot, selected address, and order submission orchestration live in [customer_runtime_controller.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/data/customer_runtime_controller.dart)
- Persisted order creation for signed-in customers flows through [supabase_customer_runtime_gateway.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/data/supabase_customer_runtime_gateway.dart)
- Checkout route ownership lives in [app_router.dart](/Users/andremacmini/Deliberry/customer-app/lib/app/router/app_router.dart)
- Address management feeding checkout lives in [addresses_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/addresses/presentation/addresses_screen.dart)

## Key files to read first

- [checkout_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/checkout/presentation/checkout_screen.dart)
- [customer_runtime_controller.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/data/customer_runtime_controller.dart)
- [order_status_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/orders/presentation/order_status_screen.dart)
- [route_names.dart](/Users/andremacmini/Deliberry/customer-app/lib/app/router/route_names.dart)

## Related shared widgets/patterns

- [widgets.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/common/presentation/widgets.dart)
  - `BottomCTABar`
  - `PriceRow`
  - `EmptyState`
- Governed as `Cart / Checkout` in [SCREEN_TYPES.md](/Users/andremacmini/Deliberry/docs/ui-governance/SCREEN_TYPES.md)

## Related governance docs

- [NAVIGATION_TRUTH_MAP.md](/Users/andremacmini/Deliberry/docs/ui-governance/NAVIGATION_TRUTH_MAP.md)
- [RUNTIME_REALITY_MAP.md](/Users/andremacmini/Deliberry/docs/ui-governance/RUNTIME_REALITY_MAP.md)
- [STABILIZATION_REPORT.md](/Users/andremacmini/Deliberry/docs/ui-governance/STABILIZATION_REPORT.md)
- [STATE_MODELING_RULES.md](/Users/andremacmini/Deliberry/docs/ui-governance/STATE_MODELING_RULES.md)

## Known limitations / partial-support truth

- Payment is intentionally placeholder-only by product rule.
- Guest users are redirected to [auth_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/auth/presentation/auth_screen.dart) before order submission can proceed; carts stay intact across that handoff.
- `_placeOrder()` still uses a short artificial submit delay for local feedback before calling `submitOrder`.
- Order creation is persisted for authenticated customers.
- Payment verification remains intentionally unimplemented.

## Safe modification guidance

- Keep order submission orchestration in [customer_runtime_controller.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/data/customer_runtime_controller.dart), not inside the widget tree.
- If you change checkout submission fields, verify the same data can still be read coherently by orders list, order detail, and order status.
- Treat address, notes, payment selection, and summary as one handoff bundle. Do not update one in isolation without checking submission behavior.

## What not to change casually

- Do not bypass cart emptiness guards.
- Do not present card/payment options as live payment processing.
- Do not send checkout straight into `/orders` if the current flow contract is `/checkout` -> `/orders/status`.
