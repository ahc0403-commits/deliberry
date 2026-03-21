import "server-only";

import { randomUUID } from "node:crypto";

import type { StoreManagementData } from "./merchant-repository";
import { supabaseMerchantRuntimeRepository } from "./supabase-merchant-runtime-repository";
import {
  buildMerchantRuntimeEvent,
  buildMerchantRuntimeFailureClass,
  recordMerchantRuntimeObservabilityEvent,
} from "./runtime-observability-service";

export type MerchantStoreRuntimeResult = {
  data: StoreManagementData;
  source: "persisted";
};

export async function getMerchantStoreManagementRuntimeData(
  storeId: string,
): Promise<MerchantStoreRuntimeResult> {
  const traceId = randomUUID();
  const startedAt = Date.now();
  try {
    await recordMerchantRuntimeObservabilityEvent(
      buildMerchantRuntimeEvent({
        surface: "merchant-console",
        layer: "service",
        operation: "merchant.store_profile.read",
        outcome: "started",
        traceId,
        storeId,
      }),
    );
  } catch {}
  try {
    const data = await supabaseMerchantRuntimeRepository.getStoreManagementData(
      storeId,
    );
    try {
      await recordMerchantRuntimeObservabilityEvent(
        buildMerchantRuntimeEvent({
          surface: "merchant-console",
          layer: "service",
          operation: "merchant.store_profile.read",
          outcome: "succeeded",
          traceId,
          attemptSource: "persisted",
          storeId,
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
          operation: "merchant.store_profile.read",
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
            resourceType: "MerchantStoreProfile",
            resourceScope: storeId,
            durationMs: Date.now() - startedAt,
            metadata: {
              triggeringOperation: "merchant.store_profile.read",
            },
          }),
        );
      }
    } catch {}
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`merchant.store_profile.read failed (${failureClass}): ${message}`);
  }
}

export async function updateMerchantStoreManagementRuntimeData(input: {
  storeId: string;
  actorId: string;
  actorType: "merchant_owner" | "merchant_staff";
  store: StoreManagementData["store"];
}): Promise<MerchantStoreRuntimeResult> {
  const traceId = randomUUID();
  const startedAt = Date.now();
  try {
    await recordMerchantRuntimeObservabilityEvent(
      buildMerchantRuntimeEvent({
        surface: "merchant-console",
        layer: "service",
        operation: "merchant.store_profile.write",
        outcome: "started",
        traceId,
        actorType: input.actorType,
        storeId: input.storeId,
      }),
    );
  } catch {}

  try {
    const data =
      await supabaseMerchantRuntimeRepository.updateStoreManagementData(input);
    try {
      await recordMerchantRuntimeObservabilityEvent(
        buildMerchantRuntimeEvent({
          surface: "merchant-console",
          layer: "service",
          operation: "merchant.store_profile.write",
          outcome: "succeeded",
          traceId,
          attemptSource: "persisted",
          actorType: input.actorType,
          storeId: input.storeId,
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
          operation: "merchant.store_profile.write",
          outcome: "failed",
          traceId,
          attemptSource: "persisted",
          failureClass,
          actorType: input.actorType,
          storeId: input.storeId,
          durationMs: Date.now() - startedAt,
        }),
      );
    } catch {}
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`merchant.store_profile.write failed (${failureClass}): ${message}`);
  }
}
