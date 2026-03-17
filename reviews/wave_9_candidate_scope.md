# Wave 9 Candidate Scope — Metadata Format Normalization

Date: 2026-03-17
Status: proposed
Authority: operational (candidate scope)
Surface: cross-surface
Domains: retrieval, metadata, documentation-hygiene
Related files:
- docs/rag-architecture/RAG_GAP_AUDIT.md
- docs/rag-architecture/RAG_PRIORITY_BACKLOG.md
- docs/rag-architecture/RAG_METADATA_STANDARD.md
- docs/governance/DATE.md
- docs/governance/GLOSSARY.md
- docs/governance/ENFORCEMENT_CHECKLIST.md

## Goal

Close the final remaining open retrieval-hygiene gap: `G01`.

## Why This Is The Next Wave

After Wave 8, all runtime-truth, route-coverage, and long-tail retrieval-entry gaps tracked in the active RAG layer are closed. The only remaining open gap is metadata-format inconsistency across a small set of active governance docs.

This is the smallest remaining execution-ready wave because it:

- stays entirely in documentation
- affects only three active governance docs plus the metadata standard
- improves mechanical retrieval consistency without changing governance meaning
- does not reopen any closed runtime or coverage work

## Gap To Close

### G01 — Mixed metadata formats weaken machine-friendly retrieval consistency

The repository-standard active-doc metadata shape is the top-of-file markdown block used across the RAG layer and most active governance docs:

- `Status`
- `Authority`
- `Surface`
- `Domains`
- `Last updated`
- `Last verified`
- `Retrieve when`
- `Related files`

Three active governance docs still use YAML frontmatter instead:

- [docs/governance/DATE.md](/Users/andremacmini/Deliberry/docs/governance/DATE.md)
- [docs/governance/GLOSSARY.md](/Users/andremacmini/Deliberry/docs/governance/GLOSSARY.md)
- [docs/governance/ENFORCEMENT_CHECKLIST.md](/Users/andremacmini/Deliberry/docs/governance/ENFORCEMENT_CHECKLIST.md)

## Wave 9 Boundary

### In Scope

1. Convert the three remaining active YAML-frontmatter governance docs to the repository-standard retrieval metadata block.
2. Preserve document meaning exactly; this is a presentation/metadata normalization pass only.
3. Update [docs/rag-architecture/RAG_METADATA_STANDARD.md](/Users/andremacmini/Deliberry/docs/rag-architecture/RAG_METADATA_STANDARD.md) so it reflects one canonical active-doc metadata format instead of tolerating dual-format ambiguity.
4. Update [docs/rag-architecture/RAG_GAP_AUDIT.md](/Users/andremacmini/Deliberry/docs/rag-architecture/RAG_GAP_AUDIT.md), [docs/rag-architecture/RAG_PRIORITY_BACKLOG.md](/Users/andremacmini/Deliberry/docs/rag-architecture/RAG_PRIORITY_BACKLOG.md), and [docs/governance/WAVE_TRACKER.md](/Users/andremacmini/Deliberry/docs/governance/WAVE_TRACKER.md) only if `G01` is truly closed.

### Out of Scope

- Any runtime code
- Any route, auth, or UI behavior changes
- Broad governance rewrites
- Historical doc normalization
- New retrieval families or structural doc moves

## Execution Rules

- Keep edits mechanical and audit-friendly.
- Do not change doctrine or wording beyond metadata framing.
- Prefer the active repository-standard metadata block already used by [docs/governance/CONSTITUTION.md](/Users/andremacmini/Deliberry/docs/governance/CONSTITUTION.md) and [docs/rag-architecture/RAG_ACTIVE_INDEX.md](/Users/andremacmini/Deliberry/docs/rag-architecture/RAG_ACTIVE_INDEX.md).
- Only close `G01` if the remaining active governance docs no longer rely on YAML frontmatter as their metadata presentation.

## Expected Outcome

- Open-gap count drops from `1` to `0`.
- Active governance and RAG docs use one consistent retrieval metadata style.
- The remaining repo work after Wave 9 is optional improvement work, not tracked open gaps.
