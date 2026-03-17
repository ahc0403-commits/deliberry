# Admin Console UI Execution Plan

## Objective
Replace all AdminFeatureScaffold placeholder screens with real platform-governance UI across the admin console.

## Design Direction
- **Identity**: Structured, powerful, high-trust, serious, desktop-first
- **Primary color**: Indigo (#4F46E5) — authority weight
- **Sidebar**: Dark navy with grouped navigation sections + icons + count badges
- **Surfaces**: Same product family as merchant/customer but with stronger platform-control weight

## Priority Tiers

### P0 — Auth + Shell + Core Operations (11 files)
| File | Scope |
| --- | --- |
| `(auth)/layout.tsx` | Clean auth card, remove dev nav |
| `login-screen.tsx` | Email/password form, branded |
| `access-boundary-screen.tsx` | Role selector with icons, remove scaffold |
| `(platform)/layout.tsx` | Enhanced sidebar with emoji icons, badges, grouped nav |
| `dashboard-screen.tsx` | 6 KPI cards, recent orders table, alerts panel |
| `users-screen.tsx` | Summary cards, full user data table |
| `merchants-screen.tsx` | Summary cards, merchant governance table |
| `stores-screen.tsx` | Summary cards, store oversight table |
| `orders-screen.tsx` | Tabbed (all/active/delivered/disputed), data table, slide-out detail panel |
| `disputes-screen.tsx` | Summary cards, dispute case table with priority badges |
| `customer-service-screen.tsx` | Summary cards, support ticket table |

### P1 — Finance (2 files)
| File | Scope |
| --- | --- |
| `settlements-screen.tsx` | Summary cards (gross/commission/net/pending), settlement history table |
| `finance-screen.tsx` | 6-metric finance summary, recent settlements table |

### P1 — Content (4 files)
| File | Scope |
| --- | --- |
| `marketing-screen.tsx` | Campaign summary, data table with budget usage bars |
| `announcements-screen.tsx` | Published/scheduled/draft counts, announcement table |
| `catalog-screen.tsx` | Category/store/item counts, category governance table |
| `b2b-screen.tsx` | Partner summary, contract table |

### P2 — System (3 files)
| File | Scope |
| --- | --- |
| `analytics-screen.tsx` | 8-metric KPI grid, weekly revenue bar chart |
| `reporting-screen.tsx` | Metrics grid, available reports list, scheduled reports |
| `system-management-screen.tsx` | Health grid with status dots, feature flags with toggles |

## Data Layer (Foundation — completed first)
| File | Scope |
| --- | --- |
| `admin-mock-data.ts` | 20+ types, comprehensive mock data for all 16 domains |
| `admin-repository.ts` | Rich typed data returns (DashboardData, UsersData, etc.) |
| `admin-query-services.ts` | Proxy methods to repository |
| `globals.css` | Complete admin design system: indigo primary, dark navy sidebar, all component classes |

## Rules Followed
- No AdminFeatureScaffold imports remain in any screen
- All route names preserved
- All page.tsx wrappers unchanged
- Server action integration preserved (auth, permissions)
- Cookie/middleware gating unchanged
- Surface boundaries respected
- "use client" only on orders (interactive detail panel)
- No live backend integration
- No payment verification
- No realtime tracking
