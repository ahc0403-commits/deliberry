# Wave 3 Candidate Scope — Merchant/Admin Mock Data Alignment

Date: 2026-03-17
Source: reviews/governance_enforcement_gap_plan.md (Remediation Wave 3)
Prerequisites: Gap Plan Wave 1 (CLOSED), Gap Plan Wave 2 (CLOSED)
Status: CANDIDATE — NOT YET APPROVED FOR EXECUTION

---

## Executive Summary

Wave 3 targets the remaining CRITICAL gap (GAP-C05) and 4 MEDIUM gaps (GAP-M01, GAP-M02, GAP-M06, GAP-M08) in merchant-console and admin-console mock data. These are the next-highest-value fixes because:

1. GAP-C05 is the last remaining CRITICAL-priority gap — payment method strings in mock data diverge from canonical `PAYMENT_METHOD_PLACEHOLDERS`.
2. The MEDIUM gaps address active Decay Mode 1 (enum pollution), Decay Mode 2 (float money ambiguity), and Decay Mode 3 (informal date formats) in the two web console surfaces.

All Wave 3 candidates are data-layer mock fixes — no architecture, schema, auth, or infrastructure changes. The risk profile is low and the scope is tightly bounded.

---

## Candidate Gaps (Prioritized)

### 1. GAP-C05: Payment method strings in mock data (CRITICAL)

**Why it matters**: This is the last remaining CRITICAL gap. Merchant and admin mock data use display-formatted payment method strings (`"Credit Card"`, `"Debit Card"`, `"Cash"`) instead of canonical `PAYMENT_METHOD_PLACEHOLDERS` values (`"cash"`, `"card_placeholder"`, `"pay_placeholder"`). This violates R-041 and R-043 — the same rules Wave 2 enforced in customer-app.

**Impacted files**:
- `merchant-console/src/shared/data/merchant-mock-data.ts` (paymentMethod values in mockOrders)
- `admin-console/src/shared/data/admin-mock-data.ts` (paymentMethod values in mockPlatformOrders)
- Merchant/admin order display screens (presentation-layer label mapping)

**Severity**: CRITICAL — last remaining gap at this priority level.

---

### 2. GAP-M01: Admin mock feature flags reference excluded feature (MEDIUM)

**Why it matters**: Admin mock data contains a feature flag entry for `realtime_tracking` — an explicitly excluded feature per R-071 and CONSTITUTION.md R-074. While the flag is `enabled: false`, its presence in mock data normalizes an excluded feature concept. The ENFORCEMENT_CHECKLIST exclusion scan would flag this.

**Impacted files**:
- `admin-console/src/shared/data/admin-mock-data.ts` (remove or replace ff-3 entry)

**Severity**: MEDIUM — governance hygiene, low effort.

---

### 3. GAP-M06: Settlement period display uses informal date formats (MEDIUM)

**Why it matters**: Merchant mock settlements use `"Mar 8 - Mar 14, 2026"` and admin mock settlements use `"Mar 8-14"` as period strings in the data layer. DATE.md requires ISO 8601 dates in data fields — display formatting belongs at presentation layer. This is the same pattern Wave 2 fixed in customer-app.

**Impacted files**:
- `merchant-console/src/shared/data/merchant-mock-data.ts` (SettlementRecord type: `period: string` → `periodStart: string` + `periodEnd: string`)
- `admin-console/src/shared/data/admin-mock-data.ts` (PlatformSettlement type: same refactor)
- Merchant/admin settlement display screens (presentation-layer period formatting)

**Severity**: MEDIUM — structural alignment with DATE.md.

---

### 4. GAP-M08: Admin mock PlatformOrder total values are ambiguously sized (MEDIUM)

**Why it matters**: Admin mock `PlatformOrder` totals are `5600, 3250, 7800, 4550, 2800, 4100, 6250`. These were converted from float dollars in Wave 2A-2 and are confirmed centavos, but the `PlatformOrder.total` type annotation is `number`, not `MoneyAmount`. This gap is about making the type explicit so future contributors don't misinterpret the values.

**Impacted files**:
- `admin-console/src/shared/data/admin-mock-data.ts` (type PlatformOrder.total as MoneyAmount)
- `admin-console/src/shared/domain.ts` (MoneyAmount already re-exported — verify)

**Severity**: MEDIUM — type safety improvement.

---

### 5. GAP-M02: KPI/finance display values use inline dollar formatting (MEDIUM)

**Why it matters**: Merchant mock KPIs use pre-formatted strings like `"$2,847"` and `"$8,456"`. Admin mock finance summaries use `"$284,600"`. These are display-formatted money strings stored in the data layer instead of integer centavos formatted at presentation time (R-013). However, these are summary/KPI `value: string` fields designed for dashboard display, making this lower priority than the other candidates.

**Impacted files**:
- `merchant-console/src/shared/data/merchant-mock-data.ts` (KPI and analytics mock values)
- `admin-console/src/shared/data/admin-mock-data.ts` (finance summary and analytics mock values)
- Related display components (if KPI values change from string to number)

**Severity**: MEDIUM — lower priority within Wave 3 because KPI values are inherently presentation-oriented.

---

## Recommended Wave Boundary

**Include in Wave 3**: GAP-C05, GAP-M01, GAP-M06, GAP-M08
**Defer GAP-M02**: KPI string-to-centavo conversion is higher-effort with lower governance urgency. KPIs are dashboard-display artifacts. Defer to a future wave or document as an acceptable pattern.

**Estimated file count**: 6-8 files across merchant-console and admin-console.
**Surfaces touched**: merchant-console, admin-console only.
**No customer-app, public-website, or shared changes**.

---

## Exclusions — Must NOT Be Part of Wave 3

| Item | Reason |
|------|--------|
| GAP-C04 (audit trail) | Requires new types in shared + interceptor pattern in all surfaces — Wave 5 scope |
| GAP-H03, GAP-H04 (session types) | Auth/identity hardening — Wave 4 scope |
| GAP-H07 (state machine transitions) | Requires new shared utility — Wave 5 scope |
| GAP-M03 (order timestamp fields) | Requires shared model changes — Wave 5 scope |
| GAP-M04 (formatMoney wiring) | Requires adapter changes in shared + all surfaces — Wave 5 scope |
| GAP-M05 (adapter re-exports) | Cross-surface adapter completeness — Wave 5 scope |
| GAP-M07 (guest cart gate) | Customer-app auth logic — Wave 4 scope |
| GAP-L01–L04 (low priority) | Maintenance/cleanup — Wave 6 scope |
| Any shared/ contract changes | Completed in Wave 1 |
| Any customer-app changes | Completed in Wave 2 |
| New architecture or patterns | Not authorized |
| Live backend wiring | Excluded per CLAUDE.md Section 7 |

---

## Suggested Validation Commands

```bash
# 1. Web surface typechecks (must pass)
npm run typecheck --prefix merchant-console
npm run typecheck --prefix admin-console
npm run typecheck --prefix public-website

# 2. Flutter (regression — no customer-app changes expected)
cd customer-app && flutter analyze

# 3. Build checks (optional but recommended)
npm run build --prefix merchant-console
npm run build --prefix admin-console
```

---

## Do Not Expand Scope

This section is binding for any Wave 3 executor:

1. **Do not modify customer-app, public-website, or shared.** These surfaces have no Wave 3 gaps.
2. **Do not introduce new types in shared.** Canonical types are complete from Wave 1.
3. **Do not refactor beyond the listed gaps.** If you notice additional issues, document them for a future wave.
4. **Do not change governance docs.** WAVE_TRACKER.md and reviews/ are the only non-code files to update.
5. **Do not start auth/session/permission work.** That is Wave 4 scope.
6. **Do not create state machine validation utilities.** That is Wave 5 scope.
7. **Maximum file count: 10.** If the changes require more files, re-scope before proceeding.
8. **KPI string values (GAP-M02) are deferred.** Do not convert KPI `value: string` fields to centavos unless explicitly approved.

---

## Completion Criteria

Wave 3 is complete when ALL of the following are true:

1. **GAP-C05**: All payment method strings in merchant and admin mock data use values from `PAYMENT_METHOD_PLACEHOLDERS`. Display labels are at the presentation layer.
2. **GAP-M01**: No mock feature flag references an excluded feature.
3. **GAP-M06**: Settlement period data uses ISO 8601 date fields (`periodStart`, `periodEnd`), not display-formatted strings.
4. **GAP-M08**: `PlatformOrder.total` type is `MoneyAmount` (or commented as centavos if branded type import is not feasible).
5. `npm run typecheck` passes for merchant-console, admin-console, public-website.
6. `flutter analyze` passes (regression check).
7. No files outside merchant-console and admin-console are modified (except WAVE_TRACKER.md and reviews/).

---

*Scope prepared: 2026-03-17*
*Authority: reviews/governance_enforcement_gap_plan.md*
*Prerequisites: Gap Plan Wave 1 (CLOSED), Gap Plan Wave 2 (CLOSED)*
