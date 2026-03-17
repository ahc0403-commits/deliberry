# Governance-to-Surface Mapping Matrix

Date: 2026-03-16
Author: oh-my-claudecode:analyst
Scope: Map all 8 canonical governance docs onto all 5 surfaces and 7 domains
Authority basis: CONSTITUTION.md, IDENTITY.md, STRUCTURE.md, FLOW.md, DATE.md, DECAY_PATH.md, GLOSSARY.md, ENFORCEMENT_CHECKLIST.md

---

## 1. Surface-Level Compliance Matrix

### 1.1 customer-app (Flutter)

| Governance Doc | Applicable Rules | Implementation Status | Compliance Level | Gaps |
|---|---|---|---|---|
| CONSTITUTION | R-001 (surface owns runtime), R-010/R-011 (centavo money), R-020/R-024 (identity/guest), R-030 (order immutability), R-040-R-043 (enum canonical), R-050 (timestamps), R-060-R-062 (audit trail), R-070-R-074 (forbidden patterns) | Skeleton + deepened flows, placeholder-only | PARTIAL | Float money in mock data, status enum drift, no audit trail, relative dates in mock data |
| IDENTITY | Guest actor, Customer actor, session isolation | Session controller exists, guest mode exists | PARTIAL | Guest actor not formally typed in customer-app models; no actor_type attribution in mock mutations |
| STRUCTURE | R-005 (adapter via domain_contract_bridge.dart) | Bridge file exists and mirrors canonical JSON | COMPLIANT | None |
| FLOW | Order state machine (Section 1), Payment flow (Section 2) | DomainContractBridge has correct order statuses; mock data uses display strings not canonical values | NON-COMPLIANT | Mock order status strings are display-formatted ("Preparing", "On the way", "Delivered") instead of canonical enum values ("preparing", "in_transit", "delivered") |
| DATE | Laws 6-11 (UTC storage, display conversion, field naming) | No timestamp handling in customer-app mock data; dates use relative strings ("Yesterday", "2 min ago", "Mar 12") | NON-COMPLIANT | All mock timestamps are relative or informal display strings, violating Law 4 (no relative dates) and Law 6 (UTC storage) |
| DECAY_PATH | Mode 1 (enum pollution), Mode 2 (float money), Mode 3 (local time), Mode 12 (actor taxonomy drift) | Active decay in modes 1 and 2 | AT RISK | See detailed findings below |
| GLOSSARY | Term alignment | N/A (reference doc) | N/A | None |
| ENFORCEMENT_CHECKLIST | Pre-merge validation | No CI enforcement in customer-app for governance | NOT ENFORCED | No automated governance checks |

**Highest-risk decay vectors**: Decay Mode 1 (status enum pollution - customer mock uses display strings), Decay Mode 2 (float money - all prices/totals are float dollars), Decay Mode 3 (local time persistence - all dates are relative strings).

---

### 1.2 merchant-console (Next.js)

| Governance Doc | Applicable Rules | Implementation Status | Compliance Level | Gaps |
|---|---|---|---|---|
| CONSTITUTION | R-001, R-005, R-010/R-011, R-020/R-023, R-030, R-040-R-043, R-050, R-060-R-062, R-070-R-074 | Skeleton + deepened flows, placeholder-only | MOSTLY COMPLIANT | Payment method strings not from canonical enum; KPI display values use formatted dollar strings; no audit trail |
| IDENTITY | merchant_owner actor, store scoping (R-023) | Session has merchantId but no store_id in session type; query services accept storeId parameter | PARTIAL | MerchantSession type lacks store_id; no actor_type field; merchant_staff not implemented |
| STRUCTURE | R-005 (adapter at src/shared/domain.ts) | Adapter exists, imports from repo-level shared | COMPLIANT | PAYMENT_STATUSES and AUTH_ACTOR_TYPES not re-exported through adapter |
| FLOW | Order state machine, Settlement flow | Mock data uses canonical OrderStatus type; settlement uses canonical SettlementState | MOSTLY COMPLIANT | Payment method strings ("Credit Card", "Debit Card", "Cash") not from PAYMENT_METHOD_PLACEHOLDERS canonical enum |
| DATE | Laws 6-11 | Mock timestamps are UTC ISO 8601 with Z suffix | MOSTLY COMPLIANT | KPI display values embed formatted dollar amounts ("$2,847") but timestamp fields are correct; store hours use bare time strings ("10:00") without timezone context |
| DECAY_PATH | Mode 2 (float money), Mode 6 (permission bypass), Mode 10 (audit trail absence) | Float money risk in KPI display values; no permission enforcement | AT RISK | See detailed findings |
| GLOSSARY | Term alignment | N/A | N/A | None |
| ENFORCEMENT_CHECKLIST | Pre-merge validation | No automated governance checks | NOT ENFORCED | No CI enforcement |

**Highest-risk decay vectors**: Decay Mode 6 (permission bypass - no server-side role enforcement), Decay Mode 10 (audit trail absence), payment method string drift from canonical enum.

---

### 1.3 admin-console (Next.js)

| Governance Doc | Applicable Rules | Implementation Status | Compliance Level | Gaps |
|---|---|---|---|---|
| CONSTITUTION | R-001, R-005, R-010/R-011, R-020-R-022, R-030-R-033, R-040-R-043, R-050, R-060-R-062, R-070-R-074 | Skeleton + deepened flows, placeholder-only | PARTIAL | Money values in PlatformOrder totals appear to be small integers (5600, 3250) which could be either centavos or display dollars -- ambiguous; no audit trail infrastructure; feature flags in mock data reference realtime_tracking (excluded feature) |
| IDENTITY | All admin roles (R-022), platform_admin, operations_admin, etc. | AdminSession type exists but has no role field; readAdminRole() reads from separate cookie but is not typed against PERMISSION_ROLES | PARTIAL | AdminSession type lacks role, actor_type; no role validation against canonical PERMISSION_ROLES enum; no MFA enforcement |
| STRUCTURE | R-005 (adapter at src/shared/domain.ts) | Adapter exists, imports from repo-level shared | COMPLIANT | AUTH_ACTOR_TYPES and PAYMENT_STATUSES not re-exported through adapter |
| FLOW | All state machines (order, payment, settlement, dispute, support ticket) | Mock data uses canonical typed statuses for order, dispute, settlement | MOSTLY COMPLIANT | Support ticket statuses defined locally as string union, not from canonical enum (no SUPPORT_TICKET_STATUSES in shared); payment method strings not canonical |
| DATE | Laws 6-11 | Mock timestamps are UTC ISO 8601 with Z suffix | MOSTLY COMPLIANT | Finance summary values embed formatted dollar amounts; settlement period strings use informal format ("Mar 8-14") |
| DECAY_PATH | Mode 6 (permission bypass), Mode 8 (ad-hoc field addition), Mode 10 (audit trail absence) | No RLS, no server-side RBAC, no audit log | AT RISK | Critical pre-live-integration gaps |
| GLOSSARY | Term alignment | N/A | N/A | None |
| ENFORCEMENT_CHECKLIST | Pre-merge validation | No automated governance checks | NOT ENFORCED | No CI enforcement |

**Highest-risk decay vectors**: Decay Mode 6 (permission bypass - admin roles not enforced server-side, R-021 violation), Decay Mode 10 (audit trail absence - R-060/R-061/R-062 have zero implementation), feature flag mock referencing excluded feature (realtime_tracking).

---

### 1.4 public-website (Next.js)

| Governance Doc | Applicable Rules | Implementation Status | Compliance Level | Gaps |
|---|---|---|---|---|
| CONSTITUTION | R-001, R-005, R-073 (no cross-surface sessions), R-074 (no auth in public) | No auth, no session, no route guards | COMPLIANT | None |
| IDENTITY | No authenticated actors; public-only | No session storage, no auth provider | COMPLIANT | None |
| STRUCTURE | R-005 (adapter at src/shared/domain.ts) | Adapter exists; only imports LEGAL_DOCUMENT_TYPES and SUPPORT_CHANNELS | COMPLIANT | None |
| FLOW | N/A (no order/payment/settlement flows) | N/A | N/A | None |
| DATE | Laws 1-5 (doc dates), Laws 6-11 (no runtime timestamps needed) | No runtime timestamp usage found | COMPLIANT | None |
| DECAY_PATH | Mode 4 (cross-surface leakage), Mode 5 (shared layer bloat) | Clean -- no cross-surface imports | NOT OCCURRING | None |
| GLOSSARY | Term alignment | N/A | N/A | None |
| ENFORCEMENT_CHECKLIST | Public-website auth scan | Clean -- no auth-related imports in src/ | COMPLIANT | None |

**Highest-risk decay vectors**: None. public-website is the most governance-compliant surface.

---

### 1.5 shared (TypeScript contracts)

| Governance Doc | Applicable Rules | Implementation Status | Compliance Level | Gaps |
|---|---|---|---|---|
| CONSTITUTION | R-003/R-004 (contract-only), R-010/R-011 (centavo types), R-012 (ARS currency), R-040-R-043 (canonical enums) | Types, constants, models, utils, validation schemas, contracts | MOSTLY COMPLIANT | Promotion types diverge between .ts and .json; SupportCaseSummary uses "in_review" status not in any canonical enum; no SUPPORT_TICKET_STATUSES enum defined; payment status "settled" from FLOW.md missing from PAYMENT_STATUSES |
| IDENTITY | Actor taxonomy definition | AUTH_ACTOR_TYPES includes guest, customer, merchant, rider, admin, system | MOSTLY COMPLIANT | merchant_staff actor missing from AUTH_ACTOR_TYPES (IDENTITY.md defines it as a distinct actor) |
| STRUCTURE | R-003/R-004 (no UI, no runtime, no routing, no state) | No forbidden file types found | COMPLIANT | None |
| FLOW | Canonical enum definitions for all state machines | ORDER_STATUSES, PAYMENT_STATUSES, SETTLEMENT_STATES, DISPUTE_STATUSES defined | PARTIAL | Missing SUPPORT_TICKET_STATUSES enum (FLOW.md Section 5); PAYMENT_STATUSES missing "settled" (FLOW.md Section 2.2); SETTLEMENT_STATES includes "scheduled" not in FLOW.md Section 3 |
| DATE | Utility compliance | date.ts references archived DATE_POLICY.md instead of DATE.md; has UTC validation and business date conversion | PARTIAL | Stale doc reference in date.ts line 4 |
| DECAY_PATH | Mode 1 (enum pollution), Mode 2 (float money), Mode 9 (placeholder permanence), Mode 11 (currency drift), Mode 12 (actor taxonomy drift) | CurrencyCode fixed to ARS/USD (Mode 11 resolved); MoneyAmount branded type added (Mode 2 partially resolved); placeholder suffixes still in payment methods and API contracts (Mode 9 active) | PARTIAL | See detailed domain analysis below |
| GLOSSARY | Term definitions | N/A (reference) | N/A | None |
| ENFORCEMENT_CHECKLIST | Shared forbidden-content scan | No forbidden file types | COMPLIANT | None |

**Highest-risk decay vectors**: Decay Mode 1 (enum pollution -- promotion types diverge between .ts and .json, support ticket statuses undefined), Decay Mode 9 (placeholder permanence -- card_placeholder, pay_placeholder still in production enums).

---

## 2. Domain-Level Compliance Matrix

### 2.1 Order Domain

| Aspect | Governance Rule | Current State | Compliant? | Gap Detail |
|---|---|---|---|---|
| Canonical status enum | R-040, FLOW.md 1.2 | `shared/constants/domain.constants.ts` has correct 9 values | YES | None |
| Order schema | R-040 | `shared/validation/order.schema.json` enum matches canonical | YES | None |
| JSON bridge (Flutter) | R-005, STRUCTURE.md 3 | `domain_contract_bridge.dart` matches canonical | YES | None |
| Merchant mock status usage | R-041 | Uses `OrderStatus` type from domain adapter | YES | None |
| Admin mock status usage | R-041 | Uses `OrderStatus` type from domain adapter | YES | None |
| Customer mock status usage | R-041 | Uses display strings ("Preparing", "On the way") NOT canonical values | **NO** | Violates R-041. Display strings should be presentation-layer only; data model should use canonical enum values |
| Order immutability (no delete) | R-030 | No delete operations found | YES (placeholder) | Not tested against live backend |
| State machine transitions | FLOW.md 1.3 | No transition enforcement code exists | **NO** | No code validates allowed transitions; entirely placeholder |
| Idempotency keys | FLOW.md 6.1 | No idempotency_key in any order code or contract | **NO** | FLOW.md requires all order mutations to include idempotency_key |
| Order timestamp fields | DATE.md Law 10 | OrderSummary has `createdAt` field; merchant mock has `createdAt`, `estimatedDelivery`; missing `confirmed_at`, `preparing_at`, `ready_at`, `picked_up_at`, `delivered_at`, `cancelled_at`, `disputed_at` | **NO** | Only `createdAt` present; all per-status timestamps from DATE.md Law 10 are missing |

### 2.2 Payment Domain

| Aspect | Governance Rule | Current State | Compliant? | Gap Detail |
|---|---|---|---|---|
| Canonical payment status enum | R-040, FLOW.md 2.2 | `PAYMENT_STATUSES` = pending, captured, failed, refunded, partially_refunded | PARTIAL | Missing `settled` status defined in FLOW.md 2.2 |
| Payment method enum | R-040 | `PAYMENT_METHOD_PLACEHOLDERS` = cash, card_placeholder, pay_placeholder | PARTIAL | Mock data uses "Credit Card", "Debit Card", "Cash" -- not canonical values; placeholder suffix violates production-readiness |
| Money as centavos | R-010/R-011 | `MoneyAmount` is branded integer type; merchant mock uses integer centavos | PARTIAL | customer-app mock uses float dollars (12.99, 33.47, 2.99); admin mock PlatformOrder totals are ambiguously small integers |
| formatMoney usage | R-013 | `formatMoney()` exists in shared/utils/currency.ts; no surface actually calls it | **NO** | KPI display values use inline "$2,847" strings instead of formatMoney() |
| Payment immutability | R-031 | No delete operations found | YES (placeholder) | Not testable until live |
| Payment state machine | FLOW.md 2.3 | No transition enforcement code exists | **NO** | Entirely placeholder |
| Placeholder enforcement | R-074 | Auth placeholder states explicitly defer real payment | YES | Correctly deferred |

### 2.3 Settlement Domain

| Aspect | Governance Rule | Current State | Compliant? | Gap Detail |
|---|---|---|---|---|
| Canonical settlement enum | R-040, FLOW.md 3.2 | `SETTLEMENT_STATES` = pending, scheduled, processing, paid, failed | PARTIAL | `scheduled` exists in code but not in FLOW.md 3.1/3.2 state machine; FLOW.md Section 3 Note says rename `processing_placeholder` and `completed_placeholder` -- these are now resolved to `processing` and `paid` |
| Settlement immutability | R-032 | No delete operations found | YES (placeholder) | Not testable until live |
| Integer centavos | R-010/R-014 | Merchant mock settlements use integer values (845650, 126848, etc.) | YES | Correct |
| Settlement period cutoff | DATE.md Law 9, FLOW.md 3.3 | No business-date-aware settlement cutoff logic exists | **NO** | Rule requires 23:59:59 Buenos Aires time cutoff; no implementation |
| Settlement period display | DATE.md Law 1 | Merchant mock uses "Mar 8 - Mar 14, 2026"; admin mock uses "Mar 8-14" -- both informal | **NO** | Should use ISO 8601 dates in data layer; display formatting at presentation layer |

### 2.4 Admin / Permission Domain

| Aspect | Governance Rule | Current State | Compliant? | Gap Detail |
|---|---|---|---|---|
| Admin role enum | R-022 | `PERMISSION_ROLES` in shared matches IDENTITY.md Section 1 | YES | None |
| Server-side RBAC | R-021 | No server-side middleware or RLS enforcement | **NO** | Critical for live integration |
| AdminSession type | IDENTITY.md 6 | Has adminId, adminName; missing role, actor_type, session_id, store_id (N/A for admin) | **NO** | Token claims from IDENTITY.md Section 6 not represented |
| MFA enforcement | IDENTITY.md 1 | No MFA implementation | **NO** | IDENTITY.md requires Credentials + MFA for all admin actors |
| Permission-aware routing | IDENTITY.md 3.4 | access-boundary page exists but no runtime enforcement | PARTIAL | Structure exists, enforcement does not |
| Feature flag governance | R-071 | Mock data includes feature flags; one references "realtime_tracking" (excluded feature) | **NO** | Feature flag mock should not reference excluded features |

### 2.5 Customer / Auth Domain

| Aspect | Governance Rule | Current State | Compliant? | Gap Detail |
|---|---|---|---|---|
| Phone/OTP auth | IDENTITY.md 1 | CustomerSessionController has OTP flow states | YES (placeholder) | Flow exists, provider not live |
| Guest mode | R-024, IDENTITY.md 1 | Guest mode explicitly modeled in CustomerAuthStatus | YES | None |
| Guest cart restriction | R-024 | "Cart operations for guests are allowed. Order placement requires authentication." | NOT ENFORCED | No code checks guest status before order placement |
| Session isolation | R-073 | customer-app session is Flutter-local; no cross-surface session sharing | YES | None |
| Actor attribution | R-020 | No actor_type or actor_id in any customer-app mutation | **NO** | No mutation carries actor identity |

### 2.6 Merchant / Store-Scoped Domain

| Aspect | Governance Rule | Current State | Compliant? | Gap Detail |
|---|---|---|---|---|
| Store-scoped access | R-023 | URL pattern uses `[storeId]`; query services accept storeId | YES (structural) | No server-side enforcement |
| MerchantSession type | IDENTITY.md 6 | Has merchantId, merchantName; missing store_id, actor_type, session_id | PARTIAL | Token claims incomplete |
| merchant_staff actor | IDENTITY.md 1 | Not implemented; not in AUTH_ACTOR_TYPES | **NO** | IDENTITY.md defines merchant_staff as distinct actor with scoped permissions |
| Multi-store authorization | R-023 | No multi-store auth mechanism | **NO** | Required for merchants with multiple stores |
| Onboarding gate | IDENTITY.md | Cookie-based onboarding check exists | YES (placeholder) | Not live |

### 2.7 Cross-Domain: Audit Trail

| Aspect | Governance Rule | Current State | Compliant? | Gap Detail |
|---|---|---|---|---|
| Audit log schema | R-060/R-061 | No audit_logs table, schema, or type definition anywhere | **NO** | Zero implementation |
| Mutation logging | R-060 | No mutation in any surface emits audit events | **NO** | Zero implementation |
| Actor attribution in logs | R-061 | N/A -- no logs exist | **NO** | Zero implementation |
| Write protection | R-062 | N/A -- no logs exist | **NO** | Zero implementation |

---

## 3. Promotion Type Divergence Detail

The `PROMOTION_TYPES` constant diverges between the two canonical source files:

| Source | Values |
|---|---|
| `shared/constants/domain.constants.ts` | percentage, fixed, free_delivery, coupon, discount |
| `shared/constants/domain.constants.json` | coupon, discount, free_delivery |

The `.ts` file has 5 values; the `.json` file has 3 values. The `.json` file is consumed by `customer-app` via the domain contract bridge. This means the customer-app cannot represent `percentage` or `fixed` promotions.

**Blocking rule**: R-040 (single canonical location), R-043 (no local invention).

---

## 4. SupportCaseSummary Status Drift

`shared/models/domain.models.ts` line 89 defines:
```
status: "open" | "in_review" | "closed"
```

FLOW.md Section 5.1 defines the canonical support ticket states as:
```
OPEN -> IN_PROGRESS -> AWAITING_REPLY -> RESOLVED -> CLOSED
```

The model uses `in_review` which is not a canonical value. Additionally, there is no `SUPPORT_TICKET_STATUSES` constant in `shared/constants/domain.constants.ts`, meaning support ticket statuses have no canonical enum enforcement at all.

The admin mock data defines support ticket statuses locally:
```
"open" | "in_progress" | "awaiting_reply" | "resolved" | "closed"
```

This matches FLOW.md but is a local string union, not derived from a canonical enum constant.

**Blocking rule**: R-040 (canonical location), R-041 (surface-local must use canonical), R-042 (add to canonical first).

---

## 5. Decay Mode Cross-Reference

| Decay Mode (DECAY_PATH.md) | Surfaces Affected | Current Evidence | Severity |
|---|---|---|---|
| 1. Status Enum Pollution | customer-app, shared | customer-app uses display strings; SupportCaseSummary uses non-canonical "in_review"; promotion types diverge between .ts and .json | ACTIVE |
| 2. Float Money | customer-app | All prices (12.99, 7.49, etc.), totals (33.47, 28.97), and delivery fees (2.99, 1.49) are float dollars, not integer centavos | ACTIVE |
| 3. Local Time Persistence | customer-app | Mock dates use relative strings ("Yesterday", "2 min ago", "Mar 12") | ACTIVE |
| 4. Cross-Surface Runtime Leakage | None | No cross-surface imports found | NOT OCCURRING |
| 5. Shared Layer Bloat | None | shared contains only contracts/types/utils/docs | NOT OCCURRING |
| 6. Permission Bypass | admin-console, merchant-console | No server-side RBAC in either surface; no RLS | AT RISK |
| 7. Nullable Abuse | Not audited in detail | N/A | UNKNOWN |
| 8. Ad-hoc Field Addition | shared | SupportCaseSummary model fields do not match any schema; no support.schema.json validation | AT RISK |
| 9. Temporary Workaround Permanence | shared | card_placeholder, pay_placeholder in production enums; placeholder suffixes in API contracts | ACTIVE |
| 10. Audit Trail Absence | All surfaces | Zero audit infrastructure | ACTIVE |
| 11. Currency Code Drift | None | CurrencyCode is now "ARS" / "USD"; VND removed | RESOLVED |
| 12. Actor Taxonomy Drift | shared | merchant_staff missing from AUTH_ACTOR_TYPES | ACTIVE |

---

## 6. Timestamp Policy Compliance (DATE.md Laws 6-11)

| Surface | UTC Storage (Law 6) | ISO 8601 Format (Law 2) | Display Conversion (Law 8) | Field Naming (Law 10) | Forbidden Patterns (Law 11) |
|---|---|---|---|---|---|
| shared | date.ts has UTC validation and Buenos Aires conversion | Yes | toDisplayTime() exists | OrderSummary uses `createdAt` (correct) | date.ts references archived DATE_POLICY.md |
| merchant-console | Mock timestamps end with Z | Yes | No display conversion code | Uses `createdAt`, `estimatedDelivery`, `startsAt`, `expiresAt`, `paidAt`, `date`, `responseDate` | None found |
| admin-console | Mock timestamps end with Z | Yes | No display conversion code | Uses `createdAt`, `registeredAt`, `lastActive`, `joinedAt`, `publishedAt`, `scheduledAt`, `paidAt`, `contractStart`, `contractEnd`, `startDate`, `endDate`, `lastCheck` | None found |
| customer-app | No UTC timestamps in mock data | **NO** -- uses "Yesterday", "2 min ago", "Mar 12", "Today, 2:30 PM" | No conversion code | Uses `date`, `time` (non-canonical naming) | Relative strings violate Law 4 and Law 11 |
| public-website | No runtime timestamps | N/A | N/A | N/A | N/A |

---

*Matrix generated: 2026-03-16*
*Evidence basis: Direct file reading of all governance docs, shared contracts, surface mock data, auth/session files, domain adapters, and grep analysis of status strings, money values, timestamps, cross-surface imports, and actor attribution patterns.*
