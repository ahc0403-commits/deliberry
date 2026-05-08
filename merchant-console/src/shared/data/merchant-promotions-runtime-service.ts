import "server-only";

import { randomUUID } from "node:crypto";

import type { PromotionsData } from "./merchant-repository";
import { merchantFixtureFacade } from "./merchant-query-services";
import { mockStore } from "./merchant-mock-data";
import { supabaseMerchantRuntimeRepository } from "./supabase-merchant-runtime-repository";
import {
  buildMerchantRuntimeEvent,
  buildMerchantRuntimeFailureClass,
  recordMerchantRuntimeObservabilityEvent,
} from "./runtime-observability-service";

export type MerchantPromotionsRuntimeResult = {
  data: PromotionsData;
  source: "snapshot";
};

export async function getMerchantPromotionsRuntimeData(
  storeId: string,
): Promise<MerchantPromotionsRuntimeResult> {
  const traceId = randomUUID();
  const startedAt = Date.now();
  try {
    await recordMerchantRuntimeObservabilityEvent(
      buildMerchantRuntimeEvent({
        surface: "merchant-console",
        layer: "service",
        operation: "merchant.promotions.read",
        outcome: "started",
        traceId,
        storeId,
      }),
    );
  } catch {}

  try {
    const [storeData, snapshotData] = await Promise.all([
      supabaseMerchantRuntimeRepository.getStoreManagementData(storeId),
      Promise.resolve(merchantFixtureFacade.getPromotionsData(mockStore.id)),
    ]);

    const data: PromotionsData = {
      promotions: snapshotData.promotions,
      store: storeData.store,
    };

    try {
      await recordMerchantRuntimeObservabilityEvent(
        buildMerchantRuntimeEvent({
          surface: "merchant-console",
          layer: "service",
          operation: "merchant.promotions.read",
          outcome: "succeeded",
          traceId,
          attemptSource: "fallback",
          storeId,
          itemCount: data.promotions.length,
          durationMs: Date.now() - startedAt,
        }),
      );
    } catch {}

    return {
      data,
      source: "snapshot",
    };
  } catch (error) {
    const failureClass = buildMerchantRuntimeFailureClass(error);
    try {
      await recordMerchantRuntimeObservabilityEvent(
        buildMerchantRuntimeEvent({
          surface: "merchant-console",
          layer: "service",
          operation: "merchant.promotions.read",
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
            resourceType: "MerchantPromotions",
            resourceScope: storeId,
            durationMs: Date.now() - startedAt,
            metadata: {
              triggeringOperation: "merchant.promotions.read",
            },
          }),
        );
      }
    } catch {}

    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`merchant.promotions.read failed (${failureClass}): ${message}`);
  }
}
