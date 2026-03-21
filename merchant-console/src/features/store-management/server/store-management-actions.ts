"use server";

import { revalidatePath } from "next/cache";

import { ensureMerchantStoreScope } from "../../auth/server/access";
import {
  buildMerchantProductTelemetryEvent,
  recordMerchantProductTelemetryEvent,
} from "../../../shared/data/product-telemetry-service";
import { updateMerchantStoreManagementRuntimeData } from "../../../shared/data/merchant-store-runtime-service";
import type { StoreManagementData } from "../../../shared/data/merchant-repository";

export type MerchantStoreManagementActionState = {
  status: "idle" | "success" | "error";
  message: string | null;
  data: StoreManagementData | null;
};

export async function updateMerchantStoreManagementAction(
  storeId: string,
  _previousState: MerchantStoreManagementActionState,
  formData: FormData,
): Promise<MerchantStoreManagementActionState> {
  const access = await ensureMerchantStoreScope(storeId);
  if (!access.session) {
    return {
      status: "error",
      message: "Merchant session is required before updating store profile.",
      data: null,
    };
  }
  try {
    await recordMerchantProductTelemetryEvent(
      buildMerchantProductTelemetryEvent({
        surface: "merchant-console",
        eventName: "merchant.store_profile_write",
        outcome: "attempted",
        sessionMode: "merchant_session",
        actorType: access.session.actorType,
        storeId,
        source: "persisted",
      }),
    );
  } catch {}

  const hourDays = formData.getAll("hoursDay").map(String);
  const hourOpens = formData.getAll("hoursOpen").map(String);
  const hourCloses = formData.getAll("hoursClose").map(String);

  try {
    const result = await updateMerchantStoreManagementRuntimeData({
      storeId,
      actorId: access.session.merchantId,
      actorType: access.session.actorType,
      store: {
        id: storeId,
        name: String(formData.get("name") ?? ""),
        cuisineType: String(formData.get("cuisineType") ?? ""),
        phone: String(formData.get("phone") ?? ""),
        email: String(formData.get("email") ?? ""),
        address: String(formData.get("address") ?? ""),
        rating: Number(formData.get("rating") ?? 0),
        reviewCount: Number(formData.get("reviewCount") ?? 0),
        status: String(formData.get("status") ?? "open") as
          | "open"
          | "closed"
          | "paused",
        deliveryRadius: String(formData.get("deliveryRadius") ?? ""),
        avgPrepTime: String(formData.get("avgPrepTime") ?? ""),
        acceptingOrders: formData.get("acceptingOrders") === "on",
        hours: hourDays.map((day, index) => ({
          day,
          open: hourOpens[index] ?? "",
          close: hourCloses[index] ?? "",
        })),
      },
    });
    try {
      await recordMerchantProductTelemetryEvent(
        buildMerchantProductTelemetryEvent({
          surface: "merchant-console",
          eventName: "merchant.store_profile_write",
          outcome: "succeeded",
          sessionMode: "merchant_session",
          actorType: access.session.actorType,
          storeId,
          source: result.source,
        }),
      );
    } catch {}

    revalidatePath(`/${storeId}/store`);
    revalidatePath(`/${storeId}`, "layout");
    return {
      status: "success",
      message: "Store profile saved.",
      data: result.data,
    };
  } catch (error) {
    try {
      await recordMerchantProductTelemetryEvent(
        buildMerchantProductTelemetryEvent({
          surface: "merchant-console",
          eventName: "merchant.store_profile_write",
          outcome: "failed",
          sessionMode: "merchant_session",
          actorType: access.session.actorType,
          storeId,
          source: "persisted",
          metadata: {
            failureClass: "store_profile_write_failed",
          },
        }),
      );
    } catch {}
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "Unable to update store profile.",
      data: null,
    };
  }
}
