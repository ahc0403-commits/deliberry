import { merchantQueryServices } from "../../../shared/data/merchant-query-services";
import { formatMoney } from "../../../shared/domain";
import { Sparkles, Store } from "lucide-react";

type MerchantPromotionsScreenProps = {
  storeId: string;
};

export function MerchantPromotionsScreen({
  storeId,
}: MerchantPromotionsScreenProps) {
  const data = merchantQueryServices.getPromotionsData(storeId);

  const typeLabels: Record<string, string> = {
    percentage: "% Off",
    fixed: "$ Off",
    free_delivery: "Free Delivery",
  };

  const formatValue = (type: string, value: number) => {
    if (type === "percentage") return `${value}%`;
    if (type === "fixed") return formatMoney(value);
    return "Free";
  };

  const activeCount = data.promotions.filter((p) => p.active).length;
  const inactiveCount = data.promotions.length - activeCount;
  const totalUsage = data.promotions.reduce((sum, promo) => sum + promo.usageCount, 0);

  return (
    <div className="merchant-surface">
      <section className="merchant-hero merchant-hero-insights">
        <div className="merchant-hero-copy">
          <span className="merchant-eyebrow">Store marketing</span>
          <h1 className="merchant-hero-title">Promotions</h1>
          <p className="merchant-hero-subtitle">
            Review campaign coverage, usage, and active status for the current store without implying live campaign creation or edits.
          </p>
          <div className="merchant-context-row">
            <span className="merchant-context-pill">
              <Store size={14} />
              {data.store.name}
            </span>
            <span className="merchant-context-pill merchant-context-pill-muted">
              <Sparkles size={14} />
              Create and edit controls remain preview-only
            </span>
          </div>
        </div>
        <div className="merchant-hero-panel">
          <div className="merchant-hero-panel-label">Campaign snapshot</div>
          <div className="merchant-hero-panel-value">{activeCount} active offers</div>
          <div className="merchant-hero-panel-text">
            Promotion data is fixture-backed, but active coverage and redemption progress still help explain the current marketing mix.
          </div>
        </div>
      </section>

      <div className="merchant-summary-band">
        <div className="merchant-summary-card">
          <div className="merchant-summary-label">Active campaigns</div>
          <div className="merchant-summary-value">{activeCount}</div>
          <div className="merchant-summary-meta">Currently shown as running in this store scope</div>
        </div>
        <div className="merchant-summary-card">
          <div className="merchant-summary-label">Completed or inactive</div>
          <div className="merchant-summary-value">{inactiveCount}</div>
          <div className="merchant-summary-meta">Kept visible here for historical campaign context</div>
        </div>
        <div className="merchant-summary-card">
          <div className="merchant-summary-label">Recorded uses</div>
          <div className="merchant-summary-value">{totalUsage}</div>
          <div className="merchant-summary-meta">Fixture-backed redemption counts across the current list</div>
        </div>
      </div>

      <div className="merchant-cluster-card">
        <div className="merchant-cluster-card-header">
          <div>
            <div className="card-title">Campaign library</div>
            <div className="card-subtitle">Store-scoped promotion list and current usage snapshot</div>
          </div>
          <div className="page-actions merchant-page-actions">
          <button
            className="btn btn-primary"
            disabled
            aria-disabled="true"
          >
            Create Preview Only
          </button>
        </div>
        </div>

        <div className="data-table-wrapper">
          <table className="data-table merchant-data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Code</th>
                <th>Type</th>
                <th>Discount</th>
                <th>Min. Order</th>
                <th>Usage</th>
                <th>Period</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.promotions.map((promo) => {
                const usagePercent = Math.round(
                  (promo.usageCount / promo.maxUses) * 100
                );
                return (
                  <tr key={promo.id}>
                    <td className="primary">{promo.name}</td>
                    <td>
                      <span className="promo-code">{promo.code}</span>
                    </td>
                    <td>{typeLabels[promo.type] ?? promo.type}</td>
                    <td style={{ fontWeight: 600 }}>
                      {formatValue(promo.type, promo.value)}
                    </td>
                    <td className="mono">{formatMoney(promo.minOrder)}</td>
                    <td>
                      <div className="promo-usage">
                        {promo.usageCount} / {promo.maxUses}
                      </div>
                      <div className="promo-usage-bar">
                        <div
                          className="promo-usage-fill"
                          style={{ width: `${usagePercent}%` }}
                        />
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: "var(--text-xs)" }}>
                        {promo.startsAt}
                      </div>
                      <div
                        style={{
                          fontSize: "var(--text-xs)",
                          color: "var(--color-text-muted)",
                        }}
                      >
                        to {promo.expiresAt}
                      </div>
                    </td>
                    <td>
                      <span
                        className={`status-badge ${promo.active ? "active" : "inactive"}`}
                      >
                        <span className="status-dot" />
                        {promo.active ? "Active" : "Expired"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
