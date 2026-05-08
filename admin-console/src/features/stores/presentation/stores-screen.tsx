"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  Eye,
  MapPinned,
  ShieldCheck,
  Store,
  Star,
} from "lucide-react";

import type { PlatformStore } from "../../../shared/data/admin-mock-data";
import { toDisplayTime } from "../../../shared/domain";
import { useAdminI18n } from "../../../shared/i18n/client";
import { ProvisionMerchantStoreForm } from "./provision-merchant-store-form";

export function AdminStoresScreen({ stores }: { stores: PlatformStore[] }) {
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(stores[0]?.id ?? null);
  const { raw } = useAdminI18n();

  const openCount = stores.filter((s) => s.status === "open").length;
  const reviewCount = stores.filter((s) => s.status === "under_review").length;
  const avgRating = stores.length > 0
    ? (stores.reduce((acc, s) => acc + s.rating, 0) / stores.length).toFixed(1)
    : "0.0";
  const selectedStore = useMemo(
    () => stores.find((store) => store.id === selectedStoreId) ?? null,
    [selectedStoreId, stores],
  );

  return (
    <div className="screen-container oversight-shell">
      <section className="oversight-hero">
        <div className="oversight-hero-content">
          <div className="oversight-hero-copy">
            <div className="oversight-eyebrow">
              <Store size={14} />
              {raw("Store oversight")}
            </div>
            <h1 className="oversight-title">{raw("Store Governance")}</h1>
            <p className="oversight-subtitle">
              {raw("Review store availability, oversight status, service quality, and provision first-use merchant store access from one platform governance route.")}
            </p>
          </div>
          <div className="oversight-hero-note">
            <div className="oversight-note-label">{raw("Control mode")}</div>
            <div className="oversight-note-value">{raw("Runtime-backed inspection")}</div>
            <p className="oversight-note-text">
              {raw("Store records are persisted. Provisioning creates merchant ownership, and row-level inspect actions now open a read-only detail pane backed by runtime data.")}
            </p>
          </div>
        </div>
        <div className="oversight-hero-meta">
          <div className="oversight-meta-chip"><Store size={14} />{openCount} {raw("open stores")}</div>
          <div className="oversight-meta-chip"><ShieldCheck size={14} />{reviewCount} {raw("under review")}</div>
          <div className="oversight-meta-chip"><Star size={14} />{avgRating} {raw("average rating")}</div>
        </div>
      </section>

      <section className="oversight-summary-grid">
        <div className="oversight-summary-card">
          <div className="oversight-summary-label"><Store size={14} />{raw("Total stores")}</div>
          <div className="oversight-summary-value">{stores.length}</div>
          <div className="oversight-summary-meta">{raw("All store records currently visible in the admin store oversight dataset.")}</div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label"><MapPinned size={14} />{raw("Open now")}</div>
          <div className="oversight-summary-value">{openCount}</div>
          <div className="oversight-summary-meta">{raw("Open-state visibility helps separate active stores from paused and review-needed entries.")}</div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label"><ShieldCheck size={14} />{raw("Under review")}</div>
          <div className="oversight-summary-value">{reviewCount}</div>
          <div className="oversight-summary-meta">{raw("Stores under governance review stay grouped to support fast operational inspection.")}</div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label"><Star size={14} />{raw("Avg rating")}</div>
          <div className="oversight-summary-value">{avgRating}</div>
          <div className="oversight-summary-meta">{raw("Ratings remain informative only and are not tied to live moderation flows in this phase.")}</div>
        </div>
      </section>

      <ProvisionMerchantStoreForm />

      <div className={selectedStore ? "oversight-grid oversight-grid--detail" : "oversight-grid"}>
        <section className="oversight-panel">
          <div className="oversight-panel-header">
            <div>
              <h2 className="oversight-panel-title">{raw("Store Oversight Directory")}</h2>
              <p className="oversight-panel-subtitle">
                {raw("Merchant linkage, location context, status, and service signals are grouped for faster scanability and clearer inspection confidence.")}
              </p>
            </div>
            <div className="table-inline-note">
              <ArrowRight size={13} />
              {raw("Select a row to inspect runtime detail")}
            </div>
          </div>
          <div className="oversight-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{raw("Store Name")}</th>
                  <th>{raw("Merchant")}</th>
                  <th>{raw("Address")}</th>
                  <th>{raw("Status")}</th>
                  <th>{raw("Rating")}</th>
                  <th>{raw("Total Orders")}</th>
                  <th>{raw("Last Active")}</th>
                  <th>{raw("Actions")}</th>
                </tr>
              </thead>
              <tbody>
                {stores.map((store) => (
                  <tr
                    key={store.id}
                    className={`data-table-row-clickable${selectedStore?.id === store.id ? " row-selected" : ""}`}
                    onClick={() => setSelectedStoreId(selectedStore?.id === store.id ? null : store.id)}
                  >
                    <td>
                      <div className="oversight-row-primary">
                        <span className="oversight-row-title">{store.name}</span>
                        <span className="oversight-row-meta">{store.merchantName}</span>
                      </div>
                    </td>
                    <td>{store.merchantName}</td>
                    <td className="text-muted">{store.address}</td>
                    <td><span className={`status-badge status-badge--${statusBadgeTone(store.status)}`}>{store.status.replace("_", " ")}</span></td>
                    <td>⭐ {store.rating}</td>
                    <td>{store.totalOrders.toLocaleString()}</td>
                    <td className="text-muted">{toDisplayTime(store.lastActive)}</td>
                    <td className="actions">
                      <button
                        className="btn-secondary btn-sm"
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setSelectedStoreId(selectedStore?.id === store.id ? null : store.id);
                        }}
                      >
                        <Eye size={14} />
                        {selectedStore?.id === store.id ? raw("Close") : raw("Inspect")}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {selectedStore ? (
          <aside className="oversight-panel">
            <div className="oversight-panel-header">
              <div>
                <h3 className="oversight-panel-title">{raw("Store Review Pane")}</h3>
                <p className="oversight-panel-subtitle">
                  {raw("Runtime-backed store detail for governance review. This panel stays intentionally non-mutating.")}
                </p>
              </div>
              <button className="btn-secondary btn-sm" onClick={() => setSelectedStoreId(null)}>{raw("Close")}</button>
            </div>
            <div className="oversight-pane">
              <div className="oversight-review-banner">
                <div>
                  <div className="oversight-review-label">{raw("Review mode")}</div>
                  <div className="oversight-review-title">{raw(storeReviewTone(selectedStore))}</div>
                </div>
                <div className="oversight-review-chips">
                  <span className="btn-preview">{selectedStore.status.replace("_", " ")}</span>
                  <span className="btn-preview">{selectedStore.acceptingOrders ? raw("Accepting orders") : raw("Intake paused")}</span>
                </div>
              </div>

              <div className="oversight-pane-card">
                <div className="oversight-pane-grid">
                  <div className="oversight-pane-stat">
                    <div className="oversight-pane-stat-label">{raw("Store")}</div>
                    <div className="oversight-pane-stat-value">{selectedStore.name}</div>
                  </div>
                  <div className="oversight-pane-stat">
                    <div className="oversight-pane-stat-label">{raw("Merchant")}</div>
                    <div className="oversight-pane-stat-value">{selectedStore.merchantName}</div>
                  </div>
                  <div className="oversight-pane-stat">
                    <div className="oversight-pane-stat-label">{raw("Status")}</div>
                    <div className="oversight-pane-stat-value">
                      <span className={`status-badge status-badge--${statusBadgeTone(selectedStore.status)}`}>{selectedStore.status.replace("_", " ")}</span>
                    </div>
                  </div>
                  <div className="oversight-pane-stat">
                    <div className="oversight-pane-stat-label">{raw("Rating")}</div>
                    <div className="oversight-pane-stat-value">⭐ {selectedStore.rating} ({selectedStore.reviewCount ?? 0})</div>
                  </div>
                </div>
              </div>

              <div className="oversight-pane-card">
                <div className="oversight-pane-section-title">{raw("Operational context")}</div>
                <div className="oversight-pane-grid">
                  <div className="oversight-pane-stat">
                    <div className="oversight-pane-stat-label">{raw("Address")}</div>
                    <div className="oversight-pane-stat-value">{selectedStore.address}</div>
                  </div>
                  <div className="oversight-pane-stat">
                    <div className="oversight-pane-stat-label">{raw("City")}</div>
                    <div className="oversight-pane-stat-value">{selectedStore.city ?? raw("City unavailable")}</div>
                  </div>
                  <div className="oversight-pane-stat">
                    <div className="oversight-pane-stat-label">{raw("Cuisine type")}</div>
                    <div className="oversight-pane-stat-value">{selectedStore.cuisineType ?? raw("Cuisine not set")}</div>
                  </div>
                  <div className="oversight-pane-stat">
                    <div className="oversight-pane-stat-label">{raw("Delivery radius")}</div>
                    <div className="oversight-pane-stat-value">{selectedStore.deliveryRadius ?? raw("Radius unavailable")}</div>
                  </div>
                  <div className="oversight-pane-stat">
                    <div className="oversight-pane-stat-label">{raw("Average prep time")}</div>
                    <div className="oversight-pane-stat-value">{selectedStore.avgPrepTime ?? raw("Prep time unavailable")}</div>
                  </div>
                  <div className="oversight-pane-stat">
                    <div className="oversight-pane-stat-label">{raw("Provisioned")}</div>
                    <div className="oversight-pane-stat-value">{toDisplayTime(selectedStore.provisionedAt ?? selectedStore.createdAt ?? selectedStore.lastActive)}</div>
                  </div>
                </div>
              </div>

              <div className="oversight-pane-card">
                <div className="oversight-pane-section-title">{raw("Demand and customer signal")}</div>
                <div className="oversight-pane-grid">
                  <div className="oversight-pane-stat">
                    <div className="oversight-pane-stat-label">{raw("Total Orders")}</div>
                    <div className="oversight-pane-stat-value">{selectedStore.totalOrders.toLocaleString()}</div>
                  </div>
                  <div className="oversight-pane-stat">
                    <div className="oversight-pane-stat-label">{raw("Active queue")}</div>
                    <div className="oversight-pane-stat-value">{(selectedStore.activeOrders ?? 0).toLocaleString()}</div>
                  </div>
                  <div className="oversight-pane-stat">
                    <div className="oversight-pane-stat-label">{raw("Completed deliveries")}</div>
                    <div className="oversight-pane-stat-value">{(selectedStore.completedOrders ?? 0).toLocaleString()}</div>
                  </div>
                  <div className="oversight-pane-stat">
                    <div className="oversight-pane-stat-label">{raw("Exceptions")}</div>
                    <div className="oversight-pane-stat-value">{(selectedStore.exceptionOrders ?? 0).toLocaleString()}</div>
                  </div>
                  <div className="oversight-pane-stat">
                    <div className="oversight-pane-stat-label">{raw("Last order seen")}</div>
                    <div className="oversight-pane-stat-value">
                      {selectedStore.latestOrderAt ? toDisplayTime(selectedStore.latestOrderAt) : raw("No order activity yet")}
                    </div>
                  </div>
                  <div className="oversight-pane-stat">
                    <div className="oversight-pane-stat-label">{raw("Last active")}</div>
                    <div className="oversight-pane-stat-value">{toDisplayTime(selectedStore.lastActive)}</div>
                  </div>
                </div>
              </div>

              <div className="oversight-note">
                {raw("Admin store review stays read-only on this route. Use the provisioning flow to create first-use access, then coordinate merchant-side store changes through the owned merchant console workflows.")}
              </div>

              <div className="oversight-actions">
                <span className="oversight-actions-label">{raw("Inspection cues")}</span>
                <div className="oversight-actions-list">
                  <span className="btn-preview">{selectedStore.isOpen ? raw("Customer-visible shell") : raw("Not customer-visible")}</span>
                  <span className="btn-preview">{selectedStore.acceptingOrders ? raw("Intake enabled") : raw("Intake paused")}</span>
                  <span className="btn-preview">{selectedStore.provisionedAt ? raw("Provisioned from admin") : raw("Legacy runtime record")}</span>
                </div>
              </div>
            </div>
          </aside>
        ) : null}
      </div>
    </div>
  );
}

function statusBadgeTone(status: PlatformStore["status"]) {
  if (status === "open") return "active";
  if (status === "closed") return "closed";
  if (status === "paused") return "pending";
  return "under_review";
}

function storeReviewTone(store: PlatformStore) {
  if (store.status === "under_review") return "Governance hold";
  if (!store.acceptingOrders || store.status === "paused") return "Intake paused";
  if ((store.exceptionOrders ?? 0) > 0) return "Exception watch";
  return "Healthy runtime posture";
}
