# Reconciliation Gap Analysis

> **Classification: Historical Review Artifact** — This is NOT a canonical governance document.
> This file records the original governance gap baseline. Active decay tracking lives in DECAY_PATH.md.

Status: historical
Authority: historical (review artifact)
Surface: cross-surface
Domains: governance-gaps, baseline-audit
Last updated: 2026-03-14
Last verified: 2026-03-16
Retrieve when:
- tracing the original governance gap baseline
- checking why wave-based remediation work started
Superseded by: docs/governance/WAVE_TRACKER.md
Related files:
- docs/governance/EXECUTION_PLAN.md
- docs/governance/WAVE_TRACKER.md

Date: 2026-03-14
Baseline: Final Full-System QA (reviews/final_full_system_qa.md -- PASS verdict)

> This document identifies all gaps between the current codebase state and the governance
> rules defined in CONSTITUTION.md. Each gap is assigned a severity, rule reference,
> and resolution wave.

---

## CRITICAL Gaps

### GAP-001: CurrencyCode excludes ARS, includes VND

- **Rule Violated**: R-012
- **Description**: The canonical `CurrencyCode` type was `'USD' | 'VND'` but the product operates in Argentina.
- **File**: `shared/types/common.types.ts:4`
- **Severity**: CRITICAL
- **Status**: RESOLVED (2026-03-14, Wave 0 + Wave 1)
- **Resolution**: CurrencyCode updated to `'ARS' | 'USD'`. VND removed. Currency utility updated to support ARS formatting.

### GAP-002: Order status 3-way divergence

- **Rule Violated**: R-040, R-041, R-042, R-043
- **Description**: Three different sets of order status values existed across the codebase.
- **File**: `shared/constants/domain.constants.ts`, merchant/admin mock data
- **Severity**: CRITICAL
- **Status**: RESOLVED (2026-03-14, Wave 1)
- **Resolution**: Canonical ORDER_STATUSES updated to 9 values (draft, pending, confirmed, preparing, ready, in_transit, delivered, cancelled, disputed). `ready_for_delivery` renamed to `ready`. Merchant and admin mock data types and instances aligned. Screen components updated. CSS badges updated.

### GAP-003: No payment flow state machine defined

- **Rule Violated**: R-031 (implied)
- **Description**: Payment had no defined status enum.
- **File**: `shared/constants/domain.constants.ts`
- **Severity**: CRITICAL
- **Status**: PARTIALLY RESOLVED (2026-03-14, Wave 1)
- **Resolution**: `PAYMENT_STATUSES` enum added (pending, captured, failed, refunded, partially_refunded). `PaymentStatus` type derived. State machine implementation deferred to Wave 3.

---

## HIGH Gaps

### GAP-004: MoneyAmount is untyped `number`

- **Rule Violated**: R-010, R-011
- **Description**: `MoneyAmount` was typed as plain `number` with no constraint.
- **File**: `shared/types/common.types.ts:5`
- **Severity**: HIGH
- **Status**: RESOLVED (2026-03-14, Wave 1)
- **Resolution**: `MoneyAmount` changed to branded type `number & { readonly __brand: 'centavos' }`. `Centavos` alias added. JSDoc documents the constraint. `formatMoney` updated to accept centavos and divide by 100.

### GAP-005: No audit trail infrastructure

- **Rule Violated**: R-060, R-061, R-062
- **Description**: No audit log table, service, interceptor, or schema exists.
- **File**: All surfaces (absence)
- **Severity**: HIGH
- **Status**: OPEN -- Deferred to Wave 5

### GAP-006: No UTC/timezone policy enforced in code

- **Rule Violated**: R-050, R-051, R-052, R-053
- **Description**: No timezone handling utility existed. Mock data uses informal date strings.
- **File**: `shared/utils/date.ts`, mock data across all surfaces
- **Severity**: HIGH
- **Status**: PARTIALLY RESOLVED (2026-03-14, Wave 1)
- **Resolution**: Date utility updated with `BUENOS_AIRES_TZ`, `toDisplayTime`, `toBusinessDate`, `isValidUTCTimestamp`. `ISODateTimeUTC` branded type added. Mock data date format update deferred to Wave 2. API validation deferred to Wave 3.

---

## MEDIUM Gaps

### GAP-007: Rider actor missing from AUTH_ACTOR_TYPES

- **Rule Violated**: R-020
- **Description**: The `rider` actor type was not included in `AUTH_ACTOR_TYPES`.
- **File**: `shared/constants/domain.constants.ts:1`
- **Severity**: MEDIUM
- **Status**: RESOLVED (2026-03-14, Wave 1)
- **Resolution**: `rider`, `guest`, and `system` added to AUTH_ACTOR_TYPES.

### GAP-008: Settlement status uses placeholder names

- **Rule Violated**: R-040 (enum accuracy)
- **Description**: Settlement states included `processing_placeholder` and `completed_placeholder`.
- **File**: `shared/constants/domain.constants.ts:24-29`
- **Severity**: MEDIUM
- **Status**: RESOLVED (2026-03-14, Wave 1)
- **Resolution**: Renamed to `processing` and `paid`. Added `failed`. Updated JSON bridge.

### GAP-009: Order schema does not enum-constrain status field

- **Rule Violated**: R-041
- **Description**: The order validation schema did not constrain the `status` field to canonical enum values.
- **File**: `shared/validation/order.schema.json`
- **Severity**: MEDIUM
- **Status**: RESOLVED (2026-03-14, Wave 1)
- **Resolution**: Added `enum` constraint with all 9 canonical status values. Added `total_centavos` as integer type. Added `currency` field.

### GAP-013: No dispute status enum defined

- **Rule Violated**: R-040
- **Description**: Dispute statuses (open, investigating, escalated, resolved) were defined in FLOW.md but had no canonical enum.
- **File**: `shared/constants/domain.constants.ts` (absence)
- **Severity**: MEDIUM
- **Status**: RESOLVED (2026-03-14, Wave 1)
- **Resolution**: `DISPUTE_STATUSES` array and `DisputeStatus` type added.

---

## LOW Gaps

### GAP-010: Superseded placeholder state files remain

- **Rule Violated**: None directly (cleanup hygiene)
- **Description**: Some placeholder state files from earlier skeleton phases remain.
- **File**: Various across surfaces
- **Severity**: LOW
- **Status**: OPEN -- Deferred to Wave 2

### GAP-011: Currency utility supports only USD/VND

- **Rule Violated**: R-012
- **Description**: The `formatMoney` utility only handled USD and VND currencies.
- **File**: `shared/utils/currency.ts`
- **Severity**: LOW
- **Status**: RESOLVED (2026-03-14, Wave 0 + Wave 1)
- **Resolution**: Utility rewritten to accept centavos and format for ARS (es-AR) and USD (en-US). Added `parseToCentavos` helper. VND removed.

### GAP-012: Date utility has no timezone handling

- **Rule Violated**: R-052
- **Description**: The date utility provided no timezone conversion functions.
- **File**: `shared/utils/date.ts`
- **Severity**: LOW
- **Status**: RESOLVED (2026-03-14, Wave 1)
- **Resolution**: Added `BUENOS_AIRES_TZ`, `toDisplayTime`, `toBusinessDate`, `isValidUTCTimestamp`.

### GAP-014: Mock data uses float money values

- **Rule Violated**: R-010, R-011
- **Description**: Mock data across merchant and admin surfaces uses float amounts (e.g., 18.5, 8456.50) instead of integer centavos.
- **File**: `merchant-console/src/shared/data/merchant-mock-data.ts`, `admin-console/src/shared/data/admin-mock-data.ts`
- **Severity**: LOW
- **Status**: RESOLVED (2026-03-16, Wave 2A-1 + Wave 2A-2)
- **Resolution**: All merchant-console mock money fields converted to integer centavos (Wave 2A-1). All admin-console mock money fields converted to integer centavos (Wave 2A-2). All display components on both surfaces updated to divide centavos by 100 for rendering. Affected admin fields: `mockPlatformOrders.total`, `mockDisputes.amount`, `mockPlatformSettlements` (grossAmount/commission/netAmount), `mockMerchants.totalRevenue`, `mockCampaigns` (budget/spent), `mockWeeklyOrders.revenue`.

### GAP-015: Mock data uses informal date strings

- **Rule Violated**: R-050, R-051
- **Description**: Mock data uses strings like "2 min ago", "Today, 1:30 PM" instead of UTC ISO 8601.
- **File**: `merchant-console/src/shared/data/merchant-mock-data.ts`, `admin-console/src/shared/data/admin-mock-data.ts`
- **Severity**: LOW
- **Status**: RESOLVED (2026-03-16, Wave 2B-1)
- **Resolution**: All informal date/time strings replaced with UTC ISO 8601 timestamps (e.g. `2026-03-16T17:28:00Z`) across merchant-console mock data (orders, reviews, promotions, settlements, alerts) and admin-console mock data (orders, disputes, support tickets, users, merchants, stores, settlements, announcements, campaigns, B2B partners, alerts, system health). public-website has no timestamp fields. shared/ fixtures have no timestamp values requiring normalization. All three web surface typechecks pass.

---

## Summary

| Severity | Count | Resolved | Open |
|---|---|---|---|
| CRITICAL | 3 | 3 (2 full, 1 partial) | 0 |
| HIGH | 3 | 2 (1 full, 1 partial) | 1 |
| MEDIUM | 4 | 4 | 0 |
| LOW | 5 | 5 | 0 |
| **Total** | **15** | **14** | **1** |

All CRITICAL and LOW gaps are resolved. One HIGH gap (GAP-005: audit trail) remains deferred to Wave 5.

**Wave 2A-1 progress (2026-03-16)**: GAP-014 partially resolved for merchant-console.
**Wave 2A-2 progress (2026-03-16)**: GAP-014 fully resolved — admin-console mock money fields converted to centavos and display components updated.
**Wave 2A-3 progress (2026-03-16)**: public-website scanned — no numeric mock money fields exist; surface contains only placeholder string content and marketing copy. No centavo conversions required. Typecheck passes.
**Wave 2A-4 progress (2026-03-16)**: shared/ scanned — two validation schemas had money fields typed as `"type": "number"` instead of `"type": "integer"`: `settlement.schema.json` (amount) and `menu.schema.json` (price). Both fixed to `"type": "integer"` with centavo constraint description. All other shared/ files contain no numeric mock money values. All three web surface typechecks pass.
**Wave 2B-1 progress (2026-03-16)**: GAP-015 fully resolved — all informal date/time strings replaced with UTC ISO 8601 timestamps across merchant-console and admin-console mock data. All three web surface typechecks pass.
**Wave 2B-2 progress (2026-03-16)**: Mock data canonical derivation complete — `MerchantOrder.status`, `Promotion.type`, `SettlementRecord.status` (merchant-console) and `PlatformOrder.status`, `PlatformDispute.status`, `PlatformSettlement.status` (admin-console) now derive from canonical types via domain adapters. `PROMOTION_TYPES` extended with `percentage` and `fixed` per R-042. Both domain adapters extended with additional canonical exports. All three web surface typechecks pass.
