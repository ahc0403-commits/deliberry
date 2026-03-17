# Deliberry Platform — Domain Mapping Matrix

> **Classification: Supporting Operational Artifact** — This is NOT a canonical governance document.
> Canonical governance authority lives in: CONSTITUTION.md, IDENTITY.md, STRUCTURE.md, FLOW.md,
> DATE.md, DECAY_PATH.md, GLOSSARY.md, and ENFORCEMENT_CHECKLIST.md.

Status: active
Authority: advisory (supporting artifact)
Surface: cross-surface
Domains: domain-mapping, status, ownership, flow
Last updated: 2026-03-14
Last verified: 2026-03-16
Retrieve when:
- mapping one business domain across surfaces, contracts, and governance rules
- checking domain-specific placement, flow, and risk in one place
Related files:
- docs/governance/IDENTITY.md
- docs/governance/STRUCTURE.md
- docs/governance/FLOW.md
- docs/governance/DATE.md

> This document maps each business domain to its identity, structure, flow, date handling,
> governance risks, and current implementation status.

---

## 1. Order Domain

| Dimension | Details |
|---|---|
| **Identity Map** | Actors: `customer` (creates), `merchant_owner`/`merchant_staff` (confirm/prepare/ready), `rider` (pickup/deliver), `operations_admin` (override), `system` (timeout). Entities: `Order`, `OrderItem`. |
| **Structure Placement** | Canonical: `shared/constants/domain.constants.ts` (ORDER_STATUSES). Contract: `shared/api/order.contract.json`. Schema: `shared/validation/order.schema.json`. Customer: `customer-app/lib/features/orders/`. Merchant: `merchant-console/src/features/orders/`. Admin: `admin-console/src/features/orders/`. |
| **Core Flow** | `draft → pending → confirmed → preparing → ready → in_transit → delivered` with `cancelled` and `disputed` branches. See FLOW.md Section 1. |
| **Date Handling** | Required timestamps: `created_at`, `updated_at`, `confirmed_at`, `preparing_at`, `ready_at`, `picked_up_at`, `delivered_at`, `cancelled_at`, `disputed_at`, `scheduled_at`. All UTC. |
| **Constitution Risks** | R-030 (no delete), R-040–043 (status enum compliance), R-050–053 (UTC timestamps), R-060 (audit trail). |
| **Decay Risks** | #1 Status Enum Pollution (ACTIVE), #3 Local Time Persistence (AT RISK), #10 Audit Trail Absence (ACTIVE). |
| **Current Status** | PLACEHOLDER_UI — Route structure and mock data exist. No real backend. |
| **Required Changes** | Add `draft`, `in_transit`, `disputed` to canonical enum. Rename `ready_for_delivery` → `ready`. Align merchant/admin mock data. Add order state machine validation. |

---

## 2. Payment Domain

| Dimension | Details |
|---|---|
| **Identity Map** | Actors: `customer` (initiates), `system` (captures/settles), `finance_admin` (refunds), `support_admin` (refunds). Entities: `Payment`. |
| **Structure Placement** | Canonical: not yet defined (placeholder only). Types: `shared/types/common.types.ts` (MoneyAmount, CurrencyCode). Customer: `customer-app/lib/features/cart/` (checkout). |
| **Core Flow** | `pending → captured → settled` with `failed`, `refunded`, `partially_refunded` branches. See FLOW.md Section 2. |
| **Date Handling** | Required timestamps: `created_at`, `updated_at`, `captured_at`, `failed_at`, `refunded_at`, `settled_at`. All UTC. |
| **Constitution Risks** | R-010–014 (money integrity), R-031 (no delete), R-074 (no real payment without review). |
| **Decay Risks** | #2 Float Money (ACTIVE), #7 Nullable Abuse (AT RISK), #10 Audit Trail Absence (ACTIVE), #11 Currency Code Drift (ACTIVE). |
| **Current Status** | STUB_ONLY — Payment method placeholders exist. No payment flow. |
| **Required Changes** | Define payment status enum. Fix CurrencyCode (ARS). Fix MoneyAmount (integer centavos). Define payment contract. |

---

## 3. Settlement Domain

| Dimension | Details |
|---|---|
| **Identity Map** | Actors: `system` (calculates/processes), `finance_admin` (manages/overrides), `platform_admin` (full access). Entities: `Settlement`. |
| **Structure Placement** | Canonical: `shared/constants/domain.constants.ts` (SETTLEMENT_STATES). Contract: `shared/api/settlement.contract.json`. Merchant: `merchant-console/src/features/settlement/`. Admin: `admin-console/src/features/settlements/`. |
| **Core Flow** | `pending → processing → paid` with `failed → pending` retry. See FLOW.md Section 3. |
| **Date Handling** | Required timestamps: `created_at`, `updated_at`, `settled_at`, `failed_at`. Settlement period cutoff: 23:59:59 Buenos Aires time. |
| **Constitution Risks** | R-010–014 (money integrity), R-032 (no delete/modify), R-050 (UTC). |
| **Decay Risks** | #2 Float Money (ACTIVE), #9 Temporary Workaround Permanence (ACTIVE — `_placeholder` suffixes), #11 Currency Code Drift (ACTIVE). |
| **Current Status** | STUB_ONLY — Placeholder settlement states. No real settlement logic. |
| **Required Changes** | Remove `_placeholder` suffixes from settlement states. Define settlement calculation logic. Implement settlement period cutoff. |

---

## 4. Dispatch/Rider Domain

| Dimension | Details |
|---|---|
| **Identity Map** | Actors: `rider` (pickup/deliver), `operations_admin` (assign/override), `system` (auto-assign). Entities: `Delivery` (not yet defined). |
| **Structure Placement** | No surface exists yet. Rider actions currently implied in order flow (`in_transit`, `delivered`). |
| **Core Flow** | `assigned → en_route_to_store → at_store → picked_up → en_route_to_customer → delivered`. Subset visible in order flow as `ready → in_transit → delivered`. |
| **Date Handling** | Required timestamps: `assigned_at`, `picked_up_at`, `delivered_at`. All UTC. |
| **Constitution Risks** | R-020 (actor attribution — rider not in taxonomy), R-060 (audit trail). |
| **Decay Risks** | #12 Actor Taxonomy Drift (ACTIVE — rider missing). |
| **Current Status** | MISSING — No rider surface, no delivery entity, no rider identity. |
| **Required Changes** | Add `rider` to AUTH_ACTOR_TYPES. Define delivery entity. Plan rider surface (future phase). |

---

## 5. Admin/Governance Domain

| Dimension | Details |
|---|---|
| **Identity Map** | Actors: `platform_admin`, `operations_admin`, `finance_admin`, `marketing_admin`, `support_admin`. Entities: `User` (admin), `FeatureFlag`, `AuditLog`. |
| **Structure Placement** | Admin surface: `admin-console/src/`. Permission roles: `shared/constants/domain.constants.ts` (PERMISSION_ROLES). Auth: `admin-console/src/shared/services/`. |
| **Core Flow** | Admin login → role-based dashboard → domain-specific management. No state machine (CRUD operations). |
| **Date Handling** | Standard `created_at`, `updated_at` on all admin entities. Audit logs: `timestamp_utc`. |
| **Constitution Risks** | R-021 (server-side RBAC), R-022 (role enumeration), R-060–062 (audit trail), R-071 (feature flag governance). |
| **Decay Risks** | #6 Permission Bypass (AT RISK), #10 Audit Trail Absence (ACTIVE). |
| **Current Status** | PLACEHOLDER_UI — Admin shell, routes, and mock data exist. No real auth/RBAC. |
| **Required Changes** | Implement server-side role enforcement. Build audit log infrastructure. Document feature flag governance. |

---

## 6. Catalog Domain

| Dimension | Details |
|---|---|
| **Identity Map** | Actors: `merchant_owner` (manages store menu), `operations_admin` (manages platform categories), `customer` (browses). Entities: `CatalogCategory`, menu items (merchant-local). |
| **Structure Placement** | Admin: `admin-console/src/features/catalog/`. Merchant: `merchant-console/src/features/menu/`. Customer: `customer-app/lib/features/search/`, `customer-app/lib/features/store/`. |
| **Core Flow** | No state machine. CRUD operations on categories and menu items. |
| **Date Handling** | Standard `created_at`, `updated_at`. |
| **Constitution Risks** | R-023 (merchant store-scoped access to own menu only). |
| **Decay Risks** | #5 Shared Layer Bloat (prevention — catalog logic MUST stay surface-local). |
| **Current Status** | PLACEHOLDER_UI — Category and menu structures exist. No real data. |
| **Required Changes** | Define catalog contract in shared. Implement menu management in merchant surface. |

---

## 7. Marketing Domain

| Dimension | Details |
|---|---|
| **Identity Map** | Actors: `marketing_admin` (manages promotions/announcements), `customer` (redeems), `system` (expires). Entities: `Announcement`, `Promotion` (coupon/discount/free_delivery), `B2BPartner`. |
| **Structure Placement** | Admin: `admin-console/src/features/marketing/`, `admin-console/src/features/announcements/`, `admin-console/src/features/b2b/`. Merchant: `merchant-console/src/features/promotions/`. |
| **Core Flow** | Promotions: `draft → active → expired/disabled`. Announcements: `draft → published → archived`. |
| **Date Handling** | `start_date`, `end_date` for promotions (UTC). `published_at`, `archived_at` for announcements. |
| **Constitution Risks** | R-071 (no unreviewed feature flags as promotion mechanisms). |
| **Decay Risks** | #9 Temporary Workaround Permanence (promotion types are placeholder). |
| **Current Status** | PLACEHOLDER_UI — Route structure exists. No real promotion engine. |
| **Required Changes** | Define promotion contract. Implement promotion validation (dates, limits, eligibility). |

---

## 8. Support Domain

| Dimension | Details |
|---|---|
| **Identity Map** | Actors: `customer` (creates tickets), `merchant_owner`/`merchant_staff` (creates tickets), `support_admin` (manages), `operations_admin` (escalates). Entities: `SupportTicket`, `Dispute`. |
| **Structure Placement** | Admin: `admin-console/src/features/customer-service/`, `admin-console/src/features/disputes/`. Customer: `customer-app/lib/features/orders/` (dispute initiation). Public: `public-website/src/app/(public)/support/`. |
| **Core Flow** | Tickets: `open → in_progress → awaiting_reply → resolved → closed`. Disputes: `open → investigating → resolved` or `open → escalated → resolved`. See FLOW.md Sections 4–5. |
| **Date Handling** | `created_at`, `updated_at`, `resolved_at`, `closed_at`, `escalated_at`. All UTC. |
| **Constitution Risks** | R-020 (actor attribution on all ticket actions), R-060 (audit trail for dispute resolution). |
| **Decay Risks** | #10 Audit Trail Absence (ACTIVE — dispute resolution has no audit trail). |
| **Current Status** | PLACEHOLDER_UI — Support and dispute routes exist. No real ticketing. |
| **Required Changes** | Define support ticket contract. Implement dispute-to-refund flow linkage. Build audit trail for dispute resolution. |
