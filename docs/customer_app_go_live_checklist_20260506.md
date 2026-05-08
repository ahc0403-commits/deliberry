# Customer App -- Go-Live Operational Verification Checklist

**Date:** 2026-05-06
**Commit:** working tree
**Surface:** customer-app
**Status:** Local RC verification checkpoint, not a hosted release signoff

---

## Build / Analyze

| Item | Status | Evidence |
|---|---|---|
| `flutter analyze` passes locally | PROVEN | Latest local analyze run passed after customer i18n/runtime polish |
| Route graph compiles with current shell/access rules | PROVEN | Customer route updates for guest/customer-flow access landed without analyzer errors |
| No disallowed shared runtime ownership introduced | PROVEN | Runtime ownership remains inside `customer-app/lib/core` and route ownership stays in `app_router.dart` |

---

## Session / Access Model

| Item | Status | Evidence |
|---|---|---|
| Guest, onboarding, otp-pending, and signed-in branches remain customer-local | PROVEN | `customer_session_controller.dart`, `app_router.dart` |
| Guest can browse core customer surfaces without being misrepresented as authenticated | PROVEN | `orders`, `notifications`, `profile/settings` now route through customer-flow instead of auth-only gating |
| Auth error states are reason-aware | PROVEN | `auth_screen.dart`, `auth_phone_screen.dart`, `auth_otp_screen.dart` now distinguish callback / provider / OTP failure states |
| Public website remains the owner of legal/support/download handoff content | PROVEN | settings surface launches public `/support`, `/privacy`, `/terms`, `/download` routes instead of duplicating content locally |

**Current limitation:** Hosted phone auth provider remains intentionally disabled. Phone/OTP code is implementation-ready but the live provider state is still a pre-launch hold, not a production claim.

---

## Runtime Truth

| Item | Status | Evidence |
|---|---|---|
| Mutable customer truth remains owned by `CustomerRuntimeController` | PROVEN | `docs/runtime-truth/customer-runtime-truth.md` |
| Signed-in runtime can hydrate persisted orders, addresses, profile identity, favorites, and settings | PROVEN | `supabase_customer_runtime_gateway.dart`, `customer_runtime_controller.dart` |
| Review truth is order-linked and shared between order detail and review route | PROVEN | persisted review cache keyed by `orderId` |
| Guest/local runtime still exists and is explicitly documented as local-only | PROVEN | runtime truth doc and UI wording remain honest |

**Not claimed:**
- real-time order tracking
- final payment verification or payment completion logic
- server-side account deletion
- server-side phone-number mutation

---

## Visual QA -- Local

| Flow | Status | Evidence |
|---|---|---|
| Home KO locale | PROVEN | Visual QA pass on running macOS app |
| Home VI locale | PROVEN | Visual QA pass on running macOS app |
| Orders empty state in VI | PROVEN | `Đơn hàng`, `Không có đơn đang xử lý`, `Xem nhà hàng` verified |
| Notifications in VI | PROVEN | unread count, date labels, and notification content verified |
| Profile reviews helper label in VI | PROVEN | `From orders` -> `Từ đơn hàng` visual verification |
| Settings KO/VI legal/support labels | PROVEN | visual verification after handoff wiring |

**Local-only caveat:** The latest visual passes were performed against local app runtime and guest/local flows. Signed-in hosted-device coverage is not yet claimed here.

---

## Product Readiness Slice

| Area | Status | Notes |
|---|---|---|
| Discovery / home / search | PROVEN | runtime/localized and visually rechecked |
| Store / menu / cart / checkout | PROVEN | payment wording remains placeholder-safe by design |
| Orders / detail / review entry | PROVEN | route-real and localized; review flow is order-linked |
| Profile / settings / addresses / notifications | PROVEN | runtime-owned and customer-local, with honest handoffs |
| Group order | PARTIAL | local-room truth exists, but no cross-device sync claim |
| Auth provider closure | PARTIAL | customer provider branches exist, but hosted phone enablement is still deferred |

---

## Release Blocking Items

| # | Blocker | Severity | Detail |
|---|---|---|---|
| 1 | Hosted phone/SMS provider still disabled | MEDIUM | Phone/OTP remains an intentional hold until final provider onboarding |
| 2 | Signed-in physical device QA not complete | MEDIUM | Local macOS verification exists; physical-device evidence is still missing |
| 3 | Payment remains placeholder-only by policy | NONE | This is an approved exclusion, not a defect |
| 4 | Group-order remains same-device runtime truth | LOW | Honest local-room flow exists; no cross-device claim is made |

---

## Manual Local Smoke Order

1. Launch the app and verify language switch works from any screen.
2. Browse home/search/store as a guest.
3. Open cart/checkout and confirm payment wording stays placeholder-safe.
4. Open orders, notifications, profile, settings, and addresses as a guest/local customer flow.
5. If using a Supabase-backed session, verify persisted orders/profile/settings hydrate after app restart.
6. Open a past order, enter review flow, save, and revisit order detail to confirm the same review truth is shown.

---

## Known Non-Claims

- Payment verification
- Map autocomplete
- QR generation/scanner
- Real-time order tracking
- Hosted device-signoff across supported mobile hardware
