# Backend Runtime Wiring Execution Plan

Date: 2026-03-17
Status: Active
Purpose: Minimum viable backend foundation + runtime wiring implementation order

---

## Execution Summary

6 foundation phases, executed sequentially. Each phase unlocks the next. The first 3 phases create the database + auth infrastructure. Phases 4-6 wire the governance contracts into live runtime paths.

---

## Phase B1 — Supabase Project Init (MUST DO FIRST)

**What**: Initialize Supabase local development environment
**Produces**: `supabase/` directory, config, seed structure

**Steps**:
1. `npx supabase init` in repo root
2. Configure `supabase/config.toml` for local dev
3. Create `supabase/migrations/` directory
4. Create `supabase/seed.sql` placeholder
5. Add `.env.local` templates for each web surface with Supabase URL + anon key

**Validation**: `npx supabase start` runs local Supabase stack

**Unlocks**: Phase B2

---

## Phase B2 — Core Database Schema

**What**: Create PostgreSQL tables matching governance contracts
**Produces**: Migration files with full schema

**Tables required** (minimum viable):

| Table | Source Contract | Key Constraints |
|-------|----------------|-----------------|
| `orders` | `OrderSummary` + `order.schema.json` | status enum, centavo integers, per-status timestamps, no DELETE |
| `order_items` | `OrderItem` type | FK to orders, centavo price |
| `payments` | `PAYMENT_STATUSES` | status enum, centavo amount, no DELETE |
| `settlements` | `SETTLEMENT_STATES` | status enum, centavo amounts, periodStart/End dates, no DELETE |
| `disputes` | `DISPUTE_STATUSES` | status enum, FK to orders, no DELETE |
| `support_tickets` | `SUPPORT_TICKET_STATUSES` | status enum |
| `merchants` | Mock data types | FK to auth.users |
| `stores` | Mock data types | FK to merchants |
| `audit_logs` | `AuditLogEntry` type | INSERT only, no UPDATE/DELETE, actor fields |

**Migration naming**: `YYYYMMDDHHMMSS_create_core_tables.sql`

**Rules**:
- All money columns: `integer NOT NULL` (centavos)
- All status columns: `text NOT NULL CHECK (value IN (...))` using canonical enum values
- All timestamps: `timestamptz` (UTC)
- No `CASCADE DELETE` on orders, payments, settlements, disputes (R-030–033)
- `audit_logs`: no UPDATE/DELETE trigger, insert-only

**Validation**: `npx supabase db reset` applies migrations cleanly

**Unlocks**: Phase B3, B4

---

## Phase B3 — Supabase Auth Configuration

**What**: Configure auth providers for each actor type
**Produces**: Auth configuration + custom claims

**Provider setup**:

| Actor | Auth Method | Custom Claims |
|-------|------------|---------------|
| Customer | Phone/OTP | `actor_type: "customer"` |
| Guest | Anonymous session | `actor_type: "guest"` |
| Merchant | Email/Password | `actor_type: "merchant_owner"`, `store_id` |
| Admin | Email/Password + MFA | `actor_type: "admin"`, `role: PermissionRole` |

**Implementation**:
1. Configure phone OTP provider in Supabase dashboard/config
2. Create `supabase/functions/` directory for custom claim functions
3. Create claim-setting hook that populates `app_metadata` with `actor_type` and `role`
4. Create `supabase/seed.sql` with demo users matching current mock data

**Validation**: Can sign in as each actor type via Supabase Auth locally

**Unlocks**: Phase B5

---

## Phase B4 — Row-Level Security (RLS)

**What**: Postgres RLS policies enforcing governance access rules
**Produces**: Migration file with RLS policies

**Depends on**: Phase B2 (tables), Phase B3 (auth claims)

**Key policies**:

| Table | Policy | Rule |
|-------|--------|------|
| `orders` | Customer reads own | `auth.uid() = customer_id` |
| `orders` | Merchant reads store | `store_id IN (merchant's stores)` |
| `orders` | Admin reads all | `role IN PERMISSION_ROLES` |
| `stores` | Merchant manages own | `merchant_id = auth.uid()` |
| `audit_logs` | Insert only | `USING (false) WITH CHECK (true)` on SELECT for actors, service role for reads |
| `audit_logs` | No update/delete | No UPDATE/DELETE policy |
| `settlements` | No delete | No DELETE policy |

**Validation**: RLS test queries fail for unauthorized access, pass for authorized

**Unlocks**: Secure data access

---

## Phase B5 — Supabase Client Integration

**What**: Install Supabase clients in all surfaces
**Produces**: Authenticated Supabase instances per surface

**Steps**:
1. `npm install @supabase/supabase-js @supabase/ssr` in merchant-console, admin-console, public-website
2. `flutter pub add supabase_flutter` in customer-app
3. Create surface-local Supabase client utilities:
   - `merchant-console/src/shared/supabase/client.ts` (server + browser)
   - `admin-console/src/shared/supabase/client.ts` (server + browser)
   - `customer-app/lib/core/supabase/supabase_client.dart`
4. Replace cookie-based demo auth with real Supabase Auth session
5. Update `readAdminSession()`, `readMerchantSession()`, `CustomerSessionController` to read from Supabase auth

**Validation**: `npm run typecheck` + `flutter analyze` pass. Auth sign-in/out works against local Supabase.

**Unlocks**: Phase B6

---

## Phase B6 — Mutation Layer + Runtime Wiring

**What**: Real mutation handlers with governance contract wiring
**Produces**: Live data writes with audit trail, transition validation, timestamp population

**This is where all governance contracts become runtime-active.**

**Per mutation handler pattern**:
```
1. Authenticate actor (Supabase Auth session)
2. Validate transition: isValidXxxTransition(currentStatus, newStatus)
3. Populate per-status timestamp: confirmedAt = new Date().toISOString()
4. Execute mutation in Supabase transaction
5. Create AuditLogEntry in same transaction
6. Return updated entity
```

**Priority mutations** (ordered by user impact):
1. Order status transitions (merchant: accept, prepare, ready)
2. Order creation (customer: submit order)
3. Cart persistence (customer: add/remove items)
4. Settlement status updates (admin: process, pay)
5. Dispute status updates (admin: investigate, resolve)
6. Support ticket updates (admin: assign, resolve, close)

**Validation**: Full mutation cycle works end-to-end with audit log entries created

---

## What Unlocks Runtime Wiring Immediately

After Phase B1 + B2 + B3:
- Real database exists
- Auth providers configured
- Tables match governance contracts

After Phase B5:
- Surfaces can authenticate against real Supabase Auth
- Data fetching can switch from in-memory mock to real queries

After Phase B6:
- All 5 governance runtime carry-forward items are resolved:
  1. Audit interceptor wiring ✓
  2. Transition validator integration ✓
  3. Order per-status timestamp population ✓
  4. Real auth wiring ✓
  5. formatMoney already adopted in Phase 1-3 UI rebuild ✓

---

## What Can Wait

| Item | Why It Can Wait |
|------|----------------|
| Real payment provider (Stripe/MercadoPago) | R-074 requires finance/legal review first |
| Real-time order tracking (WebSockets) | Excluded feature per governance |
| Map API integration | Excluded feature per governance |
| QR code features | Excluded feature per governance |
| Email/push notifications | Nice-to-have after core mutations work |
| Analytics pipeline | Dashboard shows mock KPIs; real analytics is post-launch |
| Public-website form submission | Currently manual email handoff; acceptable |

---

## Estimated Effort

| Phase | Effort | Depends On |
|-------|--------|------------|
| B1: Supabase init | Small (1 session) | Nothing |
| B2: Schema migrations | Medium (1-2 sessions) | B1 |
| B3: Auth config | Medium (1-2 sessions) | B1 |
| B4: RLS policies | Medium (1 session) | B2 + B3 |
| B5: Client integration | Medium (1-2 sessions) | B3 |
| B6: Mutation layer | Large (2-4 sessions) | B4 + B5 |

---

*Plan established: 2026-03-17*
