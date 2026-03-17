# Screen Composition Rules

Status: active
Authority: advisory
Surface: customer-app
Domains: composition, layout, sticky-cta
Last updated: 2026-03-16
Last verified: 2026-03-16
Retrieve when:
- changing page-level composition, section order, or sticky CTA behavior
- checking what should scroll vs stay fixed on a customer screen
Related files:
- docs/ui-governance/SCREEN_TYPES.md
- docs/ui-governance/INTERACTION_PATTERNS.md
- customer-app/lib/features/common/presentation/widgets.dart

## Page-Level Layout Rules
- Use `Scaffold` for every route-level screen.
- Use `CustomScrollView` for feed and detail screens that need pinned headers or mixed sliver layouts.
- Use `ListView` for stacked card screens.
- Use `Column + Spacer + bottom CTA` only for highly focused single-task flows such as phone auth.
- Keep the shell responsible only for bottom navigation. Individual tab screens own their own app bars and content hierarchy.

## Section Ordering Rules

### Entry / Auth / Onboarding
- order:
  - hero or identity block
  - title and supporting copy
  - primary input or action
  - secondary branches
  - tertiary legal/help text

### Feed / Discovery
- order:
  - location or page context
  - search entry
  - promo or category rail
  - featured content
  - primary list/grid

### Search / Filter
- order:
  - active search or screen title
  - current results/filter summary
  - selectable chips or content list
  - sticky apply bar only on the dedicated filter screen

### Detail / Menu
- order:
  - hero/header context
  - metadata summary
  - category navigation
  - item list
  - sticky cart CTA if the screen drives cart entry

### Cart / Checkout
- order:
  - context card
  - editable content blocks
  - price breakdown
  - sticky bottom CTA

### Orders / Profile / Settings
- order:
  - page title
  - top summary or tab split
  - grouped cards/rows
  - destructive action isolated at the bottom when needed

## Sticky CTA Rules
- Use `BottomCTABar` when:
  - the user is in a transactional flow
  - the primary action must remain visible during scroll
  - the CTA advances to the next step, not a side action
- Do not use a sticky CTA when:
  - the screen is primarily a browse or read screen
  - the main action is item tap or row tap
  - the page would end up with competing filled actions
- Bottom CTA content rules:
  - `label` names the next action
  - `sublabel` adds lightweight context only
  - `trailingText` is reserved for totals or other high-value numeric context

## App Bar / Hero / Nav Usage Rules
- Use a plain white app bar for:
  - forms
  - account screens
  - list screens
- Use a hero or expanded sliver app bar only when the route owns a strong visual identity:
  - entry
  - onboarding
  - store detail
  - order status
- Do not add a second navigation system inside a tab screen unless the screen type requires local segmentation, such as order tabs.

## Cards, Lists, Forms, Chips, Banners
- Cards:
  - one card should equal one concept
  - avoid placing full card groups inside another bordered card
- Lists:
  - use consistent spacing between rows
  - when rows belong to one group, prefer one bordered container with dividers
- Forms:
  - one screen, one dominant form goal
  - helper text goes below the control, not above the CTA
- Chips:
  - use for quick filters or tags only
  - selected chip state must be visible by fill and text color
- Banners:
  - use only for promotional or status emphasis
  - do not use a promo banner to deliver critical instructions

## Screen Density Rules
- Keep most screens within three to five major blocks before the user scrolls deeply.
- Avoid more than one hero, one tab set, and one sticky CTA on the same screen.
- Keep account/settings screens visually calmer than feed/store/order screens.

## Scroll And Fixed Rules
- Feed and detail content may scroll.
- Bottom navigation stays fixed in `MainShell`.
- Sticky CTA bars stay fixed above the safe area.
- Pinned chip rows are allowed only when category switching is a core part of the screen.
- Do not pin non-essential promotional content.

## Composition Anti-Patterns
- Duplicating the same menu composition in multiple screens without a shared rule or shared widget.
- Nesting white bordered cards inside another white bordered card when a section divider would be enough.
- Mixing a settings row group with a promo banner or feed rail.
- Using a filled CTA inside the body and another filled sticky CTA for different actions.
- Letting the screen lose context after the first scroll.

## Current Evidence
- Feed composition: `customer-app/lib/features/home/presentation/home_screen.dart`
- Filter sticky CTA: `customer-app/lib/features/search/presentation/filter_screen.dart`
- Detail hero + pinned chips: `customer-app/lib/features/store/presentation/store_screen.dart`
- Transaction sticky bar: `customer-app/lib/features/cart/presentation/cart_screen.dart`
- Account grouped rows: `customer-app/lib/features/profile/presentation/profile_screen.dart`
- Settings grouped rows + destructive group: `customer-app/lib/features/settings/presentation/settings_screen.dart`
