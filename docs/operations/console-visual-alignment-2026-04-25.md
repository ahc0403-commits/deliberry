# Console Visual Alignment — 2026-04-25

Status: recorded
Authority: operational
Surface: merchant-console, admin-console
Date: 2026-04-28

---

## Purpose

Align `merchant-console` and `admin-console` with the refreshed Deliberry design system so the surfaces feel like the same product family without collapsing their separate visual roles.

This work is presentation-only. It does not change:
- route ownership
- surface ownership
- auth/runtime boundaries
- shared-layer rules
- excluded feature status

---

## Direction

### Merchant Console
- White operating canvas
- Warm coral primary aligned with customer-app
- Warm ink sidebar instead of blue-gray dashboard chrome
- Softer warm shadows and lighter border hierarchy

### Admin Console
- White / cool-gray operating canvas
- Muted indigo authority accent
- Dark slate platform sidebar
- Cleaner platform-shell header with restrained blur and surface depth

---

## Implemented Files

### Merchant
- `merchant-console/src/app/globals.css`
- `merchant-console/src/app/(console)/[storeId]/layout.tsx`

### Admin
- `admin-console/src/app/globals.css`
- `admin-console/src/app/(platform)/layout.tsx`

---

## Implementation Summary

### Merchant Console
- Rebased primary token family onto the current customer-app coral (`#D9472F`)
- Changed main working surface to white with warm-muted secondary surfaces
- Updated sidebar from cool slate to warm ink (`#221D19`)
- Increased card readability with softer warm shadows and lighter borders
- Kept the dark hero panel, but reduced the surrounding hero gradient intensity
- Tightened shell copy so store scope reads more clearly in the sidebar
- Replaced sidebar unicode glyphs with Lucide navigation icons
- Added route-aware active navigation treatment with a left accent rail
- Refined the order detail drawer with clearer section hierarchy, softer overlay depth, and a more operator-focused sticky action area
- Normalized detail drawer status actions into a single queue-stage action strip with explicit next-step context
- Tuned detail-action hierarchy so destructive actions read as secondary-risk on purpose, with mobile-safe 2-column/1-column button wrapping
- Added action icons in the detail drawer buttons so next-step intent is scannable at a glance under queue pressure

### Admin Console
- Shifted authority color from saturated indigo to muted governance indigo (`#4D5FCF`)
- Moved scaffold and content surfaces to a white / cool-gray hierarchy
- Updated sidebar to darker slate (`#18212E`) with softer active states
- Changed auth shell from dark gradient chrome to a lighter platform-entry surface
- Normalized card, panel, and signal radii so the console feels less template-like
- Replaced a stale inline header color reference with current token-backed styling
- Replaced admin navigation emoji labels with Lucide icons plus clean text labels
- Added route-aware active navigation treatment with a left accent rail
- Refined the order review pane into a clearer read-only oversight panel with review mode framing and calmer informational surfaces
- Aligned review-pane escalation chips into a labeled action strip for faster triage scanning
- Added mobile-safe action-strip wrapping so escalation cues stay legible without chip overflow
- Added status-specific chip tones for disputed, cancelled, and history cues in the review pane
- Added overflow-safe platform layout behavior so dashboard/content panels do not force page-level horizontal scrolling at tablet/desktop widths
- Kept dense oversight tables scrollable inside their own table wrappers instead of letting the whole app canvas overflow

---

## Verification

### Static Verification
- `merchant-console`: `npm run build` passed
- `merchant-console`: `npm run typecheck` passed after `.next/types` regeneration via build
- `admin-console`: `npm run build` passed
- `admin-console`: `npm run typecheck` passed after `.next/types` regeneration via build

### Browser Verification
- Merchant console verified in Chrome at `http://127.0.0.1:3001`
  - Redirected authenticated merchant session into store dashboard
  - Sidebar, hero, summary cards, KPI cards, and data panels rendered correctly
- Admin console verified in Chrome at `http://127.0.0.1:3002/login`
  - Login entry surface rendered correctly
  - White shell, muted indigo accent, and card depth rendered as intended
- Cross-surface Playwright QA completed on 2026-04-28
  - widths: `375`, `390`, `768`, `1024`, `1440`
  - route-width combinations checked: `185`
  - final failures: `0`
  - report path: `output/playwright/showable-product-qa-2026-04-28T06-01-37-834Z`

---

## Current Truth After Alignment

- `customer-app` remains the warmest and most expressive surface
- `merchant-console` is warm-operational: white canvas, ink sidebar, restrained coral emphasis
- `admin-console` is cool-governance: white/cool canvas, slate sidebar, muted indigo emphasis
- Cross-surface consistency now comes from surface depth, border/shadow hierarchy, and typography discipline, not from identical palettes
