# Retrieval Entry: Shared

Status: Active
Authority: Operational
Surface: shared
Domains: retrieval, shared, contracts, types, validation, constants, utilities
Last updated: 2026-03-17
Retrieve when:
- deciding whether a change belongs in `shared/` or in a surface
- starting contract, type, schema, constant, or pure utility work
Related files:
- shared/docs/architecture-boundaries.md
- shared/docs/contracts-inventory.md
- shared/constants/domain.constants.ts
- shared/validation/order.schema.json
- docs/filemaps/shared-contract-filemap.md
- docs/rag-architecture/SHARED_USAGE_MAP.md

## Purpose of `shared/`

`shared/` is the cross-surface contract layer. It exists to hold neutral artifacts that multiple surfaces can depend on without pulling runtime orchestration into a common layer.

## What `shared/` Owns

- API contracts in [shared/api/](/Users/andremacmini/Deliberry/shared/api)
- Cross-surface constants in [shared/constants/](/Users/andremacmini/Deliberry/shared/constants)
- Neutral model shapes in [shared/models/](/Users/andremacmini/Deliberry/shared/models)
- Cross-surface types in [shared/types/](/Users/andremacmini/Deliberry/shared/types)
- Validation schemas in [shared/validation/](/Users/andremacmini/Deliberry/shared/validation)
- Pure utilities in [shared/utils/](/Users/andremacmini/Deliberry/shared/utils)

## What `shared/` Does Not Own

- Flutter widgets or React components
- Router files
- App state
- Session handling
- Runtime orchestration
- Surface-specific feature ownership
- Flow logic

If a change depends on Flutter, Next.js routing, local React state, or a surface runtime controller, it does not belong in `shared/`.

## Binding Authority Docs

- [docs/governance/CONSTITUTION.md](/Users/andremacmini/Deliberry/docs/governance/CONSTITUTION.md)
- [docs/governance/STRUCTURE.md](/Users/andremacmini/Deliberry/docs/governance/STRUCTURE.md)
- [docs/02-surface-ownership.md](/Users/andremacmini/Deliberry/docs/02-surface-ownership.md)
- [docs/06-guardrails.md](/Users/andremacmini/Deliberry/docs/06-guardrails.md)
- [shared/docs/architecture-boundaries.md](/Users/andremacmini/Deliberry/shared/docs/architecture-boundaries.md)
- [shared/docs/contracts-inventory.md](/Users/andremacmini/Deliberry/shared/docs/contracts-inventory.md)

## Which Files and Folders Under `shared/` Are Usually Read First

- [shared/docs/architecture-boundaries.md](/Users/andremacmini/Deliberry/shared/docs/architecture-boundaries.md)
- [shared/docs/contracts-inventory.md](/Users/andremacmini/Deliberry/shared/docs/contracts-inventory.md)
- [shared/constants/domain.constants.ts](/Users/andremacmini/Deliberry/shared/constants/domain.constants.ts)
- [shared/constants/domain.constants.json](/Users/andremacmini/Deliberry/shared/constants/domain.constants.json)
- [shared/types/common.types.ts](/Users/andremacmini/Deliberry/shared/types/common.types.ts)
- [shared/types/domain.types.ts](/Users/andremacmini/Deliberry/shared/types/domain.types.ts)
- [shared/models/domain.models.ts](/Users/andremacmini/Deliberry/shared/models/domain.models.ts)
- Relevant schema or contract file under [shared/validation/](/Users/andremacmini/Deliberry/shared/validation) or [shared/api/](/Users/andremacmini/Deliberry/shared/api)
- [docs/filemaps/shared-contract-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/shared-contract-filemap.md)
- [docs/rag-architecture/SHARED_USAGE_MAP.md](/Users/andremacmini/Deliberry/docs/rag-architecture/SHARED_USAGE_MAP.md)

## Common Traps and False Assumptions

- Do not treat `shared/` as runtime truth. Surface runtime-truth docs still own state continuity, session behavior, and route handoffs.
- Do not move customer, merchant, admin, or public flow logic into `shared/`.
- Do not edit TypeScript shared files and assume Flutter can import them directly. Read [shared/docs/customer-app-shared-adoption-strategy.md](/Users/andremacmini/Deliberry/shared/docs/customer-app-shared-adoption-strategy.md) first.
- Do not put “helpful” UI helpers or business workflows in [shared/utils/](/Users/andremacmini/Deliberry/shared/utils) if they embed surface ownership.

## Retrieval Sequences for Contract, Type, and Schema Edits

- Update a domain constant or enum:
  - [shared/docs/contracts-inventory.md](/Users/andremacmini/Deliberry/shared/docs/contracts-inventory.md) -> [docs/filemaps/shared-contract-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/shared-contract-filemap.md) -> [docs/rag-architecture/SHARED_USAGE_MAP.md](/Users/andremacmini/Deliberry/docs/rag-architecture/SHARED_USAGE_MAP.md)
- Update a shared type or model:
  - [shared/docs/architecture-boundaries.md](/Users/andremacmini/Deliberry/shared/docs/architecture-boundaries.md) -> [docs/filemaps/shared-contract-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/shared-contract-filemap.md) -> [docs/rag-architecture/SHARED_USAGE_MAP.md](/Users/andremacmini/Deliberry/docs/rag-architecture/SHARED_USAGE_MAP.md)
- Update a contract or validation schema:
  - relevant file in [shared/api/](/Users/andremacmini/Deliberry/shared/api) or [shared/validation/](/Users/andremacmini/Deliberry/shared/validation) -> [docs/filemaps/shared-contract-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/shared-contract-filemap.md) -> affected surface retrieval entry

## Relationship to Surface Runtime-Truth Docs

- `shared/` defines vocabulary and structure.
- Surface runtime-truth docs define where mutable truth actually lives.
- If you are changing behavior instead of vocabulary, leave `shared/` and go to the relevant surface retrieval entry:
  - [docs/rag-architecture/RETRIEVAL_ENTRY_CUSTOMER.md](/Users/andremacmini/Deliberry/docs/rag-architecture/RETRIEVAL_ENTRY_CUSTOMER.md)
  - [docs/rag-architecture/RETRIEVAL_ENTRY_MERCHANT.md](/Users/andremacmini/Deliberry/docs/rag-architecture/RETRIEVAL_ENTRY_MERCHANT.md)
  - [docs/rag-architecture/RETRIEVAL_ENTRY_ADMIN.md](/Users/andremacmini/Deliberry/docs/rag-architecture/RETRIEVAL_ENTRY_ADMIN.md)
  - [docs/rag-architecture/RETRIEVAL_ENTRY_PUBLIC.md](/Users/andremacmini/Deliberry/docs/rag-architecture/RETRIEVAL_ENTRY_PUBLIC.md)
