# Deliberry Implementation Phases

Status: active
Authority: operational
Surface: cross-surface
Domains: implementation-order, sequencing, execution
Last updated: 2026-03-16
Last verified: 2026-03-16
Retrieve when:
- deciding what implementation order is allowed
- checking whether a proposed task is out of sequence
Related files:
- docs/04-feature-inventory.md
- docs/06-guardrails.md
- docs/07-post-phase-roadmap.md

## 문서 목적
이 문서는 Deliberry의 구현 순서를 고정하기 위한 실행 기준서입니다.  
모든 Codex 실행, 에이전트 토론, 코드 생성은 이 문서의 phase 순서를 따라야 합니다.

---

## 공통 원칙

### 1. 구현 순서 원칙
- 항상 **구조 → shell → 진입 → 도메인 → 공통계약 정리** 순서로 진행한다.
- 다음 phase로 넘어가기 전, 현재 phase의 완료 기준을 충족해야 한다.
- UI 디테일보다 **surface 분리와 구조 완성**이 우선이다.

### 2. surface 분리 원칙
Deliberry는 아래 5개 영역으로 고정한다.
- `customer-app`
- `merchant-console`
- `admin-console`
- `public-website`
- `shared`

### 3. shared 원칙
`shared`는 아래만 소유할 수 있다.
- contracts
- models
- enums / constants
- types
- validation schemas
- pure utilities

`shared`는 아래를 절대 소유하면 안 된다.
- UI components
- router code
- app state
- runtime-specific orchestration
- feature ownership logic

### 4. old code 원칙
- 기존 구현은 **feature reference**로만 본다.
- 기존 구조를 새 아키텍처 기준으로 삼지 않는다.

### 5. 제외 기능
아래 항목은 구현 범위에서 제외한다.
- payment verification
- map API address autocomplete
- QR generation library
- QR scanner camera integration
- real-time order tracking

### 6. payment 원칙
- checkout에서 payment method selection은 유지한다.
- card / pay 방식은 future-ready placeholder까지만 둔다.
- 실제 PG 검증, 결제완료 판정, 정산완결 로직은 지금 구현하지 않는다.

---

# Phase 1. Structure Freeze

## 목적
제품 구조, surface ownership, 폴더 구조, route skeleton, feature skeleton을 고정한다.

## 포함 범위
- top-level surface 분리 확정
- route skeleton 생성
- feature skeleton 생성
- shared 경계 문서화
- bootstrap/config 기본 상태 확인

## 대표 결과물
- `customer-app`
- `merchant-console`
- `admin-console`
- `public-website`
- `shared`
- `docs/01-product-architecture.md`
- `docs/02-surface-ownership.md`
- `docs/03-navigation-ia.md`
- `docs/04-feature-inventory.md`
- `docs/05-implementation-phases.md`
- `docs/06-guardrails.md`
- `shared/docs/architecture-boundaries.md`

## 완료 기준
- surface가 물리적으로 분리되어 있어야 한다.
- route skeleton이 생성되어 있어야 한다.
- feature root folder가 생성되어 있어야 한다.
- shared 금지사항이 문서로 고정되어 있어야 한다.

## 금지
- 실제 business feature 구현
- styling polish
- 임의의 surface 혼합

---

# Phase 2. App Shell and Navigation Skeleton

## 목적
각 surface가 실행 가능한 최소 shell과 navigation 구조를 가진 상태를 만든다.

## 포함 범위

### customer-app
- app router 연결
- main shell 연결
- 하단탭 또는 기본 진입 shell 구성
- 최소 stub screen 연결:
  - auth
  - onboarding
  - home
  - search
  - orders
  - profile

### merchant-console
- console shell 생성
- sidebar skeleton 생성
- stub page 연결:
  - dashboard
  - orders
  - menu
  - store
  - reviews
  - promotions
  - settlement
  - analytics
  - settings

### admin-console
- platform shell 생성
- sidebar skeleton 생성
- stub page 연결:
  - dashboard
  - users
  - merchants
  - stores
  - orders
  - disputes
  - customer-service
  - settlements
  - finance
  - marketing
  - announcements
  - catalog
  - b2b
  - analytics
  - reporting
  - system-management

### public-website
- marketing shell 생성
- stub page 연결:
  - landing
  - service
  - merchant
  - support
  - download
  - privacy
  - terms
  - refund-policy

## 완료 기준
- 4개 surface가 모두 실행 가능해야 한다.
- 메뉴/라우트 이동이 최소 수준으로 동작해야 한다.
- 모든 화면은 stub이어도 되지만 route 연결은 살아 있어야 한다.

## 금지
- 실데이터 연동
- 복잡한 상태관리
- 스타일 고도화

---

# Phase 3. Entry, Auth, and Access Boundaries

## 목적
누가 어디로 들어가는지, 어떤 경계로 접근하는지 구조를 만든다.

## 포함 범위

### customer-app
- login entry
- phone / OTP entry flow skeleton
- guest entry branch
- onboarding entry branch

### merchant-console
- login entry
- merchant onboarding entry
- store selection entry
- store-scoped route entry

### admin-console
- admin login entry
- permission-aware entry skeleton

### public-website
- public access 유지
- merchant onboarding / inquiry entry 연결

## 완료 기준
- 각 surface의 진입 흐름이 분리되어 있어야 한다.
- customer / merchant / admin 접근 경계가 코드 구조로 분리되어 있어야 한다.
- 권한/인증은 stub이어도 되지만 entry flow는 살아 있어야 한다.

## 금지
- 실제 auth provider 깊은 연동
- 복잡한 session orchestration
- surface 간 auth 흐름 공유

---

# Phase 4. Customer Core Flow Skeleton

## 목적
고객앱의 핵심 주문 흐름을 full-version 기준으로 구조화한다.

## 포함 범위
- auth / onboarding
- home / discovery
- search / filter
- store detail / menu
- group order via room code / share flow
- cart
- checkout
- order list / order detail / status
- reviews
- profile / settings / addresses / notifications

## 구현 수준
- 실제 feature page skeleton
- route 연결
- state placeholder
- domain folder ownership 확정

## 완료 기준
- customer-app 안에서 주요 사용자 흐름이 stub 수준으로 끝까지 이어져야 한다.
- 고객 도메인 feature가 merchant/admin과 섞이지 않아야 한다.

## 금지
- payment verification
- map autocomplete
- QR generation / scanner
- realtime tracking

---

# Phase 5. Merchant Operations Skeleton

## 목적
점주용 운영 콘솔의 핵심 흐름을 구조화한다.

## 포함 범위
- login
- store selection / onboarding
- dashboard
- order management
- menu management
- store management
- reviews / customer response
- coupons / promotions
- settlement
- analytics
- settings

## 구현 수준
- console route 연결
- store-scoped navigation
- feature ownership 분리
- page / component skeleton

## 완료 기준
- 점주가 store context 안에서 운영 기능을 탐색할 수 있어야 한다.
- merchant-console이 admin-console의 권한/화면을 침범하지 않아야 한다.

## 금지
- 관리자 전용 workflow 혼합
- 플랫폼 정책 관리 기능 혼합

---

# Phase 6. Admin Operations Skeleton

## 목적
플랫폼 운영과 통제 기능을 관리자 콘솔 기준으로 구조화한다.

## 포함 범위
- admin auth / permissions
- platform dashboard
- user management
- merchant / store management
- order / dispute / CS
- settlement / finance
- marketing / announcements
- catalog / B2B
- analytics / reporting
- system management

## 구현 수준
- platform navigation
- admin-only feature ownership
- page / module skeleton
- permission boundary skeleton

## 완료 기준
- 관리자 기능이 merchant 기능과 완전히 분리되어 있어야 한다.
- admin-console은 platform governance 중심으로 구성되어 있어야 한다.

## 금지
- 점주 운영 화면 재사용을 통한 혼합
- customer-facing flow 혼합

---

# Phase 7. Public Website Skeleton

## 목적
대외 신뢰, 등록 대응, 점주 유입, 정책 고지용 공개 웹을 구조화한다.

## 포함 범위
- landing
- service introduction
- merchant onboarding pages
- customer support
- privacy policy
- terms
- refund / cancellation policy
- app download page

## 구현 수준
- public routes
- legal routes
- support / merchant onboarding page skeleton
- static content structure

## 완료 기준
- 공개 페이지가 customer/merchant/admin console과 분리되어 있어야 한다.
- 정책 페이지가 독립 route로 존재해야 한다.

## 금지
- 인증 콘솔 기능 혼합
- 운영용 내부 UI 혼합

---

# Phase 8. Shared Contracts Consolidation

## 목적
surface 간에 공통으로 쓰일 계약, 타입, 모델, 상수, 검증 기준을 정리한다.

## 포함 범위
- auth contracts
- store contracts
- menu contracts
- order contracts
- review contracts
- promotion contracts
- settlement contracts
- analytics contracts
- permission contracts
- support contracts
- shared constants
- shared types
- shared validation schemas
- pure utils

## 구현 수준
- canonical DTO / model / type 정의
- surface 간 계약 명세 정리
- feature ownership과 shared ownership 재검토

## 완료 기준
- shared가 contract layer로만 유지되어야 한다.
- UI / router / app state / orchestration이 shared에 없어야 한다.
- surface별 소유권과 shared 계약이 충돌하지 않아야 한다.

## 금지
- shared에 UI 넣기
- shared에 runtime service 넣기
- shared를 우회해서 feature 섞기

---

# 오늘 밤 완료 기준 해석

오늘 밤 기준으로 Phase 8까지 완료한다는 말은 아래 의미로 해석한다.

- 전체 surface 구조가 고정되어 있어야 한다.
- 각 surface의 shell과 navigation이 살아 있어야 한다.
- 각 surface의 entry/auth skeleton이 있어야 한다.
- customer / merchant / admin / public의 핵심 흐름이 stub 수준으로 연결되어 있어야 한다.
- shared contracts 초안이 정리되어 있어야 한다.

아래는 오늘 밤 완료의 의미에 포함되지 않는다.
- production-grade UI polish
- real payment integration
- full backend orchestration
- full production business logic
- full exception hardening
- final QA completion

---

# phase 실행 규칙

## 규칙 1
항상 현재 phase 완료 여부를 먼저 확인하고 다음 phase로 이동한다.

## 규칙 2
문서와 코드가 충돌하면 문서를 기준으로 판단한다.

## 규칙 3
불명확한 ownership은 구현 전에 반드시 토론하고 문서 기준으로 수렴한다.

## 규칙 4
다음 phase를 시작할 때는 항상 아래를 출력한다.
- 현재 phase
- 완료 기준
- 이번 run의 구현 범위
- 이번 run의 금지 범위

---

# Codex 실행 원칙

Codex 또는 멀티에이전트는 아래 순서를 반드시 따른다.

1. 관련 문서 읽기
2. 현재 phase 확인
3. 구현 범위 고정
4. plan
5. implement
6. run checks
7. fix
8. summarize
9. next run 제안

---

# 최종 요약

- Phase 1 = 구조 고정
- Phase 2 = shell + navigation 뼈대
- Phase 3 = auth + 진입 + 접근 경계
- Phase 4 = customer 핵심 흐름
- Phase 5 = merchant 핵심 운영 흐름
- Phase 6 = admin 핵심 운영 흐름
- Phase 7 = public website 구조 완성
- Phase 8 = shared contracts / types / validation 정리

이 문서는 Deliberry 구현 순서의 기준 문서이며, 이후 모든 구현은 이 문서를 우선 기준으로 삼는다.
