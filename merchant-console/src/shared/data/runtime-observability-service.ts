import "server-only";

import {
  buildRuntimeObservabilityEvent,
  classifyRuntimeFailure,
  sanitizeForLogsAndTelemetry,
  type RuntimeObservabilityEvent,
  type RuntimeObservabilityFailureClass,
  type RuntimeObservabilityOperatorSummary,
  type RuntimeObservabilityThresholdSummary,
} from "../domain";
import { createMerchantServiceSupabaseClient } from "../supabase/client";

export async function recordMerchantRuntimeObservabilityEvent(
  event: RuntimeObservabilityEvent,
): Promise<void> {
  const supabase = createMerchantServiceSupabaseClient();
  const sanitizedMetadata = sanitizeForLogsAndTelemetry({
    dataFamily:
      event.operation === "merchant.order.status_update"
        ? "merchant_orders"
        : "merchant_store_profile",
    payload: event.metadata ?? {},
  });

  const { error } = await supabase.from("runtime_observability_events").insert({
    audience: event.audience,
    surface: event.surface,
    layer: event.layer,
    operation: event.operation,
    outcome: event.outcome,
    trace_id: event.traceId,
    attempt_source: event.attemptSource,
    failure_class: event.failureClass,
    actor_type: event.actorType,
    store_id: event.storeId,
    order_id: event.orderId,
    item_count: event.itemCount,
    payment_method: event.paymentMethod,
    from_status: event.fromStatus,
    to_status: event.toStatus,
    resource_type: event.resourceType,
    resource_scope: event.resourceScope,
    duration_ms: event.durationMs,
    metadata: sanitizedMetadata.payload,
    recorded_at: event.recordedAtUtc,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export function buildMerchantRuntimeFailureClass(
  error: unknown,
): RuntimeObservabilityFailureClass {
  return classifyRuntimeFailure(error);
}

export function buildMerchantRuntimeEvent(
  input: Omit<RuntimeObservabilityEvent, "audience" | "recordedAtUtc">,
): RuntimeObservabilityEvent {
  return buildRuntimeObservabilityEvent(input);
}

export async function getMerchantRuntimeObservabilityThresholdSummary(
  windowMinutes = 5,
): Promise<RuntimeObservabilityThresholdSummary> {
  const supabase = createMerchantServiceSupabaseClient();
  const { data, error } = await supabase.rpc(
    "get_runtime_observability_threshold_summary",
    {
      p_surface: "merchant-console",
      p_window_minutes: windowMinutes,
    },
  );

  if (error) {
    throw new Error(error.message);
  }

  const summary = (data ?? {}) as {
    windowMinutes?: number;
    signals?: string[];
    counts?: Record<string, number>;
  };

  return {
    windowMinutes: summary.windowMinutes ?? windowMinutes,
    signals: (summary.signals ?? []) as RuntimeObservabilityThresholdSummary["signals"],
    counts: (summary.counts ?? {}) as RuntimeObservabilityThresholdSummary["counts"],
  };
}

export async function getMerchantRuntimeObservabilityOperatorSummary(
  windowMinutes = 60,
): Promise<RuntimeObservabilityOperatorSummary> {
  const supabase = createMerchantServiceSupabaseClient();
  const { data, error } = await supabase.rpc(
    "get_runtime_observability_operator_summary",
    {
      p_window_minutes: windowMinutes,
    },
  );

  if (error) {
    throw new Error(error.message);
  }

  const summary = (data ?? {}) as RuntimeObservabilityOperatorSummary;
  return {
    windowMinutes: summary.windowMinutes ?? windowMinutes,
    totals: summary.totals ?? {
      events: 0,
      fallbacks: 0,
      accessDenials: 0,
      writeFailures: 0,
    },
    hotOperations: summary.hotOperations ?? [],
  };
}
