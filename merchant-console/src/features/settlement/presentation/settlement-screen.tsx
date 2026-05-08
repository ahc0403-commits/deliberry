"use client";

import { merchantFixtureFacade } from "../../../shared/data/merchant-query-services";
import { formatMoney, toDisplayTime } from "../../../shared/domain";
import { Sparkles, Store } from "lucide-react";
import type { SettlementData } from "../../../shared/data/merchant-repository";
import { useMerchantI18n } from "../../../shared/i18n/client";

type MerchantSettlementScreenProps = {
  storeId: string;
  initialData?: SettlementData;
  source?: "persisted" | "fixture";
};

export function MerchantSettlementScreen({
  storeId,
  initialData,
  source,
}: MerchantSettlementScreenProps) {
  const { locale, raw } = useMerchantI18n();
  const data = initialData ?? merchantFixtureFacade.getSettlementData(storeId);
  const dataSource = source ?? (initialData ? "persisted" : "fixture");

  const receivedRecords = data.records.filter((r) => r.status === "received");
  const totalReceived = receivedRecords.reduce((sum, r) => sum + r.netAmount, 0);
  const openAmount = data.records
    .filter((r) => r.status !== "received")
    .reduce((sum, r) => sum + r.netAmount, 0);
  const totalCommission = data.records.reduce((sum, r) => sum + r.commission, 0);
  const openCount = data.records.filter((r) => r.status !== "received").length;
  const statusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return raw("Pending");
      case "calculated":
        return raw("Calculated");
      case "received":
        return raw("Received");
      case "adjusted":
        return raw("Adjusted");
      case "disputed":
        return raw("Disputed");
      default:
        return raw(status);
    }
  };

  return (
    <div className="merchant-surface">
      <section className="merchant-hero merchant-hero-insights">
        <div className="merchant-hero-copy">
          <span className="merchant-eyebrow">{raw("Finance visibility")}</span>
          <h1 className="merchant-hero-title">{raw("Settlement")}</h1>
          <p className="merchant-hero-subtitle">
            {raw("Review payout history, commission summaries, and current settlement record status for the active store in the current read-only settlement phase.")}
          </p>
          <div className="merchant-context-row">
            <span className="merchant-context-pill">
              <Store size={14} />
              {data.store.name}
            </span>
            <span className="merchant-context-pill merchant-context-pill-muted">
              <Sparkles size={14} />
              {dataSource === "persisted"
                ? raw("Runtime-backed read-only visibility")
                : raw("Local read-only settlement snapshot")}
            </span>
          </div>
        </div>
        <div className="merchant-hero-panel">
          <div className="merchant-hero-panel-label">{raw("Payout snapshot")}</div>
          <div className="merchant-hero-panel-value">{formatMoney(totalReceived)}</div>
          <div className="merchant-hero-panel-text">
            {dataSource === "persisted"
              ? raw("Received and open totals are runtime-backed for the current store scope and remain read-only in this phase.")
              : raw("This local route is showing a read-only settlement snapshot so store-scoped development flows remain usable.")}
          </div>
        </div>
      </section>

      <div className="merchant-summary-band">
        <div className="merchant-summary-card">
          <div className="merchant-summary-label">{raw("Total received")}</div>
          <div className="merchant-summary-value">{formatMoney(totalReceived)}</div>
          <div className="merchant-summary-meta">{raw("Settlement rows marked received in the current table")}</div>
        </div>
        <div className="merchant-summary-card">
          <div className="merchant-summary-label">{raw("Open settlement value")}</div>
          <div className="merchant-summary-value">{formatMoney(openAmount)}</div>
          <div className="merchant-summary-meta">
            {raw(
              openCount === 1
                ? "{count} record not yet marked received"
                : "{count} records not yet marked received",
            ).replace("{count}", String(openCount))}
          </div>
        </div>
        <div className="merchant-summary-card">
          <div className="merchant-summary-label">{raw("Total commission")}</div>
          <div className="merchant-summary-value">{formatMoney(totalCommission)}</div>
          <div className="merchant-summary-meta">{raw("Read-only fee visibility, not a live reconciliation workflow")}</div>
        </div>
      </div>

      <div className="merchant-cluster-card">
        <div className="merchant-cluster-card-header">
          <div>
            <div className="card-title">{raw("Settlement history")}</div>
            <div className="card-subtitle">{raw("Store-scoped payout records and current status labels")}</div>
          </div>
          <div className="page-actions merchant-page-actions">
          <button
            className="btn btn-secondary"
            disabled
            aria-disabled="true"
          >
            {raw("Download Not Yet Available")}
          </button>
        </div>
        </div>

      <div className="settlement-summary merchant-settlement-summary">
        <div className="settlement-stat merchant-settlement-stat">
          <div className="settlement-stat-label">{raw("Total Received")}</div>
          <div className="settlement-stat-value">
            {formatMoney(totalReceived)}
          </div>
        </div>
        <div className="settlement-stat merchant-settlement-stat">
          <div className="settlement-stat-label">{raw("Open / Under Review")}</div>
          <div className="settlement-stat-value" style={{ color: "var(--color-warning)" }}>
            {formatMoney(openAmount)}
          </div>
        </div>
        <div className="settlement-stat merchant-settlement-stat">
          <div className="settlement-stat-label">{raw("Total Commission")}</div>
          <div className="settlement-stat-value" style={{ color: "var(--color-text-secondary)" }}>
            {formatMoney(totalCommission)}
          </div>
        </div>
      </div>

      <div className="card merchant-card">
        <div className="card-header">
          <div className="card-title">{raw("Settlement History")}</div>
        </div>
        <div className="data-table-wrapper">
          <table className="data-table merchant-data-table">
            <thead>
              <tr>
                <th>{raw("Period")}</th>
                <th>{raw("Orders")}</th>
                <th style={{ textAlign: "right" }}>{raw("Gross")}</th>
                <th style={{ textAlign: "right" }}>{raw("Commission (15%)")}</th>
                <th style={{ textAlign: "right" }}>{raw("Adjustments")}</th>
                <th style={{ textAlign: "right" }}>{raw("Net Payout")}</th>
                <th>{raw("Status")}</th>
                  <th>{raw("Received")}</th>
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
                      {statusLabel(record.status)}
                    </span>
                  </td>
                  <td>{record.receivedAt ? toDisplayTime(record.receivedAt, locale) : "\u2014"}</td>
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
