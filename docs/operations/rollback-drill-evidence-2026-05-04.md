# Rollback Drill Evidence -- 2026-05-04

Status: active
Authority: operational
Surface: public-website, customer-app, merchant-console, admin-console
Domains: rollback, release-readiness, deployment-recovery, qa-evidence
Last updated: 2026-05-04
Last verified: 2026-05-04

## Purpose

This document records the first governed rollback drill evidence pass after the rollback-prep inventory was completed.

This pass executed a real production-alias UI rollback drill on the public website, restored the original production deployment, and then re-ran the governed deployed boundary browser suite to confirm recovery.

This document does **not** claim that Edge Function rollback evidence or additive migration disablement evidence is fully closed yet.

## Source Of Truth

- `docs/operations/rollback-drill-prep-2026-04-29.md`
- `docs/operations/release-gate-checklist-2026-04-29.md`
- `docs/operations/phase-1-deployed-browser-e2e-2026-04-28.md`
- `docs/operations/phase-1-target-browser-qa-2026-05-04.md`
- `docs/operations/production-definition-freeze-2026-04-28.md`

## Drill Scope

Governed drill type:

- real production alias UI rollback

Chosen surface:

- `public-website`

Chosen reason:

- lowest customer-impact surface among the four deployed web aliases
- still exercises a real Vercel production alias flip and recovery path
- allows full deployed browser evidence rerun after restore

## Production Alias State Before Drill

Alias inspected:

- `https://go.deli-berry.com`

Resolved production deployment before drill:

- deployment id: `dpl_5JMGcCEUcj51UX7BkPmqdNsfitGX`
- deployment url: `https://deliberry-3z7lhlmd9-andres-projects-c63d3b09.vercel.app`
- commit SHA recorded by Vercel: `15bea7c837bd1812e78c8857f3d12e511ab46d40`

Previously prepared rollback candidate used for the drill:

- deployment id: `dpl_2hKQgQoUnaKjsqUF1XXZcEBPostg`
- deployment url: `https://deliberry-gjlhwn8tw-andres-projects-c63d3b09.vercel.app`
- commit SHA recorded by Vercel: `4285062198704bbc0086cdf603e54a97503b315d`

## Commands Executed

Inspect current production alias:

```bash
vercel inspect go.deli-berry.com --scope andres-projects-c63d3b09
```

Promote the rollback candidate to production:

```bash
vercel promote dpl_2hKQgQoUnaKjsqUF1XXZcEBPostg --scope andres-projects-c63d3b09 --yes
```

Verify the alias resolved to the rollback candidate:

```bash
vercel inspect go.deli-berry.com --scope andres-projects-c63d3b09
curl -I -L https://go.deli-berry.com
```

Restore the original production deployment:

```bash
vercel promote dpl_5JMGcCEUcj51UX7BkPmqdNsfitGX --scope andres-projects-c63d3b09 --yes
```

Verify the alias resolved back to the original production deployment:

```bash
vercel inspect go.deli-berry.com --scope andres-projects-c63d3b09
curl -I -L https://go.deli-berry.com
```

Re-run the full deployed boundary suite after restore:

```bash
gh workflow run "Phase 1 Deployed Boundary E2E" --ref main
gh run watch 25296664792 --interval 10
```

## Drill Result

### Rollback Flip

The public production alias was successfully moved from:

- `dpl_5JMGcCEUcj51UX7BkPmqdNsfitGX`

to the rollback candidate:

- `dpl_2hKQgQoUnaKjsqUF1XXZcEBPostg`

The alias inspection immediately resolved `go.deli-berry.com` to the rollback candidate after the promote command completed.

### Restore

The alias was then successfully restored back to:

- `dpl_5JMGcCEUcj51UX7BkPmqdNsfitGX`

The post-restore alias inspection again resolved `go.deli-berry.com` to the original deployment.

### Recovery Verification

The full governed deployed boundary suite was re-run after restore:

- workflow: `Phase 1 Deployed Boundary E2E`
- run: `25296664792`
- conclusion: `success`
- head SHA: `ba8782a30b9c7a5903005f541e6286dc82ac1a01`
- artifact id: `6775388853`
- artifact expiry: `2026-08-02T01:28:23Z`

This confirms that:

- the public alias could be deliberately moved to an older production deployment
- the original deployment could be restored cleanly
- the restored cross-surface production alias set still passed the governed deployed browser gate

## Operational Notes

- During this drill, no database rollback was attempted.
- No live payment verification behavior was introduced.
- The drill was kept on `public-website` to minimize operational risk while still exercising a real production alias recovery path.

## Gate Interpretation

This pass closes the **UI rollback drill** portion of the rollback evidence requirement.

It does **not** fully close rollback evidence for Gate 6 because the following still remain:

- Edge Function rollback drill evidence
- additive migration disablement drill evidence

## Next Follow-Through

1. Record one governed Edge Function rollback or explicit simulated rollback against a deployed function release path.
2. Record one governed additive migration disablement drill.
3. After those are attached, update the release gate checklist to close rollback evidence fully.
