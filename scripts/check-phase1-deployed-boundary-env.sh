#!/usr/bin/env bash
set -euo pipefail

default_customer_url="https://deliberry-customer.vercel.app"
default_merchant_url="https://merchant-console-six.vercel.app"
default_admin_url="https://deliberry-admin.vercel.app"
default_public_url="https://go.deli-berry.com"

bypass_vars=(
  "VERCEL_AUTOMATION_BYPASS_SECRET"
  "CUSTOMER_VERCEL_AUTOMATION_BYPASS_SECRET"
  "MERCHANT_VERCEL_AUTOMATION_BYPASS_SECRET"
  "ADMIN_VERCEL_AUTOMATION_BYPASS_SECRET"
  "PUBLIC_VERCEL_AUTOMATION_BYPASS_SECRET"
)

customer_url="${CUSTOMER_URL:-$default_customer_url}"
merchant_url="${MERCHANT_URL:-$default_merchant_url}"
admin_url="${ADMIN_URL:-$default_admin_url}"
public_url="${PUBLIC_URL:-$default_public_url}"

merchant_email="${MERCHANT_EMAIL:-${MERCHANT_E2E_EMAIL:-}}"
merchant_password="${MERCHANT_PASSWORD:-${MERCHANT_E2E_PASSWORD:-}}"
admin_email="${ADMIN_EMAIL:-${ADMIN_E2E_EMAIL:-}}"
admin_password="${ADMIN_PASSWORD:-${ADMIN_E2E_PASSWORD:-}}"

has_bypass_secret=0
for name in "${bypass_vars[@]}"; do
  if [[ -n "${!name:-}" ]]; then
    has_bypass_secret=1
    break
  fi
done

echo "Phase 1 deployed boundary environment check"

echo "Customer URL: $customer_url"
echo "Merchant URL: $merchant_url"
echo "Admin URL: $admin_url"
echo "Public URL: $public_url"

if (( has_bypass_secret == 1 )); then
  echo "At least one Vercel automation bypass secret is present."
else
  echo "No Vercel automation bypass secret is present."
fi

if [[ -n "$merchant_email" && -n "$merchant_password" ]]; then
  echo "Merchant authenticated smoke credentials are present."
else
  echo "Merchant authenticated smoke credentials are absent."
fi

if [[ -n "$admin_email" && -n "$admin_password" ]]; then
  echo "Admin authenticated smoke credentials are present."
else
  echo "Admin authenticated smoke credentials are absent."
fi

if (( has_bypass_secret == 0 )) && [[ "${ALLOW_DEPLOYMENT_PROTECTION_SKIP:-}" != "1" ]]; then
  exit 1
fi
