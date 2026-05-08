# Concurrent Order Smoke Test

Status: active
Date: 2026-04-25
Surface: customer-app, merchant-console, admin-console
Domains: stores, menu, checkout, orders

## Purpose

This document records the smoke harness for verifying that five customer orders can be created concurrently across five separate stores, then read back through customer and merchant order visibility.

## Seed Data

`supabase/seed.sql` adds five orderable smoke stores:

- `smoke-store-01`
- `smoke-store-02`
- `smoke-store-03`
- `smoke-store-04`
- `smoke-store-05`

Each store has at least two available menu items. The demo merchant owner `demo@saborcriollo.com` has `merchant_owner` membership for all five stores with `is_default = false`, preserving `demo-store` as the default store.

## Execution

Run the local Supabase stack with the current migrations and seed, then execute:

```bash
node scripts/smoke-concurrent-orders.mjs
```

The script reads Supabase connection values from local env files when present. It also accepts explicit overrides:

```bash
SMOKE_CUSTOMER_EMAIL=customer.one@example.com \
SMOKE_CUSTOMER_PASSWORD=customerpass123 \
SMOKE_MERCHANT_EMAIL=demo@saborcriollo.com \
SMOKE_MERCHANT_PASSWORD=demo1234 \
node scripts/smoke-concurrent-orders.mjs
```

## Verification Criteria

The smoke passes only when:

- all five `create_customer_order` RPC calls resolve successfully through one concurrent `Promise.all`
- one order is created for each smoke store
- all created orders remain `payment_status = pending`
- the authenticated customer can read all five created orders
- the demo merchant can read all five created orders through store membership RLS

## Guardrails

This harness does not implement payment verification, payment completion, map autocomplete, QR flows, or real-time order tracking. Payment method selection remains a checkout placeholder, and created orders intentionally keep pending payment state.

## Local Run Result

The smoke script passed locally against `http://127.0.0.1:54321` on 2026-04-25.

Latest created orders:

- `b8f916d4-0e45-44cc-9398-989b814add87` for `smoke-store-01`
- `ff998ce0-1e82-4d7e-96bf-7f176e7739d6` for `smoke-store-02`
- `5e6b2b86-5929-4934-8f7e-ccf8c2f3ee8c` for `smoke-store-03`
- `056396ad-457a-4ab8-b3cb-e8aec7c673ad` for `smoke-store-04`
- `f942abc0-601e-4038-9506-63e96e6c6329` for `smoke-store-05`

All five orders were returned as `status = pending` and `payment_status = pending`.

Seed application note: direct `psql -f supabase/seed.sql` passes after changing immutable settlement item seed conflicts to `do nothing`.

## Latest Run Result (Single Store, 10 Customers)

An additional smoke run was executed locally against `http://127.0.0.1:54321` on 2026-04-28 with this scenario:

- one target store: `smoke-store-01`
- ten concurrent customer actors
- one order per customer at the same time

Outcome:

- PASS: `10/10` orders created concurrently through `create_customer_order`
- PASS: all orders returned `status = pending`
- PASS: all orders returned `payment_status = pending`
- PASS: all orders were scoped to `smoke-store-01`
- PASS: `10` distinct `customer_actor_id` values were observed
- PASS: merchant readback returned all `10` created orders

Order ids:

- `bf7200ba-4730-41ac-9fdf-0b6f4fef1d23`
- `3b78bfb6-9cb5-4d8a-bbe2-7959918483f0`
- `8b3df14a-3179-4090-bee0-1c28b144c974`
- `51d5330c-fc7a-455f-8830-d0e4d9308195`
- `b67bc29d-bd25-4ff3-9434-2b6093145fa0`
- `046d4611-d090-4a18-a6ca-4292e16eb7ba`
- `7da2c7e2-285d-433a-b755-0917da25e19c`
- `0e5f4ff8-8e6e-47b0-bd17-400e230d3931`
- `aa9a6484-ca35-4f81-9218-bce8d0770b3d`
- `98fea17c-f874-4ea0-b023-fa5d10fcfaea`

Note:

- This run created ten local smoke customer accounts (`customer.smoke.01@example.com` through `customer.smoke.10@example.com`) for runtime-authenticated concurrency validation.
