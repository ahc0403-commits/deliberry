# Deliberry Product Architecture

Status: active
Authority: binding
Surface: cross-surface
Domains: architecture, surfaces, ownership
Last updated: 2026-03-16
Last verified: 2026-03-16
Retrieve when:
- deciding which top-level surface owns a feature or runtime
- checking the permanent repository architecture baseline
Related files:
- docs/02-surface-ownership.md
- docs/03-navigation-ia.md
- docs/06-guardrails.md

## Purpose

This document defines the permanent product architecture baseline for the Deliberry rebuild. Future implementation work must follow this structure unless these rules are explicitly revised first.

## Repository Structure

Deliberry is split into five repository-level surfaces:

- `customer-app`
- `merchant-console`
- `admin-console`
- `public-website`
- `shared`

Current repository state already reflects this split in the filesystem. That split is not temporary scaffolding. It is the architecture base.

## Surface Model

### `customer-app`

Mobile customer product built with Flutter. It owns the full customer journey from auth through ordering, reviews, and account management.

### `merchant-console`

Merchant-facing web console for store operations. It owns merchant workflows only.

### `admin-console`

Platform-facing web console for governance, moderation, operations oversight, finance oversight, and system management.

### `public-website`

Public web surface for marketing, support, legal, and app acquisition.

### `shared`

Cross-surface contract layer. It exists to reduce duplication in domain definitions, not to centralize feature behavior.

## Hard Separation Rules

1. Customer, merchant, admin, and public are separate products, not role-modes of one app.
2. Merchant and admin may share domain vocabulary, but they do not share navigation shells, route groups, or feature modules.
3. Public website must never absorb merchant or admin authenticated workflows.
4. Customer app must never depend on merchant or admin UI logic.
5. `shared` must not become a convenience dumping ground for anything reused once.

## Architectural Principles

### Structure Before Features

Route ownership, shell ownership, and feature-module ownership must be established before domain implementation expands.

### Surface-Local First

If a concern is tied to one surface's runtime, navigation, state flow, or presentation, it belongs inside that surface.

### Shared by Proof, Not Hope

Only place artifacts in `shared` when they are surface-neutral contracts or utilities. Do not move code into `shared` to make an import path shorter.

### Old Code Is Reference Only

Old implementation may inform feature parity and missing requirements. It must not dictate folder design, route structure, or shared boundaries in this rebuild.

### Placeholder vs Excluded

Future-ready placeholders may exist when a user-facing structure must remain visible, such as payment method selection. Excluded items must not be partially implemented.

## What `shared` Can Contain

- API contracts and DTOs
- domain models shared across surfaces
- enums and constants
- shared types
- validation schemas
- pure utilities with no UI or runtime coupling
- architecture and reference docs

## What `shared` Cannot Contain

- UI components
- Flutter widgets
- React components
- router code
- app state containers
- route guards
- feature coordinators
- merchant/admin/customer/public page composition
- runtime-specific orchestration
- surface-specific business workflows

## Explicit Exclusions

The following are excluded from implementation until explicitly reintroduced:

- payment verification
- map API address autocomplete
- QR generation library
- QR scanner camera integration
- real-time order tracking

## Payment Rule

- Checkout must keep payment method selection.
- Card and pay methods remain future-ready placeholders only.
- No payment gateway verification or payment completion logic may be implemented now.
