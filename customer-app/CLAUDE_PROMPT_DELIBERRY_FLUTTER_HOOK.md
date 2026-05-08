# Deprecated Planning Artifact — Do Not Execute As Current Product Truth
#
# Status:
# - This file is an archived planning note from 2026-04-06.
# - It is NOT a live implementation spec and must not be used as an execution
#   prompt without a fresh doc-vs-code review.
# - It predates the current guardrails that keep payment verification and
#   payment completion out of scope.
#
# Current runtime truth as of 2026-04-18:
# - `customer-app/lib/core/services/external_sales_service.dart` is still a
#   stub/no-op boundary on the customer surface.
# - Customer checkout keeps payment selection placeholder-only and does not
#   perform real payment verification or payment completion.
# - Settlement runtime remains gated behind `ENABLE_SETTLEMENT_RUNTIME`.
#
# If this file is ever reused:
# - re-validate against `docs/04-feature-inventory.md`
# - re-validate against `docs/06-guardrails.md`
# - re-validate against `docs/runtime-truth/settlement-runtime-truth.md`
# - re-validate against the current customer runtime files before writing code
#
# Original title: Deliberry Flutter Customer App — ExternalSalesService 구현
# Original intent: Claude Code에서 ~/Deliberry/customer-app/ 프로젝트 열고 순차 실행

---

## ═══ DLVR-F01: ExternalSalesService 생성 ═══

```
@Codebase

customer-app 프로젝트 구조를 읽어서 기존 패턴을 파악해줘.
특히 core/data/ 아래 Repository + Gateway 패턴, 그리고
features/orders/ 아래 주문 상태 관리 로직을 확인해.

확인 후 ExternalSalesService를 생성해줘.

파일: lib/core/services/external_sales_service.dart

이 서비스의 역할:
- 주문 완료/취소/환불 시 external_sales 테이블에 INSERT
- POS 연동용 (같은 Supabase DB)
- fire-and-forget: 실패해도 주문 플로우를 막지 않음

```dart
import 'package:flutter/foundation.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

/// Deliberry → POS 매출 연동 서비스
/// 주문 상태 변경 시 external_sales 테이블에 기록
/// POS는 이 테이블을 읽어서 배달 채널 매출로 합산
///
/// 원칙:
/// - INSERT 실패가 주문 완료를 막으면 안 됨 (fire-and-forget)
/// - completed만 is_revenue=true, 나머지는 false
/// - 기존 레코드 수정 금지, 항상 새 레코드 INSERT (reversal 패턴)
class ExternalSalesService {
  ExternalSalesService(this._client);
  final SupabaseClient _client;

  /// 주문 완료 → 매출 기록
  Future<void> recordCompleted({
    required String restaurantId,
    required String orderId,
    required double grossAmount,
    double discountAmount = 0,
    double deliveryFee = 0,
    String currency = 'VND',
    String? paymentMethod,
    String? customerId,
    List<Map<String, dynamic>>? items,
  }) async {
    try {
      await _client.from('external_sales').insert({
        'restaurant_id': restaurantId,
        'source_system': 'deliberry',
        'external_order_id': orderId,
        'sales_channel': 'delivery',
        'gross_amount': grossAmount,
        'discount_amount': discountAmount,
        'delivery_fee': deliveryFee,
        'net_amount': grossAmount - discountAmount,
        'currency': currency,
        'order_status': 'completed',
        'is_revenue': true,
        'completed_at': DateTime.now().toUtc().toIso8601String(),
        'payload': {
          'customer_id': customerId,
          'payment_method': paymentMethod,
          if (items != null) 'items': items,
        },
      });
      debugPrint('[ExternalSales] 매출 기록 완료: $orderId');
    } catch (e) {
      debugPrint('[ExternalSales] 매출 기록 실패 (무시): $orderId — $e');
    }
  }

  /// 취소 → reversal 기록
  Future<void> recordCancelled({
    required String restaurantId,
    required String orderId,
    required double grossAmount,
    String? reason,
  }) async {
    try {
      await _client.from('external_sales').insert({
        'restaurant_id': restaurantId,
        'source_system': 'deliberry',
        'external_order_id': '$orderId-cancel',
        'sales_channel': 'delivery',
        'gross_amount': grossAmount,
        'discount_amount': 0,
        'delivery_fee': 0,
        'net_amount': grossAmount,
        'currency': 'VND',
        'order_status': 'cancelled',
        'is_revenue': false,
        'completed_at': DateTime.now().toUtc().toIso8601String(),
        'payload': {
          'original_order_id': orderId,
          'reason': reason ?? 'cancelled',
        },
      });
    } catch (e) {
      debugPrint('[ExternalSales] 취소 기록 실패 (무시): $orderId — $e');
    }
  }

  /// 환불 → reversal 기록
  Future<void> recordRefunded({
    required String restaurantId,
    required String orderId,
    required double grossAmount,
    double? refundAmount,
    String? reason,
  }) async {
    try {
      final amount = refundAmount ?? grossAmount;
      final status = (refundAmount != null && refundAmount < grossAmount)
          ? 'partially_refunded'
          : 'refunded';
      await _client.from('external_sales').insert({
        'restaurant_id': restaurantId,
        'source_system': 'deliberry',
        'external_order_id': '$orderId-refund',
        'sales_channel': 'delivery',
        'gross_amount': amount,
        'discount_amount': 0,
        'delivery_fee': 0,
        'net_amount': amount,
        'currency': 'VND',
        'order_status': status,
        'is_revenue': false,
        'completed_at': DateTime.now().toUtc().toIso8601String(),
        'payload': {
          'original_order_id': orderId,
          'refund_amount': amount,
          'reason': reason ?? 'refunded',
        },
      });
    } catch (e) {
      debugPrint('[ExternalSales] 환불 기록 실패 (무시): $orderId — $e');
    }
  }
}
```

### 규칙
- Supabase client 주입은 기존 프로젝트 패턴 따르기
  (Supabase.instance.client 직접 접근 또는 DI)
- 기존 Order 모델 필드명에 맞춰 파라미터 조정 필요
- debugPrint만 사용 (production에서 log service 있으면 교체)
```

---

## ═══ DLVR-F02: 주문 완료 훅 연결 ═══

```
@Codebase

방금 만든 ExternalSalesService를 실제 주문 플로우에 연결해줘.

1. features/orders/ 또는 features/checkout/ 아래에서
   주문 상태가 'completed' / 'delivered' 로 변경되는 지점을 찾아줘.

2. 해당 지점에서 ExternalSalesService.recordCompleted() 호출 추가.
   실제 Order 모델의 필드명을 확인해서 매핑:
   - restaurantId: 주문의 레스토랑 ID
   - orderId: 주문 ID
   - grossAmount: 총 주문 금액 (할인 전)
   - discountAmount: 할인 금액
   - deliveryFee: 배달비
   - paymentMethod: 결제 수단 ('card', 'momo', 'zalopay', 'cash')
   - customerId: 고객 ID
   - items: 주문 아이템 목록

3. 취소 플로우도 찾아서 recordCancelled() 연결.

4. 환불 플로우도 찾아서 recordRefunded() 연결.
   (환불 플로우가 아직 없으면 스킵)

### 연결 패턴 (예시)
```dart
// 주문 완료 처리 함수 안에서:
final externalSales = ExternalSalesService(Supabase.instance.client);

// 기존 주문 완료 로직...
await updateOrderStatus(orderId, 'completed');

// POS 매출 기록 (fire-and-forget — await 안 함)
unawaited(externalSales.recordCompleted(
  restaurantId: order.restaurantId,
  orderId: order.id,
  grossAmount: order.totalAmount,
  discountAmount: order.discountAmount ?? 0,
  deliveryFee: order.deliveryFee ?? 0,
  paymentMethod: order.paymentMethod,
  customerId: order.customerId,
));
```

### 규칙
- `unawaited()` 사용 (dart:async import)
- external_sales INSERT가 실패해도 주문 완료는 성공해야 함
- 기존 코드의 주문 완료/취소 로직은 절대 수정하지 마
- 훅은 기존 로직 뒤에 추가만
- Gateway 패턴이면 Supabase Gateway 구현체에만 추가 (InMemory 구현체는 no-op)
```

---

## ═══ DLVR-F03: InMemory 구현체 대응 (개발/테스트용) ═══

```
@Codebase

현재 프로젝트가 RuntimeController로 InMemory ↔ Supabase를 전환하는 패턴이야.
개발/테스트 환경(InMemory)에서는 external_sales INSERT가 실행되면 안 됨.

해결 방법 2가지 중 프로젝트 패턴에 맞는 걸 골라줘:

방법 A) ExternalSalesService를 인터페이스로 분리
```dart
abstract class ExternalSalesService {
  Future<void> recordCompleted({...});
  Future<void> recordCancelled({...});
  Future<void> recordRefunded({...});
}

class SupabaseExternalSalesService implements ExternalSalesService { ... }
class NoOpExternalSalesService implements ExternalSalesService {
  @override Future<void> recordCompleted({...}) async {}
  @override Future<void> recordCancelled({...}) async {}
  @override Future<void> recordRefunded({...}) async {}
}
```

방법 B) RuntimeBackendConfig에서 분기
```dart
if (runtimeConfig.isSupabase) {
  unawaited(externalSales.recordCompleted(...));
}
```

기존 프로젝트에서 이런 분기를 어떻게 처리하는지 확인하고
동일 패턴으로 구현해줘.
```

---

## ═══ 실행 순서 ═══

```
cd ~/Deliberry/customer-app

# 1. ExternalSalesService 생성
→ Claude Code: DLVR-F01 실행

# 2. 주문 완료/취소 훅 연결
→ Claude Code: DLVR-F02 실행

# 3. InMemory 대응
→ Claude Code: DLVR-F03 실행

# 4. 빌드 확인
flutter analyze
flutter build web --release  # 또는 해당 타겟
```

---

## 검증

```sql
-- 테스트 주문 완료 후 Supabase SQL Editor에서 확인
SELECT
  external_order_id,
  gross_amount,
  order_status,
  is_revenue,
  completed_at,
  payload->>'payment_method' as payment_method
FROM external_sales
WHERE source_system = 'deliberry'
ORDER BY created_at DESC
LIMIT 5;
```

---

## 관련 문서
- merchant-console 구현: commit 0cfcf9c (W01~W02)
- 설계: Deliberry볼트/Integration/POS-SETTLEMENT.md
- POS Reader 측: ~/globos_pos_system/CLAUDE_PROMPT_DELIBERRY_SETTLEMENT.md
- Edge Function: ~/globos_pos_system/supabase/functions/generate-settlement/
