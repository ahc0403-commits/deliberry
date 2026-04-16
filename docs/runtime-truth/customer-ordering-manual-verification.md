# Customer Ordering Manual Verification Checklist

Status: active
Authority: operational
Surface: customer-app
Domains: auth, addresses, checkout, orders
Last updated: 2026-04-08
Retrieve when:
- validating live/manual customer flow after auth or checkout changes
- confirming post-login ordering continuity with real Supabase-backed session

## Scope

This checklist validates the real customer ordering path:

Entry -> Login -> Address required gate -> Address add/select -> Home -> Store/Menu/Cart -> Checkout -> Payment method selection -> Order creation -> Order completion -> Order status

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

- In checkout, switch between available methods (`Cash`, `Card •••• 4242`).

Expected:
- Selection state updates visually.
- No real payment provider processing occurs (placeholder behavior only).

### 7) Order Creation

- Place order with signed-in Supabase-backed session.

Expected:
- Order is persisted through runtime gateway.
- If session is missing, user-facing blocker is shown (`Sign in with Kakao or Zalo...`).

### 8) Order Completion Screen

- After successful order creation, verify transition.

Expected:
- App routes to `/orders/completion`.
- Completion screen shows order id/store/items/total.

### 9) Order Status Continuity

- From completion, tap `Track Order Status`.

Expected:
- App routes to `/orders/status` for created order id.
- Status screen and order detail route are reachable.

## PASS Criteria

- All 9 steps pass in one continuous run.
- No unexpected fallback to login screen after successful session establishment.
- Order id created in checkout is visible in completion and status flows.

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
