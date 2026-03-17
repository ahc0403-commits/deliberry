Status: active
Authority: review
Surface: cross-surface
Domains: visual-qa, redesign-planning, presentation-polish
Last updated: 2026-03-17
Last verified: 2026-03-17
Retrieve when:
- deciding the next redesign wave after public trust/support completion
- checking whether another meaningful presentation wave remains across the main product surfaces
Related files:
- /Users/andremacmini/Deliberry/reviews/cross_surface_visual_qa.md
- /Users/andremacmini/Deliberry/public-website/src/features/customer-support/presentation/customer-support-screen.tsx
- /Users/andremacmini/Deliberry/merchant-console/src/features/auth/presentation/login-screen.tsx
- /Users/andremacmini/Deliberry/merchant-console/src/features/onboarding/presentation/onboarding-screen.tsx
- /Users/andremacmini/Deliberry/merchant-console/src/features/store-selection/presentation/store-selection-screen.tsx
- /Users/andremacmini/Deliberry/admin-console/src/features/auth/presentation/login-screen.tsx
- /Users/andremacmini/Deliberry/admin-console/src/features/permissions/presentation/access-boundary-screen.tsx

# Cross-Surface Visual QA Round 2

## Scope Audited

- `public-website`
- `merchant-console`
- `admin-console`
- `customer-app` at a high level only

This was a presentation-audit pass only. No code was changed.

## Audit Method

This pass started from the earlier cross-surface QA review and the recent redesign closure trail, then re-checked the current live presentation owners for:

- public acquisition and trust routes
- merchant core and entry routes
- admin oversight and entry routes
- customer primary and secondary journey screens at a high level

The purpose was to determine whether another redesign wave is still justified, and if so, where the highest-ROI outlier cluster now lives.

## Surface-by-Surface Findings

### Public Website

Current state:

- The public surface now reads as one coherent acquisition and trust layer.
- `landing`, `service`, `merchant`, `download`, `support`, `privacy`, `terms`, and `refund-policy` now share stronger route framing and clearer trust signaling.

Confirmed visual status:

- No major remaining public presentation outlier was found in the audited routes.
- The recent support/legal completion wave materially closed the public split noted in the earlier review.

Truth/copy safety risks:

- None strong enough to justify reopening public redesign or public copy work.
- The support deletion-copy bug was already fixed and does not need further follow-up.

Conclusion:

- Public should not be the next redesign wave.

### Merchant Console

Current state:

- Merchant core and long-tail operational routes are visually coherent enough to defer.
- `dashboard`, `orders`, `menu`, `reviews`, `promotions`, `analytics`, `settlement`, `settings`, and `store-management` now read as one store-scoped console.

Confirmed visual gaps:

- The main remaining merchant presentation lag is not inside the operational routes.
- The entry cluster still uses an older, flatter auth-card pattern:
  - `merchant-console/src/features/auth/presentation/login-screen.tsx`
  - `merchant-console/src/features/onboarding/presentation/onboarding-screen.tsx`
  - `merchant-console/src/features/store-selection/presentation/store-selection-screen.tsx`

What feels behind:

- weaker hero framing
- weaker summary rhythm
- less deliberate explanation of demo-safe/manual-only truth
- less visual continuity with the redesigned merchant operational surface

Truth/copy safety risks:

- `merchant-console/src/features/auth/presentation/login-screen.tsx` still links to `https://deliberry.com/merchants` instead of the current local public merchant route shape, which is a small but real routing/truth risk if left untouched during a future polish wave.

Conclusion:

- Merchant still has a meaningful polish target, but only in its entry/auth boundary cluster.

### Admin Console

Current state:

- Admin oversight routes are visually coherent end-to-end and remain the strongest web baseline in the repo.

Confirmed visual gaps:

- The remaining lag is concentrated in the entry/auth boundary routes rather than the oversight routes:
  - `admin-console/src/features/auth/presentation/login-screen.tsx`
  - `admin-console/src/features/permissions/presentation/access-boundary-screen.tsx`

What feels behind:

- heavy reliance on older inline styling
- weaker route-purpose framing than the redesigned oversight screens
- less structured role-selection hierarchy
- less deliberate treatment of current snapshot/read-only/admin-access truth

Truth/copy safety risks:

- `admin-console/src/features/auth/presentation/login-screen.tsx` and `admin-console/src/features/permissions/presentation/access-boundary-screen.tsx` still reference older token names in inline styles such as `var(--text-muted)` and `var(--text-primary)`, which do not match the current global token naming shape. This is primarily a presentation consistency risk, but it is concrete and repo-grounded.

Conclusion:

- Admin does not need another oversight redesign wave, but its entry/auth boundary cluster is still behind the new baseline.

### Customer App

Current state:

- At a high level, customer primary and secondary journeys now feel coherent.
- The surface already has its own mobile-specific language, which is appropriate.

Confirmed visual gaps:

- No high-level customer route stands out enough to justify the next redesign wave.
- Customer auth and onboarding are older than the newly redesigned journey screens, but they are not the highest-ROI outliers compared with the web entry/auth cluster.

Truth/copy safety risks:

- No fresh customer truth/copy risk was found in this high-level pass.

Conclusion:

- Customer should not be the next redesign wave.

## Confirmed Visual/Presentation Gaps

### Highest-priority cluster

Cross-surface web entry and auth-boundary routes:

- merchant login
- merchant onboarding
- merchant store selection
- admin login
- admin access boundary

Why this cluster stands out:

- The main in-product surfaces now look intentionally redesigned.
- These entry routes still look like earlier-generation scaffolding.
- They are the clearest remaining mismatch against the current merchant/admin visual baseline.

### Specific presentation issues

- flatter auth-card hierarchy compared with the redesigned route heroes
- weaker first-scan explanation of route purpose and current truth model
- inconsistent CTA and summary rhythm
- more inline/one-off styling than the stabilized surfaces
- weaker handling of preview-only, snapshot, or role-selection context

## Truth/Copy Safety Risks

These are not redesign reasons by themselves, but they should be preserved during the next wave:

- Merchant login currently links out to `https://deliberry.com/merchants` rather than the repo’s current public merchant route.
- Admin entry screens still use older token names in inline styles, which increases drift risk against the current admin design system.
- Any next wave must keep:
  - merchant entry demo-safe
  - admin access control truthful
  - no fake onboarding automation
  - no fake role-management interactivity

## Lower-Priority Items

- Customer auth/onboarding polish
- any additional public micro-polish beyond normal maintenance
- further merchant/admin route redesign inside already-completed operational/oversight clusters

These are real polish opportunities, but they are lower ROI than the remaining web entry/auth mismatch.

## Recommended Next Redesign Wave

### Recommendation

Run one cross-surface polish wave for the web entry/auth boundary cluster.

### Recommended wave type

`cross-surface polish`

### Why this is the highest ROI

- It targets the clearest remaining presentation mismatch after the completed public, merchant, and admin route waves.
- It is small, coherent, and does not require runtime or route-truth changes.
- It improves first impression and route-entry confidence for both web consoles at once.
- It preserves the benefit of the current redesign program by finishing the last obvious web-surface outlier class instead of reopening already coherent route clusters.

## Exact Routes and Files To Target Next

### Merchant Console

- `/login`
  - `merchant-console/src/features/auth/presentation/login-screen.tsx`
- `/onboarding`
  - `merchant-console/src/features/onboarding/presentation/onboarding-screen.tsx`
- `/select-store`
  - `merchant-console/src/features/store-selection/presentation/store-selection-screen.tsx`
- shared merchant auth styling if required:
  - `merchant-console/src/app/globals.css`

### Admin Console

- `/login`
  - `admin-console/src/features/auth/presentation/login-screen.tsx`
- `/access-boundary`
  - `admin-console/src/features/permissions/presentation/access-boundary-screen.tsx`
- shared admin auth/access styling if required:
  - `admin-console/src/app/globals.css`

## Risks To Preserve

- Do not change role truth, access enforcement, or store-selection truth.
- Do not add backend integration, live admin mutation, or live merchant onboarding automation.
- Do not convert honest demo-safe routes into fake-operational entry flows.
- Keep any route links aligned to the current public website route ownership.

## Explicit Non-Goals

- No new redesign wave for public route content
- No new redesign wave for customer primary or secondary journey
- No reopening of already completed merchant/admin operational and oversight clusters
- No cross-surface design-token unification project
- No runtime refactors

## Final Recommendation

The single best next redesign wave is:

**Cross-surface web entry and auth-boundary polish**

Target:

- merchant `login`, `onboarding`, `select-store`
- admin `login`, `access-boundary`

If that wave is not worth doing, the redesign program is near a natural stopping point and should shift away from redesign rather than reopening completed core surfaces.
