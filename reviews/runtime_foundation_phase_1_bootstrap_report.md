Status: active
Authority: implementation report
Surface: cross-surface
Domains: runtime-foundation, backend-bootstrap, auth-baseline, schema-baseline
Last updated: 2026-03-17
Last verified: 2026-03-17
Retrieve when:
- checking what Phase 1 runtime-foundation work actually added
- deciding what Phase 2 should wire on top of the new backend bootstrap seam
Related files:
- /Users/andremacmini/Deliberry/reviews/runtime_foundation_execution_plan.md
- /Users/andremacmini/Deliberry/supabase/config.toml
- /Users/andremacmini/Deliberry/supabase/migrations/20260317150000_phase_1_runtime_foundation.sql
- /Users/andremacmini/Deliberry/merchant-console/src/shared/auth/merchant-auth-adapter.ts
- /Users/andremacmini/Deliberry/admin-console/src/shared/auth/admin-auth-adapter.ts
- /Users/andremacmini/Deliberry/customer-app/lib/core/session/customer_auth_adapter.dart

# Runtime Foundation Phase 1 Bootstrap Report

## Objective

Stand up the first real backend/auth bootstrap baseline without migrating any live product flow yet.

## Chosen Backend Direction

Phase 1 adopts Supabase as the backend bootstrap direction because it matches the repo's current constraints best:

- one database + auth provider
- one migration path
- one actor/session source
- one place to enforce audit and transition rules later
- web and Flutter client support without collapsing surface ownership

## What Phase 1 Added

### Backend scaffold

- `supabase/config.toml`
- `supabase/seed.sql`
- `supabase/migrations/20260317150000_phase_1_runtime_foundation.sql`

### Minimum persistent schema baseline

The new migration creates:

- `actor_profiles`
- `merchant_profiles`
- `admin_profiles`
- `stores`
- `merchant_store_memberships`
- `orders`
- `audit_logs`

This is intentionally narrower than a full domain migration. Payments, disputes, settlements, and support-ticket persistence remain Phase 2+ work.

### Auth/session seam files

Surface-local adapters now exist for later cutover:

- merchant auth adapter seam
- admin auth adapter seam
- customer auth adapter seam

These files define the future provider-backed identity/session shape without changing current live runtime behavior.

### Repository/runtime seam files

Surface-local runtime repository interfaces now exist for:

- merchant data access and order mutation
- admin oversight reads
- customer order submit/read cutover

These seams let later phases replace fixture/local repositories incrementally instead of rewriting route code first.

## What Phase 1 Explicitly Did Not Do

- no customer flow migration
- no merchant flow migration
- no admin flow migration
- no Supabase client package installation
- no auth provider wiring into live screens or server actions
- no row-level security policies yet
- no audit interceptor wiring yet
- no transition validation wiring into live mutations yet

## What Is Now Unblocked

- local Supabase project initialization
- database reset/apply flow using a real migration directory
- Phase 2 auth-client setup for customer, merchant, and admin
- Phase 2 order persistence cutover planning against a real order table
- Phase 2 audit log write-path implementation against a real immutable table

## Phase 2 Entry Condition

Phase 2 may start once:

1. Supabase local stack is initialized successfully from this scaffold.
2. Surface clients are added (`@supabase/supabase-js`, `@supabase/ssr`, `supabase_flutter`).
3. Session adapters begin replacing cookie-only and in-memory session sources one surface at a time.
