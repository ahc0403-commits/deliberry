import { ArrowRight, BanknoteArrowDown, CircleDollarSign, Landmark, Wallet } from "lucide-react";
import { adminQueryServices } from "../../../shared/data/admin-query-services";
import { formatMoney } from "../../../shared/domain";

export function AdminSettlementsScreen() {
  const { settlements } = adminQueryServices.getSettlementsData();

  const totalGross = settlements.reduce((acc, s) => acc + s.grossAmount, 0);
  const totalCommission = settlements.reduce((acc, s) => acc + s.commission, 0);
  const totalNet = settlements.reduce((acc, s) => acc + s.netAmount, 0);
  const pendingCount = settlements.filter((s) => s.status !== "paid").length;
  const paidCount = settlements.filter((s) => s.status === "paid").length;

  return (
    <div className="screen-container oversight-shell">
      <section className="oversight-hero">
        <div className="oversight-hero-content">
          <div className="oversight-hero-copy">
            <div className="oversight-eyebrow">
              <Landmark size={14} />
              Finance operations visibility
            </div>
            <h1 className="oversight-title">Settlement Oversight</h1>
            <p className="oversight-subtitle">
              Review payout volume, pending settlement pressure, and merchant settlement history from one finance-focused oversight route without implying live disbursement control.
            </p>
          </div>
          <div className="oversight-hero-note">
            <div className="oversight-note-label">Settlement mode</div>
            <div className="oversight-note-value">Read-only payout visibility</div>
            <p className="oversight-note-text">
              Settlement records are fixture-backed and read-only. This route is for status visibility and finance review, not live payout operations.
            </p>
          </div>
        </div>
        <div className="oversight-hero-meta">
          <div className="oversight-meta-chip"><BanknoteArrowDown size={14} />{paidCount} paid settlements</div>
          <div className="oversight-meta-chip"><Wallet size={14} />{pendingCount} pending or failed</div>
          <div className="oversight-meta-chip"><CircleDollarSign size={14} />{formatMoney(totalNet)} net merchant payout</div>
        </div>
      </section>

      <section className="oversight-summary-grid">
        <div className="oversight-summary-card">
          <div className="oversight-summary-label"><CircleDollarSign size={14} />Gross volume</div>
          <div className="oversight-summary-value">{formatMoney(totalGross)}</div>
          <div className="oversight-summary-meta">Combined gross settlement volume currently visible in the admin settlement read model.</div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label"><Wallet size={14} />Commission</div>
          <div className="oversight-summary-value">{formatMoney(totalCommission)}</div>
          <div className="oversight-summary-meta">Commission totals remain informative only and do not imply live reconciliation or posting flows.</div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label"><BanknoteArrowDown size={14} />Net to merchants</div>
          <div className="oversight-summary-value">{formatMoney(totalNet)}</div>
          <div className="oversight-summary-meta">Net payout remains a snapshot calculation from the fixture-backed settlement dataset.</div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label"><Landmark size={14} />Exceptions</div>
          <div className="oversight-summary-value">{pendingCount}</div>
          <div className="oversight-summary-meta">Pending, scheduled, processing, and failed settlement rows stay visible for review without operational controls.</div>
        </div>
      </section>

      <section className="oversight-panel">
        <div className="oversight-panel-header">
          <div>
            <h2 className="oversight-panel-title">Settlement History</h2>
            <p className="oversight-panel-subtitle">
              Merchant/store settlement records with period, payout shape, and current status grouped for faster finance review.
            </p>
          </div>
          <div className="table-inline-note">
            <ArrowRight size={13} />
            Snapshot history only
          </div>
        </div>
        <div className="oversight-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Merchant</th>
                <th>Store</th>
                <th>Period</th>
                <th>Gross</th>
                <th>Commission</th>
                <th>Net</th>
                <th>Status</th>
                <th>Paid At</th>
              </tr>
            </thead>
            <tbody>
              {settlements.map((s) => (
                <tr key={s.id}>
                  <td>
                    <div className="oversight-row-primary">
                      <span className="oversight-row-title">{s.merchantName}</span>
                      <span className="oversight-row-meta">{s.storeName}</span>
                    </div>
                  </td>
                  <td>{s.storeName}</td>
                  <td className="monospace">{s.periodStart} — {s.periodEnd}</td>
                  <td>{formatMoney(s.grossAmount)}</td>
                  <td className="text-muted">{formatMoney(s.commission)}</td>
                  <td style={{ fontWeight: 700 }}>{formatMoney(s.netAmount)}</td>
                  <td><span className={`status-badge status-badge--${s.status}`}>{s.status}</span></td>
                  <td className="text-muted">{s.paidAt || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
