"use server";

import { revalidatePath } from "next/cache";
import type { PermissionRole } from "../../../shared/domain";
import { createAdminServerSupabaseClient } from "../../../shared/supabase/client";
import { ensureAdminPlatformAccess } from "../../auth/server/access";

const GOVERNED_SETTLEMENT_ROLES: readonly PermissionRole[] = [
  "platform_admin",
  "finance_admin",
];

export type SettlementReceiptActionState = {
  status: "idle" | "success" | "error";
  message: string | null;
  settlementId: string | null;
};

export const INITIAL_SETTLEMENT_RECEIPT_STATE: SettlementReceiptActionState = {
  status: "idle",
  message: null,
  settlementId: null,
};

function normalizeText(formData: FormData, name: string): string {
  return String(formData.get(name) ?? "").trim();
}

export async function acknowledgeSettlementReceivedAction(
  _previousState: SettlementReceiptActionState,
  formData: FormData,
): Promise<SettlementReceiptActionState> {
  const access = await ensureAdminPlatformAccess("/settlements");
  const activeRole = access.role;
  const settlementId = normalizeText(formData, "settlementId");

  if (!settlementId) {
    return { status: "error", message: "Settlement id is required.", settlementId: null };
  }

  if (!activeRole || !GOVERNED_SETTLEMENT_ROLES.includes(activeRole)) {
    return {
      status: "error",
      message: "Your current admin role cannot acknowledge settlements.",
      settlementId,
    };
  }

  try {
    const supabase = await createAdminServerSupabaseClient();
    const { data, error } = await supabase.rpc("acknowledge_settlement_received_with_audit", {
      p_settlement_id: settlementId,
    });

    if (error || !data) {
      throw new Error(error?.message ?? "Settlement acknowledgment failed.");
    }

    revalidatePath("/settlements");
    revalidatePath("/finance");
    revalidatePath("/dashboard");

    return {
      status: "success",
      message: "Settlement was acknowledged as received.",
      settlementId,
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "Unable to acknowledge settlement.",
      settlementId,
    };
  }
}
