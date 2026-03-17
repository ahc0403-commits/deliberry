# Execution Plan

> **Classification: Supporting Operational Artifact** — This is NOT a canonical governance document.
> This file defines wave-based remediation sequencing, not governance rules.

Status: active
Authority: operational (supporting artifact)
Surface: cross-surface
Domains: governance-execution, wave-planning
Last updated: 2026-03-14
Last verified: 2026-03-16
Retrieve when:
- sequencing governance remediation work
- checking wave scope, dependencies, and acceptance criteria
Related files:
- docs/governance/WAVE_TRACKER.md
- docs/governance/ENFORCEMENT_POINTS.md
- docs/governance/RECONCILIATION_GAP_ANALYSIS.md

> This document defines the wave-based execution plan for resolving all governance gaps
> and advancing the Deliberry platform toward live-integration readiness.
> Each wave has defined scope, dependencies, risks, and acceptance criteria.

---

## Wave 0 -- Governance Foundation (COMPLETE)

**Scope**: Establish all governance documentation and minimal code fixes.

**Deliverables**:
1. CONSTITUTION.md -- Immutable platform rules
2. IDENTITY.md -- Actor and entity taxonomy
3. STRUCTURE.md -- Repository structure and naming rules
4. FLOW.md -- Canonical state machines for all domain flows
5. DATE.md -- Timestamp and timezone policy (canonical; DATE_POLICY.md archived)
6. DECAY_PATH.md -- Decay pattern registry
7. DOMAIN_MAPPING_MATRIX.md -- Cross-domain governance mapping
8. RECONCILIATION_GAP_ANALYSIS.md -- Current gap inventory
9. EXECUTION_PLAN.md -- This document
10. PR_CHECKLIST_CONSTITUTIONAL.md -- PR review checklist
11. QA_CHECKLIST_CONSTITUTIONAL.md -- QA validation checklist
12. Minimal code fixes: CurrencyCode (ARS), currency utility (ARS support), order status enum (add `in_transit`, `disputed`)

**Status**: COMPLETE

---

## Wave 1 -- Canonical Contract Hardening (IN PROGRESS)

**Scope**: Fix all shared contract types, constants, and utilities to match governance rules.

**Completed Deliverables**:
1. DONE: Fix `CurrencyCode` in `shared/types/common.types.ts` -> `'ARS' | 'USD'` (remove VND)
2. DONE: Fix `MoneyAmount` -> branded integer centavo type with JSDoc constraint
3. DONE: Add `Centavos` alias and `ISODateTimeUTC` branded type
4. DONE: Add `draft`, `in_transit`, `disputed` to `ORDER_STATUSES`
5. DONE: Rename `ready_for_delivery` -> `ready` (with deprecation comment)
6. DONE: Fix settlement status: remove `_placeholder` suffixes (`processing`, `paid`), add `failed`
7. DONE: Add `rider`, `guest`, `system` to `AUTH_ACTOR_TYPES`
8. DONE: Add `PAYMENT_STATUSES` enum (pending, captured, failed, refunded, partially_refunded)
9. DONE: Add `DISPUTE_STATUSES` enum (open, investigating, escalated, resolved)
10. DONE: Add `PaymentStatus` and `DisputeStatus` derived types
11. DONE: Update `shared/utils/currency.ts` -- formatMoney accepts centavos, parseToCentavos added
12. DONE: Update `shared/utils/date.ts` -- BUENOS_AIRES_TZ, toDisplayTime, toBusinessDate, isValidUTCTimestamp
13. DONE: Update `shared/api/order.contract.json` with canonical status enum and centavo fields
14. DONE: Update `shared/validation/order.schema.json` with enum constraint and integer money type
15. DONE: Update `shared/constants/domain.constants.json` (Flutter JSON bridge)
16. DONE: Update `customer-app` Dart bridge with canonical statuses
17. DONE: Update surface-local `domain.ts` adapters with governance enforcement comments
18. DONE: Align merchant-console mock data types and instances to canonical statuses
19. DONE: Align admin-console mock data types and instances to canonical statuses
20. DONE: Update merchant/admin orders screen components to canonical statuses
21. DONE: Update merchant/admin CSS status badges
22. DONE: Create ENFORCEMENT_POINTS.md
23. DONE: Create WAVE_TRACKER.md
24. DONE: Update RECONCILIATION_GAP_ANALYSIS.md with resolved gaps

**Remaining items (deferred to Wave 2)**:
- ~~Convert merchant-console mock data float money values to integer centavos~~ DONE Wave 2A-1 (2026-03-16)
- ~~Convert admin-console mock data float money values to integer centavos~~ DONE Wave 2A-2 (2026-03-16)
- ~~Update merchant-console display components to divide by 100~~ DONE Wave 2A-1 (2026-03-16)
- ~~Update admin-console display components to divide by 100~~ DONE Wave 2A-2 (2026-03-16)
- ~~Scan public-website mock data for float money values~~ DONE Wave 2A-3 (2026-03-16) — no numeric money fields found; surface is placeholder-string-only
- ~~Scan shared/ fixture/schema files for float money values~~ DONE Wave 2A-4 (2026-03-16) — settlement.schema.json and menu.schema.json money fields fixed to integer type
- ~~Add UTC timezone context to mock timestamp strings~~ DONE Wave 2B-1 (2026-03-16) — all informal date strings replaced with UTC ISO 8601 in merchant-console and admin-console mock data
- ~~Derive mock data status types from canonical OrderStatus type~~ DONE Wave 2B-2 (2026-03-16)
- Add runtime centavo assertion utility

**Dependencies**: Wave 0 (governance documents establish the rules these changes implement).

**Risks**:
- Type changes may cause TypeScript errors in surface code that references old values
- `ready_for_delivery` -> `ready` rename requires searching all surfaces
- Mitigation: deprecation comment during transition; run typecheck after each change

**Acceptance Criteria**:
- [x] `CurrencyCode` is `'ARS' | 'USD'` -- no VND references remain
- [x] `MoneyAmount` has centavo constraint documented
- [x] `ORDER_STATUSES` includes all 9 canonical values
- [x] `SETTLEMENT_STATES` has no `_placeholder` suffixes
- [x] `AUTH_ACTOR_TYPES` includes `rider`, `guest`, and `system`
- [x] `PAYMENT_STATUSES` enum exists
- [x] `DISPUTE_STATUSES` enum exists
- [x] Currency utility formats ARS correctly
- [x] Date utility converts UTC to Buenos Aires display time
- [ ] `npm run typecheck` passes for all web surfaces
- [ ] `npm run build` passes for all web surfaces

---

## Wave 2 -- Surface Mock Data Alignment

**Scope**: Align all surface-local mock data with canonical contracts from Wave 1.

**Deliverables**:
1. Convert all float money values to integer centavos in mock data
2. Update display components to divide by 100 for rendering
3. Add UTC timezone context to mock timestamp strings (suffix with `Z`)
4. Derive mock data status types from canonical OrderStatus type (import from domain.ts)
5. Remove superseded placeholder state files
6. Align customer-app mock data with canonical contracts (via JSON bridge)
7. Add runtime centavo assertion utility

**Dependencies**: Wave 1 (canonical contracts must be fixed first).

**Risks**:
- Mock data changes may break UI rendering if components expect old formats
- Centavo conversion requires updating display logic to divide by 100
- Mitigation: update display components in same PR as mock data changes

**Acceptance Criteria**:
- [x] All mock data order statuses match `ORDER_STATUSES` canonical enum (Wave 2B-2)
- [x] All mock data money values are integer centavos (Wave 2A-1 through 2A-4)
- [x] All mock data timestamps are UTC ISO 8601 with `Z` suffix (Wave 2B-1)
- [ ] No `_placeholder` suffixes in mock data
- [ ] No `VND` references in mock data
- [ ] All surfaces build and typecheck cleanly

---

## Wave 3 -- Flow Implementation

**Scope**: Implement state machines, transition validation, and cross-flow rules.

**Deliverables**:
1. Implement order state machine with transition validation (reject forbidden transitions)
2. Implement payment state machine with terminal state enforcement
3. Implement dispute flow with linkage to order and payment flows
4. Implement idempotency layer (idempotency key on all mutations)
5. Implement compensation logic (payment failure -> auto-cancel order)
6. Implement settlement period calculation using Buenos Aires business dates
7. Add build-time cross-surface import scan

**Dependencies**: Wave 1 (canonical enums), Wave 2 (aligned mock data for testing).

**Risks**:
- State machine implementation requires backend infrastructure decisions
- Idempotency requires persistent key storage
- Compensation logic is complex and must be thoroughly tested
- Mitigation: implement as pure functions first, integrate with backend later

**Acceptance Criteria**:
- [ ] Order transitions validated against allowed transition table from FLOW.md
- [ ] Forbidden transitions throw explicit errors
- [ ] Idempotency keys prevent duplicate mutations
- [ ] Payment failure triggers order cancellation
- [ ] Settlement periods calculated correctly for Buenos Aires timezone

---

## Wave 4 -- Auth/Permission Hardening

**Scope**: Implement server-side authorization, row-level security, and actor scoping.

**Deliverables**:
1. Implement RLS policies for all database tables
2. Implement server-side role enforcement middleware for admin-console
3. Implement store-scoping middleware for merchant-console (R-023)
4. Implement rider identity model and session management
5. Implement guest session lifecycle (anonymous session with cart capability)
6. Implement MFA for admin actors

**Dependencies**: Wave 3 (flows define what needs authorization).

**Risks**:
- RLS policies require careful testing to avoid data leaks
- Store-scoping must be enforced at every query, not just middleware
- Mitigation: comprehensive permission testing matrix

**Acceptance Criteria**:
- [ ] Every API endpoint requires authentication (except public-website)
- [ ] Admin actions are role-restricted per R-022
- [ ] Merchant queries are store-scoped per R-023
- [ ] Guest access is limited to browse + cart per R-024
- [ ] RLS policies prevent cross-tenant data access
- [ ] Rider identity can be attributed in audit logs

---

## Wave 5 -- Audit Trail

**Scope**: Implement audit logging infrastructure for all governed entities.

**Deliverables**:
1. Create `audit_logs` database table with schema from CONSTITUTION.md R-061
2. Implement mutation interceptors for: Order, Payment, Settlement, User, Merchant
3. Implement audit log read API for admin-console
4. Build audit log viewer in admin-console UI
5. Implement audit log immutability enforcement (R-033, R-062)

**Dependencies**: Wave 3 (mutation flows must exist to intercept), Wave 4 (actor identity must be available).

**Risks**:
- Audit logging adds latency to every mutation
- Log volume may be high for active orders
- Mitigation: async audit log writes, log retention policy

**Acceptance Criteria**:
- [ ] `audit_logs` table exists with all required fields from R-061
- [ ] Every mutation to governed entities produces an audit entry
- [ ] Audit entries record correct actor_id and actor_type
- [ ] Audit entries cannot be modified or deleted
- [ ] Admin can search and view audit logs by resource, actor, or date range

---

## Wave 6 -- Live Integration Readiness

**Scope**: Replace all placeholder implementations with real backend integrations.

**Deliverables**:
1. Replace mock data with real Supabase API calls across all surfaces
2. Implement real auth provider (phone/OTP for customer, credentials for merchant/admin)
3. Implement real payment provider integration (with R-074 finance/legal review)
4. Implement real-time order status updates (WebSocket or polling)
5. Performance and load testing
6. Security audit (penetration testing, dependency scanning)
7. Replace all `_placeholder` payment methods with real provider names

**Dependencies**: Waves 1-5 (all governance, contracts, flows, auth, and audit must be in place).

**Risks**:
- Live integration introduces real money movement (R-074)
- Auth provider integration requires third-party coordination
- Performance under load is unknown
- Mitigation: staged rollout, shadow mode, feature flags with governance review

**Acceptance Criteria**:
- [ ] All surfaces connect to real backend (no mock data in production paths)
- [ ] Auth works end-to-end for all actor types
- [ ] Payment capture and settlement work with real provider
- [ ] All constitutional rules (R-001 through R-074) pass automated validation
- [ ] Load test passes for expected concurrent user count
- [ ] Security audit produces no critical findings
- [ ] `flutter analyze`, `typecheck`, and `build` all pass

---

## Wave Dependency Graph

```
Wave 0 (Governance Docs) -- COMPLETE
  |__ Wave 1 (Contract Hardening) -- IN PROGRESS
        |__ Wave 2 (Mock Data Alignment)
              |__ Wave 3 (Flow Implementation)
                    |__ Wave 4 (Auth/Permission)
                          |__ Wave 5 (Audit Trail)
                                |__ Wave 6 (Live Integration)
```

Each wave MUST be completed and verified before the next wave begins.
Waves MUST NOT be parallelized across their dependency chain.
Items within a wave MAY be parallelized if they are independent.
