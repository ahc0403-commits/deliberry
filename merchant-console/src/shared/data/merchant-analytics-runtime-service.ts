import "server-only";

import { randomUUID } from "node:crypto";

import type { AnalyticsData } from "./merchant-repository";
import { supabaseMerchantRuntimeRepository } from "./supabase-merchant-runtime-repository";
import {
  buildMerchantRuntimeEvent,
  buildMerchantRuntimeFailureClass,
  recordMerchantRuntimeObservabilityEvent,
} from "./runtime-observability-service";

export type MerchantAnalyticsRuntimeResult = {
  data: AnalyticsData;
  source: "persisted";
};

export async function getMerchantAnalyticsRuntimeData(
  storeId: string,
): Promise<MerchantAnalyticsRuntimeResult> {
  const traceId = randomUUID();
  const startedAt = Date.now();
  try {
    await recordMerchantRuntimeObservabilityEvent(
      buildMerchantRuntimeEvent({
        surface: "merchant-console",
        layer: "service",
        operation: "merchant.analytics.read",
        outcome: "started",
        traceId,
        storeId,
      }),
    );
  } catch {}

  try {
    const data = await supabaseMerchantRuntimeRepository.getAnalyticsData(storeId);
    try {
      await recordMerchantRuntimeObservabilityEvent(
        buildMerchantRuntimeEvent({
          surface: "merchant-console",
          layer: "service",
          operation: "merchant.analytics.read",
          outcome: "succeeded",
          traceId,
          attemptSource: "persisted",
          storeId,
          itemCount: data.topItems.length,
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
          operation: "merchant.analytics.read",
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
            resourceType: "MerchantAnalytics",
            resourceScope: storeId,
            durationMs: Date.now() - startedAt,
            metadata: {
              triggeringOperation: "merchant.analytics.read",
            },
          }),
        );
      }
    } catch {}

    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`merchant.analytics.read failed (${failureClass}): ${message}`);
  }
}
