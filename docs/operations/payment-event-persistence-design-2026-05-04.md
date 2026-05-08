# Payment Event Persistence Design -- 2026-05-04

Status: active
Authority: operational
Surface: shared, supabase, edge-functions, admin-console, merchant-console, customer-app
Domains: payment, events, audit, idempotency, reconciliation, rollback
Last updated: 2026-05-04
Last verified: 2026-05-04

## Purpose

This document fixes the persistence shape required before Deliberry may claim live VNPAY payment verification.

It does not approve live payment. It defines the minimum durable event record, invariants, and read responsibilities that the future Gate 4 implementation must satisfy.

## Source Of Truth

- `docs/06-guardrails.md`
- `docs/operations/payment-go-live-guardrail-record-2026-05-04.md`
- `docs/operations/payment-ipn-owned-state-transition-design-2026-05-04.md`
- `docs/operations/production-definition-freeze-2026-04-28.md`
- `shared/api/payment.contract.json`
- `shared/validation/payment.schema.json`
- `shared/api/order.contract.json`

## Why A Dedicated Payment Event Record Is Required

Live payment verification cannot rely on the order row alone.

The order row may show the current payment state, but it is not enough for:

- duplicate callback replay handling
- forensic investigation
- late callback review
- amount mismatch investigation
- rollback after a bad handler rollout
- finance/legal review of provider events

Therefore, a durable payment event record is required before any live payment-state mutation is approved.

## Required Persistence Model

At minimum, production payment persistence must have:

1. an immutable payment event record
2. a replay-safe idempotency boundary
3. an auditable link to the affected order
4. a readable exception surface for manual reconciliation

This may be implemented as:

- a dedicated `payment_events` table plus `audit_logs`
- or an equivalent durable event table with append-only semantics

It must not be implemented as:

- order-row-only mutation with no event history
- client-maintained payment history
- mutable event records that overwrite the original callback evidence

## Required Event Fields

Every persisted payment event must include:

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

Recommended additional fields:

- `provider_status_code`
- `provider_transaction_status`
- `terminal_code`
- `raw_payload_json`
- `normalized_payload_json`
- `processing_attempt_count`
- `reconciliation_status`

## Required Invariants

The event record must satisfy these invariants:

1. **append-only**
   - received provider evidence must never be rewritten in place
2. **order-bound**
   - every event is tied to one order identity
3. **provider-bound**
   - provider reference and environment must be explicit
4. **replay-safe**
   - duplicate callbacks must resolve to the same idempotency boundary
5. **audit-linked**
   - any order payment-state mutation must be traceable back to the event that caused it
6. **incident-readable**
   - operations must be able to inspect failures without reinterpreting raw logs only

## Idempotency Model

The production payment event design must support two related but distinct concepts:

### 1. Provider-event identity

Used to determine whether the callback is a replay of the same provider event.

Minimum identity inputs:

- `provider`
- `environment`
- `provider_reference`
- `order_id`

### 2. Mutation idempotency

Used to ensure the same successful event does not mutate the order more than once.

Minimum mutation guard inputs:

- event identity
- target order id
- intended payment-state transition

The system must be able to accept a duplicate callback, persist or reference its evidence, and still avoid duplicating order-state mutation.

## Relationship To The Order Row

The order row remains the customer/merchant/admin read model for current payment state.

The payment event record becomes the source of truth for:

- how the current payment state was reached
- whether a callback was valid
- whether a callback was replayed
- whether a failure needs manual reconciliation

Rule:

- payment events explain the order state
- the order state does not replace the event history

## Relationship To Audit Logs

Payment event persistence does not replace `audit_logs`.

Expected production layering:

- payment event record stores provider-side event evidence
- `audit_logs` stores the governed business mutation trail

Example:

- payment event arrives and is persisted
- IPN handler validates event and mutates order payment state
- `audit_logs` appends a payment-state mutation row with before/after state

This two-layer design is required so incident review can distinguish:

- what the provider sent
- what Deliberry decided to do with it

## Required Failure Classes

The payment event record must represent at least these result classes:

- accepted_and_applied
- accepted_no_state_change
- rejected_checksum
- rejected_identity_mismatch
- rejected_amount_mismatch
- rejected_currency_mismatch
- rejected_duplicate
- rejected_unknown_order
- rejected_invalid_transition
- manual_reconciliation_required

The exact enum names may differ, but the distinction must exist.

## Manual Reconciliation Requirements

The persistence design must support an operator finding:

- all unresolved payment events
- all amount mismatches
- all duplicate callbacks
- all unknown-order callbacks
- all late callbacks

This may be a derived admin view, but the underlying event record must expose enough structured state for that view to exist.

## Retention And Rollback Rule

Payment event history must survive:

- UI rollback
- Edge Function rollback
- payment-state mutator disablement

Rollback must not delete or rewrite historical payment events.

If the handler is rolled back:

- new payment-state mutation may be disabled
- unresolved cases may move to manual reconciliation
- event history remains available for replay analysis

## Surface Read Responsibilities

### Customer App

May read:

- current order payment state
- user-facing pending/success/failure messaging derived from approved order state

Must not read:

- raw payment event internals directly

### Merchant Console

May read:

- current payment state
- approved reconciliation or exception indicators

Must not mutate:

- provider-owned completion

### Admin Console

May read:

- current payment state
- exception indicators
- reconciliation status
- approved provider-reference visibility

Must not become:

- the source of truth for provider event history by manual row editing

## Recommended Storage Split

Recommended future split:

- `payment_events`
  - append-only provider event evidence
- `payment_event_idempotency` or equivalent replay index
  - replay/mutation safety
- `audit_logs`
  - business-state mutation evidence

This document does not require those exact table names, but it does require those responsibilities.

## Out Of Scope

This design does not approve:

- live payment verification by itself
- refund or reversal persistence design
- chargeback event design
- settlement automation from payment completion
- customer card data storage

Those require separate governed approval.

## Gate 4 Evidence This Design Supports

This design can be cited when closing:

- IPN-owned payment-state transition design approval
- payment event persistence review
- duplicate callback safety review
- rollback review for payment-state changes

It is a design prerequisite, not a production go-live approval.
