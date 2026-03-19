# Performance Scale Wave P2: Atomicity, Pagination, and Proof Report

## Scope Executed
This pass closed three gaps left open after P1:
1. Atomic address defaulting — replaced multi-step client-side default switching with single-transaction DB RPCs
2. Merchant console next-page UI — wired load-more buttons for orders and reviews using existing cursor-capable repository seams
3. Explain/proof scaffolding — added static RPC/index validation and documented exact EXPLAIN ANALYZE commands for operator-run live DB verification

This pass did not touch queue/background architecture, caching, settlement/payment, admin/public surfaces, or speculative platform work.

## Files Changed

### New files
- `supabase/migrations/20260318160000_phase_p2_atomic_address_defaulting.sql` — two RPCs for atomic address operations
- `merchant-console/src/features/reviews/server/review-actions.ts` — server action for loading more reviews
- `scripts/performance-explain-proof.sh` — static validation + manual EXPLAIN ANALYZE reference

### Modified files
- `customer-app/lib/core/data/supabase_customer_runtime_gateway.dart` — replaced `_clearDefaultAddresses()`, `_ensureSingleDefaultAddress()`, and multi-step `setDefaultAddress()`/`deleteAddress()`/`saveAddress()` with atomic RPC calls
- `merchant-console/src/features/orders/server/order-actions.ts` — added `loadMoreMerchantOrdersAction` server action
- `merchant-console/src/features/orders/presentation/orders-screen.tsx` — added `hasMore`/`isLoadingMore` state, `handleLoadMore` handler, and "Load more orders" button
- `merchant-console/src/app/(console)/[storeId]/orders/page.tsx` — passes `initialHasMore` to orders screen
- `merchant-console/src/features/reviews/presentation/reviews-screen.tsx` — added `reviews`/`hasMore`/`isLoadingMore` state, `handleLoadMore` handler, and "Load more reviews" button
- `merchant-console/src/app/(console)/[storeId]/reviews/page.tsx` — passes `storeId` and `initialHasMore` to reviews screen
- `scripts/performance-read-bounds-check.sh` — added P2 gate checks for atomic RPCs, merchant pagination UI, and explain proof script
- `scripts/runtime-integrity-smoke.sh` — wired explain proof script into smoke test

## Migration / RPC Additions

### `set_customer_default_address(p_actor_id uuid, p_address_id text)`
- Atomically clears all other defaults for the customer and sets the target address as default
- Returns the refreshed address list in canonical order (is_default DESC, created_at ASC, id ASC) with LIMIT 20
- Uses `SECURITY DEFINER` + PL/pgSQL for transactional atomicity

### `delete_customer_address_with_default_ensure(p_actor_id uuid, p_address_id text)`
- Atomically deletes the target address
- If no default remains, promotes the oldest remaining address
- Returns the refreshed address list in canonical order with LIMIT 20
- Uses `SECURITY DEFINER` + PL/pgSQL for transactional atomicity

## Atomicity Gaps Closed

### Before P2
- `setDefaultAddress()`: two separate queries — `_clearDefaultAddresses()` then `UPDATE is_default=true` — race-prone under concurrent calls
- `deleteAddress()`: `DELETE` then `_ensureSingleDefaultAddress()` which reads, conditionally updates, then re-reads — 3-4 round trips with race window
- `saveAddress()` with `isDefault=true`: `_clearDefaultAddresses()` then `upsert` then `_ensureSingleDefaultAddress()` — same race

### After P2
- `setDefaultAddress()`: single RPC call `set_customer_default_address` — one transaction, no race
- `deleteAddress()`: single RPC call `delete_customer_address_with_default_ensure` — one transaction, default repair included
- `saveAddress()`: upsert followed by atomic RPC for default enforcement — default switching is atomic even if upsert is a separate call
- Removed `_clearDefaultAddresses()` and `_ensureSingleDefaultAddress()` entirely

## Pagination / UI Gaps Closed

### Merchant Orders
- `MerchantOrdersScreen` now tracks `hasMore` and `isLoadingMore` state
- `handleLoadMore()` calls `loadMoreMerchantOrdersAction` server action with cursor from last loaded order
- "Load more orders" button appears below the order table when more pages exist
- Page size: 50 orders per page, matching existing bounded read contract
- Cursor uses `created_at DESC, id DESC` ordering — preserves P0 contract

### Merchant Reviews
- `MerchantReviewsScreen` now tracks `reviews`, `hasMore`, and `isLoadingMore` state
- `handleLoadMore()` calls `loadMoreMerchantReviewsAction` server action with cursor from last loaded review
- "Load more reviews" button appears below the review list when more pages exist
- Page size: 25 reviews per page, matching existing bounded read contract
- Review counts (filter tabs, summary band) now derive from live `reviews` state rather than initial `data.reviews`

## Proof / Gate Improvements Added

### New script: `performance-explain-proof.sh`
- Static checks: validates presence of all required RPCs and indexes in migration history
- Manual reference: documents exact EXPLAIN ANALYZE commands for the 5 scale-critical query paths
- Does NOT claim live DB proof — clearly states it requires manual operator execution against a real instance
- Wired into `runtime-integrity-smoke.sh`

### New checks in `performance-read-bounds-check.sh` (8 checks)

#### P2: Atomic address defaulting (4 checks)
- `set_customer_default_address` in migrations
- `delete_customer_address_with_default_ensure` in migrations
- Atomic default RPC call in customer gateway
- Atomic delete RPC call in customer gateway

#### P2: Merchant pagination UI wiring (4 checks)
- `handleLoadMore` in merchant orders screen
- `hasMore` in merchant orders screen
- `handleLoadMore` in merchant reviews screen
- `hasMore` in merchant reviews screen

#### P2: Explain proof scaffolding (1 check)
- `EXPLAIN ANALYZE` documented in proof script

## Validation Commands Run

| Command | Result |
|---------|--------|
| `bash scripts/performance-read-bounds-check.sh` | PASS — all P0 + P1 + P2 checks |
| `flutter analyze` (customer-app) | No issues found |
| `npm run typecheck` (merchant-console) | Pass |
| `npm run build` (merchant-console) | Pass |
| `bash scripts/migration-promotion-check.sh` | PASS — 23 migrations, ordered and unique |
| `bash scripts/performance-explain-proof.sh` | PASS — static checks; manual EXPLAIN commands documented |

## Manual-Only Proof Steps Requiring Live DB

The following cannot be proven in CI without a live Supabase instance:

1. **EXPLAIN ANALYZE for customer order reads** — verify Index Scan on `idx_orders_customer_actor_status_created_at_id_desc`
2. **EXPLAIN ANALYZE for merchant order reads** — verify Index Scan on `idx_orders_store_created_at_id_desc`
3. **EXPLAIN ANALYZE for merchant review reads** — verify Index Scan on `idx_customer_reviews_store_created_at_id_desc`
4. **EXPLAIN ANALYZE for customer address reads** — verify Index Scan on `idx_customer_addresses_actor_default_created_at_id`
5. **EXPLAIN ANALYZE for dashboard KPI snapshot** — verify aggregate queries use appropriate indexes
6. **Atomic address RPC correctness** — verify exactly one default remains after concurrent set-default calls

All commands are documented in `scripts/performance-explain-proof.sh`.

## Remaining Scale Gaps Still Open After P2

1. **RLS cost proof at scale**: indexes exist but plan cost under high-volume RLS is unproven without live load testing
2. **Persisted-first fallback divergence**: fallback model can drift from backend truth under prolonged degradation
3. **Caching/read-shaping**: no cache strategy for repeated hydration reads
4. **Queue/retry architecture**: still absent — no async job/retry layer for non-request-bound work
5. **Customer address load-more UI**: seam exposed but no button needed at current 20-address limit
6. **Search scalability**: customer/merchant search is still local filter logic
7. **Live EXPLAIN proof execution**: documented but not yet run against a production-representative dataset
