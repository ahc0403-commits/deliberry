"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  isAdminRole,
  resolveAdminHomePath,
} from "../../../shared/auth/admin-access";
import {
  ADMIN_ROLE_COOKIE,
  ADMIN_SESSION_COOKIE,
} from "../../../shared/auth/admin-session";

export async function setAdminRoleAction(formData: FormData) {
  const store = await cookies();
  const role = String(formData.get("role") ?? "");

  if (!isAdminRole(role)) {
    store.delete(ADMIN_ROLE_COOKIE);
    redirect("/access-boundary");
  }

  store.set(ADMIN_ROLE_COOKIE, role);
  const currentSession = store.get(ADMIN_SESSION_COOKIE)?.value;

  if (currentSession) {
    try {
      const parsed = JSON.parse(currentSession) as {
        adminId?: string;
        adminName?: string;
      };
      if (parsed.adminId && parsed.adminName) {
        store.set(
          ADMIN_SESSION_COOKIE,
          JSON.stringify({
            adminId: parsed.adminId,
            adminName: parsed.adminName,
            actorType: "admin",
            role,
          }),
        );
      }
    } catch {
      // Leave the session untouched if an older cookie shape cannot be parsed.
    }
  }

  redirect(resolveAdminHomePath(role));
}
