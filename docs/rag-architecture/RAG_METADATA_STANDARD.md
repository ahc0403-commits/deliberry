# RAG Metadata Standard

Status: Proposed
Authority: Operational
Surface: cross-surface
Domains: retrieval, metadata, standards
Last updated: 2026-03-17
Last verified: 2026-03-17
Retrieve when:
- updating active-doc metadata formatting
- checking which metadata shape is canonical for retrievable docs
Related files:
- docs/rag-architecture/RAG_ACTIVE_INDEX.md
- docs/governance/CONSTITUTION.md
- docs/governance/DATE.md

## Purpose

Provide the canonical active-doc metadata block that makes existing docs retrieval-friendly without forcing a new doc system.

## Required Fields

```md
Status: Active | Reference | Historical | Superseded | Proposed
Authority: Binding | Advisory | Operational | Historical
Surface: repo | customer-app | merchant-console | admin-console | public-website | shared | cross-surface
Domains: order, auth, checkout
Last updated: YYYY-MM-DD
Last verified: YYYY-MM-DD
Retrieve when:
- short trigger
- short trigger
Related files:
- path/to/file
- path/to/file
```

## Optional Fields

```md
Rule IDs: R-010, R-040
Supersedes: path/to/doc.md
Superseded by: path/to/doc.md
Flow: home-to-checkout
Feature: store
Runtime truth: customer_runtime_controller
```

## Rules

- Keep the metadata block short.
- Do not bury it below long prose.
- Use the same field names across doc families.
- For active governance, RAG, runtime-truth, flow, filemap, and local README docs, this markdown metadata block is the canonical format.
- Do not use YAML frontmatter for active retrieval docs.
- Mark historical docs honestly instead of quietly leaving them in circulation.
