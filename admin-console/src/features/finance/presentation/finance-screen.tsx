import { ArrowRight, BadgeDollarSign, ReceiptText, ShieldAlert, WalletCards } from "lucide-react";
import { adminQueryServices } from "../../../shared/data/admin-query-services";
import { formatMoney } from "../../../shared/domain";

export function AdminFinanceScreen() {
  const { summary, settlements } = adminQueryServices.getFinanceData();

  return (
    <div className="screen-container oversight-shell">
      <section className="oversight-hero">
        <div className="oversight-hero-content">
          <div className="oversight-hero-copy">
            <div className="oversight-eyebrow">
              <BadgeDollarSign size={14} />
              Finance snapshot
            </div>
            <h1 className="oversight-title">Finance Oversight</h1>
            <p className="oversight-subtitle">
              Review platform financial indicators and recent settlement signals from one finance summary route without implying live reconciliation, payout control, or export integrations.
            </p>
          </div>
          <div className="oversight-hero-note">
            <div className="oversight-note-label">Finance mode</div>
            <div className="oversight-note-value">Snapshot review only</div>
            <p className="oversight-note-text">
              All finance summary rows are fixture-backed. This route stays focused on visibility and handoff, not live accounting operations.
            </p>
          </div>
        </div>
        <div className="oversight-hero-meta">
          <div className="oversight-meta-chip"><ReceiptText size={14} />{summary.length} summary signals</div>
          <div className="oversight-meta-chip"><WalletCards size={14} />{settlements.length} settlement rows</div>
          <div className="oversight-meta-chip"><ShieldAlert size={14} />Manual finance follow-through outside console</div>
        </div>
      </section>

      <section className="oversight-summary-grid">
        {summary.map((item) => (
          <div key={item.label} className="oversight-summary-card">
            <div className="oversight-summary-label"><BadgeDollarSign size={14} />{item.label}</div>
            <div className="oversight-summary-value">{item.value}</div>
            <div className="oversight-summary-meta">{item.period}</div>
          </div>
        ))}
      </section>

      <section className="oversight-panel">
        <div className="oversight-panel-header">
          <div>
            <h2 className="oversight-panel-title">Recent Settlements</h2>
            <p className="oversight-panel-subtitle">
              Settlement rows stay visible here as finance context so the summary route and settlement route remain aligned.
            </p>
          </div>
          <a href="/settlements" className="oversight-link">
            Open settlement oversight
            <ArrowRight size={14} />
          </a>
        </div>
        <div className="oversight-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Merchant</th>
                <th>Store</th>
                <th>Gross</th>
                <th>Commission</th>
                <th>Net</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {settlements.map((s) => (
                <tr key={s.id}>
                  <td>
                    <div className="oversight-row-primary">
                      <span className="oversight-row-title">{s.merchantName}</span>
                      <span className="oversight-row-meta">{s.periodStart} — {s.periodEnd}</span>
                    </div>
                  </td>
                  <td>{s.storeName}</td>
                  <td>{formatMoney(s.grossAmount)}</td>
                  <td className="text-muted">{formatMoney(s.commission)}</td>
                  <td style={{ fontWeight: 700 }}>{formatMoney(s.netAmount)}</td>
                  <td><span className={`status-badge status-badge--${s.status}`}>{s.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
