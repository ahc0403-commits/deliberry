# Phase 1 Merchant Review Response Audit Evidence -- 2026-05-04

Status: active
Authority: operational
Surface: merchant-console, supabase
Domains: release-gates, merchant-reviews, audit, idempotency
Last updated: 2026-05-04
Last verified: 2026-05-04

## Purpose

This document records the governed remote evidence that closes the merchant review-response audited mutation gap identified in the Phase 1 audit-gap decisions.

## Source Of Truth

- `docs/operations/phase-1-audit-gap-decisions-2026-04-28.md`
- `docs/operations/phase-1-contract-mutation-inventory-2026-04-28.md`
- `docs/operations/phase-1-merchant-review-response-audit-e2e-2026-05-04.mjs`
- `merchant-console/src/shared/data/supabase-merchant-runtime-repository.ts`
- `shared/api/review.contract.json`

## Remote Runtime

- Supabase project ref: `gjcwxsezrovxcrpdnazc`
- Supabase URL: `https://gjcwxsezrovxcrpdnazc.supabase.co`
- Migration applied:
  - `20260504103000_add_merchant_review_response_audit_rpc.sql`

## Execution

Local governed execution command:

```bash
SUPABASE_URL="https://gjcwxsezrovxcrpdnazc.supabase.co" \
SUPABASE_ANON_KEY="$(supabase projects api-keys --project-ref gjcwxsezrovxcrpdnazc -o json | jq -r '.[] | select(.name=="anon") | .api_key')" \
SUPABASE_SERVICE_ROLE_KEY="$(supabase projects api-keys --project-ref gjcwxsezrovxcrpdnazc -o json | jq -r '.[] | select(.name=="service_role") | .api_key')" \
scripts/run-phase1-merchant-review-audit-e2e.sh
```

Execution result:

- status: `success`
- artifact summary:
  - `output/merchant-review-audit/phase1-merchant-review-audit-2026-05-04T02-34-36-827Z/summary.json`

## Verified Behavior

- owner merchant can write a response to an in-scope store review
- exactly one `merchant_review_response_updated` audit row is written for the first response
- audit row uses `resource_type = Review`
- audit row captures `before_state.response_text = null` and `after_state.response_text = <merchant reply>`
- duplicate replay with the exact same payload succeeds without writing an additional audit row
- changed payload creates a new mutation and a second audit row
- foreign merchant cannot respond to another store's review

## Interpretation

This closes the merchant review-response audited mutation gap from the Phase 1 audit-gap record.

It does **not** close the remaining Gate 5 governance-sensitive mutation areas:

- admin dispute lifecycle mutations
- admin customer-service lifecycle mutations
- finance or settlement control mutations

## Workflow Path

- workflow: `.github/workflows/phase1-merchant-review-response-audit-e2e.yml`
- runner script: `scripts/run-phase1-merchant-review-audit-e2e.sh`
- env check: `scripts/check-phase1-merchant-review-audit-env.sh`
