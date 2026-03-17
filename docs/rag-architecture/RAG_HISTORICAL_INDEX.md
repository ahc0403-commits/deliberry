# RAG Historical Index

Status: active
Authority: operational
Surface: cross-surface
Domains: rag, retrieval, historical-doc-index
Last updated: 2026-03-16
Last verified: 2026-03-16
Retrieve when:
- checking whether an older audit or plan is still current
- finding historical context without mistaking it for active authority
Related files:
- docs/rag-architecture/RAG_ACTIVE_INDEX.md

## Historical Docs That Should Not Be Treated As Primary Truth

- [docs/governance/RECONCILIATION_GAP_ANALYSIS.md](/Users/andremacmini/Deliberry/docs/governance/RECONCILIATION_GAP_ANALYSIS.md)
  - historical baseline for the original governance gap inventory
- [reviews/customer_ui_change_log.md](/Users/andremacmini/Deliberry/reviews/customer_ui_change_log.md)
  - rebuild-era change history, superseded by customer UI governance and stabilization docs
- [reviews/customer_ui_execution_plan.md](/Users/andremacmini/Deliberry/reviews/customer_ui_execution_plan.md)
  - initial rebuild plan, no longer the current customer UI operating document
- [reviews/customer_ui_gap_audit.md](/Users/andremacmini/Deliberry/reviews/customer_ui_gap_audit.md)
  - pre-rebuild placeholder audit, superseded by [docs/ui-governance/UI_GAP_AUDIT.md](/Users/andremacmini/Deliberry/docs/ui-governance/UI_GAP_AUDIT.md)
- [reviews/full_surface_revalidation.md](/Users/andremacmini/Deliberry/reviews/full_surface_revalidation.md)
  - cross-surface pre-rebuild audit baseline, later followed by [reviews/final_full_system_qa.md](/Users/andremacmini/Deliberry/reviews/final_full_system_qa.md)
- [reviews/final_full_system_qa.md](/Users/andremacmini/Deliberry/reviews/final_full_system_qa.md)
  - 2026-03-16 QA snapshot; no longer safe as the current operational baseline, superseded by active runtime-truth and stabilization docs

## Retrieval Rule

- Use historical docs only for change history, rationale tracing, or before/after comparison.
- Do not use them to override active governance or active runtime/status docs.
