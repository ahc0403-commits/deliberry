# Full Product Redesign Execution Plan

Date: 2026-03-17
Status: Active
Authority: Implementation sequencing for redesign

---

## Execution Summary

61 screens across 4 surfaces, organized into 23 clusters, rebuilt in 4 phases. Phase 0 (foundation) must complete before any screen work begins. Each cluster can be assigned to an independent implementation agent.

---

## Phase 0 — Foundation (estimated: 1 session)

### Dependencies: None. Do first.

| Task | Surface | What To Do |
|------|---------|------------|
| Install lucide-react | merchant-console, admin-console | `npm install lucide-react` |
| globals.css card shadows | merchant-console | Update `.card` to include `box-shadow: var(--shadow-sm)`, add hover `var(--shadow-md)` + `translateY(-1px)` |
| globals.css card shadows | admin-console | Same as merchant |
| globals.css table rows | merchant-console | Add `border-bottom: 1px solid var(--border-light)` to `tbody tr`, verify hover fill |
| globals.css table rows | admin-console | Same |
| globals.css button sizing | merchant-console | Primary action buttons: `padding: 10px 20px` |
| globals.css button sizing | admin-console | Same |
| globals.css skeleton | merchant-console | Add `.skeleton` class with shimmer animation |
| globals.css skeleton | admin-console | Same |
| app_theme.dart shadows | customer-app | Set `cardTheme.elevation` to 1, add shadow to card shape |
| Skeleton widget | customer-app | Add `SkeletonLoader` widget to widgets.dart |
| SVG icon prep | public-website | Install lucide-react or prepare inline SVG icons |

### Validation after Phase 0
```bash
npm run typecheck --prefix merchant-console
npm run typecheck --prefix admin-console
npm run typecheck --prefix public-website
cd customer-app && flutter analyze
```

---

## Phase 1 — High-Impact Screens (estimated: 2-3 sessions)

### Cluster 1A: merchant Dashboard + Orders
- **Priority**: P0 — most used merchant screens
- **Files**: dashboard-screen.tsx, orders-screen.tsx
- **Depends on**: Phase 0 complete
- **Key work**: Emoji → Lucide icons, KPI accent bars, table row borders, formatMoney adoption, order detail panel polish

### Cluster 1B: admin Dashboard + Orders + Disputes
- **Priority**: P0 — most used admin screens
- **Files**: dashboard-screen.tsx, orders-screen.tsx, disputes-screen.tsx
- **Depends on**: Phase 0 complete
- **Key work**: Same icon/table/card pattern as 1A, plus dispute priority badges, summary stats

### Cluster 1C: customer Home + Store + Cart
- **Priority**: P0 — core customer browsing flow
- **Files**: home_screen.dart, store_screen.dart, menu_browsing_screen.dart, cart_screen.dart
- **Depends on**: Phase 0 complete
- **Key work**: Card elevation, store card depth, add-to-cart feedback, cart skeleton

### Cluster 1D: public Landing
- **Priority**: P0 — first impression page
- **Files**: landing-screen.tsx
- **Depends on**: Phase 0 SVG prep
- **Key work**: All emoji → SVG in feature cards, steps, merchant pitch, trust metrics

### Validation after Phase 1
```bash
npm run typecheck --prefix merchant-console
npm run typecheck --prefix admin-console
npm run typecheck --prefix public-website
cd customer-app && flutter analyze
bash scripts/governance-scan.sh
```

---

## Phase 2 — Secondary Screens (estimated: 2-3 sessions)

### Cluster 2A: merchant Operations (5 screens)
- **Depends on**: Cluster 1A patterns established
- **Files**: menu-screen.tsx, settlement-screen.tsx, analytics-screen.tsx, reviews-screen.tsx, promotions-screen.tsx

### Cluster 2B: admin Operations (5 screens)
- **Depends on**: Cluster 1B patterns established
- **Files**: settlements-screen.tsx, finance-screen.tsx, users-screen.tsx, merchants-screen.tsx, stores-screen.tsx

### Cluster 2C: customer Checkout + Orders (4 screens)
- **Depends on**: Cluster 1C patterns established
- **Files**: checkout_screen.dart, orders_screen.dart, order_detail_screen.dart, order_status_screen.dart

---

## Phase 3 — Long-Tail Completion (estimated: 3-4 sessions)

### Cluster 3A: merchant Settings + Auth (5 screens)
- settings-screen.tsx, store-management-screen.tsx, login-screen.tsx, onboarding-screen.tsx, store-selection-screen.tsx

### Cluster 3B: admin Long-Tail (10 screens)
- customer-service, marketing, announcements, catalog, b2b, analytics, reporting, system-management, access-boundary, login

### Cluster 3C: customer Secondary (12 screens)
- search, filter, discovery, addresses, notifications, reviews, profile, settings, auth (3 screens), guest entry, onboarding, group order (2 screens)

### Cluster 3D: public Pages (7 screens)
- service-intro, merchant-onboarding, app-download, support, privacy, terms, refund-policy

---

## Cross-Cutting Concerns

### formatMoney Adoption (can be done as a sweep after Phase 1)
- 6 merchant-console screens use inline `(v/100).toFixed(2)`
- 9 admin-console screens use inline `(v/100).toLocaleString()`
- Replace all with `formatMoney(centavos)` from surface domain adapter
- customer-app already uses `formatCentavos()` — acceptable as-is

### Empty State Enhancement (can be done as a sweep after Phase 2)
- Add contextual empty state components per surface
- Each empty state: icon (48px SVG) + title + description + CTA
- Minimum 8 empty state variations needed (one per major data type)

### Skeleton Screen Addition (can be done as a sweep after Phase 1)
- Add skeleton variants for: table (5 shimmer rows), card grid (3-6 shimmer cards), detail panel (shimmer blocks)
- Each surface needs its own skeleton components using the foundation CSS/widget from Phase 0

---

## Blockers and Constraints

| Constraint | Impact | Mitigation |
|-----------|--------|------------|
| No backend | Screens show mock data only | Follow PLACEHOLDER_HONESTY_RULES |
| No real auth | Auth screens are demo-only | Show "demo mode" notice per honesty rules |
| No live mutations | Actions create local state only | Preserve current runtime behavior exactly |
| No real payments | Payment selection is display-only | Keep "Placeholder only" notice on checkout |
| formatMoney not in Dart | customer-app uses local helper | Keep `formatCentavos()` — governance-acceptable |

---

## Parallel Execution Strategy

These clusters can run simultaneously with independent agents:

| Stream | Clusters | Surface |
|--------|----------|---------|
| Stream A | 1A → 2A → 3A | merchant-console |
| Stream B | 1B → 2B → 3B | admin-console |
| Stream C | 1C → 2C → 3C | customer-app |
| Stream D | 1D → 3D | public-website |

Phase 0 is a shared prerequisite for all streams.

---

## Definition of Done (per cluster)

A cluster rebuild is complete when:
1. All emoji/Unicode icons replaced with SVG (web) or Material Icons used correctly (mobile)
2. All cards have shadow-sm rest + shadow-md hover (per VISUAL_POLISH_RULES)
3. All tables have row borders and proper header styling
4. All status values display via badges with semantic colors
5. All money values use canonical formatting
6. Empty states follow the defined pattern (icon + title + description + CTA)
7. `npm run typecheck` / `flutter analyze` passes
8. `scripts/governance-scan.sh` passes
9. No inline styles that duplicate defined CSS classes
10. No emoji characters remaining in UI-facing code

---

*Execution plan established: 2026-03-17*
