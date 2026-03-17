# Backend Foundation Gap Assessment

Date: 2026-03-17
Status: Active
Purpose: Identify the exact missing backend infrastructure blocking runtime wiring

---

## Current State: Zero Backend

| Layer | Status |
|-------|--------|
| Database | None — no Supabase, no Postgres, no SQLite |
| Auth provider | None — cookie-based demo auth only |
| API layer | None — no route handlers, no REST, no tRPC |
| ORM / query builder | None — no Prisma, no Drizzle, no Supabase client |
| Migrations | None — no migration directory |
| Environment config | None — no .env files |
| Supabase project | None — no `supabase/` directory |
| Package dependencies | Zero database-related packages in any surface |

---

## What Is Ready (Governance + Contract Layer)

These are complete and waiting to be wired:

| Asset | Location | Ready For |
|-------|----------|-----------|
| `AuditLogEntry` type | `shared/types/audit.types.ts` | Audit table schema + interceptors |
| `audit.schema.json` | `shared/validation/audit.schema.json` | Audit validation |
| 5 transition validators | `shared/utils/transitions.ts` | Mutation guard wiring |
| `OrderSummary` with per-status timestamps | `shared/models/domain.models.ts` | Order table schema |
| `AdminSession` with role + actorType | `admin-console/src/shared/auth/admin-session.ts` | Supabase Auth claims |
| `MerchantSession` with actorType | `merchant-console/src/shared/auth/merchant-session.ts` | Supabase Auth claims |
| `CustomerSessionController` with guest gate | `customer-app/lib/core/session/` | Supabase Auth integration |
| `formatMoney()` | `shared/utils/currency.ts` | Already wired through adapters |
| Canonical enums | `shared/constants/domain.constants.ts` | Database enum types |
| `PAYMENT_METHODS` | `shared/constants/domain.constants.ts` | `cash`, `card`, `digital_wallet` |
| API contracts (canonical names) | `shared/api/*.contract.json` | API route scaffolding |
| CI governance scan | `scripts/governance-scan.sh` | Pre-merge validation |

---

## What Is Missing (Blocking Runtime Wiring)

### Foundation 1: Supabase Project Setup
- **What**: `supabase init`, project link, local dev environment
- **Produces**: `supabase/` directory, `supabase/config.toml`, migration infrastructure
- **Blocks**: Everything else

### Foundation 2: Core Database Schema (Migrations)
- **What**: Tables for orders, payments, settlements, disputes, users, merchants, stores, audit_logs
- **Produces**: PostgreSQL tables matching governance contracts
- **Key decisions**:
  - `orders` table must include all per-status timestamp columns (confirmedAt, preparingAt, etc.)
  - `audit_logs` table must match `AuditLogEntry` type exactly
  - `status` columns must use canonical enum values
  - `money` columns must be `integer` (centavos)
  - `timestamp` columns must be `timestamptz` (UTC)
- **Blocks**: All data operations

### Foundation 3: Supabase Auth Configuration
- **What**: Auth providers (email/phone OTP for customer, email/password for merchant+admin)
- **Produces**: `auth.users` table, JWT tokens with custom claims
- **Key decisions**:
  - Customer: phone/OTP flow matching `CustomerAuthStatus` enum
  - Merchant: email/password with `actorType` in JWT metadata
  - Admin: email/password + MFA with `role: PermissionRole` in JWT metadata
  - Guest: anonymous session with restricted RLS
- **Blocks**: Real auth wiring, session token replacement

### Foundation 4: Row-Level Security (RLS)
- **What**: Postgres RLS policies enforcing governance access rules
- **Produces**: Per-table security policies
- **Key policies**:
  - Merchants can only read/write their own store data (R-023)
  - Customers can only read their own orders (R-024 + own-data scope)
  - Admin roles have scoped platform access (R-022)
  - Audit logs are insert-only, no update/delete (R-062)
  - Orders/payments/settlements are never deleted (R-030, R-031, R-032)
- **Blocks**: Secure data access, audit write protection

### Foundation 5: Supabase Client Integration
- **What**: `@supabase/supabase-js` in web surfaces, `supabase_flutter` in customer-app
- **Produces**: Authenticated client instances per surface
- **Blocks**: All real data fetching and mutations

### Foundation 6: Server Action / API Mutation Layer
- **What**: Real mutation handlers in merchant-console and admin-console server actions
- **Produces**: Authenticated write paths for order status changes, etc.
- **Key requirement**: Each mutation must:
  1. Validate transition via `isValidXxxTransition()`
  2. Populate per-status timestamp
  3. Create `AuditLogEntry`
  4. Execute within a Supabase transaction
- **Blocks**: Audit interceptor wiring, transition enforcement, timestamp population

---

## Dependencies Graph

```
Foundation 1 (Supabase init)
  └── Foundation 2 (Schema/migrations)
       ├── Foundation 4 (RLS policies)
       └── Foundation 3 (Auth config)
            └── Foundation 5 (Client integration)
                 └── Foundation 6 (Mutation layer)
                      ├── Audit interceptor wiring
                      ├── Transition validator integration
                      └── Timestamp population
```

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Supabase project creation requires account/org | Blocks everything | Must be resolved first |
| Schema migration errors | Data integrity | Use governance contracts as schema source of truth |
| RLS policy complexity | Security gaps | Start with restrictive policies, loosen carefully |
| Auth provider mismatch with current session types | Breaking changes | Session types already have correct fields, just need real token population |
| Customer-app Flutter + Supabase integration | Platform-specific issues | Use official `supabase_flutter` package |

---

*Assessment completed: 2026-03-17*
