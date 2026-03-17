export function isKnownStatus(
  value: string,
  allowed: readonly string[],
): boolean {
  return allowed.includes(value);
}

export function ensureKnownStatus(
  value: string,
  fallback: string,
  allowed: readonly string[],
): string {
  return isKnownStatus(value, allowed) ? value : fallback;
}
