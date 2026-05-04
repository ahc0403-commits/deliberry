#!/usr/bin/env bash
set -euo pipefail

supabase_url="${SUPABASE_URL:-}"
anon_key="${SUPABASE_ANON_KEY:-}"
service_role_key="${SUPABASE_SERVICE_ROLE_KEY:-}"
vnpay_hash_secret="${VNPAY_SANDBOX_HASH_SECRET:-}"

echo "Phase 1 VNPAY sandbox guardrail smoke environment check"

if [[ -n "$supabase_url" ]]; then
  echo "SUPABASE_URL is present."
else
  echo "SUPABASE_URL is absent."
fi

if [[ -n "$anon_key" ]]; then
  echo "SUPABASE_ANON_KEY is present."
else
  echo "SUPABASE_ANON_KEY is absent."
fi

if [[ -n "$service_role_key" ]]; then
  echo "SUPABASE_SERVICE_ROLE_KEY is present."
else
  echo "SUPABASE_SERVICE_ROLE_KEY is absent."
fi

if [[ -n "$vnpay_hash_secret" ]]; then
  echo "VNPAY_SANDBOX_HASH_SECRET is present."
else
  echo "VNPAY_SANDBOX_HASH_SECRET is absent."
fi

[[ -n "$supabase_url" && -n "$anon_key" && -n "$service_role_key" && -n "$vnpay_hash_secret" ]]
