import "server-only";

import {
  buildProductTelemetryEvent,
  mapProductTelemetryStepKey,
  sanitizeForLogsAndTelemetry,
  type ProductTelemetryEvent,
  type ProductTelemetryFunnel,
  type ProductTelemetryFunnelSummary,
  type ProductTelemetryConversionSummary,
  type ProductTelemetryRouteViewSummary,
} from "../domain";
import { createMerchantServiceSupabaseClient } from "../supabase/client";

export async function recordMerchantProductTelemetryEvent(
  event: ProductTelemetryEvent,
): Promise<void> {
  const supabase = createMerchantServiceSupabaseClient();
  const sanitized = sanitizeForLogsAndTelemetry({
    dataFamily:
      event.eventName === "merchant.order_status_update" ||
      event.eventName === "merchant.orders_viewed"
        ? "merchant_orders"
        : "merchant_store_profile",
    payload: event.metadata ?? {},
  });

  const { error } = await supabase.from("product_telemetry_events").insert({
    audience: event.audience,
    surface: event.surface,
    event_name: event.eventName,
    outcome: event.outcome,
    session_mode: event.sessionMode,
    actor_type: event.actorType,
    store_id: event.storeId,
    order_id: event.orderId,
    item_count: event.itemCount,
    payment_method: event.paymentMethod,
    review_rating: event.reviewRating,
    source: event.source,
    metadata: sanitized.payload,
    occurred_at: event.occurredAtUtc,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export function buildMerchantProductTelemetryEvent(
  input: Omit<ProductTelemetryEvent, "audience" | "occurredAtUtc">,
): ProductTelemetryEvent {
  return buildProductTelemetryEvent(input);
}

export async function getCustomerProductTelemetryFunnelSummary(
  windowMinutes = 1440,
): Promise<ProductTelemetryFunnelSummary> {
  const supabase = createMerchantServiceSupabaseClient();
  const { data, error } = await supabase.rpc(
    "get_customer_product_telemetry_funnel_summary",
    {
      p_window_minutes: windowMinutes,
    },
  );

  if (error) {
    throw new Error(error.message);
  }

  return data as ProductTelemetryFunnelSummary;
}

export async function getMerchantProductTelemetryFunnelSummary(
  windowMinutes = 1440,
): Promise<ProductTelemetryFunnelSummary> {
  const supabase = createMerchantServiceSupabaseClient();
  const { data, error } = await supabase.rpc(
    "get_merchant_product_telemetry_funnel_summary",
    {
      p_window_minutes: windowMinutes,
    },
  );

  if (error) {
    throw new Error(error.message);
  }

  return data as ProductTelemetryFunnelSummary;
}

export async function getProductTelemetryRouteViewSummary(
  surface: "customer-app" | "merchant-console",
  windowMinutes = 1440,
): Promise<ProductTelemetryRouteViewSummary> {
  const supabase = createMerchantServiceSupabaseClient();
  const { data, error } = await supabase.rpc(
    "get_product_telemetry_route_view_summary",
    {
      p_surface: surface,
      p_window_minutes: windowMinutes,
    },
  );

  if (error) {
    throw new Error(error.message);
  }

  return data as ProductTelemetryRouteViewSummary;
}

export async function getProductTelemetryConversionSummary(
  funnel: ProductTelemetryFunnel,
  windowMinutes = 1440,
): Promise<ProductTelemetryConversionSummary> {
  const supabase = createMerchantServiceSupabaseClient();
  const { data, error } = await supabase.rpc(
    "get_product_telemetry_conversion_summary",
    {
      p_funnel: funnel,
      p_window_minutes: windowMinutes,
    },
  );

  if (error) {
    throw new Error(error.message);
  }

  return data as ProductTelemetryConversionSummary;
}

export function summarizeTelemetryFunnelDropoff(
  summary: ProductTelemetryFunnelSummary,
): Array<{
  stepKey: string;
  eventCount: number;
  previousStepKey: string | null;
  previousEventCount: number | null;
  dropoffCount: number | null;
}> {
  return summary.steps.map((step, index) => {
    const previous = index > 0 ? summary.steps[index - 1] : null;

    return {
      stepKey: mapProductTelemetryStepKey(step.eventName, step.outcome) ?? step.stepKey,
      eventCount: step.eventCount,
      previousStepKey: previous?.stepKey ?? null,
      previousEventCount: previous?.eventCount ?? null,
      dropoffCount:
        previous == null ? null : Math.max(previous.eventCount - step.eventCount, 0),
    };
  });
}
