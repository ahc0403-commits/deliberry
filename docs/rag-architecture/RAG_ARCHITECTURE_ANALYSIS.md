# Repository-Native RAG Architecture Analysis

Status: Proposed
Last updated: 2026-03-16
Scope: Whole repository

## 1. Actual Repository Structure

### Top-level surfaces
- `customer-app/`: Flutter customer surface with app/router, shell, runtime controller, local session, theme, and feature screens.
- `merchant-console/`: Next.js merchant surface with auth shell, console shell, store-scoped routes, feature screens, and merchant-local data layer.
- `admin-console/`: Next.js admin surface with auth shell, platform shell, permission/auth modules, and admin-local data layer.
- `public-website/`: Next.js marketing/legal surface with marketing and legal route groups plus content repository.
- `shared/`: cross-surface contracts, models, constants, types, validation schemas, and pure utilities only.
- `docs/`: platform governance and architecture authorities.
- `reviews/`: implementation audits, execution plans, change logs, and validation reports.

### Surface-local code boundaries
- Customer structure is organized by `lib/app`, `lib/core`, `lib/features`.
- Web surfaces are organized by `src/app`, `src/features`, `src/shared`.
- `shared/` is intentionally non-UI and non-runtime. It is not a surface.

## 2. Actual Feature and Runtime Boundaries

### Customer app
- Router truth: [customer-app/lib/app/router/app_router.dart](/Users/andremacmini/Deliberry/customer-app/lib/app/router/app_router.dart)
- Route names: [customer-app/lib/app/router/route_names.dart](/Users/andremacmini/Deliberry/customer-app/lib/app/router/route_names.dart)
- Shell boundary: [customer-app/lib/app/shells/main_shell.dart](/Users/andremacmini/Deliberry/customer-app/lib/app/shells/main_shell.dart)
- Session truth: [customer-app/lib/core/session/customer_session_controller.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/session/customer_session_controller.dart)
- Runtime flow truth: [customer-app/lib/core/data/customer_runtime_controller.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/data/customer_runtime_controller.dart)
- Read-only/query layer: [customer-app/lib/core/data/customer_query_services.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/data/customer_query_services.dart)
- Mock-backed repository: [customer-app/lib/core/data/in_memory_customer_repository.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/data/in_memory_customer_repository.dart)

### Merchant console
- Auth/server gate: [merchant-console/src/features/auth/server/access.ts](/Users/andremacmini/Deliberry/merchant-console/src/features/auth/server/access.ts)
- Auth actions: [merchant-console/src/features/auth/server/auth-actions.ts](/Users/andremacmini/Deliberry/merchant-console/src/features/auth/server/auth-actions.ts)
- Session truth: [merchant-console/src/shared/auth/merchant-session.ts](/Users/andremacmini/Deliberry/merchant-console/src/shared/auth/merchant-session.ts)
- Store console shell: [merchant-console/src/app/(console)/layout.tsx](/Users/andremacmini/Deliberry/merchant-console/src/app/(console)/layout.tsx)
- Store-scoped shell: [merchant-console/src/app/(console)/[storeId]/layout.tsx](/Users/andremacmini/Deliberry/merchant-console/src/app/(console)/[storeId]/layout.tsx)
- Local data layer: [merchant-console/src/shared/data/merchant-query-services.ts](/Users/andremacmini/Deliberry/merchant-console/src/shared/data/merchant-query-services.ts), [merchant-console/src/shared/data/merchant-repository.ts](/Users/andremacmini/Deliberry/merchant-console/src/shared/data/merchant-repository.ts), [merchant-console/src/shared/data/merchant-mock-data.ts](/Users/andremacmini/Deliberry/merchant-console/src/shared/data/merchant-mock-data.ts)

### Admin console
- Auth actions: [admin-console/src/features/auth/server/auth-actions.ts](/Users/andremacmini/Deliberry/admin-console/src/features/auth/server/auth-actions.ts)
- Permission gate: [admin-console/src/features/permissions/server/permission-actions.ts](/Users/andremacmini/Deliberry/admin-console/src/features/permissions/server/permission-actions.ts)
- Session truth: [admin-console/src/shared/auth/admin-session.ts](/Users/andremacmini/Deliberry/admin-console/src/shared/auth/admin-session.ts)
- Platform shell: [admin-console/src/app/(platform)/layout.tsx](/Users/andremacmini/Deliberry/admin-console/src/app/(platform)/layout.tsx)
- Local data layer: [admin-console/src/shared/data/admin-query-services.ts](/Users/andremacmini/Deliberry/admin-console/src/shared/data/admin-query-services.ts), [admin-console/src/shared/data/admin-repository.ts](/Users/andremacmini/Deliberry/admin-console/src/shared/data/admin-repository.ts), [admin-console/src/shared/data/admin-mock-data.ts](/Users/andremacmini/Deliberry/admin-console/src/shared/data/admin-mock-data.ts)

### Public website
- Marketing shell: [public-website/src/app/(marketing)/layout.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(marketing)/layout.tsx)
- Legal shell: [public-website/src/app/(legal)/layout.tsx](/Users/andremacmini/Deliberry/public-website/src/app/(legal)/layout.tsx)
- Content service: [public-website/src/shared/data/content-service.ts](/Users/andremacmini/Deliberry/public-website/src/shared/data/content-service.ts)
- Content repository: [public-website/src/shared/data/public-content-repository.ts](/Users/andremacmini/Deliberry/public-website/src/shared/data/public-content-repository.ts)

### Shared boundary
- Canonical constants: [shared/constants/domain.constants.ts](/Users/andremacmini/Deliberry/shared/constants/domain.constants.ts)
- JSON bridge source: [shared/constants/domain.constants.json](/Users/andremacmini/Deliberry/shared/constants/domain.constants.json)
- Domain models: [shared/models/domain.models.ts](/Users/andremacmini/Deliberry/shared/models/domain.models.ts)
- Common/domain types: [shared/types/common.types.ts](/Users/andremacmini/Deliberry/shared/types/common.types.ts), [shared/types/domain.types.ts](/Users/andremacmini/Deliberry/shared/types/domain.types.ts)
- Date/money utilities: [shared/utils/date.ts](/Users/andremacmini/Deliberry/shared/utils/date.ts), [shared/utils/money.ts](/Users/andremacmini/Deliberry/shared/utils/money.ts)
- Contracts/schemas: `shared/api/*.contract.json`, `shared/validation/*.schema.json`

## 3. Flow Boundaries That Matter for Retrieval

### Cross-surface boundaries
- Public and customer are separate surfaces. Public does not own customer runtime.
- Merchant and admin have independent auth/session flows. They do not share route files or state with customer.
- `shared/` defines domain language, not orchestration.

### Customer flow clusters
- Entry/auth/onboarding cluster.
- Shell navigation cluster.
- Browse-to-order cluster.
- Search/filter persistence cluster.
- Order history and order detail cluster.
- Profile/settings/addresses/support-like account cluster.

### Web surface route clusters
- Merchant: auth, onboarding, store selection, store-scoped console.
- Admin: login, access boundary, platform sections.
- Public: landing/service/download/merchant/support plus legal.

## 4. File Clusters Agents Commonly Need Together

### Customer route or runtime change
- [customer-app/lib/app/router/app_router.dart](/Users/andremacmini/Deliberry/customer-app/lib/app/router/app_router.dart)
- [customer-app/lib/app/router/route_names.dart](/Users/andremacmini/Deliberry/customer-app/lib/app/router/route_names.dart)
- [customer-app/lib/app/shells/main_shell.dart](/Users/andremacmini/Deliberry/customer-app/lib/app/shells/main_shell.dart)
- [customer-app/lib/core/session/customer_session_controller.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/session/customer_session_controller.dart)
- [customer-app/lib/core/data/customer_runtime_controller.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/data/customer_runtime_controller.dart)
- affected feature screen(s)

### Surface mock/runtime change
- surface-local `src/shared/data/*`
- surface-local `src/shared/domain.ts`
- relevant feature `presentation/*`
- related governance doc from `docs/governance/` if the change touches status, money, time, role, or flow

### Customer UI work
- [docs/ui-governance/README.md](/Users/andremacmini/Deliberry/docs/ui-governance/README.md)
- [docs/ui-governance/SCREEN_TYPES.md](/Users/andremacmini/Deliberry/docs/ui-governance/SCREEN_TYPES.md)
- [docs/ui-governance/SCREEN_COMPOSITION_RULES.md](/Users/andremacmini/Deliberry/docs/ui-governance/SCREEN_COMPOSITION_RULES.md)
- [docs/ui-governance/INTERACTION_PATTERNS.md](/Users/andremacmini/Deliberry/docs/ui-governance/INTERACTION_PATTERNS.md)
- [docs/ui-governance/STATE_MODELING_RULES.md](/Users/andremacmini/Deliberry/docs/ui-governance/STATE_MODELING_RULES.md)
- [docs/ui-governance/NAVIGATION_TRUTH_MAP.md](/Users/andremacmini/Deliberry/docs/ui-governance/NAVIGATION_TRUTH_MAP.md)
- [docs/ui-governance/RUNTIME_REALITY_MAP.md](/Users/andremacmini/Deliberry/docs/ui-governance/RUNTIME_REALITY_MAP.md)

## 5. Existing Governance Doc Locations and Practical Usefulness

### High-value active authorities
- `docs/01-product-architecture.md` to `docs/06-guardrails.md`: macro architecture and execution constraints.
- `docs/governance/CONSTITUTION.md`: binding rules.
- `docs/governance/IDENTITY.md`: actor/entity vocabulary.
- `docs/governance/STRUCTURE.md`: ownership and placement rules.
- `docs/governance/FLOW.md`: lifecycle and state transition truth.
- `docs/governance/DATE.md`: canonical time handling authority.
- `docs/governance/DECAY_PATH.md`: known failure modes and anti-patterns.
- `docs/ui-governance/*`: customer UI rules and stabilization truth.

### Useful but reference-only or planning-heavy
- [docs/governance/DOMAIN_MAPPING_MATRIX.md](/Users/andremacmini/Deliberry/docs/governance/DOMAIN_MAPPING_MATRIX.md): high-value cross-reference, but not a first-read doc for every task.
- [docs/governance/ENFORCEMENT_POINTS.md](/Users/andremacmini/Deliberry/docs/governance/ENFORCEMENT_POINTS.md): good for enforcement retrieval, narrow use.
- [docs/governance/WAVE_TRACKER.md](/Users/andremacmini/Deliberry/docs/governance/WAVE_TRACKER.md): useful for sequencing and “done vs pending” truth.
- [docs/governance/EXECUTION_PLAN.md](/Users/andremacmini/Deliberry/docs/governance/EXECUTION_PLAN.md): planning-heavy, not ideal as default retrieval.
- `reviews/*.md`: valuable implementation truth, but mixed between active and historical.

## 6. Retrieval Pain Points in the Current State

### Docs are authoritative but spread across layers
- Agents must stitch together `docs/01-06`, `docs/governance/*`, `docs/ui-governance/*`, and `reviews/*` manually.
- The split is logically valid for humans but expensive for repeated coding retrieval.

### No retrieval metadata
- Most docs do not declare surface, authority level, freshness, related files, or trigger conditions.
- Agents must infer priority and active status from file names and content.

### No local feature README layer
- Feature modules do not expose short, local retrieval anchors describing route ownership, state truth, dependencies, and common edit bundles.
- Agents are pushed into raw code search on every task.

### Decision history is referenced more than it exists
- Constitution exceptions are anticipated, but there is no meaningful active exception/ADR tree yet.
- Rationale retrieval is weak compared with rule retrieval.

### Historical review docs are mixed with active truth
- Some `reviews/*.md` files remain operationally useful.
- Others are one-time audits.
- There is no active/historical index telling agents what still matters.

### Long docs lack chunk boundaries
- Large docs such as [docs/governance/DECAY_PATH.md](/Users/andremacmini/Deliberry/docs/governance/DECAY_PATH.md), [docs/governance/FLOW.md](/Users/andremacmini/Deliberry/docs/governance/FLOW.md), and [docs/ui-governance/STABILIZATION_REPORT.md](/Users/andremacmini/Deliberry/docs/ui-governance/STABILIZATION_REPORT.md) are useful, but not yet segmented for targeted retrieval.

## 7. Design Implication for RAG

The repository does not need a generic knowledge base. It needs:
- authority-aware retrieval order
- surface-scoped and flow-scoped bundles
- runtime-truth bundles
- local feature readmes for repeated edit zones
- metadata that tells agents what is binding, active, historical, and code-adjacent

The right RAG architecture is therefore a thin retrieval layer over the existing governance and code layout, not a replacement document tree.
