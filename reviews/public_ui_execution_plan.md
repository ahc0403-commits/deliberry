# Public Website UI Execution Plan

## Objective
Replace all PublicFeatureScaffold placeholder sections with real, commercially credible, conversion-oriented public marketing UI aligned with the rebuilt customer, merchant, and admin surfaces.

## Design Direction
- **Identity**: Modern, confident, polished, youthful but credible
- **Primary color**: Coral-red #FF4B3A (consistent with customer app — same product family)
- **Header**: Sticky glassmorphism with CTA button
- **Footer**: Dark multi-column footer (product / business / legal)
- **Section rhythm**: Hero → Stats → Features → How it works → Proof → CTA

## Route / Section Cluster Plan

### P0 — Core Conversion Surface (4 routes)

| Route | File | Purpose |
| --- | --- | --- |
| `/` | `landing-screen.tsx` | Hero, value props, how it works, reviews, merchant pitch, download CTA |
| `/service` | `service-introduction-screen.tsx` | Platform explainer, value props, coverage, stats |
| `/download` | `app-download-screen.tsx` | App store CTA, feature list, trust metrics, 3-step onboarding |
| `/merchant` | `merchant-onboarding-screen.tsx` | Merchant pitch, benefits, process steps, lead capture form |

### P1 — Support & Secondary (1 route)

| Route | File | Purpose |
| --- | --- | --- |
| `/support` | `customer-support-screen.tsx` | FAQ list, contact options, links to legal |

### P2 — Legal Cluster (3 routes)

| Route | File | Purpose |
| --- | --- | --- |
| `/privacy` | `privacy-screen.tsx` | Full privacy policy document |
| `/terms` | `terms-screen.tsx` | Full terms of service document |
| `/refund-policy` | `refund-policy-screen.tsx` | Refund and cancellation policy document |

## Reusable Public-Site Section Plan

| Section Class / Pattern | Used In | Purpose |
| --- | --- | --- |
| `.hero` | landing, service, download, merchant | Full-width hero with badge, headline, sub, CTAs, social proof |
| `.hero-badge` | landing, service, merchant, download | Animated "now live" eyebrow badge |
| `.hero-social-proof` | landing, merchant, download | 4-metric proof strip below hero CTAs |
| `.stats-bar` | landing | Dark full-width stats strip |
| `.feature-grid` / `.feature-card` | landing, service, merchant, download | 3-column value prop card grid |
| `.steps-row` / `.step-card` | landing, service, download | 3-step numbered how-it-works row |
| `.review-grid` / `.review-card` | landing | 3-column testimonial cards |
| `.trust-section` / `.trust-metric-grid` | download, service | Metric proof block inside white card |
| `.merchant-pitch` | landing | Dark indigo gradient merchant acquisition section |
| `.process-grid` / `.process-card` | merchant | 4-step application process (numbered) |
| `.lead-form-wrap` / `.form-field` | merchant | Restaurant application form |
| `.download-section` / `.store-badges` | landing, service, download | Coral CTA block with app store badges |
| `.faq-list` / `.faq-item` | support | FAQ accordion layout |
| `.contact-card` / `.contact-option` | support | Sticky contact options sidebar |
| `.legal-doc` | privacy, terms, refund | Legal document typography and layout |
| `.highlight-box` | legal | Coral summary highlight at top of legal docs |

## CTA and Conversion Flow Plan

```
Landing (/)
  ├── Primary CTA: "Download the app" → /download
  ├── Secondary CTA: "How it works" → /service
  ├── Merchant pitch: "Apply to become a partner" → /merchant
  └── Footer download: store badges → /download

Service (/service)
  ├── Primary CTA: "Download the app" → /download
  ├── Secondary CTA: "Partner with us" → /merchant
  └── Bottom CTA: store badges → /download

Download (/download)
  ├── Hero: App Store + Google Play (store links)
  ├── Footer: "Are you a restaurant owner?" → /merchant
  └── Final CTA: App Store + Google Play

Merchant (/merchant)
  ├── Primary CTA: "Apply to partner" → #apply (anchor)
  ├── Lead form: submit application (placeholder action)
  └── Footer navigation → /support

Support (/support)
  ├── Contact email: hello@deliberry.com
  ├── Partner email: partners@deliberry.com
  └── Links → /refund-policy, /privacy, /terms, /merchant
```

## Connection Plan into the Rest of the Product

| From (public) | To (product surface) | Method |
| --- | --- | --- |
| `/download` hero | Customer app | App Store / Google Play store badges (placeholder links) |
| `/merchant` form | Merchant console | Application submitted → onboarding email → merchant-console login |
| `/support` contact | Admin customer-service | Email routing (hello@deliberry.com) |
| `/service` | Customer app | Download CTA → /download |
| Header nav "Get the app" | Customer app | /download → store badges |

Note: Public → customer runtime handoff remains informational (store badges are placeholder). Live app store integration is out of scope per project rules.

## Rules Followed
- No PublicFeatureScaffold imports remain in any screen
- All route names preserved
- All page.tsx wrappers unchanged
- Public-only surface: no authenticated content, no admin/merchant console behavior
- No real app store integration (placeholder-safe)
- Product family visual consistency: coral-red #FF4B3A primary
