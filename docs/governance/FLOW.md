# Deliberry Platform — Flow Rules

Status: active
Authority: binding
Surface: cross-surface
Domains: flow, state-machines, lifecycle
Last updated: 2026-03-17
Last verified: 2026-03-16
Retrieve when:
- changing statuses, state transitions, or journey continuity
- validating domain behavior across customer, merchant, admin, and shared contracts
Related files:
- shared/constants/domain.constants.ts
- shared/types/domain.types.ts
- docs/governance/CONSTITUTION.md

> This document defines the canonical state machines for all domain flows.
> All surfaces MUST implement transitions according to these definitions.
> This is the single source of truth for flow behavior.

References: CONSTITUTION.md R-030 through R-033, R-040 through R-043

---

## 1. Order Flow

### 1.1 Canonical State Machine

```
DRAFT → PENDING → CONFIRMED → PREPARING → READY → IN_TRANSIT → DELIVERED
                                                               ↘ CANCELLED (from any state before IN_TRANSIT)
                                                               ↘ DISPUTED (from DELIVERED only)
```

### 1.2 Status Definitions

| Status | Description | Owner | Entry Condition |
|---|---|---|---|
| `draft` | Cart converted to order, not yet submitted | customer-app | Customer initiates checkout |
| `pending` | Order submitted, awaiting merchant confirmation | customer-app | Customer confirms and pays |
| `confirmed` | Merchant accepted the order | merchant-console | Merchant confirms |
| `preparing` | Merchant is preparing the order | merchant-console | Merchant starts preparation |
| `ready` | Order ready for rider pickup | merchant-console | Merchant marks ready |
| `in_transit` | Rider has picked up, en route to customer | rider surface | Rider confirms pickup |
| `delivered` | Order delivered to customer | rider surface / system | Rider confirms delivery or auto-confirm timeout |
| `cancelled` | Order cancelled | varies | See cancellation rules below |
| `disputed` | Customer disputes a delivered order | customer-app + admin-console | Customer opens dispute |

### 1.3 Allowed Transitions

| From | To | Actor | Condition |
|---|---|---|---|
| `draft` | `pending` | `customer` | Payment initiated |
| `draft` | `cancelled` | `customer`, `system` | Cart expired or customer abandoned |
| `pending` | `confirmed` | `merchant_owner`, `merchant_staff` | Merchant accepts |
| `pending` | `cancelled` | `customer`, `merchant_owner`, `system` | Customer cancels, merchant rejects, or timeout |
| `confirmed` | `preparing` | `merchant_owner`, `merchant_staff` | Merchant starts prep |
| `confirmed` | `cancelled` | `merchant_owner` | Merchant cancels (stock issue, etc.) |
| `preparing` | `ready` | `merchant_owner`, `merchant_staff` | Preparation complete |
| `preparing` | `cancelled` | `merchant_owner` | Emergency cancellation |
| `ready` | `in_transit` | `rider`, `system` | Rider picks up order |
| `in_transit` | `delivered` | `rider`, `system` | Delivery confirmed |
| `delivered` | `disputed` | `customer` | Customer opens dispute within dispute window |

### 1.4 Forbidden Transitions (MUST NOT)

- `delivered` → any other state (terminal, except `disputed`)
- `cancelled` → any state (terminal)
- `disputed` → `cancelled` (disputes MUST be resolved, not cancelled)
- `in_transit` → `preparing` (no backward transitions)
- `in_transit` → `confirmed` (no backward transitions)
- `delivered` → `preparing` (no backward transitions)
- Any state → `draft` (draft is entry-only)

### 1.5 Cancellation Rules

- Customer MAY cancel when status is `draft`, `pending`, or `confirmed`.
- Customer MUST NOT cancel when status is `preparing`, `ready`, `in_transit`, or `delivered`.
- Merchant MAY cancel when status is `pending`, `confirmed`, or `preparing`.
- System MAY cancel on timeout (configurable per transition).

### 1.6 Status Alias (Migration)

The value `new` used in merchant and admin mock data MUST map to `pending`.
The value `ready_for_delivery` in the current canonical enum MUST be renamed to `ready`.
The value `picked_up` used in merchant mock data MUST map to `in_transit`.

Canonical enum values to set in `shared/constants/domain.constants.ts`:
```
["draft", "pending", "confirmed", "preparing", "ready", "in_transit", "delivered", "cancelled", "disputed"]
```

---

## 2. Payment Flow

### 2.1 Canonical State Machine

```
PENDING → CAPTURED → SETTLED
        → FAILED (terminal)
        → REFUNDED (from CAPTURED only)
        → PARTIALLY_REFUNDED (from CAPTURED only)
```

### 2.2 Status Definitions

| Status | Description |
|---|---|
| `pending` | Payment initiated, awaiting provider confirmation |
| `captured` | Payment successfully captured from customer |
| `failed` | Payment failed (terminal) |
| `settled` | Payment disbursed to merchant via settlement |
| `refunded` | Full refund issued to customer |
| `partially_refunded` | Partial refund issued |

### 2.3 Allowed Transitions

| From | To | Actor |
|---|---|---|
| `pending` | `captured` | `system` (payment provider callback) |
| `pending` | `failed` | `system` (payment provider callback) |
| `captured` | `settled` | `system` (settlement process) |
| `captured` | `refunded` | `finance_admin`, `support_admin`, `platform_admin` |
| `captured` | `partially_refunded` | `finance_admin`, `support_admin`, `platform_admin` |

### 2.4 Forbidden Transitions

- `failed` → any state (terminal)
- `refunded` → any state (terminal)
- `settled` → `refunded` (must create a new refund transaction, not reverse settlement)
- `pending` → `settled` (must capture first)
- `pending` → `refunded` (nothing to refund)

---

## 3. Settlement Flow

### 3.1 Canonical State Machine

```
PENDING → SCHEDULED → PROCESSING → PAID
                    → FAILED → PENDING (retry)
```

### 3.2 Status Definitions

| Status | Description |
|---|---|
| `pending` | Settlement calculated, awaiting scheduling |
| `scheduled` | Settlement queued for processing on a future date |
| `processing` | Settlement being transferred to merchant |
| `paid` | Settlement successfully transferred |
| `failed` | Settlement transfer failed (retryable) |

### 3.3 Rules

- Settlements MUST NOT be deleted (R-032).
- Corrections MUST be recorded as new adjustment entries.
- Settlement amounts MUST be integer centavos (R-010).
- Settlement period cutoff is 23:59:59 Buenos Aires time (see DATE.md Law 9).

Note: Current canonical uses `processing_placeholder` and `completed_placeholder`. These
MUST be renamed to `processing` and `paid` respectively.

---

## 4. Dispute Flow

Current scope note:

- Customer dispute initiation remains the only current runtime mutation obligation in this flow.
- Admin-console currently provides persisted dispute visibility, not live dispute progression writes.
- Any future admin dispute-resolution workflow requires a separate implementation decision and audit path before it becomes a current runtime obligation.

### 4.1 Canonical State Machine

```
OPEN → INVESTIGATING → RESOLVED
     → ESCALATED → RESOLVED
```

### 4.2 Status Definitions

| Status | Description |
|---|---|
| `open` | Customer opened a dispute |
| `investigating` | Support is reviewing the dispute |
| `escalated` | Dispute escalated to senior support or finance |
| `resolved` | Dispute resolved (with resolution type: refund, replacement, rejected) |

### 4.3 Rules

- Disputes MAY only be opened for orders in `delivered` status.
- Dispute resolution MUST record the resolution type and reasoning.
- Disputes MUST NOT be deleted (immutable record).
- Dispute resolution MAY trigger a payment refund (links to Payment Flow).
- Admin-side dispute progression is deferred in the current runtime and MUST NOT be implied as a live admin-console mutation path until separately implemented.

---

## 5. Support Ticket Flow

### 5.1 Canonical State Machine

```
OPEN → IN_PROGRESS → AWAITING_REPLY → RESOLVED → CLOSED
                   → CLOSED (direct close)
```

### 5.2 Rules

- Support tickets MAY be created by customers, merchants, or internally by admins.
- Ticket assignment MUST be recorded in the audit trail.
- Closed tickets MUST NOT be reopened. A new ticket MUST be created referencing the old one.

---

## 6. Cross-Flow Rules

### 6.1 Idempotency

- All order mutations MUST be idempotent. Each mutation request MUST include an `idempotency_key`.
- If a mutation with the same `idempotency_key` is received twice, the second request MUST return the result of the first without re-executing.
- `idempotency_key` MUST be a client-generated UUID.
- Current enforced runtime scope: `create_customer_order` and `update_order_status_with_audit`.
- Reusing an `idempotency_key` with a different order-mutation payload is a contract violation and MUST be rejected.

### 6.2 Compensation / Rollback Policy

- If payment capture fails after order is `pending`, the order MUST auto-transition to `cancelled`.
- If settlement fails, the settlement MUST transition to `failed` and be retried. The order and payment remain unaffected.
- If a refund fails, it MUST be retried up to 3 times, then escalated to `finance_admin`.

### 6.3 Command/Event Distinction

Commands are requests to change state. Events are records of state changes that occurred.

| Type | Example | Behavior |
|---|---|---|
| Command | `ConfirmOrder(order_id, idempotency_key)` | Validates preconditions, executes transition, emits event |
| Event | `order_confirmed(order_id, actor_id, timestamp)` | Immutable record, triggers side effects (notifications, audit log) |

- Commands MUST validate the current state before transitioning.
- Events MUST be emitted after successful state transitions.
- Events MUST NOT be emitted for failed or rejected commands.

### 6.4 Forbidden Operations

- Direct status field updates bypassing the state machine MUST NOT occur (R-070).
- Backward transitions (e.g., `delivered` → `preparing`) MUST NOT occur.
- Deletion of any flow entity (order, payment, settlement, dispute) MUST NOT occur (R-030–033).
- Status values not in the canonical enum MUST NOT be used (R-040–043).
