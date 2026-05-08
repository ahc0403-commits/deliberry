import "server-only";

import { randomUUID } from "node:crypto";

import type { MenuData } from "./merchant-repository";
import { createMerchantServiceSupabaseClient } from "../supabase/client";
import { supabaseMerchantRuntimeRepository } from "./supabase-merchant-runtime-repository";

const MENU_IMAGE_BUCKET = "menu-item-images";
const MAX_MENU_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_MENU_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function getMerchantMenuRuntimeData(storeId: string): Promise<{
  data: MenuData;
  source: "persisted";
}> {
  return {
    data: await supabaseMerchantRuntimeRepository.getMenuData(storeId),
    source: "persisted",
  };
}

export async function upsertMerchantMenuItemRuntimeData(input: {
  storeId: string;
  actorId: string;
  actorType: "merchant_owner" | "merchant_staff";
  itemId?: string;
  name: string;
  description: string;
  category: string;
  priceCentavos: number;
  isPopular: boolean;
  isAvailable: boolean;
  imageFile?: File | null;
}): Promise<MenuData> {
  const supabase = createMerchantServiceSupabaseClient();
  const itemId = input.itemId?.trim() || `menu_${randomUUID()}`;
  const existingResult = input.itemId
    ? await supabase
        .from("store_menu_items")
        .select("*")
        .eq("id", input.itemId)
        .eq("store_id", input.storeId)
        .maybeSingle()
    : { data: null, error: null };

  if (existingResult.error) {
    throw new Error(existingResult.error.message);
  }

  let imageStoragePath =
    (existingResult.data as { image_storage_path?: string | null } | null)?.image_storage_path ??
    null;

  if (input.imageFile && input.imageFile.size > 0) {
    if (!ALLOWED_MENU_IMAGE_TYPES.has(input.imageFile.type)) {
      throw new Error("Menu images must be JPEG, PNG, or WebP.");
    }
    if (input.imageFile.size > MAX_MENU_IMAGE_BYTES) {
      throw new Error("Menu images must be 5MB or smaller.");
    }

    const extension = input.imageFile.type === "image/png"
      ? "png"
      : input.imageFile.type === "image/webp"
        ? "webp"
        : "jpg";
    imageStoragePath = `${input.storeId}/${itemId}/${randomUUID()}.${extension}`;
    const uploadResult = await supabase.storage
      .from(MENU_IMAGE_BUCKET)
      .upload(imageStoragePath, input.imageFile, {
        cacheControl: "31536000",
        contentType: input.imageFile.type,
        upsert: true,
      });

    if (uploadResult.error) {
      throw new Error(uploadResult.error.message);
    }
  }

  const beforeState = existingResult.data ?? null;
  const payload = {
    id: itemId,
    store_id: input.storeId,
    name: input.name,
    description: input.description,
    category: input.category,
    price_centavos: input.priceCentavos,
    image_storage_path: imageStoragePath,
    is_popular: input.isPopular,
    is_available: input.isAvailable,
  };

  const { error } = await supabase
    .from("store_menu_items")
    .upsert(payload, { onConflict: "id" });

  if (error) {
    throw new Error(error.message);
  }

  const { error: auditError } = await supabase.from("audit_logs").insert({
    id: randomUUID(),
    actor_id: input.actorId,
    actor_type: input.actorType,
    action: beforeState ? "merchant_menu_item_updated" : "merchant_menu_item_created",
    resource_type: "Store",
    resource_id: input.storeId,
    timestamp_utc: new Date().toISOString(),
    before_state: beforeState,
    after_state: payload,
  });
  if (auditError) {
    throw new Error(auditError.message);
  }

  return supabaseMerchantRuntimeRepository.getMenuData(input.storeId);
}

export async function setMerchantMenuItemAvailabilityRuntimeData(input: {
  storeId: string;
  actorId: string;
  actorType: "merchant_owner" | "merchant_staff";
  itemId: string;
  isAvailable: boolean;
}): Promise<MenuData> {
  const supabase = createMerchantServiceSupabaseClient();
  const { data: beforeState, error: readError } = await supabase
    .from("store_menu_items")
    .select("*")
    .eq("id", input.itemId)
    .eq("store_id", input.storeId)
    .maybeSingle();

  if (readError) {
    throw new Error(readError.message);
  }
  if (!beforeState) {
    throw new Error("Menu item was not found in this store scope.");
  }

  const { data: afterState, error: updateError } = await supabase
    .from("store_menu_items")
    .update({ is_available: input.isAvailable })
    .eq("id", input.itemId)
    .eq("store_id", input.storeId)
    .select("*")
    .single();

  if (updateError) {
    throw new Error(updateError.message);
  }

  const { error: auditError } = await supabase.from("audit_logs").insert({
    id: randomUUID(),
    actor_id: input.actorId,
    actor_type: input.actorType,
    action: "merchant_menu_item_availability_updated",
    resource_type: "Store",
    resource_id: input.storeId,
    timestamp_utc: new Date().toISOString(),
    before_state: beforeState,
    after_state: afterState,
  });
  if (auditError) {
    throw new Error(auditError.message);
  }

  return supabaseMerchantRuntimeRepository.getMenuData(input.storeId);
}
