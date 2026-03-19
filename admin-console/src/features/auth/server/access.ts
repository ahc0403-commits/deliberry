"use server";

import { redirect } from "next/navigation";
import type { PermissionRole } from "../../../shared/domain";

import {
  isAdminRole,
  isAdminRoleAllowed,
  resolveAdminHomePath,
} from "../../../shared/auth/admin-access";
import { readAdminRole, readAdminSession } from "../../../shared/auth/admin-session";

type AdminPlatformAccess = {
  role: PermissionRole | null;
  session: NonNullable<Awaited<ReturnType<typeof readAdminSession>>>;
};

export async function ensureAdminPlatformAccess(pathname: string): Promise<AdminPlatformAccess> {
  const session = await readAdminSession();

  if (!session) {
    redirect("/login");
  }

  const role = await readAdminRole();

  if (pathname === "/access-boundary") {
    if (!isAdminRole(role)) {
      return {
        role: null,
        session,
      };
    }

    redirect(resolveAdminHomePath(role));
  }

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
