# Full Surface Re-Validation

Status: historical
Authority: historical
Surface: cross-surface
Domains: audit-history, cross-surface, ui-status
Last updated: 2026-03-16
Last verified: 2026-03-16
Retrieve when:
- tracing the pre-rebuild connected-system audit baseline
- comparing the later final QA verdict against the earlier placeholder-era state
Superseded by: reviews/final_full_system_qa.md
Related files:
- reviews/final_full_system_qa.md
- docs/governance/WAVE_TRACKER.md

## 1. Executive Verdict
- overall product verdict: the repository is structurally separated into the correct four surfaces, but it does not currently operate as one coherent connected product.
- whether the system currently works as one coherent connected product: no. It works as a connected route skeleton with local demo session gates, not as a believable end-to-end product.
- highest-risk connected-experience blockers:
  - Cross-surface continuity stops at placeholder acquisition and placeholder entry. `public-website/src/features/app-download/presentation/app-download-screen.tsx` and `public-website/src/shared/data/public-content-repository.ts` explicitly keep customer handoff informational-only and placeholder-backed.
  - The customer app is still architecture-demo quality. Its routes exist, but most screens render `CustomerFlowScaffold` or `CustomerFeatureScaffold` from `customer-app/lib/features/common/presentation/`.
  - Merchant and admin auth flows are technically connected by cookies and middleware, but the actual screens are demo buttons and placeholder scaffolds rather than operational product UI. See `merchant-console/src/features/auth/presentation/login-screen.tsx`, `merchant-console/src/features/onboarding/presentation/onboarding-screen.tsx`, `admin-console/src/features/auth/presentation/login-screen.tsx`, and `admin-console/src/features/permissions/presentation/access-boundary-screen.tsx`.
  - All major web console domains are backed by in-memory repositories whose own strings state that real loading is deferred. See `merchant-console/src/shared/data/merchant-repository.ts`, `admin-console/src/shared/data/admin-repository.ts`, and `public-website/src/shared/data/public-content-repository.ts`.
  - Shared contracts exist, but there is no real cross-surface runtime continuity layer. Session state is local per surface: Flutter memory store for customer, cookies for merchant, cookies for admin, and no public-to-product deep link/runtime handoff beyond navigation links.

## 2. Surface Inventory
| Surface | Entry point | Runtime | Launch method | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| public website | `public-website/src/app/(marketing)/page.tsx` via `public-website/src/app/layout.tsx` | Next.js 15 / React 19 | `npm run dev` in `public-website` | PLACEHOLDER_UI | No fixed port is defined in repo code. Marketing and legal routes exist, but the dominant UI is `PublicFeatureScaffold`. |
| customer app | `customer-app/lib/main.dart` -> `customer-app/lib/app/app.dart` | Flutter | `flutter run` in `customer-app` | PLACEHOLDER_UI | `initialRoute` is `/entry`. Uses only local in-memory session state. |
| merchant console | `merchant-console/src/app/page.tsx` -> `/login` | Next.js 15 / React 19 | `npm run dev` in `merchant-console` | PLACEHOLDER_UI | Real cookie + middleware gating exists, but the console screens are scaffold-based placeholders. |
| admin console | `admin-console/src/app/page.tsx` -> `/login` | Next.js 15 / React 19 | `npm run dev` in `admin-console` | PLACEHOLDER_UI | Real cookie + role middleware gating exists, but every platform screen is still placeholder composition. |
| shared contracts layer | `shared/` | TypeScript contracts / JSON schemas / utils | consumed by surfaces, not directly launched | REAL_UI | Not a UI surface. Boundaries are correctly contract-only, but it does not provide connected runtime continuity. |

## 3. Route and Screen Status by Surface

### Public Website
| Route / Screen Cluster | File | Status (REAL_UI / PLACEHOLDER_UI / STUB_ONLY / MISSING) | Notes |
| --- | --- | --- | --- |
| Marketing shell | `public-website/src/app/(marketing)/layout.tsx` | PLACEHOLDER_UI | Real nav and footer exist, but shell copy still labels the surface as public-only and wraps scaffold pages. |
| Landing | `public-website/src/features/landing/presentation/landing-screen.tsx` | PLACEHOLDER_UI | Has a hero, but the main body is still `PublicFeatureScaffold` with placeholder state and structural section cards. |
| Service introduction | `public-website/src/features/service-introduction/presentation/service-introduction-screen.tsx` | PLACEHOLDER_UI | Pure scaffold-driven marketing placeholder. |
| Merchant onboarding / acquisition | `public-website/src/features/merchant-onboarding/presentation/merchant-onboarding-screen.tsx` | PLACEHOLDER_UI | No real inquiry flow, no form, no conversion UI. |
| Customer support | `public-website/src/features/customer-support/presentation/customer-support-screen.tsx` | PLACEHOLDER_UI | Informational scaffold only. |
| App download / customer handoff | `public-website/src/features/app-download/presentation/app-download-screen.tsx` | PLACEHOLDER_UI | Explicitly informational only. No actual app store links or deep handoff. |
| Legal cluster: privacy / terms / refund | `public-website/src/features/legal/presentation/privacy-screen.tsx` | PLACEHOLDER_UI | Legal pages are scaffold placeholders with short section cards, not real legal documents. |
| Missing customer-product launch handoff | none | MISSING | There is no direct public -> customer runtime launch path, only a placeholder download page. |

### Customer App
| Route / Screen Cluster | File | Status (REAL_UI / PLACEHOLDER_UI / STUB_ONLY / MISSING) | Notes |
| --- | --- | --- | --- |
| Entry | `customer-app/lib/app/entry/customer_entry_screen.dart` | PLACEHOLDER_UI | Session-handoff explainer page. |
| Auth landing | `customer-app/lib/features/auth/presentation/auth_screen.dart` | PLACEHOLDER_UI | Route buttons and auth architecture copy, not a login screen. |
| Phone entry | `customer-app/lib/features/auth/presentation/auth_phone_screen.dart` | STUB_ONLY | No phone field. |
| OTP entry | `customer-app/lib/features/auth/presentation/auth_otp_screen.dart` | STUB_ONLY | No OTP UI. |
| Guest entry | `customer-app/lib/features/auth/presentation/guest_entry_screen.dart` | STUB_ONLY | Guest policy copy only. |
| Onboarding | `customer-app/lib/features/onboarding/presentation/onboarding_screen.dart` | STUB_ONLY | No onboarding form or steps UI. |
| Main shell | `customer-app/lib/app/shells/main_shell.dart` | PLACEHOLDER_UI | Works structurally, not as a production shell. |
| Home / discovery | `customer-app/lib/features/home/presentation/home_screen.dart` | PLACEHOLDER_UI | Text-only section list. |
| Search / filters | `customer-app/lib/features/search/presentation/search_screen.dart` | PLACEHOLDER_UI | No search field or filter controls. |
| Store detail / menu | `customer-app/lib/features/store/presentation/store_screen.dart` | PLACEHOLDER_UI | No store or menu composition. |
| Group order / share | `customer-app/lib/features/group_order/presentation/group_order_screen.dart` | STUB_ONLY | Bare scaffold with placeholder states. |
| Cart | `customer-app/lib/features/cart/presentation/cart_screen.dart` | PLACEHOLDER_UI | No cart rows or totals UI. |
| Checkout | `customer-app/lib/features/checkout/presentation/checkout_screen.dart` | PLACEHOLDER_UI | Placeholder-only screen; payment structure allowed, but still not real checkout UI. |
| Orders / detail / status | `customer-app/lib/features/orders/presentation/orders_screen.dart` | PLACEHOLDER_UI | Text-only order sections, no list/detail/timeline composition. |
| Reviews | `customer-app/lib/features/reviews/presentation/reviews_screen.dart` | PLACEHOLDER_UI | No review form controls. |
| Profile / settings / addresses / notifications | `customer-app/lib/features/profile/presentation/profile_screen.dart` | PLACEHOLDER_UI | Account cluster is only labels and route buttons. |
| Store list results cluster | none | MISSING | No dedicated results screen exists between search/discovery and store detail. |
| Order confirmation cluster | none | MISSING | No post-checkout confirmation route exists. |

### Merchant Console
| Route / Screen Cluster | File | Status (REAL_UI / PLACEHOLDER_UI / STUB_ONLY / MISSING) | Notes |
| --- | --- | --- | --- |
| Auth shell | `merchant-console/src/app/(auth)/layout.tsx` | PLACEHOLDER_UI | Structural entry card only. |
| Login | `merchant-console/src/features/auth/presentation/login-screen.tsx` | STUB_ONLY | One scaffold plus a single `Sign in as demo merchant` button. |
| Onboarding | `merchant-console/src/features/onboarding/presentation/onboarding-screen.tsx` | STUB_ONLY | One scaffold plus `Mark onboarding complete`. |
| Select store | `merchant-console/src/features/store-selection/presentation/store-selection-screen.tsx` | STUB_ONLY | One scaffold plus `Select demo store`. |
| Console shell | `merchant-console/src/app/(console)/layout.tsx` | PLACEHOLDER_UI | Header works, but is still a thin structural wrapper. |
| Store-scoped shell / sidebar | `merchant-console/src/app/(console)/[storeId]/layout.tsx` | PLACEHOLDER_UI | Route continuity is real, but the shell is still basic navigation and a store ID badge. |
| Dashboard | `merchant-console/src/features/dashboard/presentation/dashboard-screen.tsx` | PLACEHOLDER_UI | Repository-backed placeholder sections only. |
| Orders | `merchant-console/src/features/orders/presentation/orders-screen.tsx` | PLACEHOLDER_UI | No operational order table or actions. |
| Menu | `merchant-console/src/features/menu/presentation/menu-screen.tsx` | PLACEHOLDER_UI | No menu editor or list. |
| Store management | `merchant-console/src/features/store-management/presentation/store-management-screen.tsx` | PLACEHOLDER_UI | No real store settings controls. |
| Reviews | `merchant-console/src/features/reviews/presentation/reviews-screen.tsx` | PLACEHOLDER_UI | No review queue or response UI. |
| Promotions | `merchant-console/src/features/promotions/presentation/promotions-screen.tsx` | PLACEHOLDER_UI | No coupon or promotion editor. |
| Settlement | `merchant-console/src/features/settlement/presentation/settlement-screen.tsx` | PLACEHOLDER_UI | Informational placeholder only. |
| Analytics | `merchant-console/src/features/analytics/presentation/analytics-screen.tsx` | PLACEHOLDER_UI | No charts, metrics, or date controls. |
| Settings | `merchant-console/src/features/settings/presentation/settings-screen.tsx` | PLACEHOLDER_UI | No settings forms or toggles. |

### Admin Console
| Route / Screen Cluster | File | Status (REAL_UI / PLACEHOLDER_UI / STUB_ONLY / MISSING) | Notes |
| --- | --- | --- | --- |
| Auth shell | `admin-console/src/app/(auth)/layout.tsx` | PLACEHOLDER_UI | Structural login wrapper only. |
| Login | `admin-console/src/features/auth/presentation/login-screen.tsx` | STUB_ONLY | One scaffold plus `Sign in as demo admin`. |
| Access boundary / role selection | `admin-console/src/features/permissions/presentation/access-boundary-screen.tsx` | STUB_ONLY | Role cards exist and the redirect is real, but this is still a demo role chooser rather than a real permission-aware entry flow. |
| Platform shell | `admin-console/src/app/(platform)/layout.tsx` | PLACEHOLDER_UI | Real sidebar and sign-out, but still only a structural platform shell. |
| Dashboard | `admin-console/src/features/dashboard/presentation/dashboard-screen.tsx` | PLACEHOLDER_UI | Placeholder scaffold. |
| Users | `admin-console/src/features/users/presentation/users-screen.tsx` | PLACEHOLDER_UI | Placeholder scaffold. |
| Merchants | `admin-console/src/features/merchants/presentation/merchants-screen.tsx` | PLACEHOLDER_UI | Placeholder scaffold. |
| Stores | `admin-console/src/features/stores/presentation/stores-screen.tsx` | PLACEHOLDER_UI | Placeholder scaffold. |
| Orders | `admin-console/src/features/orders/presentation/orders-screen.tsx` | PLACEHOLDER_UI | Placeholder scaffold. |
| Disputes | `admin-console/src/features/disputes/presentation/disputes-screen.tsx` | PLACEHOLDER_UI | Placeholder scaffold. |
| Customer service | `admin-console/src/features/customer-service/presentation/customer-service-screen.tsx` | PLACEHOLDER_UI | Placeholder scaffold. |
| Settlements | `admin-console/src/features/settlements/presentation/settlements-screen.tsx` | PLACEHOLDER_UI | Placeholder scaffold. |
| Finance | `admin-console/src/features/finance/presentation/finance-screen.tsx` | PLACEHOLDER_UI | Placeholder scaffold. |
| Marketing | `admin-console/src/features/marketing/presentation/marketing-screen.tsx` | PLACEHOLDER_UI | Placeholder scaffold. |
| Announcements | `admin-console/src/features/announcements/presentation/announcements-screen.tsx` | PLACEHOLDER_UI | Placeholder scaffold. |
| Catalog | `admin-console/src/features/catalog/presentation/catalog-screen.tsx` | PLACEHOLDER_UI | Placeholder scaffold. |
| B2B | `admin-console/src/features/b2b/presentation/b2b-screen.tsx` | PLACEHOLDER_UI | Placeholder scaffold. |
| Analytics / reporting / system management | `admin-console/src/features/analytics/presentation/analytics-screen.tsx` | PLACEHOLDER_UI | All three are placeholder governance shells with no working data UI. |

## 4. Session and Handoff Audit

### public -> customer
- expected behavior: public marketing should convert the user into a believable customer app entry handoff.
- actual behavior: `public-website/src/features/app-download/presentation/app-download-screen.tsx` renders `PublicFeatureScaffold`, and `public-website/src/shared/data/public-content-repository.ts` explicitly says real app-store integration is deferred. There is no live deep link, store badge integration, or direct route into `customer-app`.
- verdict: FAIL
- blocker: customer acquisition stops at placeholder content. The product boundary is described, not operationally handed off.

### entry -> auth
- expected behavior: customer entry should lead to a real auth/guest choice with usable UI.
- actual behavior: `customer-app/lib/app/router/app_router.dart` correctly redirects `/entry` based on local session state, but `customer-app/lib/app/entry/customer_entry_screen.dart` is only a session rules page and `customer-app/lib/features/auth/presentation/auth_screen.dart` is only a placeholder auth explainer.
- verdict: PARTIAL PASS
- blocker: the route handoff works structurally, but the landed experience is not a real product flow.

### auth -> onboarding
- expected behavior: auth should collect credentials, verify, then move into onboarding.
- actual behavior: customer auth uses local state transitions in `customer-app/lib/core/session/customer_session_controller.dart`; merchant auth sets cookies in `merchant-console/src/features/auth/server/auth-actions.ts`; admin auth sets cookies in `admin-console/src/features/auth/server/auth-actions.ts`. In all three surfaces, the handoff is functional but demo-grade. Customer auth screens have no actual input UIs, merchant/admin auth are single demo buttons.
- verdict: PARTIAL PASS
- blocker: session transitions exist, but the auth experiences are fake.

### onboarding -> main shell
- expected behavior: onboarding should complete profile/setup state and enter the primary authenticated shell.
- actual behavior: customer onboarding calls `completeOnboarding()` then routes to `/home`; merchant onboarding sets one cookie then routes to `/select-store`. The redirects are real. The onboarding UIs are not.
- verdict: PARTIAL PASS
- blocker: onboarding completion is one button press on placeholder screens, not a believable setup flow.

### guest -> customer
- expected behavior: guest path should enter a reduced-but-usable customer journey.
- actual behavior: `customer-app/lib/features/auth/presentation/guest_entry_screen.dart` can set `guest` status and redirect to `/home`, but `/home` is still placeholder UI and orders/profile remain auth-gated.
- verdict: PARTIAL PASS
- blocker: guest continuity exists only as route state, not as a usable guest product experience.

### merchant/admin auth and role handoff
- expected behavior: merchant should move login -> onboarding -> store selection -> store console; admin should move login -> role/access boundary -> permitted platform routes.
- actual behavior:
  - merchant: `merchant-console/middleware.ts`, `merchant-console/src/features/auth/server/access.ts`, and `merchant-console/src/shared/auth/merchant-session.ts` correctly enforce session, onboarding, and store selection.
  - admin: `admin-console/middleware.ts`, `admin-console/src/features/permissions/server/permission-actions.ts`, and `admin-console/src/shared/auth/admin-session.ts` correctly enforce session and role-based access.
- verdict: PARTIAL PASS
- blocker: the handoff logic is the strongest part of the repo, but it still lands on placeholder console screens and demo role/store selectors.

## 5. Core Journey Validation
| Journey | Verdict (PASS / PARTIAL PASS / FAIL) | Exact blocking point | Affected files/routes |
| --- | --- | --- | --- |
| public discovery -> customer entry | FAIL | Public side ends at placeholder `Download` content and never reaches a real customer runtime handoff. | `public-website/src/features/landing/presentation/landing-screen.tsx`, `public-website/src/features/app-download/presentation/app-download-screen.tsx`, `public-website/src/shared/data/public-content-repository.ts` |
| customer browse -> cart -> checkout | FAIL | Customer routes exist, but browse, store, menu, cart, and checkout are all placeholder/stub UI. | `/home`, `/search`, `/store`, `/store/menu`, `/cart`, `/checkout`; `customer-app/lib/features/home/presentation/home_screen.dart`, `customer-app/lib/features/store/presentation/store_screen.dart`, `customer-app/lib/features/cart/presentation/cart_screen.dart`, `customer-app/lib/features/checkout/presentation/checkout_screen.dart` |
| customer auth/onboarding -> order tracking | FAIL | Auth and onboarding state transitions work, but every landed customer screen after login is still placeholder, and there is no real order tracking or post-checkout confirmation. | `/auth/*`, `/onboarding`, `/orders`, `/orders/status`; `customer-app/lib/features/auth/presentation/*`, `customer-app/lib/features/onboarding/presentation/onboarding_screen.dart`, `customer-app/lib/features/orders/presentation/order_status_screen.dart` |
| merchant login -> store management flow | PARTIAL PASS | Cookie/middleware continuity is real, but after login/onboarding/store selection the operational screens are still placeholder scaffolds. | `/login`, `/onboarding`, `/select-store`, `/:storeId/dashboard`, `/:storeId/store`; `merchant-console/middleware.ts`, `merchant-console/src/features/store-selection/presentation/store-selection-screen.tsx`, `merchant-console/src/features/store-management/presentation/store-management-screen.tsx` |
| admin login -> platform management flow | PARTIAL PASS | Login and role gating are real, but the access boundary is demo-grade and all platform screens are placeholder scaffolds. | `/login`, `/access-boundary`, `/dashboard`; `admin-console/middleware.ts`, `admin-console/src/features/permissions/presentation/access-boundary-screen.tsx`, `admin-console/src/features/dashboard/presentation/dashboard-screen.tsx` |

## 6. Cross-Surface Coherence Audit
- what is coherent:
  - Surface separation is clean and matches the docs.
  - Route ownership is clear within each surface.
  - Merchant and admin have real local middleware/session guards.
  - Customer has clear local route guarding in `customer-app/lib/app/router/app_router.dart`.
- what is disconnected:
  - Public website does not actually hand users into a real customer product.
  - Customer app is not visually or functionally mature enough to receive public traffic credibly.
  - Merchant and admin are not connected to public or customer journeys in any believable end-to-end product sense; they are isolated console skeletons.
  - Shared code provides contracts and utilities, not runtime continuity or shared design language.
- what is fake-connected but not product-real:
  - Customer route handoffs based on local session state.
  - Merchant login -> onboarding -> store selection -> store route chain.
  - Admin login -> access-boundary -> role-routed platform access.
  - Public marketing links among landing/service/download/support/legal pages.
  - All of these continuities are structurally valid, but they land on placeholder screens that explain ownership instead of performing the actual product job.
- which surface most damages total product credibility:
  - customer-app. It is the core transactional surface, and it is still mostly architecture/demo UI. That breaks credibility for the whole system because public acquisition has nowhere real to hand off and order-centric value is not convincingly represented anywhere.

## 7. Priority Risk List

### P0 systemic blockers
- Public -> customer acquisition is not real.
- Customer app core ordering journey is not real.
- Merchant and admin shells are structurally connected, but their screens are all placeholder scaffolds.
- Shared cross-surface continuity is mostly naming and route structure, not real connected behavior.

### P1 major product gaps
- Customer auth/onboarding, search, discovery, store, cart, checkout, and orders are not usable UIs.
- Merchant operational surfaces have no real tables, forms, dashboards, filters, or settings controls.
- Admin governance surfaces have no real data presentation, queues, or action surfaces.
- Public website legal/support/download content is still placeholder-backed rather than publication-ready.

### P2 secondary issues
- No fixed launch ports or runtime wiring are encoded in the repo itself.
- Design language is only loosely consistent through generic scaffolds; it does not read as one deliberate product system.
- Cross-surface handoffs rely on local demo data and local cookies/memory only.

## 8. Files Most Likely Requiring Immediate Attention
- `public-website/src/features/common/presentation/public_feature_scaffold.tsx`
- `public-website/src/features/app-download/presentation/app-download-screen.tsx`
- `public-website/src/features/landing/presentation/landing-screen.tsx`
- `public-website/src/shared/data/public-content-repository.ts`
- `customer-app/lib/features/common/presentation/customer_flow_scaffold.dart`
- `customer-app/lib/features/common/presentation/customer_feature_scaffold.dart`
- `customer-app/lib/app/shells/main_shell.dart`
- `customer-app/lib/app/entry/customer_entry_screen.dart`
- `customer-app/lib/app/router/app_router.dart`
- `customer-app/lib/features/auth/presentation/auth_screen.dart`
- `customer-app/lib/features/auth/presentation/auth_phone_screen.dart`
- `customer-app/lib/features/auth/presentation/auth_otp_screen.dart`
- `customer-app/lib/features/onboarding/presentation/onboarding_screen.dart`
- `customer-app/lib/features/home/presentation/home_screen.dart`
- `customer-app/lib/features/store/presentation/store_screen.dart`
- `customer-app/lib/features/store/presentation/menu_browsing_screen.dart`
- `customer-app/lib/features/cart/presentation/cart_screen.dart`
- `customer-app/lib/features/checkout/presentation/checkout_screen.dart`
- `customer-app/lib/features/orders/presentation/orders_screen.dart`
- `merchant-console/src/features/common/presentation/merchant_feature_scaffold.tsx`
- `merchant-console/src/features/auth/presentation/login-screen.tsx`
- `merchant-console/src/features/onboarding/presentation/onboarding-screen.tsx`
- `merchant-console/src/features/store-selection/presentation/store-selection-screen.tsx`
- `merchant-console/src/app/(console)/[storeId]/layout.tsx`
- `merchant-console/src/shared/data/merchant-repository.ts`
- `admin-console/src/features/common/presentation/admin_feature_scaffold.tsx`
- `admin-console/src/features/auth/presentation/login-screen.tsx`
- `admin-console/src/features/permissions/presentation/access-boundary-screen.tsx`
- `admin-console/src/app/(platform)/layout.tsx`
- `admin-console/src/shared/data/admin-repository.ts`
