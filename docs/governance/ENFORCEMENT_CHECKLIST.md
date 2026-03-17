# Deliberry Enforcement Checklist

Status: active
Authority: binding
Surface: cross-surface
Domains: governance, enforcement, checklist, validation
Last updated: 2026-03-17
Last verified: 2026-03-17
Retrieve when:
- running pre-implementation, pre-merge, or periodic governance checks
- verifying enforcement steps before structural code changes
Related files:
- docs/governance/CONSTITUTION.md
- docs/governance/IDENTITY.md
- docs/governance/STRUCTURE.md
- docs/governance/FLOW.md
- docs/governance/DECAY_PATH.md
- docs/06-guardrails.md

## Purpose

This document provides actionable checklists for enforcing the Deliberry governance baseline. It covers pre-implementation gates, pre-merge validation, and periodic audit procedures.

This document does not define the rules themselves. Rules live in `CONSTITUTION.md`, `IDENTITY.md`, `STRUCTURE.md`, `FLOW.md`, and `DECAY_PATH.md`. This document tells you when and how to apply them.

---

## Pre-Implementation Gate

Run this checklist before beginning any implementation task.

### 1 — Surface Ownership Confirmation

- [ ] Identify the target surface for the proposed work.
- [ ] Confirm the feature or behavior is listed under that surface's ownership in `docs/02-surface-ownership.md`.
- [ ] Confirm the feature does not appear under another surface's "Must Never Own" list.
- [ ] If ownership is ambiguous, resolve against `docs/governance/IDENTITY.md` before proceeding.

### 2 — Shared Boundary Check

- [ ] Confirm that nothing in the proposed implementation needs to go into repo-level `shared`.
- [ ] If something is proposed for `shared`, confirm it passes: "Is this provably surface-neutral?" (type, contract, schema, pure utility, or reference doc — nothing else).
- [ ] Confirm no runtime logic (session, auth, route guard, state, UI) is being added to `shared`.

### 3 — Exclusion Check

- [ ] Confirm the proposed work does not touch any excluded feature (see `CONSTITUTION.md R-074` and `docs/06-guardrails.md`):
  - payment verification
  - map API address autocomplete
  - QR generation library
  - QR scanner / camera integration
  - real-time order tracking
- [ ] Confirm the proposed work does not escalate payment handling beyond placeholder-only (see `CONSTITUTION.md R-074`).

### 4 — Scope Classification

- [ ] Classify the proposed behavior: full-scope, placeholder-only, or excluded.
- [ ] If placeholder-only: confirm the implementation will have UI structure only, no backend wiring.
- [ ] If excluded: stop. Do not implement.

### 5 — Documentation Pre-Check

- [ ] If the proposed work changes an architecture boundary, route group, shared boundary, or ownership rule — update the relevant governance doc BEFORE writing code.
- [ ] Confirm the governing doc set is read and current before starting.

---

## Pre-Merge Validation

Run this checklist before any structural code change is merged.

### 1 — Static Analysis

- [ ] `flutter analyze` passes with no errors for `customer-app`.
- [ ] `npm run typecheck` passes for `merchant-console`, `admin-console`, `public-website`.
- [ ] `npm run build` passes for `merchant-console`, `admin-console`, `public-website`.

### 2 — Shared Forbidden-Content Scan

Confirm `shared/` contains no forbidden content. Check for:

- [ ] No UI component files (`.tsx`, `.jsx`, `.vue`, `.dart` widget files) in `shared/`
- [ ] No router files, routing hooks, or route guard files in `shared/`
- [ ] No app state files (Redux, Zustand, Provider, Riverpod, etc.) in `shared/`
- [ ] No session controller or auth provider files in `shared/`
- [ ] No files that import from a specific surface's directory
- [ ] No new subdirectories in `shared/` outside: `contracts/`, `models/`, `constants/`, `types/`, `schemas/`, `utils/`, `docs/`

### 3 — Surface Import Scan

- [ ] No surface imports from another surface's directory (no `customer-app` → `merchant-console` imports, etc.).
- [ ] No surface imports runtime behavior from `shared/` (contracts and types only).

### 4 — Exclusion Scan

- [ ] No payment gateway SDK imported in any surface.
- [ ] No map API (Google Maps, Mapbox, Kakao Maps, etc.) import beyond approved static usage.
- [ ] No QR generation or QR scanning library imported.
- [ ] No real-time tracking socket or WebSocket connection for order tracking.

### 5 — Public-Website Auth Scan

- [ ] No session storage, auth provider, or route guard exists in `public-website/`.
- [ ] No authenticated route group exists under `public-website/src/app/`.

### 6 — Documentation Alignment Check

- [ ] If the change modifies architecture, ownership, or shared boundaries: confirm the relevant governance doc was updated and `Last updated` reflects today's date.
- [ ] Confirm no governance doc's `Last updated` is more than 90 days stale for the areas touched by this change.

---

## Periodic Audit Procedure

Run this audit on any significant structural milestone or when governance staleness is suspected.

### 1 — Governance Doc Freshness

For each document in `docs/governance/`:
- [ ] Check `Last updated` against today's date.
- [ ] If more than 90 days stale: schedule a review against current repository state.
- [ ] If content diverges from current code: apply `DECAY_PATH.md` correction procedure for Decay Mode 5.

### 2 — Shared Boundary Audit

- [ ] List all files in `shared/` and classify each as permitted or forbidden.
- [ ] Any forbidden file triggers Decay Mode 1 correction. See `DECAY_PATH.md`.

### 3 — Cross-Surface Import Audit

- [ ] Search for imports across surface directories.
- [ ] Any cross-surface import triggers Decay Mode 2 correction. See `DECAY_PATH.md`.

### 4 — Exclusion Feature Audit

- [ ] Search all surfaces for imports of excluded-feature libraries.
- [ ] Search all surfaces for partial implementations of excluded features.
- [ ] Any finding triggers Decay Mode 3 correction. See `DECAY_PATH.md`.

### 5 — Public-Website Auth Audit

- [ ] Search `public-website/` for session, auth, or guard-related imports.
- [ ] Any finding triggers Decay Mode 6 correction. See `DECAY_PATH.md`.

---

## Amendment Enforcement

When a constitutional law is amended:

- [ ] `CONSTITUTION.md` is updated and `last-updated` reflects the amendment date.
- [ ] All governance documents that derive from the changed law are reviewed and updated.
- [ ] This checklist is updated to reflect any new or changed validation steps.
- [ ] Product docs (`docs/01-*.md` through `docs/08-*.md`) are reviewed for alignment.
- [ ] `AGENTS.md` is reviewed and updated if agent execution rules are affected.
- [ ] `CLAUDE.md` project section is reviewed and updated if project context is affected.

---

## Severity Reference

| Check | On Failure | Severity |
|-------|-----------|----------|
| Shared forbidden-content scan | Decay Mode 1 | Critical |
| Surface import scan | Decay Mode 2 | Critical |
| Exclusion scan | Decay Mode 3 | High |
| Payment escalation check | Decay Mode 4 | High |
| Public-website auth scan | Decay Mode 6 | High |
| Static analysis | Build broken | Blocking |
| Doc alignment check | Decay Mode 5 | Medium |
| Governance doc freshness | Decay Mode 5 | Medium |
