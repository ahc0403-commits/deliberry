import type { ReactNode } from "react";

import { ensureMerchantConsoleAccess } from "../../features/auth/server/access";
import { signOutMerchantAction } from "../../features/auth/server/auth-actions";

export default async function MerchantConsoleLayout({
  children,
}: {
  children: ReactNode;
}) {
  const access = await ensureMerchantConsoleAccess();
  const storeName = access.selectedStoreId ? "Sabor Criollo Kitchen" : null;

  return (
    <div className="console-layout">
      <header className="console-header">
        <div className="console-header-inner">
          <span className="console-brand">
            Deliberry<span className="console-brand-sub">Merchant</span>
          </span>

          <div className="console-header-center">
            {storeName ? (
              <div className="console-store-badge">
                <span className="console-store-badge-dot" />
                {storeName} &middot; Open
              </div>
            ) : null}
          </div>

          <div className="console-header-actions">
            <form action={signOutMerchantAction}>
              <button type="submit" className="btn-signout">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <div className="console-body">{children}</div>
    </div>
  );
}
