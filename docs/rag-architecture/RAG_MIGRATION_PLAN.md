# RAG Migration Plan

Status: Proposed
Last updated: 2026-03-17

## Phase 0. Do First

### 0.1 Add retrieval metadata without moving docs
- Add front matter or a compact metadata block to:
  - `docs/governance/*`
  - `docs/ui-governance/*`
  - future feature README files
- Minimum metadata:
  - `status`
  - `authority_level`
  - `surface_scope`
  - `domains`
  - `last_updated`
  - `retrieve_when`
  - `related_files`

### 0.2 Add active vs historical indexing
- Create indexes for:
  - governance docs
  - UI governance docs
  - reviews
- Mark documents as `active`, `reference`, `historical`, or `superseded`.

This step is low-risk and immediately improves retrieval quality.

## Phase 1. Build Local Retrieval Entrypoints

### 1.1 Add feature READMEs to high-churn clusters
- First targets:
  - customer store
  - customer cart
  - customer orders
  - customer search
  - merchant orders
  - merchant menu
  - admin orders
  - admin disputes
- Each README should stay short and code-adjacent.

### 1.2 Add first file-map docs
- Start with route/runtime-sensitive work.
- Keep each filemap narrow and operational.

## Phase 2. Build Flow and Runtime Truth Layer

### 2.1 Add flow docs
- Prefer one flow doc per critical journey.
- Link directly to route files, state truth, and governing rules.

### 2.2 Add runtime-truth docs
- Focus on where mutable state actually lives today.
- Explicitly mark mock-backed vs live-backed vs placeholder.

This phase is where coding-agent retrieval quality improves most.

## Phase 3. Add Sparse Decision History

### 3.1 Use governance exceptions first
- Implement `docs/governance/exceptions/` before inventing a broad ADR system.
- Create files only for real exceptions or consequential architecture choices.

### 3.2 Add a tiny decision index if needed
- Only after several exceptions exist.
- Keep it cross-linked to the rule IDs it affects.

## Phase 4. Postpone Until There Is Proven Need

- automated chunk generation across the entire repo
- vector-store-specific formatting
- per-widget or per-component README files
- mass splitting of stable governance docs

These add maintenance burden too early.

## Split / Keep / Review Guidance

### Docs to keep authoritative and unchanged in structure
- `docs/governance/CONSTITUTION.md`
- `docs/governance/IDENTITY.md`
- `docs/governance/STRUCTURE.md`
- `docs/governance/FLOW.md`
- `docs/governance/DATE.md`
- `docs/governance/DECAY_PATH.md`

### Docs to enrich with metadata and links
- all `docs/ui-governance/*.md`
- `docs/governance/DOMAIN_MAPPING_MATRIX.md`
- `docs/governance/ENFORCEMENT_POINTS.md`
- `docs/governance/WAVE_TRACKER.md`

### Docs to treat as operational history, not primary authority
- `reviews/*.md`

### Docs that may be split later if they continue to grow
- [docs/governance/DECAY_PATH.md](/Users/andremacmini/Deliberry/docs/governance/DECAY_PATH.md)
- [docs/governance/FLOW.md](/Users/andremacmini/Deliberry/docs/governance/FLOW.md)
- [docs/ui-governance/STABILIZATION_REPORT.md](/Users/andremacmini/Deliberry/docs/ui-governance/STABILIZATION_REPORT.md)

## What Can Be Generated Automatically

- file-map skeletons from route trees and feature directories
- metadata header scaffolds
- indexes of docs with status and surface tags
- related-file lists from import graphs

## What Needs Human Review

- authority level assignment
- active vs historical status
- flow ownership and route truth
- runtime truth ownership
- any exception/decision record

## Safe Adoption Sequence

1. Metadata headers
2. Active/historical indexes
3. First feature READMEs
4. First filemaps
5. First flow docs
6. First runtime-truth docs
7. Sparse decision records

This sequence preserves current documentation value while improving retrieval incrementally.
