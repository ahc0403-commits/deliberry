# Phase 1 Remote Production Audit Evidence -- 2026-05-04

Status: active
Authority: operational
Surface: customer-app, merchant-console, admin-console, supabase
Domains: release-gates, remote-audit, runtime-safety, governed-fixtures
Last updated: 2026-05-04
Last verified: 2026-05-04

## Purpose

This document records the governed remote production-grade audit coverage that closes the remaining Gate 2 remote-audit gap for the linked Supabase project.

The goal was not to prove every future mutation workflow. The goal was to prove that the currently governed Phase 1 auth boundary and menu audit paths execute against the linked remote runtime with real credentials, real RLS, and service-path audit writes.

## Source Of Truth

- `docs/operations/phase-1-contract-mutation-inventory-2026-04-28.md`
- `docs/operations/phase-1-audit-gap-decisions-2026-04-28.md`
- `docs/operations/phase-1-auth-api-boundary-e2e-2026-04-28.mjs`
- `docs/operations/phase-1-menu-mutation-audit-e2e-2026-04-28.mjs`
- `docs/operations/phase-1-remote-production-audit-e2e-2026-05-04.mjs`
- `docs/operations/release-gate-checklist-2026-04-29.md`

## Remote Runtime

- Supabase project ref: `gjcwxsezrovxcrpdnazc`
- Supabase URL: `https://gjcwxsezrovxcrpdnazc.supabase.co`
- Credential source:
  - `supabase projects api-keys --project-ref gjcwxsezrovxcrpdnazc -o json`
  - GitHub repo secrets:
    - `REMOTE_AUDIT_SUPABASE_URL`
    - `REMOTE_AUDIT_SUPABASE_ANON_KEY`
    - `REMOTE_AUDIT_SUPABASE_SERVICE_ROLE_KEY`

## Execution

Local governed execution command:

```bash
SUPABASE_URL="https://gjcwxsezrovxcrpdnazc.supabase.co" \
SUPABASE_ANON_KEY="$(supabase projects api-keys --project-ref gjcwxsezrovxcrpdnazc -o json | jq -r '.[] | select(.name=="anon") | .api_key')" \
SUPABASE_SERVICE_ROLE_KEY="$(supabase projects api-keys --project-ref gjcwxsezrovxcrpdnazc -o json | jq -r '.[] | select(.name=="service_role") | .api_key')" \
scripts/run-phase1-remote-audit-e2e.sh
```

Execution result:

- status: `success`
- artifact summary:
  - `output/remote-audit/phase1-remote-audit-2026-05-04T01-59-32-030Z/summary.json`

## What The Remote Audit Covered

### Auth And Read Boundary

- customer fixture one can read only its own order
- customer fixture two can read only its own order
- customers cannot read each other's reviews
- customers cannot read audit logs, disputes, or support tickets
- merchant fixture can read only its own store, orders, reviews, and menu
- merchant fixture cannot read an unowned store or its menu
- merchant fixture cannot read customer actor profiles
- merchant fixture cannot mutate an unowned store through `update_store_settings_with_audit`
- admin direct client can read only its own admin profile
- admin direct client cannot directly read orders or audit logs
- admin direct client can read `delivery_settlements` through the approved settlement policy

### Governed Mutation Audit Path

- service-path menu create wrote exactly one `merchant_menu_item_created` audit row
- service-path menu availability update wrote exactly one `merchant_menu_item_availability_updated` audit row
- availability audit captured `before_state.is_available = true` and `after_state.is_available = false`

## Interpretation

This closes the specific Gate 2 gap that was still open after local verification and remote schema inspection:

- remote production-grade auth boundary execution: covered
- remote production-grade menu mutation audit execution: covered

This does **not** claim that Gate 5 governance-sensitive support, finance, or moderation mutations are fully closed. Those remain separate operational closure work.

## Workflow Path

The same governed check now has a dedicated GitHub Actions entrypoint:

- workflow: `.github/workflows/phase1-remote-production-audit-e2e.yml`
- runner script: `scripts/run-phase1-remote-audit-e2e.sh`
- env check: `scripts/check-phase1-remote-audit-env.sh`

That path exists to reproduce the same evidence without relying on a local operator shell.
