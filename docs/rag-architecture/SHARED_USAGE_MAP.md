# Shared Usage Map

Status: Active
Authority: Operational
Surface: shared
Domains: shared, usage-map, adapters, contract-tracing
Last updated: 2026-03-17
Retrieve when:
- tracing a shared constant, type, schema, or utility into the consuming surfaces
- deciding which surface adapter or bridge to inspect after editing `shared/`
Related files:
- docs/filemaps/shared-contract-filemap.md
- docs/rag-architecture/RETRIEVAL_ENTRY_SHARED.md
- shared/docs/contracts-inventory.md

## Purpose

Give coding agents one narrow trace map from canonical shared artifacts into the surface-local adapter boundaries that consume them.

## Canonical Shared Owners

- Constants: [shared/constants/domain.constants.ts](/Users/andremacmini/Deliberry/shared/constants/domain.constants.ts)
- Language-neutral constant export: [shared/constants/domain.constants.json](/Users/andremacmini/Deliberry/shared/constants/domain.constants.json)
- Common types: [shared/types/common.types.ts](/Users/andremacmini/Deliberry/shared/types/common.types.ts)
- Domain types: [shared/types/domain.types.ts](/Users/andremacmini/Deliberry/shared/types/domain.types.ts)
- Models: [shared/models/domain.models.ts](/Users/andremacmini/Deliberry/shared/models/domain.models.ts)
- Contracts: [shared/api/](/Users/andremacmini/Deliberry/shared/api)
- Schemas: [shared/validation/](/Users/andremacmini/Deliberry/shared/validation)
- Money utility: [shared/utils/currency.ts](/Users/andremacmini/Deliberry/shared/utils/currency.ts)

## Surface Adapter and Bridge Boundaries

- Merchant TypeScript adapter:
  - [merchant-console/src/shared/domain.ts](/Users/andremacmini/Deliberry/merchant-console/src/shared/domain.ts)
- Admin TypeScript adapter:
  - [admin-console/src/shared/domain.ts](/Users/andremacmini/Deliberry/admin-console/src/shared/domain.ts)
- Public TypeScript adapter:
  - [public-website/src/shared/domain.ts](/Users/andremacmini/Deliberry/public-website/src/shared/domain.ts)
- Customer Flutter bridge:
  - [customer-app/lib/core/shared_contracts/domain_contract_bridge.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/shared_contracts/domain_contract_bridge.dart)
  - strategy note: [shared/docs/customer-app-shared-adoption-strategy.md](/Users/andremacmini/Deliberry/shared/docs/customer-app-shared-adoption-strategy.md)

## Fast Trace Paths

### Change a canonical enum or constant

- Start: [shared/constants/domain.constants.ts](/Users/andremacmini/Deliberry/shared/constants/domain.constants.ts)
- Then check:
  - [merchant-console/src/shared/domain.ts](/Users/andremacmini/Deliberry/merchant-console/src/shared/domain.ts)
  - [admin-console/src/shared/domain.ts](/Users/andremacmini/Deliberry/admin-console/src/shared/domain.ts)
  - [public-website/src/shared/domain.ts](/Users/andremacmini/Deliberry/public-website/src/shared/domain.ts)
  - [customer-app/lib/core/shared_contracts/domain_contract_bridge.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/shared_contracts/domain_contract_bridge.dart) if the constant is mirrored into Flutter

### Change a shared type alias or model

- Start: [shared/types/domain.types.ts](/Users/andremacmini/Deliberry/shared/types/domain.types.ts) or [shared/models/domain.models.ts](/Users/andremacmini/Deliberry/shared/models/domain.models.ts)
- Then check the surface adapter files above and the runtime-truth docs for the affected surface

### Change a contract or schema

- Start: relevant file under [shared/api/](/Users/andremacmini/Deliberry/shared/api) or [shared/validation/](/Users/andremacmini/Deliberry/shared/validation)
- Then check the nearest consuming surface:
  - merchant/admin/public TypeScript adapters
  - Flutter bridge only if there is a mirrored vocabulary dependency

### Change money formatting

- Start: [shared/utils/currency.ts](/Users/andremacmini/Deliberry/shared/utils/currency.ts)
- Then check:
  - [merchant-console/src/shared/domain.ts](/Users/andremacmini/Deliberry/merchant-console/src/shared/domain.ts)
  - [admin-console/src/shared/domain.ts](/Users/andremacmini/Deliberry/admin-console/src/shared/domain.ts)
- Customer formatting is surface-local and does not import this utility directly

## Common Traps

- Do not treat the surface adapter files as canonical owners. They are import boundaries.
- Do not assume every shared change reaches Flutter; the customer app uses a selective bridge, not direct TypeScript imports.
- Do not treat `shared/` as runtime state ownership. After tracing into a surface, switch to that surface’s runtime-truth docs.
