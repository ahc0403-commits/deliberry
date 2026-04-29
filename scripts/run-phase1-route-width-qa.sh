#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

if ! command -v npx >/dev/null 2>&1; then
  echo "npx is required to run Playwright route-width QA." >&2
  exit 1
fi

scripts/check-phase1-deployed-boundary-env.sh

node .playwright-cli/phase1-route-width-qa.mjs
