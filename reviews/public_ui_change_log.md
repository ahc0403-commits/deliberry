# Public Website UI Change Log

## Summary

- **Total files changed**: 12
- **Screens rebuilt from placeholder**: 8
- **Layout/shell files updated**: 2
- **Style system rewritten**: 1 (globals.css)
- **typecheck**: passes clean (0 issues)
- **build**: passes clean (11/11 pages generated)

## Updated Styles

| File | Change |
| --- | --- |
| `public-website/src/app/globals.css` | Complete design system overhaul: coral-red primary (#FF4B3A) for product-family consistency, dark footer, 30+ component class groups (hero, stats bar, feature cards, steps, reviews, trust metrics, merchant pitch, download section, process cards, lead form, FAQ, contact card, legal doc), full responsive breakpoints (1024px, 768px) |

## Updated Layouts

| File | Change |
| --- | --- |
| `public-website/src/app/(marketing)/layout.tsx` | Added nav CTA ("Get the app"), removed internal "Public surface only." copy, rebuilt footer as dark multi-column grid (product / business / legal columns), proper copyright line |

## Screens Rebuilt (Placeholder → Production UI)

### P0 — Core Conversion (4 screens)

| File | Before | After |
| --- | --- | --- |
| `landing-screen.tsx` | Hero + PublicFeatureScaffold sections | Full landing page: hero with proof strip, stats bar, 6 feature cards, 3-step how it works, 3 customer reviews, merchant pitch section (dark indigo gradient), download CTA block |
| `service-introduction-screen.tsx` | PublicFeatureScaffold | 6 value prop cards, platform explainer with 3-surface breakdown, live stats block (users/merchants/orders/rating), coverage zone chips, download CTA |
| `merchant-onboarding-screen.tsx` | PublicFeatureScaffold | Hero with 3 proof metrics, 6 benefit cards, 4-step process grid (numbered), lead capture form (name/cuisine/email/phone/address) with merchant value checklist |
| `app-download-screen.tsx` | PublicFeatureScaffold | Hero with App Store + Google Play badges, 6 app feature cards, trust metrics block, 3-step getting started section, final download CTA |

### P1 — Support (1 screen)

| File | Before | After |
| --- | --- | --- |
| `customer-support-screen.tsx` | PublicFeatureScaffold | 8-item FAQ list, sticky contact card (in-app chat / email / partner support), useful links to legal pages |

### P2 — Legal Cluster (3 screens)

| File | Before | After |
| --- | --- | --- |
| `privacy-screen.tsx` | PublicFeatureScaffold | Full Privacy Policy with 10 sections: data collected, usage, sharing, retention, security, rights, cookies, changes |
| `terms-screen.tsx` | PublicFeatureScaffold | Full Terms of Service with 14 sections: eligibility, account, ordering, pricing, cancellation, delivery, IP, liability, governing law |
| `refund-policy-screen.tsx` | PublicFeatureScaffold | Full Refund & Cancellation Policy with 8 sections: cancellation windows, eligibility, request process, processing times, partial refunds, disputes |

## Superseded Placeholder Files (No Longer Imported)

| File | Reason |
| --- | --- |
| `public-website/src/features/common/presentation/public_feature_scaffold.tsx` | No screen imports it anymore — all screens use real public marketing UI |
| `public-website/src/shared/data/content-service.ts` | No screen calls snapshot methods anymore — screens use static content directly |

## Remaining Gaps

| Gap | Status | Notes |
| --- | --- | --- |
| Live app store links | INTENTIONALLY EXCLUDED | Store badges link to /download placeholder page per project rules |
| Merchant form submission action | NOT WIRED | Form fields present; server action not implemented (out of scope) |
| Live chat / support widget | NOT ADDED | Contact options listed; real chat integration is out of scope |
| Cookie consent banner | NOT ADDED | Legal mentions cookies; banner implementation is out of scope |
| Analytics / tracking | NOT ADDED | No live analytics provider; out of scope |
| Dark mode | NOT ADDED | Not required for current scope |

## Validation

- `npm run typecheck`: **0 issues** (passes clean)
- `npm run build`: **passes clean** (11/11 pages generated)
- All route names preserved (/, /service, /merchant, /download, /support, /privacy, /terms, /refund-policy)
- All screen export names preserved (page.tsx imports unchanged)
- Public-only surface boundary maintained: no authenticated console behavior introduced
- No app store live integration (placeholder-safe per project rules)
- Visual identity: coral-red #FF4B3A primary, consistent with rebuilt customer app and merchant console product family
