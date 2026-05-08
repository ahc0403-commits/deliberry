"use client";

import { useMerchantI18n } from "../../../shared/i18n/client";

type MerchantErrorStateProps = {
  title: string;
  message: string;
  resetLabel?: string;
  onReset?: () => void;
};

export function MerchantErrorState({
  title,
  message,
  resetLabel = "Retry",
  onReset,
}: MerchantErrorStateProps) {
  const { raw } = useMerchantI18n();

  return (
    <div className="merchant-surface">
      <section className="merchant-hero merchant-hero-insights">
        <div className="merchant-hero-copy">
          <span className="merchant-eyebrow">{raw("Unavailable")}</span>
          <h1 className="merchant-hero-title">{title}</h1>
          <p className="merchant-hero-subtitle">{message}</p>
        </div>
      </section>

      <div className="merchant-cluster-card">
        <div className="merchant-settings-intro">
          <strong>{raw("Runtime load failed")}</strong>
          <p>{message}</p>
        </div>
        {onReset ? (
          <div className="page-actions merchant-page-actions">
            <button className="btn btn-primary" onClick={onReset}>
              {raw(resetLabel)}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
