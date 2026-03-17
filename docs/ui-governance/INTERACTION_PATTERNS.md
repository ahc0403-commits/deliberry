# Interaction Patterns

Status: active
Authority: advisory
Surface: customer-app
Domains: interactions, navigation, cart, filters
Last updated: 2026-03-16
Last verified: 2026-03-16
Retrieve when:
- wiring or reviewing customer interactions and action feedback
- checking success, failure, and transition behavior for a customer pattern
Related files:
- docs/ui-governance/NAVIGATION_TRUTH_MAP.md
- docs/ui-governance/STATE_MODELING_RULES.md
- customer-app/lib/core/data/customer_runtime_controller.dart

## 1. Navigation Pattern
- Trigger:
  - tapping a store card, order card, nav tab, row tile, or explicit route CTA
- Feedback:
  - immediate route transition
  - no loading overlay for local navigation
- Success behavior:
  - destination preserves screen-type clarity immediately
- Failure behavior:
  - route guards redirect to entry/auth/onboarding instead of leaving a dead route
- State transitions:
  - auth access is controlled in `customer-app/lib/app/router/app_router.dart`
- Examples:
  - `MainShell` tab navigation
  - `StoreCard` tap to `/store`
  - profile rows to addresses/notifications/reviews/settings

## 2. Search Pattern
- Trigger:
  - tap search bar from home or type directly in search
- Feedback:
  - immediate input focus or route entry
  - results update locally as query changes
- Success behavior:
  - show result count and matching store list
- Failure behavior:
  - empty state with recovery copy
- State transitions:
  - idle -> typing -> results or empty
- Examples:
  - `customer-app/lib/features/search/presentation/search_screen.dart`
  - `AppSearchBar` in `widgets.dart`

## 3. Filter Pattern
- Trigger:
  - tap filter icon or sort/filter affordance
- Feedback:
  - open dedicated filter screen
  - selected chips visibly change fill and border
- Success behavior:
  - apply closes the screen and returns to the browse/search context
- Failure behavior:
  - reset restores the default chip state
- State transitions:
  - default -> selected -> applied or reset
- Examples:
  - `customer-app/lib/features/search/presentation/filter_screen.dart`

## 4. Add-To-Cart Pattern
- Trigger:
  - tap add on menu item card
- Feedback:
  - item-level feedback should be immediate
  - cart count and bottom CTA context should update
- Success behavior:
  - cart quantity increases without leaving the browsing context
- Failure behavior:
  - inline, local explanation if item cannot be added
- State transitions:
  - idle -> adding -> updated cart state
- Current example:
  - button placement exists in `MenuItemCard`
- Current risk:
  - in `store_screen.dart` and `menu_browsing_screen.dart`, `onAdd` is wired to no-op. Future implementation must keep the pattern but add real state transition.

## 5. Quantity Update Pattern
- Trigger:
  - tap plus or minus on a quantity control
- Feedback:
  - immediate number change
  - totals update in place
- Success behavior:
  - cart and checkout summaries remain in sync
- Failure behavior:
  - if minimum/maximum rules apply, block the action inline
- State transitions:
  - quantity n -> n+1 or n-1
- Examples:
  - `QuantityControl` in `widgets.dart`
  - cart row usage in `cart_screen.dart`

## 6. Reorder Pattern
- Trigger:
  - tap `Reorder` from past orders or order detail
- Feedback:
  - user should see cart or confirmation of the re-created basket
- Success behavior:
  - cloned items re-enter the order flow safely
- Failure behavior:
  - explain unavailable items or price changes before checkout
- State transitions:
  - past order -> new cart draft
- Current example:
  - `orders_screen.dart` and `order_detail_screen.dart`
- Current risk:
  - current handlers are non-functional. Preserve placement, replace the no-op.

## 7. Share / Copy Pattern
- Trigger:
  - copy code, share link, send via message
- Feedback:
  - snack bar or system share affordance
- Success behavior:
  - explicit confirmation that the content was copied/shared
- Failure behavior:
  - show a lightweight error message and keep the code visible
- State transitions:
  - idle -> copied/shared -> acknowledged
- Example:
  - `customer-app/lib/features/group_order/presentation/group_order_share_screen.dart`

## 8. Tab Pattern
- Trigger:
  - bottom nav tab select
  - orders active/history tab select
- Feedback:
  - immediate content swap
  - selected tab visibly highlighted
- Success behavior:
  - active tab state is obvious before reading content
- Failure behavior:
  - not applicable in normal local state
- State transitions:
  - tab A -> tab B without losing route clarity
- Examples:
  - `MainShell`
  - `OrdersListScreen`

## 9. Modal / Bottom Sheet Pattern
- Trigger:
  - add/edit address
- Feedback:
  - sheet slides up above the current context
- Success behavior:
  - focused, self-contained form task
- Failure behavior:
  - inline validation or dismiss path stays visible
- State transitions:
  - page context -> sheet form -> save/cancel -> return
- Example:
  - address form sheet in `addresses_screen.dart`

## 10. Confirm / Destructive Action Pattern
- Trigger:
  - sign out, delete address, delete account
- Feedback:
  - blocking dialog with destructive action clearly labeled
- Success behavior:
  - user leaves the current state only after explicit confirmation
- Failure behavior:
  - cancel returns to the same screen with no side effects
- State transitions:
  - idle -> confirm dialog -> confirmed or canceled
- Examples:
  - sign out dialog in `profile_screen.dart`
  - delete address dialog in `addresses_screen.dart`
  - delete account dialog in `settings_screen.dart`

## 11. Mark-As-Read / Dismiss Pattern
- Trigger:
  - tap notification
  - tap `Mark all read`
  - dismiss cart row
- Feedback:
  - visual state changes immediately
- Success behavior:
  - unread accents or list rows update in place
- Failure behavior:
  - if persistence fails later, restore state and explain it
- State transitions:
  - unread -> read
  - present -> removed
- Examples:
  - notifications in `notifications_screen.dart`
  - cart `Dismissible` rows in `cart_screen.dart`

## Hard Rules
- Every interactive pattern must define a visible success state.
- No CTA may remain a silent no-op once a screen is considered implementation-ready.
- If a pattern affects totals, counts, unread state, or order state, feedback must be immediate and local before backend confirmation exists.
