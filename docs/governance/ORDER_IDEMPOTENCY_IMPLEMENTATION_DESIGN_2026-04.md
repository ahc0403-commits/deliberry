# Order Idempotency Implementation Design -- 2026-04

> **Classification: Supporting Operational Artifact** -- This is NOT a canonical governance document.
> This file defines the approved implementation design for reopened finding `R-FLOW-IDEMPOTENCY`.

Status: implemented in source -- 2026-04-15
Authority: operational (supporting artifact)
Surface: customer-app, merchant-console, supabase
Domains: order, governance-remediation, mutation-integrity
Last updated: 2026-04-15
Last verified: 2026-04-15
Retrieve when:
- implementing order mutation idempotency
- updating order RPC contracts
- verifying reopened finding `R-FLOW-IDEMPOTENCY`
Related files:
- docs/governance/AUDIT_REOPENED_FINDINGS_2026-04.md
- docs/governance/FLOW.md
- docs/governance/AUDIT_REMEDIATION_CHECKLIST_2026-04.md
- supabase/migrations/20260408113000_customer_security_boundary_hardening.sql
- supabase/migrations/20260408140000_merchant_admin_security_hardening.sql
- customer-app/lib/core/data/customer_runtime_controller.dart
- customer-app/lib/core/data/customer_runtime_gateway.dart
- customer-app/lib/core/data/supabase_customer_runtime_gateway.dart
- merchant-console/src/features/orders/server/order-actions.ts
- merchant-console/src/shared/data/merchant-order-runtime-service.ts
- merchant-console/src/shared/data/supabase-merchant-runtime-repository.ts

## Purpose

This document turns the reopened order-idempotency finding into an implementation-ready design.

It resolves one concrete contradiction:

- `docs/governance/FLOW.md` requires every order mutation to include a client-generated `idempotency_key`
- the current customer order-create path and merchant order-status update path do not yet implement that contract

This design covers the live governed mutation paths that exist today:

- customer order creation
- merchant order-status updates

It does not introduce any new payment verification, real-time tracking, or unrelated mutation infrastructure.

## Approved Design Summary

**Building**: A dedicated order-mutation idempotency layer backed by one new Supabase table and coordinated contract changes across customer and merchant order write paths. Customer checkout will generate a UUID per intentional submit action and pass it through the runtime gateway into `create_customer_order`. Merchant order status updates will generate a UUID per intentional status-change action and pass it through the server action, runtime service, repository, and RPC into `update_order_status_with_audit`. The database will reserve the key, validate that repeated requests have the same payload fingerprint, and return the first successful result without re-executing the mutation.

**Not building**:
- generic idempotency for every mutation in the repo
- admin-specific order write paths that do not currently exist in runtime code
- client-side offline queueing or background retry infrastructure
- payment, settlement, refund, support-ticket, or profile idempotency

**Approach**: Use a dedicated `public.order_mutation_idempotency` table rather than storing keys on `orders` or overloading `audit_logs`. This keeps the scope aligned to the reopened finding, avoids coupling idempotency retention to business entities, and supports both create and status-update flows with one contract. The design is intentionally order-only, because broad generic infrastructure would increase schema and rollout cost without evidence that other domains need it now.

**Key decisions**:
- One dedicated table will own idempotency state for order mutations. This is simpler and safer than adding nullable key columns to `orders`.
- The canonical key owner is the client intent boundary. Customer Flutter and merchant UI callers generate UUIDs; server code and RPCs only enforce and persist them.
- The database is the source of truth for duplicate detection. Surface code forwards keys and request fingerprints but does not decide duplicate semantics.
- Only committed successful mutations are replayed. Validation failures and authorization failures do not become permanent cached results.
- Request fingerprint mismatch with the same key is a hard error. Reusing a key for a different payload is treated as a contract violation.

**Unknowns**:
- None that block implementation of the current runtime paths.
- Future admin order-write routes must adopt this same contract if they are introduced later. Owner: future admin order-write implementation slice.

## Why This Approach

Three alternatives were considered:

1. Minimal doc-only fix: narrow `FLOW.md` to remove the idempotency requirement.
   Effort: low
   Risk: high
   Builds on: current runtime unchanged
   Rejected because it weakens a valid integrity rule to match an implementation gap.

2. Store idempotency metadata directly on `orders`.
   Effort: medium
   Risk: medium
   Builds on: existing `orders` table
   Rejected because create and status-update flows need different scopes, and a single business row cannot cleanly represent in-progress or replayed status mutations.

3. Dedicated order-mutation idempotency table.
   Effort: medium
   Risk: low-medium
   Builds on: existing RPC-centered write architecture
   Chosen because it isolates retry state, supports multiple order operations, and can be rolled back without rewriting business entities.

Attack check:

- Dependency failure: no external service is required; the design degrades only with database unavailability, which already blocks order mutations today.
- Scale explosion: the first pressure point is table growth in `order_mutation_idempotency`. This is controlled by keeping the scope order-only and by defining a retention cleanup policy.
- Rollback cost: rollback is low because the new table can be ignored or dropped after reverting the RPC and caller signatures; no business row rewrite is required.
- Premise collapse: the most fragile assumption is that current order mutations remain synchronous single-RPC transactions. If future flow splits into async orchestration, the table schema still survives, but the completion-state rules would need expansion.

## Scope and File Impact

This implementation will touch more than 8 files and spans more than 3 data-exchanging components.

Expected file classes:

- one new Supabase migration
- one binding doc update in `FLOW.md`
- customer gateway contract and caller updates
- merchant server action and repository updates
- checklist and reopened-finding closure artifacts

Data-flow diagram:

```text
"Customer checkout UI"
        |
        v
"CustomerRuntimeController.submitOrder"
        |
        v
"SupabaseCustomerRuntimeGateway.createOrder"
        |
        v
"create_customer_order RPC"
        |
        v
"orders + audit_logs + order_mutation_idempotency"

"Merchant orders UI"
        |
        v
"updateMerchantOrderStatusAction"
        |
        v
"merchant-order-runtime-service"
        |
        v
"supabase-merchant-runtime-repository"
        |
        v
"update_order_status_with_audit RPC"
        |
        v
"orders + audit_logs + order_mutation_idempotency"
```

There are no intentional cycles in this design.

## Data Model

Add one new table:

`public.order_mutation_idempotency`

Required columns:

- `id text primary key`
- `actor_id uuid not null references public.actor_profiles (id) on delete restrict`
- `actor_type text not null` with the same actor-type check family already used in `audit_logs`
- `operation text not null` with allowed values:
  - `customer_order_create`
  - `merchant_order_status_update`
- `resource_scope text not null`
  - for customer create: store id
  - for merchant status update: order id
- `idempotency_key uuid not null`
- `request_fingerprint text not null`
- `order_id text references public.orders (id) on delete restrict`
- `response_snapshot jsonb`
- `created_at timestamptz not null default timezone('utc', now())`
- `completed_at timestamptz`

Required constraints and indexes:

- unique index on `(actor_id, operation, idempotency_key)`
- index on `created_at`
- check that `response_snapshot` is null when `completed_at` is null

Rationale:

- `actor_id + operation + idempotency_key` prevents collisions across users and operation types
- `resource_scope` lets reviewers inspect the intended mutation target without reading payload JSON
- `response_snapshot` allows successful replay without re-running the mutation body

Retention policy:

- keep rows for 30 days
- add one cleanup SQL statement to the migration notes for manual or scheduled pruning:
  - delete where `created_at < timezone('utc', now()) - interval '30 days'`

The cleanup policy is concrete but does not require a new scheduler in this implementation slice.

## Contract Changes

### Customer order creation

Add `idempotencyKey` to:

- `CustomerOrderCreateInput`
- `CustomerRuntimeController.submitOrder(...)`
- `SupabaseCustomerRuntimeGateway.createOrder(...)`
- `create_customer_order(...)`

Rules:

- the key must be a client-generated UUID string
- the key is generated once per intentional checkout submit
- if the user retries the same submit after an uncertain failure, the same key must be reused for that retry attempt
- a fresh user intent generates a new UUID

### Merchant order status update

Add `idempotencyKey` to:

- the client-side caller that triggers the status change
- `updateMerchantOrderStatusAction(...)`
- `updateMerchantOrderRuntimeStatus(...)`
- `supabaseMerchantRuntimeRepository.updateOrderStatus(...)`
- `update_order_status_with_audit(...)`

Rules:

- the key must be a client-generated UUID string
- one status-change intent gets one UUID
- retrying the same status change reuses the same UUID
- a later different status change always gets a new UUID

## Database Behavior

### Customer create flow

`create_customer_order(...)` will change as follows:

1. Validate that `p_idempotency_key` is present and parseable as UUID.
2. Build a deterministic request fingerprint from:
   - actor id
   - store id
   - payment method
   - delivery address
   - notes
   - normalized line items
   - promo code
   - estimated delivery timestamp
3. Try to insert an `order_mutation_idempotency` reservation row.
4. If the reservation already exists:
   - fetch the existing row
   - compare request fingerprint
   - if fingerprint differs, raise a contract-violation exception
   - if `completed_at` is set, return the stored `response_snapshot` as `public.orders`
   - if `completed_at` is null, raise an `idempotent mutation in progress` exception
5. Execute the existing order-create mutation body.
6. Write audit log as today.
7. Update the idempotency row with:
   - `order_id`
   - full order snapshot in `response_snapshot`
   - `completed_at`
8. Return the created order row.
9. If validation, authorization, or mutation failure occurs before commit completion, remove the reservation row in the exception path before re-raising the error.

### Merchant status-update flow

`update_order_status_with_audit(...)` will change as follows:

1. Validate that `p_idempotency_key` is present and parseable as UUID.
2. Build a deterministic request fingerprint from:
   - actor id
   - store id
   - order id
   - next status
3. Reserve the key in `order_mutation_idempotency`.
4. On duplicate:
   - fingerprint mismatch is a hard error
   - completed row returns stored `response_snapshot`
   - incomplete row raises `idempotent mutation in progress`
5. Execute the existing status transition and audit write.
6. Store the updated order snapshot and completion timestamp.
7. On failure before completion, delete the reservation row and re-raise.

## Implemented Rollout Shape

The source implementation was delivered as one coordinated change set:

1. New migration creating `order_mutation_idempotency`
2. Customer and merchant runtime callers updated to always send `idempotencyKey`
3. `create_customer_order` and `update_order_status_with_audit` now validate and enforce the key at runtime
4. `docs/governance/FLOW.md` and the reopened-governance artifacts were reconciled in the same source pass

Current implementation note:

- `create_customer_order` keeps a trailing `p_idempotency_key text default null` signature for safer overload replacement, but runtime enforcement still rejects null or malformed keys.
- `update_order_status_with_audit` now requires the key directly in its callable signature.

## Error Semantics

These error outcomes are required:

- missing key: explicit contract error
- malformed UUID: explicit contract error
- same key, different payload: explicit contract error
- same key, same payload, completed mutation: return first success result
- same key while first mutation is still open: explicit retry-later error

These errors must be mappable at the surface layer without leaking SQL details.

## Tests and Verification

Happy paths:

- customer submit with fresh key creates one order, one audit entry, one completed idempotency row
- repeating the same customer request with the same key returns the same order and does not create a second audit row
- merchant status update with fresh key transitions once and writes one audit entry
- repeating the same merchant status request with the same key returns the same updated order and does not write a second audit row

Error paths:

- missing key is rejected
- malformed UUID is rejected
- same key with different payload is rejected
- unauthorized merchant caller is rejected and does not leave a completed idempotency row
- invalid status transition is rejected and does not leave a completed idempotency row

Edge cases:

- duplicate request arrives while the first request is still in progress
- customer checkout submit fails after reservation but before order commit
- merchant retries a terminal status update after a transport timeout
- replay after a successful mutation still returns the original response snapshot even if the order was later changed by a different valid mutation

Verification artifacts required before closure:

- migration diff
- customer and merchant caller diffs
- one repo search showing all live order mutation callers pass `idempotencyKey`
- one end-to-end verification note showing duplicate replay does not create duplicate orders or duplicate audit writes

## Rollback

Rollback does not require rewriting business data.

Rollback steps:

1. revert surface code that sends the key
2. revert RPC parameter enforcement
3. leave the idempotency table in place or drop it in a cleanup migration

If rollback occurs after some successful writes, existing orders and audit logs remain valid because idempotency metadata is additive and not the source of business truth.

## Dependencies

No new third-party API, token, CLI, or account is required.

This design depends only on:

- PostgreSQL features already used by Supabase migrations
- existing actor-profile, order, and audit-log tables
- current customer and merchant order mutation paths
