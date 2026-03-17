#!/usr/bin/env bash
# Governance Scan — minimum viable enforcement per ENFORCEMENT_CHECKLIST.md
# Run: bash scripts/governance-scan.sh
# Exit code 0 = pass, non-zero = violations found
set -euo pipefail

FAIL=0
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "=== Deliberry Governance Scan ==="
echo ""

# 1. Shared forbidden-content scan (ENFORCEMENT_CHECKLIST Pre-Merge §2)
echo "--- 1. Shared forbidden-content scan ---"
FORBIDDEN_EXTS=$(find "$ROOT/shared" -type f \( -name "*.tsx" -o -name "*.jsx" -o -name "*.vue" \) 2>/dev/null || true)
if [ -n "$FORBIDDEN_EXTS" ]; then
  echo "FAIL: UI component files found in shared/"
  echo "$FORBIDDEN_EXTS"
  FAIL=1
else
  echo "PASS: No UI components in shared/"
fi

# 2. Cross-surface import scan (ENFORCEMENT_CHECKLIST Pre-Merge §3)
echo ""
echo "--- 2. Cross-surface import scan ---"
SURFACES=("customer-app" "merchant-console" "admin-console" "public-website")
CROSS_IMPORTS=0
for surface in "${SURFACES[@]}"; do
  for other in "${SURFACES[@]}"; do
    if [ "$surface" != "$other" ]; then
      HITS=$(grep -r "from.*['\"].*${other}" "$ROOT/$surface/src" 2>/dev/null || true)
      if [ -n "$HITS" ]; then
        echo "FAIL: $surface imports from $other"
        echo "$HITS"
        CROSS_IMPORTS=1
      fi
    fi
  done
done
if [ "$CROSS_IMPORTS" -eq 0 ]; then
  echo "PASS: No cross-surface imports"
else
  FAIL=1
fi

# 3. Placeholder suffix scan — Decay Mode 9 (DECAY_PATH.md)
echo ""
echo "--- 3. Placeholder suffix scan ---"
PLACEHOLDER_HITS=$(grep -r "_placeholder" "$ROOT/shared/constants/" "$ROOT/shared/api/" 2>/dev/null || true)
if [ -n "$PLACEHOLDER_HITS" ]; then
  echo "WARN: _placeholder suffixes found (check if deprecated aliases)"
  echo "$PLACEHOLDER_HITS"
else
  echo "PASS: No _placeholder suffixes in constants or API contracts"
fi

# 4. Excluded feature scan (ENFORCEMENT_CHECKLIST Pre-Merge §4)
echo ""
echo "--- 4. Excluded feature reference scan ---"
EXCLUDED_PATTERNS="realtime_tracking|mapbox|google.maps|kakao.maps|qr_scanner|qr_generation"
EXCLUDED_HITS=$(grep -ri "$EXCLUDED_PATTERNS" \
  "$ROOT/merchant-console/src" \
  "$ROOT/admin-console/src" \
  "$ROOT/public-website/src" \
  "$ROOT/shared" \
  2>/dev/null | grep -v "node_modules" || true)
if [ -n "$EXCLUDED_HITS" ]; then
  echo "FAIL: Excluded feature references found"
  echo "$EXCLUDED_HITS"
  FAIL=1
else
  echo "PASS: No excluded feature references"
fi

# 5. Public-website auth scan (ENFORCEMENT_CHECKLIST Pre-Merge §5)
echo ""
echo "--- 5. Public-website auth scan ---"
PW_AUTH=$(grep -rn "import.*session\|import.*auth.*provider\|import.*route.*guard\|getServerSession\|useSession\|SessionProvider" "$ROOT/public-website/src" 2>/dev/null | grep -v "node_modules" || true)
if [ -n "$PW_AUTH" ]; then
  echo "FAIL: Auth-related imports found in public-website"
  echo "$PW_AUTH"
  FAIL=1
else
  echo "PASS: No auth in public-website"
fi

# 6. Float money scan — Decay Mode 2 (shared contracts only)
# Only flag money-semantic fields (price, amount, total, fee, cost, revenue, commission, budget, spent)
echo ""
echo "--- 6. Float money in shared contracts ---"
FLOAT_MONEY=$(grep -B1 '"type": "number"' "$ROOT/shared/validation/"*.json 2>/dev/null | grep -iE "price|amount|total|fee|cost|revenue|commission|budget|spent|payout|net|gross" || true)
if [ -n "$FLOAT_MONEY" ]; then
  echo "WARN: 'type: number' found for money-semantic fields in validation schemas (should be 'integer')"
  echo "$FLOAT_MONEY"
else
  echo "PASS: No float money types in validation schemas"
fi

echo ""
echo "=== Scan complete ==="
if [ "$FAIL" -ne 0 ]; then
  echo "RESULT: FAIL — governance violations detected"
  exit 1
else
  echo "RESULT: PASS — no governance violations"
  exit 0
fi
