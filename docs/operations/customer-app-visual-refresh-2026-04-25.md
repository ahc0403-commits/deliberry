# Customer App Visual Refresh — 2026-04-25

Status: active
Authority: operational
Surface: customer-app
Domains: ui-refresh, design-implementation, verification
Last updated: 2026-04-28

## Purpose

Capture the approved customer-app visual refresh that updated the primary mobile surfaces without changing route ownership, runtime ownership, or excluded-feature scope.

## Scope

- customer entry
- auth
- guest entry
- home
- search
- store detail
- cart
- checkout
- shared customer presentation widgets
- customer theme tokens

## Design Direction

- Shift the customer app from the earlier warm beige treatment to a white-first commercial delivery surface.
- Re-center the visual language around strong delivery-red CTA contrast instead of mixed coral/amber campaign emphasis.
- Keep one strong dark hero anchor where needed, but let list surfaces, store browsing, cart, and checkout feel fast, bright, and retail-oriented.
- Preserve the current route structure and ordering placeholder rules while upgrading hierarchy, spacing, and legibility.

## Concrete Implementation Changes

- [app_theme.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/theme/app_theme.dart)
  - background changed to white-first delivery-app canvas
  - neutral surfaces and borders tightened around a cleaner grayscale hierarchy
  - primary palette moved to strong delivery-red CTA emphasis
  - shared shadow token introduced for consistent card depth
- [widgets.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/common/presentation/widgets.dart)
  - hero card changed from bright gradient treatment to ink-dark utility card
  - store cards, search bar, CTA bar, empty state, promo card, and chips updated to a DoorDash-like delivery hierarchy
  - sticky cart/checkout emphasis strengthened with clearer red CTA treatment
- [customer_entry_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/app/entry/customer_entry_screen.dart)
  - landing hero rebuilt as a single dark brand block on white
  - trust badges simplified to match the new visual system
- [home_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/home/presentation/home_screen.dart)
  - home app bar no longer implies a back button
  - delivery-location emphasis, search entry, category browsing, and promo/store hierarchy aligned to a global delivery-app pattern
- [auth_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/auth/presentation/auth_screen.dart)
  - auth background aligned to the white-shell visual system
- [guest_entry_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/auth/presentation/guest_entry_screen.dart)
  - decorative pink illustration block removed
  - guest mode now uses the same dark utility hero language as the rest of the refreshed customer entry surfaces
- [checkout_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/checkout/presentation/checkout_screen.dart)
  - payment selection copy now distinguishes cash checkout from VNPAY sandbox card/pay testing
  - VNPAY sandbox methods route to order status with payment still pending instead of implying completed payment
- [order_completion_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/orders/presentation/order_completion_screen.dart)
  - customer-facing copy changed from `Order complete` to `Order submitted`
- [mock_data.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/data/mock_data.dart)
  - promo/category fixtures remain presentation seeds, but the UI no longer depends on legacy warm-beige visual assumptions

## Boundaries Confirmed

- No route ownership changed.
- No runtime ownership moved out of `CustomerRuntimeController`, `AppRouter`, or `CustomerSessionController`.
- No payment verification logic was added.
- No excluded feature was introduced.
- Repo-level `shared` was not used for presentation logic.

## Verification Performed

- `flutter analyze`
- `flutter test`
- Flutter web release build verification (`flutter build web`)
- Android emulator manual verification on `emulator-5554`
- Cross-surface Playwright screenshot verification at 375px, 390px, 768px, 1024px, and 1440px using the built web surface

## Android Verification Notes

- Home, auth, and guest-facing refreshed surfaces rendered correctly on Android emulator after the palette changes.
- A promo-card `RenderFlex overflowed by 24 pixels on the bottom` issue was reproduced on Android during the first promo refresh pass.
- The issue was fixed by tightening promo card padding/type scale and increasing the home promo rail height.
- Final Android verification passed with no remaining overflow on the refreshed promo rail.

## Current Truth After Refresh

- The customer-app now uses a white-shell delivery-app canvas as the default presentation base.
- Red CTA emphasis is the dominant commercial action signal across browse, cart, and checkout surfaces.
- Dark hero cards remain in entry and selected emphasis areas, but list-heavy shopping surfaces are intentionally brighter and faster-scanning.
- Entry, auth, guest, home, store, cart, checkout, orders, and shared widget surfaces now share one consistent delivery-product hierarchy instead of mixed campaign/dashboard treatments.
