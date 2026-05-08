# Payment Finance/Legal Approval Record Template -- 2026-05-04

Status: active
Authority: operational
Surface: customer-app, merchant-console, admin-console, public-website, shared, supabase
Domains: payment, finance, legal, approvals, gate-4, governance
Last updated: 2026-05-04
Last verified: 2026-05-04

## Purpose

This template defines the minimum approval record required before Deliberry may claim that finance/legal approval for live VNPAY processing is complete.

It is a template, not an approval by itself.

## Source Of Truth

- `docs/06-guardrails.md`
- `docs/operations/production-definition-freeze-2026-04-28.md`
- `docs/operations/payment-go-live-guardrail-record-2026-05-04.md`
- `docs/operations/payment-ipn-owned-state-transition-design-2026-05-04.md`
- `docs/operations/payment-event-persistence-design-2026-05-04.md`
- `docs/operations/payment-guardrail-revision-draft-2026-05-04.md`
- `docs/operations/payment-server-side-credentials-plan-2026-05-04.md`

## Usage Rule

To close the Gate 4 checklist item:

- `Finance/legal approval for live payment is recorded.`

Deliberry must create a filled approval record from this template and store it as a dated execution artifact, for example:

- `docs/operations/payment-finance-legal-approval-record-YYYY-MM-DD.md`

An empty template does not count as evidence.

## Required Approval Record Fields

### 1. Approval Metadata

- approval date
- requested go-live environment
- provider name
- provider scope
- document owner
- engineering owner
- finance owner
- legal owner

### 2. Approved Payment Scope

The approval record must explicitly state:

- which payment methods are approved
- which provider environment is approved
- whether approval is limited to VNPAY only
- whether approval is limited to one market or currency

It must also explicitly state what remains out of scope.

### 3. Confirmed Guardrail Inputs

The approval record must confirm:

- the binding payment guardrail has been revised or formally approved for revision
- Return URL remains display-only
- IPN is the only payment-state transition owner
- production payment event persistence design is accepted
- server-side credential storage plan is accepted

### 4. Financial Risk Acceptance

Finance must explicitly confirm:

- acceptable payment-state latency expectations
- acceptable manual reconciliation workflow
- acceptable duplicate callback handling posture
- acceptable unresolved-payment escalation path
- acceptable settlement handoff assumptions

### 5. Legal And Compliance Acceptance

Legal must explicitly confirm:

- live payment copy is acceptable
- customer-facing legal wording is acceptable
- privacy and data-handling posture is acceptable
- provider contract status is sufficient for the approved launch scope
- any jurisdictional or currency restrictions are recorded

### 6. Operational Preconditions

The record must list whether each item is:

- complete
- blocked
- accepted with condition

Required items:

- production credentials provisioned server-side only
- SIT evidence recorded
- rollback path recorded
- incident ownership recorded
- payment exception monitoring path recorded
- no-client-secret-leak verification completed

### 7. Explicit Remaining Exclusions

The approval record must explicitly restate that the following remain excluded unless separately approved:

- Return URL completion
- refund automation
- reversal automation
- chargeback lifecycle
- installment handling
- settlement automation from gateway completion
- client-side payment completion
- customer card data handling

## Approval Template

```md
# Payment Finance/Legal Approval Record -- YYYY-MM-DD

Status: active
Authority: operational

## Approval Metadata

- Approval date:
- Provider:
- Environment:
- Launch scope:
- Engineering owner:
- Finance owner:
- Legal owner:
- Document owner:

## Approved Payment Scope

- Approved payment methods:
- Approved currency / currencies:
- Approved market / markets:
- Approved provider environment:
- Explicit out-of-scope items:

## Confirmed Guardrail Inputs

- Binding payment guardrail revised: yes / no
- Return URL display-only confirmed: yes / no
- IPN-only payment-state ownership confirmed: yes / no
- Payment event persistence design accepted: yes / no
- Server-side credential plan accepted: yes / no

## Financial Risk Acceptance

- Manual reconciliation workflow accepted: yes / no
- Duplicate callback handling accepted: yes / no
- Pending/late callback posture accepted: yes / no
- Settlement handoff assumptions accepted: yes / no
- Additional finance conditions:

## Legal And Compliance Acceptance

- Provider contract status accepted: yes / no
- Customer-facing legal copy accepted: yes / no
- Privacy/data handling accepted: yes / no
- Jurisdictional restrictions:
- Additional legal conditions:

## Operational Preconditions

- Production credentials provisioned server-side only:
- SIT evidence recorded:
- Rollback path recorded:
- Incident ownership recorded:
- Monitoring/alerting path recorded:
- No-client-secret-leak verification recorded:

## Explicit Remaining Exclusions

- Return URL completion remains excluded: yes / no
- Refund automation remains excluded: yes / no
- Reversal automation remains excluded: yes / no
- Chargeback lifecycle remains excluded: yes / no
- Installment handling remains excluded: yes / no
- Settlement automation from gateway completion remains excluded: yes / no
- Client-side payment completion remains excluded: yes / no
- Customer card data handling remains excluded: yes / no

## Final Approval Decision

- Finance approval: approved / rejected / approved with conditions
- Legal approval: approved / rejected / approved with conditions
- Combined Gate 4 approval status:
- Follow-up blockers:
```

## Closure Rule

Gate 4 finance/legal approval may be marked complete only when:

- a dated filled record exists
- named finance and legal owners are listed
- all required exclusions are restated
- conditions or blockers are either closed or explicitly accepted for the launch scope

## What This Template Does Not Do

This template does not:

- revise the binding guardrail by itself
- approve live payment by itself
- replace SIT evidence
- replace credential provisioning evidence
- replace rollback evidence

It only standardizes the approval artifact needed to close the finance/legal Gate 4 checkpoint.
