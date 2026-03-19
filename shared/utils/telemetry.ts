/**
 * Product telemetry builder utilities.
 * Factory functions for constructing telemetry events and mapping step keys.
 */

import type {
  ProductTelemetryEvent,
  ProductTelemetryOutcome,
} from "../types/telemetry.types";

/**
 * Build a complete ProductTelemetryEvent from partial input.
 * Automatically sets audience based on surface and stamps occurredAtUtc.
 */
export function buildProductTelemetryEvent(
  input: Omit<ProductTelemetryEvent, "audience" | "occurredAtUtc">,
): ProductTelemetryEvent {
  const audience =
    input.surface === "customer-app"
      ? "customer"
      : input.surface === "merchant-console"
        ? "merchant"
        : "admin";

  return {
    ...input,
    audience,
    occurredAtUtc: new Date().toISOString(),
  };
}

/**
 * Map a raw event name + outcome pair to a human-readable funnel step key.
 * Returns null if no mapping exists.
 */
const STEP_KEY_MAP: Record<string, Record<string, string>> = {
  "customer.browse_menu": { success: "menu_viewed" },
  "customer.add_to_cart": { success: "item_added" },
  "customer.checkout_started": { success: "checkout_started" },
  "customer.order_placed": { success: "order_placed" },
  "customer.order_delivered": { success: "order_delivered" },
  "merchant.orders_viewed": { success: "orders_viewed" },
  "merchant.order_status_update": { success: "order_updated" },
  "merchant.onboarding_started": { success: "onboarding_started" },
  "merchant.onboarding_completed": { success: "onboarding_completed" },
};

export function mapProductTelemetryStepKey(
  eventName: string,
  outcome: string,
): string | null {
  return STEP_KEY_MAP[eventName]?.[outcome] ?? null;
}
