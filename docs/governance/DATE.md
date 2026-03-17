# Deliberry Time Laws and Timestamp Standards

Status: active
Authority: binding
Surface: cross-surface
Domains: governance, date, time, timestamps
Last updated: 2026-03-17
Last verified: 2026-03-17
Retrieve when:
- checking timestamp, timezone, or document-date rules
- verifying canonical date formats for governance docs, contracts, and comments
Related files:
- docs/governance/CONSTITUTION.md
- docs/governance/STRUCTURE.md
- docs/governance/ENFORCEMENT_CHECKLIST.md
- docs/rag-architecture/RAG_METADATA_STANDARD.md

## Purpose

This document defines the time laws and timestamp standards that apply across the Deliberry repository. It governs how dates and times are represented, stored in documents, and referenced in governance metadata.

This document does not define business flow ownership (see `FLOW.md`). It does not define repository structure (see `STRUCTURE.md`). It does not define product identity rules (see `IDENTITY.md`).

---

## Law 1 — Canonical Date Format

All dates in governance documents, product docs, and code comments must use ISO 8601 format:

```
YYYY-MM-DD
```

Examples:
- Correct: `2026-03-16`
- Incorrect: `03/16/2026`, `March 16 2026`, `16-03-26`

---

## Law 2 — Canonical Timestamp Format

All timestamps (when precision beyond date is needed) must use ISO 8601 UTC format:

```
YYYY-MM-DDTHH:MM:SSZ
```

Examples:
- Correct: `2026-03-16T14:30:00Z`
- Incorrect: `Mar 16, 2:30 PM`, `03/16/2026 14:30`

If timezone is required and differs from UTC, use the offset form:

```
YYYY-MM-DDTHH:MM:SS+HH:MM
```

---

## Law 3 — Governance Document Date Fields

Every active governance document must carry the following date fields in the standard retrieval metadata block at the top of the file:

| Field | Meaning |
|-------|---------|
| `Last updated` | Date this document was last substantively changed |
| `Last verified` | Date this document was last confirmed as accurate (may equal `Last updated`) |

These fields must be updated whenever the document content changes.

A document whose `Last updated` date is more than 90 days behind the current date is considered a stale candidate and must be reviewed. See `DECAY_PATH.md` for the staleness detection and review procedure.

---

## Law 4 — No Relative Dates in Persistent Documents

Relative date references (`yesterday`, `last week`, `next Thursday`, `soon`, `recently`) are forbidden in governance documents, product docs, and architecture docs.

Relative dates lose meaning as time passes and produce ambiguous history. All persistent documents must use absolute ISO 8601 dates.

Example of a forbidden pattern:
> "This was completed last sprint."

Required form:
> "This was completed on 2026-03-16."

---

## Law 5 — Current Date Anchor

The authoritative current date is the value of `currentDate` injected into agent context at execution time.

When an agent or automated run creates or updates a document, it must use the injected `currentDate` value for all `last-updated` and `last-verified` fields.

An agent must not guess the current date. An agent must not use a hardcoded date from a previous session.

---

## Law 6 — Runtime Timestamp Standards (from CONSTITUTION R-050–R-053)

The following rules apply to all runtime timestamps across all surfaces and contracts:

- All timestamps MUST be stored in UTC.
- All timestamps MUST be represented as ISO 8601 strings with timezone offset (e.g., `2026-03-16T15:30:00Z`).
- Display-layer conversion to `America/Argentina/Buenos_Aires` MUST happen only at the presentation layer.
- No surface MUST persist a local-time string in a database or API contract field.

These rules are constitutional law (CONSTITUTION.md R-050). This document is their sole owner.

---

## Law 7 — Date Fields in Code Are Surface-Local

Timestamp fields in data models, DTOs, and domain entities belong to the surface that owns them. While all surfaces must comply with the UTC and ISO 8601 rules above, surface-specific formatting, timezone display preferences, and presentation logic are surface-local concerns.

---

## Law 8 — Platform Display Timezone

The canonical display timezone for the Deliberry platform is:

```
America/Argentina/Buenos_Aires (UTC-3, no daylight saving time)
```

- All user-facing timestamps MUST be converted to Buenos Aires time at the presentation layer.
- Conversion MUST happen in UI rendering code, never in the data layer.
- The timezone offset is fixed at UTC-3 (Argentina does not observe DST).

---

## Law 9 — Business Date Definition

A "business date" is the calendar date in `America/Argentina/Buenos_Aires` at the time of the event.

- An order placed at `2026-03-14T02:30:00Z` (UTC) has business date `2026-03-13` (11:30 PM Buenos Aires).
- Settlement periods, daily reports, and analytics MUST use business dates.
- Settlement periods cut off at `23:59:59` Buenos Aires time (`02:59:59Z` the following UTC day).

---

## Law 10 — Timestamp Field Naming Standards

Every entity that records timestamps MUST use the following canonical field names:

| Field | Format | Description |
|-------|--------|-------------|
| `created_at` | UTC ISO 8601 | When the record was first inserted |
| `updated_at` | UTC ISO 8601 | When the record was last mutated |
| `confirmed_at` | UTC ISO 8601 | When merchant confirmed the order |
| `preparing_at` | UTC ISO 8601 | When preparation started |
| `ready_at` | UTC ISO 8601 | When order was marked ready |
| `picked_up_at` | UTC ISO 8601 | When rider picked up the order |
| `delivered_at` | UTC ISO 8601 | When order was delivered |
| `cancelled_at` | UTC ISO 8601 | When order/payment was cancelled |
| `disputed_at` | UTC ISO 8601 | When dispute was opened |
| `resolved_at` | UTC ISO 8601 | When dispute was resolved |
| `settled_at` | UTC ISO 8601 | When settlement was paid |
| `scheduled_at` | UTC ISO 8601 | Scheduled delivery time (future) |
| `expires_at` | UTC ISO 8601 | Expiry time for cart, session, or OTP |
| `refunded_at` | UTC ISO 8601 | When refund was processed |

---

## Law 11 — Forbidden Timestamp Patterns

### Storage

- MUST NOT store local Argentine time as-is in any persistent field.
- MUST NOT store Unix epoch integers in contract or API fields (use ISO 8601 strings).
- MUST NOT store relative time strings (`"2 min ago"`, `"yesterday"`) in persistent storage.

### Server-Side Code

- MUST NOT use `new Date()` without explicit UTC context in server-side code.
- MUST NOT use `Date.now()` directly in contract fields (convert to ISO 8601 first).
- MUST NOT use `toLocaleDateString()` or `toLocaleTimeString()` in data-layer code.
- MUST NOT assume server timezone matches Buenos Aires.

### Client-Side Code

- MUST NOT persist display-formatted dates back to the server.
- MUST NOT send local-time strings in API requests (always send UTC).

### Validation

- Any timestamp field received via API MUST be validated as a valid ISO 8601 UTC string.
- Timestamps with embedded local offsets (e.g., `-03:00`) MUST be converted to UTC (`Z`) before storage.
- Timestamps without timezone indicators MUST be rejected by the API validation layer.

---

## Summary Table

| Context | Required Format |
|---------|----------------|
| Governance doc frontmatter | `YYYY-MM-DD` |
| Inline date references in docs | `YYYY-MM-DD` |
| Timestamp precision in docs | `YYYY-MM-DDTHH:MM:SSZ` |
| Runtime timestamps (all surfaces) | `YYYY-MM-DDTHH:MM:SSZ` (UTC) |
| Display timezone | `America/Argentina/Buenos_Aires` (UTC-3) |
| Business dates | Calendar date in Buenos Aires time |
| Current date in agent runs | Use injected `currentDate` |
| Relative dates in docs | Forbidden |
| Unix epoch in contracts | Forbidden |
