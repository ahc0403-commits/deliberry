import "server-only";

import { randomUUID } from "node:crypto";

import type { ReviewsData } from "./merchant-repository";
import { merchantRepository } from "./merchant-repository";
import { supabaseMerchantRuntimeRepository } from "./supabase-merchant-runtime-repository";
import {
  buildMerchantRuntimeEvent,
  buildMerchantRuntimeFailureClass,
  recordMerchantRuntimeObservabilityEvent,
} from "./runtime-observability-service";

export type MerchantReviewsRuntimeResult = {
  data: ReviewsData;
  source: "persisted" | "fallback";
};

export async function getMerchantReviewsRuntimeData(
  storeId: string,
): Promise<MerchantReviewsRuntimeResult> {
  const traceId = randomUUID();
  const startedAt = Date.now();
  try {
    await recordMerchantRuntimeObservabilityEvent(
      buildMerchantRuntimeEvent({
        surface: "merchant-console",
        layer: "service",
        operation: "merchant.reviews.read",
        outcome: "started",
        traceId,
        storeId,
      }),
    );
  } catch {}
  try {
    const data = await supabaseMerchantRuntimeRepository.getReviewsData({
      storeId,
      limit: 25,
    });
    try {
      await recordMerchantRuntimeObservabilityEvent(
        buildMerchantRuntimeEvent({
          surface: "merchant-console",
          layer: "service",
          operation: "merchant.reviews.read",
          outcome: "succeeded",
          traceId,
          attemptSource: "persisted",
          storeId,
          itemCount: data.reviews.length,
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
          operation: "merchant.reviews.read",
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
            resourceType: "MerchantReviews",
            resourceScope: storeId,
            durationMs: Date.now() - startedAt,
            metadata: {
              triggeringOperation: "merchant.reviews.read",
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
            triggeringOperation: "merchant.reviews.read",
          },
        }),
      );
    } catch {}
    return {
      data: merchantRepository.getReviewsData(storeId),
      source: "fallback",
    };
  }
}
