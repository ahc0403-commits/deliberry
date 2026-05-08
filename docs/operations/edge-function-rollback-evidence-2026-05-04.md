# Edge Function Rollback Evidence -- 2026-05-04

Status: active
Authority: operational
Surface: supabase
Domains: rollback, edge-functions, release-readiness, deployment-recovery
Last updated: 2026-05-04
Last verified: 2026-05-04

## Purpose

This document records the governed Edge Function rollback evidence pass for Gate 6.

The drill used the gated settlement runtime so that a real deployed function release path could be exercised without enabling live settlement behavior or creating customer-visible state changes.

## Source Of Truth

- `docs/operations/rollback-drill-prep-2026-04-29.md`
- `docs/operations/rollback-drill-evidence-2026-05-04.md`
- `docs/operations/release-gate-checklist-2026-04-29.md`
- `docs/operations/production-definition-freeze-2026-04-28.md`
- `docs/06-guardrails.md`

## Drill Scope

Governed drill type:

- real deployed Edge Function rollback and restore

Chosen function:

- `generate-settlement`

Chosen reason:

- settlement runtime remains intentionally gated
- no live customer payment verification or payment completion behavior is involved
- the function has a clear previous source revision and a safe restore path

## Runtime Safety Before Drill

The drill was performed only after confirming the settlement runtime remained disabled in production configuration.

Evidence:

- `ENABLE_SETTLEMENT_RUNTIME` is not present in the linked Supabase project secrets list
- settlement runtime is still documented as informational/gated in current production-readiness docs
- no payment verification guardrail was changed

Linked project:

- project ref: `gjcwxsezrovxcrpdnazc`
- project name: `Deliberry`

## Function State Before Drill

Function list before rollback:

- `generate-settlement` version `4`
- updated at `2026-04-08 08:00:26 UTC`

Stable function identifier:

- function id: `ece4793c-849a-42aa-be53-022672c7e9ac`

Rollback source revision used for the drill:

- commit: `0cfcf9c199dbca6ba6f26fa503387a02af13a4f7`
- summary: `Add external sales hooks and settlement edge functions`

Restore source revision:

- commit: `57bfd1e5985d4153a2ad4978a1a78868eecdb71d`

## Commands Executed

Confirm current function versions:

```bash
supabase functions list --project-ref gjcwxsezrovxcrpdnazc
```

Create an isolated old-source worktree:

```bash
git worktree add --detach /tmp/deliberry-edge-rollback-0cfcf9c 0cfcf9c
```

Deploy the previous `generate-settlement` source revision:

```bash
supabase functions deploy generate-settlement \
  --project-ref gjcwxsezrovxcrpdnazc \
  --use-api \
  --workdir /tmp/deliberry-edge-rollback-0cfcf9c
```

Confirm the rollback deployment was active:

```bash
supabase functions list --project-ref gjcwxsezrovxcrpdnazc
```

Restore the current source revision from the active workspace:

```bash
supabase functions deploy generate-settlement \
  --project-ref gjcwxsezrovxcrpdnazc \
  --use-api
```

Confirm the restore deployment was active:

```bash
supabase functions list --project-ref gjcwxsezrovxcrpdnazc
```

Verify the restored endpoint still enforced auth:

```bash
curl --max-time 10 -i -X POST \
  https://gjcwxsezrovxcrpdnazc.supabase.co/functions/v1/generate-settlement
```

Clean up the temporary worktree:

```bash
git worktree remove /tmp/deliberry-edge-rollback-0cfcf9c --force
```

## Drill Result

### Rollback Deployment

The previous source revision was successfully deployed.

Observed version transition:

- before rollback: version `4`
- after rollback deploy: version `5`
- rollback deployment updated at `2026-05-04 01:36:01 UTC`

### Restore Deployment

The current source revision was then redeployed successfully.

Observed version transition:

- after restore deploy: version `6`
- restore deployment updated at `2026-05-04 01:36:14 UTC`

### Post-Restore Endpoint Verification

The restored endpoint returned an expected auth-boundary response:

- request: unauthenticated `POST`
- response status: `401`
- gateway error code: `UNAUTHORIZED_NO_AUTH_HEADER`
- request id: `019df0a1-50a2-7c54-820b-207e23be1a39`

This confirms that:

- the deployed function release path can be deliberately moved to a previous source revision
- the current source revision can be restored cleanly
- the restored endpoint still enforces its auth boundary after recovery

## Operational Notes

- The rollback drill was limited to a gated settlement function to avoid live payout or customer-facing side effects.
- No payment verification or payment completion logic was enabled or introduced.
- No destructive schema rollback was attempted.
- The older function revision used for rollback predates the later CORS hardening, which is why the drill restored immediately after version proof was captured.

## Gate Interpretation

This pass closes the **Edge Function rollback drill** portion of Gate 6 rollback evidence.

Rollback evidence is still not fully closed because the following remains open:

- additive migration disablement drill evidence

## Next Follow-Through

1. Record one governed additive migration disablement drill.
2. Update the release gate checklist to mark rollback evidence fully closed once that disablement evidence is attached.
