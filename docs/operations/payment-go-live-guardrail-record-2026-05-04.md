# Payment Go-Live Guardrail Record -- 2026-05-04

Status: active
Authority: operational
Surface: customer-app, admin-console, shared, supabase
Domains: payment, vnpay, gate-4, governance, audit, rollback
Last updated: 2026-05-04
Last verified: 2026-05-04

## Purpose

This document fixes the exact boundary between the current sandbox-ready payment posture and the future Gate 4 live-payment posture.

It is not a feature proposal. It is the governing record for what Deliberry may and may not do before live VNPAY payment verification is explicitly approved.

## Source Of Truth

- `docs/06-guardrails.md`
- `docs/operations/production-definition-freeze-2026-04-28.md`
- `docs/operations/production-roadmap-2026-04-28.md`
- `docs/operations/release-gate-checklist-2026-04-29.md`
- `docs/operations/vnpay-sandbox-readiness.md`
- `shared/api/payment.contract.json`
- `shared/validation/payment.schema.json`
- `shared/api/order.contract.json`

## Current Approved Payment Posture

Current approved behavior:

- checkout may expose payment method selection
- cash or offline-style order placement may proceed
- VNPAY sandbox card and VNPAY sandbox pay may be used for test readiness
- VNPAY sandbox return may validate checksum and display result
- VNPAY sandbox IPN may validate checksum and acknowledge callback
- sandbox-only server checks may verify recorded payment reference, amount, currency, rail, and pending-order boundaries so the placeholder flow fails closed without enabling payment completion
- order payment state remains `pending` for sandbox or future-ready card/pay paths

Current approved runtime components:

- `supabase/functions/create-vnpay-sandbox-payment`
- `supabase/functions/vnpay-sandbox-return`
- `supabase/functions/vnpay-sandbox-ipn`

## Explicitly Forbidden Until Gate 4 Opens

The following remain forbidden:

- live payment verification
- payment completion from Return URL
- payment completion from sandbox IPN
- payment completion from any client-side callback
- production VNPAY credentials in client code
- refund automation
- reversal automation
- chargeback handling
- installment handling
- settlement automation derived from gateway completion
- card data handling inside Deliberry
- UI or legal copy that implies live card/pay capture is active

## Gate 4 Opening Conditions

Gate 4 may open only after all of the following exist together:

1. A revised binding payment guardrail explicitly allows live verification.
2. A signed VNPAY production contract or equivalent written provider approval exists.
3. Finance/legal approval for live card/pay processing is recorded.
4. Production VNPAY credentials are stored server-side only.
5. A production IPN-owned payment-state transition design is approved.
6. Approved SIT evidence is recorded for the production-ready flow.
7. Rollback and incident ownership for payment-state corruption are documented.

If any one of these is missing, Deliberry remains in sandbox-or-placeholder payment mode.

## Approved Live Design Shape For Future Gate 4

When Gate 4 opens, the allowed live design shape is:

- Return URL stays display-only
- IPN is the only payment-state transition owner
- every IPN event is idempotent and auditable
- order lookup, amount, currency, provider reference, checksum, and status must all match before any state transition
- duplicate, late, malformed, or unknown callbacks must not corrupt payment state

### Non-Negotiable Ownership Rule

Allowed:

- `customer-app` launches checkout and shows result states
- server-side VNPAY integration creates payment URLs
- server-side IPN handler owns payment-state mutation
- admin and merchant surfaces show payment-state visibility only

Not allowed:

- customer-app mutating payment status directly
- Return URL mutating payment status
- merchant-console or admin-console mutating gateway-owned payment completion

## Required Production Payment Event Shape

Before live payment is allowed, the payment event record must include:

- `payment_event_id`
- `order_id`
- `provider`
- `environment`
- `event_type`
- `provider_reference`
- `amount_centavos`
- `currency`
- `checksum_valid`
- `idempotency_key`
- `received_at`
- `processed_at`
- `result`
- `failure_reason`

This may be expressed through a dedicated table, durable event log, or equivalent audited persistence boundary, but the shape must exist before live payment is claimed.

## Required Validation Matrix For IPN Ownership

The production IPN handler must reject or safely reconcile:

- wrong checksum
- wrong terminal code
- wrong order identity
- wrong amount
- wrong currency
- duplicate callback
- late callback after terminal order closure
- unknown order
- mismatched provider reference
- already-finalized payment state

## Allowed Payment-State Ownership Matrix

| Surface / Handler | May display payment state | May create payment URL | May mutate payment state |
| --- | --- | --- | --- |
| `customer-app` | yes | no | no |
| server-side checkout/payment URL creator | no | yes | no |
| Return URL handler | yes | no | no |
| IPN handler | yes | no | yes |
| `merchant-console` | yes | no | no |
| `admin-console` | yes | no | no |

## Required Audit And Rollback Conditions

Before live payment is approved, the following must also be true:

- payment-state transitions are audited
- duplicate IPN replay is harmless
- rollback path disables the payment-state mutator before any data rewrite
- payment history is append-only for incident analysis
- unresolved cases can be routed to manual reconciliation

## Communication Rules

Until Gate 4 is closed:

- product copy must say sandbox, test, future-ready, or pending where applicable
- checkout copy must not imply successful payment capture for card/pay
- public legal and marketing copy must not imply live payment processing

After Gate 4 is closed:

- copy may describe live VNPAY processing only for the exact approved path
- refund, reversal, chargeback, and installment language still remain out of scope unless separately approved

## What This Record Does Not Approve

This record does not approve:

- implementation of live payment verification
- changes to current guardrails
- settlement automation from payment completion
- finance mutation expansion beyond the already approved narrow settlement acknowledgment path

It only fixes the boundary so future payment work can be measured against one stable definition.
