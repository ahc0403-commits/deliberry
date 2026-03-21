import "server-only";

import { randomUUID } from "node:crypto";

import type { MerchantReview } from "./merchant-mock-data";
import type { ReviewsData } from "./merchant-repository";
import { supabaseMerchantRuntimeRepository } from "./supabase-merchant-runtime-repository";
import {
  buildMerchantRuntimeEvent,
  buildMerchantRuntimeFailureClass,
  recordMerchantRuntimeObservabilityEvent,
} from "./runtime-observability-service";

export type MerchantReviewsRuntimeResult = {
  data: ReviewsData;
  source: "persisted";
};

export type MerchantReviewReplyRuntimeResult = {
  review: MerchantReview;
  source: "persisted";
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
    } catch {}
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`merchant.reviews.read failed (${failureClass}): ${message}`);
  }
}

export async function replyToMerchantReviewRuntimeData(input: {
  storeId: string;
  reviewId: string;
  actorId: string;
  actorType: "merchant_owner" | "merchant_staff";
  responseText: string;
}): Promise<MerchantReviewReplyRuntimeResult> {
  const traceId = randomUUID();
  const startedAt = Date.now();
  try {
    await recordMerchantRuntimeObservabilityEvent(
      buildMerchantRuntimeEvent({
        surface: "merchant-console",
        layer: "service",
        operation: "merchant.review_reply.write",
        outcome: "started",
        traceId,
        actorType: input.actorType,
        storeId: input.storeId,
      }),
    );
  } catch {}

  try {
    const review = await supabaseMerchantRuntimeRepository.replyToReview(input);
    try {
      await recordMerchantRuntimeObservabilityEvent(
        buildMerchantRuntimeEvent({
          surface: "merchant-console",
          layer: "service",
          operation: "merchant.review_reply.write",
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
      review,
      source: "persisted",
    };
  } catch (error) {
    const failureClass = buildMerchantRuntimeFailureClass(error);
    try {
      await recordMerchantRuntimeObservabilityEvent(
        buildMerchantRuntimeEvent({
          surface: "merchant-console",
          layer: "service",
          operation: "merchant.review_reply.write",
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
    throw new Error(`merchant.review_reply.write failed (${failureClass}): ${message}`);
  }
}
