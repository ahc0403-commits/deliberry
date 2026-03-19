/**
 * Runtime observability builder utilities.
 * Factory functions for constructing observability events and classifying failures.
 */

import type {
  RuntimeObservabilityEvent,
  RuntimeObservabilityFailureClass,
} from "../types/observability.types";

/**
 * Build a complete RuntimeObservabilityEvent from partial input.
 * Automatically sets audience based on surface and stamps recordedAtUtc.
 */
export function buildRuntimeObservabilityEvent(
  input: Omit<RuntimeObservabilityEvent, "audience" | "recordedAtUtc">,
): RuntimeObservabilityEvent {
  const audience =
    input.surface === "customer-app"
      ? "customer"
      : input.surface === "merchant-console"
        ? "merchant"
        : "admin";

  return {
    ...input,
    audience,
    recordedAtUtc: new Date().toISOString(),
  };
}

/**
 * Classify an unknown error into a RuntimeObservabilityFailureClass.
 * Uses error message heuristics and known Supabase/fetch error shapes.
 */
export function classifyRuntimeFailure(
  error: unknown,
): RuntimeObservabilityFailureClass {
  if (error == null) return "unknown";

  const message =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : String(error);

  const lower = message.toLowerCase();

  if (lower.includes("fetch") || lower.includes("network") || lower.includes("econnrefused")) {
    return "network";
  }
  if (lower.includes("unauthorized") || lower.includes("403") || lower.includes("jwt")) {
    return "auth";
  }
  if (lower.includes("validation") || lower.includes("invalid") || lower.includes("required")) {
    return "validation";
  }
  if (lower.includes("not found") || lower.includes("404") || lower.includes("no rows")) {
    return "not_found";
  }
  if (lower.includes("conflict") || lower.includes("409") || lower.includes("duplicate")) {
    return "conflict";
  }
  if (lower.includes("rate limit") || lower.includes("429") || lower.includes("too many")) {
    return "rate_limit";
  }
  if (lower.includes("timeout") || lower.includes("timed out") || lower.includes("deadline")) {
    return "timeout";
  }
  if (lower.includes("internal") || lower.includes("500")) {
    return "internal";
  }

  return "unknown";
}
