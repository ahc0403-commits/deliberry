# Physical Target-Device QA Evidence Template -- 2026-05-04

Status: active
Authority: operational
Surface: customer-app, merchant-console, admin-console, public-website
Domains: device-qa, release-gates, evidence, hardware-validation
Last updated: 2026-05-04
Last verified: 2026-05-04

## Purpose

This template defines the minimum evidence artifact required to close physical target-device QA for Gate 6.

It is a template, not a completed evidence record.

## Source Of Truth

- `docs/operations/physical-target-device-qa-execution-plan-2026-05-04.md`
- `docs/operations/release-gate-checklist-2026-04-29.md`
- `docs/operations/phase-1-target-browser-qa-2026-05-04.md`
- `docs/06-guardrails.md`

## Usage Rule

To support Gate 6 closure, create a filled dated artifact from this template, for example:

- `docs/operations/physical-target-device-qa-evidence-YYYY-MM-DD.md`

An empty template does not count as evidence.

## Required Evidence Template

```md
# Physical Target-Device QA Evidence -- YYYY-MM-DD

Status: active
Authority: operational

## Execution Metadata

- Execution date:
- Execution owner:
- Observer / approver:
- Target deployed aliases:

## Device Inventory

| Device class | Device model | OS / version | Browser / runtime | Result |
| --- | --- | --- | --- | --- |
| Phone |  |  |  |  |
| Tablet |  |  |  |  |
| Desktop |  |  |  |  |

## Customer App Checks

- Auth / entry:
- Home:
- Store / menu:
- Cart:
- Checkout:
- Orders list:
- Order detail:
- Order status:

Customer notes:

- Touch target issues:
- Keyboard/system chrome issues:
- Payment copy issues:

## Merchant Console Checks

- Login:
- Dashboard:
- Orders:
- Menu:
- Settlement:

Merchant notes:

- Tablet readability:
- Store-scope issues:
- Overflow or clipped action issues:

## Admin Console Checks

- Login:
- Dashboard:
- Orders:
- Disputes:
- Customer service:
- Settlements / finance:

Admin notes:

- Role-nav issues:
- Table readability issues:
- Action reachability issues:

## Public Website Checks

- Landing:
- Merchant:
- Support:
- Download:
- Privacy:
- Terms:
- Refund policy:

Public notes:

- Legal readability:
- CTA layout issues:

## Screenshot Inventory

- Phone screenshots:
- Tablet screenshots:
- Desktop screenshots:

## Blocking Findings

- Blocking issue 1:
- Blocking issue 2:

## Pass-With-Condition Findings

- Conditional issue 1:
- Conditional issue 2:

## Final Verdict

- Phone verdict:
- Tablet verdict:
- Desktop verdict:
- Overall Gate 6 device QA verdict:
- Follow-up actions:
```

## Closure Rule

Physical target-device QA may be marked complete only when:

- a dated filled evidence record exists
- phone, tablet, and desktop results are all present
- required customer, merchant, admin, and public flows are covered
- any remaining conditions are explicitly accepted

## What This Template Does Not Do

This template does not:

- close Gate 6 by itself
- replace browser-width evidence
- replace deployed browser boundary E2E

It only standardizes the physical device evidence artifact.
