import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { PermissionRole } from "../../../shared/domain";

import {
  isAdminRole,
  isAdminRoleAllowed,
  resolveAdminHomePath,
} from "../../../shared/auth/admin-access";
import {
  ADMIN_SESSION_COOKIE,
  readAdminRole,
  readAdminSession,
} from "../../../shared/auth/admin-session";

function withQuery(pathname: string, key: string, value: string) {
  const separator = pathname.includes("?") ? "&" : "?";
  return `${pathname}${separator}${key}=${encodeURIComponent(value)}`;
}

type AdminPlatformAccess = {
  role: PermissionRole | null;
  session: NonNullable<Awaited<ReturnType<typeof readAdminSession>>>;
};

export async function ensureAdminPlatformAccess(pathname: string): Promise<AdminPlatformAccess> {
  const cookieStore = await cookies();
  const hasSessionCookie = Boolean(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);
  const session = await readAdminSession();

  if (!session) {
    redirect(withQuery("/login", "error", hasSessionCookie ? "session_expired" : "session_required"));
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
    redirect(withQuery("/access-boundary", "reason", "role_required"));
  }

  if (!isAdminRoleAllowed(role, pathname)) {
    redirect(withQuery("/access-boundary", "reason", "access_denied"));
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
    isAdminRole(role)
        ? resolveAdminHomePath(role)
        : withQuery("/access-boundary", "reason", "role_required"),
  );
}
