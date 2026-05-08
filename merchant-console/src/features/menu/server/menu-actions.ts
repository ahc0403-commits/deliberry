"use server";

import { revalidatePath } from "next/cache";

import { ensureMerchantStoreScope } from "../../auth/server/access";
import type { MenuData } from "../../../shared/data/merchant-repository";
import {
  setMerchantMenuItemAvailabilityRuntimeData,
  upsertMerchantMenuItemRuntimeData,
} from "../../../shared/data/merchant-menu-runtime-service";

export type MerchantMenuActionState = {
  status: "idle" | "success" | "error";
  message: string | null;
  data: MenuData | null;
};

function parsePriceCentavos(value: FormDataEntryValue | null): number {
  const raw = String(value ?? "").trim();
  const numeric = Number(raw);
  if (!Number.isFinite(numeric) || numeric < 0) {
    throw new Error("Menu item price must be a non-negative number.");
  }
  return Math.round(numeric * 100);
}

function requireText(formData: FormData, name: string, message: string): string {
  const value = String(formData.get(name) ?? "").trim();
  if (!value) {
    throw new Error(message);
  }
  return value;
}

export async function upsertMerchantMenuItemAction(
  storeId: string,
  _previousState: MerchantMenuActionState,
  formData: FormData,
): Promise<MerchantMenuActionState> {
  const access = await ensureMerchantStoreScope(storeId);
  if (!access.session) {
    return {
      status: "error",
      message: "Merchant session is required before updating menu items.",
      data: null,
    };
  }

  try {
    const imageCandidate = formData.get("image");
    const data = await upsertMerchantMenuItemRuntimeData({
      storeId,
      actorId: access.session.merchantId,
      actorType: access.session.actorType,
      itemId: String(formData.get("itemId") ?? "").trim() || undefined,
      name: requireText(formData, "name", "Item name is required."),
      description: String(formData.get("description") ?? "").trim(),
      category: requireText(formData, "category", "Category is required."),
      priceCentavos: parsePriceCentavos(formData.get("price")),
      isPopular: formData.get("isPopular") === "on",
      isAvailable: formData.get("isAvailable") === "on",
      imageFile: imageCandidate instanceof File ? imageCandidate : null,
    });

    revalidatePath(`/${storeId}/menu`);
    return {
      status: "success",
      message: "Menu item saved.",
      data,
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "Unable to save menu item.",
      data: null,
    };
  }
}

export async function setMerchantMenuItemAvailabilityAction(input: {
  storeId: string;
  itemId: string;
  isAvailable: boolean;
}): Promise<
  | { ok: true; data: MenuData }
  | { ok: false; error: string }
> {
  try {
    const access = await ensureMerchantStoreScope(input.storeId);
    if (!access.session) {
      throw new Error("Merchant session is required before updating availability.");
    }

    const data = await setMerchantMenuItemAvailabilityRuntimeData({
      storeId: input.storeId,
      itemId: input.itemId,
      isAvailable: input.isAvailable,
      actorId: access.session.merchantId,
      actorType: access.session.actorType,
    });
    revalidatePath(`/${input.storeId}/menu`);
    return { ok: true, data };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "Unable to update menu item availability.",
    };
  }
}
