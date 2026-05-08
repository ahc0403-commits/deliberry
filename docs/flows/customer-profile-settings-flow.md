# Customer Profile Settings Flow

Status: active
Authority: operational
Surface: customer-app
Domains: profile, settings, account-children
Last updated: 2026-05-05
Last verified: 2026-05-05
Retrieve when:
- changing account child-route behavior from profile
- debugging profile/settings/account navigation and sign-out behavior
Related files:
- customer-app/lib/app/router/app_router.dart
- customer-app/lib/features/profile/presentation/profile_screen.dart
- customer-app/lib/features/settings/presentation/settings_screen.dart

## Purpose

Document the authenticated account hub flow from the shell-owned profile tab into its child routes.

## Entry points

- `/profile` from the main shell
- deep navigation from profile rows into addresses, notifications, reviews, and settings

## Main route sequence

- `/profile` -> `/addresses`
- `/profile` -> `/notifications`
- `/profile` -> `/orders` -> `/orders/detail` -> `/reviews`
- `/profile` -> `/settings`
- `/profile` -> `/settings` -> profile-name edit dialog
- `/profile` -> `/settings` -> change-phone confirmation -> `/auth/phone`
- `/profile` -> `/settings` -> public `/support`, `/privacy`, `/terms` handoff
- `/profile` -> local promotions-and-offers sheet
- `/profile` -> sign out -> `/entry` on next routed access

## Source-of-truth files involved

- [app_router.dart](/Users/andremacmini/Deliberry/customer-app/lib/app/router/app_router.dart)
  - authenticated-only route ownership for `/profile` and account child routes
- [customer_session_controller.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/session/customer_session_controller.dart)
  - sign-out state
- [customer_runtime_controller.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/data/customer_runtime_controller.dart)
  - addresses
  - favorite-store state
  - settings preference state
  - order lookup used by reviews when an order id is passed

## Key dependent screens/files

- [profile_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/profile/presentation/profile_screen.dart)
- [settings_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/settings/presentation/settings_screen.dart)
- [addresses_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/addresses/presentation/addresses_screen.dart)
- [notifications_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/notifications/presentation/notifications_screen.dart)
- [reviews_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/reviews/presentation/reviews_screen.dart)
- [orders_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/orders/presentation/orders_screen.dart)
- [order_detail_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/orders/presentation/order_detail_screen.dart)
- [widgets.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/common/presentation/widgets.dart)

## What is authoritative vs derived in this flow

- Authoritative:
  - authenticated access gating in `AppRouter`
  - sign-out state in `CustomerSessionController`
  - address state in `CustomerRuntimeController`
  - favorite-store state in `CustomerRuntimeController`
  - persisted settings preference state in `CustomerRuntimeController`
  - profile display-name state in `CustomerRuntimeController`
- Derived:
  - profile account summary display derived from local session state
  - profile badges and counts derived from runtime/session state
  - promotions-and-offers sheet content derived from current cart promo state plus customer-home promo fixtures
  - review-entry discovery from the profile row now routes through orders instead of manufacturing standalone review context
- Presentation-only:
  - most profile identity copy
  - support/legal content itself, which remains public-website-owned even when launched from customer settings

## Known shallow / partial / local-only limits

- Profile identity is now phone-session-derived when available, but richer account fields are still not persisted.
- Display-name editing is runtime-real and persists only for signed-in Supabase-backed sessions. Guest/local sessions keep it in memory only for the current app session.
- Change Phone Number is now a real current-device handoff into the phone sign-in route. It signs the customer out on this device and clears session-owned runtime state first; it does not mutate the existing account's phone number server-side.
- Favorite stores are route-real and session-owned, and persist through `actor_profiles.preferences_json` only for signed-in Supabase-backed customers.
- Settings toggles are runtime-owned and persist through `actor_profiles.preferences_json` only for signed-in Supabase-backed customers.
- The destructive settings action now clears current-device session/runtime data; it is not a server-side account-erasure workflow.
- Promotions & Offers is now a local customer-facing sheet, but it is still fixture-backed rather than a persisted promotion engine.
- Several settings and profile actions remain honest unavailable actions rather than fully wired features.
- Reviews are reachable and persisted for signed-in customers, but they still require real order-linked context and retain preview fallback behavior when the route is opened incorrectly.

## Common edit mistakes

- Assuming profile/settings are backed by durable account data when most of the flow is presentational.
- Adding account mutations directly in `ProfileScreen` or `SettingsScreen` without introducing real runtime ownership first.
- Forgetting that `/profile` is shell-owned while its child routes are standalone flow routes.

## Related filemaps

- [customer-runtime-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/customer-runtime-filemap.md)

## Related runtime-truth docs

- [customer-runtime-truth.md](/Users/andremacmini/Deliberry/docs/runtime-truth/customer-runtime-truth.md)
- [customer-address-truth.md](/Users/andremacmini/Deliberry/docs/runtime-truth/customer-address-truth.md)
- [customer-orders-truth.md](/Users/andremacmini/Deliberry/docs/runtime-truth/customer-orders-truth.md)

## Related governance docs

- [NAVIGATION_TRUTH_MAP.md](/Users/andremacmini/Deliberry/docs/ui-governance/NAVIGATION_TRUTH_MAP.md)
- [RUNTIME_REALITY_MAP.md](/Users/andremacmini/Deliberry/docs/ui-governance/RUNTIME_REALITY_MAP.md)
- [STABILIZATION_REPORT.md](/Users/andremacmini/Deliberry/docs/ui-governance/STABILIZATION_REPORT.md)
