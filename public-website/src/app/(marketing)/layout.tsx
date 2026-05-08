import Link from "next/link";
import type { ReactNode } from "react";

import { getTranslations } from "../../shared/i18n/server";

export default async function MarketingLayout({ children }: { children: ReactNode }) {
  const { t } = await getTranslations();

  return (
    <div className="marketing-shell">
      <header className="site-header">
        <div className="site-header-inner">
          <Link href="/" className="site-logo">Deliberry</Link>
          <nav className="site-nav" aria-label="Main navigation">
            <Link href="/service" className="site-nav-link">{t("nav.service")}</Link>
            <Link href="/merchant" className="site-nav-link">{t("nav.merchant")}</Link>
            <Link href="/support" className="site-nav-link">{t("nav.support")}</Link>
            <Link href="/download" className="site-nav-cta">{t("nav.download")}</Link>
          </nav>
        </div>
      </header>

      <main>{children}</main>

      <footer className="site-footer">
        <div className="site-footer-inner">
          <div className="site-footer-topline">
            <span className="site-footer-topline-label">{t("footer.surfaceLabel")}</span>
            <span className="site-footer-topline-copy">
              {t("footer.surfaceCopy")}
            </span>
          </div>
          <div className="site-footer-grid">
            <div className="site-footer-brand-col">
              <span className="site-footer-logo">Deliberry</span>
              <p className="site-footer-tagline">
                {t("footer.tagline")}
              </p>
            </div>
            <div>
              <div className="site-footer-col-title">{t("footer.product")}</div>
              <div className="site-footer-col-links">
                <Link href="/service">{t("footer.howItWorks")}</Link>
                <Link href="/download">{t("footer.download")}</Link>
                <Link href="/support">{t("footer.customerSupport")}</Link>
              </div>
            </div>
            <div>
              <div className="site-footer-col-title">{t("footer.business")}</div>
              <div className="site-footer-col-links">
                <Link href="/merchant">{t("footer.becomeMerchant")}</Link>
                <Link href="/merchant#benefits">{t("footer.partnerBenefits")}</Link>
                <a href="mailto:partners@deliberry.com">{t("footer.partnerSupport")}</a>
              </div>
            </div>
            <div>
              <div className="site-footer-col-title">{t("footer.legal")}</div>
              <div className="site-footer-col-links">
                <Link href="/privacy">{t("footer.privacy")}</Link>
                <Link href="/terms">{t("footer.terms")}</Link>
                <Link href="/refund-policy">{t("footer.refunds")}</Link>
              </div>
            </div>
          </div>
          <div className="site-footer-bottom">
            <span className="site-footer-copy">© 2026 Deliberry. {t("footer.rights")}</span>
            <div className="site-footer-legal">
              <Link href="/privacy">{t("footer.privacy")}</Link>
              <Link href="/terms">{t("footer.terms")}</Link>
              <Link href="/refund-policy">{t("footer.refunds")}</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
