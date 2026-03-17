# Cross-Surface Visual QA

Status: active
Authority: review
Surface: cross-surface
Domains: visual-qa, redesign-planning, surface-comparison
Last updated: 2026-03-17
Last verified: 2026-03-17
Retrieve when:
- deciding the next redesign wave after admin-console completion
- comparing visual consistency across the four live product surfaces
Related files:
- admin-console/src/app/globals.css
- merchant-console/src/app/globals.css
- public-website/src/app/globals.css
- customer-app/lib/features/common/presentation/widgets.dart

## Scope Audited

- `admin-console` as the completed visual baseline
- `merchant-console` major operational routes at a high level
- `public-website` major acquisition routes plus support/legal outliers
- `customer-app` main shell and key primary/secondary flow screens at a high level

This was an audit-and-planning pass only. No code was changed.

## Surface-by-Surface Findings

### Admin Console

Current state:
- Now reads as one coherent platform oversight surface.
- Strongest cross-route consistency in the repo for:
  - hero framing
  - summary-card rhythm
  - table readability
  - snapshot/manual/preview truth signaling

Evidence:
- `admin-console/src/features/users/presentation/users-screen.tsx`
- `admin-console/src/features/reporting/presentation/reporting-screen.tsx`
- `admin-console/src/features/system-management/presentation/system-management-screen.tsx`
- `admin-console/src/features/marketing/presentation/marketing-screen.tsx`
- `admin-console/src/features/announcements/presentation/announcements-screen.tsx`
- `admin-console/src/features/catalog/presentation/catalog-screen.tsx`
- `admin-console/src/features/b2b/presentation/b2b-screen.tsx`

Conclusion:
- Use admin as the current baseline for web oversight surfaces.
- No immediate redesign wave should start here next.

### Merchant Console

Current state:
- Core and long-tail merchant routes are visually cohesive enough to defer.
- Dashboard, orders, menu, reviews, promotions, analytics, settlement, settings, and store-management now share one store-scoped operations language.
- Preview-only/manual-only truth is generally explicit instead of hidden.

Evidence:
- `merchant-console/src/features/dashboard/presentation/dashboard-screen.tsx`
- `merchant-console/src/features/orders/presentation/orders-screen.tsx`
- `merchant-console/src/features/menu/presentation/menu-screen.tsx`
- `merchant-console/src/app/globals.css`

Remaining gaps:
- Merchant still uses its own operation-centric design language rather than the admin oversight language, but that is appropriate to the surface.
- Major merchant presentation outliers were not found in the audited core cluster.

Conclusion:
- Merchant is not the highest-ROI next redesign wave.

### Public Website

Current state:
- Public acquisition routes are split into two clear quality levels.
- `landing`, `service`, `merchant`, and `download` are relatively coherent and purposeful.
- `support` and the legal routes still feel visually older and much flatter than the rest of the public surface.

Evidence:
- Stronger cluster:
  - `public-website/src/features/landing/presentation/landing-screen.tsx`
  - `public-website/src/features/service-introduction/presentation/service-introduction-screen.tsx`
  - `public-website/src/features/merchant-onboarding/presentation/merchant-onboarding-screen.tsx`
  - `public-website/src/features/app-download/presentation/app-download-screen.tsx`
- Outlier cluster:
  - `public-website/src/features/customer-support/presentation/customer-support-screen.tsx`
  - `public-website/src/features/legal/presentation/privacy-screen.tsx`
  - `public-website/src/features/legal/presentation/terms-screen.tsx`
  - `public-website/src/features/legal/presentation/refund-policy-screen.tsx`

What is inconsistent:
- Support and legal routes do not carry the same route framing or first-scan clarity as the acquisition routes.
- The acquisition routes use deliberate hero composition, route panels, section rhythm, and explicit trust framing.
- Support/legal still rely on simpler document/help layouts that read as structurally correct but visually secondary.
- Truth signaling is honest, but the visual system does not reinforce “current support/help path” or “policy snapshot” with the same confidence as the redesigned acquisition routes.

Conclusion:
- Public has the clearest remaining presentation split inside a single surface.
- This is the strongest next redesign candidate.

### Customer App

Current state:
- At a high level, the customer primary and secondary journey now feel internally coherent.
- Home, profile, addresses, notifications, and reviews share a friendlier, card-led mobile hierarchy.
- The customer surface is still intentionally distinct from web surfaces, which is correct.

Evidence:
- `customer-app/lib/features/home/presentation/home_screen.dart`
- `customer-app/lib/features/profile/presentation/profile_screen.dart`
- `customer-app/lib/features/addresses/presentation/addresses_screen.dart`
- `customer-app/lib/features/notifications/presentation/notifications_screen.dart`
- `customer-app/lib/features/reviews/presentation/reviews_screen.dart`

Remaining gaps:
- No major high-level visual outlier in the sampled customer routes.
- Further customer work would be polish, not the best next ROI compared with public support/legal.

Conclusion:
- Customer does not need the next redesign wave.

## Visual Consistency Gaps

### 1. Public Surface Split Quality

The largest remaining cross-surface gap is not between products. It is inside `public-website`:
- acquisition routes are visually intentional
- support/legal routes are still comparatively flat

Why it matters:
- public routes are trust-building routes
- legal/support pages should not feel like a fallback afterthought
- the current difference makes the public surface feel partially redesigned rather than fully intentional

### 2. Route Framing Inconsistency on Public Support/Legal

Compared with admin and merchant:
- weaker hero framing
- weaker first-screen purpose explanation
- less structured summary rhythm
- less explicit visual treatment of manual-only/help-path truth

### 3. Snapshot/Manual Truth Is Honest but Under-signaled on Public Support/Legal

The wording is mostly fixed, but the presentation does less work to help the user understand:
- where to go next
- which help path is real
- which legal/process statements are policy context rather than live UI capability

## Highest-Priority Outliers

1. `/(marketing)/support`
   - `public-website/src/features/customer-support/presentation/customer-support-screen.tsx`
2. `/(legal)/privacy`
   - `public-website/src/features/legal/presentation/privacy-screen.tsx`
3. `/(legal)/terms`
   - `public-website/src/features/legal/presentation/terms-screen.tsx`
4. `/(legal)/refund-policy`
   - `public-website/src/features/legal/presentation/refund-policy-screen.tsx`

## Recommended Next Redesign Wave

### Recommendation

Run the next redesign wave on `public-website` support/legal presentation only.

### Why this is the best ROI

- Smallest coherent surface cluster still showing a visible quality split
- High trust impact with limited scope
- Does not require runtime changes
- Keeps the benefit of the RAG cleanup because these routes already have retrieval coverage and runtime-truth docs
- Completes the public surface so it reads as one intentional acquisition and trust layer

## Exact Routes and Screens to Include

- `/support`
  - `public-website/src/app/(marketing)/support/page.tsx`
  - `public-website/src/features/customer-support/presentation/customer-support-screen.tsx`
- `/privacy`
  - `public-website/src/app/(legal)/privacy/page.tsx`
  - `public-website/src/features/legal/presentation/privacy-screen.tsx`
- `/terms`
  - `public-website/src/app/(legal)/terms/page.tsx`
  - `public-website/src/features/legal/presentation/terms-screen.tsx`
- `/refund-policy`
  - `public-website/src/app/(legal)/refund-policy/page.tsx`
  - `public-website/src/features/legal/presentation/refund-policy-screen.tsx`
- Shared public styling if needed:
  - `public-website/src/app/globals.css`
  - `public-website/src/app/(legal)/layout.tsx`

## Risks To Preserve

- Do not imply live support chat, live refund automation, live install flow, or live merchant automation.
- Keep support clearly routed to current email/manual help paths.
- Keep legal pages policy-first and runtime-true, not marketing-polished into false capability claims.
- Do not pull authenticated product behavior into the public site.

## Explicit Non-Goals

- No redesign wave for `merchant-console` next
- No new `customer-app` Flutter redesign wave next
- No new `admin-console` redesign wave next
- No backend or route-truth changes
- No new functionality, automation, or fake interactions

## Final Recommendation

The next redesign wave should be:

**Public trust and support completion**

Scope:
- `support`
- `privacy`
- `terms`
- `refund-policy`

This is the highest-value remaining visual cleanup because it closes the last major cross-route quality gap across the major live product surfaces while preserving current runtime truth.
