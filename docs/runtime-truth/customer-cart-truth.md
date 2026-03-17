# Customer Cart Truth

Status: active
Authority: operational
Surface: customer-app
Domains: cart, promo, totals, selected-store
Last updated: 2026-03-16
Last verified: 2026-03-16
Retrieve when:
- changing cart mutations, promo behavior, or store-to-cart continuity
- debugging totals or cart replacement behavior
Related files:
- customer-app/lib/core/data/customer_runtime_controller.dart
- docs/filemaps/customer-checkout-filemap.md
- customer-app/lib/features/cart/README.md

## Purpose

Document where cart truth lives and what is authoritative versus derived in the current customer app.

## Real source-of-truth location(s)

- Authoritative mutable owner: [customer_runtime_controller.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/data/customer_runtime_controller.dart)
  - `_cartItems`
  - `_selectedStoreId`
  - `_promoCode`
  - `_promoDiscount`

## What state is owned there

- cart line items
- selected store for the active basket
- applied demo promo code and discount
- store-replacement behavior when adding items from another store

## What screens depend on it

- [store_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/store/presentation/store_screen.dart)
- [menu_browsing_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/store/presentation/menu_browsing_screen.dart)
- [cart_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/cart/presentation/cart_screen.dart)
- [checkout_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/checkout/presentation/checkout_screen.dart)
- order reorder path via [orders_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/orders/presentation/orders_screen.dart) and [order_detail_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/orders/presentation/order_detail_screen.dart)

## What is derived vs authoritative

- Authoritative:
  - `_cartItems`
  - `_selectedStoreId`
  - `_promoCode`
  - `_promoDiscount`
- Derived:
  - `selectedStore`
  - `cartItemCount`
  - `cartSubtotal`
  - `cartDeliveryFee`
  - `cartServiceFee`
  - `cartTotal`
  - `hasPromoApplied`
- Fixture-only:
  - item/menu metadata from [mock_data.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/data/mock_data.dart)

## What is still shallow / partial / local-only

- Cart truth is local-session only. Closing the session loses it.
- Promo support is intentionally shallow: one demo-safe code path.
- Cart still depends on mock-backed menu items and store fixtures.

## Known risks

- `addMenuItem()` implicitly clears the old cart when switching stores; that is a high-impact behavior.
- Totals are derived from mutable cart state plus fixture fee values. Changes can ripple into checkout and reorder immediately.
- Duplicating cart math or promo logic in the widget layer will cause drift.

## Safe modification guidance

- Change cart mutation methods first:
  - `addMenuItem`
  - `updateCartQuantity`
  - `removeCartItem`
  - `clearCart`
  - `applyPromoCode`
  - `removePromoCode`
- Then verify cart UI, checkout totals, and reorder behavior together.
- Keep derived totals derived. Do not introduce a second totals source in presentation files.

## Related filemaps

- [customer-runtime-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/customer-runtime-filemap.md)
- [customer-checkout-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/customer-checkout-filemap.md)

## Related governance docs

- [RUNTIME_REALITY_MAP.md](/Users/andremacmini/Deliberry/docs/ui-governance/RUNTIME_REALITY_MAP.md)
- [STABILIZATION_REPORT.md](/Users/andremacmini/Deliberry/docs/ui-governance/STABILIZATION_REPORT.md)
- [INTERACTION_PATTERNS.md](/Users/andremacmini/Deliberry/docs/ui-governance/INTERACTION_PATTERNS.md)
