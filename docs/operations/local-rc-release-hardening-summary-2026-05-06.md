# Local RC Release Hardening Summary -- 2026-05-06

Status: active
Authority: operational
Surface: cross-surface
Domains: release-hardening, blockers, non-claims, local-rc
Last updated: 2026-05-06
Last verified: 2026-05-06

## Purpose

Summarize what the repository can honestly claim after the local release-candidate hardening pass, and what still blocks a stronger release-ready statement.

## What Is Closed Locally

- EN / KO / VI language switching now works across customer-app, merchant-console, admin-console, and public-website.
- Canonical product baseline is now aligned around VND and Ho Chi Minh City / UTC+7 across active docs and live surfaces.
- Customer runtime truth is centralized in `CustomerRuntimeController` with documented persisted vs local-only boundaries.
- Merchant auth/store-scope and admin auth/role-boundary flows now expose reason-aware access states instead of generic failures.
- Public acquisition/legal/support/download surfaces now behave as honest public handoff routes instead of dead ends.
- Local visual QA has been completed across high-signal routes on all four surfaces.

## What Is Still Blocked

### 1. Hosted parity signoff

The current evidence is primarily local.

Still needed:
- keep hosted parity evidence fresh after any future material deployment change

Hosted parity note from the first production-alias smoke on 2026-05-06:
- public anonymous routes now match the current production baseline after redeploy
- merchant anonymous login now matches the current production baseline after redeploy
- admin login parity looks current at the anonymous login surface
- the governed deployed browser harness and customer fixture-secret paths already exist, so the remaining hosted gap is evidence refresh rather than harness invention
- a fresh deployed boundary refresh run completed green on GitHub Actions as `25420411267`
- evidence: `docs/operations/hosted-parity-smoke-findings-2026-05-06.md`

### 2. Physical target-device QA

The current evidence is desktop-local and browser-local.

Still needed:
- mobile hardware
- tablet hardware
- supported desktop browser matrix evidence
- ready handoff artifact: `docs/operations/physical-target-device-qa-readiness-packet-2026-05-06.md`

### 3. Auth/provider completion

- Customer phone/SMS remains intentionally disabled at the hosted provider layer.
- Merchant and admin auth are stable locally but still need hosted env parity confirmation.

### 4. Honest partial-runtime surfaces

These surfaces are present and coherent, but are not to be described as fully closed operational systems:
- merchant analytics
- merchant promotions
- merchant settlement
- admin settlements
- admin finance
- customer group-order beyond same-device local-room truth

## Current Non-Claims

The following remain excluded or intentionally non-claimed:

- payment verification
- map API address autocomplete
- QR generation library
- QR scanner camera integration
- real-time order tracking
- full financial reconciliation or payment-completion workflows
- enterprise IAM / SSO

## Local RC Recommendation

The repository is now suitable for a **local RC baseline** claim.

It is not yet suitable for a **hosted release-ready** claim.

## Required Next Gates

1. Hosted parity smoke across all four surfaces
2. Physical target-device QA evidence attachment
3. Final release blockers review against `docs/operations/release-gate-checklist-2026-04-29.md`
4. Explicit signoff that merchant demo-cookie fallback is not active in hosted environments
