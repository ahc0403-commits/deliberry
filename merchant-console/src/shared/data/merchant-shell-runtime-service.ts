import "server-only";

import { randomUUID } from "node:crypto";

import { merchantFixtureFacade } from "./merchant-query-services";
import {
  buildMerchantRuntimeEvent,
  buildMerchantRuntimeFailureClass,
  recordMerchantRuntimeObservabilityEvent,
} from "./runtime-observability-service";
import { supabaseMerchantRuntimeRepository } from "./supabase-merchant-runtime-repository";
import {
  getMerchantRuntimeCompatibility,
  prefersMerchantFixtureSource,
} from "./merchant-runtime-compatibility";

export type MerchantStoreShellRuntimeResult = {
  data: Awaited<
    ReturnType<typeof supabaseMerchantRuntimeRepository.getStoreShellSnapshot>
  >;
  source: "persisted" | "fixture";
};

export async function getMerchantStoreShellRuntimeData(
  storeId: string,
): Promise<MerchantStoreShellRuntimeResult> {
  const compatibility = getMerchantRuntimeCompatibility("store_shell.read");
  const traceId = randomUUID();
  const startedAt = Date.now();
  try {
    await recordMerchantRuntimeObservabilityEvent(
      buildMerchantRuntimeEvent({
        surface: "merchant-console",
        layer: "service",
        operation: "merchant.store_shell.read",
        outcome: "started",
        traceId,
        storeId,
      }),
    );
  } catch {}

  if (prefersMerchantFixtureSource(compatibility)) {
    const dashboardData = merchantFixtureFacade.getDashboardData(storeId);
    const reviewsData = merchantFixtureFacade.getReviewsData(storeId);
    const data = {
      storeName: dashboardData.store.name,
      activeOrderCount: dashboardData.recentOrders.filter((order) =>
        ["pending", "confirmed", "preparing", "ready", "in_transit"].includes(order.status),
      ).length,
      pendingReviewCount: reviewsData.reviews.filter((review) => !review.responded).length,
    };

    try {
      await recordMerchantRuntimeObservabilityEvent(
        buildMerchantRuntimeEvent({
          surface: "merchant-console",
          layer: "service",
          operation: "merchant.store_shell.read",
          outcome: "succeeded",
          traceId,
          attemptSource: "fixture",
          storeId,
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
    const data = await supabaseMerchantRuntimeRepository.getStoreShellSnapshot(
      storeId,
    );
    try {
      await recordMerchantRuntimeObservabilityEvent(
        buildMerchantRuntimeEvent({
          surface: "merchant-console",
          layer: "service",
          operation: "merchant.store_shell.read",
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
          operation: "merchant.store_shell.read",
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
            resourceType: "MerchantStoreShell",
            resourceScope: storeId,
            durationMs: Date.now() - startedAt,
            metadata: {
              triggeringOperation: "merchant.store_shell.read",
            },
          }),
        );
      }
    } catch {}
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`merchant.store_shell.read failed (${failureClass}): ${message}`);
  }
}
