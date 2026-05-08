"use client";

import { BookOpenText, LayoutGrid, PackageSearch, Store } from "lucide-react";
import { adminFixtureFacade } from "../../../shared/data/admin-query-services";
import { useAdminI18n } from "../../../shared/i18n/client";

export function AdminCatalogScreen() {
  const { locale, raw } = useAdminI18n();
  const { categories } = adminFixtureFacade.getCatalogData();

  const totalStores = categories.reduce((acc, c) => acc + c.storeCount, 0);
  const totalItems = categories.reduce((acc, c) => acc + c.itemCount, 0);
  const activeCount = categories.filter((cat) => cat.status === "active").length;
  const statusLabel = (status: string) => {
    switch (status) {
      case "active":
        return raw("Active");
      case "hidden":
        return raw("Hidden");
      case "under_review":
        return raw("Under review");
      default:
        return raw(status);
    }
  };

  return (
    <div className="screen-container oversight-shell">
      <section className="oversight-hero">
        <div className="oversight-hero-content">
          <div className="oversight-hero-copy">
            <div className="oversight-eyebrow">
              <BookOpenText size={14} />
              {raw("Catalog governance")}
            </div>
            <h1 className="oversight-title">{raw("Catalog")}</h1>
            <p className="oversight-subtitle">
              {raw("Review category visibility, store coverage, and catalog footprint from one governance route without implying live catalog management or publishing control.")}
            </p>
          </div>
          <div className="oversight-hero-note">
            <div className="oversight-note-label">{raw("Catalog mode")}</div>
            <div className="oversight-note-value">{raw("Preview-only category oversight")}</div>
            <p className="oversight-note-text">
              {raw("Category rows are fixture-backed and management controls stay explicitly non-operational in this admin phase.")}
            </p>
          </div>
        </div>
        <div className="oversight-hero-meta">
          <div className="oversight-meta-chip"><LayoutGrid size={14} />{raw("{count} categories").replace("{count}", String(categories.length))}</div>
          <div className="oversight-meta-chip"><Store size={14} />{raw("{count} store mappings").replace("{count}", String(totalStores))}</div>
          <div className="oversight-meta-chip"><PackageSearch size={14} />{raw("{count} catalog items").replace("{count}", totalItems.toLocaleString(locale))}</div>
        </div>
      </section>

      <section className="oversight-summary-grid">
        <div className="oversight-summary-card">
          <div className="oversight-summary-label"><LayoutGrid size={14} />{raw("Categories")}</div>
          <div className="oversight-summary-value">{categories.length}</div>
          <div className="oversight-summary-meta">{raw("All category rows currently visible from the catalog governance read model.")}</div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label"><Store size={14} />{raw("Store coverage")}</div>
          <div className="oversight-summary-value">{totalStores}</div>
          <div className="oversight-summary-meta">{raw("Store counts remain snapshot coverage indicators rather than live catalog distribution controls.")}</div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label"><PackageSearch size={14} />{raw("Items")}</div>
          <div className="oversight-summary-value">{totalItems.toLocaleString(locale)}</div>
          <div className="oversight-summary-meta">{raw("Item totals help explain catalog footprint at a glance before the table-level review.")}</div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label"><BookOpenText size={14} />{raw("Active")}</div>
          <div className="oversight-summary-value">{activeCount}</div>
          <div className="oversight-summary-meta">{raw("Active categories remain distinct from hidden and review-needed states for governance clarity.")}</div>
        </div>
      </section>

      <section className="oversight-panel">
        <div className="oversight-panel-header">
          <div>
            <h2 className="oversight-panel-title">{raw("Category Directory")}</h2>
            <p className="oversight-panel-subtitle">
              {raw("Category size, store footprint, and visibility state are grouped here to keep catalog governance readable without fake management flows.")}
            </p>
          </div>
        </div>
        <div className="oversight-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>{raw("Category")}</th>
                <th>{raw("Stores")}</th>
                <th>{raw("Items")}</th>
                <th>{raw("Status")}</th>
                <th>{raw("Actions")}</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id}>
                  <td>
                    <div className="oversight-row-primary">
                      <span className="oversight-row-title">{cat.name}</span>
                      <span className="oversight-row-meta">{raw("{items} items across {stores} stores").replace("{items}", cat.itemCount.toLocaleString(locale)).replace("{stores}", String(cat.storeCount))}</span>
                    </div>
                  </td>
                  <td>{cat.storeCount}</td>
                  <td>{cat.itemCount}</td>
                  <td><span className={`status-badge status-badge--${cat.status === "active" ? "active" : cat.status === "hidden" ? "closed" : "under_review"}`}>{statusLabel(cat.status)}</span></td>
                  <td><span className="btn-preview">{raw("Manage preview")}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
