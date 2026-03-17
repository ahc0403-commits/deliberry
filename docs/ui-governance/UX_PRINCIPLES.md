# UX Principles

Status: active
Authority: advisory
Surface: customer-app
Domains: ux, principles, cta-priority
Last updated: 2026-03-16
Last verified: 2026-03-16
Retrieve when:
- deciding between speed, trust, clarity, and conversion tradeoffs on customer screens
- checking primary action hierarchy before UI changes
Related files:
- docs/ui-governance/SCREEN_TYPES.md
- docs/ui-governance/COPY_TONE_RULES.md
- docs/ui-governance/INTERACTION_PATTERNS.md

## Product Experience Goals
- Make the customer feel confident that ordering is fast, understandable, and low-risk.
- Get the user from intent to food selection with minimal decision overhead.
- Keep checkout and order follow-up predictable.
- Make account and post-purchase screens feel calm, organized, and recoverable.

## UX Priorities For A Food Delivery Customer App
- `Trust first`: delivery promises, totals, addresses, and order status must read as dependable.
- `Speed second`: search, browse, and add-to-cart flows must reduce taps and avoid unnecessary confirmation.
- `Clarity third`: every screen needs one obvious next action.
- `Conversion fourth`: filled CTA emphasis belongs on the action that advances ordering, not on decorative or optional actions.

## Trust Principles
- Show price, fee, status, and delivery context in stable, repeatable places.
- Use the same status wording and color meaning across orders, badges, and checkout.
- Never present architecture language, debug language, or “placeholder” language to end users except where scope rules require disclosure.
- When behavior is intentionally non-final, keep the UI honest. Example: checkout correctly discloses placeholder payment processing in `customer-app/lib/features/checkout/presentation/checkout_screen.dart`.

## Speed Principles
- Prefer one primary CTA per screen.
- Prefer direct selection for low-risk actions: chips, tabs, quantity changes, mark-as-read, copy code.
- Keep the first useful action above the fold on entry, auth, search, store, cart, and checkout screens.
- Use sticky bottom CTA bars when the user should always be able to continue without scrolling back.

## Clarity Principles
- Every screen must answer three questions quickly:
  - Where am I?
  - What can I do next?
  - What happens if I press the primary action?
- Use section labels, card grouping, and icon chips to separate information, not to decorate empty content.
- Do not make users infer whether they are browsing, editing, reviewing, or confirming. The screen type must be visually obvious.

## Conversion Principles
- Primary action hierarchy in the current app:
  - Start the journey: `Get Started`, `Continue with Phone`
  - Continue a focused flow: `Verify`, `Next`, `Get Started`, `Checkout`, `Place Order`
  - Continue a transactional review: `View Cart`, `Checkout`, `Submit Review`, `Add New Address`
  - Secondary support actions: filter, sort, share, contact, reorder, help, edit
- Use filled buttons only for the action that advances the core user goal on that screen.
- Use outlined buttons for safe alternatives or lower-priority branches.
- Use text actions for tertiary actions such as `Skip`, `Clear all`, `Reset`, `Mark all read`.

## Simplicity Vs Richness Rules
- Choose simplicity when:
  - The screen supports one task only.
  - The user is in auth, onboarding, form entry, or confirmation.
  - Additional content would compete with a critical CTA.
- Choose richness when:
  - The screen is browse-led or content-led.
  - The user needs comparison across stores, categories, or orders.
  - The screen benefits from progressive discovery through cards, tabs, or chip filters.
- Do not mix a rich merchandising feed with a dense form on the same screen.

## Friction Reduction Rules
- Reduce friction for:
  - search input
  - category switching
  - add-to-cart
  - quantity adjustment
  - opening filters
  - copying a group-order code
  - marking notifications as read
- Require confirmation for:
  - sign out
  - delete address
  - delete account
  - destructive list removal when data loss is possible
- Do not require confirmation for standard forward progression after the user has already reviewed the content. Example: checkout should place the order directly from the review screen instead of adding an extra “are you sure” step.

## Preservation Rules
- Keep the current warm, fast, delivery-first tone and visual hierarchy.
- Preserve the current orange-led action model from `customer-app/lib/core/theme/app_theme.dart`.
- Preserve the current white-card-on-soft-gray surface pattern.
- Preserve the current screen separation between shell tabs and standalone flows from `customer-app/lib/app/router/app_router.dart`.
