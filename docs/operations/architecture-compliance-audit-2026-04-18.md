# Architecture Compliance Audit — 2026-04-18

Status: active
Authority: operational
Surface: cross-surface
Domains: audit, governance, excluded-features, shared-boundary, settlement, payment
Last updated: 2026-04-18
Last verified: 2026-04-18

## Purpose

Capture the 2026-04-18 governance-focused audit pass that checked:

- excluded feature leakage
- repo-level shared boundary compliance
- settlement runtime truth drift
- payment placeholder-only compliance

## Governing Docs Used

- `docs/01-product-architecture.md`
- `docs/02-surface-ownership.md`
- `docs/03-navigation-ia.md`
- `docs/04-feature-inventory.md`
- `docs/05-implementation-phases.md`
- `docs/06-guardrails.md`
- `shared/docs/architecture-boundaries.md`
- `shared/docs/contracts-inventory.md`
- `docs/governance/FLOW.md`
- `docs/governance/GLOSSARY.md`
- `docs/governance/LEGACY_OWNER_DECISION_2026-04.md`

## Audit Verdict

### 1. Excluded feature leakage

- No live implementation of payment verification was confirmed.
- No live implementation of payment completion was confirmed.
- No map API autocomplete implementation was confirmed.
- No QR generation library implementation was confirmed.
- No QR scanner camera integration was confirmed.
- No real-time order tracking implementation was confirmed.

Confirmed residual risk:

- `customer-app/CLAUDE_PROMPT_DELIBERRY_FLUTTER_HOOK.md` contained outdated planning instructions that could be misread as a live implementation spec.

Action taken:

- Added a deprecation header and explicit "do not execute as current product truth" warning to `customer-app/CLAUDE_PROMPT_DELIBERRY_FLUTTER_HOOK.md`.

### 2. Shared boundary compliance

- Repo-level `shared/` remains compliant with current architecture rules.
- No repo-level shared UI, router code, app state, or runtime orchestration was confirmed.
- Surface-local `src/shared/` folders in merchant/admin remain allowed because they are not repo-level shared ownership.

### 3. Settlement drift

Confirmed drift:

- Settlement backend schema is landed and gated.
- Merchant settlement and admin settlement routes were previously fixture-backed.
- Public merchant onboarding marketing previously described payout behavior too strongly for the current gated/runtime-fixture state.

Actions taken:

- Updated `docs/runtime-truth/settlement-runtime-truth.md` to separate landed backend truth from still fixture-backed web settlement routes.
- Updated `public-website/src/features/merchant-onboarding/presentation/merchant-onboarding-screen.tsx` to stop implying already-live weekly automated payouts.
- Reconciled settlement vocabulary around `pending|calculated|received|disputed|adjusted`.
- Cut admin settlement and finance routes over to runtime-backed reads from landed settlement rows.
- Cut merchant settlement over to runtime-backed reads when merchant auth authority is `supabase`, while preserving `demo-cookie` fallback for local store-scoped development.
- Added local settlement visibility seed data to `supabase/seed.sql` so runtime-backed admin routes can be visually verified in development.
- Added an explicit merchant settlement fixture-fallback message so local demo visibility does not masquerade as live runtime data.
- Switched merchant/admin settlement timestamp display from raw UTC strings to operator-friendly local formatting.

### 4. Payment placeholder-only compliance

- Customer checkout keeps payment method selection as a placeholder-only structure.
- Customer order creation continues to write `payment_status = 'pending'`.
- Merchant/admin web surfaces display payment method labels and informational statuses only.
- No write path was found that promotes payment into a verified or completed live PG flow.

## Current Safe Conclusions

- PG/payment integration remains deferred and is still safe to leave until later.
- Settlement runtime should remain gated until rollout approval even though read-only visibility is now runtime-backed.
- Merchant/admin settlement routes should continue to be described as informational read-only visibility, not live settlement operations.

## Concrete Changes Made During This Audit Window

- removed the unused public content seam in `public-website/src/shared/data/`
- added store-shell snapshot reads for merchant sidebar badge counts
- marked the archived customer external-sales planning prompt as deprecated
- aligned settlement runtime truth docs with current runtime-backed admin visibility and merchant auth-authority split
- softened public merchant payout marketing so it no longer overstates runtime reality
- seeded local settlement demo data for runtime-backed admin verification
- centralized merchant runtime compatibility decisions in `merchant-console/src/shared/data/merchant-runtime-compatibility.ts` so auth authority, fixture preference, fallback eligibility, and Supabase client mode no longer drift across multiple services
- restored `merchant-console/src/shared/domain.ts` to a true repo-shared adapter and moved merchant-only telemetry/runtime/LLM helper types into `merchant-console/src/shared/merchant-governed-domain.ts`
- renamed broad legacy query-service facades toward explicit fixture ownership (`merchantFixtureFacade`, `adminFixtureFacade`, `customerFixtureSectionsFacade`) while preserving deprecated aliases for compatibility

## Verification

- `public-website` `npm run typecheck` passed on 2026-04-18
- `merchant-console` `npm run typecheck` passed on 2026-04-18
- `admin-console` `npm run typecheck` passed on 2026-04-18
- `bash scripts/governance-scan.sh` passed on 2026-04-18

## Follow-up Order

1. Keep settlement runtime gated until rollout approval.
2. Preserve merchant `demo-cookie` fallback unless merchant local dev is moved fully onto Supabase sessions.
3. Delay PG/payment verification work until the rest of the operational closure is complete.
