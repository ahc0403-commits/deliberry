#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

scripts/check-phase1-remote-audit-env.sh

node docs/operations/phase-1-remote-production-audit-e2e-2026-05-04.mjs
