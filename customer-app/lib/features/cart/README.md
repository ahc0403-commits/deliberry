# Customer Cart Feature

Status: active
Authority: operational
Surface: customer-app
Domains: cart, promo, quantity, checkout-handoff
Last updated: 2026-03-16
Last verified: 2026-03-16
Retrieve when:
- editing cart item mutations, promo behavior, or cart-to-checkout handoff
- changing empty vs populated cart states
Related files:
- customer-app/lib/features/cart/presentation/cart_screen.dart
- customer-app/lib/core/data/customer_runtime_controller.dart
- customer-app/lib/features/common/presentation/widgets.dart

## Purpose

Own the editable basket state between store/menu browsing and checkout.

## Primary routes/screens

- `/cart` -> `CartScreen`

## Source of truth

- Cart items, totals, promo state, and selected store live in [customer_runtime_controller.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/data/customer_runtime_controller.dart)
- Route ownership lives in [app_router.dart](/Users/andremacmini/Deliberry/customer-app/lib/app/router/app_router.dart)

## Key files to read first

- [cart_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/cart/presentation/cart_screen.dart)
- [customer_runtime_controller.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/data/customer_runtime_controller.dart)
- [route_names.dart](/Users/andremacmini/Deliberry/customer-app/lib/app/router/route_names.dart)

## Related shared widgets/patterns

- [widgets.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/common/presentation/widgets.dart)
  - `EmptyState`
  - `PriceRow`
  - `BottomCTABar`
  - `QuantityControl`
- Governed as `Cart / Checkout` in [SCREEN_TYPES.md](/Users/andremacmini/Deliberry/docs/ui-governance/SCREEN_TYPES.md)

## Related governance docs

- [NAVIGATION_TRUTH_MAP.md](/Users/andremacmini/Deliberry/docs/ui-governance/NAVIGATION_TRUTH_MAP.md)
- [RUNTIME_REALITY_MAP.md](/Users/andremacmini/Deliberry/docs/ui-governance/RUNTIME_REALITY_MAP.md)
- [INTERACTION_PATTERNS.md](/Users/andremacmini/Deliberry/docs/ui-governance/INTERACTION_PATTERNS.md)
- [STATE_MODELING_RULES.md](/Users/andremacmini/Deliberry/docs/ui-governance/STATE_MODELING_RULES.md)

## Known limitations / partial-support truth

- Promo behavior is local-only and intentionally limited to demo-safe rules.
- Cart state is durable within the app session only. It is not persisted beyond the local runtime.
- Totals are runtime-real for the current session, but still computed from mock-backed catalog data.

## Safe modification guidance

- Keep all item mutation, promo, subtotal, and store-replacement logic inside [customer_runtime_controller.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/data/customer_runtime_controller.dart).
- If you change cart totals or promo rules, inspect checkout and reorder behavior in the same pass.
- Preserve the empty-cart branch and avoid adding transactional UI when `cartItems` is empty.

## What not to change casually

- Do not duplicate cart math in `cart_screen.dart`.
- Do not bypass `CustomerRuntimeController` for quantity updates or promo application.
- Do not route cart directly into orders or status screens without going through checkout submission.
