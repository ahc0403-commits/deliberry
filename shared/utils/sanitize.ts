/**
 * Sanitization utilities for logs and telemetry payloads.
 * Strips PII-sensitive keys before data reaches telemetry sinks.
 */

const SENSITIVE_KEY_PATTERNS = [
  /password/i,
  /secret/i,
  /token/i,
  /authorization/i,
  /cookie/i,
  /session/i,
  /credit.?card/i,
  /card.?number/i,
  /cvv/i,
  /ssn/i,
  /social.?security/i,
  /phone/i,
  /email/i,
  /address/i,
  /birth/i,
  /passport/i,
];

function isSensitiveKey(key: string): boolean {
  return SENSITIVE_KEY_PATTERNS.some((pattern) => pattern.test(key));
}

function sanitizeObject(
  obj: Record<string, unknown>,
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (isSensitiveKey(key)) {
      result[key] = "[REDACTED]";
    } else if (value != null && typeof value === "object" && !Array.isArray(value)) {
      result[key] = sanitizeObject(value as Record<string, unknown>);
    } else {
      result[key] = value;
    }
  }

  return result;
}

/**
 * Sanitize a payload for safe inclusion in logs and telemetry events.
 * Redacts keys that match PII-sensitive patterns.
 */
export function sanitizeForLogsAndTelemetry(input: {
  dataFamily: string;
  payload: Record<string, unknown>;
}): { dataFamily: string; payload: Record<string, unknown> } {
  return {
    dataFamily: input.dataFamily,
    payload: sanitizeObject(input.payload),
  };
}
