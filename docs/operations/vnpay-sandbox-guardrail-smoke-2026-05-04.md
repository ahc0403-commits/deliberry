# VNPAY Sandbox Guardrail Smoke -- 2026-05-04

Status: active
Authority: operational
Surface: customer-app, supabase
Domains: payment, vnpay, sandbox, guardrails, callback-validation
Last updated: 2026-05-04
Last verified: 2026-05-04

## Purpose

Record the post-hardening sandbox smoke that proves Deliberry now fails closed on sandbox callbacks without enabling payment completion.

## Source Of Truth

- `/Users/andremacmini/Deliberry/docs/06-guardrails.md`
- [/Users/andremacmini/Deliberry/docs/operations/vnpay-sandbox-readiness.md](/Users/andremacmini/Deliberry/docs/operations/vnpay-sandbox-readiness.md)
- [/Users/andremacmini/Deliberry/docs/operations/payment-go-live-guardrail-record-2026-05-04.md](/Users/andremacmini/Deliberry/docs/operations/payment-go-live-guardrail-record-2026-05-04.md)

## Scope

This smoke verifies the current sandbox-only boundary:

- server-side payment-attempt snapshot exists before callback validation
- Return URL remains display-only
- IPN does not mutate `orders.payment_status`
- duplicate callbacks are safely absorbed
- amount and currency mismatches are rejected

## Fixture

- Order: `4be20f13-95ea-4668-9ff2-e01c11024b3c`
- Payment reference: `vnpay-test-4be20f13-95ea-4668-9ff2-e01c11024b3c-1777341023151`
- Expected amount: `10000 VND`
- Expected currency: `VND`
- Expected rail: `card`

The sandbox payment-attempt record was seeded server-side for this guarded smoke, then removed operationally after verification.

## Results

### 1. Return happy path

- Response: `Sandbox return accepted`
- Meaning: checksum, payment reference, amount, currency, and pending-order boundary matched the recorded payment attempt
- State effect: none

### 2. Return duplicate replay

- Response: `Sandbox return already recorded`
- Meaning: duplicate return callback was identified and absorbed safely
- State effect: none

### 3. IPN happy path

- Response: `RspCode=00`
- Message: `Sandbox IPN checksum and server-side sandbox checks passed. Order state updates remain disabled before contract go-live.`
- State effect: none

### 4. IPN duplicate replay

- Response: `RspCode=00`
- Message: `Sandbox IPN duplicate acknowledged safely. Order state updates remain disabled before contract go-live.`
- State effect: none

### 5. IPN wrong amount

- Response: `RspCode=99`
- Message: `Sandbox payment amount mismatch`

### 6. IPN wrong currency

- Response: `RspCode=99`
- Message: `Sandbox payment currency mismatch`

## Evidence

- Local smoke artifact: [/Users/andremacmini/Deliberry/tmp/vnpay-guardrail-callback-smoke-2026-05-04.json](/Users/andremacmini/Deliberry/tmp/vnpay-guardrail-callback-smoke-2026-05-04.json)
- Reusable runner artifact: [/Users/andremacmini/Deliberry/output/vnpay-guardrail-smoke/phase1-vnpay-guardrail-smoke-2026-05-04T05-56-17.237Z/summary.json](/Users/andremacmini/Deliberry/output/vnpay-guardrail-smoke/phase1-vnpay-guardrail-smoke-2026-05-04T05-56-17.237Z/summary.json)

## Automation Status

- GitHub repository secret `VNPAY_SANDBOX_HASH_SECRET` is configured.
- The reusable workflow file exists at `.github/workflows/phase1-vnpay-sandbox-guardrail-smoke.yml`.
- As of 2026-05-04, `workflow_dispatch` still cannot be triggered from GitHub until that workflow file is present on the default branch. The same smoke was re-run locally through the reusable runner and produced the artifact above.

## Verdict

Sandbox callback handling is now materially safer than the earlier checksum-only posture:

- callbacks without a recorded payment attempt are rejected
- callbacks with wrong amount or currency are rejected
- duplicate callbacks are safe
- order payment state remains `pending`

This does **not** approve live payment verification or payment completion. It only proves the sandbox placeholder path now fails closed more aggressively.
