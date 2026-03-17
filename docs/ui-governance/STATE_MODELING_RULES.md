# State Modeling Rules

Status: active
Authority: advisory
Surface: customer-app
Domains: state, loading, error, partial-support
Last updated: 2026-03-16
Last verified: 2026-03-16
Retrieve when:
- adding or reviewing loading, empty, error, partial, or locked states
- checking whether a customer route is honest about mock-backed or limited behavior
Related files:
- docs/ui-governance/RUNTIME_REALITY_MAP.md
- docs/ui-governance/INTERACTION_PATTERNS.md
- customer-app/lib/core/data/customer_runtime_controller.dart

## Common State Categories
- `Loading`: waiting for route hydration, local submission, or data refresh
- `Empty`: valid state with no content yet
- `Populated`: standard working state
- `Partial`: some content available, some actions unavailable
- `Success`: task completed and ready to continue
- `Error`: user action or content failed
- `Locked`: route access blocked by auth, guest restrictions, or onboarding requirements

## Required State Coverage By Screen Type
- Entry:
  - loading
  - locked routing
  - default signed-out landing
- Auth:
  - idle
  - input invalid
  - submitting
  - error
- Onboarding:
  - page progression
  - completion
- Feed / Discovery / Search:
  - populated
  - empty
  - optional loading
- Detail / Menu:
  - populated
  - empty category
  - partial when actions are unavailable
- Cart / Checkout:
  - empty cart
  - populated
  - submitting
  - success
  - inline validation error
- Orders / Tracking:
  - active populated
  - history populated
  - empty
  - partial if some actions are unavailable
- Profile / Settings / Notifications / Addresses:
  - populated
  - empty where relevant
  - confirm/destructive dialog state

## Loading Rules
- Use a full-screen loader only when the user cannot interact with anything until the route resolves.
  - Example: session hydration in `customer_entry_screen.dart`
- Use inline loading or CTA-level loading when only one action is waiting.
  - Example: phone auth continue/loading state
  - Example: group order create room loading state
- Prefer skeletons over spinners for list-heavy future data states.
- Use spinners only for short, isolated, blocking waits.

## Empty State Rules
- Every list screen needs a designed empty state.
- An empty state needs a CTA when there is an obvious recovery path.
  - cart empty -> browse restaurants
  - orders empty -> browse restaurants
- An empty state may omit a CTA when the best action is simply to wait or go back.

## Error Rules
- Use inline error for:
  - form validation
  - retryable CTA failure
  - field-specific issues
- Use a full-screen error only when the entire route cannot render.
- Error messages must name the problem and the recovery action.
- Do not use snack bars as the only error surface for multi-field forms.

## Success Rules
- Success states must either:
  - move the user forward immediately
  - or show a compact success view with a clear next step
- Example:
  - review submission success view

## Locked / Access State Rules
- Access control belongs in the router and session controller.
- Guest, signed-in, otp-pending, and onboarding-required are different access states, not just different copies.
- Locked state rules from current code:
  - route guards in `customer-app/lib/app/router/app_router.dart`
  - status source in `customer-app/lib/core/session/customer_session_controller.dart`

## Preserve State Across Navigation
- Preserve search query when pushing from search to store and back.
- Preserve active tab when leaving and returning within the same tab route.
- Preserve selected chips inside the current route instance.
- Preserve cart state across store, menu, cart, and checkout routes.
- Preserve partially entered form state while the user remains in the same route or sheet session.

## Anti-Patterns In Local UI State Design
- Controllers created in `build` for forms expected to preserve input.
- No-op action handlers on screens that visually imply completion.
- Fake delays without a clear success or failure model.
- Separate duplicated local states for the same concept across adjacent screens.
- Query, filter, cart, and checkout state that resets unexpectedly on normal back navigation.
- UI showing delivery or order progression that looks live when it is static mock state.

## Current Governance Risks Found
- Auth and onboarding transitions are visually polished but still run on in-memory route state.
- Filters do not round-trip into shared search/discovery results state yet.
- Store detail ignores passed route arguments and always loads one mock store.
- Group order is polished but still mostly placeholder behavior.
- Several account/settings actions are still non-functional.
