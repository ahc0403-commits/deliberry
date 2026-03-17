# Wave 1 Execution Report — Shared Contract Alignment

Date: 2026-03-17
Source: reviews/governance_enforcement_gap_plan.md (Remediation Wave 1)
Scope: GAP-C06, GAP-H01, GAP-H02, GAP-H05, GAP-H06, GAP-H08

---

## Wave 1 Gaps Resolved

### GAP-C06: PAYMENT_STATUSES missing "settled" (CRITICAL)
**Status**: RESOLVED
**Rules**: R-040, FLOW.md Section 2.2
**Changes**:
- `shared/constants/domain.constants.ts`: Added `"settled"` to PAYMENT_STATUSES array (after `"captured"`)
- `shared/constants/domain.constants.json`: Added `"settled"` to payment_statuses array
- `customer-app/lib/core/shared_contracts/domain_contract_bridge.dart`: Added `paymentStatuses` list with `settled` included
**Verification**: PaymentStatus type auto-derives from the const array — no manual type update needed. All typechecks pass.

---

### GAP-H01: No SUPPORT_TICKET_STATUSES canonical enum (HIGH)
**Status**: RESOLVED
**Rules**: R-040, R-042, FLOW.md Section 5.1
**Changes**:
- `shared/constants/domain.constants.ts`: Added `SUPPORT_TICKET_STATUSES` = `["open", "in_progress", "awaiting_reply", "resolved", "closed"]`
- `shared/constants/domain.constants.json`: Added `support_ticket_statuses` array with matching values
- `shared/types/domain.types.ts`: Added `SupportTicketStatus` derived type, added `SUPPORT_TICKET_STATUSES` to imports
- `shared/models/domain.models.ts`: Changed `SupportCaseSummary.status` from `"open" | "in_review" | "closed"` to `SupportTicketStatus`; added `SupportTicketStatus` to imports
- `admin-console/src/shared/domain.ts`: Added re-exports for `SUPPORT_TICKET_STATUSES` (constant) and `SupportTicketStatus` (type)
- `admin-console/src/shared/data/admin-mock-data.ts`: Changed `SupportTicket.status` from local string union to `SupportTicketStatus`; added import
- `customer-app/lib/core/shared_contracts/domain_contract_bridge.dart`: Added `supportTicketStatuses` list
**Note**: The old `"in_review"` value in `SupportCaseSummary` was non-canonical. It has been replaced by the canonical type which includes `"in_progress"` (matching FLOW.md Section 5.1). Any existing references to `"in_review"` will now be a type error, which is the correct enforcement behavior.

---

### GAP-H02: Promotion types diverge between .ts and .json (HIGH)
**Status**: RESOLVED
**Rules**: R-040 (single canonical location)
**Changes**:
- `shared/constants/domain.constants.json`: Changed `promotion_types` from `["coupon", "discount", "free_delivery"]` to `["percentage", "fixed", "free_delivery", "coupon", "discount"]` (matching .ts)
- `customer-app/lib/core/shared_contracts/domain_contract_bridge.dart`: Added `promotionTypes` list with all 5 values
**Decision**: The .ts file had the superset (5 values). The .json was synced to match. customer-app can now represent all promotion types.

---

### GAP-H05: merchant_staff actor type missing from AUTH_ACTOR_TYPES (HIGH)
**Status**: RESOLVED
**Rules**: R-020, IDENTITY.md Section 1
**Changes**:
- `shared/constants/domain.constants.ts`: Replaced `"merchant"` with `"merchant_owner"` and `"merchant_staff"` in AUTH_ACTOR_TYPES
- `shared/constants/domain.constants.json`: Same replacement in auth_actor_types
- `customer-app/lib/core/shared_contracts/domain_contract_bridge.dart`: Added `authActorTypes` list with `merchant_owner` and `merchant_staff`
- `docs/governance/IDENTITY.md`: Updated Current Gaps section — removed resolved rider/guest gaps, noted merchant_staff is now in AUTH_ACTOR_TYPES but scoping mechanism still pending; updated `last-updated` to 2026-03-17
**Decision**: Chose option (a) from the gap plan — split `"merchant"` into `"merchant_owner"` and `"merchant_staff"` as this matches IDENTITY.md Section 1 precisely. No surface code referenced the old `"merchant"` string value directly, so no downstream breakage.

---

### GAP-H06: SETTLEMENT_STATES includes "scheduled" not in FLOW.md (HIGH)
**Status**: RESOLVED
**Rules**: R-043 (no local invention without canonical update)
**Changes**:
- `docs/governance/FLOW.md` Section 3.1: Updated settlement state machine to `PENDING → SCHEDULED → PROCESSING → PAID`; added `scheduled` status definition ("Settlement queued for processing on a future date"); updated `last-updated` to 2026-03-17
**Decision**: Chose option (b) from the gap plan — added `scheduled` to FLOW.md rather than removing from code. A settlement being scheduled before processing begins is a logically valid intermediate state.

---

### GAP-H08: date.ts references archived DATE_POLICY.md (HIGH)
**Status**: RESOLVED
**Rules**: DATE.md (sole authority for timestamp governance)
**Changes**:
- `shared/utils/date.ts` line 4: Changed `"See CONSTITUTION.md R-050 through R-053, DATE_POLICY.md."` to `"See CONSTITUTION.md R-050, docs/governance/DATE.md."`
**Note**: Also corrected `R-050 through R-053` to just `R-050` since R-051/052/053 are now stub pointers in CONSTITUTION.md that delegate to DATE.md.

---

## Files Changed

| File | Gap(s) | Change Summary |
|------|--------|----------------|
| `shared/constants/domain.constants.ts` | C06, H01, H05 | Added `settled` to PAYMENT_STATUSES; added `SUPPORT_TICKET_STATUSES`; split `merchant` into `merchant_owner`/`merchant_staff` |
| `shared/constants/domain.constants.json` | C06, H01, H02, H05 | Synced: payment_statuses +settled, promotion_types +percentage/fixed, auth_actor_types split merchant, added support_ticket_statuses |
| `shared/types/domain.types.ts` | H01 | Added `SupportTicketStatus` type and `SUPPORT_TICKET_STATUSES` import |
| `shared/models/domain.models.ts` | H01 | `SupportCaseSummary.status` now uses `SupportTicketStatus` |
| `shared/utils/date.ts` | H08 | Fixed stale doc reference: DATE_POLICY.md → DATE.md |
| `admin-console/src/shared/domain.ts` | H01 | Added re-exports: `SUPPORT_TICKET_STATUSES`, `SupportTicketStatus` |
| `admin-console/src/shared/data/admin-mock-data.ts` | H01 | `SupportTicket.status` derived from canonical `SupportTicketStatus` |
| `customer-app/lib/core/shared_contracts/domain_contract_bridge.dart` | C06, H01, H02, H05 | Added paymentStatuses, promotionTypes, authActorTypes, supportTicketStatuses; fixed `delivered placeholder` label |
| `docs/governance/FLOW.md` | H06 | Added `scheduled` to settlement state machine; updated last-updated |
| `docs/governance/IDENTITY.md` | H05 | Updated Current Gaps section; updated last-updated |
| `docs/governance/WAVE_TRACKER.md` | — | Added Gap Plan Wave 1 completion entry |

**Total files changed**: 11

---

## Remaining Unresolved Wave 1 Items

**None.** All 6 Wave 1 gaps (GAP-C06, GAP-H01, GAP-H02, GAP-H05, GAP-H06, GAP-H08) are resolved.

---

## Validation Summary

| Check | Result | Run Type |
|-------|--------|----------|
| `flutter analyze` (customer-app) | No issues found | Background + foreground re-run |
| `npm run typecheck` (merchant-console) | Pass — no errors | Background + foreground re-run |
| `npm run typecheck` (admin-console) | Pass — no errors | Background + foreground re-run |
| `npm run typecheck` (public-website) | Pass — no errors | Background + foreground re-run |
| Shared forbidden-content scan | No UI/routing/state/auth files in shared/ | Manual verification |
| Cross-surface import scan | No cross-surface imports introduced | Manual verification |

**Final status**: All 4 background validation tasks completed (exit code 0). All 4 foreground re-runs confirmed clean. Zero remaining Wave 1 items. Wave 1 is formally CLOSED.

---

## Next Waves (NOT started)

- **Gap Plan Wave 2**: Customer-app data model compliance (GAP-C01, GAP-C02, GAP-C03) — float money, status strings, relative timestamps in mock_data.dart
- **Gap Plan Wave 3**: Merchant/admin mock data alignment (GAP-C05, GAP-M01, GAP-M02, GAP-M06, GAP-M08)
- **Gap Plan Wave 4**: Identity and session type hardening (GAP-H03, GAP-H04, GAP-M07)
- **Gap Plan Wave 5**: Structural enforcement (GAP-C04, GAP-H07, GAP-M03, GAP-M04, GAP-M05)
- **Gap Plan Wave 6**: Automation and cleanup (GAP-L01, GAP-L02, GAP-L03, GAP-L04)
