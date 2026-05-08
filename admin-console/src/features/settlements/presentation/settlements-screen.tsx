"use client";

import { ArrowRight, BanknoteArrowDown, CircleDollarSign, Landmark, Wallet } from "lucide-react";
import { formatMoney, toDisplayTime } from "../../../shared/domain";
import type { PlatformSettlement } from "../../../shared/data/admin-mock-data";
import { SettlementActionCell } from "./settlement-action-cell";
import { useAdminI18n } from "../../../shared/i18n/client";

export function AdminSettlementsScreen({
  settlements,
}: {
  settlements: PlatformSettlement[];
}) {
  const { raw, locale } = useAdminI18n();
  const totalGross = settlements.reduce((acc, s) => acc + s.grossAmount, 0);
  const totalCommission = settlements.reduce((acc, s) => acc + s.commission, 0);
  const totalNet = settlements.reduce((acc, s) => acc + s.netAmount, 0);
  const openCount = settlements.filter((s) => s.status !== "received").length;
  const receivedCount = settlements.filter((s) => s.status === "received").length;
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
              <Landmark size={14} />
              {raw("Finance operations visibility")}
            </div>
            <h1 className="oversight-title">{raw("Settlement Oversight")}</h1>
            <p className="oversight-subtitle">
              {raw("Review payout volume, pending settlement pressure, and merchant settlement history from one finance-focused oversight route, while limiting mutation to manual received acknowledgment only.")}
            </p>
          </div>
          <div className="oversight-hero-note">
            <div className="oversight-note-label">{raw("Settlement mode")}</div>
            <div className="oversight-note-value">{raw("Visibility plus manual acknowledgment")}</div>
            <p className="oversight-note-text">
              {raw("Settlement records are runtime-backed. Finance can acknowledge a calculated settlement as received after manual reconciliation, but this route still does not execute payouts, refunds, or payment-state verification.")}
            </p>
          </div>
        </div>
        <div className="oversight-hero-meta">
          <div className="oversight-meta-chip"><BanknoteArrowDown size={14} />{raw("{count} received settlements").replace("{count}", String(receivedCount))}</div>
          <div className="oversight-meta-chip"><Wallet size={14} />{raw("{count} open or under-review records").replace("{count}", String(openCount))}</div>
          <div className="oversight-meta-chip"><CircleDollarSign size={14} />{raw("{amount} net merchant payout").replace("{amount}", formatMoney(totalNet))}</div>
        </div>
      </section>

      <section className="oversight-summary-grid">
        <div className="oversight-summary-card">
          <div className="oversight-summary-label"><CircleDollarSign size={14} />{raw("Gross volume")}</div>
          <div className="oversight-summary-value">{formatMoney(totalGross)}</div>
          <div className="oversight-summary-meta">{raw("Combined gross settlement volume currently visible in the admin settlement read model.")}</div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label"><Wallet size={14} />{raw("Commission")}</div>
          <div className="oversight-summary-value">{formatMoney(totalCommission)}</div>
          <div className="oversight-summary-meta">{raw("Commission totals remain informative only and do not imply live posting, payout execution, or payment reconciliation flows.")}</div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label"><BanknoteArrowDown size={14} />{raw("Net to merchants")}</div>
          <div className="oversight-summary-value">{formatMoney(totalNet)}</div>
          <div className="oversight-summary-meta">{raw("Net payout is recalculated from the current settlement read model.")}</div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label"><Landmark size={14} />{raw("Exceptions")}</div>
          <div className="oversight-summary-value">{openCount}</div>
          <div className="oversight-summary-meta">{raw("Pending, calculated, disputed, and adjusted settlement rows stay visible for review without operational controls.")}</div>
        </div>
      </section>

      <section className="oversight-panel">
        <div className="oversight-panel-header">
          <div>
            <h2 className="oversight-panel-title">{raw("Settlement History")}</h2>
            <p className="oversight-panel-subtitle">
              {raw("Merchant/store settlement records with period, payout shape, and current status grouped for faster finance review and narrow acknowledgment handling.")}
            </p>
          </div>
          <div className="table-inline-note">
            <ArrowRight size={13} />
            {raw("Received acknowledgment only")}
          </div>
        </div>
        <div className="oversight-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>{raw("Merchant")}</th>
                <th>{raw("Store")}</th>
                <th>{raw("Period")}</th>
                <th>{raw("Gross")}</th>
                <th>{raw("Commission")}</th>
                <th>{raw("Net")}</th>
                <th>{raw("Status")}</th>
                <th>{raw("Received At")}</th>
                <th>{raw("Actions")}</th>
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
                  <td><span className={`status-badge status-badge--${s.status}`}>{settlementStatusLabel(s.status)}</span></td>
                  <td className="text-muted">{s.receivedAt ? toDisplayTime(s.receivedAt, locale) : raw("—")}</td>
                  <td><SettlementActionCell settlementId={s.id} status={s.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
