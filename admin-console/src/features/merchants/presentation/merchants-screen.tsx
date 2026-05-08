"use client";

import { useMemo, useState } from "react";
import { ArrowRight, BadgeCheck, Building2, ClipboardCheck, Eye, Store } from "lucide-react";

import type { PlatformMerchant } from "../../../shared/data/admin-mock-data";
import { formatMoney, toDisplayTime } from "../../../shared/domain";
import { useAdminI18n } from "../../../shared/i18n/client";

export function AdminMerchantsScreen({ merchants }: { merchants: PlatformMerchant[] }) {
  const [selectedMerchantId, setSelectedMerchantId] = useState<string | null>(merchants[0]?.id ?? null);
  const { raw } = useAdminI18n();

  const activeCount = merchants.filter((m) => m.status === "active").length;
  const pendingCount = merchants.filter((m) => m.status === "pending_review").length;
  const complianceCount = merchants.filter((m) => m.compliance !== "compliant").length;
  const selectedMerchant = useMemo(
    () => merchants.find((merchant) => merchant.id === selectedMerchantId) ?? null,
    [merchants, selectedMerchantId],
  );

  return (
    <div className="screen-container oversight-shell">
      <section className="oversight-hero">
        <div className="oversight-hero-content">
          <div className="oversight-hero-copy">
            <div className="oversight-eyebrow">
              <Building2 size={14} />
              {raw("Merchant oversight")}
            </div>
            <h1 className="oversight-title">{raw("Merchant Governance")}</h1>
            <p className="oversight-subtitle">
              {raw("Review onboarding pressure, compliance status, and merchant footprint from the same admin oversight system as dashboard, orders, and disputes.")}
            </p>
          </div>
          <div className="oversight-hero-note">
            <div className="oversight-note-label">{raw("Governance mode")}</div>
            <div className="oversight-note-value">{raw("Runtime-backed merchant review")}</div>
            <p className="oversight-note-text">
              {raw("Merchant records are runtime-backed. Review rows open a read-only detail pane, while merchant creation remains owned by the store provisioning route.")}
            </p>
          </div>
        </div>
        <div className="oversight-hero-meta">
          <div className="oversight-meta-chip"><BadgeCheck size={14} />{activeCount} {raw("active merchants")}</div>
          <div className="oversight-meta-chip"><ClipboardCheck size={14} />{pendingCount} {raw("pending review")}</div>
          <div className="oversight-meta-chip"><Store size={14} />{merchants.reduce((sum, merchant) => sum + merchant.storeCount, 0)} {raw("stores in scope")}</div>
        </div>
      </section>

      <section className="oversight-summary-grid">
        <div className="oversight-summary-card">
          <div className="oversight-summary-label"><Building2 size={14} />{raw("Total merchants")}</div>
          <div className="oversight-summary-value">{merchants.length}</div>
          <div className="oversight-summary-meta">{raw("All merchant entities visible from the current admin read model.")}</div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label"><BadgeCheck size={14} />{raw("Active")}</div>
          <div className="oversight-summary-value">{activeCount}</div>
          <div className="oversight-summary-meta">{raw("Active merchants remain grouped for quick operational confidence checks.")}</div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label"><ClipboardCheck size={14} />{raw("Pending review")}</div>
          <div className="oversight-summary-value">{pendingCount}</div>
          <div className="oversight-summary-meta">{raw("Review-needed merchants are surfaced directly instead of being buried in the full directory.")}</div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label"><Store size={14} />{raw("Compliance issues")}</div>
          <div className="oversight-summary-value">{complianceCount}</div>
          <div className="oversight-summary-meta">{raw("Non-compliant or review-needed merchant records remain informative only in this phase.")}</div>
        </div>
      </section>

      <div className={selectedMerchant ? "oversight-grid oversight-grid--detail" : "oversight-grid"}>
        <section className="oversight-panel">
          <div className="oversight-panel-header">
            <div>
              <h2 className="oversight-panel-title">{raw("Merchant Oversight Directory")}</h2>
              <p className="oversight-panel-subtitle">
                {raw("Business footprint, compliance, and commercial performance are grouped here for review confidence without suggesting live merchant management writes.")}
              </p>
            </div>
            <div className="table-inline-note">
              <ArrowRight size={13} />
              {raw("Select a merchant to inspect runtime detail")}
            </div>
          </div>
          <div className="oversight-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{raw("Business Name")}</th>
                  <th>{raw("Owner")}</th>
                  <th>{raw("Email")}</th>
                  <th>{raw("Stores")}</th>
                  <th>{raw("Status")}</th>
                  <th>{raw("Compliance")}</th>
                  <th>{raw("Revenue")}</th>
                  <th>{raw("Joined")}</th>
                  <th>{raw("Actions")}</th>
                </tr>
              </thead>
              <tbody>
                {merchants.map((merchant) => (
                  <tr
                    key={merchant.id}
                    className={`data-table-row-clickable${selectedMerchant?.id === merchant.id ? " row-selected" : ""}`}
                    onClick={() => setSelectedMerchantId(selectedMerchant?.id === merchant.id ? null : merchant.id)}
                  >
                    <td>
                      <div className="oversight-row-primary">
                        <span className="oversight-row-title">{merchant.businessName}</span>
                        <span className="oversight-row-meta">{merchant.ownerName}</span>
                      </div>
                    </td>
                    <td>{merchant.ownerName}</td>
                    <td className="text-muted">{merchant.email}</td>
                    <td>{merchant.storeCount}</td>
                    <td><span className={`status-badge status-badge--${merchant.status}`}>{merchant.status.replace("_", " ")}</span></td>
                    <td><span className={`status-badge status-badge--${complianceTone(merchant.compliance)}`}>{merchant.compliance.replace("_", " ")}</span></td>
                    <td>{formatMoney(merchant.totalRevenue)}</td>
                    <td className="text-muted">{toDisplayTime(merchant.joinedAt)}</td>
                    <td className="actions">
                      <button
                        className="btn-secondary btn-sm"
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setSelectedMerchantId(selectedMerchant?.id === merchant.id ? null : merchant.id);
                        }}
                      >
                        <Eye size={14} />
                        {selectedMerchant?.id === merchant.id ? raw("Close") : raw("Inspect")}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {selectedMerchant ? (
          <aside className="oversight-panel">
            <div className="oversight-panel-header">
              <div>
                <h3 className="oversight-panel-title">{raw("Merchant Review Pane")}</h3>
                <p className="oversight-panel-subtitle">
                  {raw("Runtime-backed merchant detail for governance review. This panel stays intentionally non-mutating.")}
                </p>
              </div>
              <button className="btn-secondary btn-sm" onClick={() => setSelectedMerchantId(null)}>{raw("Close")}</button>
            </div>
            <div className="oversight-pane">
              <div className="oversight-review-banner">
                <div>
                  <div className="oversight-review-label">{raw("Review mode")}</div>
                  <div className="oversight-review-title">{raw(merchantReviewTone(selectedMerchant))}</div>
                </div>
                <div className="oversight-review-chips">
                  <span className="btn-preview">{selectedMerchant.status.replace("_", " ")}</span>
                  <span className="btn-preview">{selectedMerchant.compliance.replace("_", " ")}</span>
                </div>
              </div>

              <div className="oversight-pane-card">
                <div className="oversight-pane-grid">
                  <div className="oversight-pane-stat">
                    <div className="oversight-pane-stat-label">{raw("Business Name")}</div>
                    <div className="oversight-pane-stat-value">{selectedMerchant.businessName}</div>
                  </div>
                  <div className="oversight-pane-stat">
                    <div className="oversight-pane-stat-label">{raw("Owner")}</div>
                    <div className="oversight-pane-stat-value">{selectedMerchant.ownerName}</div>
                  </div>
                  <div className="oversight-pane-stat">
                    <div className="oversight-pane-stat-label">{raw("Status")}</div>
                    <div className="oversight-pane-stat-value">
                      <span className={`status-badge status-badge--${selectedMerchant.status}`}>{selectedMerchant.status.replace("_", " ")}</span>
                    </div>
                  </div>
                  <div className="oversight-pane-stat">
                    <div className="oversight-pane-stat-label">{raw("Compliance")}</div>
                    <div className="oversight-pane-stat-value">
                      <span className={`status-badge status-badge--${complianceTone(selectedMerchant.compliance)}`}>{selectedMerchant.compliance.replace("_", " ")}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="oversight-pane-card">
                <div className="oversight-pane-section-title">{raw("Operational context")}</div>
                <div className="oversight-pane-grid">
                  <div className="oversight-pane-stat">
                    <div className="oversight-pane-stat-label">{raw("Email")}</div>
                    <div className="oversight-pane-stat-value">{selectedMerchant.email}</div>
                  </div>
                  <div className="oversight-pane-stat">
                    <div className="oversight-pane-stat-label">{raw("Phone")}</div>
                    <div className="oversight-pane-stat-value">{selectedMerchant.phoneNumber ?? raw("Phone unavailable")}</div>
                  </div>
                  <div className="oversight-pane-stat">
                    <div className="oversight-pane-stat-label">{raw("Joined")}</div>
                    <div className="oversight-pane-stat-value">{toDisplayTime(selectedMerchant.joinedAt)}</div>
                  </div>
                  <div className="oversight-pane-stat">
                    <div className="oversight-pane-stat-label">{raw("Last active")}</div>
                    <div className="oversight-pane-stat-value">
                      {selectedMerchant.lastActive ? toDisplayTime(selectedMerchant.lastActive) : raw("Activity unavailable")}
                    </div>
                  </div>
                  <div className="oversight-pane-stat">
                    <div className="oversight-pane-stat-label">{raw("Latest store activity")}</div>
                    <div className="oversight-pane-stat-value">
                      {selectedMerchant.latestStoreActivity ? toDisplayTime(selectedMerchant.latestStoreActivity) : raw("No store activity yet")}
                    </div>
                  </div>
                  <div className="oversight-pane-stat">
                    <div className="oversight-pane-stat-label">{raw("Latest provisioned store")}</div>
                    <div className="oversight-pane-stat-value">
                      {selectedMerchant.latestProvisionedAt ? toDisplayTime(selectedMerchant.latestProvisionedAt) : raw("No admin provisioning evidence")}
                    </div>
                  </div>
                </div>
              </div>

              <div className="oversight-pane-card">
                <div className="oversight-pane-section-title">{raw("Merchant footprint and demand")}</div>
                <div className="oversight-pane-grid">
                  <div className="oversight-pane-stat">
                    <div className="oversight-pane-stat-label">{raw("Stores")}</div>
                    <div className="oversight-pane-stat-value">{selectedMerchant.storeCount}</div>
                  </div>
                  <div className="oversight-pane-stat">
                    <div className="oversight-pane-stat-label">{raw("Open stores")}</div>
                    <div className="oversight-pane-stat-value">{selectedMerchant.activeStoreCount ?? 0}</div>
                  </div>
                  <div className="oversight-pane-stat">
                    <div className="oversight-pane-stat-label">{raw("Paused stores")}</div>
                    <div className="oversight-pane-stat-value">{selectedMerchant.pausedStoreCount ?? 0}</div>
                  </div>
                  <div className="oversight-pane-stat">
                    <div className="oversight-pane-stat-label">{raw("Stores under review")}</div>
                    <div className="oversight-pane-stat-value">{selectedMerchant.reviewStoreCount ?? 0}</div>
                  </div>
                  <div className="oversight-pane-stat">
                    <div className="oversight-pane-stat-label">{raw("Active queue")}</div>
                    <div className="oversight-pane-stat-value">{selectedMerchant.activeOrders ?? 0}</div>
                  </div>
                  <div className="oversight-pane-stat">
                    <div className="oversight-pane-stat-label">{raw("Exceptions")}</div>
                    <div className="oversight-pane-stat-value">{selectedMerchant.exceptionOrders ?? 0}</div>
                  </div>
                  <div className="oversight-pane-stat">
                    <div className="oversight-pane-stat-label">{raw("Revenue")}</div>
                    <div className="oversight-pane-stat-value">{formatMoney(selectedMerchant.totalRevenue)}</div>
                  </div>
                </div>
              </div>

              <div className="oversight-note">
                {raw("Admin merchant review stays read-only on this route. Use the stores route to provision first-use access, then manage storefront operations through the owned merchant console workflows.")}
              </div>

              <div className="oversight-actions">
                <span className="oversight-actions-label">{raw("Inspection cues")}</span>
                <div className="oversight-actions-list">
                  <span className="btn-preview">{selectedMerchant.storeCount > 0 ? raw("Store footprint present") : raw("No stores yet")}</span>
                  <span className="btn-preview">{(selectedMerchant.reviewStoreCount ?? 0) > 0 ? raw("Store review follow-up") : raw("No store review hold")}</span>
                  <span className="btn-preview">{(selectedMerchant.exceptionOrders ?? 0) > 0 ? raw("Order exceptions visible") : raw("No visible order exceptions")}</span>
                </div>
              </div>
            </div>
          </aside>
        ) : null}
      </div>
    </div>
  );
}

function complianceTone(compliance: PlatformMerchant["compliance"]) {
  if (compliance === "compliant") return "active";
  if (compliance === "review_needed") return "pending";
  return "suspended";
}

function merchantReviewTone(merchant: PlatformMerchant) {
  if (merchant.status === "pending_review") return "Onboarding review";
  if (merchant.compliance === "non_compliant") return "Compliance hold";
  if ((merchant.reviewStoreCount ?? 0) > 0) return "Store governance follow-up";
  if ((merchant.exceptionOrders ?? 0) > 0) return "Exception watch";
  return "Healthy merchant posture";
}
