# RAG Unit Catalog

Status: Proposed
Last updated: 2026-03-16

## 1. Governance Unit

- Purpose: retrieve binding rules before implementation.
- Retrieve when: a task may affect architecture, boundaries, statuses, time, roles, or shared contracts.
- Required metadata:
  - `authority_level`
  - `surface_scope`
  - `domains`
  - `rule_ids`
  - `status`
  - `last_updated`
- Ideal granularity: section-level chunks, roughly 300 to 900 words.
- Examples:
  - [docs/governance/CONSTITUTION.md](/Users/andremacmini/Deliberry/docs/governance/CONSTITUTION.md)
  - [docs/governance/STRUCTURE.md](/Users/andremacmini/Deliberry/docs/governance/STRUCTURE.md)
  - [docs/governance/FLOW.md](/Users/andremacmini/Deliberry/docs/governance/FLOW.md)
- Governance relationship: primary authority. Never superseded by local notes.

## 2. Surface Unit

- Purpose: describe one surface’s runtime model, route ownership, shells, and local conventions.
- Retrieve when: work is surface-scoped.
- Required metadata:
  - `surface`
  - `runtime`
  - `entry_points`
  - `shells`
  - `local_truth_files`
  - `related_governance`
- Ideal granularity: one overview doc per surface plus smaller route/feature supplements.
- Examples:
  - customer-app route/runtime bundle around router, shell, session, runtime controller
  - merchant console auth/store-shell bundle
- Governance relationship: downstream of structure and flow.

## 3. Flow Unit

- Purpose: capture one end-to-end user or domain flow as an implementation bundle.
- Retrieve when: bugs or changes span multiple screens/routes/files.
- Required metadata:
  - `surface`
  - `flow_name`
  - `entry_routes`
  - `exit_routes`
  - `runtime_sources`
  - `states`
  - `related_rules`
- Ideal granularity: one doc per important journey or domain flow.
- Examples:
  - customer `Home -> Store -> Menu -> Cart -> Checkout -> Orders`
  - merchant `Login -> Onboarding -> Select Store -> Store Dashboard`
- Governance relationship: grounded in `FLOW.md` plus surface-local runtime truth.

## 4. Runtime-Truth Unit

- Purpose: identify where mutable truth lives for a given feature or journey.
- Retrieve when: state continuity, handoff, submission, or persistence is involved.
- Required metadata:
  - `surface`
  - `domain`
  - `truth_owner`
  - `read_paths`
  - `write_paths`
  - `mock_or_live`
  - `integrity_risks`
- Ideal granularity: one doc per runtime cluster, not per widget.
- Examples:
  - [customer-app/lib/core/data/customer_runtime_controller.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/data/customer_runtime_controller.dart)
  - [merchant-console/src/shared/data/merchant-repository.ts](/Users/andremacmini/Deliberry/merchant-console/src/shared/data/merchant-repository.ts)
- Governance relationship: should link to structure, flow, and date policies.

## 5. File-Map Unit

- Purpose: tell an agent which files change together for a given task type.
- Retrieve when: implementation is imminent and raw repo search would be noisy.
- Required metadata:
  - `surface`
  - `task_type`
  - `primary_files`
  - `adjacent_files`
  - `do_not_edit_files`
  - `common_tests_or_checks`
- Ideal granularity: small bundle docs, 10 to 30 file references.
- Examples:
  - customer route change filemap
  - shared contract change filemap
- Governance relationship: derived from structure. This is a navigation aid, not an authority.

## 6. Pattern Unit

- Purpose: provide reusable UI or interaction rules without rereading all UI governance.
- Retrieve when: customer UI work touches composition, state, CTA hierarchy, accessibility, or navigation.
- Required metadata:
  - `surface`
  - `pattern_type`
  - `screen_types`
  - `required_states`
  - `example_files`
  - `anti_patterns`
- Ideal granularity: one pattern family per doc section or matrix row.
- Examples:
  - screen type rules from [docs/ui-governance/SCREEN_TYPES.md](/Users/andremacmini/Deliberry/docs/ui-governance/SCREEN_TYPES.md)
  - interaction rules from [docs/ui-governance/INTERACTION_PATTERNS.md](/Users/andremacmini/Deliberry/docs/ui-governance/INTERACTION_PATTERNS.md)
- Governance relationship: customer UI authority.

## 7. Decision-History Unit

- Purpose: capture exceptions and rationale that materially affect future implementation.
- Retrieve when: an agent asks why a rule was bent, why a runtime shape exists, or whether an exception is allowed.
- Required metadata:
  - `decision_id`
  - `status`
  - `date`
  - `surfaces`
  - `rules_affected`
  - `supersedes`
- Ideal granularity: one decision or exception per file.
- Examples:
  - future `docs/governance/exceptions/YYYY-MM-DD-rule-id.md`
- Governance relationship: subordinate to constitution. Exception records must reference the higher rule.

## 8. Known-Gap Unit

- Purpose: preserve current implementation truth about what is incomplete, partial, or risky.
- Retrieve when: planning work, choosing safe scope, or avoiding fake completion.
- Required metadata:
  - `surface`
  - `severity`
  - `status`
  - `affected_files`
  - `cleanup_wave`
- Ideal granularity: audit issue or backlog item collections by surface.
- Examples:
  - [docs/ui-governance/UI_GAP_AUDIT.md](/Users/andremacmini/Deliberry/docs/ui-governance/UI_GAP_AUDIT.md)
  - [docs/ui-governance/UI_REFACTOR_BACKLOG.md](/Users/andremacmini/Deliberry/docs/ui-governance/UI_REFACTOR_BACKLOG.md)
  - `reviews/*_execution_plan.md`
- Governance relationship: non-authoritative but operationally important.

## 9. Local Feature README Unit

- Purpose: give agents a short, code-adjacent retrieval entry for frequently edited feature clusters.
- Retrieve when: working repeatedly in the same feature area.
- Required metadata:
  - `surface`
  - `feature`
  - `routes`
  - `truth_files`
  - `dependencies`
  - `governance_links`
  - `common_change_types`
- Ideal granularity: one README per major feature cluster, not per tiny folder.
- Examples:
  - future customer `features/store/README.md`
  - future merchant `features/orders/README.md`
- Governance relationship: downstream implementation guidance only.

## 10. Units the Repository Does Not Need Yet

- Per-widget README units.
- Generic “architecture glossary” units separate from existing governance.
- Vector-database-specific chunk families.
- Large cross-surface “UI system” docs not grounded in one surface owner.

These would add maintenance cost without matching the current code structure.
