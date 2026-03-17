# Deliberry Glossary

Status: active
Authority: binding
Surface: cross-surface
Domains: governance, glossary, terminology
Last updated: 2026-03-17
Last verified: 2026-03-17
Retrieve when:
- a governance or architecture term is ambiguous
- checking canonical repository terminology before editing docs or code
Related files:
- docs/governance/CONSTITUTION.md
- docs/governance/IDENTITY.md
- docs/governance/FLOW.md
- docs/governance/DECAY_PATH.md
- docs/01-product-architecture.md
- docs/02-surface-ownership.md

## Purpose

This document defines canonical terms used across Deliberry governance documents, product docs, and implementation work. When a term appears in this glossary, its definition here overrides common usage or assumptions.

Disambiguation notes call out terms that look similar but mean different things in this repository.

---

## Surfaces

### surface
One of the five top-level repository-level products: `customer-app`, `merchant-console`, `admin-console`, `public-website`, `shared`. A surface has its own runtime, its own ownership boundary, and its own tech stack. See `CONSTITUTION.md Section 2`.

### customer-app
The Flutter mobile product serving consumers. Owns the full customer journey. See `IDENTITY.md`.

### merchant-console
The Next.js web product serving store operators. All merchant features are store-scoped. See `IDENTITY.md`.

### admin-console
The Next.js web product serving platform operators. Owns platform governance. All admin features are platform-scoped. See `IDENTITY.md`.

### public-website
The Next.js public web surface. Always public-only. No authenticated state. See `IDENTITY.md`.

### shared
The cross-surface contract layer. Not a product. Contract-only. See `CONSTITUTION.md R-003/R-004`.

---

## Ownership

### surface ownership
The rule that a runtime behavior, UI component, route, or flow belongs to exactly one surface and may not be duplicated or shared across surface boundaries.

### surface-local
Code, state, or logic that lives entirely within one surface and is not accessible to any other surface. Example: `merchant-console/src/shared/auth/` is surface-local to the merchant console.

### contract-only
Describes `shared`. Means `shared` may only define types, interfaces, DTOs, models, enums, constants, validation schemas, and pure utilities. See `CONSTITUTION.md R-003/R-004` for the complete list.

### feature ownership
The assignment of a specific feature domain to a specific surface. Feature ownership is documented in `docs/02-surface-ownership.md` and is enforced by surface separation rules.

---

## Architecture

### architecture base
The permanent structural decisions that all implementation derives from. The five-surface split is the architecture base. It is not scaffolding. See `CONSTITUTION.md Section 2`.

### shell
The top-level layout component for a surface: navigation bar, sidebar, page frame. Shells are surface-local. Merchant and admin do not share shells.

### route group
A named collection of routes under a common layout or access gate. Route groups are surface-local.

### route guard
A runtime check that enforces access control before allowing navigation to a route. Route guards are surface-local and may not live in `shared`.

### feature module
A self-contained folder grouping all files for one feature domain (pages, components, state, services, repository). Feature modules are surface-local.

### entry boundary
The point at which a user transitions from the unauthenticated or public state into the authenticated or operational surface. Each surface has its own entry boundary. See `FLOW.md`.

---

## Auth and Session

### session
The runtime state that records whether a user is authenticated and what their access context is. Sessions are surface-local. There is no cross-surface session.

### session controller
A runtime object that owns session storage, retrieval, restoration, and invalidation for one surface. Session controllers may not live in `shared`.

### auth provider
A runtime integration that verifies credentials and issues session tokens. Auth providers are surface-local and not yet live (non-live scope).

### permission engine
A runtime component that evaluates whether an authenticated user has the right to access a route or perform an action. Permission engines are admin-local and may not live in `shared`.

### permission contract
A type or interface definition in `shared` that describes permission roles, scopes, or statuses. Permitted in `shared`. The engine that evaluates these contracts lives in `admin-console` only.

### OTP
One-Time Passcode. The customer auth mechanism. Phone number entry followed by OTP verification. Customer-local flow. See `FLOW.md`.

### guest mode
An explicit, first-class customer-app state where a user accesses the app without completing phone/OTP auth. Guest mode is not the default result of a failed auth attempt. See `FLOW.md`.

### store context
The merchant-local runtime state that tracks which store the authenticated merchant has selected. Store context is required for all merchant console routes after store selection. See `FLOW.md`.

---

## Scope Rules

### placeholder-only
A feature that has UI structure but no real backend integration. Example: payment method selection in checkout. The UI exists. No payment verification occurs.

### excluded
A feature that must not be implemented in any form, including stubs, preparatory plumbing, or feature flags. See `CONSTITUTION.md R-074` and `docs/06-guardrails.md` for the complete exclusion list.

### future-ready placeholder
Synonym for placeholder-only. A structural element whose integration is explicitly deferred to a future track.

### non-live scope
The current implementation state of the repository. Auth providers are not live. Backend data fetching is not live. Mutations are placeholder-safe. See `CLAUDE.md Section 5`.

---

## Domain Vocabulary (Shared Terms)

These terms appear in multiple surfaces with surface-specific meanings. The vocabulary is shared. The implementations are not.

### order
In `customer-app`: a customer's placed order. In `merchant-console`: a received and in-progress store order. In `admin-console`: a platform-level order record under oversight. All three are backed by the same shared contract DTO but owned by different surface features.

### store
In `merchant-console`: the store currently selected and being operated. In `admin-console`: a store record under platform governance. In `public-website`: a conceptual reference in merchant onboarding content.

### settlement
In `merchant-console`: a read-only informational view of payout status. In `admin-console`: a platform-level settlement oversight and finance tool. Settlement finalization logic is placeholder-only in both.

### review
In `customer-app`: a customer-submitted store review. In `merchant-console`: a received review with merchant response capability.

### promotion
In `merchant-console`: a store-operator-created coupon or discount. In `admin-console`: a platform-level marketing management view.

---

## Governance Terms

### constitutional law
An invariant rule defined in `CONSTITUTION.md`. May not be overridden without formal amendment. Highest authority in the repository.

### derived convention
A rule that follows from constitutional law but specifies implementation detail. Lives in governance documents subordinate to the Constitution. May be updated when the implementation pattern changes, as long as it does not violate a constitutional law.

### amendment
The formal process for changing a constitutional law. Requires updating `CONSTITUTION.md`, all affected governance docs, and the `ENFORCEMENT_CHECKLIST.md`. See `CONSTITUTION.md` Amendment Process section.

### drift
The gradual divergence of code or docs from the established architecture baseline. See `DECAY_PATH.md` for decay modes and correction procedures.

### decay mode
A named, documented pattern of drift. See `DECAY_PATH.md`.

### source of truth
The document or file that is authoritative for a given question. When code and docs disagree, docs are the source of truth. See `CONSTITUTION.md Section 1`.
