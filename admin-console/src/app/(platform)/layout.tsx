import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import {
  ChartColumn,
  ChartNoAxesCombined,
  FileText,
  Folders,
  Handshake,
  Headset,
  LayoutDashboard,
  MapPinned,
  Megaphone,
  MessageSquareText,
  Package,
  Settings2,
  ShieldAlert,
  Store,
  Users,
  Wallet,
} from "lucide-react";

import { signOutAdminAction } from "../../features/auth/server/auth-actions";
import { ADMIN_PATHNAME_HEADER, getAdminNavGroups, isAdminRole } from "../../shared/auth/admin-access";
import { readAdminRole, readAdminSession } from "../../shared/auth/admin-session";
import { readAdminRuntimeSafely } from "../../shared/data/admin-runtime-availability";
import { supabaseAdminRuntimeRepository } from "../../shared/data/supabase-admin-runtime-repository";
import { getTranslations } from "../../shared/i18n/server";

function navIncludesHref(
  navGroups: ReturnType<typeof getAdminNavGroups>,
  href: string,
): boolean {
  return navGroups.some((group) =>
    group.links.some((link) => link.href === href),
  );
}

const ADMIN_NAV_ICONS = {
  "chart-column": ChartColumn,
  "chart-no-axes-combined": ChartNoAxesCombined,
  "file-text": FileText,
  folders: Folders,
  handshake: Handshake,
  headset: Headset,
  "layout-dashboard": LayoutDashboard,
  "map-pinned": MapPinned,
  megaphone: Megaphone,
  "message-square-text": MessageSquareText,
  package: Package,
  "settings-2": Settings2,
  "shield-alert": ShieldAlert,
  store: Store,
  users: Users,
  wallet: Wallet,
} as const;

function translateAdminNavGroup(
  label: string,
  t: (key: string) => string,
): string {
  switch (label) {
    case "Operations":
      return t("nav.operations");
    case "Finance":
      return t("nav.financeGroup");
    case "Content":
      return t("nav.content");
    case "System":
      return t("nav.system");
    default:
      return label;
  }
}

export default async function PlatformLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { t } = await getTranslations();
  const currentPath = (await headers()).get(ADMIN_PATHNAME_HEADER) ?? "";
  const session = await readAdminSession();
  if (!session) {
    redirect("/login");
  }

  const role = await readAdminRole();
  if (!isAdminRole(role)) {
    return <main className="platform-content">{children}</main>;
  }

  const navGroups = getAdminNavGroups(role);
  const shouldReadUsers = navIncludesHref(navGroups, "/users");
  const shouldReadOrders = navIncludesHref(navGroups, "/orders");
  const shouldReadDisputes = navIncludesHref(navGroups, "/disputes");
  const [usersData, ordersData, disputesData] = await Promise.all([
    shouldReadUsers
      ? readAdminRuntimeSafely(() => supabaseAdminRuntimeRepository.getUsersData())
      : null,
    shouldReadOrders
      ? readAdminRuntimeSafely(() => supabaseAdminRuntimeRepository.getOrdersData())
      : null,
    shouldReadDisputes
      ? readAdminRuntimeSafely(() => supabaseAdminRuntimeRepository.getDisputesData())
      : null,
  ]);
  const usersCount = usersData?.available ? usersData.data.users.length : 0;
  const ordersCount = ordersData?.available ? ordersData.data.orders.length : 0;
  const disputesCount = disputesData?.available ? disputesData.data.disputes.length : 0;
  const runtimeUnavailable =
    (usersData && !usersData.available) ||
    (ordersData && !ordersData.available) ||
    (disputesData && !disputesData.available);

  return (
    <div className="platform-layout">
      <aside className="platform-sidebar">
        <div className="platform-sidebar-header">
          <span className="platform-brand">Deliberry</span>
          <span className="platform-brand-sub">Admin Console</span>
        </div>
        <nav className="platform-nav">
          {navGroups.map((group) => (
            <div key={group.label} className="nav-group">
              <span className="nav-group-label">
                {translateAdminNavGroup(group.label, t)}
              </span>
              {group.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-link${currentPath === link.href || currentPath.startsWith(`${link.href}/`) ? " active" : ""}`}
                >
                  <span className="nav-icon" aria-hidden="true">
                    {(() => {
                      const Icon = ADMIN_NAV_ICONS[link.icon];
                      return <Icon size={16} strokeWidth={1.8} />;
                    })()}
                  </span>
                  {link.label}
                  {link.href == "/users"
                      ? <span className="nav-badge">{usersCount}</span>
                      : link.href == "/orders"
                          ? <span className="nav-badge">{ordersCount}</span>
                          : link.href == "/disputes"
                              ? <span className="nav-badge nav-badge-warn">{disputesCount}</span>
                              : null}
                </Link>
              ))}
            </div>
          ))}
        </nav>
      </aside>
      <div className="platform-main-area">
        <header className="platform-header">
          <div className="platform-header-inner">
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span className="platform-scope-badge">{t("header.platform")}</span>
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "var(--color-text-muted)",
                  fontWeight: 600,
                }}
              >
                {t("header.runtime")}
              </span>
            </div>
            <form action={signOutAdminAction}>
              <button type="submit" className="btn-signout">{t("header.signOut")}</button>
            </form>
          </div>
          {runtimeUnavailable ? (
            <div
              style={{
                marginTop: "0.875rem",
                padding: "0.875rem 1rem",
                borderRadius: "14px",
                border: "1px solid rgba(245, 158, 11, 0.24)",
                background: "rgba(255, 251, 235, 0.92)",
                color: "var(--color-text-primary)",
              }}
            >
              <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>
                {t("header.runtimeUnavailable")}
              </div>
              <div
                style={{
                  marginTop: "0.35rem",
                  fontSize: "0.85rem",
                  lineHeight: 1.55,
                  color: "var(--color-text-secondary)",
                }}
              >
                {t("header.runtimeUnavailableDetail")}
              </div>
            </div>
          ) : null}
        </header>
        <main className="platform-content">{children}</main>
      </div>
    </div>
  );
}
