# Full Product Screen Cluster Map

Date: 2026-03-17
Status: Active
Purpose: Complete inventory of all screens grouped into implementation clusters

---

## customer-app (Flutter) — 23 screens

### Auth Cluster (4 screens)
| Screen | File | Runtime State |
|--------|------|---------------|
| Auth entry | auth_screen.dart | Route decision: signed-out → phone, guest → guest entry |
| Phone input | auth_phone_screen.dart | OTP request (placeholder) |
| OTP verify | auth_otp_screen.dart | OTP validation (placeholder) |
| Guest entry | guest_entry_screen.dart | Sets guest session state |

### Onboarding Cluster (1 screen)
| Screen | File | Runtime State |
|--------|------|---------------|
| Onboarding | onboarding_screen.dart | Profile setup (placeholder) |

### Browse Cluster (5 screens)
| Screen | File | Runtime State |
|--------|------|---------------|
| Home | home_screen.dart | Categories, featured stores, promos |
| Discovery | discovery_screen.dart | Category-filtered store list |
| Search | search_screen.dart | Text search → store results |
| Filter | filter_screen.dart | Sort/cuisine/price/dietary filters |
| Store | store_screen.dart | Store info + menu categories |

### Cart-Checkout Cluster (3 screens)
| Screen | File | Runtime State |
|--------|------|---------------|
| Menu browsing | menu_browsing_screen.dart | Item list, add to cart |
| Cart | cart_screen.dart | Cart items, promo, price breakdown |
| Checkout | checkout_screen.dart | Address, payment, submit order |

### Orders Cluster (3 screens)
| Screen | File | Runtime State |
|--------|------|---------------|
| Orders list | orders_screen.dart | Active/history tabs |
| Order detail | order_detail_screen.dart | Full order record view |
| Order status | order_status_screen.dart | Live status + timeline |

### Account Cluster (5 screens)
| Screen | File | Runtime State |
|--------|------|---------------|
| Profile | profile_screen.dart | User info, settings links |
| Settings | settings_screen.dart | App preferences |
| Addresses | addresses_screen.dart | CRUD address list |
| Notifications | notifications_screen.dart | Notification list with read state |
| Reviews | reviews_screen.dart | Leave/view reviews |

### Social Cluster (2 screens)
| Screen | File | Runtime State |
|--------|------|---------------|
| Group order | group_order_screen.dart | Group order creation |
| Group share | group_order_share_screen.dart | Share link UI |

---

## merchant-console (Next.js) — 12 screens

### Auth Cluster (3 screens)
| Screen | File | Runtime State |
|--------|------|---------------|
| Login | login-screen.tsx | Demo sign-in form |
| Onboarding | onboarding-screen.tsx | Merchant profile setup |
| Store selection | store-selection-screen.tsx | Demo store picker |

### Operations Cluster (3 screens)
| Screen | File | Runtime State |
|--------|------|---------------|
| Dashboard | dashboard-screen.tsx | KPIs, recent orders, alerts |
| Orders | orders-screen.tsx | Tab-filtered order table + detail panel |
| Menu | menu-screen.tsx | Category list + item management |

### Business Cluster (4 screens)
| Screen | File | Runtime State |
|--------|------|---------------|
| Settlement | settlement-screen.tsx | Settlement history table |
| Analytics | analytics-screen.tsx | Revenue chart, top items, metrics |
| Reviews | reviews-screen.tsx | Review list with response actions |
| Promotions | promotions-screen.tsx | Promo management table |

### Settings Cluster (2 screens)
| Screen | File | Runtime State |
|--------|------|---------------|
| Settings | settings-screen.tsx | Account preferences |
| Store management | store-management-screen.tsx | Store info, hours, delivery settings |

---

## admin-console (Next.js) — 18 screens

### Auth Cluster (2 screens)
| Screen | File | Runtime State |
|--------|------|---------------|
| Login | login-screen.tsx | Demo admin sign-in |
| Access boundary | access-boundary-screen.tsx | Permission check gate |

### Overview Cluster (2 screens)
| Screen | File | Runtime State |
|--------|------|---------------|
| Dashboard | dashboard-screen.tsx | Platform KPIs, recent orders, alerts, health |
| System management | system-management-screen.tsx | Health status, feature flags |

### Order Management Cluster (2 screens)
| Screen | File | Runtime State |
|--------|------|---------------|
| Orders | orders-screen.tsx | Platform order table + detail panel |
| Disputes | disputes-screen.tsx | Dispute table with priority/status |

### Merchant Management Cluster (3 screens)
| Screen | File | Runtime State |
|--------|------|---------------|
| Merchants | merchants-screen.tsx | Merchant table |
| Stores | stores-screen.tsx | Store table across merchants |
| Catalog | catalog-screen.tsx | Category/item management |

### Finance Cluster (2 screens)
| Screen | File | Runtime State |
|--------|------|---------------|
| Settlements | settlements-screen.tsx | Settlement table per store |
| Finance | finance-screen.tsx | Revenue summary + settlement overview |

### Support Cluster (2 screens)
| Screen | File | Runtime State |
|--------|------|---------------|
| Customer service | customer-service-screen.tsx | Support ticket table |
| Users | users-screen.tsx | Platform user management |

### Growth Cluster (3 screens)
| Screen | File | Runtime State |
|--------|------|---------------|
| Marketing | marketing-screen.tsx | Campaign management |
| Announcements | announcements-screen.tsx | Platform announcements |
| B2B | b2b-screen.tsx | Partner management |

### Intelligence Cluster (2 screens)
| Screen | File | Runtime State |
|--------|------|---------------|
| Analytics | analytics-screen.tsx | Platform metrics and trends |
| Reporting | reporting-screen.tsx | Generated reports list |

---

## public-website (Next.js) — 8 screens

### Marketing Cluster (3 screens)
| Screen | File | Runtime State |
|--------|------|---------------|
| Landing | landing-screen.tsx | Hero, features, steps, reviews, merchant pitch |
| Service intro | service-introduction-screen.tsx | Service overview |
| App download | app-download-screen.tsx | Download CTAs |

### Conversion Cluster (1 screen)
| Screen | File | Runtime State |
|--------|------|---------------|
| Merchant onboarding | merchant-onboarding-screen.tsx | Merchant signup pitch |

### Support Cluster (1 screen)
| Screen | File | Runtime State |
|--------|------|---------------|
| Customer support | customer-support-screen.tsx | FAQ + contact |

### Legal Cluster (3 screens)
| Screen | File | Runtime State |
|--------|------|---------------|
| Privacy | privacy-screen.tsx | Privacy policy |
| Terms | terms-screen.tsx | Terms of service |
| Refund policy | refund-policy-screen.tsx | Refund policy |

---

## Total Inventory

| Surface | Screens | Clusters |
|---------|---------|----------|
| customer-app | 23 | 7 |
| merchant-console | 12 | 4 |
| admin-console | 18 | 8 |
| public-website | 8 | 4 |
| **Total** | **61** | **23** |

### Backend-Limited Screens
These screens display data but have no real mutation capability. They will look and feel complete but operate on in-memory mock data until backend integration:
- All merchant-console screens (read-only mock data, cookie-only auth mutations)
- All admin-console screens (same pattern)
- customer-app: checkout/orders (submitOrder creates local state only)
- customer-app: auth screens (demo auth, no provider)

---

*Cluster map completed: 2026-03-17*
