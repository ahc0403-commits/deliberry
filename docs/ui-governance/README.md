# Customer App UI Governance

Status: active
Authority: advisory
Surface: customer-app
Domains: ui-governance, navigation, state, patterns
Last updated: 2026-03-16
Last verified: 2026-03-16
Retrieve when:
- entering the customer UI governance set for the first time
- deciding which customer UI governance doc to read next
Related files:
- docs/ui-governance/UX_PRINCIPLES.md
- docs/ui-governance/NAVIGATION_TRUTH_MAP.md
- docs/ui-governance/RUNTIME_REALITY_MAP.md

This folder turns the current rebuilt `customer-app` UI into an explicit rule set for future work.

Scope:
- Applies only to `customer-app`.
- Uses the live implementation in `customer-app/lib/` as the baseline sample set.
- Preserves current strengths before introducing new patterns.
- Records current weak spots as governance risks instead of treating them as reasons to redesign from scratch.

Use these docs in this order:
1. `UX_PRINCIPLES.md`
2. `UI_SYSTEM.md`
3. `SCREEN_TYPES.md`
4. `SCREEN_COMPOSITION_RULES.md`
5. `INTERACTION_PATTERNS.md`
6. `STATE_MODELING_RULES.md`
7. `COPY_TONE_RULES.md`
8. `ACCESSIBILITY_RULES.md`
9. `UX_DECAY_PATH.md`
10. `SCREEN_PATTERN_MATRIX.md`
11. `PR_CHECKLIST_UI_GOVERNANCE.md`
12. `QA_CHECKLIST_UI_GOVERNANCE.md`

How engineers should use this set:
- Before building a screen, identify its screen type in `SCREEN_TYPES.md`.
- Match the layout and section order to `SCREEN_COMPOSITION_RULES.md`.
- Reuse an existing interaction from `INTERACTION_PATTERNS.md` before adding a new one.
- Model all required states from `STATE_MODELING_RULES.md`.
- Validate titles, CTAs, and microcopy against `COPY_TONE_RULES.md`.
- Check color, sizing, labels, and motion against `ACCESSIBILITY_RULES.md`.
- Review the screen in `SCREEN_PATTERN_MATRIX.md` to stay aligned with current app patterns.
- Run the PR and QA checklists before merging.

Baseline evidence:
- Live code in `customer-app/lib/app/`, `customer-app/lib/core/theme/`, `customer-app/lib/core/data/`, and `customer-app/lib/features/`
- `reviews/customer_ui_change_log.md`
- `reviews/customer_ui_execution_plan.md`

Non-goals:
- This is not a repo-wide design system.
- This is not a visual redesign brief.
- This does not move customer UI into repo-level `shared`.
