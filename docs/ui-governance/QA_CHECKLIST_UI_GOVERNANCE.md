# QA Checklist: UI Governance

Status: active
Authority: operational
Surface: customer-app
Domains: qa, ui-governance, checklist
Last updated: 2026-03-16
Last verified: 2026-03-16
Retrieve when:
- manually validating customer screens or flows against the UI governance system
- checking route continuity, state behavior, and CTA clarity in QA
Related files:
- docs/ui-governance/NAVIGATION_TRUTH_MAP.md
- docs/ui-governance/STATE_MODELING_RULES.md
- docs/ui-governance/ACCESSIBILITY_RULES.md

- Does the route open the expected screen type immediately?
- Does navigation into and out of the screen preserve user context?
- Is the screen hierarchy obvious within the first viewport?
- Is the primary action obvious without reading every block?
- If the screen has a sticky bottom CTA, does it stay visible, readable, and safe-area correct?
- If the screen uses tabs, chips, or segmented controls, is the selected state unmistakable?
- If the screen lists cards or rows, is grouping visually consistent and not over-nested?
- Does the screen show the correct empty state when content is missing?
- Does the screen show the correct loading behavior during route hydration or submission?
- Do validation and error states explain what the user must do next?
- Do destructive flows require explicit confirmation?
- Are read/unread, selected/unselected, and success/error states visible without relying on color alone?
- Are form labels, helper text, and button labels readable and specific?
- Are icons understandable with their surrounding labels or context?
- Do support/help actions feel secondary to the main journey unless the screen is support-led?
- Does copy sound consistent with the rest of the app: warm, direct, concise?
- Does the screen avoid revealing implementation language or placeholder language to the user?
- Does the behavior match the established customer-app patterns in `SCREEN_PATTERN_MATRIX.md`?
- If the screen is mocked, is the mock behavior honest and non-misleading?
