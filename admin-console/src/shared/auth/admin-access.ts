import { PERMISSION_ROLES, type PermissionRole } from "../domain";

export const ADMIN_PATHNAME_HEADER = "x-admin-pathname";

type AdminNavLink = {
  href: string;
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
      { href: "/dashboard", label: "📊 Dashboard" },
      { href: "/users", label: "👥 Users", badge: "24.8k" },
      { href: "/merchants", label: "🏪 Merchants" },
      { href: "/stores", label: "📍 Stores" },
      { href: "/orders", label: "📦 Orders", badge: "1,247" },
      { href: "/disputes", label: "⚠️ Disputes", badge: "14", warnBadge: true },
      { href: "/customer-service", label: "🎧 Customer Service" },
    ],
  },
  {
    label: "Finance",
    links: [
      { href: "/settlements", label: "💳 Settlements" },
      { href: "/finance", label: "📈 Finance" },
    ],
  },
  {
    label: "Content",
    links: [
      { href: "/marketing", label: "📢 Marketing" },
      { href: "/announcements", label: "📣 Announcements" },
      { href: "/catalog", label: "📂 Catalog" },
      { href: "/b2b", label: "🤝 B2B" },
    ],
  },
  {
    label: "System",
    links: [
      { href: "/analytics", label: "📉 Analytics" },
      { href: "/reporting", label: "📋 Reporting" },
      { href: "/system-management", label: "🛠 System Management" },
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
