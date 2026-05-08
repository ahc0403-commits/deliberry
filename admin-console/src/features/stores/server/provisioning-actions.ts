"use server";

import { randomBytes, randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";

import { ensureAdminPlatformAccess } from "../../auth/server/access";
import { createAdminServiceSupabaseClient } from "../../../shared/supabase/client";

export type ProvisionMerchantStoreActionState = {
  status: "idle" | "success" | "error";
  message: string | null;
  credentials: {
    email: string;
    temporaryPassword: string;
    storeId: string;
  } | null;
};

function requireText(formData: FormData, name: string): string {
  const value = String(formData.get(name) ?? "").trim();
  if (!value) {
    throw new Error(`${name} is required.`);
  }
  return value;
}

function normalizeEmail(value: string): string {
  const email = value.trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    throw new Error("A valid merchant email is required.");
  }
  return email;
}

function slugifyStoreId(name: string): string {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 42);
  return `${slug || "store"}-${randomBytes(3).toString("hex")}`;
}

function buildTemporaryPassword(): string {
  return `Deli-${randomBytes(9).toString("base64url")}!29`;
}

async function ignoreRollbackError(operation: PromiseLike<unknown>) {
  try {
    await operation;
  } catch {
    // Best-effort compensation only. The original provisioning error is returned below.
  }
}

export async function provisionMerchantStoreAction(
  _previousState: ProvisionMerchantStoreActionState,
  formData: FormData,
): Promise<ProvisionMerchantStoreActionState> {
  const access = await ensureAdminPlatformAccess("/stores");
  const supabase = createAdminServiceSupabaseClient();
  let createdUserId: string | null = null;
  let createdStoreId: string | null = null;

  try {
    const merchantName = requireText(formData, "merchantName");
    const ownerName = requireText(formData, "ownerName");
    const storeName = requireText(formData, "storeName");
    const city = requireText(formData, "city");
    const email = normalizeEmail(requireText(formData, "email"));
    const temporaryPassword = buildTemporaryPassword();
    const storeId = slugifyStoreId(storeName);
    createdStoreId = storeId;
    const phone = String(formData.get("phone") ?? "").trim() || null;
    const address = String(formData.get("address") ?? "").trim() || city;
    const cuisineType = String(formData.get("cuisineType") ?? "").trim() || "General";

    const createResult = await supabase.auth.admin.createUser({
      email,
      password: temporaryPassword,
      email_confirm: true,
      user_metadata: {
        surface: "merchant-console",
        actor_type: "merchant_owner",
        display_name: ownerName,
      },
    });

    if (createResult.error || !createResult.data.user) {
      throw new Error(createResult.error?.message ?? "Unable to create merchant auth user.");
    }

    createdUserId = createResult.data.user.id;

    const { error: actorError } = await supabase.from("actor_profiles").insert({
      id: createdUserId,
      actor_type: "merchant_owner",
      display_name: ownerName,
      email,
      phone_number: phone,
    });
    if (actorError) throw new Error(actorError.message);

    const { error: merchantError } = await supabase.from("merchant_profiles").insert({
      user_id: createdUserId,
      merchant_name: merchantName,
      onboarding_complete: true,
    });
    if (merchantError) throw new Error(merchantError.message);

    const { error: storeError } = await supabase.from("stores").insert({
      id: storeId,
      merchant_actor_id: createdUserId,
      name: storeName,
      city,
      address,
      phone,
      email,
      cuisine_type: cuisineType,
      status: "open",
      accepting_orders: false,
      is_open: true,
      rating: 0,
      review_count: 0,
      delivery_radius: "5 km",
      avg_prep_time: "30 min",
      settings_json: {
        auto_accept_orders: false,
        order_notifications: true,
        rush_hour_mode: false,
        allow_special_instructions: true,
        email_reports: true,
        review_alerts: true,
        settlement_notifications: true,
        low_stock_alerts: false,
      },
    });
    if (storeError) throw new Error(storeError.message);

    const { error: membershipError } = await supabase.from("merchant_memberships").insert({
      user_id: createdUserId,
      store_id: storeId,
      role: "merchant_owner",
      is_default: true,
    });
    if (membershipError) throw new Error(membershipError.message);

    const { error: auditError } = await supabase.from("audit_logs").insert({
      id: randomUUID(),
      actor_id: access.session.adminId,
      actor_type: "admin",
      action: "admin_merchant_store_provisioned",
      resource_type: "Store",
      resource_id: storeId,
      timestamp_utc: new Date().toISOString(),
      after_state: {
        merchantUserId: createdUserId,
        merchantName,
        ownerName,
        email,
        storeId,
        storeName,
      },
    });
    if (auditError) throw new Error(auditError.message);

    revalidatePath("/stores");
    revalidatePath("/merchants");
    revalidatePath("/users");
    revalidatePath("/dashboard");

    return {
      status: "success",
      message: "Merchant account and store were provisioned. Share the credentials below once, then ask the merchant to rotate the password.",
      credentials: {
        email,
        temporaryPassword,
        storeId,
      },
    };
  } catch (error) {
    if (createdUserId) {
      if (createdStoreId) {
        await ignoreRollbackError(supabase
          .from("merchant_memberships")
          .delete()
          .eq("user_id", createdUserId)
          .eq("store_id", createdStoreId));
        await ignoreRollbackError(supabase
          .from("stores")
          .delete()
          .eq("id", createdStoreId));
      }
      await ignoreRollbackError(supabase
        .from("merchant_profiles")
        .delete()
        .eq("user_id", createdUserId));
      await ignoreRollbackError(supabase
        .from("actor_profiles")
        .delete()
        .eq("id", createdUserId));
      await supabase.auth.admin.deleteUser(createdUserId).catch(() => undefined);
    }

    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "Unable to provision merchant store.",
      credentials: null,
    };
  }
}
