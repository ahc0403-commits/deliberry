import Link from "next/link";
import { headers } from "next/headers";
import type { ReactNode } from "react";

import { ensureAdminPlatformAccess } from "../../features/auth/server/access";
import { signOutAdminAction } from "../../features/auth/server/auth-actions";
import { ADMIN_PATHNAME_HEADER, getAdminNavGroups } from "../../shared/auth/admin-access";
import { adminQueryServices } from "../../shared/data/admin-query-services";

export default async function PlatformLayout({
  children,
}: {
  children: ReactNode;
}) {
  const requestHeaders = await headers();
  const pathname = requestHeaders.get(ADMIN_PATHNAME_HEADER) ?? "/dashboard";
  const access = await ensureAdminPlatformAccess(pathname);

  if (pathname === "/access-boundary") {
    return <main className="platform-content">{children}</main>;
  }

  if (!access.role) {
    return <main className="platform-content">{children}</main>;
  }

  const navGroups = getAdminNavGroups(access.role);
  const usersCount = adminQueryServices.getUsersData().users.length;
  const ordersCount = adminQueryServices.getOrdersData().orders.length;
  const disputesCount = adminQueryServices.getDisputesData().disputes.length;

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
              <span className="nav-group-label">{group.label}</span>
              {group.links.map((link) => (
                <Link key={link.href} href={link.href} className="nav-link">
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
              <span className="platform-scope-badge">Platform Governance</span>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>v1.0</span>
            </div>
            <form action={signOutAdminAction}>
              <button type="submit" className="btn-signout">Sign out</button>
            </form>
          </div>
        </header>
        <main className="platform-content">{children}</main>
      </div>
    </div>
  );
}
