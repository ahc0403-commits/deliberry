# RAG Priority Backlog

Status: Active
Authority: Operational
Surface: cross-surface
Domains: rag-backlog, prioritization, next-steps
Last updated: 2026-03-17
Retrieve when:
- choosing the next repository stabilization or retrieval improvement task
- deciding whether a gap is urgent implementation work or later documentation work
Related files:
- docs/rag-architecture/RAG_GAP_AUDIT.md
- docs/rag-architecture/RAG_ACTIVE_INDEX.md

## P0

### 1. Fix archived date authority leakage in active retrieval
- Category: retrieval, governance alignment
- Status: CLOSED on 2026-03-17
- Affected surfaces: cross-surface
- Affected files/docs:
  - [docs/rag-architecture/RAG_ACTIVE_INDEX.md](/Users/andremacmini/Deliberry/docs/rag-architecture/RAG_ACTIVE_INDEX.md)
  - [docs/rag-architecture/GOVERNANCE_TO_RAG_MAPPING.md](/Users/andremacmini/Deliberry/docs/rag-architecture/GOVERNANCE_TO_RAG_MAPPING.md)
  - [docs/rag-architecture/RAG_ARCHITECTURE_ANALYSIS.md](/Users/andremacmini/Deliberry/docs/rag-architecture/RAG_ARCHITECTURE_ANALYSIS.md)
  - [docs/rag-architecture/RAG_MIGRATION_PLAN.md](/Users/andremacmini/Deliberry/docs/rag-architecture/RAG_MIGRATION_PLAN.md)
  - [docs/governance/DATE.md](/Users/andremacmini/Deliberry/docs/governance/DATE.md)
  - [docs/governance/DATE_POLICY.md](/Users/andremacmini/Deliberry/docs/governance/DATE_POLICY.md)
- Why it is urgent:
  - It previously broke the authority-first promise of the retrieval layer itself.
- Smallest safe next step:
  - Completed: active references now point to `DATE.md`.
  - Keep `DATE_POLICY.md` indexed only as archived, historical, gap-tracking, or diagnostic material.
- Work type: documentation/retrieval
- Blocks future coding efficiency: no

### 2. Enforce minimum admin platform access truth
- Category: runtime truth, code
- Status: CLOSED on 2026-03-17
- Affected surfaces: admin-console
- Affected files/docs:
  - [admin-console/src/app/(platform)/layout.tsx](/Users/andremacmini/Deliberry/admin-console/src/app/(platform)/layout.tsx)
  - [admin-console/src/shared/auth/admin-session.ts](/Users/andremacmini/Deliberry/admin-console/src/shared/auth/admin-session.ts)
  - [admin-console/src/features/auth/server/auth-actions.ts](/Users/andremacmini/Deliberry/admin-console/src/features/auth/server/auth-actions.ts)
  - [admin-console/src/features/permissions/server/permission-actions.ts](/Users/andremacmini/Deliberry/admin-console/src/features/permissions/server/permission-actions.ts)
  - [docs/runtime-truth/admin-auth-session-truth.md](/Users/andremacmini/Deliberry/docs/runtime-truth/admin-auth-session-truth.md)
  - [docs/runtime-truth/admin-permissions-truth.md](/Users/andremacmini/Deliberry/docs/runtime-truth/admin-permissions-truth.md)
- Why it is urgent:
  - The platform shell previously behaved as if auth and role cookies were optional.
- Smallest safe next step:
  - Completed: protected platform routes now require session and valid admin role at runtime; invalid or unauthorized access redirects deterministically.
- Work type: implementation
- Blocks future coding efficiency: no

## P1

### 1. Make public marketing and support copy honest about non-live scope
- Category: UX/UI integrity, governance-to-code drift
- Status: CLOSED on 2026-03-17
- Affected surfaces: public-website
- Affected files/docs:
  - [public-website/src/features/app-download/presentation/app-download-screen.tsx](/Users/andremacmini/Deliberry/public-website/src/features/app-download/presentation/app-download-screen.tsx)
  - [public-website/src/features/customer-support/presentation/customer-support-screen.tsx](/Users/andremacmini/Deliberry/public-website/src/features/customer-support/presentation/customer-support-screen.tsx)
  - [docs/06-guardrails.md](/Users/andremacmini/Deliberry/docs/06-guardrails.md)
- Why it is urgent:
  - It previously over-promised excluded or non-live capabilities in visible user-facing copy.
- Smallest safe next step:
  - Completed: public marketing and support copy now uses runtime-true wording for order progress, help paths, and payment-selection limits.
- Work type: implementation
- Blocks future coding efficiency: no

### 2. Refresh stale customer screen governance matrix entries
- Category: docs, UX/UI governance alignment
- Status: CLOSED on 2026-03-17
- Affected surfaces: customer-app
- Affected files/docs:
  - [docs/ui-governance/SCREEN_PATTERN_MATRIX.md](/Users/andremacmini/Deliberry/docs/ui-governance/SCREEN_PATTERN_MATRIX.md)
  - [customer-app/lib/features/search/presentation/search_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/search/presentation/search_screen.dart)
  - [customer-app/lib/features/search/presentation/filter_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/search/presentation/filter_screen.dart)
  - [customer-app/lib/features/orders/presentation/order_detail_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/orders/presentation/order_detail_screen.dart)
- Why it is urgent:
  - It was wrong about real customer behavior in a governed review artifact.
- Smallest safe next step:
  - Completed: matrix rows now match the stabilized customer runtime behavior.
- Work type: documentation/retrieval
- Blocks future coding efficiency: no

### 3. Reclassify or caveat the final full-system QA baseline
- Category: retrieval, docs
- Status: CLOSED on 2026-03-17
- Affected surfaces: cross-surface
- Affected files/docs:
  - [reviews/final_full_system_qa.md](/Users/andremacmini/Deliberry/reviews/final_full_system_qa.md)
  - [docs/rag-architecture/RAG_ACTIVE_INDEX.md](/Users/andremacmini/Deliberry/docs/rag-architecture/RAG_ACTIVE_INDEX.md)
- Why it is urgent:
  - It reads as a stronger operational truth than the more precise runtime-truth docs.
- Smallest safe next step:
  - Completed: the doc is now historical, front-loaded as a bounded QA snapshot, and demoted from active-baseline retrieval in favor of runtime-truth and stabilization docs.
- Work type: documentation/retrieval
- Blocks future coding efficiency: no

### 4. Extend public retrieval coverage to live `/service` and `/merchant` routes
- Category: retrieval
- Status: CLOSED on 2026-03-17
- Affected surfaces: public-website
- Affected files/docs:
  - [public-website/src/features/service-introduction](/Users/andremacmini/Deliberry/public-website/src/features/service-introduction)
  - [public-website/src/features/merchant-onboarding](/Users/andremacmini/Deliberry/public-website/src/features/merchant-onboarding)
- Why it is urgent:
  - These are live routes with no equivalent retrieval depth to landing/download/legal/support.
- Smallest safe next step:
  - Completed: `/service` and `/merchant` now have direct local README, filemap, runtime-truth, and flow coverage, and are linked from the active public retrieval path.
- Work type: documentation/retrieval
- Blocks future coding efficiency: yes

### 5. Tighten merchant store-scope truth
- Category: runtime truth, source-of-truth ambiguity
- Status: CLOSED on 2026-03-17
- Affected surfaces: merchant-console
- Affected files/docs:
  - [merchant-console/src/shared/data/merchant-repository.ts](/Users/andremacmini/Deliberry/merchant-console/src/shared/data/merchant-repository.ts)
  - [docs/runtime-truth/merchant-store-selection-truth.md](/Users/andremacmini/Deliberry/docs/runtime-truth/merchant-store-selection-truth.md)
  - [docs/runtime-truth/merchant-orders-truth.md](/Users/andremacmini/Deliberry/docs/runtime-truth/merchant-orders-truth.md)
  - [docs/runtime-truth/merchant-menu-truth.md](/Users/andremacmini/Deliberry/docs/runtime-truth/merchant-menu-truth.md)
- Why it is urgent:
  - Store scope is a visible product boundary, but the data layer still ignores it.
- Smallest safe next step:
  - Completed: the repository now validates the supported store scope instead of silently ignoring `storeId`, and the merchant runtime-truth docs explicitly describe the remaining single-store limitation.
- Work type: implementation
- Blocks future coding efficiency: no

### 6. Expand retrieval coverage for the next-wave merchant and admin feature clusters
- Category: retrieval
- Status: CLOSED on 2026-03-17
- Affected surfaces: merchant-console, admin-console
- Affected files/docs:
  - merchant: promotions, analytics, settlement, settings, store-management
  - admin: merchants, stores, settlements, finance, marketing, announcements, catalog, b2b, analytics, reporting, system-management
- Why it is urgent:
  - A large portion of live routes still have no local retrieval entrypoints.
- Smallest safe next step:
  - Completed: added direct local READMEs for the remaining merchant and admin long-tail clusters and surfaced them through the active retrieval layer.
- Work type: documentation/retrieval
- Blocks future coding efficiency: no

## P2

### 1. Add customer retrieval coverage outside the transactional core
- Category: retrieval
- Status: CLOSED on 2026-03-17
- Affected surfaces: customer-app
- Affected files/docs:
  - profile, settings, notifications, reviews feature folders
- Why it is not urgent:
  - Core transactional work is already covered well.
- Smallest safe next step:
  - Completed: added local READMEs for profile, settings, notifications, and reviews and surfaced them through the active retrieval layer.
- Work type: documentation/retrieval
- Blocks future coding efficiency: no

### 2. Add one shared contract filemap or usage map
- Category: retrieval, shared-contract risk
- Status: CLOSED on 2026-03-17
- Affected surfaces: shared, cross-surface
- Affected files/docs:
  - [docs/rag-architecture/RETRIEVAL_ENTRY_SHARED.md](/Users/andremacmini/Deliberry/docs/rag-architecture/RETRIEVAL_ENTRY_SHARED.md)
  - [shared/README.md](/Users/andremacmini/Deliberry/shared/README.md)
- Why it is not urgent:
  - Shared coverage is now directionally good, but tracing still requires manual search.
- Smallest safe next step:
  - Completed: added a shared contract filemap and usage map covering canonical shared owners, surface adapters, and the Flutter bridge boundary.
- Work type: documentation/retrieval
- Blocks future coding efficiency: partially

### 3. Normalize remaining metadata format inconsistencies
- Category: documentation, retrieval hygiene
- Status: CLOSED on 2026-03-17
- Affected surfaces: cross-surface
- Affected files/docs:
  - [docs/governance/DATE.md](/Users/andremacmini/Deliberry/docs/governance/DATE.md)
  - [docs/governance/GLOSSARY.md](/Users/andremacmini/Deliberry/docs/governance/GLOSSARY.md)
  - [docs/governance/ENFORCEMENT_CHECKLIST.md](/Users/andremacmini/Deliberry/docs/governance/ENFORCEMENT_CHECKLIST.md)
- Why it is not urgent:
  - The docs are still readable and retrievable.
- Smallest safe next step:
  - Completed: normalized the three remaining YAML-frontmatter governance docs to the active retrieval metadata block and updated [docs/rag-architecture/RAG_METADATA_STANDARD.md](/Users/andremacmini/Deliberry/docs/rag-architecture/RAG_METADATA_STANDARD.md) so one canonical active-doc format remains.
- Work type: documentation/retrieval
- Blocks future coding efficiency: low
