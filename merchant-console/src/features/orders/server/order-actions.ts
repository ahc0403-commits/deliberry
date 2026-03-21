"use server";

import type { MerchantOrder } from "../../../shared/data/merchant-mock-data";
import type { OrdersData } from "../../../shared/data/merchant-repository";
import { ensureMerchantStoreScope } from "../../auth/server/access";
import {
  buildMerchantProductTelemetryEvent,
  recordMerchantProductTelemetryEvent,
} from "../../../shared/data/product-telemetry-service";
import { updateMerchantOrderRuntimeStatus } from "../../../shared/data/merchant-order-runtime-service";
import { supabaseMerchantRuntimeRepository } from "../../../shared/data/supabase-merchant-runtime-repository";

export async function updateMerchantOrderStatusAction(input: {
  storeId: string;
  orderId: string;
  status: "confirmed" | "preparing" | "ready" | "in_transit" | "cancelled";
}): Promise<
  | {
      ok: true;
      order: MerchantOrder;
      source: "persisted" | "fallback";
    }
  | {
      ok: false;
      error: string;
    }
> {
  try {
    const access = await ensureMerchantStoreScope(input.storeId);
    if (!access.session) {
      throw new Error("Merchant session is required before updating an order.");
    }
    try {
      await recordMerchantProductTelemetryEvent(
        buildMerchantProductTelemetryEvent({
          surface: "merchant-console",
          eventName: "merchant.order_status_update",
          outcome: "attempted",
          sessionMode: "merchant_session",
          actorType: access.session.actorType,
          storeId: input.storeId,
          orderId: input.orderId,
          source: "persisted",
          metadata: {
            nextStatus: input.status,
          },
        }),
      );
    } catch {}
    const result = await updateMerchantOrderRuntimeStatus({
      storeId: input.storeId,
      orderId: input.orderId,
      status: input.status,
      actorId: access.session.merchantId,
      actorType: access.session.actorType,
    });

    try {
      await recordMerchantProductTelemetryEvent(
        buildMerchantProductTelemetryEvent({
          surface: "merchant-console",
          eventName: "merchant.order_status_update",
          outcome: "succeeded",
          sessionMode: "merchant_session",
          actorType: access.session.actorType,
          storeId: input.storeId,
          orderId: input.orderId,
          source: result.source,
          metadata: {
            nextStatus: input.status,
          },
        }),
      );
    } catch {}

    return {
      ok: true,
      order: result.order,
      source: result.source,
    };
  } catch (error) {
    try {
      await recordMerchantProductTelemetryEvent(
        buildMerchantProductTelemetryEvent({
          surface: "merchant-console",
          eventName: "merchant.order_status_update",
          outcome: "failed",
          sessionMode: "merchant_session",
          actorType: "merchant_owner",
          storeId: input.storeId,
          orderId: input.orderId,
          source: "persisted",
          metadata: {
            nextStatus: input.status,
            failureClass: "status_update_failed",
          },
        }),
      );
    } catch {}
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "Unable to update merchant order status.",
    };
  }
}

export async function loadMoreMerchantOrdersAction(input: {
  storeId: string;
  cursorCreatedAt: string;
  cursorId: string;
}): Promise<
  | { ok: true; orders: MerchantOrder[]; hasMore: boolean }
  | { ok: false; error: string }
> {
  const PAGE_SIZE = 50;
  try {
    await ensureMerchantStoreScope(input.storeId);
    const data = await supabaseMerchantRuntimeRepository.getOrdersData({
      storeId: input.storeId,
      limit: PAGE_SIZE,
      cursor: { createdAt: input.cursorCreatedAt, id: input.cursorId },
    });
    return {
      ok: true,
      orders: data.orders,
      hasMore: data.orders.length >= PAGE_SIZE,
    };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "Unable to load more orders.",
    };
  }
}
