import type { ReactNode } from "react";

import { ensureMerchantConsoleAccess } from "../../features/auth/server/access";
import { signOutMerchantAction } from "../../features/auth/server/auth-actions";
import { getMerchantStoreShellRuntimeData } from "../../shared/data/merchant-shell-runtime-service";
import { getTranslations } from "../../shared/i18n/server";

export default async function MerchantConsoleLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { t } = await getTranslations();
  const access = await ensureMerchantConsoleAccess();
  const storeName = access.selectedStoreId
    ? (await getMerchantStoreShellRuntimeData(access.selectedStoreId)).data.storeName
    : null;

  return (
    <div className="console-layout">
      <header className="console-header">
        <div className="console-header-inner">
          <span className="console-brand">
            Deliberry<span className="console-brand-sub">{t("header.merchant")}</span>
          </span>

          <div className="console-header-center">
            {storeName ? (
              <div className="console-store-badge">
                <span className="console-store-badge-dot" />
                {storeName} &middot; {t("header.active")}
              </div>
            ) : null}
          </div>

          <div className="console-header-actions">
            <form action={signOutMerchantAction}>
              <button type="submit" className="btn-signout">
                {t("header.signOut")}
              </button>
            </form>
          </div>
        </div>
      </header>
      <div className="console-body">{children}</div>
    </div>
  );
}
