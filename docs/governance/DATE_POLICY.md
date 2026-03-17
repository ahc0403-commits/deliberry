# Deliberry Platform — Date/Time Policy (ARCHIVED)

Status: archived
Authority: supporting-artifact (NOT canonical governance)
Surface: cross-surface
Domains: time, timestamps, timezone
Last updated: 2026-03-14
Last verified: 2026-03-16
Archived: 2026-03-16
Superseded by: docs/governance/DATE.md
Retrieve when:
- looking for implementation code examples for timestamp handling
- this file is NOT a governance source of truth
Related files:
- docs/governance/DATE.md (canonical owner of all time and timestamp rules)
- shared/utils/date.ts
- shared/types/common.types.ts

> **ARCHIVED**: This file has been superseded by `docs/governance/DATE.md`, which is the sole
> canonical owner of all timestamp and time-policy governance rules (CONSTITUTION.md R-050).
> This file is retained only as a supporting implementation reference for code examples
> (Sections 7.1, 7.2, 7.3). All governance rules from this file have been absorbed into DATE.md.
> Do NOT treat this file as a source of truth for time-policy decisions.

References: CONSTITUTION.md R-050 (delegated to DATE.md)

---

## 1. UTC Storage Mandate

ALL timestamps in databases, API contracts, event payloads, and persistent storage
MUST be stored as UTC ISO 8601 strings.

Format: `YYYY-MM-DDTHH:mm:ssZ` or `YYYY-MM-DDTHH:mm:ss.sssZ`

Examples:
- Correct: `2026-03-14T15:30:00Z`
- Correct: `2026-03-14T15:30:00.000Z`
- Incorrect: `2026-03-14T12:30:00-03:00` (local offset embedded)
- Incorrect: `2026-03-14 12:30:00` (no timezone indicator)
- Incorrect: `Mar 14, 2026 3:30 PM` (informal string)

---

## 2. Display Timezone

The canonical display timezone for the Deliberry platform is:

```
America/Argentina/Buenos_Aires (UTC-3, no daylight saving time)
```

- All user-facing timestamps MUST be converted to Buenos Aires time at the presentation layer.
- Conversion MUST happen in the UI rendering code, never in the data layer.
- The timezone offset is fixed at UTC-3 (Argentina does not observe DST).

---

## 3. Business Date Definition

A "business date" is the calendar date in `America/Argentina/Buenos_Aires` at the time of the event.

- An order placed at `2026-03-14T02:30:00Z` (UTC) is business date `2026-03-13` (11:30 PM Buenos Aires time on March 13).
- Settlement periods, daily reports, and analytics MUST use business dates.

---

## 4. Settlement Period Cutoff

Settlement periods cut off at `23:59:59` Buenos Aires time, which is `02:59:59Z` the following UTC day.

Example: The settlement period for business date 2026-03-14 covers:
- Start: `2026-03-14T03:00:00Z` (midnight Buenos Aires)
- End: `2026-03-15T02:59:59Z` (23:59:59 Buenos Aires)

---

## 5. Timestamp Taxonomy

Every entity that records timestamps MUST use the following field names and semantics.

| Field | Format | Description | Used By |
|---|---|---|---|
| `created_at` | UTC ISO 8601 | When the record was first inserted | All entities |
| `updated_at` | UTC ISO 8601 | When the record was last mutated | All entities |
| `confirmed_at` | UTC ISO 8601 | When merchant confirmed the order | Order |
| `preparing_at` | UTC ISO 8601 | When preparation started | Order |
| `ready_at` | UTC ISO 8601 | When order was marked ready for pickup | Order |
| `picked_up_at` | UTC ISO 8601 | When rider picked up the order | Order |
| `delivered_at` | UTC ISO 8601 | When order was delivered to customer | Order |
| `cancelled_at` | UTC ISO 8601 | When order/payment was cancelled | Order, Payment |
| `disputed_at` | UTC ISO 8601 | When dispute was opened | Dispute |
| `resolved_at` | UTC ISO 8601 | When dispute was resolved | Dispute |
| `settled_at` | UTC ISO 8601 | When settlement was paid to merchant | Settlement |
| `scheduled_at` | UTC ISO 8601 | Scheduled delivery time (future) | Order |
| `expires_at` | UTC ISO 8601 | Expiry time for cart, session, or OTP | Cart, Session |
| `refunded_at` | UTC ISO 8601 | When refund was processed | Payment |

---

## 6. Forbidden Usages

### 6.1 Storage

- MUST NOT store local Argentine time as-is in any persistent field (R-053).
- MUST NOT store Unix epoch integers in contract or API fields (use ISO 8601 strings).
- MUST NOT store relative time strings (`"2 min ago"`, `"yesterday"`) in persistent storage.

### 6.2 Server-Side Code

- MUST NOT use `new Date()` without explicit UTC context in server-side code.
- MUST NOT use `Date.now()` directly in contract fields (convert to ISO 8601 first).
- MUST NOT use `toLocaleDateString()` or `toLocaleTimeString()` in data-layer code.
- MUST NOT assume server timezone matches Buenos Aires.

### 6.3 Client-Side Code

- MUST NOT persist display-formatted dates back to the server.
- MUST NOT send local-time strings in API requests (always send UTC).
- MAY use `Intl.DateTimeFormat` with `timeZone: 'America/Argentina/Buenos_Aires'` for display.

### 6.4 Mock Data

Current mock data uses informal date strings (e.g., `"2024-01-15"` without time or timezone).
This is acceptable during the placeholder phase but MUST be replaced with full UTC ISO 8601
timestamps before live integration.

---

## 7. Implementation Guidelines

### 7.1 TypeScript (Web Surfaces)

```typescript
// Creating a UTC timestamp
const now = new Date().toISOString(); // "2026-03-14T15:30:00.000Z"

// Converting to Buenos Aires for display
const displayTime = new Intl.DateTimeFormat('es-AR', {
  timeZone: 'America/Argentina/Buenos_Aires',
  dateStyle: 'medium',
  timeStyle: 'short',
}).format(new Date(utcTimestamp));

// Business date calculation
function getBusinessDate(utcTimestamp: string): string {
  const date = new Date(utcTimestamp);
  return date.toLocaleDateString('en-CA', {
    timeZone: 'America/Argentina/Buenos_Aires',
  }); // Returns YYYY-MM-DD in Buenos Aires time
}
```

### 7.2 Dart (Customer App)

```dart
// Creating a UTC timestamp
final now = DateTime.now().toUtc().toIso8601String();

// Converting to Buenos Aires for display
// Use the `timezone` package with 'America/Argentina/Buenos_Aires'
```

### 7.3 Database (Supabase/PostgreSQL)

```sql
-- Column definitions MUST use timestamptz
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

-- Queries for business date ranges
WHERE created_at >= '2026-03-14T03:00:00Z'
  AND created_at < '2026-03-15T03:00:00Z'
```

---

## 8. Validation Rules

- Any timestamp field received via API MUST be validated as a valid ISO 8601 UTC string.
- Timestamps with embedded local offsets (e.g., `-03:00`) MUST be converted to UTC (`Z`) before storage.
- Timestamps without timezone indicators MUST be rejected by the API validation layer.
