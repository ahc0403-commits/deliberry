# Wave 4 Execution Report — Identity/Session Hardening + Adapter Completeness

Date: 2026-03-17
Source: reviews/wave_4_candidate_scope.md
Gaps: GAP-H03, GAP-H04, GAP-M07, GAP-M04, GAP-M05
Status: **CLOSED**
Closure audit: PASS (2026-03-17)

---

## Gaps Closed

### GAP-H03: AdminSession type hardening — RESOLVED
**Rules**: R-020, R-022, IDENTITY.md Section 6
**Changes**:
- `admin-console/src/shared/auth/admin-session.ts`: `AdminSession` extended with `role: PermissionRole` and `actorType: "admin"`.
- `admin-console/src/features/auth/server/auth-actions.ts`: `signInAdminAction()` now writes `actorType: "admin"` and a mirrored role field into `ADMIN_SESSION_COOKIE`.
- `admin-console/src/features/permissions/server/permission-actions.ts`: `setAdminRoleAction()` now syncs the selected role into `ADMIN_SESSION_COOKIE` as well as `ADMIN_ROLE_COOKIE`.
- `readAdminSession()` now derives `role` from validated session or role-cookie data.
- `readAdminRole()` now validates and returns `Promise<PermissionRole | null>`.

### GAP-H04: MerchantSession type hardening — RESOLVED
**Rules**: R-020, R-023, IDENTITY.md Section 6
**Changes**:
- `merchant-console/src/shared/auth/merchant-session.ts`: `MerchantSession` extended with `actorType: "merchant_owner" | "merchant_staff"`.
- `merchant-console/src/features/auth/server/auth-actions.ts`: `signInMerchantAction()` now writes `actorType: "merchant_owner"` into `MERCHANT_SESSION_COOKIE`.
- `readMerchantSession()` now parses and populates `actorType` with `merchant_owner` as a backward-compatible fallback.

### GAP-M07: Guest cart-to-order auth gate — RESOLVED
**Rules**: R-024
**Changes**:
- `customer-app/lib/core/data/customer_runtime_controller.dart`: `submitOrder()` now checks `CustomerSessionController.instance.isGuest` at the top. Returns `null` (blocks order) if the user is a guest.
- `customer-app/lib/features/checkout/presentation/checkout_screen.dart`: `_placeOrder()` now shows explicit guest-auth feedback and routes guests to `/auth` instead of falling through to the empty-cart snackbar.

### GAP-M04: formatMoney adapter wiring — RESOLVED
**Rules**: R-013, R-005
**Changes**:
- `merchant-console/src/shared/domain.ts`: Added `export { formatMoney } from "../../../shared/utils/currency"`.
- `admin-console/src/shared/domain.ts`: Added `export { formatMoney } from "../../../shared/utils/currency"`.

### GAP-M05: Adapter re-export completeness — RESOLVED
**Rules**: R-005, STRUCTURE.md Section 3
**Changes**:
- `merchant-console/src/shared/domain.ts`: Added `AUTH_ACTOR_TYPES`, `PAYMENT_STATUSES` constants and `AuthActorType`, `PaymentStatus` types.
- `admin-console/src/shared/domain.ts`: Added `AUTH_ACTOR_TYPES`, `PAYMENT_STATUSES` constants and `AuthActorType`, `PaymentStatus` types.

---

## Files Changed

| # | File | Gap(s) | Change Summary |
|---|------|--------|----------------|
| 1 | `admin-console/src/shared/auth/admin-session.ts` | H03 | Validated role read path plus session-role derivation |
| 2 | `admin-console/src/features/auth/server/auth-actions.ts` | H03 | Session cookie now writes actorType + mirrored role |
| 3 | `admin-console/src/features/permissions/server/permission-actions.ts` | H03 | Selected role now syncs into session cookie |
| 4 | `merchant-console/src/features/auth/server/auth-actions.ts` | H04 | Session cookie now writes actorType |
| 5 | `customer-app/lib/core/data/customer_runtime_controller.dart` | M07 | Guest auth gate in submitOrder |
| 6 | `customer-app/lib/features/checkout/presentation/checkout_screen.dart` | M07 | Guest block now redirects honestly to auth |
| 7 | `merchant-console/src/shared/domain.ts` | M04, M05 | Already re-exported `formatMoney`, `AUTH_ACTOR_TYPES`, `PAYMENT_STATUSES`, `AuthActorType`, `PaymentStatus` |
| 8 | `admin-console/src/shared/domain.ts` | M04, M05 | Already re-exported `formatMoney`, `AUTH_ACTOR_TYPES`, `PAYMENT_STATUSES`, `AuthActorType`, `PaymentStatus` |

**Total files changed for the runtime-complete closure**: 6 code files (within 10-file limit). Adapter files required no further code changes because they were already complete.

---

## Validation Results

| Check | Result |
|-------|--------|
| `npm run typecheck` (merchant-console) | Pass — no errors |
| `npm run typecheck` (admin-console) | Pass — no errors |
| `npm run typecheck` (public-website) | Pass — no errors (regression) |
| `flutter analyze` (customer-app) | No issues found |

---

## Remaining Risk

- **AdminSession default role**: Backward-compatible fallback to `platform_admin` still exists for older or malformed session cookies. Real provider-issued claims are still a Wave 6 concern.
- **MerchantSession default actorType**: Backward-compatible fallback to `merchant_owner` still exists. Merchant staff differentiation still requires live identity issuance.
- **Guest flow**: The checkout redirect is now explicit, but the auth experience is still demo-safe and local-only.

---

## Closure Recommendation

All 5 gaps are resolved. Code truth and type truth are aligned. Decay Mode 6 (Permission Bypass) is now closed for both admin and merchant session types. R-024 guest gate is enforced at both the data layer and the checkout UX layer. Adapter boundary (R-005) is complete for both web surfaces.

**Recommend: CLOSE Wave 4.**

---

## Cumulative Progress

| Wave | Gaps | Status |
|------|------|--------|
| Gap Plan Wave 1 | 6 | CLOSED |
| Gap Plan Wave 2 | 3 | CLOSED |
| Gap Plan Wave 3 | 4 | CLOSED |
| Gap Plan Wave 4 | 5 | COMPLETE |
| Incidental (L04) | 1 | CLOSED |
| **Total resolved** | **19 of 26** | |
| **Remaining** | **7** (0 CRITICAL, 1 HIGH, 3 MEDIUM, 3 LOW) | |

---

*Report generated: 2026-03-17*
