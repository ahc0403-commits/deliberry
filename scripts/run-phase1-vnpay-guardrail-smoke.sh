#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

bash scripts/check-phase1-vnpay-guardrail-env.sh

node docs/operations/phase-1-vnpay-sandbox-guardrail-smoke-2026-05-04.mjs
