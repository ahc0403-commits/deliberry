# Wave Tracker

> **Classification: Supporting Operational Artifact** — This is NOT a canonical governance document.
> This file tracks implementation progress of governance remediation waves.

Status: active
Authority: operational (supporting artifact)
Surface: cross-surface
Domains: implementation-status, waves, progress
Last updated: 2026-04-15
Last verified: 2026-04-15
Retrieve when:
- checking what governance work is already complete vs pending
- confirming whether a proposed task belongs to a current or future wave
Related files:
- docs/governance/EXECUTION_PLAN.md
- docs/governance/ENFORCEMENT_POINTS.md
- docs/governance/RECONCILIATION_GAP_ANALYSIS.md

Updated: 2026-04-15 (April 2026 audit remediation batches 0-6 completed; closure verification recorded in `docs/governance/AUDIT_CLOSURE_VERIFICATION_2026-04.md`)

---

## Wave 0 -- Governance Foundation
**Status**: COMPLETE

**Deliverables**:
- 11 governance docs written (CONSTITUTION, IDENTITY, STRUCTURE, FLOW, DATE_POLICY, DECAY_PATH, DOMAIN_MAPPING_MATRIX, RECONCILIATION_GAP_ANALYSIS, EXECUTION_PLAN, PR_CHECKLIST_CONSTITUTIONAL, QA_CHECKLIST_CONSTITUTIONAL)
- 3 initial code fixes applied: CurrencyCode (ARS|USD), formatMoney (ARS support), ORDER_STATUSES (added in_transit, disputed)

---

## Wave 1 -- Canonical Contract Hardening
**Status**: COMPLETE

**Applied fixes**:
- [x] `CurrencyCode` updated to `'ARS' | 'USD'` -- VND removed (R-012)
- [x] `MoneyAmount` changed to branded integer centavo type with JSDoc (R-010, R-011)
- [x] Added `Centavos` alias for `MoneyAmount`
- [x] Added `ISODateTimeUTC` branded type (R-050, R-051)
- [x] `ORDER_STATUSES` updated to 9 canonical values: draft, pending, confirmed, preparing, ready, in_transit, delivered, cancelled, disputed (R-040)
- [x] Renamed `ready_for_delivery` to `ready` (R-040, FLOW.md 1.6)
- [x] Added `draft` to ORDER_STATUSES (R-040)
- [x] Added `PAYMENT_STATUSES`: pending, captured, failed, refunded, partially_refunded (R-031)
- [x] Added `DISPUTE_STATUSES`: open, investigating, escalated, resolved (FLOW.md Section 4)
- [x] Removed `_placeholder` suffixes from SETTLEMENT_STATES: processing, paid (R-040)
- [x] Added `failed` to SETTLEMENT_STATES (FLOW.md Section 3)
- [x] Added `rider` and `guest` and `system` to AUTH_ACTOR_TYPES (R-020, IDENTITY.md)
- [x] `formatMoney` updated to accept centavos and divide by 100 (R-013)
- [x] Added `parseToCentavos` helper (R-013)
- [x] Added `BUENOS_AIRES_TZ`, `toDisplayTime`, `toBusinessDate`, `isValidUTCTimestamp` to date utils (R-050-052)
- [x] Updated `order.contract.json` with canonical status enum and centavo fields (R-040)
- [x] Updated `order.schema.json` with enum constraint on status and integer money type (R-041)
- [x] Updated `domain.constants.json` (Flutter bridge source) with all canonical values
- [x] Updated `customer-app` Dart bridge with canonical statuses
- [x] Added `PaymentStatus` and `DisputeStatus` derived types in domain.types.ts
- [x] Added governance enforcement comments to all 3 surface domain adapters (R-005)
- [x] Created ENFORCEMENT_POINTS.md documenting all enforcement mechanisms
- [x] Merchant mock data type updated to canonical status values
- [x] Merchant mock data instances updated: "new" -> "pending", "picked_up" -> "in_transit"
- [x] Merchant orders screen updated to canonical status values
- [x] Merchant CSS status badges updated (new -> pending, picked_up -> in_transit, added confirmed)
- [x] Admin mock data PlatformOrder type updated to canonical status values
- [x] Admin mock data instance updated: "new" -> "pending"
- [x] Admin orders screen updated: "new" -> "pending" in filter arrays
- [x] Admin CSS status badge updated: .new -> .pending

**Remaining items (deferred to Wave 2)**:
- [x] Merchant mock data: convert float money values to integer centavos (Wave 2A-1 -- DONE 2026-03-16)
- [x] Admin mock data: convert float money values to integer centavos (Wave 2A-2 -- DONE 2026-03-16)
- [x] Merchant settlement mock type already uses canonical values (paid/pending/processing) -- verified OK
- [x] Admin settlement mock type already uses canonical values -- verified OK
- [x] Surface mock data types should programmatically derive from canonical OrderStatus type (Wave 2B-2 -- DONE 2026-03-16)
- [ ] Add runtime centavo assertion utility (deferred to Wave 2 remaining scope)

---

## Wave 2 -- Surface Mock Data Alignment
**Status**: IN PROGRESS

**Wave 2A-1 (merchant-console money normalization) -- DONE 2026-03-16**:
- [x] Converted all merchant-console mock money fields to integer centavos (R-010, R-011)
  - `mockOrders`: item prices, subtotal, deliveryFee, total
  - `mockMenuItems`: price
  - `mockPromotions`: minOrder, fixed-type value
  - `mockTopSellingItems`: revenue (float 232.5 eliminated)
  - `mockDailyRevenue`: revenue
  - Settlement mock data (grossAmount, commission, adjustments, netAmount) was already in centavos -- verified correct
- [x] Updated all merchant-console display components to divide centavos by 100 for rendering
  - orders-screen.tsx: table total, item price×qty, subtotal, deliveryFee, total
  - dashboard-screen.tsx: recent orders total
  - menu-screen.tsx: item price
  - settlement-screen.tsx: summary stats, all table money columns
  - analytics-screen.tsx: bar chart revenue, top items revenue
  - promotions-screen.tsx: fixed discount value, minOrder
- [x] Removed stale TODO comment referencing Wave 2 alignment

**Wave 2A-2 (admin-console money normalization) -- DONE 2026-03-16**:
- [x] Converted all admin-console mock money fields to integer centavos (R-010, R-011)
  - `mockPlatformOrders`: total (56.0 → 5600, 32.5 → 3250, 78.0 → 7800, 45.5 → 4550, 28.0 → 2800, 41.0 → 4100, 62.5 → 6250)
  - `mockDisputes`: amount (41.0 → 4100, 15.5 → 1550, 62.5 → 6250, 56.0 → 5600, 32.5 → 3250)
  - `mockPlatformSettlements`: grossAmount, commission, netAmount (all float peso-amounts × 100)
  - `mockMerchants`: totalRevenue (peso-level integers × 100)
  - `mockCampaigns`: budget and spent (× 100)
  - `mockWeeklyOrders`: revenue (× 100)
- [x] Updated all admin-console display components to divide centavos by 100 for rendering
  - orders-screen.tsx: table total, detail panel total
  - dashboard-screen.tsx: recent orders total
  - disputes-screen.tsx: summary total value, table amount column
  - settlements-screen.tsx: summary stats (gross, commission, net), all table money columns
  - finance-screen.tsx: all settlement table money columns
  - merchants-screen.tsx: totalRevenue column
  - analytics-screen.tsx: bar chart revenue label (÷100000 for k-display)
  - marketing-screen.tsx: budget column, spent column

**Wave 2A-4 (shared fixture/schema money normalization) -- DONE 2026-03-16**:
- [x] Scanned all shared/ mock/fixture/seed/demo/contract/schema files for float money values (R-010, R-011)
  - `shared/validation/settlement.schema.json`: `amount` field was `"type": "number"` — changed to `"type": "integer"` with centavo description
  - `shared/validation/menu.schema.json`: `price` field was `"type": "number"` — changed to `"type": "integer"` with centavo description
  - `shared/validation/order.schema.json`: `total_centavos` already `"type": "integer"` — verified correct, no change needed
  - All remaining shared/ files (contracts, models, types, constants, utils): no numeric mock money values; no changes required
- [x] `npm run typecheck` passes for merchant-console, admin-console, public-website — no breakage

**Wave 2A-3 (public-website money normalization) -- DONE 2026-03-16**:
- [x] Scanned all public-website mock data and fixtures for monetary values (R-010, R-011)
  - `public-content-repository.ts`: contains only placeholder string content — no numeric money fields
  - `content-service.ts`: service facade only — no money fields
  - `domain.ts`: surface adapter — exports legal/support constants only, no money fields
  - All TSX screen files: money references are prose/marketing copy only, not data fields
- [x] Result: public-website has zero mock money fields requiring centavo conversion
- [x] `npm run typecheck` passes with no errors

**Wave 2B-1 (timestamp normalization) -- DONE 2026-03-16**:
- [x] Normalized all UTC ISO 8601 timestamps in merchant-console mock data (R-050, R-051)
  - `mockOrders`: createdAt, estimatedDelivery (7 records)
  - `mockReviews`: date, responseDate (6 records, 3 with responseDate)
  - `mockPromotions`: startsAt, expiresAt (4 records) — boundary times use Buenos Aires midnight (UTC-3 offset)
  - `mockSettlements`: paidAt (3 paid records)
  - `mockRecentAlerts`: time (4 records)
- [x] Normalized all UTC ISO 8601 timestamps in admin-console mock data (R-050, R-051)
  - `mockPlatformOrders`: createdAt (7 records)
  - `mockDisputes`: createdAt (5 records)
  - `mockSupportTickets`: createdAt (6 records)
  - `mockUsers`: registeredAt, lastActive (8 records)
  - `mockMerchants`: joinedAt (6 records) — month-level dates set to 1st of month at Buenos Aires midnight
  - `mockStores`: lastActive (8 records)
  - `mockPlatformSettlements`: paidAt (2 paid records)
  - `mockAnnouncements`: publishedAt, scheduledAt (3 records with dates)
  - `mockCampaigns`: startDate, endDate (4 records) — boundary times use Buenos Aires midnight
  - `mockB2BPartners`: contractStart, contractEnd (5 records) — month-level dates set to 1st of month
  - `mockPlatformAlerts`: time (5 records)
  - `mockSystemHealth`: lastCheck (7 records)
- [x] public-website: no timestamp fields in mock data — surface is placeholder-string-only (confirmed Wave 2A-3)
- [x] shared/: no timestamp values in fixture/contract files requiring normalization (confirmed Wave 2A-4)
- [x] `npm run typecheck` passes for merchant-console, admin-console, public-website — no breakage

**Wave 2B-2 (mock data canonical derivation) -- DONE 2026-03-16**:
- [x] Extended `merchant-console/src/shared/domain.ts` to also export `CurrencyCode`, `ISODateTimeUTC`, `MoneyAmount` from `common.types` (R-005)
- [x] Extended `admin-console/src/shared/domain.ts` to also export `DISPUTE_STATUSES`, `DisputeStatus`, `CurrencyCode`, `ISODateTimeUTC`, `MoneyAmount` (R-005, R-040)
- [x] `MerchantOrder.status` now derives from canonical `OrderStatus` instead of local string literal union (R-041)
- [x] `Promotion.type` now derives from canonical `PromotionType` instead of local string literal union (R-041)
- [x] `SettlementRecord.status` now derives from canonical `SettlementState` instead of local string literal union (R-041)
- [x] `PlatformOrder.status` now derives from canonical `OrderStatus` instead of local string literal union (R-041)
- [x] `PlatformDispute.status` now derives from canonical `DisputeStatus` instead of local string literal union (R-041)
- [x] `PlatformSettlement.status` now derives from canonical `SettlementState` instead of local string literal union (R-041)
- [x] `PROMOTION_TYPES` in `shared/constants/domain.constants.ts` extended with `percentage` and `fixed` (R-042: new values added to canonical first)
- [x] `npm run typecheck` passes for merchant-console, admin-console, public-website — no breakage

**Remaining Wave 2 scope**:
- [ ] Remove superseded placeholder files
- [ ] Add runtime centavo assertion utility

---

## Gap Plan Wave 1 -- Shared Contract Alignment
**Status**: COMPLETE
**Source**: reviews/governance_enforcement_gap_plan.md (Remediation Wave 1)
**Completed**: 2026-03-17

**Applied fixes**:
- [x] GAP-C06: Added `settled` to `PAYMENT_STATUSES` in domain.constants.ts and domain.constants.json (FLOW.md Section 2.2)
- [x] GAP-H01: Added `SUPPORT_TICKET_STATUSES` constant with 5 canonical values: open, in_progress, awaiting_reply, resolved, closed (FLOW.md Section 5.1)
- [x] GAP-H01: Added `SupportTicketStatus` derived type in domain.types.ts
- [x] GAP-H01: Updated `SupportCaseSummary.status` in domain.models.ts to use canonical `SupportTicketStatus` (replaced `"open" | "in_review" | "closed"`)
- [x] GAP-H01: Added `support_ticket_statuses` to domain.constants.json
- [x] GAP-H01: Admin-console domain adapter re-exports `SUPPORT_TICKET_STATUSES` and `SupportTicketStatus`
- [x] GAP-H01: Admin mock data `SupportTicket.status` now derives from canonical `SupportTicketStatus` (replaced local string union)
- [x] GAP-H02: Synced `promotion_types` in domain.constants.json to match domain.constants.ts (added `percentage`, `fixed`)
- [x] GAP-H05: Split `merchant` into `merchant_owner` and `merchant_staff` in `AUTH_ACTOR_TYPES` (domain.constants.ts and domain.constants.json)
- [x] GAP-H05: Updated IDENTITY.md Current Gaps section (rider and guest gaps resolved in prior waves; merchant_staff scoping still pending)
- [x] GAP-H06: Added `scheduled` to FLOW.md Section 3.1 settlement state machine (aligning doc with existing code in SETTLEMENT_STATES)
- [x] GAP-H08: Fixed stale `DATE_POLICY.md` reference in shared/utils/date.ts → now references `docs/governance/DATE.md`
- [x] RAG-D01: Closed active date-authority leakage in retrieval guidance → active RAG date authority is `docs/governance/DATE.md`; remaining `DATE_POLICY.md` mentions are historical, archived, gap-tracking, or diagnostic only
- [x] RAG-R01: Closed admin platform access gap → protected admin routes now require authenticated session plus valid admin role at runtime
- [x] RAG-U01: Closed public marketing/support over-promise gap → public copy now aligns to runtime-real order progress, payment-selection, and support behavior
- [x] RAG-F02: Reconciled stale customer screen pattern matrix → matrix rows now match stabilized customer runtime truth and CTA behavior
- [x] RAG-D02: Reclassified optimistic final full-system QA baseline → `reviews/final_full_system_qa.md` is now a historical 2026-03-16 QA snapshot and no longer active runtime baseline guidance
- [x] Customer-app DomainContractBridge updated: added paymentStatuses, promotionTypes, authActorTypes, supportTicketStatuses; synced all values with canonical JSON; fixed `delivered placeholder` label
- [x] `flutter analyze` passes with no issues
- [x] `npm run typecheck` passes for merchant-console, admin-console, public-website — no breakage

**Closure note -- RAG-D01**:
- Fixed: active RAG retrieval docs now point to `docs/governance/DATE.md`.
- Intentionally retained: `DATE_POLICY.md` mentions in archived, historical, gap-tracking, and diagnostic docs.
- Why acceptable: those mentions describe prior state or archival status and do not function as active retrieval guidance.

**Closure note -- RAG-R01**:
- Fixed: admin platform routes now enforce authenticated session and valid admin role before protected pages render.
- Intentionally retained: navigation links are still not filtered by role; route enforcement is authoritative.
- Why acceptable: this closes the runtime-truth gap without broadening into a full admin permission-system rewrite.

**Closure note -- RAG-U01**:
- Fixed: public landing, service, download, and support copy no longer claim live tracking, full payment processing, live chat, or other unsupported help flows.
- Intentionally retained: commercial positioning and high-level product promise where it remains compatible with current runtime truth.
- Why acceptable: this removes false capability claims without stripping the public surface of usable marketing language.

**Closure note -- RAG-F02**:
- Fixed: `SCREEN_PATTERN_MATRIX.md` now reflects stabilized customer behavior for search/filter, order detail, cart, addresses, settings, and group-order honesty.
- Intentionally retained: only the matrix and directly related closure records changed; no runtime code or broader governance structure was touched.
- Why acceptable: this restores retrieval accuracy without broadening into another customer-audit wave.

**Closure note -- RAG-D02**:
- Fixed: `reviews/final_full_system_qa.md` no longer presents itself as the current operational baseline and now points readers to active runtime-truth and stabilization docs.
- Intentionally retained: the original 2026-03-16 build/analyze evidence and point-in-time QA conclusions remain in place as historical comparison material.
- Why acceptable: this preserves useful audit history while removing an over-optimistic active-baseline shortcut from the retrieval layer.

---

## Gap Plan Wave 2 -- Customer-App Data Model Compliance
**Status**: COMPLETE
**Source**: reviews/governance_enforcement_gap_plan.md (Remediation Wave 2)
**Completed**: 2026-03-17

**Applied fixes**:
- [x] GAP-C01: Converted all customer-app money fields from `double` to `int` centavos (R-010, R-011)
  - MockStore.deliveryFee, MockMenuItem.price, MockCartItem.total, MockOrder.total: `double` → `int`
  - MockData.cartSubtotal/cartDeliveryFee/cartServiceFee/cartTotal: `double` → `int`
  - CustomerRuntimeController cart computation: `double` → `int`
  - All 12 presentation files updated: `toStringAsFixed(2)` → `formatCentavos()` (centavos ÷ 100)
  - Promo discount: 5.0 → 500 (centavos)
- [x] GAP-C02: Replaced display-string status values with canonical enum values (R-041, R-043)
  - `'Preparing'` → `'preparing'`, `'On the way'` → `'in_transit'`, `'Delivered'` → `'delivered'`
  - Added `formatOrderStatus()` for presentation-layer label mapping
  - `submitOrder()` now uses canonical `'preparing'` status
- [x] GAP-C03: Replaced relative/informal timestamps with UTC ISO 8601 strings (R-050, DATE.md)
  - MockOrder.date → MockOrder.createdAt with UTC ISO 8601 values (e.g., `'2026-03-17T17:30:00Z'`)
  - MockNotification.time → MockNotification.createdAt with UTC ISO 8601 values
  - Added `formatOrderDate()` and `formatRelativeTime()` for presentation-layer display
  - `submitOrder()` now uses `DateTime.now().toUtc().toIso8601String()`
- [x] `flutter analyze` passes with no issues
- [x] `npm run typecheck` passes for merchant-console, admin-console, public-website — no regression

---

## Gap Plan Wave 3 -- Merchant/Admin Mock Data Alignment
**Status**: COMPLETE
**Source**: reviews/governance_enforcement_gap_plan.md (Remediation Wave 3)
**Completed**: 2026-03-17

**Applied fixes**:
- [x] GAP-C05: Payment method strings canonicalized in merchant-console and admin-console (R-041, R-043)
  - `"Credit Card"` / `"Debit Card"` → `"card_placeholder"`, `"Cash"` → `"cash"`
  - `MerchantOrder.paymentMethod` typed as `PaymentMethodPlaceholder`
  - `PlatformOrder.paymentMethod` typed as `PaymentMethodPlaceholder`
  - Presentation-layer `PAYMENT_LABELS` maps added to merchant and admin orders screens
  - Admin domain adapter extended: re-exports `PAYMENT_METHOD_PLACEHOLDERS` and `PaymentMethodPlaceholder`
- [x] GAP-M01: Removed excluded `realtime_tracking` feature flag from admin mock data (R-071, R-074)
  - Replaced with `multi_store_management` (non-excluded feature)
- [x] GAP-M06: Settlement period strings replaced with ISO 8601 date fields (R-050, DATE.md)
  - `SettlementRecord.period` → `periodStart` + `periodEnd` (merchant-console)
  - `PlatformSettlement.period` → `periodStart` + `periodEnd` (admin-console)
  - All mock data values converted to ISO 8601 dates (e.g., `"Mar 8 - Mar 14, 2026"` → `"2026-03-08"` / `"2026-03-14"`)
  - Settlement display screens updated to format from ISO dates
- [x] GAP-M08: `PlatformOrder.total` typed as `MoneyAmount` (R-010, R-011)
  - All 7 mock data values annotated with `as MoneyAmount` cast
- [x] `flutter analyze` passes — no regression
- [x] `npm run typecheck` passes for merchant-console, admin-console, public-website — no breakage

---

## Gap Plan Wave 4 -- Identity/Session Hardening + Adapter Completeness
**Status**: CLOSED
**Source**: reviews/wave_4_candidate_scope.md
**Completed**: 2026-03-17

**Applied fixes**:
- [x] GAP-H03: `AdminSession` extended with `role: PermissionRole` and `actorType: "admin"` (R-020, R-022, IDENTITY.md Section 6)
  - `signInAdminAction()` now writes `actorType: "admin"` and a mirrored role field into `ADMIN_SESSION_COOKIE`
  - `setAdminRoleAction()` now syncs the selected role into `ADMIN_SESSION_COOKIE` as well as `ADMIN_ROLE_COOKIE`
  - `readAdminSession()` now derives `role` from validated session or role-cookie data; `readAdminRole()` validates and returns `PermissionRole | null`
- [x] GAP-H04: `MerchantSession` extended with `actorType: "merchant_owner" | "merchant_staff"` (R-020, IDENTITY.md Section 6)
  - `signInMerchantAction()` now writes `actorType: "merchant_owner"` into `MERCHANT_SESSION_COOKIE`
  - `readMerchantSession()` now reads an explicit actor type from cookie data with `merchant_owner` as a backward-compatible fallback
- [x] GAP-M07: Guest auth gate added to `submitOrder()` in customer_runtime_controller.dart (R-024)
  - `submitOrder()` still blocks guest submissions at the data layer
  - `CheckoutScreen._placeOrder()` now shows explicit guest-auth feedback and routes guests to `/auth` instead of failing through the empty-cart path
- [x] GAP-M04: `formatMoney` re-exported through merchant-console and admin-console domain adapters (R-013, R-005)
- [x] GAP-M05: `AUTH_ACTOR_TYPES`, `PAYMENT_STATUSES`, `AuthActorType`, `PaymentStatus` re-exported through both adapters (R-005)
- [x] `flutter analyze` passes — no issues
- [x] `npm run typecheck` passes for merchant-console, admin-console, public-website — no breakage

---

## Gap Plan Wave 5 -- Structural Enforcement (HIGH gaps)
**Status**: CLOSED
**Source**: GAP-C04, GAP-H07 from reviews/governance_enforcement_gap_plan.md
**Completed**: 2026-03-17

**Applied fixes**:
- [x] GAP-C04: Created `shared/types/audit.types.ts` with `AuditLogEntry` interface and `AuditResourceType` union (R-060, R-061, R-062, IDENTITY.md Section 5)
  - Fields: id, actorId, actorType, action, resourceType, resourceId, timestampUtc, beforeState (optional), afterState
  - Uses canonical `AuthActorType`, `EntityId`, `ISODateTimeUTC` from existing shared types
  - Resource types cover all R-060 required entities: Order, Payment, Settlement, User, Merchant, Store, Dispute, SupportTicket
- [x] GAP-C04: Created `shared/validation/audit.schema.json` with JSON Schema validation for AuditLogEntry
  - Enforces required fields, enum constraints on actorType and resourceType, UTC timestamp pattern
- [x] GAP-H07: Created `shared/utils/transitions.ts` with state machine transition validators for all 5 FLOW.md domains
  - `isValidOrderTransition()` — FLOW.md Section 1.3 (9 statuses, 12 allowed transitions)
  - `isValidPaymentTransition()` — FLOW.md Section 2.3 (6 statuses, 5 allowed transitions)
  - `isValidSettlementTransition()` — FLOW.md Section 3.1 (5 statuses, 5 allowed transitions)
  - `isValidDisputeTransition()` — FLOW.md Section 4.1 (4 statuses, 4 allowed transitions)
  - `isValidSupportTicketTransition()` — FLOW.md Section 5.1 (5 statuses, 7 allowed transitions)
  - Each uses `ALLOWED_TRANSITIONS` maps derived directly from FLOW.md canonical state machines
- [x] `npm run typecheck` passes for merchant-console, admin-console, public-website — no breakage
- [x] `flutter analyze` passes — no issues

**Carry-forward notes**:
- Audit log interceptor integration (calling AuditLogEntry from mutation paths) is reserved for Wave 6 (Live Integration Readiness).
- Transition validator integration (calling isValidXxxTransition from surface mutation handlers) is reserved for Wave 6 or when live state mutations exist.
- Both contract types and validators are structurally complete and typecheck-verified but not yet wired into runtime mutation paths (current scope is placeholder/non-live).

---

## Gap Plan Wave 6-NR -- Non-Runtime Backlog Closure
**Status**: CLOSED
**Source**: GAP-M02, GAP-M03, GAP-L01, GAP-L02, GAP-L03 from reviews/governance_enforcement_gap_plan.md
**Completed**: 2026-03-17

**Applied fixes**:
- [x] GAP-L02: Renamed payment method enums — `card_placeholder` → `card`, `pay_placeholder` → `digital_wallet`, `PAYMENT_METHOD_PLACEHOLDERS` → `PAYMENT_METHODS` (deprecated alias retained for backward compat)
  - Updated: domain.constants.ts, domain.constants.json, domain.types.ts, domain.models.ts, both surface adapters, both surface mock data files, both orders screens, customer-app Dart bridge
- [x] GAP-L03: Removed all 11 `_placeholder` suffixes from 7 API contract files
  - Operations: verify_otp, submit_inquiry, check_scope, respond_to_review
  - Responses: auth_session, scope_check_result, store_details, payout_state, report_summary, order_detail, coupon_summary
- [x] GAP-M02: Added R-013 governance comments to KPI/analytics/finance display types documenting that `value: string` is a pre-formatted presentation-layer field, not canonical money data
  - merchant-console: DashboardKPI, AnalyticsMetric
  - admin-console: PlatformKPI, FinanceSummary
- [x] GAP-M03: Added per-status timestamp fields to OrderSummary in shared/models/domain.models.ts (DATE.md Law 10)
  - confirmedAt, preparingAt, readyAt, pickedUpAt, deliveredAt, cancelledAt, disputedAt, updatedAt (all optional ISODateTimeString)
  - Updated order.schema.json with matching optional timestamp fields and payment_method enum
- [x] GAP-L01: Created `scripts/governance-scan.sh` — minimum viable CI governance scan
  - Checks: shared forbidden content, cross-surface imports, placeholder suffixes, excluded feature references, public-website auth, float money in schemas
  - Scan passes clean on current repository state
- [x] `npm run typecheck` passes for merchant-console, admin-console, public-website — no breakage
- [x] `flutter analyze` passes — no issues
- [x] `scripts/governance-scan.sh` passes — RESULT: PASS

**This wave closes all 26 original enforcement gaps.**

---

## Wave 3 -- Flow Implementation
**Status**: SUPERSEDED (covered by Gap Plan Wave 5 transition validators)

**Original scope**:
- Implement order state machine with transition validation
- Implement payment state machine
- Implement dispute flow linkage
- Implement idempotency layer
- Add build-time cross-surface import scan

---

## Wave 4 -- Auth/Permission Hardening
**Status**: PARTIALLY SUPERSEDED (session types done in Gap Plan Wave 4; RLS/middleware requires backend)

**Remaining scope** (requires backend infrastructure):
- RLS policies for all database tables
- Server-side role enforcement middleware
- Store-scoping middleware for merchant
- Rider identity model (actor type defined, runtime identity requires backend)
- Guest session lifecycle (auth gate enforced, provider integration requires backend)

---

## Wave 5 -- Audit Trail
**Status**: PARTIALLY SUPERSEDED (types/schema done in Gap Plan Wave 5; interceptors require backend)

**Remaining scope** (requires backend infrastructure):
- audit_logs database table + Supabase migration
- Mutation interceptors wired to real write paths
- Admin audit log viewer with real data
- Immutability enforcement via RLS

---

## Wave 6 -- Live Integration Readiness
**Status**: BLOCKED ON BACKEND INFRASTRUCTURE

**Assessed 2026-03-17**: Runtime integration audit confirmed no live mutations, no database, no auth provider, and no API layer exist. All governance contracts, types, validators, and enforcement structures are in place. Runtime wiring is blocked on backend infrastructure setup.

**Scope** (requires Supabase or equivalent):
- Replace mock data with real API calls
- Real auth provider integration
- Real payment provider (with R-074 review)
- Audit interceptor wiring into real mutation paths
- Transition validator integration into real status handlers
- Order per-status timestamp population at real transition events
- formatMoney adoption across 15 web surface presentation files
- Performance and security testing

**See**: reviews/wave_6_runtime_integration_report.md

---

## Enforcement Gap Backlog Status (as of 2026-03-17)

**Status as of 2026-03-17**:

| Gap | Priority | Status | Resolved In |
|-----|----------|--------|-------------|
| GAP-C01 | CRITICAL | CLOSED | Wave 2 |
| GAP-C02 | CRITICAL | CLOSED | Wave 2 |
| GAP-C03 | CRITICAL | CLOSED | Wave 2 |
| GAP-C04 | CRITICAL | CLOSED | Wave 5 |
| GAP-C05 | CRITICAL | CLOSED | Wave 3 |
| GAP-C06 | CRITICAL | CLOSED | Wave 1 |
| GAP-H01 | HIGH | CLOSED | Wave 1 |
| GAP-H02 | HIGH | CLOSED | Wave 1 |
| GAP-H03 | HIGH | CLOSED | Wave 4 |
| GAP-H04 | HIGH | CLOSED | Wave 4 |
| GAP-H05 | HIGH | CLOSED | Wave 1 |
| GAP-H06 | HIGH | CLOSED | Wave 1 |
| GAP-H07 | HIGH | CLOSED | Wave 5 |
| GAP-H08 | HIGH | CLOSED | Wave 1 |
| GAP-M01 | MEDIUM | CLOSED | Wave 3 |
| GAP-M02 | MEDIUM | CLOSED | Wave 6-NR |
| GAP-M03 | MEDIUM | CLOSED | Wave 6-NR |
| GAP-M04 | MEDIUM | CLOSED | Wave 4 |
| GAP-M05 | MEDIUM | CLOSED | Wave 4 |
| GAP-M06 | MEDIUM | CLOSED | Wave 3 |
| GAP-M07 | MEDIUM | CLOSED | Wave 4 |
| GAP-M08 | MEDIUM | CLOSED | Wave 3 |
| GAP-L01 | LOW | CLOSED | Wave 6-NR |
| GAP-L02 | LOW | CLOSED | Wave 6-NR |
| GAP-L03 | LOW | CLOSED | Wave 6-NR |
| GAP-L04 | LOW | CLOSED | Wave 1 (incidental) |

**Resolved: 26 of 26 gaps** (Waves 1-5, Wave 6-NR, + 1 incidental fix)
**Open: 0 gaps**
**All enforcement gaps from the original governance gap plan are now closed.**

**Carry-forward notes (Wave 4 closure)**:
- Real provider-backed auth remains reserved for Wave 6 (Live Integration Readiness).
- Admin and merchant cookies now carry the actor-attribution fields required for the current non-live runtime model, but they are still demo identities rather than provider-issued claims.
- Current defaults (`platform_admin`, `merchant_owner`) are safe for the non-live placeholder phase.

**Post-Wave-4 runtime closure note -- merchant store-scope truth**:
- Fixed: merchant store-scoped repository reads no longer ignore `storeId`; `merchant-repository.ts` now validates the requested store against the supported demo-store scope.
- Intentionally retained: the merchant surface still exposes only one selectable store and still uses fixture-backed read models.

**Wave 6 retrieval closure note -- public route coverage**:
- Fixed: live public routes `/service` and `/merchant` now have first-class retrieval coverage through route-local READMEs, runtime-truth docs, filemaps, and flow docs.
- Fixed: [RAG_ACTIVE_INDEX.md](/Users/andremacmini/Deliberry/docs/rag-architecture/RAG_ACTIVE_INDEX.md) and [RETRIEVAL_ENTRY_PUBLIC.md](/Users/andremacmini/Deliberry/docs/rag-architecture/RETRIEVAL_ENTRY_PUBLIC.md) now point directly to those route-local retrieval artifacts instead of forcing manual repo scanning.
- Intentionally retained: both routes are still static screen-driven marketing flows backed by screen code rather than repository-driven live content.

**Wave 7 retrieval coverage note -- thin-surface coverage + shared tracing**:
- Fixed: direct local retrieval entry coverage now exists for merchant dashboard/reviews, admin dashboard/users/customer-service, and customer auth/home/addresses/group-order.
- Fixed: shared contract tracing now has a direct filemap and usage map, and both are reachable from the active RAG layer.
- Intentionally retained: broader merchant/admin long-tail clusters and some customer secondary clusters still remain outside first-wave local coverage.
- Why acceptable: route truth and data-read truth are now aligned without broadening into multi-store backend implementation.

**Wave 8 retrieval coverage note -- long-tail closure**:
- Fixed: direct local retrieval entry coverage now exists for the remaining merchant long-tail clusters: promotions, analytics, settlement, settings, and store-management.
- Fixed: direct local retrieval entry coverage now exists for the remaining admin long-tail clusters: merchants, stores, settlements, finance, marketing, announcements, catalog, b2b, analytics, reporting, and system-management.
- Fixed: direct local retrieval entry coverage now exists for the remaining customer secondary clusters: profile, settings, notifications, and reviews.
- Fixed: [RAG_ACTIVE_INDEX.md](/Users/andremacmini/Deliberry/docs/rag-architecture/RAG_ACTIVE_INDEX.md), [RETRIEVAL_ENTRY_MERCHANT.md](/Users/andremacmini/Deliberry/docs/rag-architecture/RETRIEVAL_ENTRY_MERCHANT.md), [RETRIEVAL_ENTRY_ADMIN.md](/Users/andremacmini/Deliberry/docs/rag-architecture/RETRIEVAL_ENTRY_ADMIN.md), and [RETRIEVAL_ENTRY_CUSTOMER.md](/Users/andremacmini/Deliberry/docs/rag-architecture/RETRIEVAL_ENTRY_CUSTOMER.md) now point directly to those local artifacts.
- Intentionally retained: this wave stayed README-only and did not broaden into extra runtime-truth, flow, or filemap docs where existing route/runtime coverage was already sufficient.

**Post-Wave-8 remaining open gap note**:
- Remaining open gap count: `1`.
- Remaining open gap: `G01` metadata-format inconsistency across a small set of active governance docs.
- Next recommended boundary: metadata normalization only. See [reviews/wave_9_candidate_scope.md](/Users/andremacmini/Deliberry/reviews/wave_9_candidate_scope.md).

**Wave 9 metadata normalization note**:
- Fixed: [docs/governance/DATE.md](/Users/andremacmini/Deliberry/docs/governance/DATE.md), [docs/governance/GLOSSARY.md](/Users/andremacmini/Deliberry/docs/governance/GLOSSARY.md), and [docs/governance/ENFORCEMENT_CHECKLIST.md](/Users/andremacmini/Deliberry/docs/governance/ENFORCEMENT_CHECKLIST.md) now use the same retrieval metadata block as the rest of the active governance and RAG layer.
- Fixed: [docs/rag-architecture/RAG_METADATA_STANDARD.md](/Users/andremacmini/Deliberry/docs/rag-architecture/RAG_METADATA_STANDARD.md) now states that the markdown retrieval metadata block is the canonical format for active docs.
- Result: `G01` is closed and no open retrieval-hygiene gaps remain in the active layer.
