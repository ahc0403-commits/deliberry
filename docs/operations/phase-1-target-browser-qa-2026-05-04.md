# Phase 1 Target Browser QA -- 2026-05-04

Status: active
Authority: operational
Surface: customer-app, merchant-console, admin-console, public-website
Domains: browser-qa, responsive-qa, release-gates, deployed-verification
Last updated: 2026-05-04
Last verified: 2026-05-04

## Purpose

This document records governed target-browser QA evidence for the currently deployed Deliberry production aliases.

It is narrower than physical device QA. This pass verifies deployed browser behavior and responsive fit across governed mobile, tablet, and desktop browser targets, but it does not claim physical iOS or Android hardware validation.

## Source Of Truth

- `docs/operations/production-definition-freeze-2026-04-28.md`
- `docs/operations/release-gate-checklist-2026-04-29.md`
- `docs/operations/phase-1-route-width-qa-2026-04-29.md`
- `docs/operations/phase-1-deployed-browser-e2e-2026-04-28.md`
- `.github/workflows/phase1-route-width-qa.yml`
- `.playwright-cli/phase1-route-width-qa.mjs`

## Governed Targets

Verified production aliases:

- customer-app: `https://deliberry-customer.vercel.app`
- merchant-console: `https://merchant-console-six.vercel.app`
- admin-console: `https://deliberry-admin.vercel.app`
- public-website: `https://go.deli-berry.com`

## Browser QA Evidence

Primary governed evidence run:

- workflow: `Phase 1 Route Width QA`
- GitHub Actions run: `25296145098`
- head SHA: `ba8782a30b9c7a5903005f541e6286dc82ac1a01`
- status: `success`
- artifact id: `6775231882`
- artifact expiry: `2026-08-02T01:06:48Z`

Artifact screenshots were downloaded and unpacked locally under:

```text
/tmp/route-width-artifact-25296145098/unpacked/phase1-route-width-2026-05-04T01-07-28-483Z
```

## Covered Widths

The governed browser pass covered:

- mobile: `390 x 844`
- tablet: `768 x 1024`
- desktop: `1366 x 900`

## Covered Routes

Public:

- `/`
- `/download`

Customer:

- `/home`
- `/#/store/.../menu`
- `/#/orders`

Merchant:

- `/demo-store/dashboard`
- `/demo-store/orders`

Admin:

- `/dashboard`
- `/orders`

## Screenshot Inventory

Public:

- `public-landing-mobile.png`
- `public-landing-tablet.png`
- `public-landing-desktop.png`
- `public-download-mobile.png`
- `public-download-tablet.png`
- `public-download-desktop.png`

Customer:

- `customer-home-mobile.png`
- `customer-home-tablet.png`
- `customer-home-desktop.png`
- `customer-store-menu-mobile.png`
- `customer-store-menu-tablet.png`
- `customer-store-menu-desktop.png`
- `customer-orders-mobile.png`
- `customer-orders-tablet.png`
- `customer-orders-desktop.png`

Merchant:

- `merchant-dashboard-mobile.png`
- `merchant-dashboard-tablet.png`
- `merchant-dashboard-desktop.png`
- `merchant-orders-mobile.png`
- `merchant-orders-tablet.png`
- `merchant-orders-desktop.png`

Admin:

- `admin-dashboard-mobile.png`
- `admin-dashboard-tablet.png`
- `admin-dashboard-desktop.png`
- `admin-orders-mobile.png`
- `admin-orders-tablet.png`
- `admin-orders-desktop.png`

## Interpretation

This evidence closes the governed target-browser portion of the release-readiness width check.

What this evidence supports:

- deployed browser layouts fit within governed mobile, tablet, and desktop targets
- merchant tablet shell overflow is closed on the real production alias
- cross-surface browser screenshots exist for the critical governed routes

What this evidence does **not** support:

- physical iPhone or Android hardware validation
- native-app touch/keyboard validation on real devices
- rollback-drill closure

## Remaining Open QA

The following are still open after this pass:

- physical device QA on real target hardware
- rollback drill evidence

Until those are attached, Gate 6 is not fully closed.
