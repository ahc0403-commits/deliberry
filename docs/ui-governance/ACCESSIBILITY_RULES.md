# Accessibility Rules

Status: active
Authority: advisory
Surface: customer-app
Domains: accessibility, tap-targets, semantics
Last updated: 2026-03-16
Last verified: 2026-03-16
Retrieve when:
- adding or reviewing interactive controls, forms, icons, or feedback states
- checking customer UI semantic clarity and minimum tap-target expectations
Related files:
- docs/ui-governance/INTERACTION_PATTERNS.md
- docs/ui-governance/UI_GAP_AUDIT.md
- customer-app/lib/features/common/presentation/widgets.dart

## Tap Target Rules
- Minimum interactive hit area: `44x44`.
- Icon-only actions must still meet the minimum target.
- Chip rows and segmented controls must preserve at least `8` horizontal spacing between interactive elements.

## Contrast Expectations
- Primary text must remain readable on white and gray surfaces.
- White text on gradient heroes must stay above readable contrast.
- Secondary text may be muted but must stay readable at normal body sizes.
- Do not communicate selected/unread/error/success using color alone.

## Typography Legibility
- Primary reading text should stay at `14+`.
- Captions and metadata may use `12`, but not for critical instructions.
- Do not stack multiple low-contrast small labels in the same block.

## Icon-Without-Label Restrictions
- Icon-only actions are allowed only when convention is obvious:
  - back
  - close
  - favorite
  - share
  - overflow
- Any non-obvious action needs a text label or tooltip semantics.

## Form Labeling Rules
- Important text inputs need visible labels or persistent context, not hint-only reliance.
- Error states must identify the exact field or action causing failure.
- Keyboard type must match the expected input.
- Focus state must be visually stronger than idle state.

## Focus / Selection Visibility
- Focused inputs need stronger border treatment.
- Selected chips must change fill and text color, not just border.
- Selected payment options need border + icon/text change.
- Active tabs need visible color and indicator change.

## Error Clarity Rules
- Destructive dialogs must clearly label the destructive action.
- Validation should stay near the field or CTA, not hidden in logs or silent failure.
- Snack bars may reinforce success or simple validation, but not replace full inline error handling for multi-field forms.

## Motion Restraint Rules
- Use short, purposeful animations only:
  - chip selection
  - rating label switch
  - page transitions
  - countdown updates
- Do not use looping decorative animation on feed, cart, checkout, or settings screens.
- If motion does not explain state change, remove it.

## Scroll And Safe-Area Rules
- Sticky bottom actions must respect safe-area insets.
- Bottom nav and bottom CTA must not overlap scrollable content.
- Bottom sheets must respect keyboard insets.

## Semantic Rules For Flutter Implementation
- Provide semantic labels for:
  - rating stars
  - quantity buttons
  - status badges if color meaning is important
  - unread notification markers
- Swipe-to-dismiss patterns need a non-gesture alternative where feasible.
- Tab controls and chip rows should remain reachable with assistive navigation.
