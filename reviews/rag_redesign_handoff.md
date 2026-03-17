# RAG Redesign Handoff — Post-Governance-Closure State

Date: 2026-03-17
Status: Active
Purpose: Single-document handoff for any future agent starting UX/UI redesign or backend integration work.

---

## Current Repository State (Honest Summary)

### What Is Complete
- **All 26 governance enforcement gaps are closed** (Waves 1-5 + Wave 6-NR)
- **Canonical governance layer**: CONSTITUTION, IDENTITY, STRUCTURE, FLOW, DATE, DECAY_PATH, GLOSSARY, ENFORCEMENT_CHECKLIST — all binding, all current
- **Shared contract layer**: All types, enums, constants, validation schemas, API contracts use canonical names (no placeholder suffixes)
- **Audit trail contract**: `AuditLogEntry` type + `audit.schema.json` defined in shared/
- **State machine validators**: 5 transition validators in `shared/utils/transitions.ts` (order, payment, settlement, dispute, support)
- **Session types**: Admin has `role: PermissionRole` + `actorType: "admin"`. Merchant has `actorType: "merchant_owner" | "merchant_staff"`
- **Guest auth gate**: Enforced at both data layer and UX layer in customer-app checkout
- **CI governance scan**: `scripts/governance-scan.sh` passes clean
- **Surface adapters**: Both web adapters re-export all canonical constants, types, and `formatMoney`
- **Mock data**: All surfaces use integer centavos, canonical status enums, UTC ISO 8601 timestamps, canonical payment method names

### What Is NOT Live
- **No database** — all data is in-memory mock
- **No auth provider** — sessions use demo cookie values with governance-correct types
- **No API layer** — no real API routes, no Supabase integration
- **No real mutations** — order submission, cart, address changes are all local ChangeNotifier state
- **No audit log persistence** — type exists, no write path
- **No transition enforcement at runtime** — validators exist, no mutation handler calls them
- **No per-status timestamp population** — fields defined, no state transitions populate them
- **formatMoney not called in web surfaces** — re-exported but surfaces use inline `/ 100` formatting

---

## Authority Chain for Retrieval

1. **Binding governance** → `docs/governance/CONSTITUTION.md` (highest)
2. **Domain identity** → `docs/governance/IDENTITY.md`
3. **Structure rules** → `docs/governance/STRUCTURE.md`
4. **State machines** → `docs/governance/FLOW.md`
5. **Time rules** → `docs/governance/DATE.md`
6. **Decay detection** → `docs/governance/DECAY_PATH.md`
7. **Active RAG index** → `docs/rag-architecture/RAG_ACTIVE_INDEX.md`
8. **Surface entrypoints** → `docs/rag-architecture/RETRIEVAL_ENTRY_*.md`
9. **Runtime truth** → `docs/runtime-truth/*.md`
10. **UI governance** → `docs/ui-governance/*.md`

---

## Surface Architecture (Immutable)

| Surface | Runtime | Description |
|---------|---------|-------------|
| `customer-app` | Flutter | Consumer mobile product |
| `merchant-console` | Next.js | Store operations console |
| `admin-console` | Next.js | Platform governance console |
| `public-website` | Next.js | Public marketing (no auth) |
| `shared` | TypeScript contracts | Cross-surface contracts only |

---

## What A Redesign Agent Must Know

1. **The five-surface split is permanent.** Do not merge surfaces or share runtime code.
2. **shared/ is contract-only.** Types, constants, validation schemas, pure utilities, docs. No UI, no routing, no state.
3. **Each surface owns its auth/session.** No cross-surface session sharing (R-073).
4. **public-website is public-only.** No auth, no session, no route guards.
5. **Money is integer centavos.** Always. No floats. Display via `formatMoney()` or `formatCentavos()`.
6. **Timestamps are UTC ISO 8601.** Always end with `Z`. Display conversion at presentation layer.
7. **Status values are canonical.** From `shared/constants/domain.constants.ts`. Display labels at presentation layer.
8. **All mutations are placeholder.** No real persistence. Backend integration is the next major phase.

---

## What A Backend Integration Agent Must Know

1. **All governance contracts are ready.** Types, schemas, validators — just wire them.
2. **AuditLogEntry → wire into real mutation write paths**
3. **isValidOrderTransition() et al → call before status mutations**
4. **OrderSummary.confirmedAt/preparingAt/etc → populate at transition time**
5. **AdminSession.role / MerchantSession.actorType → populate from real auth tokens**
6. **formatMoney → adopt across web surface presentation files (15 files)**
7. **Payment methods are `cash | card | digital_wallet`** — no more placeholder suffixes
8. **API contract operation names are canonical** — no more placeholder suffixes

---

## Files Changed in This Handoff

Only this file was created. No code changes. The RAG architecture layer (`docs/rag-architecture/`) already has comprehensive surface entrypoints, flow entrypoints, active index, historical index, gap audit, and priority backlog — all maintained through prior waves. Creating additional RAG files would add retrieval noise.

---

*Handoff prepared: 2026-03-17*
*Governance gap plan: 26/26 closed*
*Runtime integration: blocked on backend infrastructure*
*Repository: retrieval-safe for redesign and backend phases*
