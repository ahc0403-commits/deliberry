# Customer UI Gap Audit

Status: historical
Authority: historical
Surface: customer-app
Domains: customer-ui, audit-history
Last updated: 2026-03-16
Last verified: 2026-03-16
Retrieve when:
- tracing the pre-rebuild customer placeholder baseline
- checking how far the customer UI changed from the original audit state
Superseded by: docs/ui-governance/UI_GAP_AUDIT.md
Related files:
- docs/ui-governance/UI_GAP_AUDIT.md
- docs/ui-governance/STABILIZATION_REPORT.md

## 1. Executive Summary
- overall verdict: the customer app is mostly placeholder UI. The route skeleton exists, but the visible product is still an architecture/demo shell, not a customer-facing app.
- whether the current customer app is a real UI or mostly placeholder: mostly placeholder. The dominant pattern is explanatory text rendered through generic scaffolds, plus route-jump buttons.
- top 5 blockers preventing it from looking like a real app:
  - `customer-app/lib/features/common/presentation/customer_flow_scaffold.dart` turns most screens into documentation pages with headings, bullets, and "Next steps" buttons instead of product layouts.
  - `customer-app/lib/core/data/in_memory_customer_repository.dart` feeds screens with string lists such as `featured stores`, `suggestions placeholder`, and `summary placeholder` instead of real UI models or composed sections.
  - `customer-app/lib/app/shells/main_shell.dart` is only a structural wrapper: generic app bar, generic padding, basic bottom nav, no customer-specific shell behavior, no contextual header, no floating cart, and no route-aware layout treatment.
  - Auth, onboarding, and group order flows are not usable UIs. Files such as `customer-app/lib/features/auth/presentation/auth_phone_screen.dart`, `customer-app/lib/features/auth/presentation/auth_otp_screen.dart`, and `customer-app/lib/features/group_order/presentation/group_order_share_screen.dart` contain no real form fields or share UI.
  - There are effectively no reusable customer-facing building blocks. `customer-app/lib/features/common/presentation/` contains only generic scaffolds; there are no store cards, product cards, quantity controls, price rows, chips, banners, empty states, loading states, CTA bars, or address selectors.

## 2. Route Inventory
| Route Name | Path / Route Constant | File | Status | Notes |
| --- | --- | --- | --- | --- |
| Root redirect | `/` / `RouteNames.root` | `customer-app/lib/app/router/app_router.dart` -> `customer-app/lib/app/entry/customer_entry_screen.dart` | PLACEHOLDER_UI | Alias only. Redirects to entry/home/onboarding/otp based on local session flags. |
| Entry | `/entry` / `RouteNames.entry` | `customer-app/lib/app/entry/customer_entry_screen.dart` | PLACEHOLDER_UI | Session-state explainer page, not a landing UI. |
| Auth alias | `/auth` / `RouteNames.auth` | `customer-app/lib/features/auth/presentation/auth_screen.dart` | PLACEHOLDER_UI | Alias of the login placeholder screen. |
| Auth login | `/auth/login` / `RouteNames.authLogin` | `customer-app/lib/features/auth/presentation/auth_screen.dart` | PLACEHOLDER_UI | Shows auth ownership notes and route buttons, not a login screen. |
| Auth phone | `/auth/phone` / `RouteNames.authPhone` | `customer-app/lib/features/auth/presentation/auth_phone_screen.dart` | STUB_ONLY | No phone field, no keypad treatment, no validation UI. Only bullet text plus `Request OTP`. |
| Auth OTP | `/auth/otp` / `RouteNames.authOtp` | `customer-app/lib/features/auth/presentation/auth_otp_screen.dart` | STUB_ONLY | No OTP inputs, resend state, timer, or error UI. Only explanatory copy and a `Verify OTP` button. |
| Guest entry | `/guest` / `RouteNames.guest` | `customer-app/lib/features/auth/presentation/guest_entry_screen.dart` | STUB_ONLY | No guest value proposition or productized guest entry. Just text sections and a CTA. |
| Onboarding | `/onboarding` / `RouteNames.onboarding` | `customer-app/lib/features/onboarding/presentation/onboarding_screen.dart` | STUB_ONLY | No profile form, preferences UI, avatar, or stepper. Only placeholder bullets and a completion button. |
| Home | `/home` / `RouteNames.home` | `customer-app/lib/features/home/presentation/home_screen.dart` | PLACEHOLDER_UI | Shell tab exists, but body is a text list of fake sections. |
| Discovery | `/home/discovery` / `RouteNames.discovery` | `customer-app/lib/features/home/presentation/discovery_screen.dart` | PLACEHOLDER_UI | No store list, promo modules, or browse rails. Only section cards. |
| Search | `/search` / `RouteNames.search` | `customer-app/lib/features/search/presentation/search_screen.dart` | PLACEHOLDER_UI | No search field, recent search chips, result list, or filters UI. |
| Filter | `/search/filter` / `RouteNames.filter` | `customer-app/lib/features/search/presentation/filter_screen.dart` | PLACEHOLDER_UI | No toggles, chips, sliders, or apply/reset controls. |
| Store detail | `/store` / `RouteNames.store` | `customer-app/lib/features/store/presentation/store_screen.dart` | PLACEHOLDER_UI | No hero, ratings block, categories, menu preview, delivery info layout, or CTA. |
| Store menu | `/store/menu` / `RouteNames.storeMenu` | `customer-app/lib/features/store/presentation/menu_browsing_screen.dart` | PLACEHOLDER_UI | No categories rail, menu cards, modifiers, add-to-cart controls, or sticky cart summary. |
| Group order room | `/group-order` / `RouteNames.groupOrder` | `customer-app/lib/features/group_order/presentation/group_order_screen.dart` | STUB_ONLY | One generic scaffold with placeholder state text. No room code UI, member list, or shared cart layout. |
| Group order share | `/group-order/share` / `RouteNames.groupOrderShare` | `customer-app/lib/features/group_order/presentation/group_order_share_screen.dart` | STUB_ONLY | No actual share surface. Just one sentence and placeholder outputs. |
| Cart | `/cart` / `RouteNames.cart` | `customer-app/lib/features/cart/presentation/cart_screen.dart` | PLACEHOLDER_UI | No line-item rows, quantity controls, pricing breakdown, or checkout footer. |
| Checkout | `/checkout` / `RouteNames.checkout` | `customer-app/lib/features/checkout/presentation/checkout_screen.dart` | PLACEHOLDER_UI | Payment is allowed to stay placeholder-only, but the screen still lacks real address, summary, payment, and CTA composition. |
| Orders | `/orders` / `RouteNames.orders` | `customer-app/lib/features/orders/presentation/orders_screen.dart` | PLACEHOLDER_UI | No segmented active/past lists, cards, reorder actions, or empty state. |
| Order detail | `/orders/detail` / `RouteNames.orderDetail` | `customer-app/lib/features/orders/presentation/order_detail_screen.dart` | PLACEHOLDER_UI | No itemized receipt layout, timeline block, totals section, or support actions. |
| Order status | `/orders/status` / `RouteNames.orderStatus` | `customer-app/lib/features/orders/presentation/order_status_screen.dart` | PLACEHOLDER_UI | Realtime tracking is excluded, but even milestone presentation is only a text list. |
| Reviews | `/reviews` / `RouteNames.reviews` | `customer-app/lib/features/reviews/presentation/reviews_screen.dart` | PLACEHOLDER_UI | No star selector, review form, media affordances, or submitted-review state. |
| Profile | `/profile` / `RouteNames.profile` | `customer-app/lib/features/profile/presentation/profile_screen.dart` | PLACEHOLDER_UI | No profile header, account rows, saved payment/address summaries, or actionable settings list. |
| Settings | `/settings` / `RouteNames.settings` | `customer-app/lib/features/settings/presentation/settings_screen.dart` | PLACEHOLDER_UI | No settings groups, switches, legal/support rows, or confirmation flows. |
| Addresses | `/addresses` / `RouteNames.addresses` | `customer-app/lib/features/addresses/presentation/addresses_screen.dart` | PLACEHOLDER_UI | No address cards, default indicators, add/edit sheet, or checkout selector state. |
| Notifications | `/notifications` / `RouteNames.notifications` | `customer-app/lib/features/notifications/presentation/notifications_screen.dart` | PLACEHOLDER_UI | No inbox list, unread styling, grouping, or notification detail action rows. |
| Store list results | none | none | MISSING | No dedicated route or screen exists for a store-results list. Discovery and search both stop at placeholder text. |
| Order confirmation / post-checkout receipt | none | none | MISSING | Checkout jumps straight to orders. There is no dedicated confirmation screen or route. |

Current default entry:
- `customer-app/lib/app/app.dart` sets `initialRoute: RouteNames.entry`.
- `customer-app/lib/app/router/app_router.dart` redirects `/entry` to `/home`, `/onboarding`, or `/auth/otp` when the in-memory session flags require it.

## 3. Screen-by-Screen Audit

### Customer Entry
- Screen name: Customer Entry
- File path: `customer-app/lib/app/entry/customer_entry_screen.dart`
- Status: PLACEHOLDER_UI
- Why it was classified that way: the page is a session-state explainer with titles like `Current session state`, `Entry branches`, and `Session handoff rules`. It is architecture copy, not a customer landing screen.
- Missing UI elements: branded hero, auth/guest CTA hierarchy, trust copy, localization-ready phone entry surface, legal footer.
- Reusability verdict: needs replacement.

### Auth
- Screen name: Customer Auth
- File path: `customer-app/lib/features/auth/presentation/auth_screen.dart`
- Status: PLACEHOLDER_UI
- Why it was classified that way: the screen explains auth ownership and current auth state, then renders route buttons. It does not render a login form or a product auth layout.
- Missing UI elements: phone/email input surface, social/guest hierarchy, error state, consent copy, primary/secondary CTA design.
- Reusability verdict: needs replacement.

### Auth Phone
- Screen name: Phone Entry
- File path: `customer-app/lib/features/auth/presentation/auth_phone_screen.dart`
- Status: STUB_ONLY
- Why it was classified that way: there is no phone input. The file only shows bullet points from `AuthPlaceholderState.phoneEntrySteps` and a floating button that forces OTP state.
- Missing UI elements: phone number field, country selector, validation, keypad ergonomics, submit disabled state, error/help text.
- Reusability verdict: needs replacement.

### Auth OTP
- Screen name: OTP Entry
- File path: `customer-app/lib/features/auth/presentation/auth_otp_screen.dart`
- Status: STUB_ONLY
- Why it was classified that way: there are no OTP cells, resend CTA, timer, or invalid-code state. The screen is just placeholder text plus `Verify OTP`.
- Missing UI elements: code input, resend affordance, masked phone copy, back/edit number, loading state, failure state.
- Reusability verdict: needs replacement.

### Guest Entry
- Screen name: Guest Access Branch
- File path: `customer-app/lib/features/auth/presentation/guest_entry_screen.dart`
- Status: STUB_ONLY
- Why it was classified that way: the page is only a policy explanation for guest limits and boundaries. It is not a real guest-entry decision screen.
- Missing UI elements: concise guest benefit copy, account-vs-guest choice layout, continue CTA hierarchy, disclosure of guest restrictions in a product format.
- Reusability verdict: needs replacement.

### Onboarding
- Screen name: Customer Onboarding
- File path: `customer-app/lib/features/onboarding/presentation/onboarding_screen.dart`
- Status: STUB_ONLY
- Why it was classified that way: the screen is a text explanation of onboarding steps and completion boundary. No actual onboarding form or step content exists.
- Missing UI elements: name/profile inputs, preferences selectors, step progress, skip/continue pattern, validation, success handoff.
- Reusability verdict: needs replacement.

### Home
- Screen name: Home
- File path: `customer-app/lib/features/home/presentation/home_screen.dart`
- Status: PLACEHOLDER_UI
- Why it was classified that way: the main tab body is a generic section list driven by `getHomeSections()` returning strings like `featured stores`, `repeat orders`, and `seasonal promotions`.
- Missing UI elements: hero/search entry, promo banner, category shortcuts, store carousels, repeat-order cards, location context, cart awareness.
- Reusability verdict: needs rewrite.

### Discovery
- Screen name: Discovery
- File path: `customer-app/lib/features/home/presentation/discovery_screen.dart`
- Status: PLACEHOLDER_UI
- Why it was classified that way: there is no browse grid or list. The screen only renders section cards for `trending`, `nearby`, and `group-friendly`.
- Missing UI elements: store cards, sorting, category chips, list/grid layout, promo modules, loading/empty states.
- Reusability verdict: needs rewrite.

### Search
- Screen name: Search
- File path: `customer-app/lib/features/search/presentation/search_screen.dart`
- Status: PLACEHOLDER_UI
- Why it was classified that way: the page contains no actual search input pattern or results. It is a text summary of `query`, `recent searches`, and `suggestions placeholder`.
- Missing UI elements: search bar, recent search chips, suggestions, store results list, debounce/loading state, no-results state.
- Reusability verdict: needs replacement.

### Filter
- Screen name: Search Filters
- File path: `customer-app/lib/features/search/presentation/filter_screen.dart`
- Status: PLACEHOLDER_UI
- Why it was classified that way: filter groups are plain bullet strings. No controls exist.
- Missing UI elements: chips, toggles, sliders, sort picker, apply/reset/footer CTA, active filter summary.
- Reusability verdict: needs replacement.

### Store Detail
- Screen name: Store Detail
- File path: `customer-app/lib/features/store/presentation/store_screen.dart`
- Status: PLACEHOLDER_UI
- Why it was classified that way: the file describes store sections and boundaries instead of rendering a store page. `ratings placeholder` is literally part of the source data.
- Missing UI elements: store hero, delivery ETA, rating row, category tabs, featured items, promo modules, sticky action bar.
- Reusability verdict: needs replacement.

### Menu Browsing
- Screen name: Menu Browsing
- File path: `customer-app/lib/features/store/presentation/menu_browsing_screen.dart`
- Status: PLACEHOLDER_UI
- Why it was classified that way: menu groups come from string labels like `featured items`, `categories`, and `modifier placeholder`. There is no menu composition.
- Missing UI elements: category rail, product cards, modifier sheet, quantity controls, add-to-cart CTA, sticky cart summary.
- Reusability verdict: needs replacement.

### Group Order Room
- Screen name: Group Order via Room Code
- File path: `customer-app/lib/features/group_order/presentation/group_order_screen.dart`
- Status: STUB_ONLY
- Why it was classified that way: the screen uses the thinner `CustomerFeatureScaffold` and only prints joined placeholder states such as `room created` and `shared cart placeholder`.
- Missing UI elements: room code module, participant list, shared cart summary, join controls, invite controls, owner/member state.
- Reusability verdict: needs replacement.

### Group Order Share
- Screen name: Group Order Share Flow
- File path: `customer-app/lib/features/group_order/presentation/group_order_share_screen.dart`
- Status: STUB_ONLY
- Why it was classified that way: this is the thinnest customer screen in the app. It has only a title, description, and a placeholder-state string.
- Missing UI elements: share card, code display, copy action, share CTA, invited-members state, fallback instructions.
- Reusability verdict: needs replacement.

### Cart
- Screen name: Cart
- File path: `customer-app/lib/features/cart/presentation/cart_screen.dart`
- Status: PLACEHOLDER_UI
- Why it was classified that way: the screen lists cart sections as text, including `summary placeholder`, and uses route buttons instead of cart actions.
- Missing UI elements: item rows, quantity steppers, notes field, subtotal/tax/delivery rows, promo input, sticky checkout CTA.
- Reusability verdict: needs replacement.

### Checkout
- Screen name: Checkout
- File path: `customer-app/lib/features/checkout/presentation/checkout_screen.dart`
- Status: PLACEHOLDER_UI
- Why it was classified that way: although payment verification must stay excluded, the UI itself is still just explanatory sections plus a notice card. It does not behave like a checkout screen.
- Missing UI elements: address selector, delivery instruction input, payment method cards, order summary module, terms copy, disabled/enabled confirm CTA.
- Reusability verdict: needs replacement.

### Orders List
- Screen name: Orders
- File path: `customer-app/lib/features/orders/presentation/orders_screen.dart`
- Status: PLACEHOLDER_UI
- Why it was classified that way: the screen only lists `active orders`, `past orders`, and `review prompts`. There are no actual order cards.
- Missing UI elements: segmented list or tabs, order cards, status badges, reorder CTA, support CTA, empty states.
- Reusability verdict: needs replacement.

### Order Detail
- Screen name: Order Detail
- File path: `customer-app/lib/features/orders/presentation/order_detail_screen.dart`
- Status: PLACEHOLDER_UI
- Why it was classified that way: the file renders a single section list for `line items`, `totals`, and `delivery summary`. That is not an order detail UI.
- Missing UI elements: receipt header, itemized list rows, totals block, delivery/contact section, support/review actions.
- Reusability verdict: needs replacement.

### Order Status
- Screen name: Order Status Presentation
- File path: `customer-app/lib/features/orders/presentation/order_status_screen.dart`
- Status: PLACEHOLDER_UI
- Why it was classified that way: the file is limited to milestone strings in a generic list. Even as a non-realtime screen, it is not a usable status page.
- Missing UI elements: milestone timeline, current-status emphasis, ETA text, courier/store info block, help CTA, handoff to detail.
- Reusability verdict: needs replacement.

### Reviews
- Screen name: Reviews
- File path: `customer-app/lib/features/reviews/presentation/reviews_screen.dart`
- Status: PLACEHOLDER_UI
- Why it was classified that way: `rating summary`, `feedback entry`, and `media placeholder` are plain strings, not review UI.
- Missing UI elements: star rating control, text area, item/store target context, submit CTA, success state, media placeholder treatment.
- Reusability verdict: needs replacement.

### Profile
- Screen name: Profile
- File path: `customer-app/lib/features/profile/presentation/profile_screen.dart`
- Status: PLACEHOLDER_UI
- Why it was classified that way: the profile tab is just a list of profile-section labels and route buttons.
- Missing UI elements: user header, account rows, saved addresses preview, preferences summary, order/help shortcuts.
- Reusability verdict: needs replacement.

### Settings
- Screen name: Settings
- File path: `customer-app/lib/features/settings/presentation/settings_screen.dart`
- Status: PLACEHOLDER_UI
- Why it was classified that way: it is a generic list of strings like `privacy placeholders` and `support handoff`.
- Missing UI elements: grouped settings cells, toggles, disclosure rows, legal/support section, destructive actions, confirmation states.
- Reusability verdict: needs replacement.

### Addresses
- Screen name: Addresses
- File path: `customer-app/lib/features/addresses/presentation/addresses_screen.dart`
- Status: PLACEHOLDER_UI
- Why it was classified that way: the screen lists `saved addresses`, `default address marker`, and `manual entry placeholder` as text, with no actual address card UI.
- Missing UI elements: address cards, add/edit/delete actions, default chip, selection state, empty state, form sheet.
- Reusability verdict: needs replacement.

### Notifications
- Screen name: Notifications
- File path: `customer-app/lib/features/notifications/presentation/notifications_screen.dart`
- Status: PLACEHOLDER_UI
- Why it was classified that way: the screen is just an inbox skeleton rendered as section bullets.
- Missing UI elements: notification rows, unread styling, grouped dates, quick actions, empty state, detail drill-in.
- Reusability verdict: needs replacement.

### Missing Screen: Store List Results
- Screen name: Store List Results
- File path: none
- Status: MISSING
- Why it was classified that way: the customer journey needs a real store-results surface between search/discovery and store detail. No route or file exists.
- Missing UI elements: results list/grid, sort and filter summary, pagination/loading, store cards, no-results state.
- Reusability verdict: needs replacement from scratch.

### Missing Screen: Order Confirmation / Post-Checkout Receipt
- Screen name: Order Confirmation / Post-Checkout Receipt
- File path: none
- Status: MISSING
- Why it was classified that way: checkout currently routes straight to orders. There is no dedicated handoff screen confirming placement of the order.
- Missing UI elements: confirmation hero, order summary, next-step actions, support/help links, return-to-home and order-detail CTAs.
- Reusability verdict: needs replacement from scratch.

## 4. Main Shell Audit
- shell file path: `customer-app/lib/app/shells/main_shell.dart`
- current quality level: structural shell only, not production-like customer shell.
- what is real vs what is placeholder:
  - real:
    - a working `NavigationBar` with tabs for Home, Search, Orders, and Profile
    - route switching across shell tabs
    - a consistent top app bar and page padding
  - placeholder:
    - destination descriptions inside `_ShellDestination` literally describe the tabs as stubs
    - one generic app bar title pattern for every tab
    - one global logout icon regardless of screen context
    - one generic padded body region with no shell-owned customer patterns
- what is missing to make it production-like:
  - no location/address header treatment
  - no contextual search affordance in shell
  - no cart affordance or persistent cart state
  - no shell-level spacing system beyond fixed `24` padding
  - no contextual app bar variations between tabs
  - no visual hierarchy or branded shell composition
  - no bottom safe-area CTA handling for cart/checkout-related flows
  - no handling for unread notifications, profile status, or order badges in nav

## 5. Shared Component Audit

### Existing reusable UI components
- `customer-app/lib/features/common/presentation/customer_flow_scaffold.dart`
  - Reusable, but it is a documentation scaffold, not a customer-facing UI system.
- `customer-app/lib/features/common/presentation/customer_feature_scaffold.dart`
  - Even thinner placeholder scaffold used by group order.
- `customer-app/lib/features/common/presentation/customer_flow_scaffold.dart` -> `_SectionCard`, `_NoticeCard`, `_MetaRow`
  - Generic metadata widgets for text blocks, not reusable customer app components.
- `customer-app/lib/app/shells/main_shell.dart`
  - Reusable shell wrapper exists, but only at the structural routing level.

### Missing reusable UI components
- section headers
  - Missing. No reusable customer section header component exists.
- store cards
  - Missing. No customer widget renders a store summary card.
- product/menu cards
  - Missing. No item card or menu row exists.
- quantity controls
  - Missing. `customer-app/lib/core/data/in_memory_customer_repository.dart` mentions `quantity controls` as text only.
- price rows
  - Missing. No reusable subtotal/tax/fee row component exists.
- chips / filters
  - Missing. Filter UI is text-only.
- promo banners
  - Missing. Promotions are only string labels.
- order status badges
  - Missing. No badge or pill component exists.
- empty states
  - Missing. No empty-state widget exists anywhere under `customer-app/lib`.
- skeleton/loading states
  - Missing. No loading placeholders exist.
- bottom CTA bars
  - Missing. Cart and checkout do not have sticky footer action patterns.
- address/location selector
  - Missing. No reusable selector, summary pill, or sheet exists.
- search input patterns
  - Missing. Search route has no reusable input at all.

## 6. Customer Flow Coverage
| Flow | Covered with real UI? (Yes/Partial/No) | Blocking gap |
| --- | --- | --- |
| Entry / landing | No | `customer-app/lib/app/entry/customer_entry_screen.dart` is an architecture handoff screen, not a product entry surface. |
| Auth / guest entry | No | Auth, phone, OTP, and guest routes are placeholder or stub-only and lack actual form UI. |
| Home | No | `customer-app/lib/features/home/presentation/home_screen.dart` is a text list, not a home feed. |
| Search | No | No search input or results composition exists. |
| Store list / discovery | No | Discovery is placeholder-only and a dedicated store-results screen is missing. |
| Store detail | No | Store detail route exists, but no actual store page is rendered. |
| Menu browsing | No | Menu route exists, but there are no product cards or add-to-cart flows. |
| Cart | No | Cart route exists, but there are no cart rows, totals, or CTA footer. |
| Checkout | No | Route exists, but checkout is still explanatory text plus placeholder payment notice. |
| Orders list | No | Orders route exists, but no order cards or segments are rendered. |
| Order detail / order status | No | Both routes exist, but both are text-only placeholder presentations. |
| Profile | No | Profile tab is only a list of section labels and links. |
| Addresses | No | Route exists, but there is no address management UI. |
| Notifications | No | Route exists, but there is no inbox/list UI. |
| Reviews | No | Route exists, but there is no actual review form or feedback flow. |
| Settings | No | Route exists, but there are no settings cells or controls. |
| Group order | No | Both group-order routes are skeletal placeholders with no usable room/share UI. |

## 7. Priority Build List

### P0 must-build-now
- Replace `customer-app/lib/features/common/presentation/customer_flow_scaffold.dart` as the dominant presentation pattern for product screens.
- Build real entry/auth/onboarding UI in:
  - `customer-app/lib/app/entry/customer_entry_screen.dart`
  - `customer-app/lib/features/auth/presentation/auth_screen.dart`
  - `customer-app/lib/features/auth/presentation/auth_phone_screen.dart`
  - `customer-app/lib/features/auth/presentation/auth_otp_screen.dart`
  - `customer-app/lib/features/auth/presentation/guest_entry_screen.dart`
  - `customer-app/lib/features/onboarding/presentation/onboarding_screen.dart`
- Replace the main shell body patterns and shell behavior in `customer-app/lib/app/shells/main_shell.dart`.
- Build the actual ordering journey:
  - `customer-app/lib/features/home/presentation/home_screen.dart`
  - `customer-app/lib/features/search/presentation/search_screen.dart`
  - `customer-app/lib/features/store/presentation/store_screen.dart`
  - `customer-app/lib/features/store/presentation/menu_browsing_screen.dart`
  - `customer-app/lib/features/cart/presentation/cart_screen.dart`
  - `customer-app/lib/features/checkout/presentation/checkout_screen.dart`
- Introduce reusable customer UI primitives before polishing individual screens.

### P1 next
- Build the post-purchase/account stack:
  - `customer-app/lib/features/orders/presentation/orders_screen.dart`
  - `customer-app/lib/features/orders/presentation/order_detail_screen.dart`
  - `customer-app/lib/features/orders/presentation/order_status_screen.dart`
  - `customer-app/lib/features/reviews/presentation/reviews_screen.dart`
  - `customer-app/lib/features/profile/presentation/profile_screen.dart`
  - `customer-app/lib/features/addresses/presentation/addresses_screen.dart`
  - `customer-app/lib/features/notifications/presentation/notifications_screen.dart`
  - `customer-app/lib/features/settings/presentation/settings_screen.dart`
- Add missing dedicated screens:
  - store list results
  - order confirmation / post-checkout receipt

### P2 later
- Replace the group order placeholders:
  - `customer-app/lib/features/group_order/presentation/group_order_screen.dart`
  - `customer-app/lib/features/group_order/presentation/group_order_share_screen.dart`
- Fill out shell refinements such as badges, contextual headers, and shell-owned quick actions after the core routes are real.

## 8. Exact Files Likely Needing Rewrite
- `customer-app/lib/features/common/presentation/customer_flow_scaffold.dart`
- `customer-app/lib/features/common/presentation/customer_feature_scaffold.dart`
- `customer-app/lib/app/shells/main_shell.dart`
- `customer-app/lib/app/entry/customer_entry_screen.dart`
- `customer-app/lib/features/auth/presentation/auth_screen.dart`
- `customer-app/lib/features/auth/presentation/auth_phone_screen.dart`
- `customer-app/lib/features/auth/presentation/auth_otp_screen.dart`
- `customer-app/lib/features/auth/presentation/guest_entry_screen.dart`
- `customer-app/lib/features/onboarding/presentation/onboarding_screen.dart`
- `customer-app/lib/features/home/presentation/home_screen.dart`
- `customer-app/lib/features/home/presentation/discovery_screen.dart`
- `customer-app/lib/features/search/presentation/search_screen.dart`
- `customer-app/lib/features/search/presentation/filter_screen.dart`
- `customer-app/lib/features/store/presentation/store_screen.dart`
- `customer-app/lib/features/store/presentation/menu_browsing_screen.dart`
- `customer-app/lib/features/cart/presentation/cart_screen.dart`
- `customer-app/lib/features/checkout/presentation/checkout_screen.dart`
- `customer-app/lib/features/orders/presentation/orders_screen.dart`
- `customer-app/lib/features/orders/presentation/order_detail_screen.dart`
- `customer-app/lib/features/orders/presentation/order_status_screen.dart`
- `customer-app/lib/features/reviews/presentation/reviews_screen.dart`
- `customer-app/lib/features/profile/presentation/profile_screen.dart`
- `customer-app/lib/features/addresses/presentation/addresses_screen.dart`
- `customer-app/lib/features/notifications/presentation/notifications_screen.dart`
- `customer-app/lib/features/settings/presentation/settings_screen.dart`
- `customer-app/lib/features/group_order/presentation/group_order_screen.dart`
- `customer-app/lib/features/group_order/presentation/group_order_share_screen.dart`
