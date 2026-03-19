#!/usr/bin/env bash
set -euo pipefail

# Performance Explain Proof Scaffolding
# This script documents the exact EXPLAIN ANALYZE commands an operator should run
# against a live Supabase instance to prove query-plan quality for scale-critical reads.
# It also validates that the required RPC seams and indexes exist statically.
#
# This script does NOT connect to a live database. It is a manual operator reference
# combined with static checks that can run in CI.

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
MIGRATIONS_DIR="$ROOT/supabase/migrations"

check_pattern() {
  local target="$1"
  local pattern="$2"
  local message="$3"

  if command -v rg >/dev/null 2>&1; then
    if ! rg -q "$pattern" "$target"; then
      echo "FAIL: $message"
      echo "  target: $target"
      exit 1
    fi
  else
    if ! grep -rqE "$pattern" "$target"; then
      echo "FAIL: $message"
      echo "  target: $target"
      exit 1
    fi
  fi
}

echo "=== Deliberry Performance Explain Proof Scaffolding ==="

echo ""
echo "--- Static: Required RPC seams in migrations ---"
check_pattern "$MIGRATIONS_DIR" "get_merchant_dashboard_kpi_snapshot" "Dashboard KPI snapshot RPC must exist."
check_pattern "$MIGRATIONS_DIR" "set_customer_default_address" "Atomic address default RPC must exist."
check_pattern "$MIGRATIONS_DIR" "delete_customer_address_with_default_ensure" "Atomic address delete RPC must exist."

echo ""
echo "--- Static: Required workload indexes ---"
check_pattern "$MIGRATIONS_DIR" "idx_orders_customer_actor_status_created_at_id_desc" "Customer order index required."
check_pattern "$MIGRATIONS_DIR" "idx_orders_store_created_at_id_desc" "Merchant order recency index required."
check_pattern "$MIGRATIONS_DIR" "idx_orders_store_status_created_at_id_desc" "Merchant order status index required."
check_pattern "$MIGRATIONS_DIR" "idx_customer_reviews_store_created_at_id_desc" "Merchant review index required."
check_pattern "$MIGRATIONS_DIR" "idx_customer_addresses_actor_default_created_at_id" "Customer address index required."

echo ""
echo "RESULT: PASS — static explain proof checks passed"

echo ""
echo "=== Manual EXPLAIN ANALYZE Commands for Live DB ==="
echo ""
echo "Run these against a live Supabase instance with representative data."
echo "Each query should show Index Scan or Index Only Scan, not Seq Scan."
echo ""
echo "-- 1. Customer active orders (bounded, cursor-ready)"
echo "EXPLAIN ANALYZE"
echo "SELECT id, order_number, status, total_centavos, created_at"
echo "FROM public.orders"
echo "WHERE customer_actor_id = '<uuid>' AND status IN ('pending','confirmed','preparing','ready','in_transit')"
echo "ORDER BY created_at DESC, id DESC"
echo "LIMIT 20;"
echo ""
echo "-- 2. Merchant orders by store (bounded)"
echo "EXPLAIN ANALYZE"
echo "SELECT id, order_number, status, total_centavos, created_at"
echo "FROM public.orders"
echo "WHERE store_id = '<uuid>'"
echo "ORDER BY created_at DESC, id DESC"
echo "LIMIT 50;"
echo ""
echo "-- 3. Merchant reviews by store (bounded)"
echo "EXPLAIN ANALYZE"
echo "SELECT r.id, r.rating, r.review_text, r.created_at"
echo "FROM public.customer_reviews r"
echo "WHERE r.store_id = '<uuid>'"
echo "ORDER BY r.created_at DESC, r.id DESC"
echo "LIMIT 25;"
echo ""
echo "-- 4. Customer addresses (bounded)"
echo "EXPLAIN ANALYZE"
echo "SELECT id, label, street, detail, is_default"
echo "FROM public.customer_addresses"
echo "WHERE customer_actor_id = '<uuid>'"
echo "ORDER BY is_default DESC, created_at ASC, id ASC"
echo "LIMIT 20;"
echo ""
echo "-- 5. Dashboard KPI snapshot (aggregate)"
echo "EXPLAIN ANALYZE"
echo "SELECT get_merchant_dashboard_kpi_snapshot('<store-uuid>');"
echo ""
echo "Expected: all queries should use Index Scan on the P0 workload indexes."
echo "If any show Seq Scan, investigate missing index or stale statistics."
