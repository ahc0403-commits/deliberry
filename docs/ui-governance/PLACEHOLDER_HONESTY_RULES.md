# Placeholder Honesty Rules

Status: active
Authority: binding (UI integrity)
Surface: cross-surface
Last updated: 2026-03-17

---

## Purpose

All data in the Deliberry product is currently mock/placeholder data. No live backend exists. These rules ensure the UI presents placeholder data honestly — with full visual quality but without pretending data is live or capabilities are real.

---

## 1. Core Principle

**Placeholder data must look beautiful but never lie.**

The UI should feel like a polished product demo, not a broken prototype. Users and reviewers should understand they are seeing representative data, not live production state.

---

## 2. What Is Placeholder

| Layer | Status | What It Means |
|-------|--------|---------------|
| Mock data in memory | Placeholder | All orders, stores, users, settlements — in-memory only |
| Auth sessions | Placeholder | Cookie-based demo auth, no real provider |
| Order submission | Placeholder | Creates local state only, no backend persistence |
| Payment processing | Placeholder | No payment gateway, display-only selection |
| Audit log | Contract-only | Type + schema exist, no write path |
| State machine validators | Contract-only | Functions exist, not called by runtime |
| Per-status timestamps | Schema-only | Fields defined, not populated |
| API contracts | Schema-only | Operation names defined, no HTTP endpoints |

---

## 3. Display Rules for Placeholder Data

### Mock Data Quality
- Mock data MUST use realistic values (real-sounding names, plausible prices, correct currencies)
- Mock data MUST use governance-compliant types (integer centavos, canonical statuses, UTC timestamps)
- Mock data MUST NOT use obviously fake values ("Test User", "$0.00", "AAAA-BBBB")
- Mock data SHOULD represent the Buenos Aires market context (Argentine names, ARS currency, local addresses)

### Demo Notices
- Screens that perform mutations (checkout, order placement) SHOULD show a subtle notice: "This is a demo — no real charges will be made"
- The notice must be informational, not alarming (info style, not error style)
- Placement: top of form/action area, before the first interactive element
- Do NOT put demo notices on read-only screens (dashboards, listings)

### Auth Screens
- Login screens SHOULD indicate demo mode: "Sign in with any name to explore the demo"
- Do NOT show fake "forgot password" or "sign up with Google" when those flows do not exist
- Auth forms should work functionally (accept input, set cookies) even though auth is not provider-backed

### Payment Selection
- Payment method selection SHOULD show "Placeholder only" or "Demo" as the detail text
- Do NOT show real payment provider logos (Visa, Mastercard) when no provider is integrated
- The cash option is the most honest — it requires no provider integration

### KPI and Analytics
- KPI values are pre-formatted display strings (documented as R-013 compliant presentation-layer data)
- Do NOT add "(mock)" labels to every KPI — it clutters the UI
- If a screen shows "revenue" or "commission", the data is mock but the presentation should be production-quality

---

## 4. What Must NOT Be Hidden

- **Guest auth gate**: If a guest tries to place an order, the UI MUST show feedback and redirect to auth (already implemented)
- **Payment limitations**: Checkout MUST show that payment processing is placeholder-only (already implemented)
- **Data non-persistence**: If a user adds data (address, cart item) and the page refreshes, the data may reset. This is acceptable during placeholder phase but should not be hidden.

---

## 5. What MUST Be Hidden

- **Internal governance references**: Users should never see "R-010", "FLOW.md", or governance rule IDs in the UI
- **Technical placeholder names**: Users should never see "card_placeholder", "order_detail_placeholder", or internal enum values in the UI. All display must use presentation-layer labels.
- **Audit log infrastructure**: Users should not see references to audit logs, transition validators, or schema validation — these are backend infrastructure

---

## 6. Empty State Honesty

### When No Data Exists
- Show the standard empty state (icon + title + description + CTA)
- Title: empathetic and action-oriented ("No orders yet", "Your cart is empty")
- Description: guide the user to the next meaningful action
- CTA: direct them to where they can create the first item

### When Data Cannot Load (Future State)
- Show an error empty state: "Something went wrong. Try again."
- Include a retry button
- Do NOT show "no data" when the real problem is a failed fetch

---

## 7. Status Display Honesty

- All statuses use canonical enum values in the data layer
- All statuses use human-readable labels in the display layer
- The mapping from canonical → display is defined per surface (presentation-layer label maps)
- Status badges always use the semantic color mapping from DESIGN_SYSTEM_BASELINE
- Never display raw canonical values ("in_transit") to users — always map to display labels ("On the Way")

---

## 8. Timestamp Display Honesty

- Data layer: UTC ISO 8601 (e.g., "2026-03-17T17:30:00Z")
- Display layer: human-readable local time
- For orders: "Today, 2:30 PM" / "Yesterday" / "Mar 12"
- For notifications: relative time ("2 min ago", "1 hour ago")
- For settlements: ISO date range ("2026-03-08 — 2026-03-14")
- Never display raw UTC strings to users
- Mock timestamps use realistic dates near the current demo date context (March 2026)

---

## 9. Money Display Honesty

- Data layer: integer centavos (e.g., 4250 for $42.50)
- Display layer: formatted currency string
- Web surfaces: use `formatMoney(centavos, 'ARS')` from shared adapter (target state)
- Mobile: use `formatCentavos(centavos)` local helper
- Always include currency symbol ($)
- Never display raw centavo values to users
- KPI display strings are presentation-layer formatted (documented as acceptable per R-013)

---

*Honesty rules established: 2026-03-17*
