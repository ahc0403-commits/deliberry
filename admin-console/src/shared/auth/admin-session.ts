import { cookies } from "next/headers";
import { PERMISSION_ROLES, type PermissionRole } from "../domain";

export const ADMIN_SESSION_COOKIE = "admin_session";
export const ADMIN_ROLE_COOKIE = "admin_role";

// R-020: Every mutation must be attributed to an authenticated actor.
// R-022: Admin roles must be from PERMISSION_ROLES.
// IDENTITY.md Section 6: Token claims include actor_type and role.
export type AdminSession = {
  adminId: string;
  adminName: string;
  role: PermissionRole;
  actorType: "admin";
};

function isPermissionRole(value: unknown): value is PermissionRole {
  return typeof value === "string" && PERMISSION_ROLES.includes(value as PermissionRole);
}

export async function readAdminSession(): Promise<AdminSession | null> {
  const store = await cookies();
  const value = store.get(ADMIN_SESSION_COOKIE)?.value;

  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as Partial<AdminSession>;
    if (!parsed.adminId || !parsed.adminName) return null;
    const roleFromCookie = store.get(ADMIN_ROLE_COOKIE)?.value;
    return {
      adminId: parsed.adminId,
      adminName: parsed.adminName,
      role:
        (isPermissionRole(parsed.role) ? parsed.role : null) ??
        (isPermissionRole(roleFromCookie) ? roleFromCookie : null) ??
        "platform_admin",
      actorType: "admin",
    };
  } catch {
    return null;
  }
}

export async function readAdminRole(): Promise<PermissionRole | null> {
  const store = await cookies();
  const raw = store.get(ADMIN_ROLE_COOKIE)?.value ?? null;
  return isPermissionRole(raw) ? raw : null;
}
