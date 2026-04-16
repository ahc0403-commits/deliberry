#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cd "$ROOT_DIR"

echo "[currency-check] scanning governed write paths for forbidden currency literals"

forbidden_matches="$(
  rg -n \
    --glob '!**/package-lock.json' \
    --glob '!**/CLAUDE_PROMPT_*' \
    --glob '!docs/**' \
    --glob '!reviews/**' \
    --glob '!customer-app/**/runner/**' \
    'VND' \
    merchant-console/src \
    admin-console/src \
    public-website/src \
    shared \
    supabase/migrations \
    supabase/functions \
    2>/dev/null || true
)"

if [[ -n "$forbidden_matches" ]]; then
  echo "[currency-check] forbidden VND references found:"
  echo "$forbidden_matches"
  exit 1
fi

usd_matches="$(
  rg -n \
    --glob '!**/package-lock.json' \
    --glob '!docs/**' \
    --glob '!reviews/**' \
    "currency\\s*[:=]\\s*['\"]USD['\"]" \
    merchant-console/src \
    admin-console/src \
    public-website/src \
    shared \
    supabase/migrations \
    supabase/functions \
    2>/dev/null || true
)"

if [[ -n "$usd_matches" ]]; then
  echo "[currency-check] review required: explicit USD write detected in governed code:"
  echo "$usd_matches"
  echo "[currency-check] only allowed when a committed business-basis document explicitly approves the path"
  exit 1
fi

echo "[currency-check] passed"
