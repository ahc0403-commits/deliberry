/**
 * Date/time utilities for the Deliberry platform.
 * All timestamps stored in UTC. Display in America/Argentina/Buenos_Aires.
 * See CONSTITUTION.md R-050, docs/governance/DATE.md.
 */

export const BUENOS_AIRES_TZ = "America/Argentina/Buenos_Aires";

/**
 * Converts a UTC ISO string to a Buenos Aires local display string.
 * Example: "2026-03-14T15:30:00Z" -> "14 mar 2026, 12:30"
 */
export function toDisplayTime(utcIso: string): string {
  return new Intl.DateTimeFormat("es-AR", {
    timeZone: BUENOS_AIRES_TZ,
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(utcIso));
}

/**
 * Returns the business date (YYYY-MM-DD) in Buenos Aires for a given UTC timestamp.
 * Example: "2026-03-14T02:30:00Z" -> "2026-03-13" (11:30 PM Buenos Aires on March 13)
 */
export function toBusinessDate(utcIso: string): string {
  return new Date(utcIso).toLocaleDateString("en-CA", {
    timeZone: BUENOS_AIRES_TZ,
  });
}

/**
 * Validates that a value is a valid ISO 8601 UTC timestamp string ending with 'Z'.
 */
export function isValidUTCTimestamp(value: unknown): boolean {
  if (typeof value !== "string") return false;
  if (!value.endsWith("Z")) return false;
  const parsed = Date.parse(value);
  if (isNaN(parsed)) return false;
  // Verify it round-trips as valid ISO
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/.test(value);
}

export function formatDateRangeLabel(from: string, to: string): string {
  return `${from} -> ${to}`;
}

export function isIsoLikeDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}/.test(value);
}
