# Governance Enforcement Gap Plan

Date: 2026-03-16
Author: oh-my-claudecode:analyst
Scope: Ordered remediation plan for all governance enforcement gaps
Authority basis: CONSTITUTION.md, IDENTITY.md, STRUCTURE.md, FLOW.md, DATE.md, DECAY_PATH.md, GLOSSARY.md, ENFORCEMENT_CHECKLIST.md
Companion document: reviews/governance_surface_mapping_matrix.md

---

## Priority Legend

- **CRITICAL**: Must fix before any live integration. Violations of immutable constitutional rules that would cause data corruption, financial errors, or security breaches in production.
- **HIGH**: Must fix before beta/staging deployment. Governance violations that would cause cross-surface inconsistency or user-facing errors.
- **MEDIUM**: Should fix during current phase. Structural gaps that increase decay risk but do not cause immediate runtime failures.
- **LOW**: Fix during next scheduled maintenance. Cosmetic or documentation-level gaps.

---

## CRITICAL -- Fix Before Any Live Integration

### GAP-C01: Customer-app mock data uses float dollars instead of integer centavos

- **Domain**: Payment / Money integrity
- **Rules violated**: R-010 (integer centavos), R-011 (no floats for money)
- **Current state**: All money values in `customer-app/lib/core/data/mock_data.dart` are float dollars: `price: 12.99`, `deliveryFee: 2.99`, `total: 33.47`, `cartDeliveryFee => 2.99`, `cartServiceFee => 1.49`
- **Required state**: All money fields must be integer centavos. `price: 12.99` must become `price: 1299`. The `MockMenuItem.price` field type must change from `double` to `int`. The `MockCartItem.total` getter must compute integer centavos. `MockOrder.total` must be `int`.
- **Files to change**:
  - `customer-app/lib/core/data/mock_data.dart` (all money literals and types)
  - `customer-app/lib/features/cart/` (any cart total computation)
  - `customer-app/lib/features/checkout/` (any checkout total display)
- **Decay mode**: DECAY_PATH.md Mode 2 (Float Money)
- **Priority**: CRITICAL

---

### GAP-C02: Customer-app mock order statuses use display strings instead of canonical enum values

- **Domain**: Order / Status enums
- **Rules violated**: R-041 (surface-local must use canonical values), R-043 (no local invention)
- **Current state**: `customer-app/lib/core/data/mock_data.dart` uses: `'Preparing'`, `'On the way'`, `'Delivered'`. The canonical values are: `'preparing'`, `'in_transit'`, `'delivered'`.
- **Required state**: `MockOrder.status` field must use canonical enum values from `DomainContractBridge.orderStatuses`. Display formatting must happen at the presentation layer.
- **Files to change**:
  - `customer-app/lib/core/data/mock_data.dart` lines 367, 376, 388, 397, 406 (status values)
  - `customer-app/lib/core/data/mock_data.dart` `MockOrder` class definition (type the `status` field using `DomainContractBridge.orderStatuses`)
- **Decay mode**: DECAY_PATH.md Mode 1 (Status Enum Pollution)
- **Priority**: CRITICAL

---

### GAP-C03: Customer-app mock timestamps use relative and informal date strings

- **Domain**: Timestamps
- **Rules violated**: DATE.md Law 4 (no relative dates), Law 6 (UTC storage), Law 11 (forbidden patterns)
- **Current state**: `customer-app/lib/core/data/mock_data.dart` uses: `'Yesterday'`, `'Today, 2:30 PM'`, `'Mar 12'`, `'Mar 10'`, `'2 min ago'`, `'1 hour ago'`, `'3 hours ago'`
- **Required state**: All timestamp fields in data models must be UTC ISO 8601 strings ending with `Z`. Display formatting ("Yesterday", "2 min ago") must happen at the presentation layer only.
- **Files to change**:
  - `customer-app/lib/core/data/mock_data.dart` (all `date` and `time` fields in MockOrder and MockNotification)
  - Rename fields: `date` -> `createdAt`, `time` -> `createdAt` to comply with DATE.md Law 10 field naming
- **Decay mode**: DECAY_PATH.md Mode 3 (Local Time Persistence)
- **Priority**: CRITICAL

---

### GAP-C04: No audit trail infrastructure exists anywhere

- **Domain**: Audit / Cross-surface
- **Rules violated**: R-060 (mutations must produce audit log), R-061 (audit log entry schema), R-062 (write protection)
- **Current state**: Zero audit log implementation. No audit_logs type, schema, table, service, or interceptor in any surface. No AuditLogEntry type in shared.
- **Required state**: (1) `AuditLogEntry` type in `shared/types/` matching IDENTITY.md Section 5 schema. (2) Audit log mutation interceptor pattern in each surface's data layer. (3) Write-protection rule documented. Not required to be live, but the type contract and placeholder interceptor pattern must exist.
- **Files to create/change**:
  - `shared/types/audit.types.ts` (new -- AuditLogEntry type definition)
  - `shared/validation/audit.schema.json` (new -- validation schema)
  - `merchant-console/src/shared/data/` (audit interceptor placeholder)
  - `admin-console/src/shared/data/` (audit interceptor placeholder)
  - `customer-app/lib/core/data/` (audit interceptor placeholder)
- **Decay mode**: DECAY_PATH.md Mode 10 (Audit Trail Absence)
- **Priority**: CRITICAL

---

### GAP-C05: Payment method strings in mock data do not match canonical enum

- **Domain**: Payment / Status enums
- **Rules violated**: R-041 (surface-local must use canonical values), R-043 (no local invention)
- **Current state**: Merchant-console mock data uses `"Credit Card"`, `"Debit Card"`, `"Cash"`. Admin-console mock data uses `"Credit Card"`, `"Debit Card"`, `"Cash"`. The canonical `PAYMENT_METHOD_PLACEHOLDERS` values are: `"cash"`, `"card_placeholder"`, `"pay_placeholder"`.
- **Required state**: Mock data `paymentMethod` fields must use values from `PAYMENT_METHOD_PLACEHOLDERS`. Display labels must be applied at presentation layer.
- **Files to change**:
  - `merchant-console/src/shared/data/merchant-mock-data.ts` lines 190, 209, 228, 247, 265, 285, 301 (paymentMethod values)
  - `admin-console/src/shared/data/admin-mock-data.ts` lines 230-236 (paymentMethod values)
- **Decay mode**: DECAY_PATH.md Mode 1 (Status Enum Pollution)
- **Priority**: CRITICAL

---

### GAP-C06: PAYMENT_STATUSES missing "settled" status from FLOW.md

- **Domain**: Payment / State machine
- **Rules violated**: R-040 (canonical enum in shared), FLOW.md Section 2.2
- **Current state**: `shared/constants/domain.constants.ts` PAYMENT_STATUSES = `["pending", "captured", "failed", "refunded", "partially_refunded"]`. FLOW.md Section 2.2 defines `settled` as a payment status ("Payment disbursed to merchant via settlement").
- **Required state**: Add `"settled"` to `PAYMENT_STATUSES` array, after `"captured"`.
- **Files to change**:
  - `shared/constants/domain.constants.ts` (add "settled" to PAYMENT_STATUSES)
  - `shared/constants/domain.constants.json` (add "settled" to payment_statuses)
  - `shared/types/domain.types.ts` (PaymentStatus type auto-updates)
- **Decay mode**: DECAY_PATH.md Mode 1 (Status Enum Pollution)
- **Priority**: CRITICAL

---

## HIGH -- Fix Before Beta/Staging Deployment

### GAP-H01: No SUPPORT_TICKET_STATUSES canonical enum defined

- **Domain**: Support / Status enums
- **Rules violated**: R-040 (canonical enum in shared), R-042 (add to canonical first)
- **Current state**: FLOW.md Section 5.1 defines support ticket states: `open`, `in_progress`, `awaiting_reply`, `resolved`, `closed`. No corresponding constant exists in `shared/constants/domain.constants.ts`. Admin mock data defines this as a local string union. `SupportCaseSummary` in `shared/models/domain.models.ts` uses `"open" | "in_review" | "closed"` which contradicts FLOW.md.
- **Required state**: Add `SUPPORT_TICKET_STATUSES` to `shared/constants/domain.constants.ts` with values `["open", "in_progress", "awaiting_reply", "resolved", "closed"]`. Update `SupportCaseSummary.status` to use the derived type. Update admin mock data to import from canonical.
- **Files to change**:
  - `shared/constants/domain.constants.ts` (add SUPPORT_TICKET_STATUSES)
  - `shared/constants/domain.constants.json` (add support_ticket_statuses)
  - `shared/types/domain.types.ts` (add SupportTicketStatus type)
  - `shared/models/domain.models.ts` line 89 (change "in_review" to derived type)
  - `admin-console/src/shared/data/admin-mock-data.ts` (type SupportTicket.status from canonical)
  - `admin-console/src/shared/domain.ts` (re-export SUPPORT_TICKET_STATUSES)
- **Priority**: HIGH

---

### GAP-H02: Promotion types diverge between domain.constants.ts and domain.constants.json

- **Domain**: Shared / Contract integrity
- **Rules violated**: R-040 (single canonical location)
- **Current state**: `.ts` has 5 values: `["percentage", "fixed", "free_delivery", "coupon", "discount"]`. `.json` has 3 values: `["coupon", "discount", "free_delivery"]`. The `.json` file is consumed by customer-app via the domain contract bridge. Customer-app cannot represent `percentage` or `fixed` promotions.
- **Required state**: Both files must have identical values. Decide canonical set and update both.
- **Files to change**:
  - `shared/constants/domain.constants.json` (sync with .ts, or vice versa)
  - `shared/constants/domain.constants.ts` (if removing values)
  - `customer-app/lib/core/shared_contracts/domain_contract_bridge.dart` (if values change)
- **Priority**: HIGH

---

### GAP-H03: AdminSession type missing role and actor_type fields

- **Domain**: Admin / Identity
- **Rules violated**: R-020 (actor attribution), R-022 (admin roles from PERMISSION_ROLES), IDENTITY.md Section 6 (token claims)
- **Current state**: `admin-console/src/shared/auth/admin-session.ts` defines `AdminSession = { adminId: string; adminName: string }`. Missing: `role` (typed against `PermissionRole`), `actor_type`, `session_id`.
- **Required state**: AdminSession must include at minimum: `role: PermissionRole`, `actorType: 'admin'`. `readAdminRole()` return type must be `PermissionRole | null`, not `string | null`.
- **Files to change**:
  - `admin-console/src/shared/auth/admin-session.ts` (extend AdminSession type, type readAdminRole return)
  - `admin-console/src/shared/domain.ts` (ensure PermissionRole is re-exported -- already is)
- **Priority**: HIGH

---

### GAP-H04: MerchantSession type missing store_id and actor_type fields

- **Domain**: Merchant / Identity
- **Rules violated**: R-020 (actor attribution), R-023 (store-scoped access), IDENTITY.md Section 6 (token claims)
- **Current state**: `merchant-console/src/shared/auth/merchant-session.ts` defines `MerchantSession = { merchantId: string; merchantName: string }`. Missing: `storeId` (the selected store context), `actorType`, `session_id`.
- **Required state**: MerchantSession must include at minimum: `actorType: 'merchant'`. Store context exists separately via `MERCHANT_STORE_COOKIE` / `readSelectedStoreId()` but is not part of the session type, making actor attribution incomplete.
- **Files to change**:
  - `merchant-console/src/shared/auth/merchant-session.ts` (extend MerchantSession type)
- **Priority**: HIGH

---

### GAP-H05: merchant_staff actor type missing from AUTH_ACTOR_TYPES

- **Domain**: Identity / Actor taxonomy
- **Rules violated**: R-020 (actor attribution), IDENTITY.md Section 1
- **Current state**: `AUTH_ACTOR_TYPES` = `["guest", "customer", "merchant", "rider", "admin", "system"]`. IDENTITY.md defines `merchant_staff` as a distinct actor with scoped permissions within a store, separate from `merchant_owner`.
- **Required state**: Either (a) add `"merchant_owner"` and `"merchant_staff"` as separate values replacing `"merchant"`, or (b) document that `"merchant"` covers both and permission scoping is handled separately. Option (a) matches IDENTITY.md more precisely.
- **Files to change**:
  - `shared/constants/domain.constants.ts` (update AUTH_ACTOR_TYPES)
  - `shared/constants/domain.constants.json` (sync)
  - `shared/types/domain.types.ts` (AuthActorType auto-updates)
  - IDENTITY.md Section 1 "Current Gaps" (update gap status)
- **Priority**: HIGH

---

### GAP-H06: SETTLEMENT_STATES includes "scheduled" not defined in FLOW.md

- **Domain**: Settlement / State machine
- **Rules violated**: R-043 (no local invention without updating canonical)
- **Current state**: `SETTLEMENT_STATES` = `["pending", "scheduled", "processing", "paid", "failed"]`. FLOW.md Section 3.1 defines: `PENDING -> PROCESSING -> PAID; FAILED -> PENDING (retry)`. The value `"scheduled"` does not appear in FLOW.md.
- **Required state**: Either (a) remove `"scheduled"` from SETTLEMENT_STATES, or (b) update FLOW.md Section 3 to include `scheduled` as a state between `pending` and `processing`. Option (b) is likely correct (settlement is scheduled before processing begins).
- **Files to change**:
  - `docs/governance/FLOW.md` Section 3 (if adding "scheduled"), OR
  - `shared/constants/domain.constants.ts` (if removing "scheduled")
  - `shared/constants/domain.constants.json` (sync)
- **Priority**: HIGH

---

### GAP-H07: No state machine transition enforcement code exists for any domain

- **Domain**: Order, Payment, Settlement, Dispute, Support -- all flows
- **Rules violated**: FLOW.md Sections 1.3, 1.4, 2.3, 2.4, 3.1, 4.1, 5.1, 6.4
- **Current state**: No code anywhere validates that a status transition is allowed before executing it. All transitions are unconstrained.
- **Required state**: At minimum, a shared pure utility function `isValidTransition(from: Status, to: Status): boolean` for each state machine. Surface mutation code must call this before any status change. Not required to be live, but the validation functions must exist.
- **Files to create/change**:
  - `shared/utils/transitions.ts` (new -- transition validation functions for order, payment, settlement, dispute, support)
  - Surfaces: mutation handlers should import and call transition validators
- **Priority**: HIGH

---

### GAP-H08: date.ts references archived DATE_POLICY.md instead of DATE.md

- **Domain**: Timestamps / Documentation
- **Rules violated**: DATE.md (sole authority for timestamp governance)
- **Current state**: `shared/utils/date.ts` line 4: `* See CONSTITUTION.md R-050 through R-053, DATE_POLICY.md.` DATE_POLICY.md is archived and superseded by DATE.md.
- **Required state**: Comment should reference `DATE.md` instead of `DATE_POLICY.md`.
- **Files to change**:
  - `shared/utils/date.ts` line 4
- **Priority**: HIGH

---

## MEDIUM -- Should Fix During Current Phase

### GAP-M01: Admin mock feature flags reference excluded feature "realtime_tracking"

- **Domain**: Admin / Exclusions
- **Rules violated**: R-071 (feature flags without governance review), ENFORCEMENT_CHECKLIST exclusion scan
- **Current state**: `admin-console/src/shared/data/admin-mock-data.ts` line 321: `{ id: "ff-3", name: "realtime_tracking", description: "Live order tracking with map", enabled: false, scope: "global" }`. Real-time tracking is an explicitly excluded feature.
- **Required state**: Remove the realtime_tracking feature flag from mock data, or replace with a non-excluded feature example.
- **Files to change**:
  - `admin-console/src/shared/data/admin-mock-data.ts` (remove or replace ff-3)
- **Priority**: MEDIUM

---

### GAP-M02: KPI and finance display values use inline dollar formatting instead of formatMoney()

- **Domain**: Money / Display
- **Rules violated**: R-013 (all money display must use formatMoney())
- **Current state**: Merchant mock KPIs use `"$2,847"`, `"$8,456"`, `"$45.22"`. Admin mock finance summary uses `"$284,600"`, `"$42,690"`, etc. These are inline-formatted display strings, not the result of `formatMoney()`.
- **Required state**: KPI `value` fields should store integer centavos and be formatted via `formatMoney()` at presentation time. If KPI values must be pre-formatted strings (display-only), this should be documented as a display-layer concern with a comment referencing R-013 compliance.
- **Files to change**:
  - `merchant-console/src/shared/data/merchant-mock-data.ts` (KPI and analytics values)
  - `admin-console/src/shared/data/admin-mock-data.ts` (finance summary and analytics values)
- **Priority**: MEDIUM

---

### GAP-M03: Order models missing per-status timestamp fields from DATE.md Law 10

- **Domain**: Order / Timestamps
- **Rules violated**: DATE.md Law 10 (canonical timestamp field naming)
- **Current state**: `shared/models/domain.models.ts` `OrderSummary` has only `createdAt`. Missing: `confirmed_at`, `preparing_at`, `ready_at`, `picked_up_at`, `delivered_at`, `cancelled_at`, `disputed_at`, `updated_at`, `scheduled_at`.
- **Required state**: These fields should be optional on the order model (they are populated as the order progresses through its lifecycle). Not all are needed in a summary type, but at least the full order detail type should include them.
- **Files to change**:
  - `shared/models/domain.models.ts` (add optional timestamp fields to OrderSummary or create OrderDetail type)
  - `shared/validation/order.schema.json` (add optional timestamp fields)
- **Priority**: MEDIUM

---

### GAP-M04: No formatMoney() usage in any surface

- **Domain**: Money / Display
- **Rules violated**: R-013 (all money display must use formatMoney())
- **Current state**: `formatMoney()` exists in `shared/utils/currency.ts` but is not imported or called by any surface code. No surface domain adapter re-exports it.
- **Required state**: Each surface's domain adapter should re-export `formatMoney`. Surface presentation code should use it for all money display.
- **Files to change**:
  - `merchant-console/src/shared/domain.ts` (re-export formatMoney)
  - `admin-console/src/shared/domain.ts` (re-export formatMoney)
  - `customer-app/lib/core/shared_contracts/domain_contract_bridge.dart` (add Dart equivalent or bridge)
- **Priority**: MEDIUM

---

### GAP-M05: Domain adapters do not re-export PAYMENT_STATUSES or AUTH_ACTOR_TYPES

- **Domain**: Structure / Adapter completeness
- **Rules violated**: R-005 (adapter is only import boundary), STRUCTURE.md Section 3
- **Current state**: `merchant-console/src/shared/domain.ts` does not re-export `PAYMENT_STATUSES` or `AUTH_ACTOR_TYPES`. `admin-console/src/shared/domain.ts` does not re-export `PAYMENT_STATUSES` or `AUTH_ACTOR_TYPES`. If surface code needs these, it would have to bypass the adapter.
- **Required state**: Adapters should re-export all canonical constants and types that the surface needs.
- **Files to change**:
  - `merchant-console/src/shared/domain.ts` (add missing re-exports)
  - `admin-console/src/shared/domain.ts` (add missing re-exports)
- **Priority**: MEDIUM

---

### GAP-M06: Settlement period display uses informal date formats in data layer

- **Domain**: Settlement / Timestamps
- **Rules violated**: DATE.md Law 1 (ISO 8601 dates), DATE.md Law 6 (UTC in data layer)
- **Current state**: Merchant mock settlements use `"Mar 8 - Mar 14, 2026"` for period. Admin mock settlements use `"Mar 8-14"`. These are display-formatted strings in data models.
- **Required state**: Settlement period in data models should use ISO 8601 date range (`periodStart: "2026-03-08"`, `periodEnd: "2026-03-14"`). Display formatting should happen at presentation layer.
- **Files to change**:
  - `merchant-console/src/shared/data/merchant-mock-data.ts` (SettlementRecord type and mock data)
  - `admin-console/src/shared/data/admin-mock-data.ts` (PlatformSettlement type and mock data)
- **Priority**: MEDIUM

---

### GAP-M07: Guest cart-to-order restriction not enforced

- **Domain**: Customer / Identity
- **Rules violated**: R-024 ("Order placement requires authentication")
- **Current state**: `CustomerSessionController` models guest mode but no code checks `isGuest` before order placement. Cart operations are allowed (correct per R-024) but there is no gate preventing a guest from proceeding to order submission.
- **Required state**: Checkout flow must check `CustomerSessionController.isGuest` and redirect to authentication before allowing order placement.
- **Files to change**:
  - `customer-app/lib/features/checkout/` (add auth gate before order submission)
- **Priority**: MEDIUM

---

### GAP-M08: Admin mock PlatformOrder total values are ambiguously sized

- **Domain**: Money / Contracts
- **Rules violated**: R-010 (integer centavos)
- **Current state**: Admin mock `PlatformOrder` totals are: 5600, 3250, 7800, 4550, 2800, 4100, 6250. These could be centavos ($56.00, $32.50...) or they could be display-scale integers. There is no type annotation enforcing `MoneyAmount` branded type.
- **Required state**: `PlatformOrder.total` type should be `MoneyAmount` (branded centavo integer). Values should be documented with comments confirming centavo interpretation. If these represent display-scale amounts, multiply by 100.
- **Files to change**:
  - `admin-console/src/shared/data/admin-mock-data.ts` (type PlatformOrder.total as MoneyAmount, verify/adjust values)
  - `admin-console/src/shared/domain.ts` (ensure MoneyAmount is re-exported -- already is)
- **Priority**: MEDIUM

---

## LOW -- Fix During Next Scheduled Maintenance

### GAP-L01: No CI/build-time governance enforcement

- **Domain**: Enforcement / Cross-surface
- **Rules violated**: ENFORCEMENT_CHECKLIST (pre-merge validation)
- **Current state**: No automated scan for: cross-surface imports, shared forbidden content, status enum drift, float money values, relative date strings, excluded feature references.
- **Required state**: At minimum, a lint script or CI step that runs the ENFORCEMENT_CHECKLIST shared forbidden-content scan and surface import scan.
- **Files to create**:
  - `scripts/governance-scan.sh` or equivalent
- **Priority**: LOW

---

### GAP-L02: Placeholder suffixes in canonical payment method enum

- **Domain**: Shared / Naming
- **Rules violated**: DECAY_PATH.md Mode 9 (Temporary Workaround Permanence)
- **Current state**: `PAYMENT_METHOD_PLACEHOLDERS` values include `"card_placeholder"` and `"pay_placeholder"`. These placeholder suffixes will persist into production if not renamed.
- **Required state**: Before live payment integration, rename to production values (e.g., `"card"`, `"digital_wallet"` or equivalent). Until then, document the placeholder naming explicitly.
- **Files to change** (at live integration time):
  - `shared/constants/domain.constants.ts`
  - `shared/constants/domain.constants.json`
  - `customer-app/lib/core/shared_contracts/domain_contract_bridge.dart`
  - All surface mock data referencing payment methods
- **Priority**: LOW (acceptable during placeholder phase)

---

### GAP-L03: Placeholder suffixes in shared API contract files

- **Domain**: Shared / Naming
- **Rules violated**: DECAY_PATH.md Mode 9 (Temporary Workaround Permanence)
- **Current state**: Multiple API contracts contain placeholder-suffixed operation names: `submit_inquiry_placeholder`, `check_scope_placeholder`, `respond_to_review_placeholder`, `verify_otp_placeholder`, `auth_session_placeholder`, `payout_state_placeholder`, `store_details_placeholder`, `report_summary_placeholder`, `order_detail_placeholder`, `coupon_summary_placeholder`.
- **Required state**: Before live API integration, rename to production operation names. Until then, acceptable as documented placeholder state.
- **Files to change** (at live integration time):
  - All files in `shared/api/*.contract.json`
- **Priority**: LOW (acceptable during placeholder phase)

---

### GAP-L04: customer-app DomainContractBridge includes "delivered placeholder" label

- **Domain**: Customer / Naming
- **Rules violated**: DECAY_PATH.md Mode 9 (Temporary Workaround Permanence)
- **Current state**: `customer-app/lib/core/shared_contracts/domain_contract_bridge.dart` line 34: `'delivered placeholder'` in `orderStatusMilestoneLabels`.
- **Required state**: Replace with proper display label for the delivered status.
- **Files to change**:
  - `customer-app/lib/core/shared_contracts/domain_contract_bridge.dart` line 34
- **Priority**: LOW

---

## Remediation Execution Order

The recommended execution order accounts for dependencies between gaps:

### Wave 1: Shared Contract Alignment (GAP-C06, GAP-H01, GAP-H02, GAP-H05, GAP-H06, GAP-H08)
- Fix canonical enums first so all downstream surface changes reference correct values
- Add missing SUPPORT_TICKET_STATUSES, fix PAYMENT_STATUSES, sync promotion types, resolve settlement "scheduled" question, fix date.ts doc reference
- Update AUTH_ACTOR_TYPES for merchant_staff

### Wave 2: Customer-App Data Model Compliance (GAP-C01, GAP-C02, GAP-C03)
- Fix float money to integer centavos
- Fix status display strings to canonical enum values
- Fix relative timestamps to UTC ISO 8601

### Wave 3: Merchant/Admin Mock Data Alignment (GAP-C05, GAP-M01, GAP-M02, GAP-M06, GAP-M08)
- Fix payment method strings to canonical values
- Remove excluded feature flag reference
- Fix inline dollar formatting
- Fix settlement period display formats
- Clarify admin order total centavo values

### Wave 4: Identity and Session Type Hardening (GAP-H03, GAP-H04, GAP-M07)
- Extend AdminSession and MerchantSession types with governance-required fields
- Add guest-to-order auth gate in customer-app

### Wave 5: Structural Enforcement (GAP-C04, GAP-H07, GAP-M03, GAP-M04, GAP-M05)
- Create audit log type contract and placeholder interceptors
- Create state machine transition validation utilities
- Add per-status timestamp fields to order models
- Wire formatMoney through domain adapters
- Complete adapter re-exports

### Wave 6: Automation and Cleanup (GAP-L01, GAP-L02, GAP-L03, GAP-L04)
- Build CI governance scan
- Rename placeholder suffixes (at live integration time)
- Clean up placeholder labels

---

## Summary Statistics

| Priority | Count | Blocking for |
|---|---|---|
| CRITICAL | 6 | Any live integration |
| HIGH | 8 | Beta/staging deployment |
| MEDIUM | 8 | Current phase completion |
| LOW | 4 | Next maintenance cycle |
| **Total** | **26** | |

| Decay Mode | Gaps Linked | Status |
|---|---|---|
| Mode 1 (Enum Pollution) | GAP-C02, GAP-C05, GAP-C06, GAP-H01, GAP-H02 | ACTIVE -- 5 gaps |
| Mode 2 (Float Money) | GAP-C01, GAP-M02, GAP-M08 | ACTIVE -- 3 gaps |
| Mode 3 (Local Time Persistence) | GAP-C03, GAP-M06 | ACTIVE -- 2 gaps |
| Mode 4 (Cross-Surface Leakage) | None | NOT OCCURRING |
| Mode 5 (Shared Layer Bloat) | None | NOT OCCURRING |
| Mode 6 (Permission Bypass) | GAP-H03, GAP-H04 | AT RISK -- 2 gaps |
| Mode 9 (Placeholder Permanence) | GAP-L02, GAP-L03, GAP-L04 | ACTIVE -- 3 gaps (acceptable in current phase) |
| Mode 10 (Audit Trail Absence) | GAP-C04 | ACTIVE -- 1 gap |
| Mode 12 (Actor Taxonomy Drift) | GAP-H05 | ACTIVE -- 1 gap |

---

*Plan generated: 2026-03-16*
*Evidence basis: Direct file reading of all governance docs, shared contracts, surface mock data, auth/session files, domain adapters, and grep-based pattern analysis.*
