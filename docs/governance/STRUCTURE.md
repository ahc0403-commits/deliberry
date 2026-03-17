# Deliberry Platform — Structure Rules

Status: active
Authority: binding
Surface: cross-surface
Domains: structure, placement, dependencies
Last updated: 2026-03-14
Last verified: 2026-03-16
Retrieve when:
- deciding where code belongs
- checking allowed dependency direction before cross-surface or shared changes
Related files:
- docs/01-product-architecture.md
- docs/02-surface-ownership.md
- shared/docs/architecture-boundaries.md

> This document defines the repository structure, folder placement rules, module dependency
> direction, and naming conventions for the Deliberry platform.
> All surfaces MUST comply.

References: CONSTITUTION.md R-001 through R-005

---

## 1. Repository Structure Principle

The repository consists of exactly five surfaces and one shared contracts layer.
Each surface is a standalone deployable product. The shared layer is a build-time
dependency only — it MUST NOT be deployed as a runtime service.

```
deliberry/
├── customer-app/          # Flutter — customer-facing mobile product
├── merchant-console/      # Next.js — merchant operations console
├── admin-console/         # Next.js — platform governance console
├── public-website/        # Next.js — public marketing/support/legal
├── shared/                # TypeScript — cross-surface contracts only
├── docs/                  # Architecture and governance documentation
└── reviews/               # QA review artifacts
```

---

## 2. Surface Ownership Table

| Surface | Owns | MUST NOT Own |
|---|---|---|
| `customer-app` | Customer auth, onboarding, home, search, store/menu, cart, checkout, orders, reviews, profile, addresses, notifications, settings | Merchant flows, admin flows, public content |
| `merchant-console` | Merchant auth, onboarding, store selection, dashboard, orders, menu, store management, reviews, promotions, settlement, analytics, settings | Customer flows, admin governance, public content |
| `admin-console` | Admin auth, dashboard, users, merchants, stores, orders, disputes, customer-service, settlements, finance, marketing, announcements, catalog, B2B, analytics, reporting, system-management | Customer flows, merchant operations, public content |
| `public-website` | Landing, service intro, merchant onboarding info, support/FAQ, privacy, terms, refund policy, app download | Any authenticated flows, any console behavior |
| `shared` | Types, constants, models, contracts, validation schemas, pure utilities, architecture docs | UI, routing, session state, permission runtime, feature orchestration, business logic |

---

## 3. Surface-Local Adapter Pattern

Each web surface (merchant-console, admin-console, public-website) MUST have a surface-local
domain adapter at `src/shared/domain.ts`. This file is the ONLY allowed import boundary
into repo-level `shared`.

```
repo-level shared/
    └── types/common.types.ts
    └── constants/domain.constants.ts
    └── ...

merchant-console/src/shared/domain.ts    ← imports from ../../shared/
admin-console/src/shared/domain.ts       ← imports from ../../shared/
public-website/src/shared/domain.ts      ← imports from ../../shared/
```

Rules:
- Surface code MUST import domain types from `src/shared/domain.ts`, not directly from repo-level `shared`.
- The adapter MAY re-export, narrow, or transform shared types for surface-local use.
- The adapter MUST NOT add runtime behavior or side effects.
- `customer-app` (Flutter) uses a different path: `lib/core/shared_contracts/domain_contract_bridge.dart` reads from `shared/constants/domain.constants.json`.

---

## 4. Module Dependency Direction

Dependencies MUST flow toward `shared`. No surface MUST depend on another surface.

```
customer-app ──→ shared (via JSON bridge)
merchant-console ──→ shared (via domain.ts adapter)
admin-console ──→ shared (via domain.ts adapter)
public-website ──→ shared (via domain.ts adapter)
```

Forbidden:
- `merchant-console` MUST NOT import from `admin-console` or vice versa.
- `customer-app` MUST NOT import from any web surface.
- `public-website` MUST NOT import from `merchant-console` or `admin-console`.
- No surface MUST import from `customer-app`.

---

## 5. Folder Placement Rules

### 5.1 Web Surfaces (merchant-console, admin-console, public-website)

```
src/
├── app/                   # Next.js app router — route groups and pages
│   ├── (shell)/           # Authenticated shell layout
│   │   ├── dashboard/     # Feature route
│   │   ├── orders/        # Feature route
│   │   └── ...
│   ├── (auth)/            # Auth routes (login, onboarding)
│   └── layout.tsx         # Root layout
├── features/              # Feature modules (business logic, components)
│   ├── orders/
│   │   ├── components/    # Feature-specific UI components
│   │   ├── hooks/         # Feature-specific hooks
│   │   ├── services/      # Feature-specific data services
│   │   └── types.ts       # Feature-specific types
│   └── ...
├── shared/                # Surface-local shared utilities
│   ├── domain.ts          # ONLY import boundary to repo-level shared
│   ├── components/        # Surface-wide UI components
│   ├── hooks/             # Surface-wide hooks
│   ├── data/              # Mock data (placeholder phase only)
│   ├── services/          # Surface-wide services (auth, session)
│   └── types/             # Surface-local type extensions
└── lib/                   # Infrastructure (API clients, config)
```

### 5.2 Customer App (Flutter)

```
lib/
├── core/
│   ├── shared_contracts/  # Bridge to repo-level shared
│   ├── auth/              # Customer auth (phone/OTP, guest)
│   ├── session/           # Session management
│   ├── navigation/        # Route definitions
│   └── theme/             # Design system
├── features/              # Feature modules
│   ├── home/
│   ├── search/
│   ├── cart/
│   ├── orders/
│   └── ...
└── shared/                # App-wide shared widgets and utilities
```

### 5.3 Repo-Level Shared

```
shared/
├── api/                   # API contract definitions (JSON)
├── constants/             # Domain constants (enums, config)
├── docs/                  # Architecture boundary documentation
├── models/                # Domain model interfaces
├── types/                 # Shared type definitions
├── utils/                 # Pure utility functions
└── validation/            # JSON schema validation definitions
```

---

## 6. Naming Conventions

### 6.1 Files

| Context | Convention | Example |
|---|---|---|
| TypeScript files | kebab-case | `order-detail.tsx`, `merchant-mock-data.ts` |
| Dart files | snake_case | `order_repository.dart`, `home_screen.dart` |
| JSON contracts | kebab-case + suffix | `order.contract.json`, `order.schema.json` |
| Test files | same as source + `.test` or `_test` | `order-service.test.ts`, `order_repository_test.dart` |
| Documentation | SCREAMING_SNAKE_CASE for governance, kebab-case for technical | `CONSTITUTION.md`, `architecture-boundaries.md` |

### 6.2 Code

| Context | Convention | Example |
|---|---|---|
| React components | PascalCase | `OrderDetailCard`, `MerchantDashboard` |
| Flutter widgets | PascalCase | `OrderStatusBadge`, `CartItemTile` |
| Functions/methods | camelCase | `formatMoney()`, `getOrderById()` |
| Constants | SCREAMING_SNAKE_CASE | `ORDER_STATUSES`, `AUTH_ACTOR_TYPES` |
| Type aliases | PascalCase | `CurrencyCode`, `MoneyAmount` |
| Enums (TS) | PascalCase (type), SCREAMING_SNAKE for values | `type OrderStatus`, `ORDER_STATUSES` |
| Database tables | snake_case plural | `orders`, `order_items`, `audit_logs` |
| Database columns | snake_case | `created_at`, `store_id`, `actor_type` |
| Events | past-tense verb + noun | `order_placed`, `payment_captured`, `settlement_paid` |
| API endpoints | kebab-case | `/api/orders`, `/api/merchant-stores` |

### 6.3 Contract Files

- API contracts: `shared/api/{domain}.contract.json`
- Validation schemas: `shared/validation/{domain}.schema.json`
- Domain constants: `shared/constants/domain.constants.ts`
- Common types: `shared/types/common.types.ts`

---

## 7. Anti-Patterns (Forbidden Structures)

| Anti-Pattern | Rule | Why |
|---|---|---|
| Cross-surface import (`import from '../../merchant-console/...'`) | R-002 | Surfaces are independent products |
| UI components in `shared/` | R-004 | Shared is contracts only |
| Business logic in `shared/` | R-004 | Each surface owns its business logic |
| Route definitions in `shared/` | R-004 | Routing is surface-local |
| Direct `shared/` import (bypassing `domain.ts` adapter) | R-005 | Adapter is the single import boundary |
| Feature code in `src/shared/` | - | Shared is for cross-feature utilities, not features |
| `any` type in contract files | - | Contracts MUST be fully typed |
| Barrel exports (`index.ts`) re-exporting entire directories | - | Causes circular dependencies and bundle bloat |
| Storing runtime state in `shared/` | R-004 | Shared has no runtime |
| Mock data in `shared/` | R-004 | Mock data is surface-local |
