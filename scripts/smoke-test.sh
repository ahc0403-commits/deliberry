#!/bin/bash
# Deliberry Auth Smoke Test
# 배포 후 자동 실행. 전부 통과해야 배포 유효.

PW_URL='https://go.deli-berry.com'
PROXY_URL='https://tom-overstuffed-semihistorically.ngrok-free.dev'
SUPA_URL='https://gjcwxsezrovxcrpdnazc.supabase.co'
FAIL=0

check() {
  local name=$1 expect=$2 actual=$3
  if echo "$actual" | grep -q "$expect"; then
    echo "✅ $name"
  else
    echo "❌ $name — got: $actual"
    FAIL=$((FAIL + 1))
  fi
}

echo '=== Deliberry Auth Smoke Test ==='
echo "Date: $(date)"
echo ''

check 'S-01 public-website render' '200' "$(curl -s -o /dev/null -w '%{http_code}' $PW_URL/)"
check 'S-02 exchange route exists' '40' "$(curl -s -o /dev/null -w '%{http_code}' -X POST $PW_URL/customer-zalo-auth-exchange)"
check 'S-03 VN proxy health' 'ok' "$(curl -s $PROXY_URL/health)"
check 'S-05 Supabase reachable' 'message' "$(curl -s $SUPA_URL/auth/v1/health)"

echo ''
if [ $FAIL -gt 0 ]; then
  echo "🚫 $FAIL checks failed."
  exit 1
else
  echo '✅ All automatic smoke tests passed.'
  echo ''
  echo '수동 확인 필요:'
  echo '  M-01: Zalo QR 로그인 end-to-end'
  echo '  M-02: Kakao 로그인 end-to-end'
  echo '  M-03: 앱 종료→재시작 세션 유지'
fi
