# Deliberry Claude Handoff

## 1. Project Identity

Deliberry is a multi-surface rebuild with strict product separation.

Repository surfaces:
- `customer-app`: Flutter customer product
- `merchant-console`: Next.js merchant operations console
- `admin-console`: Next.js platform governance console
- `public-website`: Next.js public marketing/support/legal surface
- `shared`: contract-only cross-surface layer

## 2. Source of Truth

Governing docs:
- `AGENTS.md`
- `docs/01-product-architecture.md`
- `docs/02-surface-ownership.md`
- `docs/03-navigation-ia.md`
- `docs/04-feature-inventory.md`
- `docs/05-implementation-phases.md`
- `docs/06-guardrails.md`
- `docs/07-post-phase-roadmap.md`
- `docs/08-auth-session-strategy.md`
- `shared/docs/architecture-boundaries.md`
- `shared/docs/contracts-inventory.md`
- `shared/docs/customer-app-shared-adoption-strategy.md`

Rule:
- Docs override assumptions.
- If code and docs disagree, docs win until the docs are intentionally updated.

## 3. Architecture Rules

- Surface ownership is strict: `customer-app`, `merchant-console`, `admin-console`, and `public-website` are separate products.
- Repo-level `shared` is contract-only.
- `shared` may contain contracts, DTOs, models, constants, types, validation schemas, pure utilities, and architecture/reference docs.
- `shared` must not contain UI, router code, app state, permission runtime, session runtime, route guards, feature orchestration, or surface-specific business flows.
- `public-website` must remain public-only.
- Customer, merchant, and admin runtime behavior must remain separate.
- Merchant and admin may share vocabulary only, not shells, route groups, or workflow code.

## 4. What Codex Has Completed

### Skeleton phases 1 through 8
- Top-level surface split is established and treated as permanent architecture.
- Route groups, shells, entry boundaries, feature roots, and shared boundary docs exist.
- Customer, merchant, admin, and public skeletons were built before later deepening.
- Shared contract consolidation was completed.

### Shared adoption track
- Shared contracts/constants/types/models/schemas/utilities were adopted where safe.
- Web surfaces use surface-local adapters/query layers instead of duplicating domain vocabulary.
- `customer-app` uses a customer-local compatibility path instead of direct TypeScript imports.

### Auth/session track
- `customer-app` has customer-local auth/session control and explicit guest/onboarding branches.
- `merchant-console` has merchant-local session handling with onboarding and store-selection gates.
- `admin-console` has admin-local session handling and permission-aware route boundaries.
- `public-website` remains public-only.

### Data/repository track
- Each surface has surface-local repository/query-service or content-service seams.
- No runtime repository logic was moved into repo-level `shared`.
- Real backend fetching was not introduced.

### Customer deepening
- Customer flows were deepened for:
  - auth/onboarding
  - home/discovery
  - search/filter
  - store/menu
  - cart/checkout
  - orders/detail/status
  - reviews/profile/addresses/notifications/settings
- Customer route handoffs and local flow scaffolds are in place.

### Merchant deepening
- Merchant onboarding/store selection, dashboard, orders, menu, store management, reviews, promotions, settlement, analytics, and settings were deepened as store-scoped operational flows.

### Admin deepening
- Admin permissions boundary, dashboard, users, merchants, stores, orders, disputes, customer-service, settlements, finance, marketing, announcements, catalog, B2B, analytics, reporting, and system-management were deepened as platform-governance flows.

### Public deepening
- Landing, service introduction, merchant onboarding, support, privacy, terms, refund-policy, and app download were deepened as public-only content/conversion flows.

### Cross-surface hardening and release-readiness pass
- Cross-surface consistency checks were run.
- Dead placeholder-state files were removed where no longer referenced.
- Structural validation and release-readiness cleanup were completed.

## 5. Current Repository State

Structurally complete:
- Surface boundaries are established and reflected in code.
- Shell ownership, route ownership, and feature ownership are coherent.
- Local auth/session/runtime ownership is established per surface.
- Local repository/query-service boundaries are established per surface.
- Shared contract usage is present without collapsing runtime boundaries.

Validated:
- `flutter analyze` passes for `customer-app`.
- `npm run typecheck` passes for `merchant-console`, `admin-console`, and `public-website`.
- `npm run build` passes for `merchant-console`, `admin-console`, and `public-website`.
- Shared forbidden-content scans pass.
- Repo-wide consistency scans were run.

Intentionally non-live:
- auth providers are not live
- backend data fetching is not live
- mutations are placeholder-safe
- payment handling stays placeholder-only
- no realtime tracking

Not production-ready yet:
- no live backend/provider integration
- no production-grade persistence/refresh/sync
- no human QA signoff yet
- no release notes or acceptance checklist signoff yet

## 6. Key Implemented Boundaries

### Customer local auth/session/runtime
- `customer-app` owns phone/OTP, guest mode, onboarding branch, and local session restore.
- Auth and onboarding handoff into the main shell is customer-local.

### Merchant local session and store gating
- `merchant-console` owns merchant login, onboarding completion, store selection, and store-scoped console access.
- Store context stays local to merchant runtime.

### Admin local session and permission enforcement
- `admin-console` owns admin login, access-boundary handling, and local role/scope enforcement.
- Permission runtime stays local to admin.

### Repository/query-service boundaries per surface
- `customer-app`: local repository + query services
- `merchant-console`: local repository + query services
- `admin-console`: local repository + query services
- `public-website`: local content repository + content service

### Shared adoption strategy
- Shared is used for canonical vocabulary and contracts only.
- `customer-app` uses the documented compatibility path:
  - `shared/constants/domain.constants.json`
  - `customer-app/lib/core/shared_contracts/domain_contract_bridge.dart`
- No direct TypeScript runtime import into Flutter.

## 7. Important Non-Goals / Exclusions

- no payment verification
- no map API address autocomplete
- no QR generation
- no QR scanning/camera integration
- no real-time tracking
- no real backend/provider integrations yet
- no shared runtime auth/session/permission engine
- no collapsing of customer / merchant / admin / public boundaries
- no public authenticated console behavior

## 8. Current Release-Readiness Status

The repository is structurally release-ready at the current non-live scope.

That means:
- architecture boundaries are in place
- code and docs are materially aligned
- surface-local runtime boundaries are coherent
- validation checks pass

It is not production-ready for live integrations.

Checks already passing:
- `flutter analyze`
- `typecheck`
- `build`
- shared forbidden-content scan
- consistency scans

## 9. What Claude Should Do Next

Focus on human-oriented release support first:
- manual route walkthrough support
- screenshot/review support
- acceptance checklist support
- release-notes preparation
- QA issue triage if manual review finds structural problems

Only after that:
- discuss future live-integration planning if explicitly requested
- do not start live provider/backend work by default

## 10. What Claude Must Not Break

- docs/code alignment
- repo-level `shared` contract-only boundary
- strict surface separation
- public-only `public-website`
- current local auth/session/runtime ownership
- repository/query-service seams
- placeholder-only payment handling
- excluded-feature boundaries

## 11. Fast Orientation Checklist

- Read the governing docs before editing anything.
- Treat docs as the source of truth.
- Preserve the five-surface split.
- Do not move runtime logic into repo-level `shared`.
- Keep `public-website` public-only.
- Keep merchant store-scoped and admin platform-scoped.
- Do not reopen completed tracks unless docs are contradicted.
- Assume current scope is structurally complete but non-live.
- Prioritize QA/release support before new implementation.
