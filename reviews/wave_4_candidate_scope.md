# Wave 4 Candidate Scope — Identity/Session Type Hardening + Adapter Completeness

Date: 2026-03-17
Source: reviews/governance_enforcement_gap_plan.md (remaining open backlog)
Prerequisites: Gap Plan Waves 1-3 (all CLOSED)
Status: CANDIDATE — NOT YET APPROVED FOR EXECUTION

---

## Executive Summary

With all 6 CRITICAL gaps now closed and the mock data layer fully aligned across all surfaces, the remaining 12 open gaps fall into three natural tiers:

1. **Identity/session type hardening** (GAP-H03, GAP-H04) — the last remaining Decay Mode 6 (Permission Bypass) gaps. These are low-risk type extensions that prepare the auth layer for live integration.
2. **Customer auth gate enforcement** (GAP-M07) — the only remaining R-024 violation. Pairs naturally with identity work.
3. **Adapter completeness + formatMoney wiring** (GAP-M04, GAP-M05) — low-effort structural improvements that complete the adapter boundary (R-005).

Wave 4 recommends bundling the identity/session hardening (GAP-H03, GAP-H04) with the guest auth gate (GAP-M07) and the adapter completeness gaps (GAP-M04, GAP-M05). These 5 gaps share the identity/structure domain, are low-risk, and collectively close Decay Mode 6.

---

## Remaining Open Gaps (12)

| Gap | Original Priority | Current Status | Domain | Revised Priority |
|-----|------------------|----------------|--------|-----------------|
| GAP-C04 | CRITICAL | OPEN | Audit trail infrastructure | HIGH (blocked on architecture decision) |
| GAP-H03 | HIGH | OPEN | Admin session type | HIGH — **Wave 4 candidate** |
| GAP-H04 | HIGH | OPEN | Merchant session type | HIGH — **Wave 4 candidate** |
| GAP-H07 | HIGH | OPEN | State machine transitions | HIGH (deferred — requires shared utility + surface wiring) |
| GAP-M02 | MEDIUM | OPEN | KPI inline dollar formatting | MEDIUM (deferred — display-only concern) |
| GAP-M03 | MEDIUM | OPEN | Order per-status timestamps | MEDIUM (deferred — requires shared model change) |
| GAP-M04 | MEDIUM | OPEN | formatMoney not wired through adapters | MEDIUM — **Wave 4 candidate** |
| GAP-M05 | MEDIUM | OPEN | Adapter missing re-exports | MEDIUM — **Wave 4 candidate** |
| GAP-M07 | MEDIUM | OPEN | Guest cart-to-order gate | MEDIUM (upgraded) — **Wave 4 candidate** |
| GAP-L01 | LOW | OPEN | CI governance scan | LOW (deferred) |
| GAP-L02 | LOW | OPEN | Placeholder suffixes in payment enum | LOW (deferred — live integration concern) |
| GAP-L03 | LOW | OPEN | Placeholder suffixes in API contracts | LOW (deferred — live integration concern) |

**Note**: GAP-L04 (`'delivered placeholder'` label) was resolved during Wave 1 as part of the DomainContractBridge update. It should be marked CLOSED in backlog tracking. Effective remaining count: **12 open gaps**.

---

## Revised Priority Ordering

### Tier 1: Highest-value next wave candidates (Wave 4)

| Rank | Gap | Why Now |
|------|-----|---------|
| 1 | **GAP-H03** | AdminSession missing `role: PermissionRole` and `actorType`. Last Decay Mode 6 gap for admin. Low-risk type extension, 1 file. |
| 2 | **GAP-H04** | MerchantSession missing `actorType` and `storeId`. Last Decay Mode 6 gap for merchant. Low-risk type extension, 1 file. |
| 3 | **GAP-M07** | Guest-to-order auth gate missing in customer-app checkout. Enforces R-024. Natural pairing with identity hardening. 1 file. |
| 4 | **GAP-M05** | Domain adapters missing `PAYMENT_STATUSES`, `AUTH_ACTOR_TYPES` re-exports. Low-effort, completes R-005 adapter boundary. 2 files. |
| 5 | **GAP-M04** | `formatMoney()` exists in shared but no surface uses it via adapter. Low-effort wiring, completes R-013 path. 2-3 files. |

### Tier 2: Should defer (next wave or later)

| Gap | Why Defer |
|-----|-----------|
| **GAP-C04** | Audit trail requires new types in shared + interceptor patterns in 3+ surfaces. Architecturally heavier — best as its own focused wave. |
| **GAP-H07** | State machine transition validators require new shared utility + surface wiring. Best paired with GAP-C04 in a "structural enforcement" wave. |
| **GAP-M03** | Order per-status timestamp fields require shared model changes. Best paired with GAP-H07 (both are shared-layer structural work). |
| **GAP-M02** | KPI string formatting is display-only. Lowest governance urgency among MEDIUM gaps. Can defer indefinitely. |

### Tier 3: Blocked or live-integration-dependent

| Gap | Why Blocked |
|-----|-------------|
| **GAP-L01** | CI governance scan requires build pipeline work — not a code gap. Defer to automation wave. |
| **GAP-L02** | Placeholder suffixes are intentional during current phase. Only actionable at live payment integration. |
| **GAP-L03** | Same as L02 — placeholder API operation names are acceptable during current placeholder phase. |

---

## Recommended Wave 4 Boundary

**Include**: GAP-H03, GAP-H04, GAP-M07, GAP-M04, GAP-M05 (5 gaps)

**Why this boundary**:
1. **Closes Decay Mode 6** (Permission Bypass) entirely — both admin and merchant session types will have proper actor attribution.
2. **Enforces R-024** (guest auth gate) — the only remaining runtime enforcement gap in customer-app.
3. **Completes adapter boundary** (R-005, R-013) — formatMoney and remaining canonical constants wired through adapters.
4. **Low risk**: All changes are type extensions, adapter re-exports, and a single auth gate check. No new architecture.
5. **Multi-surface but bounded**: Touches admin-console, merchant-console, and customer-app, but each surface has 1-3 files affected.

**Estimated file count**: 6-8 files total.

---

## Exact Included Gaps

### GAP-H03: AdminSession type hardening (HIGH)
- **Surface**: admin-console
- **Files**: `admin-console/src/shared/auth/admin-session.ts`
- **Change**: Add `role: PermissionRole`, `actorType: 'admin'` to AdminSession type. Type `readAdminRole()` return as `PermissionRole | null`.

### GAP-H04: MerchantSession type hardening (HIGH)
- **Surface**: merchant-console
- **Files**: `merchant-console/src/shared/auth/merchant-session.ts`
- **Change**: Add `actorType: 'merchant_owner'` to MerchantSession type.

### GAP-M07: Guest cart-to-order auth gate (MEDIUM, upgraded for Wave 4)
- **Surface**: customer-app
- **Files**: `customer-app/lib/features/checkout/presentation/checkout_screen.dart` (or the `submitOrder` path in `customer_runtime_controller.dart`)
- **Change**: Check `CustomerSessionController` guest status before allowing order placement. Redirect to auth if guest.

### GAP-M04: formatMoney adapter wiring (MEDIUM)
- **Surfaces**: merchant-console, admin-console
- **Files**: `merchant-console/src/shared/domain.ts`, `admin-console/src/shared/domain.ts`
- **Change**: Re-export `formatMoney` from shared/utils/currency.ts through both adapters.

### GAP-M05: Adapter re-export completeness (MEDIUM)
- **Surfaces**: merchant-console, admin-console
- **Files**: `merchant-console/src/shared/domain.ts`, `admin-console/src/shared/domain.ts`
- **Change**: Add re-exports for `PAYMENT_STATUSES`, `AUTH_ACTOR_TYPES` and their corresponding types.

---

## Exact Excluded Gaps

| Gap | Reason for Exclusion |
|-----|---------------------|
| GAP-C04 | Audit trail — architecturally heavy, own wave (Wave 5) |
| GAP-H07 | State machine transitions — requires new shared utility, own wave (Wave 5) |
| GAP-M02 | KPI strings — display-only, lowest urgency MEDIUM |
| GAP-M03 | Order timestamps — shared model change, Wave 5 |
| GAP-L01 | CI scan — automation, Wave 6 |
| GAP-L02 | Placeholder suffixes — live integration concern |
| GAP-L03 | Placeholder API names — live integration concern |

---

## Impacted Surfaces and Likely File Areas

| Surface | Files | Gaps |
|---------|-------|------|
| admin-console | `src/shared/auth/admin-session.ts`, `src/shared/domain.ts` | H03, M04, M05 |
| merchant-console | `src/shared/auth/merchant-session.ts`, `src/shared/domain.ts` | H04, M04, M05 |
| customer-app | `lib/features/checkout/presentation/checkout_screen.dart` or `lib/core/data/customer_runtime_controller.dart` | M07 |
| shared | None (adapters are surface-local re-exports from existing shared code) | — |
| public-website | None | — |

---

## Expected Validation Commands

```bash
# 1. All surfaces must pass
npm run typecheck --prefix merchant-console
npm run typecheck --prefix admin-console
npm run typecheck --prefix public-website
cd customer-app && flutter analyze

# 2. Optional build checks
npm run build --prefix merchant-console
npm run build --prefix admin-console
```

---

## Strict Scope Guardrails

1. **Do not create new types in shared.** Wave 4 only extends existing surface-local types and re-exports existing shared code.
2. **Do not create state machine validators.** That is Wave 5 (GAP-H07).
3. **Do not create audit log types or interceptors.** That is Wave 5 (GAP-C04).
4. **Do not modify order models in shared.** That is Wave 5 (GAP-M03).
5. **Do not convert KPI string values.** GAP-M02 is deferred.
6. **Do not rename placeholder suffixes.** GAP-L02/L03 are live-integration concerns.
7. **Do not modify governance docs** beyond WAVE_TRACKER.md.
8. **Maximum file count: 10.** If changes require more, re-scope.
9. **The guest auth gate (GAP-M07) should be a minimal check**, not a full auth flow rewrite.

---

## Multi-Surface Note

Wave 4 spans 3 surfaces (admin-console, merchant-console, customer-app). This is acceptable because:
- Each surface has 1-3 files affected
- The changes are self-contained type extensions and re-exports
- The customer-app change is a single auth gate check
- Total file count stays under 10

---

## Completion Criteria

Wave 4 is complete when ALL of the following are true:

1. **GAP-H03**: `AdminSession` includes `role: PermissionRole` and `actorType`. `readAdminRole()` returns `PermissionRole | null`.
2. **GAP-H04**: `MerchantSession` includes `actorType`.
3. **GAP-M07**: Guest users cannot proceed past checkout to order placement without authentication.
4. **GAP-M04**: `formatMoney` is re-exported through both web surface adapters.
5. **GAP-M05**: `PAYMENT_STATUSES`, `AUTH_ACTOR_TYPES`, `PaymentStatus`, `AuthActorType` are re-exported through both web surface adapters.
6. All 4 validation commands pass.
7. No shared/ contract types created or modified.

---

*Scope prepared: 2026-03-17*
*Authority: reviews/governance_enforcement_gap_plan.md*
*Prerequisites: Gap Plan Waves 1-3 (all CLOSED)*
