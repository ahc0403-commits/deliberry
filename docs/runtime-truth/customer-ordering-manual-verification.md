# Customer Ordering Manual Verification Checklist

Status: active
Authority: operational
Surface: customer-app
Domains: auth, addresses, checkout, orders
Last updated: 2026-04-28
Retrieve when:
- validating live/manual customer flow after auth or checkout changes
- confirming post-login ordering continuity with real Supabase-backed session

## Scope

This checklist validates the real customer ordering path:

Entry -> Login -> Address required gate -> Address add/select -> Home -> Store/Menu/Cart -> Checkout -> Payment method selection -> Order creation -> Cash completion or VNPAY pending status -> Order status

## Preconditions

- `customer-app` is running with valid compile-time env:
  - `SUPABASE_URL`
  - `SUPABASE_ANON_KEY`
- OAuth providers are operator-accessible:
  - Kakao or Zalo (manual browser consent required)
- Runtime backend is reachable from current environment.

## Manual Steps

### 1) Entry and Login

- Open app entry (`/#/entry` on web).
- Tap `Get Started`.
- Sign in with Kakao or Zalo.

Expected:
- Login succeeds and session is established.
- No persistent auth error banner remains on auth screen.

### 2) Address Required Gate

- Use a newly authenticated customer with no saved address.
- Let app continue from entry/auth.

Expected:
- User is redirected to `/addresses` before home.
- Home is not accessible as first signed-in destination until at least one address exists.

### 3) Address Add / Select

- Add one address via `Add`.
- Optionally set it as default.
- Tap `Continue to Home`.

Expected:
- Address appears in list.
- Default badge reflects selected default address.
- Navigation continues to home.

### 4) Home Entry and Store/Menu/Cart

- From home, open any store.
- Add menu items to cart.

Expected:
- Cart item count and subtotal update.
- Store context is preserved in cart.

### 5) Checkout Validation

- Open checkout from cart.

Expected:
- Delivery address section is populated.
- If address is missing, place-order path shows blocker and routes to `/addresses`.
- If subtotal is below minimum order, checkout CTA remains disabled and shortfall message appears.

### 6) Payment Method Selection

- In checkout, switch between available methods (`Cash`, `VNPAY Card Test`, `VNPAY Pay Test`).

Expected:
- Selection state updates visually.
- `VNPAY Card Test` is described as sandbox card flow and may send the customer to VNPAY for bank selection.
- `VNPAY Pay Test` is described as sandbox QR/mobile-banking flow.
- No live payment completion occurs inside Deliberry.

### 7) Order Creation

- Place order with signed-in Supabase-backed session.

Expected:
- Order is persisted through runtime gateway.
- If a VNPAY sandbox method was selected, the app requests a hosted VNPAY URL after order creation.
- If session is missing, user-facing blocker is shown.

### 8) Order Completion Screen

- After successful order creation, verify transition.

Expected:
- Cash checkout routes to `/orders/completion`.
- Completion screen uses `Order submitted` language and shows order id/store/items/total.
- If a VNPAY sandbox method was selected, the app does not use the completion screen as a fake payment-success state.

### 9) Order Status Continuity

- From completion, tap `Track Order Status`, or confirm direct status routing after a VNPAY sandbox launch attempt.

Expected:
- App routes to `/orders/status` for created order id.
- Status screen and order detail route are reachable.
- If a VNPAY sandbox method was selected, order status still shows payment pending language after sandbox launch or launch failure.

## PASS Criteria

- All 9 steps pass in one continuous run.
- No unexpected fallback to login screen after successful session establishment.
- Order id created in checkout is visible in completion and status flows.
- VNPAY sandbox selection does not move any tested order out of `payment_status = pending`.

## Known Manual-Only Constraints

- OAuth login is manual (Kakao/Zalo); no fully automated local E2E harness exists in repo.
- Guest path is intentionally blocked from order creation.

## Failure Logging Template

Record each failed run as:

- Step:
- Environment (local/hosted):
- Account/provider used:
- Route at failure:
- Visible error text:
- Console/network evidence:
- First exact blocker:
