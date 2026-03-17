# QA Validation Checklist — Constitutional Compliance

> **Classification: Supporting Operational Artifact** — This is NOT a canonical governance document.
> Canonical enforcement procedures are defined in ENFORCEMENT_CHECKLIST.md.
> This file provides a detailed QA-specific validation checklist derived from constitutional rules.

Status: active
Authority: operational (supporting artifact, derived from CONSTITUTION.md)
Surface: cross-surface
Domains: qa, governance, validation
Last updated: 2026-03-14
Last verified: 2026-03-16
Retrieve when:
- validating milestone or release readiness against governance rules
- checking cross-surface build and behavior expectations
Related files:
- docs/governance/CONSTITUTION.md
- docs/governance/FLOW.md
- docs/governance/IDENTITY.md

> This checklist MUST be executed before any release or milestone signoff.
> It validates that each surface, journey, and governance rule is functioning correctly.

References: CONSTITUTION.md, FLOW.md, IDENTITY.md

---

## 1. Pre-Launch Checks

### 1.1 Build Verification

- [ ] `flutter analyze` passes for `customer-app` (zero errors, zero warnings)
- [ ] `npm run typecheck` passes for `merchant-console`
- [ ] `npm run typecheck` passes for `admin-console`
- [ ] `npm run typecheck` passes for `public-website`
- [ ] `npm run build` passes for `merchant-console`
- [ ] `npm run build` passes for `admin-console`
- [ ] `npm run build` passes for `public-website`

### 1.2 Governance Scans

- [ ] Cross-surface import scan: no runtime imports between surfaces
- [ ] Shared layer scan: no UI, routing, or session code in `shared/`
- [ ] Status enum scan: all status values match canonical enums
- [ ] Money type scan: no float money values in contracts or business logic
- [ ] Credential scan: no hardcoded secrets in source code
- [ ] Placeholder scan: all `_placeholder` suffixes documented and tracked

---

## 2. Surface-Level Validation

### 2.1 Customer App (Flutter)

- [ ] App launches without errors
- [ ] Entry route (`/`) loads correctly
- [ ] Main shell (bottom navigation) renders with all tabs
- [ ] Guest mode: can browse stores and menu items
- [ ] Guest mode: can add items to cart
- [ ] Guest mode: MUST NOT be able to place an order
- [ ] Auth flow: phone/OTP entry screen renders
- [ ] Auth flow: onboarding screens render after first login
- [ ] Authenticated: all feature screens accessible from navigation

### 2.2 Merchant Console (Next.js)

- [ ] App launches without errors at `/`
- [ ] Login page renders
- [ ] Onboarding flow renders for new merchants
- [ ] Store selection screen renders for multi-store merchants
- [ ] Dashboard renders with store-scoped data
- [ ] All shell navigation items are accessible
- [ ] Orders list renders with correct status badges
- [ ] Menu management screen renders
- [ ] Settlement screen renders

### 2.3 Admin Console (Next.js)

- [ ] App launches without errors at `/`
- [ ] Login page renders
- [ ] Dashboard renders with platform-wide data
- [ ] All shell navigation items are accessible
- [ ] User management screen renders
- [ ] Merchant management screen renders
- [ ] Order management screen renders with all status types
- [ ] Dispute management screen renders
- [ ] Settlement/finance screens render
- [ ] Analytics/reporting screens render
- [ ] System management screen renders

### 2.4 Public Website (Next.js)

- [ ] App launches without errors at `/`
- [ ] Landing page renders
- [ ] Service introduction page renders
- [ ] Merchant onboarding info page renders
- [ ] Support/FAQ page renders
- [ ] Privacy policy page renders
- [ ] Terms of service page renders
- [ ] Refund policy page renders
- [ ] App download page renders
- [ ] No authenticated-only content is accessible
- [ ] No console behavior is present

---

## 3. Journey Validation

### Journey 1: Customer Browse-to-Order

- [ ] Customer opens app → sees home/discovery screen
- [ ] Customer searches for stores → sees search results
- [ ] Customer selects store → sees store menu
- [ ] Customer adds items to cart → cart updates correctly
- [ ] Customer proceeds to checkout → sees checkout screen
- [ ] Customer confirms order → order created with `pending` status
- [ ] Order appears in customer's order list

### Journey 2: Merchant Order Fulfillment

- [ ] Merchant logs in → sees store dashboard
- [ ] New order appears in orders list with `pending` status
- [ ] Merchant confirms order → status changes to `confirmed`
- [ ] Merchant starts preparation → status changes to `preparing`
- [ ] Merchant marks ready → status changes to `ready`
- [ ] Status badges display correctly for each state

### Journey 3: Admin Platform Oversight

- [ ] Admin logs in → sees platform dashboard
- [ ] Admin navigates to orders → sees all orders across stores
- [ ] Admin navigates to merchants → sees merchant list
- [ ] Admin navigates to disputes → sees dispute list
- [ ] Admin navigates to settlements → sees settlement list
- [ ] Admin actions respect role permissions (R-022)

### Journey 4: Customer Support Flow

- [ ] Customer initiates support request
- [ ] Support ticket appears in admin support queue
- [ ] Admin can view and respond to ticket
- [ ] Ticket status transitions follow FLOW.md Section 5

### Journey 5: Customer Dispute Flow

- [ ] Customer opens dispute on a delivered order
- [ ] Dispute appears in admin dispute queue
- [ ] Admin can investigate and resolve dispute
- [ ] Dispute resolution records reasoning

### Journey 6: Public Information Access

- [ ] Visitor lands on public website without authentication
- [ ] All public pages are accessible without login
- [ ] No authenticated content leaks onto public pages
- [ ] Merchant onboarding info is informational only (no console access)

---

## 4. Auth/Session Validation

- [ ] Customer auth: phone/OTP flow works end-to-end
- [ ] Customer auth: guest-to-authenticated upgrade preserves cart
- [ ] Merchant auth: credentials login works
- [ ] Merchant auth: session is store-scoped (R-023)
- [ ] Admin auth: credentials login works
- [ ] Admin auth: session includes role information (R-022)
- [ ] Public website: no auth required for any page
- [ ] Session expiry: expired sessions redirect to login
- [ ] Cross-surface: logging into one surface MUST NOT grant access to another (R-073)

---

## 5. Data Integrity Validation

### 5.1 Money

- [ ] All displayed prices use `formatMoney()` utility
- [ ] Currency symbol matches ARS ($) for primary currency
- [ ] Order totals are calculated correctly (sum of item prices)
- [ ] No floating-point artifacts in displayed amounts (e.g., $42.300000000000004)

### 5.2 Status Values

- [ ] All order status badges display correctly for all canonical statuses
- [ ] Status transitions follow FLOW.md allowed transitions
- [ ] Terminal statuses (delivered, cancelled) have no further action buttons
- [ ] Forbidden transitions are not possible through the UI

### 5.3 Timestamps

- [ ] All displayed timestamps show Buenos Aires time (UTC-3)
- [ ] Sorting by date produces correct chronological order
- [ ] Settlement period boundaries align with Buenos Aires business dates

---

## 6. Cross-Surface Continuity Validation

- [ ] An order created in customer-app appears in merchant-console for the correct store
- [ ] An order created in customer-app appears in admin-console's order list
- [ ] A merchant confirmed in admin-console can log into merchant-console
- [ ] Status changes in merchant-console are reflected in customer-app order detail
- [ ] Dispute opened in customer-app appears in admin-console dispute queue
- [ ] Settlement calculated for merchant appears in both merchant-console and admin-console

---

## 7. Regression Checks

- [ ] No previously passing build/typecheck/analyze has regressed
- [ ] No previously accessible routes return 404
- [ ] No previously functional UI components are broken
- [ ] No previously clean shared boundary scan has new violations
- [ ] Mock data structure matches the type definitions

---

## 8. Constitutional Compliance Spot-Checks

- [ ] Pick 3 random mutation endpoints: verify actor attribution (R-020)
- [ ] Pick 3 random money fields: verify integer centavo representation (R-010)
- [ ] Pick 3 random timestamp fields: verify UTC ISO 8601 format (R-050)
- [ ] Pick 3 random status usages: verify canonical enum membership (R-040)
- [ ] Pick 1 random admin action: verify role enforcement (R-021)
- [ ] Pick 1 random merchant action: verify store scoping (R-023)
- [ ] Verify no DELETE operations exist on orders, payments, or settlements (R-030–032)

---

## Signoff

| Check Category | Result | Reviewer | Date |
|---|---|---|---|
| Pre-Launch | PASS / FAIL | | |
| Surface-Level | PASS / FAIL | | |
| Journey | PASS / FAIL | | |
| Auth/Session | PASS / FAIL | | |
| Data Integrity | PASS / FAIL | | |
| Cross-Surface | PASS / FAIL | | |
| Regression | PASS / FAIL | | |
| Constitutional | PASS / FAIL | | |
| **Overall** | **PASS / FAIL** | | |
