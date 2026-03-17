"use client";

import { useState } from "react";
import { LayoutGrid, Search, Sparkles, Store, UtensilsCrossed } from "lucide-react";
import { merchantQueryServices } from "../../../shared/data/merchant-query-services";
import { formatMoney } from "../../../shared/domain";

type MerchantMenuScreenProps = {
  storeId: string;
};

export function MerchantMenuScreen({ storeId }: MerchantMenuScreenProps) {
  const data = merchantQueryServices.getMenuData(storeId);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const availableCount = data.items.filter((item) => item.available).length;
  const popularCount = data.items.filter((item) => item.popular).length;

  const filteredItems = data.items.filter((item) => {
    const matchesCategory = selectedCategory
      ? item.categoryId === selectedCategory
      : true;
    const matchesSearch = searchQuery
      ? item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesCategory && matchesSearch;
  });

  const selectedCategoryName = selectedCategory
    ? data.categories.find((c) => c.id === selectedCategory)?.name ?? "All"
    : "All Categories";

  const itemEmojis: Record<string, string> = {
    "Empanadas": "\uD83E\uDD5F",
    "Parrilla": "\uD83E\uDD69",
    "Milanesas": "\uD83C\uDF56",
    "Pizzas": "\uD83C\uDF55",
    "Ensaladas": "\uD83E\uDD57",
    "Postres": "\uD83C\uDF6E",
    "Bebidas": "\uD83C\uDF7A",
    "Especiales de Temporada": "\u2B50",
  };

  return (
    <div className="merchant-surface">
      <section className="merchant-hero merchant-hero-menu">
        <div className="merchant-hero-copy">
          <span className="merchant-eyebrow">Menu operations</span>
          <h1 className="merchant-hero-title">Menu</h1>
          <p className="merchant-hero-subtitle">
            Review category coverage, item visibility, and search results for the active store without implying live write paths.
          </p>
          <div className="merchant-context-row">
            <span className="merchant-context-pill">
              <Store size={14} />
              {data.store.name}
            </span>
            <span className="merchant-context-pill merchant-context-pill-muted">
              <Sparkles size={14} />
              Preview-only add, edit, and availability controls
            </span>
          </div>
        </div>
        <div className="page-actions merchant-page-actions">
          <button
            className="btn btn-secondary"
            disabled
            aria-disabled="true"
            title="Category writes are not live in this phase"
          >
            Add Category Preview
          </button>
          <button
            className="btn btn-primary"
            disabled
            aria-disabled="true"
            title="Item creation is not live in this phase"
          >
            Add Item Preview
          </button>
        </div>
      </section>

      <div className="merchant-summary-band">
        <div className="merchant-summary-card">
          <div className="merchant-summary-label">Catalog size</div>
          <div className="merchant-summary-value">{data.items.length} items</div>
          <div className="merchant-summary-meta">{data.categories.length} categories in the current store scope</div>
        </div>
        <div className="merchant-summary-card">
          <div className="merchant-summary-label">Visible now</div>
          <div className="merchant-summary-value">{availableCount} available</div>
          <div className="merchant-summary-meta">Availability indicators are preview-only here</div>
        </div>
        <div className="merchant-summary-card">
          <div className="merchant-summary-label">Popular markers</div>
          <div className="merchant-summary-value">{popularCount} highlighted</div>
          <div className="merchant-summary-meta">Based on current fixture-backed menu data</div>
        </div>
      </div>

      <div className="merchant-cluster-card">
        <div className="merchant-cluster-card-header">
          <div>
            <div className="card-title">Category focus</div>
            <div className="card-subtitle">Filter the current store menu by section or keyword</div>
          </div>
        </div>

        <div className="filter-bar merchant-menu-filter-bar">
          <button
            className={`filter-chip ${!selectedCategory ? "active" : ""}`}
            onClick={() => setSelectedCategory(null)}
          >
            <LayoutGrid size={14} />
            All ({data.items.length})
          </button>
          {data.categories.map((cat) => (
            <button
              key={cat.id}
              className={`filter-chip ${selectedCategory === cat.id ? "active" : ""}`}
              onClick={() =>
                setSelectedCategory(selectedCategory === cat.id ? null : cat.id)
              }
            >
              {cat.name} ({cat.itemCount})
            </button>
          ))}
          <div className="merchant-search-shell">
            <Search size={15} />
            <input
              className="filter-search"
              type="text"
              placeholder="Search items or descriptions"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="merchant-section-heading">
        <div>
          <h2 className="merchant-section-title">{selectedCategoryName}</h2>
          <p className="merchant-section-subtitle">
            {filteredItems.length} item{filteredItems.length !== 1 ? "s" : ""} in the current view
          </p>
        </div>
        <div className="merchant-inline-note">
          <UtensilsCrossed size={14} />
          Preview-only menu editing
        </div>
      </div>

      <div className="menu-item-grid">
        {filteredItems.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <div className="empty-state-icon">{"\uD83C\uDF7D"}</div>
              <div className="empty-state-title">No items found</div>
              <div className="empty-state-desc">
                {searchQuery
                  ? `No items matching "${searchQuery}"`
                  : "This category has no items yet"}
              </div>
            </div>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div key={item.id} className="menu-item-row merchant-menu-item-row">
              <div className="menu-item-thumb">
                {itemEmojis[item.categoryName] ?? "\uD83C\uDF7D"}
              </div>
              <div className="menu-item-info">
                <div className="menu-item-name">
                  {item.name}
                  {item.popular ? (
                    <span className="popular-badge" style={{ marginLeft: "var(--space-2)" }}>
                      Popular
                    </span>
                  ) : null}
                </div>
                <div className="menu-item-desc">{item.description}</div>
              </div>
              <div className="menu-item-meta">
                <div className="menu-item-price">{formatMoney(item.price)}</div>
                <label
                  className="toggle"
                  title="Availability preview only"
                  style={{ opacity: 0.65, cursor: "not-allowed" }}
                >
                  <input
                    type="checkbox"
                    defaultChecked={item.available}
                    disabled
                    aria-disabled="true"
                  />
                  <span className="toggle-slider" />
                </label>
                <button
                  className="btn btn-ghost btn-sm"
                  disabled
                  aria-disabled="true"
                >
                  Edit Preview
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
