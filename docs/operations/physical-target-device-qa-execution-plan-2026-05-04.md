# Physical Target-Device QA Execution Plan -- 2026-05-04

Status: active
Authority: operational
Surface: customer-app, merchant-console, admin-console, public-website
Domains: device-qa, release-gates, hardware-validation, mobile, tablet, desktop
Last updated: 2026-05-04
Last verified: 2026-05-04

## Purpose

This document defines the governed execution plan for the remaining physical target-device QA gate.

It exists because browser-width evidence is already closed, but physical hardware evidence is still required before Gate 6 may be fully marked complete.

## Source Of Truth

- `docs/operations/release-gate-checklist-2026-04-29.md`
- `docs/operations/production-roadmap-2026-04-28.md`
- `docs/operations/gate2-remote-audit-and-device-qa-blockers-2026-05-04.md`
- `docs/operations/phase-1-target-browser-qa-2026-05-04.md`
- `docs/operations/phase-1-deployed-browser-e2e-2026-04-28.md`
- `docs/06-guardrails.md`

## Current State

Already closed:

- deployed browser boundary E2E
- governed route-width QA
- governed target-browser screenshot evidence

Still open:

- physical mobile hardware validation
- physical tablet hardware validation
- physical desktop browser/operator validation on real target environments

## Required Hardware Set

Minimum governed hardware set:

- 1 physical phone in the primary target market
- 1 physical tablet in the primary target market
- 1 desktop or laptop operator environment for web-console validation

Recommended expansion:

- 1 iPhone
- 1 Android phone
- 1 iPad or Android tablet
- 1 macOS or Windows desktop browser environment

## Required Surfaces And Flows

### Customer App

Required device checks:

- entry / auth handoff
- home discovery
- store detail and menu browsing
- cart
- checkout
- orders list
- order detail
- order status

Required truths:

- touch targets are reachable
- sticky CTAs do not collide with system chrome
- keyboard and focus behavior do not obscure critical actions
- payment placeholders remain honest

### Merchant Console

Required device checks:

- login
- store-scoped dashboard
- orders
- menu
- settlement visibility

Required truths:

- store-scoped navigation remains intact
- tablet order queue is readable on real hardware
- action density remains usable for operator workflows

### Admin Console

Required device checks:

- login
- dashboard
- orders
- disputes
- customer-service
- settlements / finance visibility

Required truths:

- role-scoped nav remains usable on real hardware
- tables and panels remain readable without hidden overflow
- audited action affordances remain reachable

### Public Website

Required device checks:

- landing
- merchant
- support
- download
- privacy
- terms
- refund-policy

Required truths:

- legal copy remains readable
- CTA layout remains stable
- no mobile viewport collision or clipped content

## Execution Sequence

1. Confirm target deployed aliases to test.
2. Confirm the latest governed browser evidence is still green.
3. Select the hardware set and record device model, OS version, and browser/app runtime.
4. Run customer flow on phone.
5. Run customer flow on tablet.
6. Run merchant flow on tablet or desktop-class browser hardware.
7. Run admin flow on desktop-class browser hardware and, if required, tablet.
8. Run public website validation on phone and desktop.
9. Capture screenshots, notes, and blockers for every failed or conditional check.
10. Record the result in a dated evidence artifact.

## Pass/Fail Rule

A physical target-device pass requires:

- critical surfaces load on the target device
- no blocking overflow or clipped action areas
- no keyboard/system-chrome collision that prevents task completion
- no misleading live-payment language
- no broken role/store scoping

A device run must be marked blocked or failed if:

- a required action cannot be completed on real hardware
- a CTA is unreachable
- key text is cut off or obscured
- the wrong surface or scope is exposed

## Stop Conditions

Stop and record a blocker immediately if:

- the customer checkout CTA cannot be reached
- merchant order actions are obscured
- admin role-scoped navigation breaks
- public legal copy is unreadable on target hardware
- any payment copy implies live capture while Gate 4 remains open

## Required Evidence Outputs

Each governed device run must produce:

- device metadata
- tested URL or app route set
- screenshots for each required surface
- short operator notes
- explicit pass/fail/blocked result
- open follow-up issues or blockers

## Closure Rule

Gate 6 physical target-device QA may be marked complete only when:

- a dated evidence document exists
- at least one physical phone result is recorded
- at least one physical tablet result is recorded
- at least one desktop operator result is recorded
- all required critical flows are marked pass or accepted with explicit conditions

## What This Plan Does Not Do

This plan does not:

- replace browser-width evidence
- replace deployed boundary E2E
- claim device QA is already complete

It only fixes the execution plan for the remaining real-hardware gate.
