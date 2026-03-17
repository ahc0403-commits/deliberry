Status: active
Authority: execution recommendation
Surface: cross-surface
Domains: redesign, backlog-direction, prioritization
Last updated: 2026-03-17
Last verified: 2026-03-17
Retrieve when:
- choosing the next execution wave after the completed customer primary-journey redesign
- deciding whether to continue customer redesign, switch surfaces, or defer into backend/live-transition work
Related files:
- /Users/andremacmini/Deliberry/docs/rag-architecture/RAG_ACTIVE_INDEX.md
- /Users/andremacmini/Deliberry/docs/ui-governance/RUNTIME_REALITY_MAP.md
- /Users/andremacmini/Deliberry/docs/ui-governance/STABILIZATION_REPORT.md
- /Users/andremacmini/Deliberry/reviews/runtime_ui_navigation_dataflow_gap_audit.md
- /Users/andremacmini/Deliberry/reviews/fresh_runtime_gap_audit_round_2.md

# Post-Customer-Primary Redesign Next Direction

## Decision Context

Current repo state:

- RAG cleanup is complete.
- Runtime-visible closure waves are complete.
- Fresh round-two honesty cleanup is complete.
- Customer primary journey redesign is complete.
- No current audit doc recommends another truth-fix wave before new surface work.

This means the next backlog direction should optimize for:

- user-visible value
- low coupling risk
- high reuse of the cleaned retrieval layer
- continuity with already-finished work

## Options Evaluated

### A. Continue customer redesign
Scope:
- `profile`
- `addresses`
- `notifications`
- `reviews`

Assessment:
- User-visible impact: high
  - finishes the same customer surface users already traverse after the redesigned primary journey
  - improves the account-side routes that now feel visually behind the primary flow
- Execution cost: low to moderate
  - surface is already stabilized
  - retrieval docs are strong
  - shared customer UI primitives were just upgraded and can be reused immediately
- Coupling risk: low
  - account routes are mostly presentation/local-state work
  - runtime truth is already explicit in session, address, and order-linked review docs
- Readiness: very high
  - [RETRIEVAL_ENTRY_CUSTOMER.md](/Users/andremacmini/Deliberry/docs/rag-architecture/RETRIEVAL_ENTRY_CUSTOMER.md), local READMEs, and flows are already sufficient for a narrow redesign wave
- Preserves RAG-first benefit: yes
  - stays inside one already-documented surface and reuses the same local truth layer

### B. Move to merchant redesign
Scope:
- `dashboard`
- `orders`
- `menu`
- `settings`
- `store-management`

Assessment:
- User-visible impact: medium to high
  - merchant is an important live surface
  - dashboard/orders/menu are central routes
- Execution cost: moderate
  - the surface is broader and splits between route truth, store scope, fixture-backed reads, and many honest read-only states
- Coupling risk: moderate
  - dashboard, orders, menu, settings, and store-management sit on different truth boundaries
  - menu/settings/store-management are still intentionally non-persistent, so redesign work risks pushing against demo-safe limits
- Readiness: good, but less clean than customer-secondary
  - merchant retrieval coverage is strong, but the surface is still more fragmented than the customer continuation path
- Preserves RAG-first benefit: yes
  - but requires more truth-awareness per cluster to avoid over-designing preview-only states

### C. Move to public redesign
Scope:
- `landing`
- `service`
- `merchant`
- `download`
- `support`
- `legal`

Assessment:
- User-visible impact: medium
  - public routes are visible, but mostly static marketing/legal content
- Execution cost: low to moderate
  - route ownership is clear and retrieval is strong
- Coupling risk: low
  - most work is screen-owned and presentation-only
- Readiness: high
  - public runtime-truth docs are clear and the routes are first-class retrieval targets
- Preserves RAG-first benefit: yes
  - but the outcome is mostly presentation polish, not deeper flow continuity

### D. Shift to real write-path expansion / live-transition prep
Scope:
- durable writes
- provider-backed auth
- backend-backed truth

Assessment:
- User-visible impact: potentially very high later, but low immediate execution readiness
- Execution cost: high
- Coupling risk: very high
- Readiness: low
  - [wave_6_runtime_integration_report.md](/Users/andremacmini/Deliberry/reviews/wave_6_runtime_integration_report.md) explicitly says this is blocked on backend infrastructure that does not exist yet
- Preserves RAG-first benefit: no
  - this would force a scope jump beyond current demo-safe architecture instead of benefiting from the cleaned retrieval layer

### E. Run another focused audit instead of redesign

Assessment:
- User-visible impact: low
- Execution cost: low
- Coupling risk: low
- Readiness: high
- Preserves RAG-first benefit: yes
- But not justified now:
  - [runtime_ui_navigation_dataflow_gap_audit.md](/Users/andremacmini/Deliberry/reviews/runtime_ui_navigation_dataflow_gap_audit.md) is closed
  - [fresh_runtime_gap_audit_round_2.md](/Users/andremacmini/Deliberry/reviews/fresh_runtime_gap_audit_round_2.md) is also closed
  - a new audit immediately after a successful redesign wave is unlikely to outperform a narrow redesign continuation

## Recommended Next Backlog Direction

### Recommendation: A. Continue customer redesign

Recommended next wave:

- `customer-app` secondary account journey
  - `profile`
  - `addresses`
  - `notifications`
  - `reviews`

## Why This Is the Best Next Move

1. It completes one coherent surface before context-switching.
   - The customer primary journey was just redesigned.
   - The next strongest move is to finish the customer account-side routes so the whole customer surface feels intentionally designed, not half-upgraded.

2. It has the best user-impact-to-cost ratio.
   - These routes are live, visible, and frequently adjacent to the just-redesigned orders/profile experience.
   - They are mostly presentation and route-handoff work, not backend or mutation-architecture work.

3. It has the lowest coupling risk of the redesign options.
   - Customer secondary routes already have clear runtime and route truth:
     - session truth for profile
     - local address truth in `CustomerRuntimeController`
     - honest local/mock inbox behavior for notifications
     - order-linked local preview truth for reviews

4. It preserves the benefit of the cleaned RAG layer.
   - Customer retrieval entry, local READMEs, runtime-truth docs, and the `customer-profile-settings-flow` already make this wave fast to start and easy to constrain.

5. It avoids jumping prematurely into blocked or fragmented work.
   - Merchant redesign is viable, but it spans more preview-only and fixture-backed operational surfaces.
   - Public redesign is easy, but lower leverage now that public truth/alignment is already materially clean.

## What Should Explicitly Wait

### Wait after the customer-secondary redesign wave

- Merchant redesign
  - Start only after the customer surface feels complete end-to-end.
  - Best follow-on merchant cluster would be:
    - `dashboard`
    - `orders`
    - `menu`
  - Keep `settings` and `store-management` behind those, because they are intentionally more read-only/demo-safe.

- Public redesign
  - Public routes are currently honest and retrieval-complete.
  - They can wait until after customer-secondary or merchant-core work unless there is a specific marketing launch need.

- Real write-path/live-transition prep
  - Explicitly wait.
  - This is blocked by absent backend infrastructure and would broaden beyond the current repo’s runtime-safe phase.

- Another audit-only wave
  - Explicitly wait.
  - There is no evidence-based need for another focused audit immediately after the completed closure work and the first redesign wave.

## Smallest Execution-Ready Next Boundary

If executed next, the boundary should be:

- one `customer-app` secondary redesign wave only
- files/doc clusters:
  - `customer-app/lib/features/profile/`
  - `customer-app/lib/features/addresses/`
  - `customer-app/lib/features/notifications/`
  - `customer-app/lib/features/reviews/`
  - [docs/flows/customer-profile-settings-flow.md](/Users/andremacmini/Deliberry/docs/flows/customer-profile-settings-flow.md)
  - the related local READMEs and runtime-truth docs already listed in [RETRIEVAL_ENTRY_CUSTOMER.md](/Users/andremacmini/Deliberry/docs/rag-architecture/RETRIEVAL_ENTRY_CUSTOMER.md)

## Dependency Warnings

- Do not let secondary customer redesign imply richer persisted account truth than exists today.
- Keep reviews tied to order-linked context; do not reintroduce standalone review submission from profile.
- Keep address edits aligned with current local-session truth, not fake persistence.
- Do not let customer-secondary polish reopen already-closed honesty or runtime-boundary issues.
