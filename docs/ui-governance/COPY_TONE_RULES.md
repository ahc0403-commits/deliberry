# Copy Tone Rules

Status: active
Authority: advisory
Surface: customer-app
Domains: copy, tone, microcopy
Last updated: 2026-03-16
Last verified: 2026-03-16
Retrieve when:
- changing titles, subtitles, CTA labels, helper text, or empty-state copy
- checking whether user-facing wording is honest and on-tone
Related files:
- docs/ui-governance/UX_PRINCIPLES.md
- docs/ui-governance/STATE_MODELING_RULES.md
- docs/ui-governance/UX_DECAY_PATH.md

## Tone Baseline
- Warm
- direct
- concise
- reassuring without sounding corporate
- delivery-first, not dashboard-like

## CTA Writing Rules
- Lead with the action verb.
- Make the destination obvious.
- Use short labels:
  - `Get Started`
  - `Continue with Phone`
  - `View Cart`
  - `Place Order`
  - `Submit Review`
- Use tertiary link copy for low-priority branches:
  - `Continue as Guest`
  - `Wrong number? Change it`

## Title And Subtitle Rules
- Titles:
  - one idea only
  - strong and fast to scan
- Subtitles:
  - explain benefit or next step
  - one or two short sentences max
- Do not use architecture or implementation language in user-facing copy.

## Microcopy Style
- Prefer plain language over feature language.
- Use concrete delivery vocabulary:
  - order
  - cart
  - address
  - delivery
  - review
- Keep helper copy calm and supportive.
- Keep timestamps and counts compact.

## Error Message Rules
- State what is wrong.
- State what the user can do next.
- Keep blame out of the message.
- Examples of acceptable style:
  - `Please select a rating`
  - `Enter a valid phone number`
  - `Try a different search term`

## Success Message Rules
- Confirm the completed action clearly.
- Point to the next obvious step.
- Keep success copy shorter than error copy.

## Empty State Writing Rules
- Title explains the state.
- Subtitle explains the recovery path or what will appear later.
- CTA appears only when there is a clear recovery path.

## Guest Vs Signed-In Tone
- Guest tone:
  - welcoming
  - low-friction
  - comparison-friendly
- Signed-in tone:
  - personal
  - concise
  - utility-driven

## Support / Help Wording Rules
- Use plain wording:
  - `Get Help`
  - `Contact Us`
  - `Need Help?`
- Avoid escalation language unless it is truly a support escalation flow.

## Banned Wording Patterns
- `ownership`
- `handoff`
- `placeholder`
- `structural`
- `runtime`
- `provider`
- `implementation`
- `click here`
- `submit` when a more specific verb exists
- vague CTA labels such as `Continue` without context when a more precise label is available

## Current App Consistency Improvements To Preserve
- Strong action-led CTAs in entry/auth/order/cart flows
- Friendly browse/discovery copy
- Honest notice copy in checkout about placeholder payment processing

## Current Risks To Correct Over Time
- Avoid hardcoded identity copy in profile once real account data lands.
- Keep onboarding and group-order copy from sounding final if behavior remains mocked.
