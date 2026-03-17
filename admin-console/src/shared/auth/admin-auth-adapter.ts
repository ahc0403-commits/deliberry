import type { PermissionRole } from "../domain";

export type AdminAuthIdentity = {
  adminId: string;
  adminName: string;
  actorType: "admin";
  role: PermissionRole;
};

export type AdminSessionSnapshot = {
  identity: AdminAuthIdentity;
  allowedRoutePrefixes: string[];
};

export interface AdminAuthAdapter {
  readSession(): Promise<AdminSessionSnapshot | null>;
  signInWithPassword(input: { email: string; password: string }): Promise<AdminSessionSnapshot>;
  resolveRole(role: PermissionRole): Promise<AdminSessionSnapshot>;
  signOut(): Promise<void>;
}
