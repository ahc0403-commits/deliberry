# Physical Target-Device QA Readiness Packet -- 2026-05-06

Status: active
Authority: operational
Surface: customer-app, merchant-console, admin-console, public-website
Domains: device-qa, gate-6, hardware-validation, readiness
Last updated: 2026-05-06
Last verified: 2026-05-06

## Purpose

Capture the exact current blocker state for Gate 6 physical target-device QA, plus the ready-to-run deployment targets, hosted evidence, and execution order needed once governed hardware is available.

This packet does not close physical device QA. It removes ambiguity so the next operator can begin immediately on real hardware.

## Source Of Truth

- `docs/operations/physical-target-device-qa-execution-plan-2026-05-04.md`
- `docs/operations/physical-target-device-qa-evidence-template-2026-05-04.md`
- `docs/operations/release-gate-checklist-2026-04-29.md`
- `docs/operations/hosted-parity-smoke-findings-2026-05-06.md`
- `docs/operations/local-rc-release-hardening-summary-2026-05-06.md`
- `docs/operations/phase-1-target-browser-qa-2026-05-04.md`
- `docs/06-guardrails.md`

## Current Reality On This Workstation

Physical device QA remains open because no governed phone or tablet hardware is attached to this machine.

Verification performed on 2026-05-06:

- `system_profiler SPUSBDataType | rg 'iPhone|iPad|Android|Pixel|Samsung'`
  - result: no matching physical mobile/tablet device detected
- `adb devices -l`
  - result: no Android device attached
- `xcrun simctl list devices`
  - result: no usable simulator inventory available from this workstation snapshot

Meaning:

- hosted/browser parity is no longer the main blocker
- real hardware evidence is still missing
- Gate 6 must remain open until phone, tablet, and desktop operator evidence are recorded in a filled dated artifact

## Ready Deployment Targets

Use these targets for the next governed device pass unless a newer release supersedes them first.

- Public website:
  - `https://go.deli-berry.com`
- Merchant console:
  - `https://merchant-console-six.vercel.app`
- Admin console:
  - use the current protected production alias resolved through the governed browser harness
- Customer app:
  - use the current hosted customer alias resolved through the governed browser harness or the release-gate secrets baseline

## Latest Hosted Evidence

- Public anonymous parity: PASS
- Merchant anonymous login parity: PASS
- Refreshed governed deployed boundary workflow: PASS
  - workflow: `Phase 1 Deployed Boundary E2E`
  - run id: `25420411267`
  - run URL: `https://github.com/ahc0403-commits/deliberry/actions/runs/25420411267`

This means the device operator should treat hosted route drift as low risk relative to the remaining real-hardware gate.

## Minimum Hardware Set Still Required

- 1 physical phone in the primary target market
- 1 physical tablet in the primary target market
- 1 desktop or laptop operator environment for web-console validation

Recommended governed spread:

- 1 iPhone
- 1 Android phone
- 1 iPad or Android tablet
- 1 macOS or Windows desktop browser environment

## Execution Order For The Next Operator

1. Confirm the deployed aliases above are still the current production baseline.
2. Confirm no newer hosted-boundary run has superseded `25420411267`.
3. Prepare a dated filled artifact from:
   - `docs/operations/physical-target-device-qa-evidence-template-2026-05-04.md`
4. Record device metadata first.
5. Run customer app checks on the phone:
   - entry / auth handoff
   - home
   - store / menu
   - cart
   - checkout
   - orders list
   - order detail
   - order status
6. Run customer app checks on the tablet.
7. Run merchant console checks on tablet or desktop-class hardware:
   - login
   - dashboard
   - orders
   - menu
   - settlement
8. Run admin console checks on desktop-class hardware:
   - login
   - dashboard
   - orders
   - disputes
   - customer-service
   - settlements / finance
9. Run public website checks on phone and desktop:
   - landing
   - merchant
   - support
   - download
   - privacy
   - terms
   - refund-policy
10. Attach screenshots and explicit pass/fail notes.

## Stop Conditions To Preserve

Stop immediately and record a blocker if any of the following occur:

- customer checkout CTA is unreachable
- merchant order actions are obscured
- admin role-scoped navigation breaks
- public legal copy is unreadable
- any payment copy implies live capture or verification

## Required Evidence Output

The next completed artifact must include:

- device metadata
- tested URLs/routes
- screenshots for phone / tablet / desktop
- short operator notes
- explicit pass/fail/blocked results
- blocking findings and pass-with-condition findings

## Current Gate 6 Truth

As of 2026-05-06:

- hosted parity: sufficiently refreshed
- browser-width evidence: closed
- physical target-device evidence: still open

Therefore:

- the repository is stronger than local-only RC now
- it is still not honest to mark physical target-device QA complete
- the remaining gap is execution on real hardware, not missing plans or missing hosted aliases
