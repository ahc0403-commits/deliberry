"use server";

import { redirect } from "next/navigation";

import {
  isAdminRole,
  isAdminRoleAllowed,
  resolveAdminHomePath,
} from "../../../shared/auth/admin-access";
import { readAdminRole, readAdminSession } from "../../../shared/auth/admin-session";

export async function ensureAdminPlatformAccess(pathname: string) {
  const session = await readAdminSession();

  if (!session) {
    redirect("/login");
  }

  const role = await readAdminRole();

  if (!isAdminRole(role)) {
    redirect("/access-boundary");
  }

  if (!isAdminRoleAllowed(role, pathname)) {
    redirect(resolveAdminHomePath(role));
  }

  return {
    role,
    session,
  };
}

export async function redirectAdminIfSessionExists() {
  const session = await readAdminSession();

  if (!session) {
    return;
  }

  const role = await readAdminRole();

  redirect(
    isAdminRole(role) ? resolveAdminHomePath(role) : "/access-boundary",
  );
}
