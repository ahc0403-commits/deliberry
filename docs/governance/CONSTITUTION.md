# Deliberry Platform — Constitutional Rules

Status: active
Authority: binding
Surface: cross-surface
Domains: governance, platform-rules, boundaries
Last updated: 2026-03-16
Last verified: 2026-03-16
Retrieve when:
- a task may affect platform rules, boundaries, shared ownership, money, time, or auth
- checking whether a proposal is allowed before editing code
Related files:
- docs/governance/IDENTITY.md
- docs/governance/STRUCTURE.md
- docs/governance/FLOW.md
- docs/governance/DATE.md
- docs/governance/DECAY_PATH.md
- docs/governance/GLOSSARY.md
- docs/governance/ENFORCEMENT_CHECKLIST.md

> This document defines the top-level immutable governance rules for the Deliberry platform.
> All surfaces, services, and contributors MUST comply.
> Rules in this document override all other documents except explicit exception records.

---

## 1. Purpose

This document defines the non-negotiable behavioral and structural constraints that govern
the Deliberry platform across all surfaces, domains, and engineering phases.

The Constitution exists to prevent systemic decay. It is not a best-practices guide —
it is a hard boundary. Violations must be caught in PR review and reverted.

---

## 2. Surfaces

The platform consists of exactly five surfaces. No surface may be added without updating
this Constitution and docs/02-surface-ownership.md.

| Surface | Runtime | Ownership |
|---------|---------|-----------|
| customer-app | Flutter | Customer-facing product |
| merchant-console | Next.js | Merchant operations |
| admin-console | Next.js | Platform governance |
| public-website | Next.js | Public marketing |
| shared | TypeScript contracts | Cross-surface contracts only |

---

## 3. Immutable Rules

### 3.1 Surface Boundaries

R-001: Each surface MUST own its runtime, session, auth, and data presentation logic locally.
R-002: No surface MUST import runtime code from another surface.
R-003: `shared` MUST contain only: types, constants, models, contracts, validation schemas, pure utilities, and architecture docs.
R-004: `shared` MUST NOT contain: UI components, routing logic, session state, permission runtime, feature orchestration, or surface-specific business logic.
R-005: Each web surface MUST use a surface-local adapter as the only import boundary into repo-level `shared`. Adapter placement rules are defined in `docs/governance/STRUCTURE.md` Section 3.

### 3.2 Money Integrity

R-010: All monetary values MUST be stored and computed as integer centavos (e.g., $42.50 = 4250).
R-011: Floating-point types MUST NOT be used for any monetary field in contracts, schemas, or domain models.
R-012: The canonical currency for this platform is ARS (Argentine Peso). USD support is secondary. VND MUST NOT be used.
R-013: All money display MUST use `formatMoney(centavos: number, currency: 'ARS' | 'USD')` — never inline formatting.
R-014: Settlement, refund, commission, and adjustment amounts MUST use the same centavo-integer representation.

### 3.3 Identity and Permissions

R-020: Every user-facing action MUST be attributed to an authenticated actor (see IDENTITY.md).
R-021: Role-based access control MUST be enforced server-side. Client-side role checks are UI hints only.
R-022: Admin roles MUST be limited to: `platform_admin | operations_admin | finance_admin | marketing_admin | support_admin`.
R-023: Merchant access MUST be scoped to a specific store. Cross-store access MUST NOT be granted without explicit multi-store authorization.
R-024: Guest access MUST be limited to browse-only. Cart operations for guests are allowed. Order placement requires authentication.

### 3.4 Data Immutability

R-030: Orders MUST NOT be deleted. They MUST be status-transitioned to `cancelled` or `disputed`.
R-031: Payments MUST NOT be deleted. They MUST be transitioned to `failed` or `refunded`.
R-032: Settlements MUST NOT be deleted or retroactively modified. Corrections MUST be recorded as new adjustment entries.
R-033: Audit log entries MUST NOT be deleted or modified after creation.

### 3.5 Status Enums

R-040: Canonical status enums MUST be defined in a single canonical location within `shared`. Placement rules are defined in `docs/governance/STRUCTURE.md` Section 5.3.
R-041: Surface-local mock data, types, and business logic MUST use only values from the canonical enum.
R-042: New status values MUST be added to the canonical enum first, then adopted surface-locally.
R-043: Status values MUST NOT be invented locally in a surface without updating the canonical enum.

### 3.6 Timestamps

R-050: All timestamps MUST comply with the standards defined in `docs/governance/DATE.md`.
R-051: (Moved to DATE.md Law 2 — ISO 8601 representation standard.)
R-052: (Moved to DATE.md — display-layer conversion rule.)
R-053: (Moved to DATE.md — persistence format rule.)

### 3.7 Audit Trail

R-060: All mutations to Orders, Payments, Settlements, Users, and Merchants MUST produce an audit log entry.
R-061: Audit log entries MUST record: `actor_id`, `actor_type`, `action`, `resource_type`, `resource_id`, `timestamp_utc`, `before_state` (optional), `after_state`.
R-062: Audit log entries MUST NOT be writable by the actor who triggered the event.

### 3.8 Forbidden Patterns

R-070: Direct database mutations bypassing the business logic layer MUST NOT occur in production code.
R-071: Feature flags or dev shortcuts MUST NOT be deployed to production surfaces without explicit governance review.
R-072: Hardcoded credentials, API keys, or secrets MUST NOT appear in source code or documentation.
R-073: Cross-surface session sharing MUST NOT be implemented.
R-074: Payment verification or real money movement MUST NOT be implemented without explicit finance and legal review.

---

## 4. Exception Approval

Any exception to rules R-001 through R-074 requires:
1. A written exception request in `docs/governance/exceptions/YYYY-MM-DD-{rule-id}.md`
2. Approval from at least one governance reviewer
3. A sunset date (no permanent exceptions without quarterly review)

---

## 5. Enforcement and Compliance

Enforcement procedures, checklists, and audit processes are defined in `docs/governance/ENFORCEMENT_CHECKLIST.md`.

Active violations and current-state decay evidence are tracked in `docs/governance/DECAY_PATH.md`.
