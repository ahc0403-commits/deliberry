# Payment VNPAY SIT Evidence Template -- 2026-05-04

Status: active
Authority: operational
Surface: customer-app, supabase, edge-functions
Domains: payment, vnpay, sit, gate-4, evidence, verification
Last updated: 2026-05-04
Last verified: 2026-05-04

## Purpose

This template defines the minimum execution evidence required before Deliberry may claim that VNPAY SIT coverage is complete for Gate 4.

It is a template, not a completed evidence record.

## Source Of Truth

- `docs/operations/payment-go-live-guardrail-record-2026-05-04.md`
- `docs/operations/payment-ipn-owned-state-transition-design-2026-05-04.md`
- `docs/operations/payment-event-persistence-design-2026-05-04.md`
- `docs/operations/payment-server-side-credentials-plan-2026-05-04.md`
- `docs/operations/payment-finance-legal-approval-record-template-2026-05-04.md`
- `docs/operations/vnpay-sandbox-readiness.md`

## Usage Rule

To support Gate 4 go-live evidence, Deliberry must create a filled record from this template and store it as a dated execution artifact, for example:

- `docs/operations/payment-vnpay-sit-evidence-YYYY-MM-DD.md`

An empty template does not count as SIT evidence.

## Required SIT Record Sections

### 1. Execution Metadata

- execution date
- environment under test
- provider endpoints used
- terminal / merchant code used
- execution owner
- observer / approver

### 2. Configuration Snapshot

The filled record must confirm:

- production credential source was server-side only
- Return URL remained display-only
- IPN handler was the only payment-state transition owner
- payment event persistence was enabled
- audit trail capture was enabled

### 3. Test Matrix

The filled record must cover at least:

- happy-path payment accepted
- duplicate IPN replay
- wrong checksum
- wrong amount
- wrong currency, if multi-currency validation applies
- unknown order
- late IPN
- already-finalized payment state

### 4. Required Observations

For each executed SIT scenario, the record must state:

- whether Return URL displayed the correct state
- whether Return URL avoided payment-state mutation
- whether IPN was received
- whether payment event persistence occurred
- whether order payment state changed or stayed unchanged as expected
- whether audit evidence was recorded
- whether manual reconciliation was required

### 5. Result Classification

Each scenario must be tagged as one of:

- pass
- fail
- blocked
- pass with condition

### 6. Artifacts

The record must link or name:

- server logs or trace references
- payment event persistence evidence
- audit-log evidence
- screenshots or textual captures of Return URL behavior where relevant
- callback payload capture strategy, if allowed

### 7. Explicit Remaining Exclusions

The record must restate that even with SIT evidence, the following remain out of scope unless separately approved:

- refund automation
- reversal automation
- chargeback lifecycle
- installment handling
- settlement automation from gateway completion
- client-side payment completion
- customer card data handling

## SIT Evidence Template

```md
# Payment VNPAY SIT Evidence -- YYYY-MM-DD

Status: active
Authority: operational

## Execution Metadata

- Execution date:
- Environment:
- Payment URL endpoint:
- Return URL endpoint:
- IPN endpoint:
- Terminal code:
- Execution owner:
- Observer / approver:

## Configuration Snapshot

- Production credentials server-side only confirmed: yes / no
- Return URL display-only confirmed: yes / no
- IPN-only payment-state ownership confirmed: yes / no
- Payment event persistence enabled: yes / no
- Audit capture enabled: yes / no

## Scenario Matrix

| Scenario | Expected result | Actual result | Status |
| --- | --- | --- | --- |
| Happy-path accepted payment | IPN persists event and moves payment state correctly |  |  |
| Duplicate IPN replay | no duplicate payment-state mutation |  |  |
| Wrong checksum | reject or no mutation |  |  |
| Wrong amount | reject or manual reconciliation |  |  |
| Wrong currency (if applicable) | reject or manual reconciliation |  |  |
| Unknown order | reject or manual reconciliation |  |  |
| Late IPN | safe handling without corruption |  |  |
| Already-finalized payment state | safe no-op or reconciliation path |  |  |

## Scenario Notes

### Happy path
- Return URL behavior:
- IPN behavior:
- Payment event evidence:
- Audit evidence:
- Final order payment state:

### Duplicate IPN
- Replay detection behavior:
- Duplicate mutation prevented:
- Event/audit outcome:

### Wrong checksum
- Rejection behavior:
- Event/audit outcome:

### Wrong amount
- Rejection or reconciliation behavior:
- Event/audit outcome:

### Wrong currency (if applicable)
- Rejection or reconciliation behavior:
- Event/audit outcome:

### Unknown order
- Rejection or reconciliation behavior:
- Event/audit outcome:

### Late IPN
- Late-callback behavior:
- Event/audit outcome:

### Already-finalized payment state
- Final-state protection behavior:
- Event/audit outcome:

## Artifacts

- Payment event persistence evidence:
- Audit evidence:
- Return URL capture:
- IPN trace/log reference:
- Additional attachments:

## Explicit Remaining Exclusions

- Refund automation remains excluded: yes / no
- Reversal automation remains excluded: yes / no
- Chargeback lifecycle remains excluded: yes / no
- Installment handling remains excluded: yes / no
- Settlement automation from gateway completion remains excluded: yes / no
- Client-side payment completion remains excluded: yes / no
- Customer card data handling remains excluded: yes / no

## Final SIT Verdict

- Overall verdict:
- Blocking failures:
- Pass-with-condition items:
- Recommended next step:
```

## Closure Rule

The Gate 4 SIT requirement is only satisfied when:

- a dated filled SIT evidence record exists
- the required scenario matrix is covered
- Return URL display-only behavior is explicitly confirmed
- IPN-only payment-state ownership is explicitly confirmed
- payment event persistence and audit evidence are attached

## What This Template Does Not Do

This template does not:

- approve live payment by itself
- replace finance/legal approval
- replace credential provisioning verification
- replace the binding guardrail revision

It only standardizes the SIT evidence artifact needed for the production payment gate.
