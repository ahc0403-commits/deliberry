# Cross-Surface UX Rules

Status: active
Authority: binding (UX implementation)
Surface: cross-surface
Last updated: 2026-03-17

---

## 1. Navigation Consistency

### Mobile (customer-app)
- Bottom navigation bar: 72px height, 4-5 primary destinations
- Tab bars for secondary navigation within screens
- Back button: leading position in AppBar
- No sidebar, no drawer as primary navigation

### Web Consoles (merchant, admin)
- Fixed left sidebar: 240px width, dark background
- Top header bar: 56px, white, sticky
- Sidebar groups navigation by domain with uppercase section labels
- Active nav item: tinted background + lighter text
- No bottom navigation on web

### Public Website
- Top header: sticky, 64px, backdrop-blur
- Inline page navigation via scroll sections
- Footer navigation for secondary links
- No sidebar, no bottom nav

### Cross-Surface Rule
- Each surface owns its navigation pattern. Never transplant mobile nav to web or vice versa.
- Navigation depth: maximum 2 levels (surface shell + feature screen). No nested sub-navigations.

---

## 2. Screen Layout Patterns

### Dashboard Screens
- KPI grid at top (4-6 metrics, responsive columns)
- Recent activity table below KPIs
- Quick action buttons in header or after KPIs
- Alerts/notifications sidebar or banner

### List/Table Screens
- Filter bar at top (tabs + search + filter chips)
- Data table or card list below filters
- Pagination or infinite scroll at bottom
- Empty state centered when no data

### Detail Screens
- Header section: entity identity (name, ID, status badge)
- Body sections: grouped information cards
- Action buttons: sticky bottom (mobile) or header-right (web)
- Back navigation: AppBar back button (mobile), breadcrumb or back link (web)

### Form Screens
- Single-column layout, max-width 640px on web
- Section grouping with section titles
- Submit button: sticky bottom (mobile), form footer (web)
- Validation: inline, immediate on blur

---

## 3. Interaction Patterns

### Tap/Click Feedback
- Mobile: Material ripple effect on all tappable surfaces
- Web: cursor pointer + hover state (background color change, shadow lift)
- All interactive elements must have visible focus states for accessibility

### Action Confirmation
- Destructive actions (delete, cancel order): confirmation dialog required
- Non-destructive mutations (add to cart, update quantity): immediate with undo option or feedback
- Success feedback: SnackBar (mobile), toast notification (web), 3-second auto-dismiss

### Loading Feedback
- Button press: replace text with spinner, maintain button dimensions
- Data fetch: skeleton screen (not blank screen, not spinner-only)
- Page transition: immediate shell render, content fills via skeleton

### Error Feedback
- Form errors: inline below the field, red border, error message in caption size
- Network errors: banner at top of content area, retry button
- Not-found: empty state pattern with navigation CTA

---

## 4. Data Display Rules

### Money
- Always display via `formatMoney()` (web) or `formatCentavos()` (mobile)
- Always include currency symbol
- Right-align money values in tables
- Use monospace for money in tables for column alignment

### Timestamps
- Data layer: UTC ISO 8601 (ending with Z)
- Display layer: local time, human-readable format
- Orders: "Today, 2:30 PM" / "Yesterday" / "Mar 12"
- Notifications: relative time ("2 min ago", "1 hour ago")
- Tables: date + time or date only depending on context

### Status
- Data layer: canonical enum values from shared/constants
- Display layer: human-readable labels via presentation-layer map
- Always show status as a colored badge, never as plain text
- Badge color follows the semantic mapping in DESIGN_SYSTEM_BASELINE

### IDs and Codes
- Order IDs: monospace, muted color
- Promo codes: monospace, uppercase
- Phone numbers: formatted with country code

---

## 5. Responsive Rules

### Breakpoints
| Name | Width | Surfaces |
|------|-------|----------|
| Mobile | < 768px | customer-app (native), public-website |
| Tablet | 768px - 1024px | public-website, web consoles (collapsed sidebar) |
| Desktop | > 1024px | web consoles, public-website |
| Wide | > 1400px | web consoles (expanded grids) |

### Mobile-First
- public-website: designed mobile-first, enhanced for desktop
- customer-app: mobile-only (Flutter native)
- Web consoles: desktop-first, sidebar collapses on tablet

### Grid Behavior
- KPI grids: 6 → 3 → 2 → 1 columns as viewport narrows
- Feature grids: 3 → 2 → 1 columns
- Table: horizontal scroll on mobile/tablet if needed, never wrap rows

---

## 6. Accessibility Minimums

- Color contrast: WCAG AA (4.5:1 for text, 3:1 for large text)
- Touch targets: minimum 44px (web), 48px (mobile)
- Focus indicators: visible ring on all interactive elements
- Alt text: all meaningful images
- Semantic HTML: proper heading hierarchy (h1 → h2 → h3)
- No information conveyed by color alone (always pair with text or icon)

---

*Rules established: 2026-03-17*
