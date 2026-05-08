import { PERMISSION_ROLES, type PermissionRole } from "../domain";

export const ADMIN_PATHNAME_HEADER = "x-admin-pathname";

type AdminNavLink = {
  href: string;
  icon:
    | "layout-dashboard"
    | "users"
    | "store"
    | "map-pinned"
    | "package"
    | "shield-alert"
    | "headset"
    | "wallet"
    | "chart-column"
    | "megaphone"
    | "message-square-text"
    | "folders"
    | "handshake"
    | "chart-no-axes-combined"
    | "file-text"
    | "settings-2";
  label: string;
  badge?: string;
  warnBadge?: boolean;
};

type AdminNavGroup = {
  label: string;
  links: AdminNavLink[];
};

const ROLE_ACCESS: Record<PermissionRole, readonly string[]> = {
  platform_admin: ["*"],
  operations_admin: [
    "/dashboard",
    "/users",
    "/merchants",
    "/stores",
    "/orders",
    "/disputes",
    "/customer-service",
    "/analytics",
    "/reporting",
  ],
  support_admin: [
    "/dashboard",
    "/orders",
    "/disputes",
    "/customer-service",
  ],
  finance_admin: [
    "/dashboard",
    "/settlements",
    "/finance",
    "/analytics",
    "/reporting",
  ],
  marketing_admin: [
    "/dashboard",
    "/marketing",
    "/announcements",
    "/catalog",
    "/b2b",
    "/analytics",
    "/reporting",
  ],
};

export const ADMIN_NAV_GROUPS: AdminNavGroup[] = [
  {
    label: "Operations",
    links: [
      { href: "/dashboard", icon: "layout-dashboard", label: "Dashboard" },
      { href: "/users", icon: "users", label: "Users", badge: "24.8k" },
      { href: "/merchants", icon: "store", label: "Merchants" },
      { href: "/stores", icon: "map-pinned", label: "Stores" },
      { href: "/orders", icon: "package", label: "Orders", badge: "1,247" },
      { href: "/disputes", icon: "shield-alert", label: "Disputes", badge: "14", warnBadge: true },
      { href: "/customer-service", icon: "headset", label: "Customer Service" },
    ],
  },
  {
    label: "Finance",
    links: [
      { href: "/settlements", icon: "wallet", label: "Settlements" },
      { href: "/finance", icon: "chart-column", label: "Finance" },
    ],
  },
  {
    label: "Content",
    links: [
      { href: "/marketing", icon: "megaphone", label: "Marketing" },
      { href: "/announcements", icon: "message-square-text", label: "Announcements" },
      { href: "/catalog", icon: "folders", label: "Catalog" },
      { href: "/b2b", icon: "handshake", label: "B2B" },
    ],
  },
  {
    label: "System",
    links: [
      { href: "/analytics", icon: "chart-no-axes-combined", label: "Analytics" },
      { href: "/reporting", icon: "file-text", label: "Reporting" },
      { href: "/system-management", icon: "settings-2", label: "System Management" },
    ],
  },
];

const ADMIN_ROLE_SET = new Set<string>(PERMISSION_ROLES);

export function isAdminRole(value: string | null | undefined): value is PermissionRole {
  return typeof value === "string" && ADMIN_ROLE_SET.has(value);
}

export function isStaticPath(pathname: string): boolean {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/public")
  );
}

export function isProtectedPlatformPath(pathname: string): boolean {
  return pathname !== "/" && pathname !== "/login" && pathname !== "/access-boundary";
}

export function isAdminRoleAllowed(role: PermissionRole, pathname: string): boolean {
  const allowed = ROLE_ACCESS[role] ?? [];

  return allowed.some((allowedPath) => {
    if (allowedPath === "*") {
      return true;
    }

    return pathname === allowedPath || pathname.startsWith(`${allowedPath}/`);
  });
}

export function resolveAdminHomePath(role: PermissionRole): string {
  const allowed = ROLE_ACCESS[role];

  if (!allowed || allowed[0] === "*") {
    return "/dashboard";
  }

  return allowed[0] ?? "/dashboard";
}

export function getAdminNavGroups(role: PermissionRole) {
  return ADMIN_NAV_GROUPS.map((group) => ({
    ...group,
    links: group.links.filter((link) => isAdminRoleAllowed(role, link.href)),
  })).filter((group) => group.links.length > 0);
}
