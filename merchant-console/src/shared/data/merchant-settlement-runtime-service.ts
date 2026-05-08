import "server-only";

import { randomUUID } from "node:crypto";

import type { SettlementData } from "./merchant-repository";
import { merchantFixtureFacade } from "./merchant-query-services";
import { supabaseMerchantRuntimeRepository } from "./supabase-merchant-runtime-repository";
import {
  buildMerchantRuntimeEvent,
  buildMerchantRuntimeFailureClass,
  recordMerchantRuntimeObservabilityEvent,
} from "./runtime-observability-service";
import {
  getMerchantRuntimeCompatibility,
  prefersMerchantFixtureSource,
} from "./merchant-runtime-compatibility";

export type MerchantSettlementRuntimeResult = {
  data: SettlementData;
  source: "persisted" | "fixture";
};

export async function getMerchantSettlementRuntimeData(
  storeId: string,
): Promise<MerchantSettlementRuntimeResult> {
  const compatibility = getMerchantRuntimeCompatibility("settlement.read");
  const traceId = randomUUID();
  const startedAt = Date.now();
  try {
    await recordMerchantRuntimeObservabilityEvent(
      buildMerchantRuntimeEvent({
        surface: "merchant-console",
        layer: "service",
        operation: "merchant.settlement.read",
        outcome: "started",
        traceId,
        storeId,
      }),
    );
  } catch {}

  if (prefersMerchantFixtureSource(compatibility)) {
    const data = merchantFixtureFacade.getSettlementData(storeId);
    try {
      await recordMerchantRuntimeObservabilityEvent(
        buildMerchantRuntimeEvent({
          surface: "merchant-console",
          layer: "service",
          operation: "merchant.settlement.read",
          outcome: "succeeded",
          traceId,
          attemptSource: "fixture",
          storeId,
          itemCount: data.records.length,
          durationMs: Date.now() - startedAt,
        }),
      );
    } catch {}

    return {
      data,
      source: "fixture",
    };
  }

  try {
    const data = await supabaseMerchantRuntimeRepository.getSettlementData(storeId);
    try {
      await recordMerchantRuntimeObservabilityEvent(
        buildMerchantRuntimeEvent({
          surface: "merchant-console",
          layer: "service",
          operation: "merchant.settlement.read",
          outcome: "succeeded",
          traceId,
          attemptSource: "persisted",
          storeId,
          itemCount: data.records.length,
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
          operation: "merchant.settlement.read",
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
            resourceType: "MerchantSettlement",
            resourceScope: storeId,
            durationMs: Date.now() - startedAt,
            metadata: {
              triggeringOperation: "merchant.settlement.read",
            },
          }),
        );
      }
    } catch {}
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`merchant.settlement.read failed (${failureClass}): ${message}`);
  }
}
