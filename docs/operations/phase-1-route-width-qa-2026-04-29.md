# Phase 1 Route Width QA -- 2026-04-29

Status: active
Authority: operational
Surface: customer-app, merchant-console, admin-console, public-website
Domains: responsive-qa, route-width, browser-e2e, release-gates
Last updated: 2026-05-04
Last verified: 2026-05-04

## Purpose

This document records the Phase 1 route-width QA harness that was added after the deployed boundary browser gate went green on `main`.

Its job is narrower than the deployed boundary suite. The route-width harness checks whether the currently deployed customer, merchant, admin, and public routes stay within supported mobile, tablet, and desktop widths without hidden horizontal overflow or layout breakage.

This pass is read-only. It does not authorize payment verification, map autocomplete, QR generation/scanning, or real-time tracking.

## Source Of Truth

- `docs/operations/production-definition-freeze-2026-04-28.md`
- `docs/operations/production-roadmap-2026-04-28.md`
- `docs/operations/release-gate-checklist-2026-04-29.md`
- `.github/workflows/phase1-route-width-qa.yml`
- `.playwright-cli/phase1-route-width-qa.mjs`
- `scripts/run-phase1-route-width-qa.sh`

## Implemented QA Artifacts

The following implementation artifacts were added as part of the route-width QA phase:

- manual GitHub Actions workflow:
  `Phase 1 Route Width QA`
- local wrapper:
  `scripts/run-phase1-route-width-qa.sh`
- Playwright harness:
  `.playwright-cli/phase1-route-width-qa.mjs`

The harness captures:

- route-level width checks across small mobile, tablet, and desktop targets
- failure screenshots
- partial page text for diagnosis
- selector-level width metrics
- false-positive filtering for hidden Flutter web measurement DOM

## What Was Closed

During the initial route-width QA sequence, several non-layout blockers were found and closed:

- customer-app false-positive overflow caused by hidden Flutter web typography measurement nodes
- merchant mobile and tablet auth-flow mismatch when onboarding or store-selection steps appeared before the target console route
- admin generic-error false-positive checks on `/orders`
- artifact upload path mismatch in GitHub Actions
- missing failure instrumentation for element-level overflow diagnosis

## Latest Verified State

The latest documented route-width diagnostics were gathered from the GitHub Actions sequence that included runs:

- `25099433167`
- `25099589161`
- `25100049188`
- `25100251377`
- `25101196775`
- `25101688762`

By the latest diagnostic pass:

- customer-app route-width false positives were removed
- merchant auth-flow handling for mobile/tablet widths was stabilized
- admin route-width checks no longer failed on the previous generic-error signal
- public and customer deployed width checks were materially healthier than the first pass

## 2026-05-04 Closure Pass

After Vercel deployment limits reset, the merchant shell-overflow candidate from PR #29 was deployed to the actual governed merchant production alias:

- production alias: `https://merchant-console-six.vercel.app`
- deployment ID: `dpl_433AzgBSpZau4nKxKLDCUjHbJmV7`
- deployment URL: `https://merchant-console-ldtsl68ve-andres-projects-c63d3b09.vercel.app`

The first 2026-05-04 route-width rerun failed because the deployment was accidentally pointed at a different Vercel project alias, `deliberry-merchant.vercel.app`, whose `/login` route returned `500`.

That was corrected by deploying the patch to the actual merchant console project and rerunning the governed workflow against `merchant-console-six.vercel.app`.

Successful governed evidence:

- GitHub Actions workflow: `Phase 1 Route Width QA`
- successful run: `25296145098`
- head SHA: `ba8782a30b9c7a5903005f541e6286dc82ac1a01`
- completed at: `2026-05-04T01:09:45Z`

Result:

- the merchant tablet shell-overflow check no longer reproduced on `/demo-store/orders`
- the route-width harness completed successfully across the governed customer, merchant, admin, and public targets
- the PR #29 shell-wrapper fix is now validated on the real merchant production alias

## Previously Diagnosed Merchant Root Cause

Before the 2026-05-04 closing pass, the merchant tablet blocker had already been narrowed to shell-wrapper overflow rather than orders-table content overflow.

The measured offenders were:

- `.store-layout`
- `.store-sidebar`
- `.store-main`

The route-level content itself had already been inside bounds:

- `.merchant-surface`: `748px`
- `.merchant-hero`: `748px`
- `.merchant-summary-band`: `748px`
- `.merchant-cluster-card`: `748px`
- `.merchant-data-table`: `746px`

## Release-Gate Interpretation

This route-width QA phase now closes the browser route-width portion of the Gate 6 width requirement.

Gate 6 remains open until:

- real device or browser QA is completed across supported mobile, tablet, and desktop widths
- rollback drill evidence is attached through the separate rollback gate

## Follow-Through

1. Keep `25296145098` as the current route-width green baseline until a newer governed pass supersedes it.
2. Keep merchant `/demo-store/orders` at tablet `768px` as an explicit regression checkpoint.
3. Do not treat the overall device gate as closed until real device/browser QA is attached.
