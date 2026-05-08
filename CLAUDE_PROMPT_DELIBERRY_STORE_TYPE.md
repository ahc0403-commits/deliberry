# ADR-013 Phase 3: Deliberry store_type Integration

## 배경
- `restaurants.store_type` ('direct'/'external') 컬럼이 이미 DB에 존재
- `public_restaurant_profiles` 뷰에 `store_type` 추가됨
- Deliberry는 직영+외부 모두 배달 주문 가능 (필터링 없음)
- 직영점에 "직영점" 뱃지를 표시하여 마케팅 차별화

## Phase 3-A: DB Migration

파일 위치: `supabase/migrations/20260406000000_deliberry_store_type_integration.sql`
(이 파일은 이미 제공됨. 복사 후 push)

```bash
cd ~/globos_pos_system
/opt/homebrew/bin/supabase db push
```

## Phase 3-B: Deliberry Flutter 앱 변경

### 1. Store/Restaurant 모델에 storeType 추가

Deliberry 앱의 restaurant/store 관련 모델을 찾아서:
- `storeType` 필드 추가 (String, default: 'direct')
- `isDirect` getter: `storeType == 'direct'`
- `isExternal` getter: `storeType == 'external'`
- fromJson에서 `store_type` 파싱

관련 파일 후보:
- `core/data/` 내 restaurant 관련 모델
- `features/store/` 내 store 모델
- `features/home/` 내 discovery 관련 모델
- mock_data.dart 에서 목 데이터에도 store_type 추가

### 2. 매장 목록/검색 화면에 직영점 뱃지 추가

- DiscoveryScreen 또는 HomeScreen의 매장 카드에 직영점 뱃지 표시
- 직영점인 경우: 초록색 "직영점" 뱃지 (Badge or Chip)
- 외부매장인 경우: 뱃지 없음 (기본)
- StoreScreen (매장 상세)에도 직영점 표시

뱃지 디자인:
```dart
// 직영점 뱃지 위젯 예시
if (store.isDirect)
  Container(
    padding: EdgeInsets.symmetric(horizontal: 6, vertical: 2),
    decoration: BoxDecoration(
      color: Colors.green.shade50,
      borderRadius: BorderRadius.circular(4),
      border: Border.all(color: Colors.green.shade200),
    ),
    child: Text('직영점', style: TextStyle(fontSize: 10, color: Colors.green.shade700)),
  )
```

### 3. 검색/필터에 직영점 필터 옵션 추가 (선택사항)

- FilterScreen에 "직영점만 보기" 토글 추가
- 기본값: OFF (전체 표시)
- ON이면: `where store_type = 'direct'` 필터

### 4. external_sales INSERT에 변경 없음 확인

- 기존 external_sales INSERT 로직은 restaurant_id 기반
- store_type에 의한 필터링 없음
- 직영/외부 모두 배달 주문 → external_sales 정상 기록

### 5. 검증

- flutter analyze: 0 errors
- 직영점 매장 카드에 뱃지 표시 확인
- 외부매장 카드에 뱃지 없음 확인  
- 검색/Discovery에서 직영+외부 모두 표시 확인
- mock_data에 직영/외부 모두 포함 확인
