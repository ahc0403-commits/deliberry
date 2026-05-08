"use server";

import { revalidatePath } from "next/cache";
import type { DisputeStatus, PermissionRole } from "../../../shared/domain";
import { DISPUTE_STATUSES } from "../../../shared/domain";
import { createAdminServerSupabaseClient } from "../../../shared/supabase/client";
import { ensureAdminPlatformAccess } from "../../auth/server/access";

const GOVERNED_DISPUTE_ROLES: readonly PermissionRole[] = [
  "platform_admin",
  "operations_admin",
  "support_admin",
];

export type DisputeTransitionActionState = {
  status: "idle" | "success" | "error";
  message: string | null;
  disputeId: string | null;
};

export const INITIAL_DISPUTE_TRANSITION_STATE: DisputeTransitionActionState = {
  status: "idle",
  message: null,
  disputeId: null,
};

function normalizeText(formData: FormData, name: string): string {
  return String(formData.get(name) ?? "").trim();
}

function isDisputeStatus(value: string): value is DisputeStatus {
  return DISPUTE_STATUSES.includes(value as DisputeStatus);
}

function toStatusLabel(status: DisputeStatus) {
  return status.replace("_", " ");
}

export async function transitionDisputeStatusAction(
  _previousState: DisputeTransitionActionState,
  formData: FormData,
): Promise<DisputeTransitionActionState> {
  const access = await ensureAdminPlatformAccess("/disputes");
  const disputeId = normalizeText(formData, "disputeId");
  const nextStatusRaw = normalizeText(formData, "nextStatus");
  const activeRole = access.role;

  if (!disputeId) {
    return {
      status: "error",
      message: "Dispute id is required.",
      disputeId: null,
    };
  }

  if (!isDisputeStatus(nextStatusRaw)) {
    return {
      status: "error",
      message: "Dispute status is invalid.",
      disputeId,
    };
  }

  if (!activeRole || !GOVERNED_DISPUTE_ROLES.includes(activeRole)) {
    return {
      status: "error",
      message: "Your current admin role cannot update disputes.",
      disputeId,
    };
  }

  try {
    const supabase = await createAdminServerSupabaseClient();
    const { data, error } = await supabase.rpc("update_dispute_status_with_audit", {
      p_dispute_id: disputeId,
      p_next_status: nextStatusRaw,
      p_admin_role: activeRole,
    });

    if (error || !data) {
      throw new Error(error?.message ?? "Dispute status update failed.");
    }

    revalidatePath("/disputes");
    revalidatePath("/dashboard");

    return {
      status: "success",
      message: `Case moved to ${toStatusLabel(nextStatusRaw)}.`,
      disputeId,
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "Unable to update dispute status.",
      disputeId,
    };
  }
}
