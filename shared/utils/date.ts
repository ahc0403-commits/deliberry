/**
 * Date/time utilities for the Deliberry platform.
 * All timestamps stored in UTC. Display in Asia/Ho_Chi_Minh.
 * See CONSTITUTION.md R-050, docs/governance/DATE.md.
 */

export const HO_CHI_MINH_TZ = "Asia/Ho_Chi_Minh";

function resolveDateLocale(locale?: string): string {
  if (locale === "ko") return "ko-KR";
  if (locale === "vi") return "vi-VN";
  return "en-GB";
}

/**
 * Converts a UTC ISO string to a Ho Chi Minh City local display string.
 * Example: "2026-03-14T15:30:00Z" -> "14 Mar 2026, 22:30"
 */
export function toDisplayTime(utcIso: string, locale?: string): string {
  return new Intl.DateTimeFormat(resolveDateLocale(locale), {
    timeZone: HO_CHI_MINH_TZ,
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(utcIso));
}

/**
 * Returns the business date (YYYY-MM-DD) in Ho Chi Minh City for a given UTC timestamp.
 * Example: "2026-03-14T18:30:00Z" -> "2026-03-15" (01:30 AM Ho Chi Minh City on March 15)
 */
export function toBusinessDate(utcIso: string): string {
  return new Date(utcIso).toLocaleDateString("en-CA", {
    timeZone: HO_CHI_MINH_TZ,
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
