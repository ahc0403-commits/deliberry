# UX Decay Path

Status: active
Authority: advisory
Surface: customer-app
Domains: ui-decay, anti-patterns, maintainability
Last updated: 2026-03-16
Last verified: 2026-03-16
Retrieve when:
- reviewing a customer UI change for maintainability risk
- checking whether a proposed shortcut repeats a known UI decay path
Related files:
- docs/ui-governance/UI_GAP_AUDIT.md
- docs/ui-governance/PR_CHECKLIST_UI_GOVERNANCE.md
- docs/ui-governance/SCREEN_TYPES.md

| Decay Path | Symptom | Root Cause | Detection Method | Prevention Rule | Repair Guidance |
| --- | --- | --- | --- | --- | --- |
| Inconsistent CTA hierarchy | Multiple filled buttons compete on one screen | No screen-type discipline | PR review of primary/secondary/tertiary actions | One screen, one dominant filled CTA | Reduce to one filled CTA and demote alternates |
| Screen-type drift | Screen mixes feed, form, and settings patterns | No explicit screen taxonomy | Compare screen against `SCREEN_TYPES.md` | Choose one primary screen type before composing | Split the screen or reorder sections to match one type |
| Token drift | New colors, radii, or type sizes appear ad hoc | Bypassing `AppTheme` | Diff against `app_theme.dart` | Extend existing theme roles before adding new tokens | Replace ad hoc values with theme-backed roles |
| Pattern duplication | Similar flows diverge visually or behaviorally | New implementation ignores shared widgets | Search for parallel implementations of the same pattern | Reuse `widgets.dart` primitives first | Consolidate to shared customer widget or explicit rule |
| State inconsistency | Similar screens handle empty/loading/error differently | No required state checklist | QA across screen family | Model required states per screen type | Add missing states and align wording/layout |
| Placeholder text leakage | User-facing copy says placeholder/structural/handoff | Implementation language leaks into UI | Copy review | Ban implementation language from visible copy | Rewrite to user task language |
| Card/list over-nesting | White cards are stacked inside white cards with repeated borders | Misusing cards as generic wrappers | Visual inspection | One card equals one concept | Flatten the layout and use dividers or spacing instead |
| Bottom CTA misuse | Sticky CTA appears on browse or read screens without need | Reusing transactional pattern everywhere | QA on screen scroll behavior | Use sticky CTA only for transactional continuation | Remove sticky bar or convert to inline action |
| Mixed copy tone | Some screens feel friendly, others feel system-generated or technical | No copy rules | Cross-screen copy pass | Follow `COPY_TONE_RULES.md` | Rewrite titles, CTA labels, and helper text to one tone |
| Ad-hoc status colors | Status meaning changes by screen | Per-screen color improvisation | Compare status badges and status text across order flows | Status colors must map to stable meaning | Replace with shared status mapping and badge rules |

## Current Decay Risks Already Visible
- `store_screen.dart` and `menu_browsing_screen.dart` duplicate menu browsing composition and can drift.
- Several polished screens still have no-op handlers, which creates behavior credibility drift.
- `profile_screen.dart` and `settings_screen.dart` imply full account management while many actions are not connected yet.
- `group_order` screens look more complete than their actual behavior.
- Search/filter state is visually complete but not yet durable across the browse flow.
