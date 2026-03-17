# Customer UI Execution Plan

Status: historical
Authority: historical
Surface: customer-app
Domains: customer-ui, execution-history
Last updated: 2026-03-16
Last verified: 2026-03-16
Retrieve when:
- tracing how the customer UI rebuild was sequenced originally
- comparing current customer UI governance against the initial rebuild plan
Superseded by: docs/ui-governance/STABILIZATION_REPORT.md
Related files:
- docs/ui-governance/STABILIZATION_REPORT.md
- docs/ui-governance/UI_REFACTOR_BACKLOG.md

Related governance docs:
- `docs/ui-governance/README.md`
- `docs/ui-governance/SCREEN_PATTERN_MATRIX.md`
- `docs/ui-governance/PR_CHECKLIST_UI_GOVERNANCE.md`
- `docs/ui-governance/NAVIGATION_TRUTH_MAP.md`
- `docs/ui-governance/RUNTIME_REALITY_MAP.md`
- `docs/ui-governance/STABILIZATION_REPORT.md`

## 1. Route Clusters Rebuilt

### P0 — Entry + Auth Cluster
- `/entry` — Branded landing with gradient hero, trust badges, CTAs
- `/auth/login` — Clean auth landing with phone/social/guest options
- `/auth/phone` — Phone input with country code, formatting, validation
- `/auth/otp` — 6-digit OTP boxes with auto-advance, timer, resend
- `/guest` — Guest welcome with feature comparison table
- `/onboarding` — 3-page PageView with dot indicators, skip/finish

### P0 — Main Shell + Home + Discovery
- Main shell — Streamlined Scaffold with bottom NavigationBar (Home, Search, Orders, Profile), no global AppBar (each tab owns its own)
- `/home` — Address pill, search bar, promo carousel, category grid, featured stores, nearby restaurants
- `/home/discovery` — Category filter chips, full store list grid

### P0 — Search + Filters
- `/search` — Live search with recent chips, popular categories, filtered results with store cards
- `/search/filter` — Multi-section filter chips (sort, cuisine, price, dietary), apply/reset CTAs

### P0 — Store + Menu + Cart
- `/store` — SliverAppBar hero, store metadata, rating, category tabs, menu items, cart CTA
- `/store/menu` — Sticky category chips, menu item cards with add button, cart summary bar
- `/cart` — Cart items with quantity controls, modifiers, promo code input, price breakdown, checkout CTA
- `/checkout` — Address, delivery instructions, payment method cards, order summary, place order CTA

### P1 — Orders
- `/orders` — Tabbed Active/History with OrderCard widgets, status badges
- `/orders/detail` — Itemized receipt, totals, delivery info, reorder/help actions
- `/orders/status` — Status hero, milestone timeline stepper, ETA card, help CTA

### P1 — Profile + Account
- `/profile` — Avatar, user info, grouped navigation tiles to addresses/notifications/reviews/settings, sign out
- `/reviews` — Interactive star rating, text input, quick-tag chips, success state
- `/addresses` — Address cards with default badge, add/edit/delete actions, bottom sheet form
- `/notifications` — Unread accent borders, mark-all-read, notification tiles with icons
- `/settings` — Grouped sections (account, preferences, support, legal), toggles, delete account

### P2 — Group Order
- `/group-order` — Create/join room, room code input, how-it-works steps
- `/group-order/share` — Room code display, copy/share actions, member list

## 2. Shared Components Created

File: `customer-app/lib/features/common/presentation/widgets.dart`

| Component | Purpose |
| --- | --- |
| `SectionHeader` | Title + optional "See all" link |
| `StoreCard` | Full store card with image, name, cuisine, rating, delivery info, promo badge |
| `CompactStoreCard` | Horizontal compact store card for carousels |
| `MenuItemCard` | Menu item row with image, description, price, add button, popular badge |
| `QuantityControl` | +/- stepper with quantity display |
| `PriceRow` | Label + amount aligned row, supports bold/discount styling |
| `CategoryChipRow` | Horizontal scrolling category chip selector |
| `PromoBanner` | Gradient promotional banner card |
| `StatusBadge` | Colored status pill for order states |
| `EmptyState` | Icon + title + subtitle + optional action button |
| `BottomCTABar` | Sticky bottom action bar with label, sublabel, trailing text |
| `AppSearchBar` | Search bar with icon, supports read-only and interactive modes |
| `AddressPill` | Location selector pill with label and address |
| `RatingStars` | Star display/input, supports interactive mode |
| `OrderCard` | Order summary card with store name, status badge, items, total, date |

## 3. Design Rules

### Color Palette
- Primary: `#FF4B3A` (coral-red) — CTAs, accents, navigation indicators
- Secondary: `#FFB74D` (warm amber) — ratings, secondary highlights
- Background: `#FAFAFA` — page backgrounds
- Surface: `#FFFFFF` — cards, sheets, app bars
- Text primary: `#1A1A2E` — headings, body text
- Text secondary: `#6B7280` — captions, metadata
- Border: `#E5E7EB` — card borders, dividers
- Success: `#22C55E` — delivered, free delivery
- Error: `#EF4444` — errors, delete actions

### Typography
- Headings: Roboto 20–28px, weight 700–800, negative letter-spacing
- Body: Roboto 14–16px, weight 400–500
- Labels: Roboto 12–14px, weight 500–600
- Price/totals: Roboto 15–18px, weight 700–800

### Spacing & Radius
- Card border radius: 14–16px
- Button border radius: 14px
- Chip border radius: 24px
- Page padding: 16–20px horizontal
- Section spacing: 24–32px vertical
- Card internal padding: 12–16px

### Interaction Patterns
- Bottom navigation with filled indicator on selected tab
- Sticky bottom CTA bars for cart/checkout flows
- Horizontal scroll carousels for promos and categories
- Category chip row for filtering (store menu, search, discovery)
- Pull-to-scroll pattern via CustomScrollView/SliverAppBar

## 4. Flow Continuity Plan

### Entry → Auth → Main Shell
Entry screen auto-redirects based on session state. New users see branded landing → phone auth → OTP → onboarding → home. Guest users go entry → guest screen → home. Returning users auto-redirect to home.

### Home → Browse → Cart → Checkout
Home provides search bar (→ search), category grid (→ discovery), store cards (→ store detail). Store detail shows menu with add-to-cart. Menu browsing has sticky cart bar. Cart reviews items and proceeds to checkout. Checkout places order and routes to orders.

### Orders → Detail/Status
Orders tab shows active (→ status) and past (→ detail) order cards. Status shows live milestone timeline. Detail shows itemized receipt with reorder action.

### Profile Hub
Profile tab provides account overview and navigation to addresses, notifications, reviews, settings. Sign out returns to entry.

## 6. Stabilization Update

The execution plan above described the rebuilt screen set. A later stabilization pass converted the highest-value customer journey from visually polished demo logic into one coherent local flow.

Stabilized now:
- route-owned store identity
- durable cart state across store/menu/cart/checkout
- local order creation and shared order truth across orders/detail/status
- reorder path using the same runtime source
- durable search query and filter state across expected navigation
- no-op CTA cleanup across core flow screens

Still intentionally limited:
- payment verification
- realtime order tracking
- full address persistence
- group order room runtime

## 5. Mock Data Strategy

File: `customer-app/lib/core/data/mock_data.dart`

Realistic mock data with 8 food categories, 6 stores with cuisine/rating/delivery info, 8 menu items across 4 categories, 3 cart items with modifiers, 5 orders (2 active, 3 past), 3 addresses, 4 notifications, 3 promotions, search history, and filter options. All data feels commercially authentic — real restaurant names, prices, and delivery times.
