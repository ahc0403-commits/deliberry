# Deliberry Platform — Identity Taxonomy

Status: active
Authority: binding
Surface: cross-surface
Domains: identity, actors, permissions
Last updated: 2026-03-17
Last verified: 2026-03-16
Retrieve when:
- changing actor types, access boundaries, or role naming
- checking entity ownership before auth or permission work
Related files:
- shared/constants/domain.constants.ts
- docs/governance/CONSTITUTION.md
- docs/08-auth-session-strategy.md

> This document defines the canonical actor taxonomy, entity taxonomy, identity boundaries,
> and access control rules for the Deliberry platform.
> All surfaces MUST comply with these definitions.

References: CONSTITUTION.md R-020 through R-024

---

## 1. Actor Taxonomy

Every action in the system MUST be attributed to exactly one actor. The following table
defines the complete set of actor types.

| Actor Type | Surface | Auth Method | Scope | Description |
|---|---|---|---|---|
| `guest` | customer-app | None (anonymous session) | Browse + cart only | Unauthenticated visitor. MUST NOT place orders. |
| `customer` | customer-app | Phone/OTP | Own orders, profile, addresses | Authenticated customer. |
| `merchant_owner` | merchant-console | Credentials | Single store (or multi-store if authorized) | Store owner with full store management rights. |
| `merchant_staff` | merchant-console | Credentials (delegated) | Single store, limited permissions | Store employee with scoped permissions. |
| `rider` | (future surface) | Credentials/OTP | Assigned deliveries only | Delivery actor. Picks up and delivers orders. |
| `support_admin` | admin-console | Credentials + MFA | Customer service, disputes, tickets | Handles support escalations. |
| `finance_admin` | admin-console | Credentials + MFA | Settlements, refunds, financial reports | Manages financial operations. |
| `operations_admin` | admin-console | Credentials + MFA | Orders, merchants, stores, catalog | Manages operational workflows. |
| `marketing_admin` | admin-console | Credentials + MFA | Promotions, announcements, B2B | Manages marketing and partnerships. |
| `platform_admin` | admin-console | Credentials + MFA | All admin capabilities | Superuser. Has all admin permissions. |
| `system` | Backend services | Service credentials | Internal operations | Automated processes (cron jobs, webhooks, event handlers). |

### Current Gaps

- **`merchant_staff`**: Scoping mechanism (which permissions within a store) is not yet defined. The actor type is now present in `AUTH_ACTOR_TYPES` (Wave 1 remediation, 2026-03-17).

---

## 2. Entity Taxonomy

| Entity | Owner Surface | Lifecycle Owner | Description |
|---|---|---|---|
| `User` | Per-surface auth | Surface that created it | Base identity record. Each surface has its own user model. |
| `Session` | Per-surface auth | Surface runtime | Active login session. MUST NOT cross surface boundaries (R-073). |
| `Store` | merchant-console | merchant-console + admin-console | Physical or virtual merchant location. |
| `Merchant` | merchant-console | merchant-console + admin-console | Business entity that owns one or more stores. |
| `Order` | customer-app (creation) | All surfaces (read), customer-app + merchant-console (mutation) | Purchase transaction. Immutable once terminal (R-030). |
| `OrderItem` | customer-app | Embedded in Order | Line item within an order. |
| `Cart` | customer-app | customer-app | Pre-order basket. Ephemeral. |
| `Payment` | customer-app (initiation) | Backend service | Financial transaction. Immutable once terminal (R-031). |
| `Settlement` | admin-console | Backend service | Merchant payout record. Immutable (R-032). |
| `Dispute` | customer-app (initiation) | admin-console (resolution) | Contested order or payment. |
| `SupportTicket` | customer-app / merchant-console | admin-console | Customer or merchant support request. |
| `Announcement` | admin-console | admin-console | Platform-wide notification or message. |
| `CatalogCategory` | admin-console | admin-console | Product categorization hierarchy. |
| `B2BPartner` | admin-console | admin-console | Business partnership record. |
| `FeatureFlag` | admin-console | admin-console | Runtime feature toggle. MUST NOT bypass governance (R-071). |
| `AuditLog` | All surfaces (write) | Backend service | Immutable record of mutations (R-033, R-060–062). |

---

## 3. Identity Boundary Rules

### 3.1 Session Isolation

- Each surface MUST own its session lifecycle independently (R-001).
- Sessions MUST NOT be shared across surfaces (R-073).
- A customer session in customer-app MUST NOT grant access to merchant-console or admin-console.
- A merchant session MUST NOT grant access to another merchant's store data (R-023).

### 3.2 Actor Attribution

- Every mutation MUST record the `actor_id` and `actor_type` of the initiating actor (R-020).
- System-initiated actions MUST use `actor_type: 'system'` with a service identifier as `actor_id`.
- Guest actions MUST use a session-scoped anonymous identifier. Guest identifiers MUST NOT persist beyond the session.

### 3.3 Store Scoping

- Merchant actors (`merchant_owner`, `merchant_staff`) MUST be scoped to a specific `store_id` at all times (R-023).
- All merchant queries and mutations MUST include `store_id` as a mandatory parameter.
- Cross-store access MUST require explicit multi-store authorization on the merchant identity.

### 3.4 Admin Scoping

- Admin actors MUST have an explicit role from `PERMISSION_ROLES` (R-022).
- Role checks MUST be enforced server-side. Client-side checks are UI hints only (R-021).
- `platform_admin` has implicit access to all admin capabilities.
- Other admin roles MUST be restricted to their domain (support, finance, operations, marketing).

---

## 4. Actor-Action-Resource Matrix

| Actor | Orders | Payments | Settlements | Users | Stores | Disputes | Support Tickets | Catalog | Promotions |
|---|---|---|---|---|---|---|---|---|---|
| `guest` | browse | - | - | - | browse | - | - | browse | browse |
| `customer` | create, read own, cancel own | initiate own | - | read/edit own | browse | create own | create own | browse | redeem |
| `merchant_owner` | read store, confirm, prepare, ready | read store | read store | - | manage own | respond | create, respond | - | - |
| `merchant_staff` | read store, confirm, prepare, ready | read store | - | - | read own | respond | create | - | - |
| `rider` | read assigned, pick up, deliver | - | - | read own | - | - | - | - | - |
| `support_admin` | read all, escalate | read all | read all | read all | read all | manage | manage | read | - |
| `finance_admin` | read all | read all, refund | manage | - | read all | read financial | - | - | - |
| `operations_admin` | read all, override status | read all | read all | read all | manage all | manage | manage | manage | - |
| `marketing_admin` | - | - | - | - | read all | - | - | read | manage |
| `platform_admin` | all | all | all | all | all | all | all | all | all |
| `system` | transition (via events) | capture, settle | process | - | - | auto-escalate | auto-assign | - | expire |

Legend: `-` = no access, `browse` = read public info, `read` = read full detail, `manage` = CRUD, `all` = unrestricted

---

## 5. Minimum Identity Unit for Audit Log

Every audit log entry (R-060–062) MUST contain at minimum:

```typescript
{
  actor_id: string;        // Unique identifier of the actor
  actor_type: ActorType;   // One of the actor types from Section 1
  action: string;          // Verb describing the mutation (e.g., 'order.confirmed')
  resource_type: string;   // Entity type being mutated (e.g., 'Order')
  resource_id: string;     // Unique identifier of the entity
  timestamp_utc: string;   // ISO 8601 UTC timestamp
  before_state?: object;   // Snapshot before mutation (optional for creates)
  after_state: object;     // Snapshot after mutation
}
```

---

## 6. Auth Token Claims (Target State)

When live auth is implemented, tokens MUST contain:

| Claim | Type | Required | Description |
|---|---|---|---|
| `sub` | string | YES | Actor unique identifier |
| `actor_type` | ActorType | YES | From actor taxonomy |
| `role` | string | For admin only | From `PERMISSION_ROLES` |
| `store_id` | string | For merchant only | Active store scope |
| `iat` | number | YES | Issued-at timestamp (UTC epoch) |
| `exp` | number | YES | Expiry timestamp (UTC epoch) |
| `session_id` | string | YES | Session identifier for audit trail |

---

## 7. Constraints Summary

| Rule | Constraint |
|---|---|
| R-020 | Every mutation MUST be attributed to an authenticated actor |
| R-021 | RBAC MUST be enforced server-side |
| R-022 | Admin roles MUST be from `PERMISSION_ROLES` |
| R-023 | Merchant access MUST be store-scoped |
| R-024 | Guest access MUST be browse + cart only |
