import {
  PERMISSION_ROLES,
  type PermissionRole,
} from "../../../shared/domain";

const adminPermissionRoles: PermissionRole[] = [...PERMISSION_ROLES];

export const adminPermissionsPlaceholderState = {
  sections: ["role boundary", "access rules", "restricted section placeholder"],
  placeholderState:
    `Permission-aware entry remains structural only. Shared roles: ${adminPermissionRoles.join(", ")}.`,
} as const;
