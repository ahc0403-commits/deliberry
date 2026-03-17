import Link from "next/link";
import type { ReactNode } from "react";

export default function LegalLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div>
      <div className="legal-header">
        <div className="legal-header-inner">
          <h1>
            <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>
              Deliberry
            </Link>
            {" "}
            <span style={{ color: "var(--color-text-muted)", fontWeight: 400 }}>/ Legal</span>
          </h1>
          <nav className="legal-nav" aria-label="Legal navigation">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/refund-policy">Refund Policy</Link>
          </nav>
        </div>
      </div>
      <main className="legal-content">{children}</main>
    </div>
  );
}
