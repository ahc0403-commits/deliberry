"use server";

import { revalidatePath } from "next/cache";

import { ensureMerchantStoreScope } from "../../auth/server/access";
import {
  buildMerchantProductTelemetryEvent,
  recordMerchantProductTelemetryEvent,
} from "../../../shared/data/product-telemetry-service";
import { updateMerchantSettingsRuntimeData } from "../../../shared/data/merchant-settings-runtime-service";
import type { SettingsData } from "../../../shared/data/merchant-repository";

export type MerchantSettingsActionState = {
  status: "idle" | "success" | "error";
  message: string | null;
  data: SettingsData | null;
};

export async function updateMerchantSettingsAction(
  storeId: string,
  _previousState: MerchantSettingsActionState,
  formData: FormData,
): Promise<MerchantSettingsActionState> {
  const access = await ensureMerchantStoreScope(storeId);
  if (!access.session) {
    return {
      status: "error",
      message: "Merchant session is required before updating settings.",
      data: null,
    };
  }

  try {
    await recordMerchantProductTelemetryEvent(
      buildMerchantProductTelemetryEvent({
        surface: "merchant-console",
        eventName: "merchant.settings_write",
        outcome: "attempted",
        sessionMode: "merchant_session",
        actorType: access.session.actorType,
        storeId,
        source: "persisted",
      }),
    );
  } catch {}

  try {
    const result = await updateMerchantSettingsRuntimeData({
      storeId,
      actorId: access.session.merchantId,
      actorType: access.session.actorType,
      toggles: {
        autoAcceptOrders: formData.get("autoAcceptOrders") === "on",
        orderNotifications: formData.get("orderNotifications") === "on",
        rushHourMode: formData.get("rushHourMode") === "on",
        allowSpecialInstructions:
          formData.get("allowSpecialInstructions") === "on",
        emailReports: formData.get("emailReports") === "on",
        reviewAlerts: formData.get("reviewAlerts") === "on",
        settlementNotifications:
          formData.get("settlementNotifications") === "on",
        lowStockAlerts: formData.get("lowStockAlerts") === "on",
      },
    });
    try {
      await recordMerchantProductTelemetryEvent(
        buildMerchantProductTelemetryEvent({
          surface: "merchant-console",
          eventName: "merchant.settings_write",
          outcome: "succeeded",
          sessionMode: "merchant_session",
          actorType: access.session.actorType,
          storeId,
          source: result.source,
        }),
      );
    } catch {}

    revalidatePath(`/${storeId}/settings`);
    return {
      status: "success",
      message: "Store settings saved.",
      data: result.data,
    };
  } catch (error) {
    try {
      await recordMerchantProductTelemetryEvent(
        buildMerchantProductTelemetryEvent({
          surface: "merchant-console",
          eventName: "merchant.settings_write",
          outcome: "failed",
          sessionMode: "merchant_session",
          actorType: access.session.actorType,
          storeId,
          source: "persisted",
          metadata: {
            failureClass: "settings_write_failed",
          },
        }),
      );
    } catch {}
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "Unable to update merchant settings.",
      data: null,
    };
  }
}
