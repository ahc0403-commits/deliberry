"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  isAdminRole,
  resolveAdminHomePath,
} from "../../../shared/auth/admin-access";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_ROLE_COOKIE,
  readAdminSession,
} from "../../../shared/auth/admin-session";

export async function setAdminRoleAction(formData: FormData) {
  const store = await cookies();
  const role = String(formData.get("role") ?? "");
  const session = await readAdminSession();

  if (!session) {
    store.delete(ADMIN_ROLE_COOKIE);
    redirect("/login");
  }

  if (!isAdminRole(role)) {
    store.delete(ADMIN_ROLE_COOKIE);
    redirect("/access-boundary");
  }

  store.set(ADMIN_ROLE_COOKIE, role);
  store.set(
    ADMIN_SESSION_COOKIE,
    JSON.stringify({
      adminId: session.adminId,
      adminName: session.adminName,
      actorType: "admin",
      role,
    }),
  );

  redirect(resolveAdminHomePath(role));
}
