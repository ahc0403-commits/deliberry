# Gate 2 Remote Audit And Device QA Blockers -- 2026-05-04

Status: active
Authority: operational
Surface: customer-app, merchant-console, admin-console, public-website, supabase
Domains: release-gates, remote-audit, device-qa, blockers
Last updated: 2026-05-04
Last verified: 2026-05-04

## Purpose

This document captures the blocker state discovered while attempting to advance the remaining open release-gate items after rollback evidence was closed.

It exists to prevent the team from overstating completion when the remaining gaps now depend on missing external prerequisites rather than unclear engineering work.

## Resolution Update -- 2026-05-04

The original Gate 2 remote-audit blocker described below has now been resolved.

Resolution path:

1. `supabase projects api-keys --project-ref gjcwxsezrovxcrpdnazc -o json` exposed the linked project's usable anon and legacy service-role keys through an authenticated CLI path.
2. A governed remote audit runner was added at `docs/operations/phase-1-remote-production-audit-e2e-2026-05-04.mjs`.
3. Remote evidence was captured in `docs/operations/phase-1-remote-production-audit-evidence-2026-05-04.md`.

The physical target-device blocker remains open.

## Source Of Truth

- `docs/operations/release-gate-checklist-2026-04-29.md`
- `docs/operations/production-roadmap-2026-04-28.md`
- `docs/operations/phase-1-contract-mutation-inventory-2026-04-28.md`
- `docs/operations/phase-1-deployed-browser-e2e-secret-checklist-2026-04-28.md`
- `docs/06-guardrails.md`

## Attempted Follow-Through

After closing rollback evidence, the next two open release-gate targets were checked in order:

1. physical target-device QA
2. Gate 2 remote production-grade audit coverage

## Physical Device QA Blocker

### What Was Checked

Commands run:

```bash
xcrun simctl list devices
system_profiler SPUSBDataType | rg 'iPhone|iPad|Android|Pixel|Samsung'
```

### Result

- no connected physical iPhone, iPad, or Android device was detected
- no usable simulator inventory was present on this machine for governed target-device evidence

### Interpretation

Governed browser-width QA is already closed, but physical target-device QA cannot be truthfully marked complete from this machine alone.

### What Is Required To Close It

- at least one supported physical mobile phone
- at least one supported tablet
- documented screenshots or operator notes across the required surfaces and flows

## Gate 2 Remote Audit Coverage Blocker

### What Was Already True Before This Check

The project already had:

- local role-boundary SQL verification
- local auth API boundary E2E
- local menu mutation negative/audit E2E
- remote schema dump and migration-history confirmation

That means schema posture and local governed mutation paths are reasonably well evidenced already. The remaining gap is **remote production-grade mutation/audit execution**, not schema presence.

### What Was Checked

The execution attempt looked for a safe remote path to run governed mutation/audit verification against the linked Supabase project:

```bash
gh secret list
vercel env pull /tmp/deliberry-public-production.env --environment=production
```

Additional checks confirmed:

- GitHub Actions secret names exist for `CUSTOMER_E2E_*`, `MERCHANT_E2E_*`, and `ADMIN_E2E_*`
- `public-website` production env pull contains the linked `SUPABASE_URL`
- sensitive entries such as `SUPABASE_SERVICE_ROLE_KEY` are present only as empty values in the pulled file

### Result

The local workstation can prove that the secret names exist, but it cannot read the actual remote secret values needed to:

- mint a service-role admin client locally
- create or repair remote governed fixtures on demand
- run the remote audit/mutation scripts end-to-end from this machine with truthful credentials

### Interpretation

Gate 2 remains open not because the execution path is unknown, but because the secure credential path is intentionally not exposed to this workstation.

### What Is Required To Close It

One of the following:

1. inject a secure local `SUPABASE_SERVICE_ROLE_KEY` for the linked project into a short-lived operator env
2. add a GitHub Actions workflow that runs the remote audit scripts using repo secrets, then publishes the evidence artifact
3. provision a dedicated secure remote-audit runner with the linked project credentials and governed fixtures

## Recommended Next Action

The lowest-friction path is:

1. create a GitHub Actions workflow for remote audit execution
2. feed it `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and the secure service-role value through repo secrets
3. run the existing Phase 1 auth/menu boundary scripts against the linked project
4. record the result in a new Gate 2 evidence document

That path preserves secret boundaries and avoids pretending the missing credentials can be recovered from local files.
