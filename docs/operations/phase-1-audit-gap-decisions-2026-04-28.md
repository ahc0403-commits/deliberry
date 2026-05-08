# Phase 1 Audit Gap Decisions -- 2026-04-28

Status: active
Authority: operational
Surface: customer-app, merchant-console, admin-console, public-website, shared, supabase
Domains: audit, mutations, production-hardening, contracts
Last updated: 2026-05-04
Last verified: 2026-05-04

## Purpose

This document records the Phase 1 decisions for mutation paths that were inventoried but not yet fully production-hardened. It narrows what may be claimed production-ready before adding new schema, RPCs, or live integrations.

It does not approve live payment verification, payment completion, refund handling, payout automation, QR features, map autocomplete, or realtime tracking.

## Source Of Truth

- `docs/01-product-architecture.md`
- `docs/02-surface-ownership.md`
- `docs/04-feature-inventory.md`
- `docs/06-guardrails.md`
- `docs/operations/production-definition-freeze-2026-04-28.md`
- `docs/operations/production-roadmap-2026-04-28.md`
- `docs/operations/phase-1-contract-mutation-inventory-2026-04-28.md`
- `shared/docs/architecture-boundaries.md`

## Decision Summary

| Area | Current Runtime Truth | Phase 1 Decision | Production Claim Allowed Now |
| --- | --- | --- | --- |
| Customer order creation | Audited RPC with idempotency | Approved for continued hardening and E2E verification | Yes, after Gate 2/3 checks |
| Merchant order status | Audited RPC with idempotency | Approved for continued hardening and E2E verification | Yes, after Gate 2/5 checks |
| Merchant store/settings/profile | Audited RPC paths exist | Approved for continued hardening and E2E verification | Yes, after Gate 2/5 checks |
| Merchant menu mutation | Service-role table mutation plus explicit audit insert | Allowed as transitional production path only if server action scope and audit insert remain enforced | Conditional |
| Merchant review response | Governed audited RPC with store membership enforcement and duplicate replay behavior | Approved for continued hardening and E2E verification | Yes, after Gate 5 checks |
| Merchant promotions | Persisted store identity plus snapshot campaign data | Snapshot/read-only planning surface only | No mutation claim |
| Admin disputes | Runtime-backed read model plus audited status-transition RPC | Limited governed admin mutation path | Yes, for approved status transitions only |
| Admin customer service/support | Runtime-backed support-ticket read model plus audited status-transition RPC | Limited governed admin mutation path; public support remains contact/content oriented | Yes, for approved status transitions only |
| Finance/settlement | Runtime-backed visibility tables plus a narrow audited admin acknowledgment path | Limited governed admin mutation path for `calculated -> received` acknowledgment only | Yes, for approved acknowledgment only |
| VNPAY/card/pay | Sandbox or future-ready placeholder | Payment verification remains excluded | No live payment claim |

## Merchant Menu Mutation Decision

Decision: keep the current merchant menu mutation path as a transitional production candidate, not as the final preferred architecture.

Current evidence:

- Menu writes are server-only.
- The service scopes writes by `store_id`.
- Image uploads are constrained by size and MIME type.
- Upsert and availability writes are followed by explicit `audit_logs` inserts.
- RLS and storage policies were verified in Phase 1 inventory work.

Conditions before claiming production readiness:

- Browser or API E2E must verify a merchant cannot mutate another store's menu.
- Audit rows must be verified for create/update/availability writes.
- Service-role use must remain inside server-only merchant runtime paths.
- A future dedicated RPC remains preferred if menu mutation rules become more complex.

Local verification result:

- `docs/operations/phase-1-menu-mutation-audit-e2e-2026-04-28.mjs` verifies that the demo merchant can read own menu data, cannot read/insert/update another store's menu data through an authenticated client, and cannot read audit logs directly.
- The same script verifies that the server-equivalent service write path creates menu-item audit rows and captures before/after state for availability updates.
- This closes the local Phase 1 menu negative/audit evidence requirement. Deployed/staging execution remains required before a production release claim.

Not approved:

- Client-side menu mutation.
- Cross-store menu mutation.
- Silent menu image upload without audit context.
- Promotion, inventory, or payment-side effects from menu edits.

## Merchant Review Response Decision

Decision: merchant review response is now an approved governed production-candidate mutation path.

Current evidence:

- A dedicated `respond_to_customer_review_with_audit` RPC now exists.
- Store membership is verified inside the mutation boundary.
- `audit_logs` receives durable `merchant_review_response_updated` entries with `resource_type = Review`.
- Duplicate submission of the same payload replays the persisted response without duplicating audit rows.
- A changed payload creates a fresh mutation and a fresh audit row.
- Another store's merchant cannot respond to the review.

Evidence:

- `docs/operations/phase-1-merchant-review-response-audit-evidence-2026-05-04.md`

Current user-facing posture:

- Merchant review reply may now be described as governed and persisted.
- This does not imply any broader support, dispute, or finance lifecycle mutation approval.

## Promotion Decision

Decision: merchant promotions remain snapshot/read-only planning data for production-readiness purposes.

Reason:

- Current runtime intentionally composes persisted store identity with fixture campaign rows.
- There is no approved persisted campaign mutation, redemption, budget, eligibility, or settlement-impact path.

Required before production claim:

- Persisted promotion schema or explicit external campaign provider contract.
- Store-scoped create/update/publish mutations.
- Audit entries for campaign lifecycle changes.
- Customer eligibility and redemption rules.
- Explicit finance decision for any settlement or discount liability impact.

Current user-facing posture:

- Promotions may be shown as planning or preview data.
- Copy and docs must not imply live promotion publishing or redemption.

## Admin Dispute Decision

Decision: admin disputes are now an approved governed mutation path for audited status transitions only.

Reason:

- Admin repository already reads persisted dispute rows.
- The approved Phase 1 write scope is narrow enough to audit cleanly: start review, escalate, and resolve.
- The remote evidence runner now verifies transition validity, audit rows, idempotent replay, and denial for out-of-scope roles and actors.

Required before broader production claim:

- Keep assignment, reopen, refund, and payout-side dispute control out of scope until separately designed.
- Verify any future dispute expansion with a new audited RPC and updated evidence.

Current user-facing posture:

- Admin dispute screen may describe audited status transitions.
- It must not be described as full case ownership, assignment, refund, or payout control.

## Admin Support Decision

Decision: admin customer service/support is now an approved governed mutation path for audited status transitions only; public support remains content/contact oriented.

Reason:

- Admin support already reads persisted support tickets.
- The approved Phase 1 write scope is narrow enough to audit cleanly: start work, await reply, resolve, and close.
- The remote evidence runner verifies transition validity, audit rows, idempotent replay, and denial for out-of-scope roles and actors.

Required before broader production claim:

- Keep assignment, internal notes, customer replies, and refund/payment adjustments out of scope until separately designed.
- Decide whether public/customer support submission creates durable tickets or remains contact-only.

Current user-facing posture:

- Support routes may describe audited status transitions.
- Production wording must still distinguish support overview/contact from full case-management operations.

## Finance And Settlement Decision

Decision: finance and settlement now have a narrow governed mutation path for audited manual acknowledgment only.

Approved scope:

- `calculated -> received`
- `finance_admin` and `platform_admin` only
- audited and idempotent

Reason:

- Settlement tables already support runtime-backed visibility and reporting.
- The approved write scope is deliberately narrow enough to avoid implying payout execution or payment verification.
- The remote evidence runner verifies role enforcement, invalid-transition denial, non-admin denial, audit row creation, and duplicate replay behavior.

Required before broader production claim:

- Keep payout execution, refunds, reversals, chargebacks, disputed settlement control, and broader finance lifecycle actions out of scope until separately designed.
- Keep production wording aligned with manual acknowledgment, not automated reconciliation or money movement.
- Record any future finance control expansion through a new contract/evidence pass.

Current user-facing posture:

- Admin settlement routes may describe runtime-backed visibility plus manual received acknowledgment.
- They must not be described as payout execution, payment verification, or broad finance control.

## Contract Updates In This Pass

Updated shared contracts:

- `shared/api/promotion.contract.json`
- `shared/api/review.contract.json`
- `shared/api/support.contract.json`

The updates narrow each contract's production scope without moving UI, routing, state, or runtime orchestration into `shared`.

## Phase 1 Exit Impact

Closed:

- The audit-gap decision record now exists.
- Promotion/support/review contracts no longer overstate current production mutation support.
- Menu mutation has a conditional transitional path with local negative/audit E2E evidence.

Still open:

- Deployed/staging browser E2E against production-like Supabase.
- Any broader finance control beyond the approved settlement acknowledgment slice.
