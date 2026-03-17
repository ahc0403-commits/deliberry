import Link from "next/link";
import type { ReactNode } from "react";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="marketing-shell">
      <header className="site-header">
        <div className="site-header-inner">
          <Link href="/" className="site-logo">Deliberry</Link>
          <nav className="site-nav" aria-label="Main navigation">
            <Link href="/service" className="site-nav-link">How it works</Link>
            <Link href="/merchant" className="site-nav-link">For merchants</Link>
            <Link href="/support" className="site-nav-link">Support</Link>
            <Link href="/download" className="site-nav-cta">Get the app</Link>
          </nav>
        </div>
      </header>

      <main>{children}</main>

      <footer className="site-footer">
        <div className="site-footer-inner">
          <div className="site-footer-topline">
            <span className="site-footer-topline-label">Public acquisition surface</span>
            <span className="site-footer-topline-copy">
              Understand the service, explore merchant onboarding, and follow app availability truthfully.
            </span>
          </div>
          <div className="site-footer-grid">
            <div className="site-footer-brand-col">
              <span className="site-footer-logo">Deliberry</span>
              <p className="site-footer-tagline">
                Fast, reliable food delivery connecting Buenos Aires with the restaurants they love.
              </p>
            </div>
            <div>
              <div className="site-footer-col-title">Product</div>
              <div className="site-footer-col-links">
                <Link href="/service">How it works</Link>
                <Link href="/download">Download the app</Link>
                <Link href="/support">Customer support</Link>
              </div>
            </div>
            <div>
              <div className="site-footer-col-title">Business</div>
              <div className="site-footer-col-links">
                <Link href="/merchant">Become a merchant</Link>
                <Link href="/merchant#benefits">Partner benefits</Link>
                <a href="mailto:partners@deliberry.com">Partner support</a>
              </div>
            </div>
            <div>
              <div className="site-footer-col-title">Legal</div>
              <div className="site-footer-col-links">
                <Link href="/privacy">Privacy policy</Link>
                <Link href="/terms">Terms of service</Link>
                <Link href="/refund-policy">Refund policy</Link>
              </div>
            </div>
          </div>
          <div className="site-footer-bottom">
            <span className="site-footer-copy">© 2026 Deliberry. All rights reserved.</span>
            <div className="site-footer-legal">
              <Link href="/privacy">Privacy</Link>
              <Link href="/terms">Terms</Link>
              <Link href="/refund-policy">Refunds</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
