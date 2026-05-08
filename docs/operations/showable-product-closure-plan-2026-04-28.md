# Showable Product Closure Plan — 2026-04-28

Status: executed
Authority: operational
Surface: customer-app, merchant-console, admin-console, public-website
Domains: demo-readiness, surface-closure, payment-placeholder-governance
Last updated: 2026-04-28

## Purpose

This document defines the work required to finish Deliberry's showable product stage. The target is not full production readiness. The target is a coherent product walkthrough where a stakeholder can understand the customer ordering flow, the merchant operating flow, the admin oversight flow, and the public acquisition/legal surface without seeing obvious broken states, misleading payment claims, or surface-boundary violations.

## Source of Truth

- `docs/01-product-architecture.md`
- `docs/02-surface-ownership.md`
- `docs/03-navigation-ia.md`
- `docs/04-feature-inventory.md`
- `docs/05-implementation-phases.md`
- `docs/06-guardrails.md`
- `shared/docs/architecture-boundaries.md`

## Product Boundary

The showable product must include:

- customer discovery, store browsing, menu browsing, cart, checkout, payment-method selection, order list, order detail, and order status presentation
- merchant login, onboarding, store selection, dashboard, order management, menu management, store management, reviews, promotions, settlement visibility, analytics, and settings
- admin auth, permission boundary, dashboard, users, merchants, stores, orders, disputes, customer service, settlements, finance, marketing, announcements, catalog, B2B, analytics, reporting, and system management
- public landing, service introduction, merchant onboarding, support, app download, privacy, terms, and refund policy routes

The showable product must not include:

- live payment verification
- payment-complete decisions from a payment gateway callback
- map API address autocomplete
- QR generation libraries
- QR scanner camera integration
- real-time order tracking
- shared UI components or router code in repo-level `shared`

## Demo Narrative

1. A visitor reaches the public website, understands what Deliberry does, reviews support/legal/download routes, and sees merchant onboarding as an acquisition path.
2. A customer opens the app, sees delivery location context, searches or browses stores, opens a store, adds menu items, reviews cart totals, chooses a payment method, and places an order.
3. Cash checkout can land on the placed-order confirmation path. VNPAY/card/pay test checkout must land on order status with payment still pending or sandbox-only language.
4. A merchant opens the store-scoped console, sees operational context, manages orders, reviews menu/store/promotions/settlement/analytics/settings, and can explain what is live versus snapshot/read-only.
5. An admin opens the platform console, sees governance and oversight views, and can inspect users, merchants, stores, orders, disputes, support, settlement, finance, marketing, catalog, and system health without entering merchant self-service flows.

## Closure Checklist

### Customer App

- Home, discovery, search, filters, store detail, menu browsing, cart, checkout, orders, order detail, order status, reviews, profile, settings, addresses, notifications, auth, onboarding, and group-order routes render without overflow on small mobile width.
- Checkout copy clearly separates cash order placement from VNPAY/card/pay sandbox testing.
- VNPAY/card/pay selections never mark a payment complete.
- Payment pending context is visible after sandbox launch, launch failure, or customer abandonment.
- Empty states are explicit for cart, orders, search results, addresses, notifications, and reviews.
- Sticky checkout/cart actions remain reachable without conflicting with bottom navigation.

### Merchant Console

- Store-scoped navigation is visible and stable from dashboard through orders, menu, store, reviews, promotions, settlement, analytics, and settings.
- Order management reads as an operating screen, not an admin governance screen.
- Menu and store edit actions either persist through the approved runtime path or clearly report a save error.
- Settlement and analytics remain visibility/reporting surfaces, not payout-control or production reporting backends.
- Placeholder-state copy is limited to non-live operational limits and does not make the screen look unfinished.

### Admin Console

- Platform navigation is governance-oriented and separate from merchant self-service navigation.
- Dashboard, users, merchants, stores, orders, disputes, customer service, settlements, finance, marketing, announcements, catalog, B2B, analytics, reporting, and system management routes render.
- Payment, finance, and settlement language stays oversight/read-only unless a governed runtime action already exists.
- Provisioning and permission-boundary screens do not imply payment verification or cross-surface workflow ownership.

### Public Website

- Landing, service, merchant, support, download, privacy, terms, and refund routes are coherent with the current product phase.
- Public legal pages do not claim live production payment processing while payment verification is excluded.
- App download route states availability honestly and does not use fake store links as if release is complete.
- Merchant onboarding route leads to inquiry/registration framing, not authenticated console behavior.

## Verification Matrix

### Local Commands

- `cd customer-app && flutter analyze`
- `cd customer-app && flutter test`
- `cd merchant-console && npm run typecheck`
- `cd merchant-console && npm run build`
- `cd admin-console && npm run typecheck`
- `cd admin-console && npm run build`
- `cd public-website && npm run typecheck`
- `cd public-website && npm run build`

### Visual QA Widths

- 375px mobile
- 390px mobile
- 768px tablet
- 1024px tablet/desktop
- 1440px desktop

### Smoke Paths

- Customer happy path: home → store → add item → cart → checkout → cash order placed → order status.
- Customer sandbox path: checkout → VNPAY card/pay test → hosted sandbox launch or launch failure → order status with payment pending language.
- Customer error path: empty cart, no delivery address, guest checkout guard, search with no results, unavailable menu item.
- Merchant path: login/onboarding or store selection → dashboard → orders → menu → store → settlement → analytics.
- Admin path: login/access boundary → dashboard → stores → orders → settlements → finance → system management.
- Public path: landing → service → merchant → support → download → privacy → terms → refund policy.

## Current Corrections Logged On 2026-04-28

- Public privacy policy no longer claims active live payment processing or active PCI-certified provider use in the current product phase.
- Public terms now describe card/pay methods as future-ready or sandbox-only until live payment is explicitly enabled.
- Public refund policy now frames card/pay selections around live-flow availability and support confirmation.
- Customer order completion copy now says `Order submitted` instead of `Order complete` to avoid implying gateway-confirmed payment.
- Playwright visual QA tooling now runs against the four local surfaces at 375px, 390px, 768px, 1024px, and 1440px.
- Admin console platform layout now prevents page-level horizontal overflow while preserving table-local horizontal scrolling where dense oversight tables need it.

## Remaining Risk

- Existing local worktree contains broad unrelated modifications; implementation runs must avoid reverting user or prior-agent changes.
- Live Supabase availability is useful for a stronger demo but must not be required for the showable product because Mock/InMemory fallback remains part of the approved runtime shape.
- Full production readiness is tracked separately in `docs/operations/production-roadmap-2026-04-28.md`.

## Playwright Visual QA Result

Last run: 2026-04-28

- Tooling path: `.playwright-cli/showable-visual-qa.mjs`
- Screenshot/report output: `output/playwright/showable-product-qa-2026-04-28T06-32-59-491Z`
- Checked route-width combinations: 185
- Failures: 0

## Closure Execution Result

Execution date: 2026-04-28

The showable-product closure plan was executed across all governed surfaces: `customer-app`, `merchant-console`, `admin-console`, and `public-website`. No blocking defects were found in the required static, build, test, or browser visual gates.

### Verification Commands

- `cd customer-app && flutter analyze` — passed with no issues
- `cd customer-app && flutter test` — passed
- `cd customer-app && flutter build web` — passed; Flutter reported Wasm dry-run warnings from `flutter_secure_storage_web`, but the standard web build completed successfully
- `cd merchant-console && npm run typecheck && npm run build` — passed
- `cd admin-console && npm run typecheck && npm run build` — passed
- `cd public-website && npm run typecheck && npm run build` — passed
- `cd .playwright-cli && node showable-visual-qa.mjs` — passed, 185 route-width checks, 0 failures

### Final Status

The product is cleared for showable-product walkthrough use under the existing documented constraints. Payment verification, real payment completion, map autocomplete, QR generation/scanning, and real-time order tracking remain outside this phase by guardrail.
