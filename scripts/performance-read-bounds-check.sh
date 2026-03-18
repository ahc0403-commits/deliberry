#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

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

echo "=== Deliberry Performance Read Bounds Check ==="

CUSTOMER_INTERFACE="$ROOT/customer-app/lib/core/data/customer_runtime_gateway.dart"
CUSTOMER_GATEWAY="$ROOT/customer-app/lib/core/data/supabase_customer_runtime_gateway.dart"
CUSTOMER_CONTROLLER="$ROOT/customer-app/lib/core/data/customer_runtime_controller.dart"
MERCHANT_INTERFACE="$ROOT/merchant-console/src/shared/data/merchant-runtime-repository.ts"
MERCHANT_REPOSITORY="$ROOT/merchant-console/src/shared/data/supabase-merchant-runtime-repository.ts"
MERCHANT_ORDERS_SERVICE="$ROOT/merchant-console/src/shared/data/merchant-order-runtime-service.ts"
MERCHANT_REVIEWS_SERVICE="$ROOT/merchant-console/src/shared/data/merchant-review-runtime-service.ts"
MIGRATIONS_DIR="$ROOT/supabase/migrations"

echo "--- Customer bounded-read seams ---"
check_pattern "$CUSTOMER_INTERFACE" "readActiveOrders\\(\\{" "Customer active order seam must expose a bounded contract."
check_pattern "$CUSTOMER_INTERFACE" "readPastOrders\\(\\{" "Customer past order seam must expose a bounded contract."
check_pattern "$CUSTOMER_INTERFACE" "readAddresses\\(\\{" "Customer address seam must expose a bounded contract."
check_pattern "$CUSTOMER_INTERFACE" "readOrderReviewsBatch\\(" "Customer review hydration must use an explicit batch seam."
check_pattern "$CUSTOMER_GATEWAY" "\\.order\\('created_at', ascending: false\\)" "Customer order reads must sort by created_at desc."
check_pattern "$CUSTOMER_GATEWAY" "\\.order\\('id', ascending: false\\)" "Customer order reads must tie-break by id desc."
check_pattern "$CUSTOMER_GATEWAY" "\\.limit\\(limit\\)" "Customer bounded reads must call limit(limit)."
check_pattern "$CUSTOMER_CONTROLLER" "_chunkOrderIds" "Customer controller must batch persisted review hydration."

echo "--- Merchant bounded-read seams ---"
check_pattern "$MERCHANT_INTERFACE" "type MerchantOrdersQuery" "Merchant orders seam must expose an explicit bounded query type."
check_pattern "$MERCHANT_INTERFACE" "type MerchantReviewsQuery" "Merchant reviews seam must expose an explicit bounded query type."
check_pattern "$MERCHANT_REPOSITORY" "\\.order\\(\"created_at\", \\{ ascending: false \\}\\)" "Merchant list reads must sort by created_at desc."
check_pattern "$MERCHANT_REPOSITORY" "\\.order\\(\"id\", \\{ ascending: false \\}\\)" "Merchant list reads must tie-break by id desc."
check_pattern "$MERCHANT_REPOSITORY" "\\.limit\\(query.limit\\)" "Merchant list reads must enforce query.limit."
check_pattern "$MERCHANT_ORDERS_SERVICE" "limit: 50" "Merchant orders runtime must request a bounded first page."
check_pattern "$MERCHANT_REVIEWS_SERVICE" "limit: 25" "Merchant reviews runtime must request a bounded first page."
check_pattern "$MERCHANT_REPOSITORY" "MERCHANT_DASHBOARD_ORDER_LIMIT" "Merchant dashboard must use bounded order reads."
check_pattern "$MERCHANT_REPOSITORY" "MERCHANT_DASHBOARD_REVIEW_LIMIT" "Merchant dashboard must use bounded review reads."

echo "--- Required workload indexes ---"
check_pattern "$MIGRATIONS_DIR" "idx_orders_customer_actor_status_created_at_id_desc" "Missing customer order bounded-read index."
check_pattern "$MIGRATIONS_DIR" "idx_orders_store_created_at_id_desc" "Missing merchant order recency index."
check_pattern "$MIGRATIONS_DIR" "idx_orders_store_status_created_at_id_desc" "Missing merchant order status index."
check_pattern "$MIGRATIONS_DIR" "idx_customer_reviews_store_created_at_id_desc" "Missing merchant review recency index."
check_pattern "$MIGRATIONS_DIR" "idx_customer_addresses_actor_default_created_at_id" "Missing customer address bounded-read index."

echo "--- P1: Dashboard KPI exactness ---"
check_pattern "$MERCHANT_REPOSITORY" "getDashboardKpiSnapshot" "Merchant dashboard must use exact KPI snapshot RPC."
check_pattern "$MERCHANT_REPOSITORY" "get_merchant_dashboard_kpi_snapshot" "Merchant repository must call the dashboard KPI RPC."
check_pattern "$MERCHANT_INTERFACE" "MerchantDashboardKpiSnapshot" "Merchant interface must expose the KPI snapshot type."
check_pattern "$MIGRATIONS_DIR" "get_merchant_dashboard_kpi_snapshot" "Dashboard KPI snapshot RPC must exist in migrations."

echo "--- P1: Customer pagination seam ---"
check_pattern "$CUSTOMER_CONTROLLER" "hasMoreActiveOrders" "Customer controller must expose hasMoreActiveOrders."
check_pattern "$CUSTOMER_CONTROLLER" "hasMorePastOrders" "Customer controller must expose hasMorePastOrders."
check_pattern "$CUSTOMER_CONTROLLER" "loadMoreActiveOrders" "Customer controller must expose loadMoreActiveOrders."
check_pattern "$CUSTOMER_CONTROLLER" "loadMorePastOrders" "Customer controller must expose loadMorePastOrders."
check_pattern "$CUSTOMER_CONTROLLER" "_cursorFromLastRecord" "Customer controller must derive cursor from last record for pagination."

echo "--- P1: Customer UI load-more wiring ---"
CUSTOMER_ORDERS_SCREEN="$ROOT/customer-app/lib/features/orders/presentation/orders_screen.dart"
check_pattern "$CUSTOMER_ORDERS_SCREEN" "hasMore" "Customer orders screen must wire hasMore from controller."
check_pattern "$CUSTOMER_ORDERS_SCREEN" "onLoadMore" "Customer orders screen must wire onLoadMore callback."

echo "--- P2: Atomic address defaulting ---"
check_pattern "$MIGRATIONS_DIR" "set_customer_default_address" "Atomic address default RPC must exist in migrations."
check_pattern "$MIGRATIONS_DIR" "delete_customer_address_with_default_ensure" "Atomic address delete RPC must exist in migrations."
check_pattern "$CUSTOMER_GATEWAY" "set_customer_default_address" "Customer gateway must use atomic default RPC."
check_pattern "$CUSTOMER_GATEWAY" "delete_customer_address_with_default_ensure" "Customer gateway must use atomic delete RPC."

echo "--- P2: Merchant pagination UI wiring ---"
MERCHANT_ORDERS_SCREEN="$ROOT/merchant-console/src/features/orders/presentation/orders-screen.tsx"
MERCHANT_REVIEWS_SCREEN="$ROOT/merchant-console/src/features/reviews/presentation/reviews-screen.tsx"
check_pattern "$MERCHANT_ORDERS_SCREEN" "handleLoadMore" "Merchant orders screen must have load-more handler."
check_pattern "$MERCHANT_ORDERS_SCREEN" "hasMore" "Merchant orders screen must track hasMore state."
check_pattern "$MERCHANT_REVIEWS_SCREEN" "handleLoadMore" "Merchant reviews screen must have load-more handler."
check_pattern "$MERCHANT_REVIEWS_SCREEN" "hasMore" "Merchant reviews screen must track hasMore state."

echo "--- P2: Explain proof scaffolding ---"
check_pattern "$ROOT/scripts/performance-explain-proof.sh" "EXPLAIN ANALYZE" "Explain proof script must document EXPLAIN ANALYZE commands."

echo ""
echo "RESULT: PASS — P0 + P1 + P2 bounded reads, indexes, exactness, atomicity, pagination, and proof checks are present"
