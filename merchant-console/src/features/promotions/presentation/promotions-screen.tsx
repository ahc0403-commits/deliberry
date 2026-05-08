 "use client";

import { formatMoney } from "../../../shared/domain";
import { Sparkles, Store } from "lucide-react";
import type { PromotionsData } from "../../../shared/data/merchant-repository";
import { toDisplayTime } from "../../../shared/domain";
import { useMerchantI18n } from "../../../shared/i18n/client";

type MerchantPromotionsScreenProps = {
  initialData: PromotionsData;
  source: "snapshot";
};

export function MerchantPromotionsScreen({
  initialData,
  source,
}: MerchantPromotionsScreenProps) {
  const { locale, raw } = useMerchantI18n();
  const data = initialData;

  const typeLabels: Record<string, string> = {
    percentage: raw("% Off"),
    fixed: raw("₫ Off"),
    free_delivery: raw("Free Delivery"),
  };

  const formatValue = (type: string, value: number) => {
    if (type === "percentage") return `${value}%`;
    if (type === "fixed") return formatMoney(value);
    return raw("Free");
  };

  const activeCount = data.promotions.filter((p) => p.active).length;
  const inactiveCount = data.promotions.length - activeCount;
  const totalUsage = data.promotions.reduce((sum, promo) => sum + promo.usageCount, 0);
  const replaceCount = (value: string, count: number) => raw(value).replace("{count}", String(count));

  return (
    <div className="merchant-surface">
      <section className="merchant-hero merchant-hero-insights">
        <div className="merchant-hero-copy">
          <span className="merchant-eyebrow">{raw("Store marketing")}</span>
          <h1 className="merchant-hero-title">{raw("Promotions")}</h1>
          <p className="merchant-hero-subtitle">
            {raw("Review campaign coverage, usage, and active status for the current store through the current phase planning snapshot.")}
          </p>
          <div className="merchant-context-row">
            <span className="merchant-context-pill">
              <Store size={14} />
              {data.store.name}
            </span>
            <span className="merchant-context-pill merchant-context-pill-muted">
              <Sparkles size={14} />
              {source === "snapshot"
                ? raw("Store identity is live, campaign rows remain snapshot-only")
                : raw("Creation and edits are not yet available")}
            </span>
          </div>
        </div>
        <div className="merchant-hero-panel">
          <div className="merchant-hero-panel-label">{raw("Campaign snapshot")}</div>
          <div className="merchant-hero-panel-value">{replaceCount("{count} active offers", activeCount)}</div>
          <div className="merchant-hero-panel-text">
            {raw("Campaign coverage and redemption progress are shown as a store-scoped planning snapshot in the current phase.")}
          </div>
        </div>
      </section>

      <div className="merchant-summary-band">
        <div className="merchant-summary-card">
          <div className="merchant-summary-label">{raw("Active campaigns")}</div>
          <div className="merchant-summary-value">{activeCount}</div>
          <div className="merchant-summary-meta">{raw("Currently shown as running in this store scope")}</div>
        </div>
        <div className="merchant-summary-card">
          <div className="merchant-summary-label">{raw("Completed or inactive")}</div>
          <div className="merchant-summary-value">{inactiveCount}</div>
          <div className="merchant-summary-meta">{raw("Kept visible here for historical campaign context")}</div>
        </div>
        <div className="merchant-summary-card">
          <div className="merchant-summary-label">{raw("Recorded uses")}</div>
          <div className="merchant-summary-value">{totalUsage}</div>
          <div className="merchant-summary-meta">{raw("Snapshot redemption counts across the current list")}</div>
        </div>
      </div>

      <div className="merchant-cluster-card">
        <div className="merchant-cluster-card-header">
          <div>
            <div className="card-title">{raw("Campaign library")}</div>
            <div className="card-subtitle">{raw("Store-scoped promotion list and current usage snapshot")}</div>
          </div>
          <div className="page-actions merchant-page-actions">
          <button
            className="btn btn-primary"
            disabled
            aria-disabled="true"
          >
            {raw("Creation Not Yet Available")}
          </button>
        </div>
        </div>

        <div className="data-table-wrapper">
          <table className="data-table merchant-data-table">
            <thead>
              <tr>
                <th>{raw("Name")}</th>
                <th>{raw("Code")}</th>
                <th>{raw("Type")}</th>
                <th>{raw("Discount")}</th>
                <th>{raw("Min. Order")}</th>
                <th>{raw("Usage")}</th>
                <th>{raw("Period")}</th>
                <th>{raw("Status")}</th>
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
                        {toDisplayTime(promo.startsAt, locale)}
                      </div>
                      <div
                        style={{
                          fontSize: "var(--text-xs)",
                          color: "var(--color-text-muted)",
                        }}
                      >
                        {raw("to {time}").replace("{time}", toDisplayTime(promo.expiresAt, locale))}
                      </div>
                    </td>
                    <td>
                      <span
                        className={`status-badge ${promo.active ? "active" : "inactive"}`}
                      >
                        <span className="status-dot" />
                        {promo.active ? raw("Active") : raw("Expired")}
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
