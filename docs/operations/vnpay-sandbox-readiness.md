# VNPAY Sandbox Readiness

Status: active
Authority: operational
Surface: customer-app, backend
Domains: checkout, payment-sandbox, contract-readiness
Last updated: 2026-04-28
Last verified: 2026-05-04

## Purpose

This document defines the pre-contract VNPAY integration boundary. Deliberry may create VNPAY sandbox payment URLs and validate sandbox return/IPN signatures for test readiness. Deliberry must not treat VNPAY responses as live payment completion until the payment contract is signed and the core guardrails are explicitly revised.

## Current Scope

- Customer checkout can expose VNPAY sandbox card and VNPAY sandbox pay options.
- The card option may omit `bank_code` so VNPAY hosts the issuing-bank selection step.
- `create-vnpay-sandbox-payment` creates a signed sandbox redirect URL.
- The sandbox creator records a server-side payment-attempt snapshot with the expected sandbox amount, currency, and payment rail.
- `vnpay-sandbox-return` validates the return signature, payment reference, amount, currency, and pending-order boundary before displaying a sandbox result page.
- `vnpay-sandbox-ipn` validates the IPN checksum, payment reference, amount, currency, and pending-order boundary before acknowledging the sandbox callback.
- Duplicate sandbox callbacks are recorded and absorbed safely without mutating order payment state.
- Order payment state remains `pending`; no provider response captures, settles, refunds, or completes payment.

## Tested Sandbox Run

Last tested: 2026-04-28

Deployed endpoints:

- Payment URL creation: `https://gjcwxsezrovxcrpdnazc.supabase.co/functions/v1/create-vnpay-sandbox-payment`
- Return URL: `https://gjcwxsezrovxcrpdnazc.supabase.co/functions/v1/vnpay-sandbox-return`
- IPN URL: `https://gjcwxsezrovxcrpdnazc.supabase.co/functions/v1/vnpay-sandbox-ipn`

Result:

- VNPAY SIT portal IPN URL configuration passed for terminal `I2EPE8L4`.
- VNPAY sandbox URL creation passed for `bank_code=VNBANK`.
- VNPAY sandbox URL creation also passed with no `bank_code`, which redirects the customer to VNPAY for bank selection.
- Hosted VNPAY NCB card test passed with response code `00` and transaction status `00`.
- Return checksum validation passed and displayed the sandbox success message.
- IPN checksum validation passed with `RspCode=00`.
- Deliberry order payment state remained `pending`, as required before contract go-live.
- As of 2026-05-04, sandbox callbacks are also rejected if their reference, amount, currency, or pending-order boundary does not match the recorded sandbox payment attempt.

Additional smoke coverage completed on 2026-04-28:

- Concurrent sandbox readiness test passed for 20 synthetic customers across 5 stores with 100 order-plus-payment URL attempts.
- Card rail coverage passed for `VNBANK` and `INTCARD` with 200 concurrent order-plus-payment URL attempts total.
- Card bank-selection coverage passed with no `bank_code` over 100 concurrent order-plus-payment URL attempts, confirming that `vnp_BankCode` can be omitted and left to the VNPAY hosted flow.
- All concurrent smoke runs kept created orders at `payment_status = pending`.

Guardrail smoke completed on 2026-05-04:

- Return happy-path validation now requires checksum, reference, amount, currency, and pending-order match.
- Return duplicate replay is absorbed safely.
- IPN happy-path validation now requires checksum, reference, amount, currency, and pending-order match.
- IPN duplicate replay is absorbed safely.
- IPN wrong-amount and wrong-currency callbacks are rejected with `RspCode=99`.
- Evidence: `docs/operations/vnpay-sandbox-guardrail-smoke-2026-05-04.md`
- Automation: `.github/workflows/phase1-vnpay-sandbox-guardrail-smoke.yml`
- Reusable runner re-verified the same guardrail path on 2026-05-04 and produced `output/vnpay-guardrail-smoke/phase1-vnpay-guardrail-smoke-2026-05-04T05-56-17.237Z/summary.json`.

## Out of Scope Before Contract Go-Live

- Production VNPAY credentials.
- Live payment capture.
- Payment completion based on Return URL.
- Payment completion based on IPN.
- Refund, reversal, installment, settlement, or reconciliation logic.
- Storing card data or handling card fields inside Deliberry.

## Required Environment Variables

| Variable | Required | Notes |
|---|---:|---|
| `VNPAY_ENVIRONMENT` | yes | Must be `sandbox` for pre-contract testing. |
| `VNPAY_SANDBOX_ENABLED` | yes | Must be `true` to create sandbox URLs. |
| `VNPAY_TMN_CODE` | yes | Sandbox website code issued by VNPAY. |
| `VNPAY_HASH_SECRET` | yes | Sandbox checksum secret. Keep server-side only. |
| `VNPAY_RETURN_URL` | yes | Public URL for `vnpay-sandbox-return`. |
| `VNPAY_PAYMENT_URL` | no | Defaults to `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html`. |
| `VNPAY_SANDBOX_FIXED_AMOUNT_VND` | no | Defaults to `10000` while the app money model remains non-VND. |
| `SUPABASE_SERVICE_ROLE_KEY` | yes | Required so sandbox payment attempts and callback receipts can be recorded server-side. |

## Sandbox Test Card

Use VNPAY official sandbox test data:

- Bank: `NCB`
- Card number: `9704198526191432198`
- Name: `NGUYEN VAN A`
- Issue date: `07/15`
- OTP: `123456`

## Go-Live Checklist

The controlling Gate 4 boundary is recorded in:

- `docs/operations/payment-go-live-guardrail-record-2026-05-04.md`

1. Revise the binding payment guardrails to reintroduce VNPAY payment verification.
2. Complete finance/legal review for live card/pay processing.
3. Replace sandbox credentials with production credentials in server environment only.
4. Remove the fixed sandbox amount and settle the customer money model to VND.
5. Add a production IPN handler that performs checksum, order lookup, amount validation, idempotency, and payment state transition.
6. Keep Return URL display-only; only IPN may update payment state.
7. Run VNPAY SIT scenarios before enabling the production feature flag.
