# Governance Enforcement Points

> **Classification: Supporting Operational Artifact** — This is NOT a canonical governance document.
> Canonical enforcement procedures are defined in ENFORCEMENT_CHECKLIST.md.
> This file documents where governance is already enforced in code.

Status: active
Authority: operational (supporting artifact)
Surface: cross-surface
Domains: enforcement, tooling, code-rules
Last updated: 2026-03-14
Last verified: 2026-03-16
Retrieve when:
- checking where governance is already enforced in code
- planning enforcement work without re-auditing the whole repository
Related files:
- merchant-console/src/shared/domain.ts
- admin-console/src/shared/domain.ts
- public-website/src/shared/domain.ts
- shared/types/common.types.ts

> This document catalogs exactly where governance rules are enforced in code,
> and where enforcement is missing and must be added in future waves.

---

## 1. Currently Enforced

### Surface Boundary (R-005)
- **Mechanism**: Surface-local `src/shared/domain.ts` adapter pattern
- **Files**:
  - `merchant-console/src/shared/domain.ts`
  - `admin-console/src/shared/domain.ts`
  - `public-website/src/shared/domain.ts`
- **How**: Each file is the ONLY import boundary into repo-level `shared/`. A governance comment at the top of each file documents this constraint.
- **Limitation**: Not enforced by tooling. Relies on PR review and manual scans.

### Money Integrity (R-010, R-011)
- **Mechanism**: TypeScript branded type `MoneyAmount` / `Centavos`
- **File**: `shared/types/common.types.ts`
- **How**: `MoneyAmount = number & { readonly __brand: 'centavos' }` prevents accidental assignment of float values at compile time.
- **Limitation**: Runtime code can still bypass the brand with casts. No runtime assertion exists yet.

### Currency (R-012)
- **Mechanism**: TypeScript literal union type `CurrencyCode`
- **File**: `shared/types/common.types.ts`
- **How**: `CurrencyCode = 'ARS' | 'USD'` — VND is excluded.
- **Enforcement**: Compile-time only.

### Status Enums (R-040, R-041, R-042, R-043)
- **Mechanism**: Canonical `as const` arrays in `shared/constants/domain.constants.ts`
- **Derived types**: `shared/types/domain.types.ts` derives union types from the arrays
- **Enums defined**: `ORDER_STATUSES`, `PAYMENT_STATUSES`, `SETTLEMENT_STATES`, `DISPUTE_STATUSES`
- **Limitation**: Surface mock data types reference canonical values but are not programmatically derived from them yet. Mock data instances may drift.

### Timestamp Policy (R-050, R-051)
- **Mechanism**: `ISODateTimeUTC` branded type + utility functions
- **Files**: `shared/types/common.types.ts`, `shared/utils/date.ts`
- **How**: `isValidUTCTimestamp()` validates ISO 8601 UTC format. `toDisplayTime()` and `toBusinessDate()` convert for presentation.
- **Limitation**: Mock data still uses informal date strings. API validation layer does not yet exist.

### Auth Actor Types (R-020)
- **Mechanism**: `AUTH_ACTOR_TYPES` constant array
- **File**: `shared/constants/domain.constants.ts`
- **Values**: `guest`, `customer`, `merchant`, `rider`, `admin`, `system`
- **Limitation**: No runtime enforcement. Actor attribution on mutations is not yet implemented.

---

## 2. NOT Yet Enforced (Future Waves)

### Build-Time Cross-Surface Import Scan
- **Rule**: R-002
- **What's needed**: CI/lint rule that fails on imports crossing surface boundaries
- **Target wave**: Wave 3

### Runtime Money Assertion
- **Rule**: R-010, R-011
- **What's needed**: Runtime guard `assertCentavos(amount)` that verifies `amount % 1 === 0`
- **Target wave**: Wave 2

### Mock Data Programmatic Derivation
- **Rule**: R-041
- **What's needed**: Surface mock data types should derive status fields from canonical `OrderStatus` type rather than duplicating string literals
- **Target wave**: Wave 2

### Server-Side RBAC Enforcement
- **Rule**: R-021, R-022
- **What's needed**: Middleware that validates actor role against required permissions
- **Target wave**: Wave 4

### Row-Level Security
- **Rule**: R-023
- **What's needed**: Database RLS policies scoping merchant queries to `store_id`
- **Target wave**: Wave 4

### Audit Log Infrastructure
- **Rule**: R-060, R-061, R-062
- **What's needed**: `audit_logs` table, mutation interceptors, admin viewer
- **Target wave**: Wave 5

### API Timestamp Validation
- **Rule**: R-050, R-051
- **What's needed**: API middleware rejecting non-UTC timestamps
- **Target wave**: Wave 3

### Placeholder Removal
- **Rule**: R-071
- **What's needed**: Remove all `_placeholder` suffixes from production code paths
- **Target wave**: Wave 6
