# Merchant Console UI Execution Plan

## 1. Route Clusters Rebuilt

### P0 — Auth + Entry Cluster
- `/login` — Clean login form with email/password fields, branded card, gradient background
- `/onboarding` — Progress bar with checklist items, completion states, continue CTA
- `/select-store` — Store selection cards with avatar, name, address, open status, add-store placeholder

### P0 — Console Shell + Navigation
- Console header — Branded header with store status badge (green dot + "Open"), sign-out button
- Store-scoped sidebar — Dark slate sidebar with grouped nav sections (Main, Store, Finance, Config), nav icons, active badges for orders/reviews counts
- Store sidebar header — Store name display with "Active Store" label

### P0 — Dashboard
- `/:storeId/dashboard` — KPI cards grid (revenue, active orders, avg prep time, rating), recent orders table, activity & alerts panel with color-coded notifications

### P0 — Order Management
- `/:storeId/orders` — Tabbed Active/Completed/Cancelled with counts, full data table (order#, customer, items, total, payment, status, time), slide-out order detail panel with customer info, itemized list, price breakdown, contextual action buttons (Accept/Reject, Mark Ready, Mark Picked Up)

### P0 — Menu Management
- `/:storeId/menu` — Category filter chips with counts, search input, menu item rows with emoji thumbnails, name, description, price, popular badge, availability toggle, edit button

### P1 — Store Information
- `/:storeId/store` — Store profile form (name, cuisine, phone, email, address), store status toggles (accepting orders, visible on app), service settings (delivery radius, prep time), rating display, operating hours table

### P1 — Reviews
- `/:storeId/reviews` — Summary stats (avg rating, total, pending), filter tabs (All/Needs Response/Responded), review cards with customer avatar, star ratings, review text, response display, write-response CTA for unresponded reviews

### P1 — Promotions
- `/:storeId/promotions` — Full data table with promo name, monospace code badge, type, discount value, min order, usage bar with fill indicator, period dates, active/expired status badges

### P1 — Settlement
- `/:storeId/settlement` — Summary cards (total paid, pending/processing, total commission), settlement history table with period, orders, gross/commission/adjustments/net columns, status badges, paid dates

### P1 — Analytics
- `/:storeId/analytics` — 6-metric grid (revenue, orders, avg order value, completion rate, delivery time, return rate), daily revenue bar chart with labeled columns, top selling items table with rank/name/orders/revenue

### P2 — Settings
- `/:storeId/settings` — Operations toggles (auto-accept, notifications, rush hour, special instructions), notification toggles (email reports, review alerts, settlement notifications, low stock), quick links grid, danger zone (close store)

## 2. Reusable Operational Component Plan

### CSS Design System (globals.css)
All components built on a unified CSS token system:
- **KPI cards** — `.kpi-grid`, `.kpi-card`, `.kpi-value`, `.kpi-trend` with directional coloring
- **Data tables** — `.data-table` with sticky headers, hover rows, alignment helpers (`.right`, `.mono`, `.primary`)
- **Status badges** — `.status-badge` with per-status variants (new/preparing/ready/picked_up/delivered/cancelled/active/inactive/paid/pending/processing)
- **Tab bar** — `.tab-bar`, `.tab`, `.tab-count` with active state indicator
- **Filter bar** — `.filter-bar`, `.filter-chip`, `.filter-search` with active chip highlighting
- **Cards** — `.card`, `.card-header`, `.card-body`, `.card-footer` with subtle shadows
- **Buttons** — `.btn` with variants (primary/secondary/success/warning/danger/ghost) and sizes (sm, icon)
- **Toggle switches** — `.toggle` with CSS-only checkbox switch
- **Alert items** — `.alert-item` with warning/info/success variants
- **Form elements** — `.form-group`, `.form-input`, `.form-row`, `.form-toggle-row`
- **Review cards** — `.review-card`, `.review-stars`, `.review-response` with unresponded accent
- **Page headers** — `.page-header`, `.page-title`, `.page-subtitle`, `.page-actions`
- **Empty states** — `.empty-state` with icon, title, description
- **Order detail panel** — Slide-out overlay panel with sections, item rows, totals, action footer
- **Bar chart** — Pure CSS `.bar-chart` with proportional fill heights
- **Settlement/analytics metrics** — Grid-based summary cards

### Mock Data Layer
File: `merchant-console/src/shared/data/merchant-mock-data.ts`
- 20+ type definitions for operational entities
- Rich mock instances: 1 store, 4 KPIs, 7 orders, 8 categories, 20 menu items, 6 reviews, 4 promotions, 5 settlement records, analytics metrics, 7-day revenue, 5 top items, 4 alerts
- All data uses realistic Argentine food delivery context

## 3. Hierarchy and Layout Rules

### Color Palette (aligned with customer app)
- Primary: `#FF4B3A` (coral-red) — CTAs, active states, brand accent
- Sidebar: `#1E293B` (dark slate) — operational sidebar background
- Surface: `#FFFFFF` / `#F8FAFB` — cards and page backgrounds
- Text: `#111827` / `#4B5563` / `#9CA3AF` — primary/secondary/muted hierarchy
- Status: green (#22C55E) for success, amber (#F59E0B) for warning, red (#EF4444) for error, blue (#3B82F6) for info

### Typography
- Page titles: 1.5rem, weight 800, -0.03em tracking
- Card titles: 1rem, weight 700
- Body text: 0.875rem (14px), weight 400-500
- Labels/captions: 0.75rem (12px), weight 600-700, uppercase with letter-spacing
- Monospace values: SF Mono / Fira Code for prices and codes

### Spacing & Radius
- Card border radius: 0.75rem (12px)
- Button radius: 0.5rem (8px)
- Chip/badge radius: 9999px (full)
- Page padding: 2rem (32px)
- Section spacing: 1.5rem (24px) vertical
- Card internal padding: 1.25rem (20px)

### Layout Patterns
- Sidebar + main content (desktop-first)
- 4-column KPI grid (responsive to 2, then 1)
- 2-column grid for side-by-side cards
- 3-column grid for analytics metrics
- Full-width data tables with horizontal scroll
- Slide-out panel for order details

## 4. Workflow Continuity Plan

### Auth → Console
Login form submits → cookie-based session → redirect to onboarding (if needed) → store selection → store dashboard. All existing cookie/middleware gating preserved.

### Dashboard → Operations
Dashboard provides KPI overview with direct links to orders, menu. Recent orders table links to full orders view. Alerts show cross-feature status.

### Orders → Detail → Actions
Orders table shows all orders with status filtering. Click "View" opens slide-out detail panel with full customer info, itemized order, and contextual action buttons (Accept/Reject for new, Mark Ready for preparing, etc.).

### Menu → Categories → Items
Category chips filter the item list. Each item shows availability toggle, price, and edit button. Search works across all categories.

### Store → Settings → Analytics
Store info manages profile and hours. Settings controls operational behavior. Analytics shows performance trends. Settlement tracks financial history. All cross-linked via sidebar navigation.

### Reviews → Response
Reviews show pending/responded filter tabs. Unresponded reviews have accent border and "Write Response" CTA. Responded reviews show the response inline.

## 5. Mock Data Strategy

File: `merchant-console/src/shared/data/merchant-mock-data.ts`

Realistic mock data for "Sabor Criollo Kitchen", an Argentine restaurant in Buenos Aires:
- 7 orders across all statuses (new → cancelled) with real item names, modifiers, addresses
- 20 menu items across 8 categories (Empanadas, Parrilla, Milanesas, Pizzas, etc.)
- 6 reviews with varying ratings and response states
- 4 promotions (percentage, fixed, free delivery) with usage tracking
- 5 weekly settlement records with commission calculations
- 7-day revenue breakdown and 5 top-selling items
- 4 store alerts (stock, promos, settlements, reviews)
