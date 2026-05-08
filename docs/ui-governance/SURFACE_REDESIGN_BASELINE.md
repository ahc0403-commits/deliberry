# Surface Redesign Baseline

Status: active
Authority: binding (redesign implementation)
Surface: cross-surface
Last updated: 2026-04-28
Related files:
- docs/ui-governance/DESIGN_SYSTEM_BASELINE.md
- docs/ui-governance/VISUAL_POLISH_RULES.md
- docs/ui-governance/CROSS_SURFACE_UX_RULES.md
- reviews/full_product_redesign_strategy.md

---

## 1. customer-app (Flutter)

### Navigation
- **Keep**: Bottom nav bar (72px), 4-5 tabs (Home, Search, Orders, Profile)
- **Keep**: AppBar with back button for drill-down screens
- **Add**: Subtle top-edge shadow on bottom nav for depth separation
- **Change**: Tab icons should have filled variant when selected (not just color change)
- **Change**: Root shell screens such as Home should not imply a back button from the app bar

### Information Hierarchy
- **Home**: Hero promo carousel → Category pills → Featured stores → Nearby stores
- **Store**: Store header (image/gradient, name, rating, delivery info) → Menu categories → Menu items
- **Cart**: Store context card → Cart items → Promo code → Price breakdown → Checkout CTA
- **Orders**: Tab bar (Active / History) → Order cards with status badges → Tap for detail
- **Profile**: Avatar + name → Settings list → Addresses → Sign out

### Interaction Patterns
- **Keep**: Swipe-to-dismiss on cart items
- **Keep**: Quantity stepper (+/-) inline on cart items
- **Add**: Pull-to-refresh on order lists
- **Add**: Haptic feedback on add-to-cart
- **Change**: Order status screen should use a vertical timeline with animated progress dots

### What Must Change
| Element | Current | Target |
|---------|---------|--------|
| Cards | Flat (border only, elevation 0) | shadow-sm rest, shadow-md on press |
| Loading | Button text change only | Skeleton screens for lists, spinner in buttons |
| Empty states | Icon + text, basic | Add contextual illustrations (simple SVG) |
| Status badges | Plain colored pill | Bordered pill with semantic color (bg + text + border) |
| Info notices | Background-only box | Left accent bar (4px primary) + icon |
| Store cards | Gradient placeholder image | Keep gradient but add subtle inner shadow for depth |
| Global background | Warm beige app canvas | White app canvas with very light warm-muted secondary surfaces only |
| Hero card tone | Bright coral gradient | Ink-black utility hero with restrained amber accent label |
| Promo cards | High-chroma campaign banners | Tone-reduced campaign cards that sit under the hero without overpowering the screen |
| Guest/auth entry | Decorative warm illustration blocks | Clean white-shell entry/auth surfaces with one strong dark hero block only where needed |

### What Must Stay
- Material 3 theme foundation (app_theme.dart)
- Strong delivery-red primary action family on white-first surfaces
- 52px button height, 14px button radius
- 16px card radius, 16px content edge padding
- Bottom nav at 72px
- Current route structure and screen names
- Customer-app visual refresh must remain presentation-only and must not alter runtime ownership, route ownership, payment placeholder rules, or excluded-feature boundaries
- VNPAY/card/pay surfaces must use honest sandbox or pending wording and must not visually imply captured payment

---

## 2. merchant-console (Next.js)

### Navigation
- **Keep**: Fixed left sidebar (240px, dark warm ink `#221D19`)
- **Keep**: Top header bar (56px, translucent white, sticky)
- **Change**: Replace emoji sidebar icons with Lucide SVG icons (20px, 1.5px stroke)
- **Add**: Collapsed sidebar mode for tablet (icon-only, 64px)
- **Add**: Active nav indicator: left 3px accent bar (primary color) instead of just background tint

### Information Hierarchy
- **Dashboard**: KPI grid (top) → Recent orders table → Alerts sidebar
- **Orders**: Tab filter bar → Orders table → Detail slide-over panel
- **Menu**: Category list (left) → Item grid (right) → Item edit modal
- **Settlement**: Summary KPI row → Settlement history table
- **Analytics**: Metric cards → Chart area → Top items table
- **Reviews**: Rating summary → Review list with response actions

### Interaction Patterns
- **Keep**: Tab bar for order status filtering
- **Keep**: Inline table row click → detail panel
- **Add**: Slide-over panel for order details (instead of inline expansion)
- **Add**: Toast notifications for action confirmations
- **Add**: Form validation with inline error states
- **Change**: Action buttons in table rows should be icon-only with tooltip (not text buttons)

### What Must Change
| Element | Current | Target |
|---------|---------|--------|
| Icons | Emoji/Unicode characters | Lucide SVG (20px) |
| Cards | border + shadow-sm barely visible | shadow-sm visible rest, shadow-md hover |
| Tables | Hover-only row separation | Bottom border per row + hover fill |
| Buttons | 8px/16px padding (small) | Primary actions: 10px/20px. Standard: 8px/16px |
| KPI cards | Basic flat style | Subtle left accent bar (4px, semantic color) |
| Status badges | Functional | Add 1px semantic border |
| Forms | No validation states | Inline error/success states per VISUAL_POLISH_RULES |
| Empty tables | Basic centered text | Full empty state pattern (icon + title + CTA) |
| Money display | Inline `(v/100).toFixed(2)` | Use `formatMoney()` from adapter |
| Main canvas | Tinted dashboard background | White operational canvas with warm-muted secondary surfaces |
| Sidebar tone | Cool slate dashboard shell | Warm ink merchant shell |
| Hero treatment | Bright mixed dashboard gradients | White shell with one dark focus panel only |

### What Must Stay
- Dark warm sidebar (`#221D19`)
- Coral primary (`#D9472F`)
- 240px sidebar width, 56px header
- 4px spacing grid
- System UI font stack
- Server action auth pattern (cookie-based)
- In-memory repository + query service architecture

---

## 3. admin-console (Next.js)

### Navigation
- **Keep**: Fixed left sidebar (240px, dark slate `#18212E` — cooler than merchant)
- **Keep**: Top header with role badge and scope badge
- **Change**: Replace emoji sidebar icons with Lucide SVG icons
- **Add**: Same collapsed sidebar mode as merchant
- **Add**: Active nav left accent bar (3px, indigo)

### Information Hierarchy
- **Dashboard**: Platform KPI grid → Recent orders → Alerts → System health
- **Orders**: Tab filters → Platform orders table → Detail panel
- **Disputes**: Summary stats → Disputes table with priority + status badges
- **Settlements**: Summary row → Settlements table per merchant/store
- **Users**: User table with role/status → User detail
- **Finance**: Summary cards (3-col) → Recent settlements table
- **System**: Health dashboard → Feature flags → Announcements

### Interaction Patterns
- **Keep**: Tab bar filters for all list screens
- **Keep**: Summary grid at top of operational screens
- **Add**: Confirmation dialogs for governance-sensitive actions
- **Add**: Role-aware UI hints (dim unavailable sections for non-platform-admin roles)
- **Change**: Same slide-over detail panel pattern as merchant

### What Must Change
Same table as merchant-console (icons, cards, tables, buttons, KPIs, badges, forms, empty states, money display) PLUS:

| Element | Current | Target |
|---------|---------|--------|
| Feature flag row | `realtime_tracking` removed, basic list | Toggle switches with scope badge |
| System health | Basic table | Status dot (green/yellow/red) + sparkline latency |
| Dispute priority | Text badge only | Priority badge with icon (exclamation for high) |
| Finance summary | Plain cards | Cards with subtle top accent bar (semantic color) |
| Page canvas | Flat tinted console field | White/cool-gray platform canvas with white content surface |
| Accent tone | Saturated indigo | Muted governance indigo |
| Auth shell | Dark gradient card shell | Light governance entry shell with restrained accent chrome |

### What Must Stay
- Indigo primary (`#4D5FCF`) — governance authority signal
- Darker sidebar (`#18212E`)
- Permission role badge in header
- Same architectural patterns as merchant (mirror structure)
- Page-level horizontal overflow must be prevented; dense tables may scroll locally inside table wrappers

---

## 4. public-website (Next.js)

### Navigation
- **Keep**: Sticky header (64px, backdrop-blur)
- **Keep**: Footer with 4-column grid
- **Change**: Replace emoji feature icons with SVG
- **Add**: Smooth scroll to section anchors from nav
- **Add**: Mobile hamburger menu for < 768px

### Information Hierarchy
- **Landing**: Hero (badge + headline + CTA + social proof) → Features grid → How it works steps → Reviews → Merchant pitch → Footer
- **Service intro**: Headline → Feature breakdown → CTA
- **Merchant onboarding**: Benefits pitch → Steps → CTA form
- **Support**: FAQ accordion → Contact options
- **Legal pages**: Prose content with section headers
- **App download**: Platform badges → Feature highlights → CTA

### Interaction Patterns
- **Keep**: Card hover lift (translateY -2px, shadow-lg)
- **Keep**: Pill buttons with shadow-primary hover
- **Keep**: Eyebrow + headline + subheadline section pattern
- **Add**: FAQ accordion with smooth expand/collapse
- **Add**: Sticky CTA bar on mobile for key conversion pages
- **Change**: Steps connecting line should animate on scroll-into-view

### What Must Change
| Element | Current | Target |
|---------|---------|--------|
| Feature icons | Emoji (lightning, pizza, etc.) | SVG icons in 48px tinted circles |
| Review avatars | Initial-letter circles | Keep initials but add subtle gradient background |
| Trust metrics | Plain numbers | Animated count-up on scroll-into-view |
| Merchant pitch icons | Emoji | SVG in rgba(white,0.15) circles |
| Legal pages | Raw prose | Add left nav sidebar for section navigation |
| Mobile nav | None visible | Hamburger menu with slide-in drawer |

### What Must Stay
- Coral primary (#FF4B3A) for CTAs
- H1 at 3rem/w900 for hero headlines
- 24px card radius for marketing cards
- 5rem section vertical padding
- Max-width 1120px content container
- Pill button shape (rounded-full)
- Warm surface tints (#FFFBF9)
- Inter font family

---

*Surface baselines established: 2026-03-17*
