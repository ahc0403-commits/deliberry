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
