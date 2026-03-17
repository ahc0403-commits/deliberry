import { merchantQueryServices } from "../../../shared/data/merchant-query-services";
import { formatMoney } from "../../../shared/domain";
import { Sparkles, Store } from "lucide-react";

type MerchantSettlementScreenProps = {
  storeId: string;
};

export function MerchantSettlementScreen({
  storeId,
}: MerchantSettlementScreenProps) {
  const data = merchantQueryServices.getSettlementData(storeId);

  const paidRecords = data.records.filter((r) => r.status === "paid");
  const totalPaid = paidRecords.reduce((sum, r) => sum + r.netAmount, 0);
  const pendingAmount = data.records
    .filter((r) => r.status !== "paid")
    .reduce((sum, r) => sum + r.netAmount, 0);
  const totalCommission = data.records.reduce((sum, r) => sum + r.commission, 0);
  const processingCount = data.records.filter((r) => r.status !== "paid").length;

  return (
    <div className="merchant-surface">
      <section className="merchant-hero merchant-hero-insights">
        <div className="merchant-hero-copy">
          <span className="merchant-eyebrow">Finance visibility</span>
          <h1 className="merchant-hero-title">Settlement</h1>
          <p className="merchant-hero-subtitle">
            Review payout history, commission summaries, and current processing status for the active store without implying a live settlement system.
          </p>
          <div className="merchant-context-row">
            <span className="merchant-context-pill">
              <Store size={14} />
              {data.store.name}
            </span>
            <span className="merchant-context-pill merchant-context-pill-muted">
              <Sparkles size={14} />
              Download actions remain preview-only
            </span>
          </div>
        </div>
        <div className="merchant-hero-panel">
          <div className="merchant-hero-panel-label">Payout snapshot</div>
          <div className="merchant-hero-panel-value">{formatMoney(totalPaid)}</div>
          <div className="merchant-hero-panel-text">
            Paid and processing totals are fixture-backed for the current store scope and remain read-only in this phase.
          </div>
        </div>
      </section>

      <div className="merchant-summary-band">
        <div className="merchant-summary-card">
          <div className="merchant-summary-label">Total paid</div>
          <div className="merchant-summary-value">{formatMoney(totalPaid)}</div>
          <div className="merchant-summary-meta">Completed payout records in the current table</div>
        </div>
        <div className="merchant-summary-card">
          <div className="merchant-summary-label">Processing or pending</div>
          <div className="merchant-summary-value">{formatMoney(pendingAmount)}</div>
          <div className="merchant-summary-meta">{processingCount} record{processingCount === 1 ? "" : "s"} not yet marked paid</div>
        </div>
        <div className="merchant-summary-card">
          <div className="merchant-summary-label">Total commission</div>
          <div className="merchant-summary-value">{formatMoney(totalCommission)}</div>
          <div className="merchant-summary-meta">Read-only fee visibility, not a live reconciliation workflow</div>
        </div>
      </div>

      <div className="merchant-cluster-card">
        <div className="merchant-cluster-card-header">
          <div>
            <div className="card-title">Settlement history</div>
            <div className="card-subtitle">Store-scoped payout records and current status labels</div>
          </div>
          <div className="page-actions merchant-page-actions">
          <button
            className="btn btn-secondary"
            disabled
            aria-disabled="true"
          >
            Download Preview Only
          </button>
        </div>
        </div>

      <div className="settlement-summary merchant-settlement-summary">
        <div className="settlement-stat merchant-settlement-stat">
          <div className="settlement-stat-label">Total Paid Out</div>
          <div className="settlement-stat-value">
            {formatMoney(totalPaid)}
          </div>
        </div>
        <div className="settlement-stat merchant-settlement-stat">
          <div className="settlement-stat-label">Pending / Processing</div>
          <div className="settlement-stat-value" style={{ color: "var(--color-warning)" }}>
            {formatMoney(pendingAmount)}
          </div>
        </div>
        <div className="settlement-stat merchant-settlement-stat">
          <div className="settlement-stat-label">Total Commission</div>
          <div className="settlement-stat-value" style={{ color: "var(--color-text-secondary)" }}>
            {formatMoney(totalCommission)}
          </div>
        </div>
      </div>

      <div className="card merchant-card">
        <div className="card-header">
          <div className="card-title">Settlement History</div>
        </div>
        <div className="data-table-wrapper">
          <table className="data-table merchant-data-table">
            <thead>
              <tr>
                <th>Period</th>
                <th>Orders</th>
                <th style={{ textAlign: "right" }}>Gross</th>
                <th style={{ textAlign: "right" }}>Commission (15%)</th>
                <th style={{ textAlign: "right" }}>Adjustments</th>
                <th style={{ textAlign: "right" }}>Net Payout</th>
                <th>Status</th>
                <th>Paid</th>
              </tr>
            </thead>
            <tbody>
              {data.records.map((record) => (
                <tr key={record.id}>
                  <td className="primary">{record.periodStart} — {record.periodEnd}</td>
                  <td>{record.orderCount}</td>
                  <td className="mono right">
                    {formatMoney(record.grossAmount)}
                  </td>
                  <td className="mono right" style={{ color: "var(--color-text-muted)" }}>
                    {formatMoney(-record.commission)}
                  </td>
                  <td className="mono right">
                    {record.adjustments === 0
                      ? "\u2014"
                      : formatMoney(record.adjustments)}
                  </td>
                  <td className="mono right" style={{ fontWeight: 700, color: "var(--color-text)" }}>
                    {formatMoney(record.netAmount)}
                  </td>
                  <td>
                    <span className={`status-badge ${record.status}`}>
                      <span className="status-dot" />
                      {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </span>
                  </td>
                  <td>{record.paidAt ?? "\u2014"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </div>
  );
}
