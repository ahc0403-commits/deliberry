# Screen Cluster Rebuild Order

Status: active
Authority: binding (implementation sequencing)
Surface: cross-surface
Last updated: 2026-03-17

---

## Execution Principle

Rebuild order is determined by: (1) foundation dependencies, (2) user-facing impact, (3) surface priority. Foundation work (globals, theme, shared components) must come before screen rebuilds. High-traffic screens before low-traffic screens.

---

## Phase 0 — Foundation (all surfaces, do first)

| # | Task | Surface | Files | Depends On |
|---|------|---------|-------|------------|
| 0.1 | Install Lucide React icon library | merchant-console | package.json | — |
| 0.2 | Install Lucide React icon library | admin-console | package.json | — |
| 0.3 | Update globals.css: card shadow defaults | merchant-console | globals.css | — |
| 0.4 | Update globals.css: card shadow defaults | admin-console | globals.css | — |
| 0.5 | Update globals.css: table row borders | merchant-console | globals.css | — |
| 0.6 | Update globals.css: table row borders | admin-console | globals.css | — |
| 0.7 | Update globals.css: button sizing | merchant-console | globals.css | — |
| 0.8 | Update globals.css: button sizing | admin-console | globals.css | — |
| 0.9 | Add skeleton component CSS | merchant-console | globals.css | — |
| 0.10 | Add skeleton component CSS | admin-console | globals.css | — |
| 0.11 | Update app_theme.dart: card elevation | customer-app | app_theme.dart | — |
| 0.12 | Add skeleton widget | customer-app | widgets.dart | — |
| 0.13 | Replace emoji icons in public-website | public-website | landing-screen.tsx, globals.css | 0.1-like SVG approach |

**Completion criteria**: All surfaces have updated shadow/border/button/skeleton foundations before any screen rebuild begins.

---

## Phase 1 — High-Impact Screens (core flows)

### Cluster 1A: merchant-console Dashboard + Orders
| # | Screen | File | Key Changes |
|---|--------|------|-------------|
| 1A.1 | Dashboard | dashboard-screen.tsx | Replace emoji icons → Lucide SVG; KPI cards get left accent bar; recent orders table gets row borders |
| 1A.2 | Orders | orders-screen.tsx | Replace emoji → SVG; table row borders; action buttons as icon+tooltip; detail panel formatting; formatMoney adoption |

### Cluster 1B: admin-console Dashboard + Orders + Disputes
| # | Screen | File | Key Changes |
|---|--------|------|-------------|
| 1B.1 | Dashboard | dashboard-screen.tsx | Replace emoji → SVG; KPI cards; table borders |
| 1B.2 | Orders | orders-screen.tsx | Same pattern as merchant orders; formatMoney; detail panel |
| 1B.3 | Disputes | disputes-screen.tsx | Summary stats; priority badges with icon; table borders |

### Cluster 1C: customer-app Home + Store + Cart
| # | Screen | File | Key Changes |
|---|--------|------|-------------|
| 1C.1 | Home | home_screen.dart | Card shadow elevation; store card depth; promo carousel polish |
| 1C.2 | Store | store_screen.dart | Store header depth; menu item cards shadow |
| 1C.3 | Menu browsing | menu_browsing_screen.dart | Item card shadows; add-to-cart feedback |
| 1C.4 | Cart | cart_screen.dart | Card shadows; price row polish; skeleton for cart loading |

### Cluster 1D: public-website Landing
| # | Screen | File | Key Changes |
|---|--------|------|-------------|
| 1D.1 | Landing | landing-screen.tsx | Replace all emoji with SVG icons in feature cards, steps, merchant pitch |

---

## Phase 2 — Secondary Screens (supporting flows)

### Cluster 2A: merchant-console Operations
| # | Screen | File | Key Changes |
|---|--------|------|-------------|
| 2A.1 | Menu | menu-screen.tsx | SVG icons; card shadows; item grid polish |
| 2A.2 | Settlement | settlement-screen.tsx | Table borders; formatMoney; period display polish |
| 2A.3 | Analytics | analytics-screen.tsx | SVG icons; metric cards; chart area formatting |
| 2A.4 | Reviews | reviews-screen.tsx | Review cards; response UI; star ratings |
| 2A.5 | Promotions | promotions-screen.tsx | Promo cards; status badges; formatMoney |

### Cluster 2B: admin-console Operations
| # | Screen | File | Key Changes |
|---|--------|------|-------------|
| 2B.1 | Settlements | settlements-screen.tsx | Table borders; formatMoney; summary stats |
| 2B.2 | Finance | finance-screen.tsx | Summary card accent bars; settlement table |
| 2B.3 | Users | users-screen.tsx | Table borders; role badges; status dots |
| 2B.4 | Merchants | merchants-screen.tsx | Table borders; revenue formatting |
| 2B.5 | Stores | stores-screen.tsx | Table borders; status badges |

### Cluster 2C: customer-app Checkout + Orders
| # | Screen | File | Key Changes |
|---|--------|------|-------------|
| 2C.1 | Checkout | checkout_screen.dart | Card shadows; info notice left accent; payment selection polish |
| 2C.2 | Orders list | orders_screen.dart | Order card shadows; tab bar polish |
| 2C.3 | Order detail | order_detail_screen.dart | Section card shadows; item rows; price summary |
| 2C.4 | Order status | order_status_screen.dart | Timeline animation; milestone polish |

---

## Phase 3 — Tertiary Screens (long-tail)

### Cluster 3A: merchant-console Settings + Management
| # | Screen | File | Key Changes |
|---|--------|------|-------------|
| 3A.1 | Settings | settings-screen.tsx | Form sections; toggle switches; card shadows |
| 3A.2 | Store management | store-management-screen.tsx | Info cards; hours table; form polish |
| 3A.3 | Login | login-screen.tsx | Form polish; demo notice |
| 3A.4 | Onboarding | onboarding-screen.tsx | Step indicator; form polish |
| 3A.5 | Store selection | store-selection-screen.tsx | Store cards; selection state |

### Cluster 3B: admin-console Long-Tail
| # | Screen | File | Key Changes |
|---|--------|------|-------------|
| 3B.1 | Customer service | customer-service-screen.tsx | Ticket table; priority badges |
| 3B.2 | Marketing | marketing-screen.tsx | Campaign cards; formatMoney |
| 3B.3 | Announcements | announcements-screen.tsx | Announcement cards; publish status |
| 3B.4 | Catalog | catalog-screen.tsx | Category tree; item cards |
| 3B.5 | B2B | b2b-screen.tsx | Partner table; contract dates |
| 3B.6 | Analytics | analytics-screen.tsx | Metric cards; chart polish |
| 3B.7 | Reporting | reporting-screen.tsx | Report list cards |
| 3B.8 | System management | system-management-screen.tsx | Health dots; feature flag toggles |
| 3B.9 | Access boundary | access-boundary-screen.tsx | Permission matrix; role badges |
| 3B.10 | Login | login-screen.tsx | Form polish; demo notice |

### Cluster 3C: customer-app Secondary
| # | Screen | File | Key Changes |
|---|--------|------|-------------|
| 3C.1 | Search | search_screen.dart | Search bar polish; result cards |
| 3C.2 | Filter | filter_screen.dart | Filter chips; bottom sheet polish |
| 3C.3 | Discovery | discovery_screen.dart | Category grid; store cards |
| 3C.4 | Addresses | addresses_screen.dart | Address cards; default badge; form polish |
| 3C.5 | Notifications | notifications_screen.dart | Notification tiles; unread indicator |
| 3C.6 | Reviews | reviews_screen.dart | Review form; star input; order context |
| 3C.7 | Profile | profile_screen.dart | Section list; avatar; sign out |
| 3C.8 | Settings | settings_screen.dart | Toggle list; section headers |
| 3C.9 | Auth screens | auth_screen.dart, auth_phone_screen.dart, auth_otp_screen.dart | Form polish; demo notice |
| 3C.10 | Guest entry | guest_entry_screen.dart | CTA clarity; demo notice |
| 3C.11 | Onboarding | onboarding_screen.dart | Step indicator; illustration areas |
| 3C.12 | Group order | group_order_screen.dart, group_order_share_screen.dart | Share UI; participant list |

### Cluster 3D: public-website Pages
| # | Screen | File | Key Changes |
|---|--------|------|-------------|
| 3D.1 | Service intro | service-introduction-screen.tsx | SVG icons; section polish |
| 3D.2 | Merchant onboarding | merchant-onboarding-screen.tsx | SVG icons; benefits cards; CTA form |
| 3D.3 | App download | app-download-screen.tsx | Platform badges; feature highlights |
| 3D.4 | Support | customer-support-screen.tsx | FAQ accordion; contact cards |
| 3D.5 | Privacy | privacy-screen.tsx | Section nav; prose formatting |
| 3D.6 | Terms | terms-screen.tsx | Same as privacy |
| 3D.7 | Refund policy | refund-policy-screen.tsx | Same as privacy |

---

## Summary

| Phase | Cluster Count | Screen Count | Priority |
|-------|--------------|-------------|----------|
| Phase 0 | 1 (foundation) | 0 (globals/theme) | MUST DO FIRST |
| Phase 1 | 4 clusters | 10 screens | HIGH — core user flows |
| Phase 2 | 3 clusters | 14 screens | MEDIUM — supporting flows |
| Phase 3 | 4 clusters | 34 screens | LOWER — long-tail completion |
| **Total** | **12 clusters** | **58 screens** | |

---

*Rebuild order established: 2026-03-17*
