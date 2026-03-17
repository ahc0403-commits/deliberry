"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  ADMIN_ROLE_COOKIE,
  ADMIN_SESSION_COOKIE,
} from "../../../shared/auth/admin-session";
import { redirectAdminIfSessionExists } from "./access";

export async function signInAdminAction() {
  const store = await cookies();
  store.set(
    ADMIN_SESSION_COOKIE,
    JSON.stringify({
      adminId: "admin-demo",
      adminName: "Demo Admin",
      actorType: "admin",
      role: "platform_admin",
    }),
  );
  store.delete(ADMIN_ROLE_COOKIE);

  redirect("/access-boundary");
}

export async function signOutAdminAction() {
  const store = await cookies();
  store.delete(ADMIN_SESSION_COOKIE);
  store.delete(ADMIN_ROLE_COOKIE);

  redirect("/login");
}

export { redirectAdminIfSessionExists };
