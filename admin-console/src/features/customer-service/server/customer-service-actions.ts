"use server";

import { revalidatePath } from "next/cache";
import type { PermissionRole, SupportTicketStatus } from "../../../shared/domain";
import { SUPPORT_TICKET_STATUSES } from "../../../shared/domain";
import { createAdminServerSupabaseClient } from "../../../shared/supabase/client";
import { ensureAdminPlatformAccess } from "../../auth/server/access";

const GOVERNED_SUPPORT_ROLES: readonly PermissionRole[] = [
  "platform_admin",
  "operations_admin",
  "support_admin",
];

export type SupportTicketTransitionActionState = {
  status: "idle" | "success" | "error";
  message: string | null;
  ticketId: string | null;
};

export const INITIAL_SUPPORT_TICKET_TRANSITION_STATE: SupportTicketTransitionActionState = {
  status: "idle",
  message: null,
  ticketId: null,
};

function normalizeText(formData: FormData, name: string): string {
  return String(formData.get(name) ?? "").trim();
}

function isSupportTicketStatus(value: string): value is SupportTicketStatus {
  return SUPPORT_TICKET_STATUSES.includes(value as SupportTicketStatus);
}

function toStatusLabel(status: SupportTicketStatus) {
  return status.replace("_", " ");
}

export async function transitionSupportTicketStatusAction(
  _previousState: SupportTicketTransitionActionState,
  formData: FormData,
): Promise<SupportTicketTransitionActionState> {
  const access = await ensureAdminPlatformAccess("/customer-service");
  const activeRole = access.role;
  const ticketId = normalizeText(formData, "ticketId");
  const nextStatusRaw = normalizeText(formData, "nextStatus");

  if (!ticketId) {
    return { status: "error", message: "Support ticket id is required.", ticketId: null };
  }

  if (!isSupportTicketStatus(nextStatusRaw)) {
    return { status: "error", message: "Support ticket status is invalid.", ticketId };
  }

  if (!activeRole || !GOVERNED_SUPPORT_ROLES.includes(activeRole)) {
    return {
      status: "error",
      message: "Your current admin role cannot update support tickets.",
      ticketId,
    };
  }

  try {
    const supabase = await createAdminServerSupabaseClient();
    const { data, error } = await supabase.rpc("update_support_ticket_status_with_audit", {
      p_ticket_id: ticketId,
      p_next_status: nextStatusRaw,
      p_admin_role: activeRole,
    });

    if (error || !data) {
      throw new Error(error?.message ?? "Support ticket status update failed.");
    }

    revalidatePath("/customer-service");
    revalidatePath("/dashboard");

    return {
      status: "success",
      message: `Ticket moved to ${toStatusLabel(nextStatusRaw)}.`,
      ticketId,
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "Unable to update support ticket status.",
      ticketId,
    };
  }
}
