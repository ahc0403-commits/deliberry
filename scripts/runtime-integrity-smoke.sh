#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ARTIFACT_DIR="${DELIBERRY_ARTIFACT_DIR:-}"
SUMMARY_FILE=""

if [ -n "$ARTIFACT_DIR" ]; then
  mkdir -p "$ARTIFACT_DIR"
  SUMMARY_FILE="$ARTIFACT_DIR/runtime-integrity-summary.txt"
  : > "$SUMMARY_FILE"
fi

log_summary() {
  if [ -n "$SUMMARY_FILE" ]; then
    echo "$1" >> "$SUMMARY_FILE"
  fi
}

echo "=== Deliberry Runtime Integrity Smoke ==="
log_summary "runtime_integrity_smoke=started"

echo ""
echo "--- Governance scan ---"
bash "$ROOT/scripts/governance-scan.sh"
log_summary "governance_scan=pass"

echo ""
echo "--- Migration promotion check ---"
DELIBERRY_ARTIFACT_DIR="$ARTIFACT_DIR" bash "$ROOT/scripts/migration-promotion-check.sh"
log_summary "migration_promotion_check=pass"

echo ""
echo "--- Shared JSON validation ---"
while IFS= read -r file; do
  echo "Validating $file"
  python3 -m json.tool "$file" >/dev/null
done < <(
  find "$ROOT/shared/api" "$ROOT/shared/validation" -type f -name "*.json" | sort
)
log_summary "shared_json_validation=pass"

echo ""
echo "--- Performance read-bounds check ---"
bash "$ROOT/scripts/performance-read-bounds-check.sh"
log_summary "performance_read_bounds_check=pass"

echo ""
echo "--- Performance explain proof scaffolding ---"
bash "$ROOT/scripts/performance-explain-proof.sh"
log_summary "performance_explain_proof=pass"

echo ""
echo "--- Customer app validation ---"
(
  cd "$ROOT/customer-app"
  flutter analyze
)
log_summary "customer_app_validation=pass"

for surface in merchant-console admin-console public-website; do
  echo ""
  echo "--- ${surface} validation ---"
  (
    cd "$ROOT/$surface"
    npm run typecheck
    npm run build
  )
  log_summary "${surface}_validation=pass"
done

echo ""
echo "RESULT: PASS — runtime integrity smoke completed"
log_summary "runtime_integrity_smoke=pass"
