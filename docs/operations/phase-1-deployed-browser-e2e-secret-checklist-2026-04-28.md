# Phase 1 Deployed Browser E2E Secret Checklist -- 2026-04-28

Status: active
Authority: operational
Surface: customer-app, merchant-console, admin-console, public-website
Domains: github-actions, vercel-protection, e2e-secrets, release-operations
Last updated: 2026-04-29
Last verified: 2026-04-29

## Purpose

This checklist defines the minimum environment required to run deployed browser E2E without making false readiness claims.

It exists to keep deployment protection, browser automation, and optional authenticated smoke credentials aligned across local runs and GitHub Actions.

## Source Of Truth

- `docs/operations/phase-1-deployed-browser-e2e-2026-04-28.md`
- `.github/workflows/phase1-deployed-boundary-e2e.yml`
- `scripts/check-phase1-deployed-boundary-env.sh`
- `scripts/run-phase1-deployed-boundary-e2e.sh`
- `.playwright-cli/phase1-deployed-boundary-e2e.mjs`

## Required Inputs

Deployment URL inputs:

- `CUSTOMER_URL`
- `MERCHANT_URL`
- `ADMIN_URL`
- `PUBLIC_URL`

If these are not provided, the harness falls back to the current stable production aliases:

- `https://deliberry-customer.vercel.app`
- `https://merchant-console-six.vercel.app`
- `https://deliberry-admin.vercel.app`
- `https://go.deli-berry.com`

Override them when validating staging or a newer deployment.

Required protection bypass for non-skip runs:

- either `VERCEL_AUTOMATION_BYPASS_SECRET`
- or one or more surface-specific secrets:
  `CUSTOMER_VERCEL_AUTOMATION_BYPASS_SECRET`
  `MERCHANT_VERCEL_AUTOMATION_BYPASS_SECRET`
  `ADMIN_VERCEL_AUTOMATION_BYPASS_SECRET`
  `PUBLIC_VERCEL_AUTOMATION_BYPASS_SECRET`

Optional authenticated smoke credentials:

- `CUSTOMER_EMAIL` or `CUSTOMER_E2E_EMAIL`
- `CUSTOMER_PASSWORD` or `CUSTOMER_E2E_PASSWORD`
- `MERCHANT_EMAIL` or `MERCHANT_E2E_EMAIL`
- `MERCHANT_PASSWORD` or `MERCHANT_E2E_PASSWORD`
- `ADMIN_EMAIL` or `ADMIN_E2E_EMAIL`
- `ADMIN_PASSWORD` or `ADMIN_E2E_PASSWORD`

## Execution Modes

Protection-skip exploratory mode:

- set `ALLOW_DEPLOYMENT_PROTECTION_SKIP=1`
- use this when you want artifact capture and public/admin anonymous coverage even if customer-app or merchant-console are still protected

Production-like verification mode:

- do not set `ALLOW_DEPLOYMENT_PROTECTION_SKIP`
- provide a global or surface-specific Vercel automation bypass secret
- use this mode for release-gate evidence

## What The Guard Scripts Enforce

`scripts/check-phase1-deployed-boundary-env.sh` fails when:

- no automation bypass secret is present and protection-skip mode is not enabled

`scripts/run-phase1-deployed-boundary-e2e.sh` always runs the environment check first, then launches the Playwright harness.

## GitHub Actions Repository Secrets

Recommended minimum repository secrets for a full deployed run:

- `CUSTOMER_URL`
- `MERCHANT_URL`
- `ADMIN_URL`
- `PUBLIC_URL`
- one of:
  `VERCEL_AUTOMATION_BYPASS_SECRET`
  or the four surface-specific bypass secrets listed below

Recommended additional secrets when per-surface control is needed:

- `CUSTOMER_VERCEL_AUTOMATION_BYPASS_SECRET`
- `MERCHANT_VERCEL_AUTOMATION_BYPASS_SECRET`
- `ADMIN_VERCEL_AUTOMATION_BYPASS_SECRET`
- `PUBLIC_VERCEL_AUTOMATION_BYPASS_SECRET`

Optional authenticated smoke secrets:

- `CUSTOMER_E2E_EMAIL`
- `CUSTOMER_E2E_PASSWORD`
- `MERCHANT_E2E_EMAIL`
- `MERCHANT_E2E_PASSWORD`
- `ADMIN_E2E_EMAIL`
- `ADMIN_E2E_PASSWORD`

Current operational note:

- the Deliberry deployed E2E runner now uses surface-specific bypass secrets in GitHub Actions because the four Vercel projects no longer share a guaranteed common bypass key.
- the current green release-evidence baseline is GitHub Actions run `25096403811` on `main`, executed without `ALLOW_DEPLOYMENT_PROTECTION_SKIP`

## Local Dry Run

```bash
CUSTOMER_URL=https://example-customer.vercel.app \
MERCHANT_URL=https://example-merchant.vercel.app \
ADMIN_URL=https://example-admin.vercel.app \
PUBLIC_URL=https://example-public.vercel.app \
ALLOW_DEPLOYMENT_PROTECTION_SKIP=1 \
scripts/check-phase1-deployed-boundary-env.sh
```

Expected result:

- effective URL resolution passes
- bypass secret is allowed to be absent because skip mode is enabled

## Release-Gate Rule

Do not mark deployed customer-app or merchant-console browser E2E as complete from a skip-mode run.

Skip mode is evidence of current protection posture and partial deployed availability only. Release-gate closure requires a non-skip run with Vercel automation bypass configured.
