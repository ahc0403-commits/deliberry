# Phase 1 Merchant Audited Mutation Evidence -- 2026-05-04

Status: active
Authority: operational
Surface: merchant-console, supabase
Domains: release-gates, merchant-mutations, audit, idempotency
Last updated: 2026-05-04
Last verified: 2026-05-04

## Purpose

This document records the governed remote evidence for the merchant mutation paths that are already approved as production candidates in Phase 1:

- `update_order_status_with_audit`
- `update_store_settings_with_audit`
- `update_store_profile_with_audit`

The goal is to prove that the linked Supabase project enforces store membership, writes audit rows, and preserves idempotency guarantees for the approved order-status mutation path.

## Source Of Truth

- `docs/operations/phase-1-contract-mutation-inventory-2026-04-28.md`
- `docs/operations/phase-1-audit-gap-decisions-2026-04-28.md`
- `docs/runtime-truth/merchant-orders-truth.md`
- `merchant-console/src/shared/data/supabase-merchant-runtime-repository.ts`
- `docs/operations/phase-1-merchant-audited-mutations-e2e-2026-05-04.mjs`

## Remote Runtime

- Supabase project ref: `gjcwxsezrovxcrpdnazc`
- Supabase URL: `https://gjcwxsezrovxcrpdnazc.supabase.co`
- Credential source:
  - `REMOTE_AUDIT_SUPABASE_URL`
  - `REMOTE_AUDIT_SUPABASE_ANON_KEY`
  - `REMOTE_AUDIT_SUPABASE_SERVICE_ROLE_KEY`

## Execution

Local governed execution command:

```bash
SUPABASE_URL="https://gjcwxsezrovxcrpdnazc.supabase.co" \
SUPABASE_ANON_KEY="$(supabase projects api-keys --project-ref gjcwxsezrovxcrpdnazc -o json | jq -r '.[] | select(.name=="anon") | .api_key')" \
SUPABASE_SERVICE_ROLE_KEY="$(supabase projects api-keys --project-ref gjcwxsezrovxcrpdnazc -o json | jq -r '.[] | select(.name=="service_role") | .api_key')" \
scripts/run-phase1-merchant-audit-e2e.sh
```

Execution result:

- status: `success`
- artifact summary:
  - `output/merchant-audit/phase1-merchant-audit-2026-05-04T02-27-06-413Z/summary.json`

## Verified Mutation Paths

### Merchant Order Status

- owner merchant can update its own store order from `pending` to `confirmed`
- exactly one `merchant_order_status_updated` audit row is written
- the audit row captures `before_state.status = pending` and `after_state.status = confirmed`
- replaying the exact same request with the same idempotency key succeeds
- replaying the same idempotency key with a different payload is rejected
- a foreign merchant cannot mutate another store's order

### Merchant Store Settings

- owner merchant can update `settings_json` for its own store
- exactly one `merchant_store_settings_updated` audit row is written
- the audit row captures `before_state.settings_json.order_notifications = true` and `after_state.settings_json.order_notifications = false`
- a foreign merchant cannot mutate another store's settings

### Merchant Store Profile

- owner merchant can update the store profile fields for its own store
- exactly one `merchant_store_profile_updated` audit row is written
- the audit row captures `before_state.name = Phase 1 Merchant Audit Store` and `after_state.name = Phase 1 Merchant Audit Store Updated`
- a foreign merchant cannot mutate another store's profile

## Interpretation

This closes the merchant-side audited mutation evidence for the Phase 1 production-candidate write paths.

It does **not** close Gate 5 by itself.

Gate 5 remains open because the following governance-sensitive mutation areas still do not have approved audited production workflows:

- admin dispute lifecycle mutations
- admin customer-service lifecycle mutations
- finance or settlement control mutations
- merchant review-response audited mutation design

## Workflow Path

The same governed check now has a dedicated GitHub Actions entrypoint:

- workflow: `.github/workflows/phase1-merchant-audited-mutations-e2e.yml`
- runner script: `scripts/run-phase1-merchant-audit-e2e.sh`
- env check: `scripts/check-phase1-merchant-audit-env.sh`

That path exists to preserve reproducibility without requiring a local shell.
