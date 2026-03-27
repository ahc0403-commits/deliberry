import { ArrowRight, MapPinned, ShieldCheck, Store, Star } from "lucide-react";
import type { PlatformStore } from "../../../shared/data/admin-mock-data";

export function AdminStoresScreen({ stores }: { stores: PlatformStore[] }) {
  const openCount = stores.filter((s) => s.status === "open").length;
  const reviewCount = stores.filter((s) => s.status === "under_review").length;
  const avgRating = (stores.reduce((acc, s) => acc + s.rating, 0) / stores.length).toFixed(1);

  return (
    <div className="screen-container oversight-shell">
      <section className="oversight-hero">
        <div className="oversight-hero-content">
          <div className="oversight-hero-copy">
            <div className="oversight-eyebrow">
              <Store size={14} />
              Store oversight
            </div>
            <h1 className="oversight-title">Store Governance</h1>
            <p className="oversight-subtitle">
              Review store availability, oversight status, and service quality from one platform visibility route without implying live operational control.
            </p>
          </div>
          <div className="oversight-hero-note">
            <div className="oversight-note-label">Control mode</div>
            <div className="oversight-note-value">Inspection-only storefront view</div>
            <p className="oversight-note-text">
              Store records are persisted. Inspect actions remain preview-only so this route stays truthful about current read-first operational control.
            </p>
          </div>
        </div>
        <div className="oversight-hero-meta">
          <div className="oversight-meta-chip"><Store size={14} />{openCount} open stores</div>
          <div className="oversight-meta-chip"><ShieldCheck size={14} />{reviewCount} under review</div>
          <div className="oversight-meta-chip"><Star size={14} />{avgRating} average rating</div>
        </div>
      </section>

      <section className="oversight-summary-grid">
        <div className="oversight-summary-card">
          <div className="oversight-summary-label"><Store size={14} />Total stores</div>
          <div className="oversight-summary-value">{stores.length}</div>
          <div className="oversight-summary-meta">All store records currently visible in the admin store oversight dataset.</div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label"><MapPinned size={14} />Open now</div>
          <div className="oversight-summary-value">{openCount}</div>
          <div className="oversight-summary-meta">Open-state visibility helps separate active stores from paused and review-needed entries.</div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label"><ShieldCheck size={14} />Under review</div>
          <div className="oversight-summary-value">{reviewCount}</div>
          <div className="oversight-summary-meta">Stores under governance review stay grouped to support fast operational inspection.</div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label"><Star size={14} />Avg rating</div>
          <div className="oversight-summary-value">{avgRating}</div>
          <div className="oversight-summary-meta">Ratings remain informative only and are not tied to live moderation flows in this phase.</div>
        </div>
      </section>

      <section className="oversight-panel">
        <div className="oversight-panel-header">
          <div>
            <h2 className="oversight-panel-title">Store Oversight Directory</h2>
            <p className="oversight-panel-subtitle">
              Merchant linkage, location context, status, and service signals are grouped for faster scanability and clearer inspection confidence.
            </p>
          </div>
          <div className="table-inline-note">
            <ArrowRight size={13} />
            Inspect actions stay preview-only
          </div>
        </div>
        <div className="oversight-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Store Name</th>
                <th>Merchant</th>
                <th>Address</th>
                <th>Status</th>
                <th>Rating</th>
                <th>Total Orders</th>
                <th>Last Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stores.map((store) => (
                <tr key={store.id}>
                  <td>
                    <div className="oversight-row-primary">
                      <span className="oversight-row-title">{store.name}</span>
                      <span className="oversight-row-meta">{store.merchantName}</span>
                    </div>
                  </td>
                  <td>{store.merchantName}</td>
                  <td className="text-muted">{store.address}</td>
                  <td><span className={`status-badge status-badge--${store.status === "open" ? "active" : store.status === "closed" ? "closed" : store.status === "paused" ? "pending" : "under_review"}`}>{store.status.replace("_", " ")}</span></td>
                  <td>⭐ {store.rating}</td>
                  <td>{store.totalOrders.toLocaleString()}</td>
                  <td className="text-muted">{store.lastActive}</td>
                  <td><span className="btn-preview">Inspect preview</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
