"use client";

import { ArrowRight, BadgeDollarSign, ReceiptText, ShieldAlert, WalletCards } from "lucide-react";
import { formatMoney } from "../../../shared/domain";
import type { FinanceData } from "../../../shared/data/admin-repository";
import { useAdminI18n } from "../../../shared/i18n/client";

export function AdminFinanceScreen({ data }: { data: FinanceData }) {
  const { raw } = useAdminI18n();
  const { summary, settlements } = data;
  const settlementStatusLabel = (status: string) =>
    raw(
      ({
        pending: "Pending",
        calculated: "Calculated",
        received: "Received",
        disputed: "Disputed",
        adjusted: "Adjusted",
      } as Record<string, string>)[status] ?? status,
    );
  return (
    <div className="screen-container oversight-shell">
      <section className="oversight-hero">
        <div className="oversight-hero-content">
          <div className="oversight-hero-copy">
            <div className="oversight-eyebrow">
              <BadgeDollarSign size={14} />
              {raw("Finance snapshot")}
            </div>
            <h1 className="oversight-title">{raw("Finance Oversight")}</h1>
            <p className="oversight-subtitle">
              {raw("Review platform financial indicators and recent settlement signals from one finance summary route without implying live reconciliation, payout control, or export integrations beyond manual received acknowledgment in settlement oversight.")}
            </p>
          </div>
          <div className="oversight-hero-note">
            <div className="oversight-note-label">{raw("Finance mode")}</div>
            <div className="oversight-note-value">{raw("Runtime-backed finance review")}</div>
            <p className="oversight-note-text">
              {raw("Finance summary rows are derived from the live settlement read model. This route stays focused on visibility and handoff; settlement acknowledgment remains limited to the settlement oversight route and does not execute payouts.")}
            </p>
          </div>
        </div>
        <div className="oversight-hero-meta">
          <div className="oversight-meta-chip"><ReceiptText size={14} />{raw("{count} summary signals").replace("{count}", String(summary.length))}</div>
          <div className="oversight-meta-chip"><WalletCards size={14} />{raw("{count} settlement rows").replace("{count}", String(settlements.length))}</div>
          <div className="oversight-meta-chip"><ShieldAlert size={14} />{raw("Manual finance follow-through outside console")}</div>
        </div>
      </section>

      <section className="oversight-summary-grid">
        {summary.map((item) => (
          <div key={item.label} className="oversight-summary-card">
            <div className="oversight-summary-label"><BadgeDollarSign size={14} />{raw(item.label)}</div>
            <div className="oversight-summary-value">{item.value}</div>
            <div className="oversight-summary-meta">{raw(item.period)}</div>
          </div>
        ))}
      </section>

      <section className="oversight-panel">
        <div className="oversight-panel-header">
          <div>
            <h2 className="oversight-panel-title">{raw("Recent Settlements")}</h2>
            <p className="oversight-panel-subtitle">
              {raw("Settlement rows stay visible here as finance context so the summary route and settlement route remain aligned.")}
            </p>
          </div>
          <a href="/settlements" className="oversight-link">
            {raw("Open settlement oversight")}
            <ArrowRight size={14} />
          </a>
        </div>
        <div className="oversight-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>{raw("Merchant")}</th>
                <th>{raw("Store")}</th>
                <th>{raw("Gross")}</th>
                <th>{raw("Commission")}</th>
                <th>{raw("Net")}</th>
                <th>{raw("Status")}</th>
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
                  <td><span className={`status-badge status-badge--${s.status}`}>{settlementStatusLabel(s.status)}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
