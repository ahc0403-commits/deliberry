#!/usr/bin/env bash
set -euo pipefail

ROOT="${1:-.}"

echo "== customer-app =="
bash "$ROOT/scripts/customer-mobile-scroll-trap-check.sh" "$ROOT/customer-app/lib"

echo
echo "== web surfaces =="
bash "$ROOT/scripts/web-mobile-scroll-trap-check.sh" "$ROOT"
