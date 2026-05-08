# Payment Guardrail Revision Draft -- 2026-05-04

Status: draft
Authority: proposed
Surface: customer-app, merchant-console, admin-console, public-website, shared, supabase
Domains: payment, guardrails, governance, vnpay, gate-4
Last updated: 2026-05-04
Last verified: 2026-05-04

## Purpose

This document is the proposed draft for revising the binding payment guardrail.

It does not revise `docs/06-guardrails.md` by itself. It records the exact change set that would be required before Deliberry may implement live VNPAY payment verification.

## Current Binding Rule

Current binding rule from `docs/06-guardrails.md`:

- Codex must never implement payment verification or payment completion logic.
- Payment method selection may exist as a placeholder only.
- Card and pay methods must remain future-ready or sandbox-only.

That rule is still active today.

## Why A Revision Would Be Needed

Live VNPAY payment go-live cannot happen without changing the binding rule, because the current rule forbids exactly the behavior Gate 4 would need:

- server-side live payment verification
- production IPN-owned payment-state mutation
- live payment event persistence

Without a formal revision, any live payment implementation would still be a guardrail violation even if the code were technically correct.

## Proposed Binding Change

### Current text to replace

From `docs/06-guardrails.md`:

- `implement payment verification or payment completion logic`

### Proposed replacement rule

Codex must never implement payment verification or payment completion logic **unless all approved Gate 4 conditions are already satisfied and the live path stays within the VNPAY IPN-owned design boundary**.

### Proposed permitted scope after revision

If and only if Gate 4 is formally opened, the following becomes allowed:

- server-side production VNPAY payment URL creation
- server-side production IPN checksum validation
- server-side production IPN-owned payment-state mutation
- durable payment event persistence
- audited order payment-state transitions derived from approved IPN events

### Proposed continued exclusions after revision

Even after the revision, the following remain forbidden unless separately approved:

- payment completion from Return URL
- payment completion from any client-side callback
- refund automation
- reversal automation
- chargeback lifecycle
- installment handling
- settlement automation from gateway completion
- customer card data handling inside Deliberry

## Preconditions For Applying The Revision

This draft must not be promoted into a binding rule unless all of the following are present:

1. signed VNPAY production contract or equivalent written provider approval
2. finance/legal approval for live card/pay processing
3. production credentials stored server-side only
4. approved IPN-owned payment-state transition design
5. approved payment event persistence design
6. rollback and incident handling for payment-state corruption
7. SIT evidence for the approved production-ready flow

If any item is missing, the draft must remain inactive.

## Required Linked Design Artifacts

This draft depends on these already-recorded design artifacts:

- `docs/operations/payment-go-live-guardrail-record-2026-05-04.md`
- `docs/operations/payment-ipn-owned-state-transition-design-2026-05-04.md`
- `docs/operations/payment-event-persistence-design-2026-05-04.md`

If the final live implementation deviates from those documents, the revision draft must be reworked before approval.

## Proposed Edits To Binding Docs

If approved, the following binding documents would need coordinated edits:

- `docs/06-guardrails.md`
- `docs/operations/production-definition-freeze-2026-04-28.md`
- `docs/operations/release-gate-checklist-2026-04-29.md`
- `docs/operations/production-roadmap-2026-04-28.md`
- `shared/api/payment.contract.json`

## Proposed Safe Language After Revision

If the revision is approved, allowed wording becomes:

- live VNPAY payment verification is approved
- Return URL remains display-only
- IPN is the only payment-state transition owner
- payment events are durable, auditable, and replay-safe

Still-disallowed wording:

- Return URL completes payment
- client verifies payment
- Deliberry stores card credentials
- refunds or reversals are available unless separately approved

## Decision Rule

This draft may move from `draft` to `active` only when a named business/legal owner and a named engineering owner both confirm that all Gate 4 prerequisites are satisfied.

Until that happens:

- `docs/06-guardrails.md` stays unchanged
- live payment verification remains forbidden
- Gate 4 first checkbox remains open

## What This Draft Does Not Do

This draft does not:

- authorize implementation today
- change the current guardrail
- close Gate 4
- approve refunds, reversals, chargebacks, or settlement automation

It only prepares the exact wording and conditions for a future binding revision.
