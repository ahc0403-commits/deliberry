# RAG Gap Audit

Status: Active
Authority: Operational
Surface: cross-surface
Domains: rag-audit, retrieval-gaps, runtime-gaps, governance-alignment
Last updated: 2026-03-17
Retrieve when:
- prioritizing the next repository stabilization or retrieval-improvement wave
- checking what is still weak, stale, misleading, or high-risk after the RAG migration passes
Related files:
- docs/rag-architecture/RAG_PRIORITY_BACKLOG.md
- docs/rag-architecture/RAG_ACTIVE_INDEX.md
- docs/rag-architecture/RETRIEVAL_ENTRY_TASK_GUIDE.md

## 1. Audit Scope

This audit used the current retrieval layer as the primary entrypoint, then validated it against:

- binding governance authorities in [docs/governance/](/Users/andremacmini/Deliberry/docs/governance)
- customer UI governance in [docs/ui-governance/](/Users/andremacmini/Deliberry/docs/ui-governance)
- cross-surface architecture docs in [docs/](/Users/andremacmini/Deliberry/docs)
- runtime-truth docs in [docs/runtime-truth/](/Users/andremacmini/Deliberry/docs/runtime-truth)
- filemaps in [docs/filemaps/](/Users/andremacmini/Deliberry/docs/filemaps)
- flow docs in [docs/flows/](/Users/andremacmini/Deliberry/docs/flows)
- local feature READMEs in each surface
- current implementation files in `customer-app`, `merchant-console`, `admin-console`, `public-website`, and `shared`

## 2. Retrieval-First Audit Method Used

The audit started with:

1. [docs/rag-architecture/RAG_ACTIVE_INDEX.md](/Users/andremacmini/Deliberry/docs/rag-architecture/RAG_ACTIVE_INDEX.md)
2. [docs/rag-architecture/RETRIEVAL_ENTRY_TASK_GUIDE.md](/Users/andremacmini/Deliberry/docs/rag-architecture/RETRIEVAL_ENTRY_TASK_GUIDE.md)
3. surface retrieval entries
4. binding authorities
5. runtime-truth docs
6. filemaps
7. flow docs
8. local feature READMEs
9. implementation files where the docs pointed

This is not a generic repo review. Findings below are only recorded when the retrieval layer plus current code still leaves a real gap, false impression, or inefficient startup path.

## 3. Current Strengths of the Repo and RAG Setup

- The repository now has a real authority-first retrieval path instead of forcing agents to begin with repo-wide search.
- Customer runtime truth is well documented and tied directly to the stabilized core flow through [customer_runtime_controller.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/data/customer_runtime_controller.dart).
- Merchant, admin, and public first-wave runtime/filemap/flow coverage exists and is operationally useful.
- `shared/` boundaries are explicitly documented and the new shared retrieval docs correctly fence off runtime orchestration.
- Historical vs active docs are separated well enough that older audits no longer dominate the retrieval layer by default.

**Post-Wave-9 open-gap count: 0.** No open retrieval/governance hygiene gaps remain in the active RAG layer.

## 4. Missing or Weak Areas by Category

### 4.1 Runtime Truth

#### Gap R01: Admin platform auth and role truth are still only cookie truth, not route truth
- Category: runtime truth, code, governance alignment
- Severity: P0
- Status: CLOSED on 2026-03-17
- Affected surfaces: admin-console
- Exact references:
  - [admin-console/src/app/(platform)/layout.tsx](/Users/andremacmini/Deliberry/admin-console/src/app/(platform)/layout.tsx)
  - [admin-console/src/shared/auth/admin-session.ts](/Users/andremacmini/Deliberry/admin-console/src/shared/auth/admin-session.ts)
  - [admin-console/src/features/auth/server/auth-actions.ts](/Users/andremacmini/Deliberry/admin-console/src/features/auth/server/auth-actions.ts)
  - [admin-console/src/features/permissions/server/permission-actions.ts](/Users/andremacmini/Deliberry/admin-console/src/features/permissions/server/permission-actions.ts)
  - [docs/runtime-truth/admin-auth-session-truth.md](/Users/andremacmini/Deliberry/docs/runtime-truth/admin-auth-session-truth.md)
  - [docs/runtime-truth/admin-permissions-truth.md](/Users/andremacmini/Deliberry/docs/runtime-truth/admin-permissions-truth.md)
- Why it matters:
  - The retrieval layer previously described admin auth and permissions as only partially real.
  - The platform boundary previously relied on cookie truth without a shared admin-local enforcement path.
- Smallest safe next step:
  - Completed: the admin platform now enforces session and valid role at route entry through [middleware.ts](/Users/andremacmini/Deliberry/admin-console/middleware.ts) and [access.ts](/Users/andremacmini/Deliberry/admin-console/src/features/auth/server/access.ts), with the role matrix centralized in [admin-access.ts](/Users/andremacmini/Deliberry/admin-console/src/shared/auth/admin-access.ts).

#### Gap R02: Merchant store scope is route-real but data truth is still single-store fixture truth
- Category: runtime truth, code, source-of-truth ambiguity
- Severity: P1
- Status: CLOSED on 2026-03-17
- Affected surfaces: merchant-console
- Exact references:
  - [merchant-console/src/shared/data/merchant-repository.ts](/Users/andremacmini/Deliberry/merchant-console/src/shared/data/merchant-repository.ts)
  - [docs/runtime-truth/merchant-store-selection-truth.md](/Users/andremacmini/Deliberry/docs/runtime-truth/merchant-store-selection-truth.md)
  - [docs/runtime-truth/merchant-orders-truth.md](/Users/andremacmini/Deliberry/docs/runtime-truth/merchant-orders-truth.md)
  - [docs/runtime-truth/merchant-menu-truth.md](/Users/andremacmini/Deliberry/docs/runtime-truth/merchant-menu-truth.md)
- Why it matters:
  - `storeId` is enforced in routing, but the repository ignores `_storeId` and always returns one fixture store.
  - This weakens the value of store-scope retrieval docs because the runtime boundary is only half real.
- Smallest safe next step:
  - Completed: `merchant-repository.ts` now validates the requested `storeId` against the supported demo-store scope instead of ignoring it, and the merchant runtime-truth docs now reflect that single-store but route-aligned behavior explicitly.

### 4.2 Route and Flow Coherence

#### Gap F01: Public live routes `/service` and `/merchant` still lack first-class runtime-truth and flow coverage
- Category: retrieval, flow coverage
- Severity: P1
- Status: CLOSED on 2026-03-17
- Affected surfaces: public-website
- Exact references:
  - [public-website/src/features/service-introduction](/Users/andremacmini/Deliberry/public-website/src/features/service-introduction)
  - [public-website/src/features/merchant-onboarding](/Users/andremacmini/Deliberry/public-website/src/features/merchant-onboarding)
  - [docs/rag-architecture/RETRIEVAL_ENTRY_PUBLIC.md](/Users/andremacmini/Deliberry/docs/rag-architecture/RETRIEVAL_ENTRY_PUBLIC.md)
  - [docs/filemaps/public-landing-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/public-landing-filemap.md)
- Why it matters:
  - The public retrieval layer is solid for landing, download, legal, and support.
  - Two live public routes still force agents back into manual repo scanning.
- Smallest safe next step:
  - Completed: added local feature READMEs, route-local runtime-truth docs, filemaps, and flow docs for `/service` and `/merchant`, and surfaced them directly through the active public retrieval layer.

#### Gap F02: Customer UI governance matrix is stale against the stabilized code
- Category: docs, retrieval, UX/UI governance alignment
- Severity: P1
- Status: CLOSED on 2026-03-17
- Affected surfaces: customer-app
- Exact references:
  - [docs/ui-governance/SCREEN_PATTERN_MATRIX.md](/Users/andremacmini/Deliberry/docs/ui-governance/SCREEN_PATTERN_MATRIX.md)
  - [customer-app/lib/features/search/presentation/search_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/search/presentation/search_screen.dart)
  - [customer-app/lib/features/search/presentation/filter_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/search/presentation/filter_screen.dart)
  - [customer-app/lib/features/orders/presentation/order_detail_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/orders/presentation/order_detail_screen.dart)
- Why it matters:
  - The matrix previously said `Clear all` was presentational only.
  - It previously said filter apply did not round-trip and selected filters were local only.
  - It previously referred to older order-detail behavior such as `Get Help`.
  - That previously made the governed screen map weaker than the actual stabilized implementation.
- Smallest safe next step:
  - Completed: `SCREEN_PATTERN_MATRIX.md` now reflects current stabilized search/filter, order-detail, cart, settings, addresses, and group-order behavior.

### 4.3 Fake or Partial Behavior

#### Gap U01: Public website copy still over-promises non-live or excluded capabilities
- Category: code, UX/UI integrity, governance-to-code drift
- Severity: P1
- Status: CLOSED on 2026-03-17
- Affected surfaces: public-website
- Exact references:
  - [public-website/src/features/app-download/presentation/app-download-screen.tsx](/Users/andremacmini/Deliberry/public-website/src/features/app-download/presentation/app-download-screen.tsx)
  - [public-website/src/features/customer-support/presentation/customer-support-screen.tsx](/Users/andremacmini/Deliberry/public-website/src/features/customer-support/presentation/customer-support-screen.tsx)
  - [docs/06-guardrails.md](/Users/andremacmini/Deliberry/docs/06-guardrails.md)
  - [docs/runtime-truth/public-app-download-truth.md](/Users/andremacmini/Deliberry/docs/runtime-truth/public-app-download-truth.md)
  - [docs/runtime-truth/public-support-truth.md](/Users/andremacmini/Deliberry/docs/runtime-truth/public-support-truth.md)
- Why it matters:
  - The download and marketing pages previously promised live tracking and richer payment behavior than the current runtime truth supports.
  - The support page previously told users to use live tracking, in-app help, issue-reporting, and password-reset flows that are not reflected as live public/runtime behavior.
  - This conflicts with explicit exclusions and with the non-live scope described elsewhere.
- Smallest safe next step:
  - Completed: public marketing and support copy now uses narrowed, runtime-true wording for order progress, support contact paths, and payment selection limits without redesigning the routes.

### 4.4 Stale or Misleading Docs

#### Gap D01: Archived date policy still leaks into active RAG retrieval
- Category: retrieval, docs, governance alignment
- Severity: P0
- Status: CLOSED on 2026-03-17
- Affected surfaces: cross-surface
- Exact references:
  - [docs/rag-architecture/RAG_ACTIVE_INDEX.md](/Users/andremacmini/Deliberry/docs/rag-architecture/RAG_ACTIVE_INDEX.md)
  - [docs/rag-architecture/GOVERNANCE_TO_RAG_MAPPING.md](/Users/andremacmini/Deliberry/docs/rag-architecture/GOVERNANCE_TO_RAG_MAPPING.md)
  - [docs/rag-architecture/RAG_ARCHITECTURE_ANALYSIS.md](/Users/andremacmini/Deliberry/docs/rag-architecture/RAG_ARCHITECTURE_ANALYSIS.md)
  - [docs/rag-architecture/RAG_MIGRATION_PLAN.md](/Users/andremacmini/Deliberry/docs/rag-architecture/RAG_MIGRATION_PLAN.md)
  - [docs/governance/DATE.md](/Users/andremacmini/Deliberry/docs/governance/DATE.md)
  - [docs/governance/DATE_POLICY.md](/Users/andremacmini/Deliberry/docs/governance/DATE_POLICY.md)
- Why it matters:
  - `DATE.md` is canonical.
  - This previously pointed agents toward `DATE_POLICY.md`, which is explicitly archived.
  - That previously broke the authority-first retrieval model the repo just built.
- Smallest safe next step:
  - Completed: active RAG references now point to `DATE.md`.
  - Keep `DATE_POLICY.md` only in archived, historical, gap-tracking, or diagnostic contexts.
- Closure note:
  - Fixed: [docs/rag-architecture/RAG_ACTIVE_INDEX.md](/Users/andremacmini/Deliberry/docs/rag-architecture/RAG_ACTIVE_INDEX.md), [docs/rag-architecture/GOVERNANCE_TO_RAG_MAPPING.md](/Users/andremacmini/Deliberry/docs/rag-architecture/GOVERNANCE_TO_RAG_MAPPING.md), [docs/rag-architecture/RAG_ARCHITECTURE_ANALYSIS.md](/Users/andremacmini/Deliberry/docs/rag-architecture/RAG_ARCHITECTURE_ANALYSIS.md), and [docs/rag-architecture/RAG_MIGRATION_PLAN.md](/Users/andremacmini/Deliberry/docs/rag-architecture/RAG_MIGRATION_PLAN.md) now point to [docs/governance/DATE.md](/Users/andremacmini/Deliberry/docs/governance/DATE.md).
  - Intentionally retained: references in [docs/governance/DATE_POLICY.md](/Users/andremacmini/Deliberry/docs/governance/DATE_POLICY.md), [docs/governance/WAVE_TRACKER.md](/Users/andremacmini/Deliberry/docs/governance/WAVE_TRACKER.md), this audit, and [docs/rag-architecture/RAG_PRIORITY_BACKLOG.md](/Users/andremacmini/Deliberry/docs/rag-architecture/RAG_PRIORITY_BACKLOG.md) while the closure record remains visible.
  - Why acceptable: those references are historical or diagnostic and are not active retrieval entrypoints.

#### Gap D02: Final full-system QA is too optimistic to be a safe active operational baseline
- Category: docs, retrieval, governance alignment
- Severity: P1
- Status: CLOSED on 2026-03-17
- Affected surfaces: cross-surface
- Exact references:
  - [reviews/final_full_system_qa.md](/Users/andremacmini/Deliberry/reviews/final_full_system_qa.md)
  - [docs/runtime-truth/admin-auth-session-truth.md](/Users/andremacmini/Deliberry/docs/runtime-truth/admin-auth-session-truth.md)
  - [docs/runtime-truth/admin-permissions-truth.md](/Users/andremacmini/Deliberry/docs/runtime-truth/admin-permissions-truth.md)
  - [docs/runtime-truth/public-app-download-truth.md](/Users/andremacmini/Deliberry/docs/runtime-truth/public-app-download-truth.md)
  - [docs/runtime-truth/public-support-truth.md](/Users/andremacmini/Deliberry/docs/runtime-truth/public-support-truth.md)
- Why it matters:
  - The QA doc says “PASS” and “no blockers” in language that can mask unresolved non-live or structurally weak behavior.
  - The runtime-truth docs are more precise and currently more useful for coding work.
  - Because the QA doc remains active in the index, agents can still retrieve an over-compressed success verdict first.
- Smallest safe next step:
  - Completed: `reviews/final_full_system_qa.md` is now marked historical, front-loaded as a bounded 2026-03-16 QA snapshot, and demoted in the active index in favor of current runtime-truth and stabilization docs.

### 4.5 Retrieval Blind Spots

#### Gap T01: Large parts of the live merchant and admin surfaces still have no local README, flow, or runtime coverage
- Category: retrieval
- Severity: P1
- Status: CLOSED on 2026-03-17
- Affected surfaces: merchant-console, admin-console
- Exact references:
  - Merchant missing first-class coverage:
    - [merchant-console/src/features/promotions](/Users/andremacmini/Deliberry/merchant-console/src/features/promotions)
    - [merchant-console/src/features/analytics](/Users/andremacmini/Deliberry/merchant-console/src/features/analytics)
    - [merchant-console/src/features/settlement](/Users/andremacmini/Deliberry/merchant-console/src/features/settlement)
    - [merchant-console/src/features/settings](/Users/andremacmini/Deliberry/merchant-console/src/features/settings)
    - [merchant-console/src/features/store-management](/Users/andremacmini/Deliberry/merchant-console/src/features/store-management)
  - Admin missing first-class coverage:
    - [admin-console/src/features/merchants](/Users/andremacmini/Deliberry/admin-console/src/features/merchants)
    - [admin-console/src/features/stores](/Users/andremacmini/Deliberry/admin-console/src/features/stores)
    - [admin-console/src/features/settlements](/Users/andremacmini/Deliberry/admin-console/src/features/settlements)
    - [admin-console/src/features/finance](/Users/andremacmini/Deliberry/admin-console/src/features/finance)
    - [admin-console/src/features/marketing](/Users/andremacmini/Deliberry/admin-console/src/features/marketing)
    - [admin-console/src/features/announcements](/Users/andremacmini/Deliberry/admin-console/src/features/announcements)
    - [admin-console/src/features/catalog](/Users/andremacmini/Deliberry/admin-console/src/features/catalog)
    - [admin-console/src/features/b2b](/Users/andremacmini/Deliberry/admin-console/src/features/b2b)
    - [admin-console/src/features/analytics](/Users/andremacmini/Deliberry/admin-console/src/features/analytics)
    - [admin-console/src/features/reporting](/Users/andremacmini/Deliberry/admin-console/src/features/reporting)
    - [admin-console/src/features/system-management](/Users/andremacmini/Deliberry/admin-console/src/features/system-management)
- Why it matters:
  - The first-wave retrieval layer is strong.
  - The rest of the live repo still drops agents back into raw repo scanning for many real routes.
- Smallest safe next step:
  - Completed: added direct local READMEs for all remaining merchant long-tail clusters and all remaining admin long-tail clusters, then linked them from [docs/rag-architecture/RETRIEVAL_ENTRY_MERCHANT.md](/Users/andremacmini/Deliberry/docs/rag-architecture/RETRIEVAL_ENTRY_MERCHANT.md), [docs/rag-architecture/RETRIEVAL_ENTRY_ADMIN.md](/Users/andremacmini/Deliberry/docs/rag-architecture/RETRIEVAL_ENTRY_ADMIN.md), and [docs/rag-architecture/RAG_ACTIVE_INDEX.md](/Users/andremacmini/Deliberry/docs/rag-architecture/RAG_ACTIVE_INDEX.md).

#### Gap T02: Customer retrieval coverage is still thin outside the transactional core
- Category: retrieval
- Severity: P2
- Status: CLOSED on 2026-03-17
- Affected surfaces: customer-app
- Exact references:
  - Missing feature-level READMEs for:
    - [customer-app/lib/features/profile](/Users/andremacmini/Deliberry/customer-app/lib/features/profile)
    - [customer-app/lib/features/settings](/Users/andremacmini/Deliberry/customer-app/lib/features/settings)
    - [customer-app/lib/features/notifications](/Users/andremacmini/Deliberry/customer-app/lib/features/notifications)
    - [customer-app/lib/features/reviews](/Users/andremacmini/Deliberry/customer-app/lib/features/reviews)
- Why it matters:
  - The core order flow is covered well.
  - Secondary customer work still has higher startup cost than the transactional path.
- Smallest safe next step:
  - Completed: added direct local READMEs for profile, settings, notifications, and reviews, and linked them from [docs/rag-architecture/RETRIEVAL_ENTRY_CUSTOMER.md](/Users/andremacmini/Deliberry/docs/rag-architecture/RETRIEVAL_ENTRY_CUSTOMER.md) and [docs/rag-architecture/RAG_ACTIVE_INDEX.md](/Users/andremacmini/Deliberry/docs/rag-architecture/RAG_ACTIVE_INDEX.md).

### 4.6 Shared-Contract Risk

#### Gap S01: Shared contract work still lacks a narrow usage map or filemap
- Category: retrieval, shared-contract risk
- Severity: P2
- Status: CLOSED on 2026-03-17
- Affected surfaces: shared, cross-surface
- Exact references:
  - [docs/rag-architecture/RETRIEVAL_ENTRY_SHARED.md](/Users/andremacmini/Deliberry/docs/rag-architecture/RETRIEVAL_ENTRY_SHARED.md)
  - [docs/rag-architecture/SHARED_TASK_GUIDE.md](/Users/andremacmini/Deliberry/docs/rag-architecture/SHARED_TASK_GUIDE.md)
  - [shared/README.md](/Users/andremacmini/Deliberry/shared/README.md)
- Why it matters:
  - The shared retrieval entry now explains the boundary well.
  - It still does not provide a single narrow “contract change filemap” or usage index for tracing a schema or type into the surfaces.
  - Shared edits therefore still require repo-wide follow-up search.
- Smallest safe next step:
  - Completed: added [docs/filemaps/shared-contract-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/shared-contract-filemap.md) and [docs/rag-architecture/SHARED_USAGE_MAP.md](/Users/andremacmini/Deliberry/docs/rag-architecture/SHARED_USAGE_MAP.md), and linked them from the active shared retrieval layer.

### 4.7 Governance-to-Code Drift

#### Gap G01: Mixed metadata formats weaken machine-friendly retrieval consistency
- Category: retrieval, docs
- Severity: P2
- Status: CLOSED on 2026-03-17
- Affected surfaces: cross-surface
- Exact references:
  - [docs/governance/DATE.md](/Users/andremacmini/Deliberry/docs/governance/DATE.md)
  - [docs/governance/GLOSSARY.md](/Users/andremacmini/Deliberry/docs/governance/GLOSSARY.md)
  - [docs/governance/ENFORCEMENT_CHECKLIST.md](/Users/andremacmini/Deliberry/docs/governance/ENFORCEMENT_CHECKLIST.md)
  - compared with standard metadata style in [docs/governance/CONSTITUTION.md](/Users/andremacmini/Deliberry/docs/governance/CONSTITUTION.md) and [docs/rag-architecture/RAG_ACTIVE_INDEX.md](/Users/andremacmini/Deliberry/docs/rag-architecture/RAG_ACTIVE_INDEX.md)
- Why it matters:
  - Most active docs now use the same status/authority/retrieve-when shape.
  - A few important docs still use YAML-style frontmatter instead.
  - That makes the retrieval layer less mechanically uniform than it appears.
- Smallest safe next step:
  - Completed: converted [docs/governance/DATE.md](/Users/andremacmini/Deliberry/docs/governance/DATE.md), [docs/governance/GLOSSARY.md](/Users/andremacmini/Deliberry/docs/governance/GLOSSARY.md), and [docs/governance/ENFORCEMENT_CHECKLIST.md](/Users/andremacmini/Deliberry/docs/governance/ENFORCEMENT_CHECKLIST.md) to the repository-standard retrieval metadata block, and updated [docs/rag-architecture/RAG_METADATA_STANDARD.md](/Users/andremacmini/Deliberry/docs/rag-architecture/RAG_METADATA_STANDARD.md) so one canonical active-doc format remains.

## 5. Exact File and Doc References

All findings above include exact file references. The highest-risk files/docs are:

- [docs/rag-architecture/RAG_ACTIVE_INDEX.md](/Users/andremacmini/Deliberry/docs/rag-architecture/RAG_ACTIVE_INDEX.md)
- [docs/rag-architecture/GOVERNANCE_TO_RAG_MAPPING.md](/Users/andremacmini/Deliberry/docs/rag-architecture/GOVERNANCE_TO_RAG_MAPPING.md)
- [reviews/final_full_system_qa.md](/Users/andremacmini/Deliberry/reviews/final_full_system_qa.md)
- [docs/ui-governance/SCREEN_PATTERN_MATRIX.md](/Users/andremacmini/Deliberry/docs/ui-governance/SCREEN_PATTERN_MATRIX.md)
- [admin-console/src/app/(platform)/layout.tsx](/Users/andremacmini/Deliberry/admin-console/src/app/(platform)/layout.tsx)
- [merchant-console/src/shared/data/merchant-repository.ts](/Users/andremacmini/Deliberry/merchant-console/src/shared/data/merchant-repository.ts)
- [public-website/src/features/app-download/presentation/app-download-screen.tsx](/Users/andremacmini/Deliberry/public-website/src/features/app-download/presentation/app-download-screen.tsx)
- [public-website/src/features/customer-support/presentation/customer-support-screen.tsx](/Users/andremacmini/Deliberry/public-website/src/features/customer-support/presentation/customer-support-screen.tsx)

## 6. Why These Gaps Matter

- Some gaps are product/runtime gaps: admin route enforcement, merchant store-scope data truth, public over-promising copy.
- Some are retrieval/documentation gaps: missing coverage for live feature clusters, stale screen matrix notes, archived date authority still indexed as active.
- Some are governance-alignment gaps: optimistic QA language that hides known non-live partiality and metadata inconsistencies that weaken retrieval reliability.

The main risk is no longer “there are no docs.” The risk is that a coding agent can now retrieve the wrong high-level truth too quickly.

## 7. Gap Type Classification Summary

| Gap ID | Type |
| --- | --- |
| R01 | code, runtime truth, governance alignment |
| R02 | code, runtime truth, source-of-truth ambiguity |
| F01 | retrieval, flow coverage |
| F02 | docs, retrieval, UX/UI governance alignment |
| U01 | code, UX/UI, governance-to-code drift |
| D01 | retrieval, docs, governance alignment |
| D02 | docs, retrieval |
| T01 | retrieval |
| T02 | retrieval |
| S01 | retrieval, shared-contract risk |
| G01 | docs, retrieval |
