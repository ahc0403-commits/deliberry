# Deliberry Platform — Decay Path Registry

Status: active
Authority: binding
Surface: cross-surface
Domains: decay, anti-patterns, review-risk
Last updated: 2026-03-14
Last verified: 2026-03-16
Retrieve when:
- reviewing a change for structural or domain drift
- checking known systemic failure modes before refactoring
Related files:
- docs/governance/CONSTITUTION.md
- docs/governance/STRUCTURE.md
- docs/governance/FLOW.md

> This document catalogs known and anticipated patterns of systemic decay.
> Each entry defines the decay pattern, symptoms, detection method, blocking rule, and recovery path.
> Preventing decay is cheaper than recovering from it.

---

## 1. Status Enum Pollution

**Status: ACTIVE — Already occurring (3-way divergence found)**

**Definition**: Surface-local code introduces status values that do not exist in the canonical enum, causing inconsistent behavior across surfaces.

**Symptoms**:
- Mock data uses status values not in `shared/constants/domain.constants.ts`
- UI components render unknown status badges
- API contracts accept values that other surfaces cannot interpret
- Switch/case statements have unhandled branches

**Current Evidence**:
- Shared canonical: `pending | confirmed | preparing | ready_for_delivery | delivered | cancelled`
- Merchant mock: `new | preparing | ready | picked_up | delivered | cancelled`
- Admin mock: `new | preparing | ready | in_transit | delivered | cancelled | disputed`
- Three separate vocabularies for the same domain concept

**Detection Method**:
- Grep all surfaces for status string literals; diff against canonical enum
- Automated scan: extract all order status strings, compare to `ORDER_STATUSES` constant
- PR review: any new status string MUST reference canonical enum

**Blocking Rule**: R-040, R-041, R-042, R-043

**Recovery Path**:
1. Update canonical enum with all legitimate statuses (Wave 1)
2. Align all surface mock data to canonical values (Wave 2)
3. Add build-time enum validation to prevent future drift

---

## 2. Float Money

**Status: ACTIVE — Already occurring in mock data**

**Definition**: Monetary values stored or computed as floating-point numbers, leading to rounding errors and inconsistent totals.

**Symptoms**:
- Mock data contains values like `18.5`, `8456.50` (floats, not centavos)
- Subtotal calculations produce values like `42.300000000000004`
- Settlement totals do not reconcile with order totals

**Current Evidence**:
- Mock data across surfaces uses decimal float amounts
- `MoneyAmount` type is `number` with no constraint — `shared/types/common.types.ts:5`

**Detection Method**:
- Type check: `MoneyAmount` MUST be a branded integer type
- Grep for decimal money literals in mock data and business logic
- Runtime assertion: `amount % 1 === 0` for all money values

**Blocking Rule**: R-010, R-011

**Recovery Path**:
1. Change `MoneyAmount` to branded integer centavo type (Wave 1)
2. Convert all mock data money values to integer centavos (Wave 2)
3. Add lint rule forbidding float literals in money contexts

---

## 3. Local Time Persistence

**Status: AT RISK — No policy enforced, mock data uses informal strings**

**Definition**: Timestamps stored in local Argentine time instead of UTC, causing incorrect time calculations across timezone boundaries.

**Symptoms**:
- Database timestamps show Buenos Aires time without offset
- Settlement period calculations are off by hours
- Scheduled delivery times are ambiguous
- Sorting by timestamp produces unexpected order

**Current Evidence**:
- No timezone handling in `shared/utils/date.ts`
- Mock data uses date-only strings without timezone context
- No policy document existed before this governance suite

**Detection Method**:
- Grep for `new Date()` without `.toISOString()` or UTC context
- Scan database schema for `TIMESTAMP` (should be `TIMESTAMPTZ`)
- Validate all API timestamp fields end with `Z`

**Blocking Rule**: R-050, R-051, R-052, R-053

**Recovery Path**:
1. Establish DATE.md (this governance suite — Wave 0)
2. Update date utilities to support timezone conversion (Wave 1)
3. Add API validation rejecting non-UTC timestamps (Wave 3)

---

## 4. Cross-Surface Runtime Leakage

**Status: NOT OCCURRING — Clean boundaries verified**

**Definition**: One surface imports runtime code (components, hooks, services, state) from another surface, collapsing the boundary between independent products.

**Symptoms**:
- Import paths crossing surface boundaries (e.g., `../../merchant-console/...`)
- Shared state between surfaces
- Build failures when one surface changes internal code

**Current Evidence**:
- Verified clean: no cross-surface runtime imports found
- Each surface has independent build and typecheck

**Detection Method**:
- Automated import scan: grep for import paths containing sibling surface names
- Build isolation test: each surface MUST build independently
- PR review: reject any import crossing surface boundaries

**Blocking Rule**: R-001, R-002

**Recovery Path** (if detected):
1. Identify the shared dependency
2. Extract to `shared` if it is a contract/type, or duplicate locally if it is runtime logic
3. Remove the cross-surface import

---

## 5. Shared Layer Bloat

**Status: NOT OCCURRING — Contract-only boundary verified**

**Definition**: Runtime logic, UI components, or business flows creep into the `shared` directory, turning it from a contract layer into a framework.

**Symptoms**:
- React/Flutter components in `shared/`
- State management code in `shared/`
- `shared` package grows faster than contract surface area
- Surfaces become tightly coupled through shared runtime

**Detection Method**:
- File type scan: `shared/` MUST NOT contain `.tsx`, `.jsx`, `.dart`, `.css` files
- Import analysis: `shared/` MUST NOT import from any surface
- Size monitoring: track `shared/` line count over time

**Blocking Rule**: R-003, R-004

**Recovery Path** (if detected):
1. Move runtime code to the owning surface
2. If multiple surfaces need it, each MUST have its own copy
3. Only pure types/contracts/utilities remain in shared

---

## 6. Permission Bypass

**Status: AT RISK — No RLS, feature flags in code**

**Definition**: Authorization checks are skipped, weakened, or only enforced client-side, allowing unauthorized access to data or operations.

**Symptoms**:
- API endpoints accessible without authentication
- Client-side role checks not backed by server-side enforcement
- Feature flags granting access without governance review
- Merchant accessing another merchant's store data

**Detection Method**:
- API endpoint audit: every mutation endpoint MUST require authentication
- RLS policy audit: every database table MUST have row-level security
- Feature flag audit: all flags MUST be documented and reviewed

**Blocking Rule**: R-020, R-021, R-023, R-071

**Recovery Path**:
1. Implement server-side middleware for auth enforcement (Wave 4)
2. Add RLS policies to all database tables (Wave 4)
3. Audit and document all feature flags (Wave 4)

---

## 7. Nullable Abuse

**Status: AT RISK — No nullable policy exists**

**Definition**: Fields that should be required are marked as optional/nullable, leading to null reference errors and inconsistent data states.

**Symptoms**:
- Excessive use of `?` optional markers in types
- Runtime `undefined is not an object` errors
- Defensive `?.` chaining throughout business logic
- Data that should always exist is sometimes missing

**Detection Method**:
- Type audit: review contract types for fields that should be required
- Runtime error monitoring: track null reference errors
- PR review: justify every new optional field

**Blocking Rule**: None specific — general code quality

**Recovery Path**:
1. Audit all contract types for incorrect optionality
2. Make fields required where data MUST always exist
3. Use discriminated unions instead of nullable fields for conditional data

---

## 8. Ad-hoc Field Addition

**Status: AT RISK — No schema migration governance**

**Definition**: New fields are added to entities without updating contracts, schemas, and all consuming surfaces, leading to partial data models.

**Symptoms**:
- Database columns exist without corresponding type definitions
- API returns fields not in the contract
- Some surfaces handle a field, others ignore it
- Schema validation passes data that the application cannot process

**Detection Method**:
- Schema diff: compare database columns to TypeScript types to JSON schemas
- Contract coverage: every field in the database MUST appear in the contract
- PR review: field additions MUST include contract, schema, and surface updates

**Blocking Rule**: R-040 (for status fields), general governance

**Recovery Path**:
1. Audit all entities for undocumented fields
2. Update contracts and schemas to match actual data
3. Establish migration governance process

---

## 9. Temporary Workaround Permanence

**Status: AT RISK — Placeholder state files not fully cleaned up**

**Definition**: Temporary workarounds, placeholder implementations, and TODO comments become permanent production code through neglect.

**Symptoms**:
- Files with `placeholder` or `stub` in the name persist beyond their intended phase
- TODO comments older than 30 days
- Mock data used in production paths
- `_placeholder` suffixes on production enum values

**Current Evidence**:
- Settlement states use `processing_placeholder` and `completed_placeholder` suffixes
- Payment methods include `card_placeholder` and `pay_placeholder`

**Detection Method**:
- Grep for `placeholder`, `stub`, `TODO`, `HACK`, `FIXME` in production code
- Track file age of temporary artifacts
- Phase milestone review: check that phase-specific placeholders are resolved

**Blocking Rule**: R-071 (feature flags/dev shortcuts in production)

**Recovery Path**:
1. Rename placeholder enum values to production names (Wave 1)
2. Remove or replace all placeholder implementations before live integration (Wave 6)
3. Add CI check flagging new `placeholder`/`TODO` additions

---

## 10. Audit Trail Absence

**Status: ACTIVE — No audit infrastructure exists**

**Definition**: Mutations to critical entities occur without recording who did what, when, making incident investigation and compliance impossible.

**Symptoms**:
- No `audit_logs` table exists
- State changes cannot be traced to an actor
- Disputes cannot be investigated (no history)
- Financial reconciliation has no paper trail

**Current Evidence**:
- No audit log table, service, or interceptor exists in any surface
- Mutations in mock/placeholder code do not emit audit events

**Detection Method**:
- Schema check: `audit_logs` table MUST exist
- Code check: all mutation functions MUST call audit log service
- Coverage check: every entity in R-060 MUST have audit interceptors

**Blocking Rule**: R-060, R-061, R-062

**Recovery Path**:
1. Design audit log schema (Wave 5)
2. Implement mutation interceptors (Wave 5)
3. Build admin audit log viewer (Wave 5)

---

## 11. Currency Code Drift

**Status: ACTIVE — VND in canonical, ARS missing**

**Definition**: Currency codes in the type system do not match the actual product currency, causing incorrect formatting, calculations, and display.

**Symptoms**:
- Currency formatter produces wrong symbols or decimal places
- Product prices display in wrong currency
- Settlement calculations use wrong currency rules

**Current Evidence**:
- `CurrencyCode` type is `'USD' | 'VND'` — `shared/types/common.types.ts:4`
- Product is Argentine (should be `'ARS' | 'USD'`)
- Currency utility only formats USD and VND — `shared/utils/currency.ts`

**Detection Method**:
- Type check: `CurrencyCode` MUST include `'ARS'`
- Grep for `'VND'` in production code (should not exist)
- Currency display review: verify ARS formatting ($ symbol, 2 decimals)

**Blocking Rule**: R-012

**Recovery Path**:
1. Change `CurrencyCode` to `'ARS' | 'USD'` (Wave 1)
2. Update currency utility to support ARS (Wave 1)
3. Remove all VND references

---

## 12. Actor Taxonomy Drift

**Status: ACTIVE — Rider missing, guest not formalized**

**Definition**: The actor type system does not reflect all real actors in the platform, causing attribution gaps and permission holes.

**Symptoms**:
- Delivery actions cannot be attributed to a rider
- Guest browsing sessions have no formal identity model
- Audit logs cannot record certain actor types
- Permission matrices have gaps

**Current Evidence**:
- `AUTH_ACTOR_TYPES` is `["customer", "merchant", "admin"]` — `shared/constants/domain.constants.ts:1`
- `rider` is a real actor (delivers orders) but not in the taxonomy
- `guest` is a real actor (browses, adds to cart) but not formalized

**Detection Method**:
- Compare `AUTH_ACTOR_TYPES` to IDENTITY.md actor taxonomy
- Check audit log actor_type values against the enum
- Review all user-facing actions for actor attribution

**Blocking Rule**: R-020

**Recovery Path**:
1. Add `rider` and `guest` to `AUTH_ACTOR_TYPES` (Wave 1)
2. Define rider surface ownership and session model (Wave 4)
3. Define guest session lifecycle (Wave 4)
