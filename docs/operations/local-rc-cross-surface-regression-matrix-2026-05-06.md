# Local RC Cross-Surface Regression Matrix -- 2026-05-06

Status: active
Authority: operational
Surface: customer-app, merchant-console, admin-console, public-website
Domains: regression, qa, local-rc
Last updated: 2026-05-06
Last verified: 2026-05-06

## Purpose

Capture the current local release-candidate regression state across all four live surfaces without overstating hosted readiness.

This is a local RC artifact.
It is not a hosted-production signoff.

## Evidence Scope

- Local Flutter analyze on `customer-app`
- Local typecheck on `merchant-console`, `admin-console`, and `public-website`
- Local Supabase reset/reseed where needed
- In-app browser / desktop visual QA across customer, merchant, admin, and public routes

## Cross-Surface Matrix

| Surface | Route / Flow | Status | Notes |
|---|---|---|---|
| customer-app | language switch from global overlay | PASS | EN/KO/VI available from any screen |
| customer-app | home KO/VI | PASS | category, promo, VND labels visually verified |
| customer-app | guest orders empty state VI | PASS | no auth bounce after customer-flow routing change |
| customer-app | notifications VI | PASS | unread count, relative date labels, and body copy verified |
| customer-app | profile/settings KO/VI | PASS | reviews helper and legal/support labels verified |
| customer-app | signed-in persisted review continuity | PASS | local runtime + controller path verified; analyzer clean |
| merchant-console | `/login` | PASS | no client/server overlay, locale-safe |
| merchant-console | `/onboarding` | PASS | localized and route-stable |
| merchant-console | `/select-store` | PASS | route valid; current seeded session may redirect directly to default store |
| merchant-console | `/{storeId}/dashboard` | PASS | KPI label residue cleared |
| merchant-console | `/{storeId}/orders` | PASS | live QA sweep showed no tracked English residue |
| merchant-console | `/{storeId}/menu` | PASS | localized save/error paths and visual sweep complete |
| merchant-console | `/{storeId}/reviews` | PASS | localized response flow and runtime path present |
| merchant-console | `/{storeId}/store` | PASS | localized labels and save feedback present |
| merchant-console | `/{storeId}/settings` | PASS | legal/support/app-download handoff plus save feedback verified |
| merchant-console | promotions / settlement / analytics | PARTIAL PASS | localized and coherent, but still honest partial-runtime surfaces |
| admin-console | `/login` | PASS | locale switching and reason-aware auth errors verified |
| admin-console | `/dashboard` | PASS | degraded-state safe and live runtime path stable |
| admin-console | `/stores` | PASS | runtime-backed detail pane |
| admin-console | `/merchants` | PASS | runtime-backed detail pane |
| admin-console | `/users` | PASS | actor/status/role values localized for humans |
| admin-console | `/customer-service` | PASS | queue + localized triage labels verified |
| admin-console | `/disputes` | PASS | localized priority/status/category labels verified |
| admin-console | `/settlements` / `/finance` | PASS | oversight surfaces localized and stable |
| admin-console | `/marketing` / `/announcements` / `/catalog` / `/b2b` | PASS | VI visual QA complete; fixture tone updated |
| public-website | `/` | PASS | VI response verified, including `8 quận` coverage stat |
| public-website | `/service` | PASS | prior live QA completed during tranche work |
| public-website | `/merchant` | PASS | prior live QA completed during tranche work |
| public-website | `/support` | PASS | prior live QA completed during tranche work |
| public-website | `/download` | PASS | VI launch-copy and support fallback verified |
| public-website | `/privacy` / `/terms` / `/refund-policy` | PASS | prior tranche visual QA completed |

## Known Partial Areas

| Area | Why Partial |
|---|---|
| customer-app phone auth | provider-enabled hosted signoff still deferred |
| customer-app group order | same-device local-room truth only, no cross-device sync claim |
| merchant promotions / analytics / settlement | surface is coherent and localized, but not claimed as full operational depth |
| admin settlements / finance | oversight surfaces only; not payment-verification or final reconciliation |
| hosted parity | this matrix is local only |

## Remaining RC Blockers

1. Physical target-device QA evidence is still missing across supported mobile / tablet / desktop hardware.
2. Hosted env parity still needs explicit smoke coverage for customer, merchant, admin, and public aliases.
3. Payment remains placeholder-safe by policy and must stay out of release readiness claims.
4. Merchant demo-cookie fallback must not be treated as a hosted-production-ready authority path.

## Recommended Follow-Through

1. Use this matrix as the local RC baseline.
2. Run hosted smoke in the same route order once env parity is confirmed.
3. Attach physical device evidence before any release-ready claim.
