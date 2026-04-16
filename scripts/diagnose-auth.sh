#!/bin/bash
# Deliberry auth diagnose (Step 7 phase-2)
#
# 목적: 운영 인증 흐름 점검 시 provider 구조(Kakao/Zalo split)에 맞춰
#       어디부터 확인해야 하는지 빠르게 좁힌다.
#
# 범위 (DO):
#   - Kakao: customer-app direct Supabase OAuth readiness 점검
#   - Zalo: public-website exchange route 도달성 + env 시그니처 probe
#   - 결과를 07-AUTH_RUNBOOK.md 패턴 B/C 액션으로 분기
#
# 범위 외 (DON'T):
#   - Kakao public-website exchange route 진단 (현재 구조상 없음)
#   - VPS proxy 진단 (Step 3 결정 후 phase-3)
#   - Flutter 앱 런타임 디버깅 (IDE에서 수행)
#
# 알려진 한계:
#   - 실행 머신 네트워크 상태(curl proxy 변수, DNS 캐시, VPN, 회사망 등)에 따라
#     status=000이 나올 수 있다.
#   - 스크립트는 provider별 "경로 준비 상태"를 진단하며,
#     실제 사람 로그인/동의 상호작용까지 자동 검증하지는 않는다.
#
# Last verified working: 2026-04-07
set -u

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PROVIDER="${AUTH_PROVIDER:-all}"
PUBLIC_BASE_URL="${PW_URL:-https://go.deli-berry.com}"
SUPABASE_URL_INPUT="${SUPABASE_URL:-}"
FAIL=0
ZALO_EXCHANGE_ROUTES=()

msg() { printf '%s\n' "$*"; }
fail() { msg "FAIL: $*"; FAIL=$((FAIL + 1)); }
ok() { msg "PASS: $*"; }

parse_args() {
  if [ "${1:-}" != "" ]; then
    case "$1" in
      kakao|zalo|all)
        PROVIDER="$1"
        shift
        ;;
      http://*|https://*)
        PUBLIC_BASE_URL="$1"
        shift
        ;;
      *)
        fail "invalid first argument: $1"
        msg "NEXT: use provider (kakao|zalo|all) or public URL (https://...)."
        ;;
    esac
  fi

  if [ "${1:-}" != "" ]; then
    case "$1" in
      http://*|https://*)
        PUBLIC_BASE_URL="$1"
        shift
        ;;
      *)
        fail "invalid second argument: $1"
        msg "NEXT: second argument must be a full public URL."
        ;;
    esac
  fi
}

http_code() {
  local method="$1"
  local url="$2"
  local data="${3:-}"
  if [ -n "$data" ]; then
    curl -s -o /dev/null -w '%{http_code}' -X "$method" \
      -H 'Content-Type: application/json' \
      --data "$data" "$url"
  else
    curl -s -o /dev/null -w '%{http_code}' -X "$method" "$url"
  fi
}

http_body() {
  local method="$1"
  local url="$2"
  local data="${3:-}"
  if [ -n "$data" ]; then
    curl -s -X "$method" \
      -H 'Content-Type: application/json' \
      --data "$data" "$url"
  else
    curl -s -X "$method" "$url"
  fi
}

discover_zalo_exchange_routes() {
  while IFS= read -r rel; do
    ZALO_EXCHANGE_ROUTES+=("/${rel%/route.ts}")
  done < <(
    find "$ROOT_DIR/public-website/src/app" -type f -name route.ts \
      | sed "s|$ROOT_DIR/public-website/src/app/||" \
      | grep 'auth-exchange/route.ts$' \
      | grep 'zalo' || true
  )
}

assert_contains() {
  local file="$1"
  local pattern="$2"
  local success="$3"
  local failure="$4"

  if [ ! -f "$file" ]; then
    fail "missing file: $file"
    msg "NEXT: sync current branch files and rerun diagnosis."
    return
  fi

  if rg -q "$pattern" "$file"; then
    ok "$success"
  else
    fail "$failure"
  fi
}

check_kakao_code_path() {
  msg "--- Provider: Kakao (direct Supabase OAuth) ---"

  local social_adapter="$ROOT_DIR/customer-app/lib/core/session/customer_supabase_oauth_adapter.dart"
  local multi_adapter="$ROOT_DIR/customer-app/lib/core/session/customer_multi_auth_adapter.dart"
  local auth_screen="$ROOT_DIR/customer-app/lib/features/auth/presentation/auth_screen.dart"
  local main_dart="$ROOT_DIR/customer-app/lib/main.dart"
  local runtime_config="$ROOT_DIR/customer-app/lib/core/backend/runtime_backend_config.dart"
  local vercel_build="$ROOT_DIR/customer-app/scripts/vercel-build.sh"

  assert_contains "$social_adapter" 'provider == CustomerAuthProvider.kakao' \
    'kakao provider support branch present in social adapter' \
    'kakao provider support branch missing in social adapter'

  assert_contains "$social_adapter" 'signInWithOAuth' \
    'Supabase OAuth launch call present' \
    'Supabase OAuth launch call missing for kakao path'

  assert_contains "$social_adapter" 'OAuthProvider.kakao' \
    'OAuthProvider.kakao mapping present' \
    'OAuthProvider.kakao mapping missing'

  assert_contains "$multi_adapter" 'socialAdapter.supports\(provider\)' \
    'multi adapter routes supported providers through social adapter' \
    'multi adapter social routing branch missing'

  assert_contains "$auth_screen" 'beginSignIn\(CustomerAuthProvider.kakao\)' \
    'auth screen kakao button wiring present' \
    'auth screen kakao button wiring missing'

  assert_contains "$main_dart" '_extractWebAuthCallback' \
    'web callback extraction path present' \
    'web callback extraction path missing'

  assert_contains "$runtime_config" "String.fromEnvironment\('SUPABASE_URL'" \
    'SUPABASE_URL runtime define binding present' \
    'SUPABASE_URL runtime define binding missing'

  assert_contains "$runtime_config" "String.fromEnvironment\('SUPABASE_ANON_KEY'" \
    'SUPABASE_ANON_KEY runtime define binding present' \
    'SUPABASE_ANON_KEY runtime define binding missing'

  assert_contains "$vercel_build" 'required_envs=\(' \
    'vercel build wrapper required env list present' \
    'vercel build wrapper required env list missing'

  assert_contains "$vercel_build" '"SUPABASE_URL"' \
    'vercel build wrapper requires SUPABASE_URL' \
    'vercel build wrapper does not require SUPABASE_URL'

  assert_contains "$vercel_build" '"SUPABASE_ANON_KEY"' \
    'vercel build wrapper requires SUPABASE_ANON_KEY' \
    'vercel build wrapper does not require SUPABASE_ANON_KEY'
}

check_kakao_supabase_reachability() {
  local url="$SUPABASE_URL_INPUT"
  if [ -z "$url" ]; then
    msg "INFO: SUPABASE_URL is not set in current shell."
    msg "NEXT(KAKAO): set SUPABASE_URL in shell and rerun to probe /auth/v1/health."
    return
  fi

  if ! printf '%s' "$url" | grep -Eq '^https?://'; then
    fail "invalid SUPABASE_URL format: $url"
    msg "NEXT(KAKAO): set a full SUPABASE_URL (https://...)."
    return
  fi

  local status
  status="$(http_code GET "$url/auth/v1/health")"
  case "$status" in
    200|401|403)
      ok "Supabase auth endpoint reachable for kakao path ($status)"
      ;;
    000)
      fail "Supabase auth endpoint unreachable for kakao path (status=000)"
      msg "NEXT(KAKAO): check machine network/proxy and Supabase project reachability."
      ;;
    *)
      fail "unexpected Supabase auth health status for kakao path ($status)"
      msg "NEXT(KAKAO): inspect Supabase runtime/auth availability."
      ;;
  esac
}

validate_zalo_inputs() {
  if ! printf '%s' "$PUBLIC_BASE_URL" | grep -Eq '^https?://'; then
    fail "invalid public base URL: $PUBLIC_BASE_URL"
    msg "NEXT: set PW_URL or pass a full URL (example: https://go.deli-berry.com)."
  else
    ok "public base URL valid"
  fi

  discover_zalo_exchange_routes
  if [ "${#ZALO_EXCHANGE_ROUTES[@]}" -eq 0 ]; then
    fail "no Zalo auth exchange route discovered from code"
    msg "NEXT(ZALO): confirm public-website/src/app/*zalo*auth-exchange*/route.ts exists."
  else
    ok "discovered Zalo exchange route(s): ${ZALO_EXCHANGE_ROUTES[*]}"
  fi
}

check_public_site() {
  local status
  status="$(http_code GET "$PUBLIC_BASE_URL/")"
  if [ "$status" = "200" ]; then
    ok "public website root healthy (200)"
  else
    fail "website unavailable (root status=$status)"
    msg "NEXT(B): verify deployment status and domain alias for public website."
  fi
}

check_zalo_route_path() {
  local route="$1"
  local url="${PUBLIC_BASE_URL}${route}"

  local post_status
  post_status="$(http_code POST "$url")"
  case "$post_status" in
    404)
      fail "route missing/deployment mismatch ($route -> 404)"
      msg "NEXT(B): deploy public-website and re-check route path mapping."
      return
      ;;
    500|502|503|504)
      fail "exchange route server failure ($route -> $post_status)"
      msg "NEXT(C): inspect function logs for auth.exchange.failed and error_code."
      ;;
    000)
      fail "website unavailable when calling exchange route ($route -> 000)"
      msg "NEXT(B): check DNS/network and production domain health."
      return
      ;;
    *)
      ok "exchange route reachable ($route -> $post_status)"
      ;;
  esac

  local payload_status payload_body
  payload_status="$(http_code POST "$url" '{}')"
  payload_body="$(http_body POST "$url" '{}')"

  if [ "$payload_status" = "503" ] || echo "$payload_body" | grep -Eq 'missing_env|supabase_admin_unconfigured|provider_not_configured'; then
    fail "env issue path detected on exchange route ($route)"
    msg "NEXT(C): run auth env check and fix missing/incorrect auth envs, then redeploy."
  else
    ok "no immediate env-failure signature on exchange route payload probe"
  fi
}

run_env_check_if_present() {
  local env_script=""
  for candidate in \
    "$ROOT_DIR/scripts/auth-env-check.sh" \
    "$ROOT_DIR/scripts/env-check.sh" \
    "$ROOT_DIR/scripts/check-auth-env.sh"; do
    if [ -f "$candidate" ]; then
      env_script="$candidate"
      break
    fi
  done

  if [ -z "$env_script" ]; then
    msg "INFO: auth env-check script not found."
    msg "NEXT(C): manual action -> runbook pattern C step 3 (env 전수 확인) 수행."
    return
  fi

  msg "INFO: running env-check script: $env_script"
  if bash "$env_script"; then
    ok "env-check script passed"
  else
    fail "env-check script failed"
    msg "NEXT(C): fix env-check failures, then redeploy and rerun diagnosis."
  fi
}

run_kakao() {
  check_kakao_code_path
  check_kakao_supabase_reachability
}

run_zalo() {
  validate_zalo_inputs
  check_public_site
  if [ "${#ZALO_EXCHANGE_ROUTES[@]}" -gt 0 ]; then
    for route in "${ZALO_EXCHANGE_ROUTES[@]}"; do
      check_zalo_route_path "$route"
    done
  fi
}

main() {
  parse_args "$@"

  msg "=== Deliberry Auth Diagnose (Step 7 phase-2) ==="
  msg "Date: $(date '+%Y-%m-%d %H:%M:%S %z')"
  msg "Provider scope: $PROVIDER"
  msg "Public URL: $PUBLIC_BASE_URL"
  msg ""

  case "$PROVIDER" in
    kakao)
      run_kakao
      ;;
    zalo)
      run_zalo
      ;;
    all)
      run_kakao
      msg ""
      run_zalo
      ;;
    *)
      fail "invalid provider scope: $PROVIDER"
      msg "NEXT: use AUTH_PROVIDER or arg value from {kakao|zalo|all}."
      ;;
  esac

  run_env_check_if_present

  msg ""
  if [ "$FAIL" -gt 0 ]; then
    msg "RESULT: FAIL ($FAIL issue(s))"
    msg "RUNBOOK HANDOFF: follow provider-specific B/C actions from Operations/07-AUTH_RUNBOOK.md."
    exit 1
  fi

  msg "RESULT: PASS (provider-aware phase-2 checks)"
  msg "RUNBOOK HANDOFF: proceed to manual runbook validation steps."
}

main "$@"
