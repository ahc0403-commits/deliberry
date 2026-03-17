# Shared Contract Filemap

Status: Active
Authority: Operational
Surface: shared
Domains: shared, contracts, constants, types, validation, adapters
Last updated: 2026-03-17
Retrieve when:
- editing a shared constant, type, model, schema, or contract
- tracing where shared vocabulary crosses into customer, merchant, admin, or public surfaces
Related files:
- shared/docs/architecture-boundaries.md
- shared/docs/contracts-inventory.md
- shared/constants/domain.constants.ts
- shared/types/domain.types.ts

## Purpose

Show the narrow file cluster for shared contract work and the first surface adapters that consume it.

## When To Retrieve This Filemap

- before changing canonical enums or contract vocabulary
- before changing a schema that may affect multiple surfaces
- when you need to confirm whether a change belongs in `shared/` or in a surface

## Entry Files

- `shared/docs/architecture-boundaries.md`
- `shared/docs/contracts-inventory.md`
- `shared/constants/domain.constants.ts`
- `shared/types/domain.types.ts`

## Adjacent Files Usually Read Together

- `shared/constants/domain.constants.json`
- `shared/types/common.types.ts`
- `shared/models/domain.models.ts`
- `shared/api/*.contract.json`
- `shared/validation/*.schema.json`
- `shared/utils/currency.ts`
- `merchant-console/src/shared/domain.ts`
- `admin-console/src/shared/domain.ts`
- `public-website/src/shared/domain.ts`
- `customer-app/lib/core/shared_contracts/domain_contract_bridge.dart`

## Source-of-Truth Files

- `shared/constants/domain.constants.ts`
- `shared/types/common.types.ts`
- `shared/types/domain.types.ts`
- `shared/models/domain.models.ts`
- the relevant file under `shared/api/` or `shared/validation/`

These files own canonical vocabulary and neutral structure. Surface adapters and bridges consume them but do not replace them.

## Files Often Mistaken as Source of Truth but Are Not

- `merchant-console/src/shared/domain.ts`
- `admin-console/src/shared/domain.ts`
- `public-website/src/shared/domain.ts`
- `customer-app/lib/core/shared_contracts/domain_contract_bridge.dart`

Those are adapter or bridge boundaries. They are intentionally surface-local and downstream of `shared/`.

## High-Risk Edit Points

- enum/value changes in `shared/constants/domain.constants.ts`
- any matching language-neutral export changes in `shared/constants/domain.constants.json`
- type aliases in `shared/types/domain.types.ts`
- money/date utility semantics in `shared/utils/currency.ts` and `shared/utils/date.ts`
- schema/contract edits that drift away from constants/types

## Related Governance Docs

- `docs/governance/STRUCTURE.md`
- `docs/06-guardrails.md`
- `shared/docs/architecture-boundaries.md`
- `shared/docs/contracts-inventory.md`

## Related Local Feature READMEs

- `merchant-console/src/features/auth/README.md`
- `merchant-console/src/features/orders/README.md`
- `admin-console/src/features/auth/README.md`
- `admin-console/src/features/orders/README.md`
- `public-website/src/features/legal/README.md`
- `customer-app/lib/features/checkout/README.md`

## Safe Edit Sequence

1. Confirm the change belongs in `shared/`, not a surface runtime layer.
2. Edit the canonical shared file first.
3. Check the matching schema, contract, or JSON export if the change affects vocabulary or shape.
4. Verify the surface adapters or Flutter bridge still match.
5. Then inspect the affected surface retrieval entry before changing consuming code.
