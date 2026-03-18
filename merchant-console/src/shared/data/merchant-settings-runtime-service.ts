import "server-only";

import { randomUUID } from "node:crypto";

import type { SettingsData } from "./merchant-repository";
import { merchantRepository } from "./merchant-repository";
import { supabaseMerchantRuntimeRepository } from "./supabase-merchant-runtime-repository";
import {
  buildMerchantRuntimeEvent,
  buildMerchantRuntimeFailureClass,
  recordMerchantRuntimeObservabilityEvent,
} from "./runtime-observability-service";

export type MerchantSettingsRuntimeResult = {
  data: SettingsData;
  source: "persisted" | "fallback";
};

export async function getMerchantSettingsRuntimeData(
  storeId: string,
): Promise<MerchantSettingsRuntimeResult> {
  const traceId = randomUUID();
  const startedAt = Date.now();
  try {
    await recordMerchantRuntimeObservabilityEvent(
      buildMerchantRuntimeEvent({
        surface: "merchant-console",
        layer: "service",
        operation: "merchant.settings.read",
        outcome: "started",
        traceId,
        storeId,
      }),
    );
  } catch {}
  try {
    const data = await supabaseMerchantRuntimeRepository.getSettingsData(storeId);
    try {
      await recordMerchantRuntimeObservabilityEvent(
        buildMerchantRuntimeEvent({
          surface: "merchant-console",
          layer: "service",
          operation: "merchant.settings.read",
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
          operation: "merchant.settings.read",
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
            resourceType: "MerchantSettings",
            resourceScope: storeId,
            durationMs: Date.now() - startedAt,
            metadata: {
              triggeringOperation: "merchant.settings.read",
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
            triggeringOperation: "merchant.settings.read",
          },
        }),
      );
    } catch {}
    return {
      data: merchantRepository.getSettingsData(storeId),
      source: "fallback",
    };
  }
}

export async function updateMerchantSettingsRuntimeData(input: {
  storeId: string;
  actorId: string;
  actorType: "merchant_owner" | "merchant_staff";
  toggles: SettingsData["toggles"];
}): Promise<MerchantSettingsRuntimeResult> {
  const traceId = randomUUID();
  const startedAt = Date.now();
  try {
    await recordMerchantRuntimeObservabilityEvent(
      buildMerchantRuntimeEvent({
        surface: "merchant-console",
        layer: "service",
        operation: "merchant.settings.write",
        outcome: "started",
        traceId,
        actorType: input.actorType,
        storeId: input.storeId,
      }),
    );
  } catch {}

  try {
    const data = await supabaseMerchantRuntimeRepository.updateSettingsData(input);
    try {
      await recordMerchantRuntimeObservabilityEvent(
        buildMerchantRuntimeEvent({
          surface: "merchant-console",
          layer: "service",
          operation: "merchant.settings.write",
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
    try {
      await recordMerchantRuntimeObservabilityEvent(
        buildMerchantRuntimeEvent({
          surface: "merchant-console",
          layer: "service",
          operation: "runtime.fallback_activated",
          outcome: "fallback_activated",
          traceId,
          attemptSource: "fallback",
          failureClass: buildMerchantRuntimeFailureClass(error),
          actorType: input.actorType,
          storeId: input.storeId,
          durationMs: Date.now() - startedAt,
          metadata: {
            triggeringOperation: "merchant.settings.write",
          },
        }),
      );
    } catch {}
    return {
      data: merchantRepository.updateSettingsData(input.storeId, input.toggles),
      source: "fallback",
    };
  }
}
