import { BookOpenText, LayoutGrid, PackageSearch, Store } from "lucide-react";
import { adminQueryServices } from "../../../shared/data/admin-query-services";

export function AdminCatalogScreen() {
  const { categories } = adminQueryServices.getCatalogData();

  const totalStores = categories.reduce((acc, c) => acc + c.storeCount, 0);
  const totalItems = categories.reduce((acc, c) => acc + c.itemCount, 0);
  const activeCount = categories.filter((cat) => cat.status === "active").length;

  return (
    <div className="screen-container oversight-shell">
      <section className="oversight-hero">
        <div className="oversight-hero-content">
          <div className="oversight-hero-copy">
            <div className="oversight-eyebrow">
              <BookOpenText size={14} />
              Catalog governance
            </div>
            <h1 className="oversight-title">Catalog</h1>
            <p className="oversight-subtitle">
              Review category visibility, store coverage, and catalog footprint from one governance route without implying live catalog management or publishing control.
            </p>
          </div>
          <div className="oversight-hero-note">
            <div className="oversight-note-label">Catalog mode</div>
            <div className="oversight-note-value">Preview-only category oversight</div>
            <p className="oversight-note-text">
              Category rows are fixture-backed and management controls stay explicitly non-operational in this admin phase.
            </p>
          </div>
        </div>
        <div className="oversight-hero-meta">
          <div className="oversight-meta-chip"><LayoutGrid size={14} />{categories.length} categories</div>
          <div className="oversight-meta-chip"><Store size={14} />{totalStores} store mappings</div>
          <div className="oversight-meta-chip"><PackageSearch size={14} />{totalItems.toLocaleString()} catalog items</div>
        </div>
      </section>

      <section className="oversight-summary-grid">
        <div className="oversight-summary-card">
          <div className="oversight-summary-label"><LayoutGrid size={14} />Categories</div>
          <div className="oversight-summary-value">{categories.length}</div>
          <div className="oversight-summary-meta">All category rows currently visible from the catalog governance read model.</div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label"><Store size={14} />Store coverage</div>
          <div className="oversight-summary-value">{totalStores}</div>
          <div className="oversight-summary-meta">Store counts remain snapshot coverage indicators rather than live catalog distribution controls.</div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label"><PackageSearch size={14} />Items</div>
          <div className="oversight-summary-value">{totalItems.toLocaleString()}</div>
          <div className="oversight-summary-meta">Item totals help explain catalog footprint at a glance before the table-level review.</div>
        </div>
        <div className="oversight-summary-card">
          <div className="oversight-summary-label"><BookOpenText size={14} />Active</div>
          <div className="oversight-summary-value">{activeCount}</div>
          <div className="oversight-summary-meta">Active categories remain distinct from hidden and review-needed states for governance clarity.</div>
        </div>
      </section>

      <section className="oversight-panel">
        <div className="oversight-panel-header">
          <div>
            <h2 className="oversight-panel-title">Category Directory</h2>
            <p className="oversight-panel-subtitle">
              Category size, store footprint, and visibility state are grouped here to keep catalog governance readable without fake management flows.
            </p>
          </div>
        </div>
        <div className="oversight-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Stores</th>
                <th>Items</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id}>
                  <td>
                    <div className="oversight-row-primary">
                      <span className="oversight-row-title">{cat.name}</span>
                      <span className="oversight-row-meta">{cat.itemCount.toLocaleString()} items across {cat.storeCount} stores</span>
                    </div>
                  </td>
                  <td>{cat.storeCount}</td>
                  <td>{cat.itemCount}</td>
                  <td><span className={`status-badge status-badge--${cat.status === "active" ? "active" : cat.status === "hidden" ? "closed" : "under_review"}`}>{cat.status.replace("_", " ")}</span></td>
                  <td><span className="btn-preview">Manage preview</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
