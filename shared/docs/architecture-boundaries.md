# Deliberry Shared Architecture Boundaries

Status: active
Authority: binding
Surface: shared
Domains: shared-boundary, contracts, dependency-rules
Last updated: 2026-03-16
Last verified: 2026-03-16
Retrieve when:
- deciding whether code belongs in shared or in a surface
- checking forbidden shared-layer content before moving files
Related files:
- docs/02-surface-ownership.md
- docs/06-guardrails.md
- shared/docs/contracts-inventory.md

`shared/` is reserved for cross-surface artifacts only.

Allowed content:
- contracts and DTOs
- domain models
- enums and constants
- shared types
- validation schemas
- pure utilities with no surface runtime dependency

Forbidden content:
- UI components
- router code
- app state
- runtime-specific feature orchestration
- surface-specific business flows

Rule of thumb:
- If it depends on Flutter, React, Next.js routing, or a surface-specific state container, it does not belong in `shared/`.
- If it defines a neutral contract used across surfaces, it may belong in `shared/`.
