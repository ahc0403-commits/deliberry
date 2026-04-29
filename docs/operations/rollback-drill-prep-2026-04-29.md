# Rollback Drill Prep -- 2026-04-29

Status: active
Authority: operational
Surface: customer-app, merchant-console, admin-console, public-website, supabase
Domains: rollback, deployment-recovery, release-readiness, incident-response
Last updated: 2026-04-29
Last verified: 2026-04-29

## Purpose

This document captures the current rollback candidates, rollback commands, and scope boundaries needed to perform a governed rollback drill.

It is deliberately narrower than a completed rollback-drill evidence report. It records the current production rollback inventory and the exact actions operators would take, but it does not claim that production traffic was already switched during this preparation pass.

## Source Of Truth

- `docs/operations/production-definition-freeze-2026-04-28.md`
- `docs/operations/release-gate-checklist-2026-04-29.md`
- `docs/operations/phase-1-deployed-browser-e2e-2026-04-28.md`
- Vercel CLI rollback documentation: [Rollback production deployments](https://vercel.com/docs/cli)
- Vercel deployment rollback documentation: [Rollback a production deployment](https://vercel.com/docs/deployments/rollback-production-deployment)

## What Was Verified In This Prep Pass

On 2026-04-29, the current Vercel project inventory and recent deployment history were queried for the four deployed web surfaces:

- `deliberry-customer`
- `deliberry-merchant`
- `deliberry-admin`
- `deliberry`

The prep pass confirmed:

- the active Vercel team and project IDs are known
- recent READY production deployments exist for all four surfaces
- at least one prior production deployment remains available as a rollback candidate for each surface
- the official rollback paths are available through `vercel rollback`, `vercel rollback <deployment-id-or-url>`, and `vercel promote <deployment-url>`

This prep pass did **not** flip production aliases or trigger a real rollback event.

## Current Project Inventory

Vercel team:

- Team name: `Andre's projects`
- Team slug: `andres-projects-c63d3b09`
- Team ID: `team_4AfACJKDlP09zRqoJKce3Tib`

Relevant project IDs:

- customer-app: `prj_gtuhM19NyRia9DGi0I2GPBrjNCAS`
- merchant-console: `prj_3gkw4FSqDmIJrwWjtFR7bg19du87`
- admin-console: `prj_Wg5kc4MI6GFGhpLzLJ9mAzJRekRo`
- public-website: `prj_5xVfnaKCEHMhVfDL5mur7OqZLjiM`

## Rollback Candidates Observed On 2026-04-29

These are the most recent READY production rollback candidates observed in Vercel deployment history during the prep pass.

### customer-app

- Project: `deliberry-customer`
- Candidate deployment ID: `dpl_4p9jz3EsKmvwgKNHMDvR64bdjHXW`
- Candidate deployment URL: `deliberry-customer-3khwqhfuu-andres-projects-c63d3b09.vercel.app`
- Commit SHA recorded by Vercel: `15bea7c837bd1812e78c8857f3d12e511ab46d40`
- Vercel marked this deployment as a rollback candidate

### merchant-console

- Project: `deliberry-merchant`
- Candidate deployment ID: `dpl_9p9Ht7LbwvxZ16AqkjXtie1UVkTe`
- Candidate deployment URL: `deliberry-merchant-nzzqo15y6-andres-projects-c63d3b09.vercel.app`
- Commit SHA recorded by Vercel: `15bea7c837bd1812e78c8857f3d12e511ab46d40`
- Vercel marked this deployment as a rollback candidate

### admin-console

- Project: `deliberry-admin`
- Candidate deployment ID: `dpl_2KhoSh7ExVoKi4qtFk2La2tPyr42`
- Candidate deployment URL: `deliberry-admin-jb7iyghh3-andres-projects-c63d3b09.vercel.app`
- Commit SHA recorded by Vercel: `15bea7c837bd1812e78c8857f3d12e511ab46d40`
- Vercel marked this deployment as a rollback candidate

### public-website

- Project: `deliberry`
- Candidate deployment ID: `dpl_5JMGcCEUcj51UX7BkPmqdNsfitGX`
- Candidate deployment URL: `deliberry-3z7lhlmd9-andres-projects-c63d3b09.vercel.app`
- Commit SHA recorded by Vercel: `15bea7c837bd1812e78c8857f3d12e511ab46d40`
- Vercel marked this deployment as a rollback candidate

## UI Rollback Procedure

For a real production UI rollback, operators should use one of the official Vercel paths:

```bash
vercel rollback
vercel rollback <deployment-id-or-url>
vercel promote <deployment-url>
```

Recommended drill sequence:

1. Confirm the currently serving production alias and affected surface.
2. Confirm the exact target rollback candidate deployment ID and URL.
3. Capture the incident reason and current deployed browser gate run.
4. Execute `vercel rollback <deployment-id-or-url>` or `vercel promote <deployment-url>`.
5. Re-run the deployed browser boundary workflow against the protected production aliases.
6. Record the before/after deployment IDs, alias targets, incident reason, and verification run number.

## Edge Function Rollback Scope

Current Edge Functions in repo scope:

- `customer-zalo-auth-exchange`
- `generate-settlement`
- `trigger-settlement`

Production-definition rule:

- rollback evidence must preserve logs
- function callers should be disabled first where possible
- previous function version should be redeployed rather than rewriting business history

Prepared drill steps:

1. Identify the affected function and current caller surfaces.
2. Disable new callers through UI/runtime config where applicable.
3. Redeploy the previous known-good function version.
4. Preserve request/response logs for reconciliation.
5. Add compensating audit notes if any partial business effect already occurred.

This prep pass did not redeploy or disable any live Edge Function.

## Additive Migration Disablement Scope

The current production definition does **not** approve destructive rollback during an active incident.

Prepared drill steps for additive schema rollback:

1. Identify the migration or additive runtime path that introduced the issue.
2. Disable new reads and writes through feature flags, endpoint guards, or caller-level runtime config.
3. Leave added columns, tables, policies, indexes, and functions in place during the incident.
4. Record the disablement decision in the incident log.
5. Only after the incident is closed, decide whether a reviewed cleanup migration is necessary.

This prep pass did not disable any migration-backed behavior in production.

## Release-Gate Interpretation

This document advances rollback readiness, but it does **not** close Gate 6 rollback evidence yet.

Gate 6 should remain open until:

- one governed UI rollback drill is executed against a real production alias target
- one governed Edge Function rollback drill is executed or explicitly simulated against a deployed function release path
- one additive migration disablement drill is executed and logged
- the resulting evidence document records timestamps, operator, target deployment/function/migration, and post-rollback verification results
