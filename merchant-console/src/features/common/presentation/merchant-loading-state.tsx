"use client";

import { useMerchantI18n } from "../../../shared/i18n/client";

type MerchantLoadingStateProps = {
  title: string;
  subtitle: string;
};

export function MerchantLoadingState({
  title,
  subtitle,
}: MerchantLoadingStateProps) {
  const { raw } = useMerchantI18n();

  return (
    <div className="merchant-surface">
      <section className="merchant-hero merchant-hero-insights">
        <div className="merchant-hero-copy">
          <span className="merchant-eyebrow">{raw("Loading")}</span>
          <h1 className="merchant-hero-title">{title}</h1>
          <p className="merchant-hero-subtitle">{subtitle}</p>
        </div>
      </section>

      <div className="merchant-summary-band">
        <div className="merchant-summary-card skeleton-card" />
        <div className="merchant-summary-card skeleton-card" />
        <div className="merchant-summary-card skeleton-card" />
      </div>

      <div className="merchant-cluster-card">
        <div className="skeleton-card" style={{ minHeight: "280px" }} />
      </div>
    </div>
  );
}
