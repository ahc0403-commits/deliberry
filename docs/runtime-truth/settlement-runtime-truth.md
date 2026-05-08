# Settlement Runtime Truth

Status: Active
Authority: Operational
Surface: cross-surface
Domains: settlement, schema, edge-functions, payout-visibility
Last updated: 2026-05-06
Last verified: 2026-05-06
Retrieve when:
- changing settlement schema, edge functions, or payout visibility assumptions
- deciding whether settlement runtime is live, gated, or placeholder-only
- checking where settlement truth actually lives today
Related files:
- supabase/migrations/20260417120000_add_settlement_runtime_schema.sql
- supabase/functions/_shared/settlement-core.ts
- supabase/functions/generate-settlement/index.ts
- supabase/functions/trigger-settlement/index.ts
- shared/api/settlement.contract.json

## Purpose

Document the current runtime truth for settlement after the schema landing on 2026-04-17.

## Real Source-of-Truth Locations

- Settlement schema owner: `supabase/migrations/20260417120000_add_settlement_runtime_schema.sql`
- Runtime gate owner: `supabase/functions/_shared/settlement-core.ts`
- Scheduled generation entry: `supabase/functions/generate-settlement/index.ts`
- Admin-triggered generation entry: `supabase/functions/trigger-settlement/index.ts`
- Shared contract vocabulary: `shared/api/settlement.contract.json` and `shared/validation/settlement.schema.json`

## What State Is Owned There

- persisted settlement headers in `public.delivery_settlements`
- persisted settlement deduction lines in `public.delivery_settlement_items`
- settlement linkage from `public.external_sales.settlement_id`
- runtime gate controlled by `ENABLE_SETTLEMENT_RUNTIME`
- schema-readiness probes for:
  - `external_sales.settlement_id`
  - `delivery_settlements`
  - `delivery_settlement_items`

## What Screens and Runtimes Depend on It

- settlement edge functions in `supabase/functions/`
- merchant settlement visibility under `merchant-console/src/features/settlement/`
- admin settlement and finance visibility under `admin-console/src/features/settlements/` and `admin-console/src/features/finance/`

## What Is Authoritative vs Derived

- Authoritative:
  - rows in `delivery_settlements`
  - rows in `delivery_settlement_items`
  - `external_sales.settlement_id`
  - runtime enable/disable decision in `ENABLE_SETTLEMENT_RUNTIME`
- Derived:
  - period summaries returned by settlement edge functions
  - merchant/admin settlement screen totals
  - payout status badges rendered in web surfaces

## What Is Still Shallow, Partial, Fixture-Backed, or Gated

- The settlement schema is now landed in source and was applied to the linked Supabase project on 2026-04-17.
- Settlement edge functions compile and can validate schema presence, but they remain intentionally gated until rollout approval.
- Merchant settlement visibility reads from the landed settlement schema through `merchant-settlement-runtime-service.ts` and `supabase-merchant-runtime-repository.ts` when merchant auth authority is `supabase`; local `demo-cookie` merchant sessions intentionally fall back to fixture visibility so store-scoped development flows stay usable, and the route now exposes that fallback in the UI so the data source is visually obvious.
- Admin settlement and finance visibility now read from the landed settlement schema through `supabase-admin-runtime-repository.ts`.
- Local development now seeds settlement visibility data through `supabase/seed.sql`, including demo-store settlement headers, line items, and linked `external_sales` rows so admin runtime routes can be visually verified without opening the production gate.
- Merchant and admin settlement screens are informational and should not imply live payout processing.
- Merchant and admin settlement tables now format timestamps for operator-friendly local display instead of exposing raw UTC ISO strings in the UI.
- Merchant and admin settlement screens now localize settlement-state labels before rendering badges, so runtime rows do not regress to raw persistence identifiers during locale switches.
- Payment verification and payment completion logic remain out of scope.
- Settlement state vocabulary is now aligned around the landed persistence values `pending|calculated|received|disputed|adjusted`.

## Known Risks

- Enabling `ENABLE_SETTLEMENT_RUNTIME` without a rollout decision can make informational settlement surfaces look operationally live before finance approval.
- Merchant-authenticated `external_sales` inserts are now allowed for own-store writes; any future widening must stay store-scoped and audited.
- Public merchant marketing can over-promise payout regularity if it describes weekly settlement operations as already live while runtime remains gated.

## Safe Modification Guidance

- Change settlement schema in the migration layer first.
- Change gate logic in `settlement-core.ts` second.
- Change merchant/admin settlement presentation last, after runtime status and rollout intent are explicit.
- Keep merchant/admin settlement routes read-only even though they now read landed settlement rows.
- Do not set `ENABLE_SETTLEMENT_RUNTIME` in deployed environments without an explicit rollout approval.

## Related Governance Docs

- `docs/05-implementation-phases.md`
- `docs/07-post-phase-roadmap.md`
- `docs/06-guardrails.md`
- `docs/governance/FLOW.md`
- `docs/governance/DOMAIN_MAPPING_MATRIX.md`
