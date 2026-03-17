# Shared Task Guide

Status: Active
Authority: Operational
Surface: shared
Domains: retrieval, shared, contracts, schemas, types, constants
Last updated: 2026-03-17
Retrieve when:
- you know a task touches `shared/` but need the fastest safe startup path
- you need to distinguish a contract-layer change from a surface runtime change
Related files:
- docs/rag-architecture/RETRIEVAL_ENTRY_SHARED.md
- docs/filemaps/shared-contract-filemap.md
- docs/rag-architecture/SHARED_USAGE_MAP.md
- shared/docs/architecture-boundaries.md
- shared/docs/contracts-inventory.md
- shared/docs/customer-app-shared-adoption-strategy.md

## Purpose

Fast retrieval recipes for common `shared/` tasks.

## Updating a Contract Safely

- Read [shared/docs/architecture-boundaries.md](/Users/andremacmini/Deliberry/shared/docs/architecture-boundaries.md) first.
- Open the relevant contract file under [shared/api/](/Users/andremacmini/Deliberry/shared/api).
- Check the matching validation schema under [shared/validation/](/Users/andremacmini/Deliberry/shared/validation) if the payload shape is changing.
- Then use [docs/filemaps/shared-contract-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/shared-contract-filemap.md) and [docs/rag-architecture/SHARED_USAGE_MAP.md](/Users/andremacmini/Deliberry/docs/rag-architecture/SHARED_USAGE_MAP.md) before editing consuming code.

## Changing a Type Without Breaking Surface Assumptions

- Start in [shared/types/common.types.ts](/Users/andremacmini/Deliberry/shared/types/common.types.ts) or [shared/types/domain.types.ts](/Users/andremacmini/Deliberry/shared/types/domain.types.ts).
- Check whether the type is also reflected by [shared/models/domain.models.ts](/Users/andremacmini/Deliberry/shared/models/domain.models.ts).
- Then inspect affected surfaces through [docs/rag-architecture/SHARED_USAGE_MAP.md](/Users/andremacmini/Deliberry/docs/rag-architecture/SHARED_USAGE_MAP.md). Type changes in `shared/` do not automatically mean runtime semantics should change in every surface.

## Editing Validation Schemas

- Start in the matching file under [shared/validation/](/Users/andremacmini/Deliberry/shared/validation).
- Check the corresponding contract file under [shared/api/](/Users/andremacmini/Deliberry/shared/api) and the related constants/types/models files.
- Treat schema edits as contract-layer changes, not as permission to move runtime validation ownership out of a surface.

## Updating Constants

- Start in [shared/constants/domain.constants.ts](/Users/andremacmini/Deliberry/shared/constants/domain.constants.ts).
- If the constant must remain language-neutral for Flutter adoption, also check [shared/constants/domain.constants.json](/Users/andremacmini/Deliberry/shared/constants/domain.constants.json).
- For customer-facing vocabulary, also check [shared/docs/customer-app-shared-adoption-strategy.md](/Users/andremacmini/Deliberry/shared/docs/customer-app-shared-adoption-strategy.md).

## Deciding Whether a Change Belongs in `shared/` or in a Surface

- Put it in `shared/` if it is neutral vocabulary, a DTO contract, a validation schema, a cross-surface constant, or a pure utility.
- Keep it in a surface if it changes routing, state, session handling, orchestration, screen behavior, UI composition, or runtime flow.
- If the change needs a surface runtime-truth doc to explain ownership, it probably does not belong in `shared/`.

## Tracing a Shared Model Into Customer, Merchant, Admin, or Public Usage

- Start from the shared file you intend to edit.
- Open [docs/rag-architecture/SHARED_USAGE_MAP.md](/Users/andremacmini/Deliberry/docs/rag-architecture/SHARED_USAGE_MAP.md).
- Then jump to the relevant retrieval entry doc:
  - [docs/rag-architecture/RETRIEVAL_ENTRY_CUSTOMER.md](/Users/andremacmini/Deliberry/docs/rag-architecture/RETRIEVAL_ENTRY_CUSTOMER.md)
  - [docs/rag-architecture/RETRIEVAL_ENTRY_MERCHANT.md](/Users/andremacmini/Deliberry/docs/rag-architecture/RETRIEVAL_ENTRY_MERCHANT.md)
  - [docs/rag-architecture/RETRIEVAL_ENTRY_ADMIN.md](/Users/andremacmini/Deliberry/docs/rag-architecture/RETRIEVAL_ENTRY_ADMIN.md)
  - [docs/rag-architecture/RETRIEVAL_ENTRY_PUBLIC.md](/Users/andremacmini/Deliberry/docs/rag-architecture/RETRIEVAL_ENTRY_PUBLIC.md)
- Read the surface runtime-truth doc next to confirm whether the shared artifact is live, adapted, fixture-backed, or only vocabulary-level.

## Avoiding the Mistake of Treating `shared/` as Runtime Truth

- `shared/` is not a controller layer.
- `shared/` is not a session layer.
- `shared/` is not a route owner.
- `shared/` is not the mutable order/cart/auth/store-selection source of truth.
- For runtime ownership questions, leave `shared/` and read the relevant runtime-truth doc instead.
