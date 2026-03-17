# PR Checklist: UI Governance

Status: active
Authority: operational
Surface: customer-app
Domains: review, ui-governance, checklist
Last updated: 2026-03-16
Last verified: 2026-03-16
Retrieve when:
- reviewing a customer UI pull request
- translating customer UI governance into an applied review pass
Related files:
- docs/ui-governance/SCREEN_TYPES.md
- docs/ui-governance/UX_DECAY_PATH.md
- docs/ui-governance/ACCESSIBILITY_RULES.md

- Is the screen type explicitly identified and aligned with `SCREEN_TYPES.md`?
- Does the route belong to the correct customer-owned route group?
- Does the screen reuse an existing customer widget or pattern before introducing a new one?
- Does the screen follow the current theme tokens from `AppTheme` instead of adding ad hoc values?
- Is there exactly one dominant primary CTA for the screen?
- Are secondary and tertiary actions visually demoted correctly?
- Does the composition follow the correct section ordering for the screen type?
- If the screen is transactional, is sticky CTA behavior justified and implemented correctly?
- If the screen is browse-led, is the primary action item tap or search, not a competing full-width CTA?
- Are loading, empty, populated, success, error, and locked states handled where required?
- If a CTA is visible, is its behavior real and not a silent no-op?
- If a state is still intentionally mocked, is the UI honest about that where needed?
- Are destructive actions isolated and confirmed?
- Are copy, titles, and CTA labels aligned with `COPY_TONE_RULES.md`?
- Is implementation language absent from user-facing copy?
- Are status colors, badge colors, and discount colors consistent with the existing system?
- Are tap targets, focus visibility, labels, and contrast aligned with `ACCESSIBILITY_RULES.md`?
- Does the change avoid a known decay path from `UX_DECAY_PATH.md`?
- If the screen overlaps an existing pattern, was the `SCREEN_PATTERN_MATRIX.md` consulted and updated if needed?
