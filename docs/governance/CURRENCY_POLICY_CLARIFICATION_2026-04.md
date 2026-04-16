# Currency Policy Clarification -- 2026-04

> **Classification: Supporting Operational Artifact** -- This is NOT a canonical governance document.
> This file clarifies how currency rules must be applied during audit remediation.

Status: active
Authority: operational (supporting artifact)
Surface: cross-surface
Domains: money, currency, remediation-clarification
Last updated: 2026-04-15
Last verified: 2026-04-15
Retrieve when:
- resolving currency-write violations found in the April 2026 audit
- deciding what currency a new governed order write should persist
- reviewing whether USD usage is allowed in a write path
Related files:
- docs/governance/CONSTITUTION.md
- shared/types/common.types.ts
- shared/utils/currency.ts
- merchant-console/src/shared/data/external-sales-service.ts
- supabase/migrations/20260408113000_customer_security_boundary_hardening.sql

## Clarified Rule

The remediation-approved currency rule is:

- `ARS` is the default write currency for governed platform mutations
- `USD` is secondary and must only be used when a path has an explicit documented business basis
- `VND` is never allowed in governed runtime writes

## Immediate Consequences

1. Customer order creation must not default to `USD` unless a separate approved document establishes why.
2. Merchant external sales and any other governed write path must not persist `VND`.
3. Shared currency types remain `ARS | USD`, but that type allowance does not by itself justify a `USD` default.

## Current Decision

Until a more specific business rule is approved, customer order creation should default to `ARS`.

This is the least surprising interpretation of the constitutional rule that ARS is canonical and USD is secondary.

## Review Rule

Any future governed write path that wants to persist `USD` must document:

- why ARS is not correct for that path
- who approved the exception
- what records or surfaces consume the secondary currency

## Prohibited During Remediation

- no governed write path may persist `VND`
- no remediation work may widen payment behavior into verification or real-money movement
- no reviewer may accept a hardcoded `USD` write path merely because the type system allows `USD`

