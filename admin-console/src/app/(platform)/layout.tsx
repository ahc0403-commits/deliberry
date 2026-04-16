import Link from "next/link";
import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { signOutAdminAction } from "../../features/auth/server/auth-actions";
import { getAdminNavGroups, isAdminRole } from "../../shared/auth/admin-access";
import { readAdminRole, readAdminSession } from "../../shared/auth/admin-session";
import { supabaseAdminRuntimeRepository } from "../../shared/data/supabase-admin-runtime-repository";

export default async function PlatformLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await readAdminSession();
  if (!session) {
    redirect("/login");
  }

  const role = await readAdminRole();
  if (!isAdminRole(role)) {
    return <main className="platform-content">{children}</main>;
  }

  const navGroups = getAdminNavGroups(role);
  const [{ users }, { orders }, { disputes }] = await Promise.all([
    supabaseAdminRuntimeRepository.getUsersData(),
    supabaseAdminRuntimeRepository.getOrdersData(),
    supabaseAdminRuntimeRepository.getDisputesData(),
  ]);
  const usersCount = users.length;
  const ordersCount = orders.length;
  const disputesCount = disputes.length;

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
