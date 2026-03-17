# Screen Types

Status: active
Authority: advisory
Surface: customer-app
Domains: screen-taxonomy, composition, cta-rules
Last updated: 2026-03-16
Last verified: 2026-03-16
Retrieve when:
- classifying a customer screen before changing layout or actions
- checking required and forbidden blocks for a customer route
Related files:
- docs/ui-governance/SCREEN_COMPOSITION_RULES.md
- docs/ui-governance/SCREEN_PATTERN_MATRIX.md
- customer-app/lib/app/router/app_router.dart

## 1. Entry / Landing
- Purpose: start the customer journey and route users into auth or guest access.
- Required blocks:
  - branded hero
  - trust indicators
  - one primary CTA
  - one secondary branch
  - low-priority legal copy
- Optional blocks:
  - promo/social proof
  - lightweight session redirect state
- Forbidden blocks:
  - dense settings
  - long forms
  - account management
- CTA rules:
  - one filled primary CTA
  - one lower-emphasis alternate path
- Routing expectations:
  - must redirect signed-in, guest, onboarding-pending, and otp-pending users correctly
- Example:
  - `customer-app/lib/app/entry/customer_entry_screen.dart`

## 2. Auth
- Purpose: authenticate the user with minimum friction.
- Required blocks:
  - task title
  - clear input or method selection
  - one primary continuation CTA
  - helper text
- Optional blocks:
  - tertiary link to change phone or continue as guest
  - social alternatives
- Forbidden blocks:
  - marketing feed content
  - unrelated settings
- CTA rules:
  - filled CTA advances auth
  - alternatives must be secondary or tertiary
- Routing expectations:
  - stays in `/auth/*` until auth state changes
- Examples:
  - `customer-app/lib/features/auth/presentation/auth_screen.dart`
  - `customer-app/lib/features/auth/presentation/auth_phone_screen.dart`
  - `customer-app/lib/features/auth/presentation/auth_otp_screen.dart`
  - `customer-app/lib/features/auth/presentation/guest_entry_screen.dart`

## 3. Onboarding
- Purpose: complete first-run education or minimal setup before main shell entry.
- Required blocks:
  - progress indicator
  - single narrative focus per page
  - bottom primary CTA
- Optional blocks:
  - skip
  - lightweight preference capture
- Forbidden blocks:
  - bottom tab shell
  - unrelated account settings
- CTA rules:
  - CTA copy must match progression state
- Routing expectations:
  - exits to `/home` only after completion
- Example:
  - `customer-app/lib/features/onboarding/presentation/onboarding_screen.dart`

## 4. Feed / Discovery
- Purpose: drive browsing, comparison, and store entry.
- Required blocks:
  - page context
  - search entry or browse controls
  - category/filter controls
  - content list or grid
- Optional blocks:
  - promo rail
  - featured carousel
  - location context
- Forbidden blocks:
  - destructive account actions
  - dense form sections
- CTA rules:
  - primary action is usually card tap or search entry, not a full-width button
- Routing expectations:
  - should lead to search, filters, or store detail
- Examples:
  - `customer-app/lib/features/home/presentation/home_screen.dart`
  - `customer-app/lib/features/home/presentation/discovery_screen.dart`

## 5. Search / Filter
- Purpose: refine intent quickly and turn it into results.
- Required blocks:
  - search field or active filter controls
  - recent/history or result list
  - visible empty state for no results
- Optional blocks:
  - sort
  - category shortcuts
  - sticky apply bar
- Forbidden blocks:
  - hidden filter state
  - unrelated marketing content below results
- CTA rules:
  - results screens use item taps as primary continuation
  - filter screen uses one sticky apply CTA
- Routing expectations:
  - `/search` owns query entry
  - `/search/filter` owns explicit filter editing
- Examples:
  - `customer-app/lib/features/search/presentation/search_screen.dart`
  - `customer-app/lib/features/search/presentation/filter_screen.dart`

## 6. Detail
- Purpose: show one store or one order in depth.
- Required blocks:
  - strong header/context
  - metadata summary
  - actionable details
- Optional blocks:
  - hero media/color
  - secondary actions such as help, share, favorite
- Forbidden blocks:
  - unrelated cross-sell that interrupts the primary detail
- CTA rules:
  - primary CTA should move to the next logical step
- Routing expectations:
  - receives context through route arguments or selected item state
- Examples:
  - `customer-app/lib/features/store/presentation/store_screen.dart`
  - `customer-app/lib/features/orders/presentation/order_detail_screen.dart`

## 7. Menu Browsing
- Purpose: let users compare items and add them to cart efficiently.
- Required blocks:
  - category selector
  - item list
  - persistent cart continuation
- Optional blocks:
  - summary header
  - search within menu
- Forbidden blocks:
  - checkout-level forms
- CTA rules:
  - item-level add actions are local
  - cart CTA is persistent and global to the screen
- Routing expectations:
  - exits to `/cart`
- Examples:
  - `customer-app/lib/features/store/presentation/store_screen.dart`
  - `customer-app/lib/features/store/presentation/menu_browsing_screen.dart`

## 8. Cart / Checkout
- Purpose: review, edit, and confirm an order.
- Required blocks:
  - item or order summary
  - price breakdown
  - one persistent bottom CTA
- Optional blocks:
  - promo entry
  - notes/instructions
  - payment selection
- Forbidden blocks:
  - competing promo rails
  - unnecessary alternate routes above the primary CTA
- CTA rules:
  - cart CTA advances to checkout
  - checkout CTA completes the order
- Routing expectations:
  - cart leads to checkout
  - checkout leads to post-order follow-up
- Examples:
  - `customer-app/lib/features/cart/presentation/cart_screen.dart`
  - `customer-app/lib/features/checkout/presentation/checkout_screen.dart`

## 9. Order Tracking
- Purpose: help users understand order progress and review order history.
- Required blocks:
  - status or order context
  - timeline or status badge
  - support/help path
- Optional blocks:
  - ETA
  - reorder
  - receipt detail
- Forbidden blocks:
  - vague status language
  - decorative motion implying real-time tracking when unavailable
- CTA rules:
  - help and reorder are secondary
- Routing expectations:
  - active orders lead to status
  - past orders lead to detail/review
- Examples:
  - `customer-app/lib/features/orders/presentation/orders_screen.dart`
  - `customer-app/lib/features/orders/presentation/order_status_screen.dart`
  - `customer-app/lib/features/orders/presentation/order_detail_screen.dart`

## 10. Profile Hub
- Purpose: provide a clean account hub with routes into account features.
- Required blocks:
  - user summary
  - grouped navigation rows
  - isolated destructive action
- Optional blocks:
  - loyalty or profile badge
- Forbidden blocks:
  - editable forms inline unless the screen is specifically an edit form
- CTA rules:
  - rows are navigational
  - destructive action sits apart
- Routing expectations:
  - routes to addresses, notifications, reviews, settings, and orders
- Example:
  - `customer-app/lib/features/profile/presentation/profile_screen.dart`

## 11. Form / Edit
- Purpose: capture or edit structured user information.
- Required blocks:
  - labeled input controls
  - validation
  - clear completion CTA
- Optional blocks:
  - sheet presentation
  - helper text
- Forbidden blocks:
  - hidden primary action
  - hint-only labeling for important fields
- CTA rules:
  - save/add/continue label must reflect the action
- Routing expectations:
  - may live inside full screen or bottom sheet
- Examples:
  - `customer-app/lib/features/auth/presentation/auth_phone_screen.dart`
  - `customer-app/lib/features/addresses/presentation/addresses_screen.dart` sheet
  - `customer-app/lib/features/checkout/presentation/checkout_screen.dart`

## 12. Settings
- Purpose: change preferences, inspect legal/support paths, and handle destructive account actions.
- Required blocks:
  - uppercase section labels
  - grouped settings rows
  - toggle pattern for preferences
  - isolated destructive group
- Optional blocks:
  - version row
  - disclosure rows
- Forbidden blocks:
  - mixed feed content
  - multiple destructive actions without grouping
- CTA rules:
  - settings rows use disclosure navigation or toggles
  - destructive action requires confirmation
- Routing expectations:
  - lives under profile/account routes
- Example:
  - `customer-app/lib/features/settings/presentation/settings_screen.dart`

## 13. Support / Notification
- Purpose: surface user communication, updates, or support-entry actions.
- Required blocks:
  - clear message list or support options
  - read/unread clarity if relevant
  - empty state
- Optional blocks:
  - bulk action
  - lightweight banner summary
- Forbidden blocks:
  - hidden read state
  - reliance on color alone for unread meaning
- CTA rules:
  - message tap marks progress
  - bulk actions stay secondary
- Routing expectations:
  - accessed through profile/account
- Examples:
  - `customer-app/lib/features/notifications/presentation/notifications_screen.dart`
  - help actions in order screens

## 14. Empty / Success / Error / Locked States
- Purpose: explain the current state and offer recovery or continuation.
- Required blocks:
  - semantic icon or status marker
  - one-sentence title
  - one-sentence explanation
- Optional blocks:
  - single recovery CTA
- Forbidden blocks:
  - generic “Something went wrong” without action
  - decorative filler unrelated to next step
- CTA rules:
  - one clear recovery path only
- Routing expectations:
  - must keep the user in the current flow when possible
- Examples:
  - `EmptyState` in `customer-app/lib/features/common/presentation/widgets.dart`
  - review success view in `customer-app/lib/features/reviews/presentation/reviews_screen.dart`
  - hydration/loading redirects in `customer-app/lib/app/entry/customer_entry_screen.dart`
