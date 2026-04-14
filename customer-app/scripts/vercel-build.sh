#!/usr/bin/env bash

set -euo pipefail

required_envs=(
  "SUPABASE_URL"
  "SUPABASE_ANON_KEY"
)

for key in "${required_envs[@]}"; do
  if [ -z "${!key:-}" ]; then
    echo "Missing required env: ${key}" >&2
    exit 1
  fi
done

validate_absolute_http_uri() {
  local name="$1"
  local value="$2"
  node -e '
    const [name, value] = process.argv.slice(1);
    let url;
    try {
      url = new URL(value);
    } catch {
      console.error(`${name} must be an absolute URI.`);
      process.exit(1);
    }
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      console.error(`${name} must use http or https.`);
      process.exit(1);
    }
  ' "$name" "$value"
}

validate_redirect_authority() {
  local auth_scheme="${AUTH_CALLBACK_SCHEME:-}"
  local auth_host="${AUTH_CALLBACK_HOST:-}"
  local auth_path="${AUTH_CALLBACK_PATH:-}"
  local zalo_redirect="${ZALO_REDIRECT_URI:-}"

  if [[ -n "$auth_scheme" || -n "$auth_host" || -n "$auth_path" ]]; then
    if [[ -z "$auth_scheme" || -z "$auth_host" || -z "$auth_path" ]]; then
      echo "AUTH_CALLBACK_SCHEME, AUTH_CALLBACK_HOST, and AUTH_CALLBACK_PATH must be set together." >&2
      exit 1
    fi
  fi

  if [[ -n "$zalo_redirect" ]]; then
    validate_absolute_http_uri "ZALO_REDIRECT_URI" "$zalo_redirect"
    node -e '
      const value = process.argv[1];
      const url = new URL(value);
      if (url.pathname !== "/customer-zalo-auth-exchange") {
        console.error("ZALO_REDIRECT_URI must point to /customer-zalo-auth-exchange.");
        process.exit(1);
      }
      if (url.search || url.hash) {
        console.error("ZALO_REDIRECT_URI must not include a query string or fragment.");
        process.exit(1);
      }
    ' "$zalo_redirect"
  fi
}

validate_redirect_authority

dart_defines=(
  "--dart-define=SUPABASE_URL=${SUPABASE_URL}"
  "--dart-define=SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}"
)

optional_envs=(
  "AUTH_CALLBACK_SCHEME"
  "AUTH_CALLBACK_HOST"
  "AUTH_CALLBACK_PATH"
  "ZALO_APP_ID"
  "ZALO_REDIRECT_URI"
)

for key in "${optional_envs[@]}"; do
  value="${!key:-}"
  if [ -n "${value}" ]; then
    dart_defines+=("--dart-define=${key}=${value}")
  fi
done

if [ -x "flutter/bin/flutter" ]; then
  flutter_cmd="flutter/bin/flutter"
elif command -v flutter >/dev/null 2>&1; then
  flutter_cmd="$(command -v flutter)"
else
  echo "Flutter SDK not found. Expected flutter/bin/flutter or flutter on PATH." >&2
  exit 1
fi

"${flutter_cmd}" build web --release "${dart_defines[@]}"
