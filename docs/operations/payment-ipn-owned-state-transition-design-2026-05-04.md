# Payment IPN-Owned State Transition Design -- 2026-05-04

Status: active
Authority: operational
Surface: customer-app, admin-console, merchant-console, supabase, edge-functions
Domains: payment, vnpay, ipn, idempotency, audit, rollback
Last updated: 2026-05-04
Last verified: 2026-05-04

## Purpose

This document fixes the future production design shape for VNPAY live payment verification before any Gate 4 implementation begins.

It does not enable live payment by itself. It records the only acceptable ownership and transition model once the binding payment guardrail is revised.

## Source Of Truth

- `docs/06-guardrails.md`
- `docs/operations/production-definition-freeze-2026-04-28.md`
- `docs/operations/payment-go-live-guardrail-record-2026-05-04.md`
- `docs/operations/vnpay-sandbox-readiness.md`
- `shared/api/order.contract.json`
- `shared/api/payment.contract.json`
- `shared/validation/payment.schema.json`

## Current State

Current payment posture is sandbox-only or placeholder-only:

- checkout can select cash, card, or digital wallet
- VNPAY sandbox URL creation is allowed
- Return URL is display-only
- sandbox IPN validates checksum and acknowledges callback only
- order payment state remains `pending`

Nothing in this document changes that current posture.

## Non-Negotiable Ownership Rule

When live payment is approved, **IPN is the only payment-state transition owner**.

Allowed:

- `customer-app` initiates checkout and shows payment-related result screens
- server-side checkout integration creates the provider payment URL
- VNPAY Return URL displays the result state only
- VNPAY IPN validates and mutates payment state
- merchant/admin surfaces display payment-state visibility only

Forbidden:

- `customer-app` mutating order payment status directly
- Return URL mutating order payment status
- merchant or admin surfaces mutating gateway-owned payment completion
- any client callback finalizing payment

## Canonical Flow

```text
Customer checkout submit
  -> create order with payment_status = pending
  -> server-side VNPAY payment URL creation
  -> customer is redirected to VNPAY hosted flow
  -> customer may return through Return URL
       -> display result only
       -> no payment-state mutation
  -> VNPAY sends IPN
       -> verify checksum, identity, amount, currency, status, replay
       -> append payment event
       -> mutate payment state if and only if validation passes
  -> customer/merchant/admin later read the resulting order payment state
```

## Production Payment State Authority

### Order-side state

Order creation remains the first persisted step.

Required order rule:

- any order created for card/pay still starts at `payment_status = pending`

### Payment event-side state

The IPN handler must persist a durable payment event before or alongside any successful order payment-state transition.

Required fields:

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

## Required Validation Sequence In The IPN Handler

The production IPN handler must validate, in order:

1. request method and endpoint eligibility
2. terminal identity / merchant code
3. checksum integrity
4. provider environment and expected configuration
5. order identity lookup
6. provider reference / transaction reference consistency
7. amount match
8. currency match
9. callback replay / idempotency state
10. response code and transaction status mapping
11. current persisted payment state

If any step fails, the handler must not mutate the order payment state.

## Required Negative Cases

The production IPN design must explicitly handle:

- wrong checksum
- wrong terminal code
- wrong order identity
- mismatched transaction reference
- wrong amount
- wrong currency
- duplicate callback
- late callback after terminal order closure
- callback for already-finalized payment state
- unknown order
- malformed payload

Allowed outcomes are:

- reject
- accept without payment-state mutation
- reconcile into manual review

Silent mutation is never allowed.

## Proposed Payment-State Transition Boundary

This document does not approve the final production enum set, but it does require:

- there is a distinct transition from `pending`
- the transition is owned only by the IPN handler
- replay of the same successful provider event is harmless
- failure and unknown outcomes do not overwrite a previously finalized successful state

Until the binding guardrail is revised, existing placeholder payment statuses remain informational only.

## Idempotency Rule

The production IPN handler must be idempotent across repeated provider callbacks.

Required properties:

- same provider callback can be retried safely
- same successful event does not create duplicate order-state mutations
- duplicate callback can still append or reference audit evidence without corrupting the order row
- replay detection key must include at least provider, provider reference, order identity, and environment

## Audit Rule

Every production payment-state mutation must record:

- actor type as system/provider-owned handler
- order identity
- provider reference
- before state
- after state
- result
- failure reason when no mutation occurs after a processed callback
- timestamps for receipt and processing

This may be stored in a dedicated payment event log plus `audit_logs`, or in an equivalent two-layer evidence design, but the mutation must remain reconstructable after incident review.

## Return URL Rule

Return URL remains display-only even after Gate 4 opens.

The Return URL may:

- validate checksum for user messaging
- show success, pending, or failed copy
- link the customer back into order status

The Return URL must not:

- mark payment complete
- mark payment failed
- overwrite a pending order
- race the IPN handler for payment-state ownership

## Merchant And Admin Surface Rule

Merchant and admin surfaces may show:

- payment method
- current payment status
- provider reference if approved for display
- reconciliation or exception indicators

They must not:

- complete payment
- reverse payment
- refund payment
- override provider-owned completion

Any later refund or reversal control requires a separate governed finance/legal design.

## Timeout And Manual Reconciliation Rule

Production design must include a path for:

- order created
- payment URL issued
- IPN delayed or missing

Required outcome:

- order remains in a recoverable pending state
- unresolved payments can be surfaced for manual reconciliation
- late IPN cannot corrupt an already manually resolved final state

## Rollback Rule

If the live IPN rollout is wrong:

- disable the payment-state mutator first
- keep Return URL display-only
- preserve event/audit history
- route unresolved cases to manual reconciliation

Rollback must not rewrite historical payment events.

## Out Of Scope For This Design

This design does not approve:

- refund automation
- reversal automation
- chargeback lifecycle
- installment handling
- settlement automation from gateway completion
- customer card data handling
- payment completion from sandbox infrastructure

## Gate 4 Evidence This Design Unlocks

Once the guardrail is revised, this design can be used as the design artifact for:

- IPN-owned payment-state transition approval
- payment event persistence review
- duplicate/late/malformed callback test planning
- rollback drill planning for payment-state changes

It is a prerequisite design record, not a go-live approval.
