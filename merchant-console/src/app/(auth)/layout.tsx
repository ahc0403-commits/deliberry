import type { ReactNode } from "react";

export default function MerchantAuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="auth-layout">
      <div className="auth-card">
        <div className="auth-card-header">
          <h1 className="auth-logo">Deliberry</h1>
          <p className="auth-subtitle">Merchant Console</p>
        </div>
        <main>{children}</main>
      </div>
    </div>
  );
}
