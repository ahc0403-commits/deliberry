"use client";

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
  return (
    <div className="merchant-surface">
      <section className="merchant-hero merchant-hero-insights">
        <div className="merchant-hero-copy">
          <span className="merchant-eyebrow">Unavailable</span>
          <h1 className="merchant-hero-title">{title}</h1>
          <p className="merchant-hero-subtitle">{message}</p>
        </div>
      </section>

      <div className="merchant-cluster-card">
        <div className="merchant-settings-intro">
          <strong>Runtime load failed</strong>
          <p>{message}</p>
        </div>
        {onReset ? (
          <div className="page-actions merchant-page-actions">
            <button className="btn btn-primary" onClick={onReset}>
              {resetLabel}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
