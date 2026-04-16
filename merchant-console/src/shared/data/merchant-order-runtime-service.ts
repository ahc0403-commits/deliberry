import "server-only";

import { randomUUID } from "node:crypto";

import type { MerchantOrder } from "./merchant-mock-data";
import type { DashboardData, OrdersData } from "./merchant-repository";
import { merchantRepository } from "./merchant-repository";
import {
  buildMerchantRuntimeEvent,
  buildMerchantRuntimeFailureClass,
  recordMerchantRuntimeObservabilityEvent,
} from "./runtime-observability-service";
import { supabaseMerchantRuntimeRepository } from "./supabase-merchant-runtime-repository";

export type MerchantDashboardRuntimeResult = {
  data: DashboardData;
  source: "persisted" | "fallback";
};

export type MerchantOrdersRuntimeResult = {
  data: OrdersData;
  source: "persisted";
};

export async function getMerchantDashboardRuntimeData(
  storeId: string,
): Promise<MerchantDashboardRuntimeResult> {
  const traceId = randomUUID();
  const startedAt = Date.now();
  try {
    await recordMerchantRuntimeObservabilityEvent(
      buildMerchantRuntimeEvent({
        surface: "merchant-console",
        layer: "service",
        operation: "merchant.dashboard.read",
        outcome: "started",
        traceId,
        storeId,
      }),
    );
  } catch {}
  try {
    const data = await supabaseMerchantRuntimeRepository.getDashboardData(storeId);
    try {
      await recordMerchantRuntimeObservabilityEvent(
        buildMerchantRuntimeEvent({
          surface: "merchant-console",
          layer: "service",
          operation: "merchant.dashboard.read",
          outcome: "succeeded",
          traceId,
          attemptSource: "persisted",
          storeId,
          itemCount: data.recentOrders.length,
          durationMs: Date.now() - startedAt,
        }),
      );
    } catch {}
    return {
      data,
      source: "persisted",
    };
  } catch (error) {
    const failureClass = buildMerchantRuntimeFailureClass(error);
    try {
      await recordMerchantRuntimeObservabilityEvent(
        buildMerchantRuntimeEvent({
          surface: "merchant-console",
          layer: "service",
          operation: "merchant.dashboard.read",
          outcome: "failed",
          traceId,
          attemptSource: "persisted",
          failureClass,
          storeId,
          durationMs: Date.now() - startedAt,
        }),
      );
      if (
        failureClass === "auth_missing" ||
        failureClass === "rls_denied" ||
        failureClass === "membership_denied"
      ) {
        await recordMerchantRuntimeObservabilityEvent(
          buildMerchantRuntimeEvent({
            surface: "merchant-console",
            layer: "service",
            operation: "runtime.access_denied",
            outcome: "failed",
            traceId,
            attemptSource: "persisted",
            failureClass,
            storeId,
            resourceType: "MerchantDashboard",
            resourceScope: storeId,
            durationMs: Date.now() - startedAt,
            metadata: {
              triggeringOperation: "merchant.dashboard.read",
            },
          }),
        );
      }
      await recordMerchantRuntimeObservabilityEvent(
        buildMerchantRuntimeEvent({
          surface: "merchant-console",
          layer: "service",
          operation: "runtime.fallback_activated",
          outcome: "fallback_activated",
          traceId,
          attemptSource: "fallback",
          failureClass,
          storeId,
          durationMs: Date.now() - startedAt,
          metadata: {
            triggeringOperation: "merchant.dashboard.read",
          },
        }),
      );
    } catch {}
    return {
      data: merchantRepository.getDashboardData(storeId),
      source: "fallback",
    };
  }
}

export async function getMerchantOrdersRuntimeData(
  storeId: string,
): Promise<MerchantOrdersRuntimeResult> {
  const defaultStatuses: MerchantOrder["status"][] = [
    "pending",
    "confirmed",
    "preparing",
    "ready",
    "in_transit",
    "delivered",
    "cancelled",
    "disputed",
  ];
  const traceId = randomUUID();
  const startedAt = Date.now();
  try {
    await recordMerchantRuntimeObservabilityEvent(
      buildMerchantRuntimeEvent({
        surface: "merchant-console",
        layer: "service",
        operation: "merchant.orders.read",
        outcome: "started",
        traceId,
        storeId,
      }),
    );
  } catch {}
  try {
    const data = await supabaseMerchantRuntimeRepository.getOrdersData({
      storeId,
      limit: 50,
      statuses: defaultStatuses,
    });
    try {
      await recordMerchantRuntimeObservabilityEvent(
        buildMerchantRuntimeEvent({
          surface: "merchant-console",
          layer: "service",
          operation: "merchant.orders.read",
          outcome: "succeeded",
          traceId,
          attemptSource: "persisted",
          storeId,
          itemCount: data.orders.length,
          durationMs: Date.now() - startedAt,
        }),
      );
    } catch {}
    return {
      data,
      source: "persisted",
    };
  } catch (error) {
    const failureClass = buildMerchantRuntimeFailureClass(error);
    try {
      await recordMerchantRuntimeObservabilityEvent(
        buildMerchantRuntimeEvent({
          surface: "merchant-console",
          layer: "service",
          operation: "merchant.orders.read",
          outcome: "failed",
          traceId,
          attemptSource: "persisted",
          failureClass,
          storeId,
          durationMs: Date.now() - startedAt,
        }),
      );
      if (
        failureClass === "auth_missing" ||
        failureClass === "rls_denied" ||
        failureClass === "membership_denied"
      ) {
        await recordMerchantRuntimeObservabilityEvent(
          buildMerchantRuntimeEvent({
            surface: "merchant-console",
            layer: "service",
            operation: "runtime.access_denied",
            outcome: "failed",
            traceId,
            attemptSource: "persisted",
            failureClass,
            storeId,
            resourceType: "MerchantOrders",
            resourceScope: storeId,
            durationMs: Date.now() - startedAt,
            metadata: {
              triggeringOperation: "merchant.orders.read",
            },
          }),
        );
      }
    } catch {}
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`merchant.orders.read failed (${failureClass}): ${message}`);
  }
}

export async function updateMerchantOrderRuntimeStatus(input: {
  storeId: string;
  orderId: string;
  status: MerchantOrder["status"];
  idempotencyKey: string;
  actorId: string;
  actorType: "merchant_owner" | "merchant_staff";
}): Promise<{ order: MerchantOrder; source: "persisted" }> {
  const traceId = randomUUID();
  const startedAt = Date.now();
  try {
    await recordMerchantRuntimeObservabilityEvent(
      buildMerchantRuntimeEvent({
        surface: "merchant-console",
        layer: "service",
        operation: "merchant.order.status_update",
        outcome: "started",
        traceId,
        attemptSource: "persisted",
        actorType: input.actorType,
        storeId: input.storeId,
        orderId: input.orderId,
        toStatus: input.status,
      }),
    );
  } catch {}

  try {
    const order = await supabaseMerchantRuntimeRepository.updateOrderStatus({
      ...input,
      traceId,
    });
    try {
      await recordMerchantRuntimeObservabilityEvent(
        buildMerchantRuntimeEvent({
          surface: "merchant-console",
          layer: "service",
          operation: "merchant.order.status_update",
          outcome: "succeeded",
          traceId,
          attemptSource: "persisted",
          actorType: input.actorType,
          storeId: input.storeId,
          orderId: input.orderId,
          toStatus: input.status,
          durationMs: Date.now() - startedAt,
        }),
      );
    } catch {}
    return {
      order,
      source: "persisted",
    };
  } catch (error) {
    const failureClass = buildMerchantRuntimeFailureClass(error);
    try {
      await recordMerchantRuntimeObservabilityEvent(
        buildMerchantRuntimeEvent({
          surface: "merchant-console",
          layer: "service",
          operation: "merchant.order.status_update",
          outcome: "failed",
          traceId,
          attemptSource: "persisted",
          failureClass,
          actorType: input.actorType,
          storeId: input.storeId,
          orderId: input.orderId,
          toStatus: input.status,
          durationMs: Date.now() - startedAt,
        }),
      );
    } catch {}
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`merchant.order.status_update failed (${failureClass}): ${message}`);
  }
}
