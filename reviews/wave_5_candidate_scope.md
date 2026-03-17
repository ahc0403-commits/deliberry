# Wave 5 Candidate Scope — Merchant Store-Scope Truth Hardening

Date: 2026-03-17
Source: post-Wave-4 triage using `docs/governance/WAVE_TRACKER.md`, `docs/rag-architecture/RAG_GAP_AUDIT.md`, `docs/rag-architecture/RAG_PRIORITY_BACKLOG.md`, runtime-truth docs, and `reviews/wave_4_execution_report.md`
Prerequisites: Wave 4 complete
Status: CANDIDATE — NOT YET APPROVED FOR EXECUTION

---

## Executive Summary

After Wave 4 closure, the repository has **10 real remaining open gaps**:

- **5 repo-risk gaps** still active in the RAG/runtime layer
- **5 carry-forward governance-enforcement gaps** still open in the older governance backlog

The next execution wave should **not** be a broad cross-repo cleanup. The strongest remaining runtime-real gap is merchant store scope: the merchant console enforces `storeId` in routes, but the data layer still ignores it and returns the same fixture store across all store-scoped screens.

That makes the best next wave:

**Wave 5 boundary: merchant-console store-scope truth hardening**

This is the tightest high-value wave because it:

1. fixes the highest remaining runtime-truth contradiction
2. stays inside one surface
3. touches one coherent file cluster
4. improves future implementation safety for dashboard, orders, menu, reviews, promotions, settlement, analytics, settings, and store-management at once

---

## Real Remaining Open Gaps

### A. Active Repo-Risk Gaps

| Rank | Gap | Type | Why Still Open |
|---|---|---|---|
| 1 | Merchant store-scope truth is still fake-connected | runtime / implementation | `storeId` is route-real but ignored by the merchant repository |
| 2 | Public `/service` and `/merchant` still lack first-class retrieval coverage | retrieval | live routes still force agents back into manual scanning |
| 3 | Merchant/admin retrieval coverage is still thin across many live routes | retrieval | many active feature clusters still have no local README/runtime/flow coverage |
| 4 | Customer retrieval coverage is still thin outside the transactional core | retrieval | secondary customer work still has higher startup cost |
| 5 | Shared contract work still lacks a narrow usage map/filemap | retrieval | shared edits still require repo-wide follow-up search |

### B. Carry-Forward Governance Gaps Still Open

These are still open in the governance-enforcement tracker, but they are **not** the best next wave:

| Gap | Why Not Wave 5 |
|---|---|
| `GAP-M02` KPI inline `formatMoney()` usage | display-only concern; low runtime risk |
| `GAP-M03` per-status order timestamps | shared model expansion with broader coupling than the current repo needs immediately |
| `GAP-L01` CI governance scan | automation work, not current runtime risk |
| `GAP-L02` placeholder suffixes in payment enum | acceptable until live payment integration |
| `GAP-L03` placeholder suffixes in API contracts | acceptable until live API integration |

---

## Ranked Top 5 Next Gaps

### 1. Merchant store-scope truth hardening
- **Category**: runtime truth / user-facing / implementation
- **Why ranked first**:
  - highest remaining runtime contradiction
  - affects every store-scoped merchant route
  - visible product boundary is currently fake-connected
- **Primary references**:
  - [merchant-repository.ts](/Users/andremacmini/Deliberry/merchant-console/src/shared/data/merchant-repository.ts)
  - [merchant-store-selection-truth.md](/Users/andremacmini/Deliberry/docs/runtime-truth/merchant-store-selection-truth.md)
  - [merchant-orders-truth.md](/Users/andremacmini/Deliberry/docs/runtime-truth/merchant-orders-truth.md)
  - [merchant-menu-truth.md](/Users/andremacmini/Deliberry/docs/runtime-truth/merchant-menu-truth.md)

### 2. Public `/service` and `/merchant` retrieval coverage
- **Category**: retrieval
- **Why ranked second**:
  - live public routes are still under-documented compared with the rest of the public surface
  - low implementation coupling, but still a real agent-startup blind spot
- **Primary references**:
  - [public-website/src/features/service-introduction](/Users/andremacmini/Deliberry/public-website/src/features/service-introduction)
  - [public-website/src/features/merchant-onboarding](/Users/andremacmini/Deliberry/public-website/src/features/merchant-onboarding)
  - [RAG_GAP_AUDIT.md](/Users/andremacmini/Deliberry/docs/rag-architecture/RAG_GAP_AUDIT.md)

### 3. Merchant/admin next-wave retrieval coverage
- **Category**: retrieval
- **Why ranked third**:
  - a large part of the live repo still has no local README/runtime/flow coverage
  - this increases coding startup cost across two large surfaces
- **Primary references**:
  - [RAG_GAP_AUDIT.md](/Users/andremacmini/Deliberry/docs/rag-architecture/RAG_GAP_AUDIT.md)
  - [RAG_PRIORITY_BACKLOG.md](/Users/andremacmini/Deliberry/docs/rag-architecture/RAG_PRIORITY_BACKLOG.md)

### 4. Customer retrieval coverage outside the core transaction path
- **Category**: retrieval
- **Why ranked fourth**:
  - runtime is coherent, but secondary areas still require manual repo scanning
- **Primary references**:
  - [RAG_GAP_AUDIT.md](/Users/andremacmini/Deliberry/docs/rag-architecture/RAG_GAP_AUDIT.md)
  - [customer-app/lib/features](/Users/andremacmini/Deliberry/customer-app/lib/features)

### 5. Shared contract usage map / filemap
- **Category**: retrieval / shared-contract risk
- **Why ranked fifth**:
  - shared boundary guidance is strong
  - tracing a contract into real surface usage is still slower than it should be
- **Primary references**:
  - [RETRIEVAL_ENTRY_SHARED.md](/Users/andremacmini/Deliberry/docs/rag-architecture/RETRIEVAL_ENTRY_SHARED.md)
  - [SHARED_TASK_GUIDE.md](/Users/andremacmini/Deliberry/docs/rag-architecture/SHARED_TASK_GUIDE.md)

---

## Recommended Wave 5 Boundary

**Include only**: merchant-console store-scope truth hardening

### Exact Theme

Make merchant store-scoped routes and merchant data reads agree on the same store truth.

### Why This Boundary Is Optimal

1. **Best runtime payoff**
   - It fixes the strongest remaining fake-connected product boundary.
2. **Single-surface containment**
   - Merchant only. No customer/admin/public spillover.
3. **One file cluster**
   - auth/store-selection routing truth already exists; only the merchant data layer is still lying about store scope.
4. **Safe execution shape**
   - repository/query/read-model and a narrow set of fixture docs can change without redesigning the UI.
5. **Future leverage**
   - Once store scope is real, later merchant work on dashboard/orders/menu/reviews/promotions/settlement/analytics/settings becomes safer and less misleading.

---

## Included Gap for Wave 5

### Merchant store-scope truth hardening

- **Surface**: merchant-console
- **Current state**:
  - route and cookie truth are store-scoped
  - repository truth is still single-store fixture truth
- **Required state**:
  - repository and query-service reads must respect `storeId`
  - store-scoped routes must no longer show the same fixture data regardless of route store
  - if the surface remains single-store by design, that limitation must be made explicit in the repository and read-model layer instead of being silently ignored

### Likely file area

- [merchant-repository.ts](/Users/andremacmini/Deliberry/merchant-console/src/shared/data/merchant-repository.ts)
- [merchant-query-services.ts](/Users/andremacmini/Deliberry/merchant-console/src/shared/data/merchant-query-services.ts)
- [merchant-mock-data.ts](/Users/andremacmini/Deliberry/merchant-console/src/shared/data/merchant-mock-data.ts)
- [merchant-store-selection-truth.md](/Users/andremacmini/Deliberry/docs/runtime-truth/merchant-store-selection-truth.md)
- [merchant-orders-truth.md](/Users/andremacmini/Deliberry/docs/runtime-truth/merchant-orders-truth.md)
- [merchant-menu-truth.md](/Users/andremacmini/Deliberry/docs/runtime-truth/merchant-menu-truth.md)

### Execution guardrails

- do not broaden into merchant write-path implementation
- do not add backend work
- do not redesign merchant screens
- fix read-model truth first
- keep selected-store cookie ownership and route guards intact

---

## Explicitly Excluded from Wave 5

| Gap | Reason for Exclusion |
|---|---|
| Public `/service` + `/merchant` retrieval coverage | docs-only, lower runtime risk than merchant store truth |
| Merchant/admin retrieval coverage expansion | too broad for the next execution wave |
| Customer retrieval expansion | useful but lower risk |
| Shared contract filemap | retrieval-only, not runtime-critical |
| `GAP-M02` | display-only concern |
| `GAP-M03` | shared-model coupling is heavier than the next wave needs |
| `GAP-L01` | automation, not runtime |
| `GAP-L02` / `GAP-L03` | intentionally deferred to live integration readiness |

---

## Dependency Warnings

1. **Wave naming collision**
   - [WAVE_TRACKER.md](/Users/andremacmini/Deliberry/docs/governance/WAVE_TRACKER.md) already contains an older “Gap Plan Wave 5” closure for structural enforcement.
   - This document is the **next post-Wave-4 candidate execution wave**, not a rewrite of that historical governance-enforcement numbering.

2. **Do not solve store scope only in presentation**
   - Fixing labels or route copy without changing [merchant-repository.ts](/Users/andremacmini/Deliberry/merchant-console/src/shared/data/merchant-repository.ts) would preserve the fake connection.

3. **Do not expand to merchant mutations**
   - Orders/menu/store write paths are still separate, larger follow-on work.

---

## Completion Criteria for the Recommended Wave 5

Wave 5 should be considered complete only when:

1. merchant repository/query reads no longer silently ignore `storeId`
2. the merchant runtime-truth docs describe store scope honestly and precisely
3. all touched merchant routes still typecheck and build cleanly
4. no unrelated cross-surface work is pulled into scope

---

*Scope prepared: 2026-03-17*
*Authority basis: current post-Wave-4 runtime truth and retrieval backlog, not the older pre-closure candidate scope*
