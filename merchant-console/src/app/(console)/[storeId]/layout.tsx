import Link from "next/link";
import { headers } from "next/headers";
import type { ReactNode } from "react";
import {
  BarChart3,
  LayoutDashboard,
  type LucideIcon,
  MenuSquare,
  Megaphone,
  Receipt,
  Settings2,
  ShoppingBag,
  Star,
  Store,
} from "lucide-react";

import { ensureMerchantStoreScope } from "../../../features/auth/server/access";
import { MERCHANT_PATHNAME_HEADER } from "../../../shared/auth/merchant-session";
import { getMerchantStoreShellRuntimeData } from "../../../shared/data/merchant-shell-runtime-service";
import { getTranslations } from "../../../shared/i18n/server";

type StoreLayoutProps = {
  children: ReactNode;
  params: Promise<{ storeId: string }>;
};

type MerchantNavGroup = {
  label: string;
  links: Array<{
    href: string;
    label: string;
    icon: LucideIcon;
    badge?: number;
  }>;
};

export default async function StoreScopedLayout({
  children,
  params,
  }: StoreLayoutProps) {
  const { t } = await getTranslations();
  const { storeId } = await params;
  const currentPath = (await headers()).get(MERCHANT_PATHNAME_HEADER) ?? "";
  await ensureMerchantStoreScope(storeId);
  const { data: shellData } = await getMerchantStoreShellRuntimeData(storeId);
  const navGroups: MerchantNavGroup[] = [
    {
      label: t("nav.main"),
      links: [
        { href: `/${storeId}/dashboard`, label: t("nav.dashboard"), icon: LayoutDashboard },
        { href: `/${storeId}/orders`, label: t("nav.orders"), icon: ShoppingBag, badge: shellData.activeOrderCount },
        { href: `/${storeId}/menu`, label: t("nav.menu"), icon: MenuSquare },
      ],
    },
    {
      label: t("nav.store"),
      links: [
        { href: `/${storeId}/store`, label: t("nav.storeInfo"), icon: Store },
        { href: `/${storeId}/reviews`, label: t("nav.reviews"), icon: Star, badge: shellData.pendingReviewCount },
        { href: `/${storeId}/promotions`, label: t("nav.promotions"), icon: Megaphone },
      ],
    },
    {
      label: t("nav.finance"),
      links: [
        { href: `/${storeId}/settlement`, label: t("nav.settlement"), icon: Receipt },
        { href: `/${storeId}/analytics`, label: t("nav.analytics"), icon: BarChart3 },
      ],
    },
    {
      label: t("nav.config"),
      links: [
        { href: `/${storeId}/settings`, label: t("nav.settings"), icon: Settings2 },
      ],
    },
  ] as const;

  return (
    <div className="store-layout">
      <aside className="store-sidebar">
        <div className="store-sidebar-header">
          <span className="store-indicator-label">{t("store.workspace")}</span>
          <span className="store-indicator">{shellData.storeName}</span>
          <span className="store-indicator-label">{t("store.scope")}</span>
        </div>
        <nav className="store-nav" aria-label="Merchant store navigation">
          {navGroups.map((group) => (
            <div key={group.label}>
              <span className="store-nav-section">{group.label}</span>
              {group.links.map((link) => {
                const Icon = link.icon;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`store-nav-link${currentPath === link.href || currentPath.startsWith(`${link.href}/`) ? " active" : ""}`}
                  >
                    <span className="store-nav-icon" aria-hidden="true">
                      <Icon size={16} strokeWidth={1.8} />
                    </span>
                    {link.label}
                    {link.badge !== undefined ? (
                      <span className="store-nav-badge">{link.badge}</span>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>
      <main className="store-main">{children}</main>
    </div>
  );
}
