# Additive Migration Disablement Evidence -- 2026-05-04

Status: active
Authority: operational
Surface: supabase, admin-console, merchant-console
Domains: rollback, additive-migrations, runtime-disablement, release-readiness
Last updated: 2026-05-04
Last verified: 2026-05-04

## Purpose

This document records the governed additive-migration disablement drill executed against the landed settlement runtime schema.

The selected target was the additive settlement schema introduced by `20260417120000_add_settlement_runtime_schema.sql`, because that schema already exists in the linked project and its intended disablement path is runtime configuration rather than destructive rollback.

## Source Of Truth

- `docs/operations/rollback-drill-prep-2026-04-29.md`
- `docs/operations/edge-function-rollback-evidence-2026-05-04.md`
- `docs/runtime-truth/settlement-runtime-truth.md`
- `docs/operations/release-gate-checklist-2026-04-29.md`
- `docs/operations/production-definition-freeze-2026-04-28.md`
- `docs/06-guardrails.md`
- `supabase/migrations/20260417120000_add_settlement_runtime_schema.sql`

## Drill Scope

Governed drill type:

- additive migration disablement through runtime configuration

Chosen additive migration surface:

- settlement runtime schema
- `public.delivery_settlements`
- `public.delivery_settlement_items`
- `public.external_sales.settlement_id`

Chosen disablement control:

- Supabase function secret `ENABLE_SETTLEMENT_RUNTIME`

Chosen reason:

- schema is already landed and additive
- merchant/admin settlement surfaces are documented as informational only
- disablement is explicitly defined in source-of-truth docs as a runtime-config path rather than a destructive schema reversal

## Commands Executed

Confirm the linked project and current secret inventory:

```bash
supabase projects list
supabase secrets list --project-ref gjcwxsezrovxcrpdnazc
```

Deploy the gated settlement caller paths from the current workspace:

```bash
supabase functions deploy generate-settlement --project-ref gjcwxsezrovxcrpdnazc --use-api
supabase functions deploy trigger-settlement --project-ref gjcwxsezrovxcrpdnazc --use-api
```

Download the deployed caller paths and shared settlement runtime module for verification:

```bash
supabase functions download generate-settlement --use-api --project-ref gjcwxsezrovxcrpdnazc
supabase functions download trigger-settlement --use-api --project-ref gjcwxsezrovxcrpdnazc
```

Enable the additive runtime temporarily through config only:

```bash
supabase secrets set ENABLE_SETTLEMENT_RUNTIME=true --project-ref gjcwxsezrovxcrpdnazc
supabase secrets list --project-ref gjcwxsezrovxcrpdnazc
```

Disable the additive runtime again without touching schema objects:

```bash
supabase secrets unset ENABLE_SETTLEMENT_RUNTIME --project-ref gjcwxsezrovxcrpdnazc --yes
supabase secrets list --project-ref gjcwxsezrovxcrpdnazc
```

## What Was Verified

### Schema Was Left In Place

The drill did not drop or alter:

- `delivery_settlements`
- `delivery_settlement_items`
- `external_sales.settlement_id`

This matches the production rollback rule for additive schema changes: disable behavior, do not destructively reverse schema during incident response.

### Disablement Control Was Exercised

Observed secret-state transition:

- before drill: `ENABLE_SETTLEMENT_RUNTIME` absent
- temporary enablement: `ENABLE_SETTLEMENT_RUNTIME` present in secret inventory
- after disablement: `ENABLE_SETTLEMENT_RUNTIME` absent again

This proves the runtime-config disablement path itself was executed against the linked production-grade project.

### Deployed Settlement Callers Now Honor The Runtime Gate

The deployed downloads for both `generate-settlement` and `trigger-settlement` now contain:

- `assertSettlementRuntimeEnabled`
- `SettlementRuntimeGuardError`
- shared settlement-core gate logic that checks `ENABLE_SETTLEMENT_RUNTIME`

Observed deployed function versions after reconciliation:

- `generate-settlement`: version `9`, updated at `2026-05-04 01:45:09 UTC`
- `trigger-settlement`: version `7`, updated at `2026-05-04 01:42:04 UTC`

This confirms that both the scheduled settlement caller and the admin-triggered settlement caller can now be disabled through runtime configuration without a schema rollback.

## Operational Notes

- No settlement generation request was executed during the drill.
- No customer payment verification or payment completion logic was touched.
- No destructive schema rollback was attempted.
- The Supabase CLI reported `Secret not found with given name` while unsetting `ENABLE_SETTLEMENT_RUNTIME`, but the follow-up secret inventory confirmed the secret had in fact been removed. Treat this as a CLI inconsistency rather than a failed disablement.

## Gate Interpretation

This pass closes the **additive migration disablement** portion of Gate 6 rollback evidence.

What is now true:

- the additive settlement schema disablement path was exercised through runtime config
- both deployed settlement callers are provably behind the same `ENABLE_SETTLEMENT_RUNTIME` gate
- schema remained in place throughout the drill
- disablement was re-applied by removing the secret after temporary enablement

## Next Follow-Through

1. Keep `ENABLE_SETTLEMENT_RUNTIME` absent until a formal settlement rollout approval exists.
2. Treat any future settlement rollout as a separate go-live decision, not as an implicit consequence of the landed additive schema.
