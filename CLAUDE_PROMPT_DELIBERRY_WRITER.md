# Deliberry 프로젝트 — 정산 Writer 측 구현
# Claude Code에서 순차 실행
# 생성일: 2026-04-05
# 프로젝트 경로: ~/Deliberry/
# Supabase: globospossystem (ynriuoomotxuwhuxxmhj) — POS와 공유
# 설계 문서: Deliberry볼트/Integration/POS-SETTLEMENT.md

---

## 전제

- `external_sales`, `delivery_settlements`, `delivery_settlement_items` 테이블은 POS 측에서 이미 생성 완료 (migration push됨)
- Deliberry와 POS는 **동일 Supabase 프로젝트** (같은 DB)
- Deliberry는 이 3개 테이블에 **INSERT 권한** (RLS로 restaurant_id 격리)
- POS는 **READ + status UPDATE만** (입금 확인)

---

## ═══ DLVR-W01: 주문 완료 시 external_sales INSERT ═══

```
@Codebase

프로젝트 구조를 읽어서 주문 완료 플로우를 찾아줘.
주문 상태가 'completed'로 변경될 때 external_sales 테이블에 INSERT하는 로직을 추가해야 해.

### 요구 사항

1. 주문 완료 이벤트 포인트를 찾아서 (아마 orders feature나 checkout 관련)
   상태가 completed로 바뀌는 곳에 훅을 추가

2. external_sales INSERT 로직:

```dart
await supabase.from('external_sales').insert({
  'restaurant_id': order.restaurantId,
  'source_system': 'deliberry',
  'external_order_id': order.id,  // Deliberry 주문 ID
  'sales_channel': 'delivery',
  'gross_amount': order.totalAmount,      // 총 주문 금액 (할인 전)
  'discount_amount': order.discountAmount ?? 0,
  'delivery_fee': order.deliveryFee ?? 0,
  'net_amount': order.totalAmount - (order.discountAmount ?? 0),
  'currency': 'VND',
  'order_status': 'completed',
  'is_revenue': true,
  'completed_at': DateTime.now().toIso8601String(),
  'payload': {
    'customer_id': order.customerId,
    'payment_method': order.paymentMethod,  // 'card', 'momo', 'zalopay', 'cash'
    'items': order.items.map((i) => {
      'name': i.name,
      'quantity': i.quantity,
      'price': i.unitPrice,
    }).toList(),
  },
});
```

3. 에러 처리:
   - external_sales INSERT 실패해도 주문 완료 자체는 실패하면 안 됨
   - try-catch로 감싸고 실패 시 로그만 남기기
   - 나중에 재시도 메커니즘 추가 (Phase 2)

4. 취소/환불 시에도 동일하게:
```dart
// 취소 시
await supabase.from('external_sales').insert({
  ...공통필드,
  'order_status': 'cancelled',
  'is_revenue': false,
});

// 환불 시
await supabase.from('external_sales').insert({
  ...공통필드,
  'order_status': 'refunded',
  'is_revenue': false,
});
```

### 규칙
- 기존 주문 완료 플로우를 **절대 깨지 마**
- external_sales INSERT는 fire-and-forget (비동기, 대기 안 함)
- 기존 코드 패턴 (Repository+Gateway) 따르기
- 실제 주문 모델의 필드명을 확인해서 매핑하기
```

---

## ═══ DLVR-W02: ExternalSalesService 분리 ═══

```
@Codebase

DLVR-W01에서 추가한 external_sales INSERT 로직을
별도 서비스 클래스로 분리해줘.

파일: lib/core/services/external_sales_service.dart

```dart
class ExternalSalesService {
  final SupabaseClient _client;
  
  ExternalSalesService(this._client);

  /// 주문 완료 → 매출 기록
  Future<void> recordCompletedOrder(Order order) async {
    try {
      await _client.from('external_sales').insert({
        'restaurant_id': order.restaurantId,
        'source_system': 'deliberry',
        'external_order_id': order.id,
        'sales_channel': 'delivery',
        'gross_amount': order.totalAmount,
        'discount_amount': order.discountAmount ?? 0,
        'delivery_fee': order.deliveryFee ?? 0,
        'net_amount': order.totalAmount - (order.discountAmount ?? 0),
        'currency': 'VND',
        'order_status': 'completed',
        'is_revenue': true,
        'completed_at': DateTime.now().toIso8601String(),
        'payload': _buildPayload(order),
      });
    } catch (e) {
      // 매출 기록 실패가 주문 완료를 막으면 안 됨
      debugPrint('[ExternalSales] 매출 기록 실패: $e');
    }
  }

  /// 취소 → reversal 기록
  Future<void> recordCancelledOrder(Order order) async {
    try {
      await _client.from('external_sales').insert({
        'restaurant_id': order.restaurantId,
        'source_system': 'deliberry',
        'external_order_id': '${order.id}-cancel',
        'sales_channel': 'delivery',
        'gross_amount': order.totalAmount,
        'discount_amount': 0,
        'delivery_fee': 0,
        'net_amount': order.totalAmount,
        'currency': 'VND',
        'order_status': 'cancelled',
        'is_revenue': false,
        'completed_at': DateTime.now().toIso8601String(),
        'payload': {'original_order_id': order.id, 'reason': 'cancelled'},
      });
    } catch (e) {
      debugPrint('[ExternalSales] 취소 기록 실패: $e');
    }
  }

  /// 환불 → reversal 기록
  Future<void> recordRefundedOrder(Order order, {double? refundAmount}) async {
    try {
      final amount = refundAmount ?? order.totalAmount;
      final status = refundAmount != null && refundAmount < order.totalAmount
          ? 'partially_refunded'
          : 'refunded';
      await _client.from('external_sales').insert({
        'restaurant_id': order.restaurantId,
        'source_system': 'deliberry',
        'external_order_id': '${order.id}-refund',
        'sales_channel': 'delivery',
        'gross_amount': amount,
        'discount_amount': 0,
        'delivery_fee': 0,
        'net_amount': amount,
        'currency': 'VND',
        'order_status': status,
        'is_revenue': false,
        'completed_at': DateTime.now().toIso8601String(),
        'payload': {
          'original_order_id': order.id,
          'refund_amount': amount,
          'reason': 'refunded',
        },
      });
    } catch (e) {
      debugPrint('[ExternalSales] 환불 기록 실패: $e');
    }
  }

  Map<String, dynamic> _buildPayload(Order order) {
    return {
      'customer_id': order.customerId,
      'payment_method': order.paymentMethod,
      'items': order.items.map((i) => {
        'name': i.name,
        'quantity': i.quantity,
        'price': i.unitPrice,
      }).toList(),
    };
  }
}
```

### 규칙
- Order 모델의 실제 필드명을 확인해서 매핑 (위 예시는 가이드)
- Supabase client는 기존 프로젝트 패턴으로 주입
- DLVR-W01에서 인라인으로 넣었던 코드를 이 서비스로 교체
```

---

## ═══ DLVR-W03: 정산 생성 Edge Function ═══

```
@Codebase

Supabase Edge Function을 생성해줘.
2주마다 실행되는 정산 자동 생성 함수.

파일: supabase/functions/generate-settlement/index.ts

```typescript
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req: Request) => {
  // 인증 확인 (cron secret)
  const authHeader = req.headers.get("Authorization");
  const cronSecret = Deno.env.get("CRON_SECRET");
  if (authHeader !== `Bearer ${cronSecret}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!  // service_role로 RLS 우회
  );

  const now = new Date();
  const day = now.getDate();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed

  // 정산 기간 결정
  let periodStart: Date;
  let periodEnd: Date;
  let periodLabel: string;

  if (day <= 15) {
    // 16일 실행 → 당월 1~15일 정산
    // 실제로는 전월 16~말일 정산 (1일에 실행 시)
    // 여기서는 단순화: 직전 반기
    periodStart = new Date(year, month, 1);
    periodEnd = new Date(year, month, 15);
    periodLabel = `${year}-${String(month + 1).padStart(2, "0")}-A`;
  } else {
    // 1일 실행 → 전월 16~말일 정산
    periodStart = new Date(year, month, 16);
    const lastDay = new Date(year, month + 1, 0).getDate();
    periodEnd = new Date(year, month, lastDay);
    periodLabel = `${year}-${String(month + 1).padStart(2, "0")}-B`;
  }

  const startIso = periodStart.toISOString().split("T")[0];
  const endIso = periodEnd.toISOString().split("T")[0] + "T23:59:59.999Z";

  // 해당 기간 미정산 매출이 있는 레스토랑 조회
  const { data: restaurants, error: fetchErr } = await supabase
    .from("external_sales")
    .select("restaurant_id")
    .eq("is_revenue", true)
    .eq("order_status", "completed")
    .is("settlement_id", null)
    .gte("completed_at", startIso)
    .lte("completed_at", endIso);

  if (fetchErr) {
    return new Response(JSON.stringify({ error: fetchErr.message }), {
      status: 500,
    });
  }

  // 중복 제거
  const restaurantIds = [
    ...new Set(restaurants?.map((r: any) => r.restaurant_id) ?? []),
  ];

  const results: any[] = [];

  for (const rid of restaurantIds) {
    try {
      // 1) 해당 기간 매출 집계
      const { data: sales } = await supabase
        .from("external_sales")
        .select("id, gross_amount, payload")
        .eq("restaurant_id", rid)
        .eq("is_revenue", true)
        .eq("order_status", "completed")
        .is("settlement_id", null)
        .gte("completed_at", startIso)
        .lte("completed_at", endIso);

      if (!sales || sales.length === 0) continue;

      const grossTotal = sales.reduce(
        (sum: number, s: any) => sum + Number(s.gross_amount),
        0
      );

      // 2) 정산 헤더 생성
      const { data: settlement, error: insertErr } = await supabase
        .from("delivery_settlements")
        .insert({
          restaurant_id: rid,
          source_system: "deliberry",
          period_start: startIso,
          period_end: endIso.split("T")[0],
          period_label: periodLabel,
          gross_total: grossTotal,
          total_deductions: 0, // 아래에서 계산 후 업데이트
          net_settlement: grossTotal, // 임시
          status: "calculated",
        })
        .select()
        .single();

      if (insertErr || !settlement) {
        results.push({ rid, error: insertErr?.message ?? "insert failed" });
        continue;
      }

      // 3) 차감 항목 생성
      const items: any[] = [];

      // 플랫폼 수수료 1.5%
      const platformFee = Math.round(grossTotal * 0.015);
      items.push({
        settlement_id: settlement.id,
        item_type: "platform_commission",
        amount: platformFee,
        description: `플랫폼 수수료 1.5%`,
        reference_rate: 0.015,
        reference_base: grossTotal,
      });

      // 결제 수수료 — payload에서 결제수단별 추정
      // 실제로는 PG사 정산 데이터 연동 필요 (Phase 2)
      // 지금은 평균 1.5% 적용
      const paymentFee = Math.round(grossTotal * 0.015);
      items.push({
        settlement_id: settlement.id,
        item_type: "payment_fee",
        amount: paymentFee,
        description: `결제 수수료 (평균 1.5%)`,
        reference_rate: 0.015,
        reference_base: grossTotal,
      });

      // TODO: 광고비 조회 (advertising 테이블 생기면)
      // TODO: 인사이트 리포트 구독료 (subscription 테이블 생기면)

      // items INSERT
      if (items.length > 0) {
        await supabase.from("delivery_settlement_items").insert(items);
      }

      // 4) total_deductions, net_settlement 업데이트
      const totalDeductions = items.reduce(
        (sum: number, i: any) => sum + Number(i.amount),
        0
      );
      const netSettlement = grossTotal - totalDeductions;

      await supabase
        .from("delivery_settlements")
        .update({
          total_deductions: totalDeductions,
          net_settlement: netSettlement,
        })
        .eq("id", settlement.id);

      // 5) external_sales에 settlement_id 연결
      const saleIds = sales.map((s: any) => s.id);
      await supabase
        .from("external_sales")
        .update({ settlement_id: settlement.id })
        .in("id", saleIds);

      results.push({
        rid,
        periodLabel,
        grossTotal,
        totalDeductions,
        netSettlement,
        orderCount: sales.length,
      });
    } catch (e) {
      results.push({ rid, error: String(e) });
    }
  }

  return new Response(
    JSON.stringify({
      processed: restaurantIds.length,
      periodLabel,
      results,
    }),
    { headers: { "Content-Type": "application/json" } }
  );
});
```

### 배포 명령어
```bash
cd ~/Deliberry
supabase functions deploy generate-settlement --project-ref ynriuoomotxuwhuxxmhj
```

### 환경 변수 설정 (Supabase Dashboard → Edge Functions → Secrets)
```
CRON_SECRET=<랜덤 시크릿 생성>
```

### cron 호출 설정 (Supabase Dashboard → Database → Extensions → pg_cron)
```sql
-- pg_cron으로 2주마다 자동 실행
SELECT cron.schedule(
  'generate-settlement-biweekly',
  '0 3 1,16 * *',  -- 매월 1일, 16일 새벽 3시 (UTC+7 기준)
  $$
  SELECT net.http_post(
    url := 'https://ynriuoomotxuwhuxxmhj.supabase.co/functions/v1/generate-settlement',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || current_setting('app.settings.cron_secret'),
      'Content-Type', 'application/json'
    ),
    body := '{}'
  );
  $$
);
```

### 규칙
- service_role key 사용 (RLS 우회 — 모든 레스토랑 데이터 접근 필요)
- 함수 자체는 CRON_SECRET으로 보호
- 에러 발생해도 다른 레스토랑 처리는 계속
- 금액 계산은 반올림 (VND는 소수점 없음)
```

---

## ═══ DLVR-W04: 수동 정산 트리거 (관리자용) ═══

```
@Codebase

관리자가 수동으로 정산을 트리거할 수 있는 Edge Function을 추가해줘.
테스트 및 긴급 상황에서 사용.

파일: supabase/functions/trigger-settlement/index.ts

이 함수는 generate-settlement과 동일한 로직이지만:
- 특정 restaurant_id와 기간을 직접 지정 가능
- admin 인증 필요 (JWT 기반)

```typescript
// 요청 형식:
// POST /functions/v1/trigger-settlement
// Body: {
//   "restaurant_id": "uuid",
//   "period_start": "2026-04-01",
//   "period_end": "2026-04-15"
// }
```

규칙:
- generate-settlement의 코어 로직을 공유 모듈로 분리
- supabase/functions/_shared/settlement-core.ts 에 공통 로직
- 두 함수가 동일 로직 참조
```

---

## ═══ 실행 순서 ═══

| # | 명령 | 의존성 | 결과 |
|---|------|--------|------|
| 1 | DLVR-W01 | DB migration 완료 | 주문 완료 시 external_sales INSERT |
| 2 | DLVR-W02 | W01 완료 | ExternalSalesService 분리 |
| 3 | DLVR-W03 | W01 완료 | 2주 정산 Edge Function |
| 4 | DLVR-W04 | W03 완료 | 수동 정산 트리거 |

---

## 검증 방법

### external_sales INSERT 테스트
```sql
-- Supabase SQL Editor에서 확인
SELECT * FROM external_sales
ORDER BY created_at DESC
LIMIT 10;
```

### 정산 Edge Function 테스트
```bash
# 로컬 테스트
cd ~/Deliberry
supabase functions serve generate-settlement

# 다른 터미널에서 호출
curl -X POST http://localhost:54321/functions/v1/generate-settlement \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  -H "Content-Type: application/json"
```

### 정산 결과 확인
```sql
-- 정산 헤더
SELECT * FROM delivery_settlements
ORDER BY created_at DESC;

-- 차감 항목
SELECT ds.period_label, dsi.*
FROM delivery_settlement_items dsi
JOIN delivery_settlements ds ON ds.id = dsi.settlement_id
ORDER BY ds.created_at DESC;
```

---

## 관련 문서

- Deliberry볼트: `Integration/POS-SETTLEMENT.md` (전체 설계)
- Deliberry볼트: `Decisions/ADR-005-Settlement-Line-Items.md` (설계 결정)
- POS 프로젝트: `CLAUDE_PROMPT_DELIBERRY_SETTLEMENT.md` (POS Reader 측)
- Office볼트: `04_INTEGRATION/DELIVERY_INTEGRATION_PLAN.md` (대시보드 표시)
