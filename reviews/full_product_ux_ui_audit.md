# Full Product UX/UI Audit

Date: 2026-03-17
Scope: customer-app, merchant-console, admin-console, public-website
Status: Active baseline audit

---

## Cross-Surface Issues

### 1. Inconsistent Icon Systems
- customer-app: Material Icons (proper SVG)
- merchant-console: Emoji/Unicode characters for dashboard and sidebar icons
- admin-console: Emoji/Unicode characters
- public-website: Emoji characters for feature icons
- **Impact**: Web surfaces feel prototype-like. Mobile feels production-grade.

### 2. Flat Card Design on Web Surfaces
- merchant-console and admin-console cards use `border: 1px solid` with no shadow
- Cards blend into the `surface-alt` background with insufficient visual separation
- customer-app cards use the same pattern but Mobile context makes it less noticeable
- **Impact**: Dashboard and data screens feel lifeless

### 3. No Skeleton Loading States
- No surface has skeleton/placeholder loading patterns
- customer-app uses button text change ("Placing Order...") as only loading feedback
- Web surfaces show no loading indication at all
- **Impact**: Users have zero feedback during data fetches or mutations

### 4. Minimal Error/Validation States
- No inline form validation (red borders, error messages, checkmarks)
- Errors are SnackBar-only (customer-app) or not shown (web)
- No error boundary patterns for failed data loads
- **Impact**: Users cannot tell if forms are valid before submission

### 5. No Consistent Empty State Quality
- All surfaces have basic empty states (icon + title + subtitle)
- No illustrations, no contextual guidance, no animated elements
- **Impact**: Empty screens feel abandoned rather than guided

### 6. Money Formatting Inconsistency
- customer-app: `formatCentavos()` (local helper, simple division)
- merchant-console: inline `(value / 100).toFixed(2)` or `.toLocaleString()`
- admin-console: same inline pattern
- `formatMoney()` from shared/utils/currency.ts is exported but not called by any surface
- **Impact**: ARS locale formatting not applied. Dollar sign hardcoded.

---

## Surface-Specific Issues

### customer-app (Flutter) — Score: 4.0/5

**Strengths**:
- Material 3 theme is well-structured (app_theme.dart)
- Coral primary (#FF4B3A) is warm and brand-appropriate
- 52px button height is excellent for mobile touch targets
- 16px card radius and 14px input radius create friendly roundness
- Negative letter-spacing on headlines creates premium feel
- Bottom nav at 72px is spacious and accessible
- Clear component hierarchy in widgets.dart (StoreCard, MenuItemCard, OrderCard, etc.)

**Issues**:
- Cards are flat (elevation: 0, border only) — could use subtle shadow
- Info notice cards lack visual emphasis (no left accent bar, no icon treatment)
- No skeleton screens for any data-loading context
- StatusBadge is functional but visually simple
- Promo banners use gradient colors well but lack polish at edges
- Filter/sort sheets are basic

### merchant-console (Next.js) — Score: 3.0/5

**Strengths**:
- Dark sidebar (#1E293B) creates clear navigation boundary
- 240px sidebar width is standard and comfortable
- 4px spacing grid is disciplined (4, 8, 12, 16, 20, 24, 32, 40, 48, 64)
- Status badges use proper semantic colors (green/yellow/red/blue)
- Tab bar with active indicator is clean
- KPI grid is responsive (6 → 3 → 2 → 1 columns)

**Issues**:
- Emoji icons throughout (dashboard: revenue emoji, orders emoji, etc.)
- Cards have shadow-sm only — barely visible
- Table rows lack visual separation (hover is the only affordance)
- No form validation states shown
- Order detail panel uses inline styles, not component classes
- Button sizing (8px × 16px padding) feels small for primary actions
- No disabled button styling defined
- Alert system exists but is not actively used in screens

### admin-console (Next.js) — Score: 3.0/5

**Strengths**:
- Indigo primary (#4F46E5) signals governance authority
- Darker sidebar (#0F172A) reinforces separation from merchant
- Summary grid (3-4 column) provides overview-first structure
- Status/priority/type badge system is comprehensive
- Table design consistent with merchant-console

**Issues**:
- Same emoji icon problem as merchant-console
- Same flat card problem
- Same minimal loading/error states
- Monospace text for IDs is functional but unstyled
- Inline styles in JSX (not using CSS classes consistently)
- Feature flags screen references governance concepts but has no visual distinction

### public-website (Next.js) — Score: 4.5/5

**Strengths**:
- Hero section is polished: gradient background, badge animation, large typography
- H1 at 3rem/w900 makes bold statements
- Pill-shaped buttons with shadow and hover lift feel premium
- 24px card radius and generous spacing (5rem section padding) create breathing room
- Eyebrow + headline + subheadline pattern is clear and repeatable
- Steps section with connecting gradient line is visually engaging
- Merchant pitch section uses dark gradient background effectively
- Footer is well-structured with 4-column grid

**Issues**:
- Emoji icons for features (lightning, pizza, etc.) instead of SVG
- Review cards use initial-letter avatars instead of images
- Some section variety could be improved (mostly card grids)

---

## Priority Matrix

| Issue | Impact | Effort | Priority |
|-------|--------|--------|----------|
| Replace emoji with SVG icons (web) | HIGH | MEDIUM | P0 |
| Add card shadows + hover elevation | HIGH | LOW | P0 |
| Add skeleton loading states | HIGH | MEDIUM | P1 |
| Add form validation states | HIGH | MEDIUM | P1 |
| Adopt formatMoney across surfaces | MEDIUM | LOW | P1 |
| Improve empty states | MEDIUM | MEDIUM | P2 |
| Add table row visual separation | MEDIUM | LOW | P2 |
| Improve button sizing on web | LOW | LOW | P2 |

---

*Audit completed: 2026-03-17*
