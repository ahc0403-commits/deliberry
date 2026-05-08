"use client";

import { startTransition, useActionState, useEffect, useState } from "react";
import { LayoutGrid, Save, Search, Sparkles, Store, UtensilsCrossed } from "lucide-react";
import type { MenuData } from "../../../shared/data/merchant-repository";
import type { MenuItem } from "../../../shared/data/merchant-mock-data";
import { formatMoney } from "../../../shared/domain";
import {
  setMerchantMenuItemAvailabilityAction,
  upsertMerchantMenuItemAction,
  type MerchantMenuActionState,
} from "../server/menu-actions";
import { useMerchantI18n } from "../../../shared/i18n/client";

type MerchantMenuScreenProps = {
  storeId: string;
  initialData: MenuData;
};

const INITIAL_ACTION_STATE: MerchantMenuActionState = {
  status: "idle",
  message: null,
  data: null,
};

export function MerchantMenuScreen({ storeId, initialData }: MerchantMenuScreenProps) {
  const { raw } = useMerchantI18n();
  const [data, setData] = useState(initialData);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);
  const [actionState, formAction, isPending] = useActionState(
    upsertMerchantMenuItemAction.bind(null, storeId),
    INITIAL_ACTION_STATE,
  );

  useEffect(() => {
    if (actionState.status === "success" && actionState.data) {
      setData(actionState.data);
      setEditingItem(null);
    }
  }, [actionState]);

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
    : raw("All Categories");

  const itemEmojis: Record<string, string> = {
    "Khai Vi": "\uD83E\uDD5F",
    "Mon Chinh": "\uD83C\uDF5B",
    "Mon Nuong": "\uD83E\uDD69",
    "Pho & Bun": "\uD83C\uDF5C",
    "Mon Kem": "\uD83E\uDD57",
    "Trang Mieng": "\uD83C\uDF6E",
    "Do Uong": "\uD83E\uDD64",
    "Mon Theo Mua": "\u2B50",
  };
  const replaceCount = (value: string, count: number) => raw(value).replace("{count}", String(count));

  return (
    <div className="merchant-surface">
      <section className="merchant-hero merchant-hero-menu">
        <div className="merchant-hero-copy">
          <span className="merchant-eyebrow">{raw("Menu operations")}</span>
          <h1 className="merchant-hero-title">{raw("Menu")}</h1>
          <p className="merchant-hero-subtitle">
            {raw("Register menu items, upload customer-facing photos, and control availability for the active store.")}
          </p>
          <div className="merchant-context-row">
            <span className="merchant-context-pill">
              <Store size={14} />
              {data.store.name}
            </span>
            <span className="merchant-context-pill merchant-context-pill-muted">
              <Sparkles size={14} />
              {raw("Persisted store-scoped menu operations")}
            </span>
          </div>
        </div>
        <div className="page-actions merchant-page-actions">
          <button
            className="btn btn-secondary"
            type="button"
            onClick={() => setEditingItem(null)}
          >
            {raw("New item")}
          </button>
        </div>
      </section>

      <div className="merchant-summary-band">
        <div className="merchant-summary-card">
          <div className="merchant-summary-label">{raw("Catalog size")}</div>
          <div className="merchant-summary-value">{replaceCount("{count} items", data.items.length)}</div>
          <div className="merchant-summary-meta">
            {replaceCount("{count} categories in the current store scope", data.categories.length)}
          </div>
        </div>
        <div className="merchant-summary-card">
          <div className="merchant-summary-label">{raw("Visible now")}</div>
          <div className="merchant-summary-value">{replaceCount("{count} available", availableCount)}</div>
          <div className="merchant-summary-meta">{raw("Availability writes update persisted store menu data")}</div>
        </div>
        <div className="merchant-summary-card">
          <div className="merchant-summary-label">{raw("Popular markers")}</div>
          <div className="merchant-summary-value">{replaceCount("{count} highlighted", popularCount)}</div>
          <div className="merchant-summary-meta">{raw("Based on current live menu data")}</div>
        </div>
      </div>

      <form
        key={editingItem?.id ?? "new-menu-item"}
        action={formAction}
        className="merchant-cluster-card merchant-menu-editor"
      >
        <div className="merchant-cluster-card-header">
          <div>
            <div className="card-title">{editingItem ? raw("Edit menu item") : raw("Add menu item")}</div>
            <div className="card-subtitle">
              {raw("Category remains a text field in the current denormalized menu model.")}
            </div>
          </div>
          <button className="btn btn-primary" type="submit" disabled={isPending}>
            <Save size={14} />
              {isPending ? raw("Saving...") : raw("Save item")}
          </button>
        </div>

        {actionState.message ? (
          <div className={`merchant-action-result merchant-action-result--${actionState.status}`}>
            <strong>{actionState.status === "success" ? raw("Menu saved") : raw("Save failed")}</strong>
            <p>{raw(actionState.message)}</p>
          </div>
        ) : null}

        <input type="hidden" name="itemId" value={editingItem?.id ?? ""} />
        <div className="form-row merchant-menu-form-grid">
          <LabeledInput label="Item name" name="name" defaultValue={editingItem?.name ?? ""} required />
          <LabeledInput label="Category" name="category" defaultValue={editingItem?.categoryName ?? ""} placeholder="Rice bowls" required />
          <LabeledInput
            label="Price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            defaultValue={editingItem ? String((editingItem.price / 100).toFixed(2)) : ""}
            required
          />
          <label className="form-group">
            <span className="form-label">{raw("Menu photo")}</span>
            <input className="form-input" name="image" type="file" accept="image/jpeg,image/png,image/webp" />
          </label>
        </div>
        <label className="form-group">
          <span className="form-label">{raw("Description")}</span>
          <textarea
            className="form-input merchant-menu-textarea"
            name="description"
            defaultValue={editingItem?.description ?? ""}
            placeholder={raw("Short customer-facing description")}
          />
        </label>
        <div className="merchant-menu-editor-options">
          <label className="merchant-menu-check">
            <input name="isAvailable" type="checkbox" defaultChecked={editingItem?.available ?? true} />
            <span>{raw("Available for ordering")}</span>
          </label>
          <label className="merchant-menu-check">
            <input name="isPopular" type="checkbox" defaultChecked={editingItem?.popular ?? false} />
            <span>{raw("Mark as popular")}</span>
          </label>
          {editingItem ? (
            <button className="btn btn-secondary" type="button" onClick={() => setEditingItem(null)}>
              {raw("Cancel edit")}
            </button>
          ) : null}
        </div>
      </form>

      <div className="merchant-cluster-card">
        <div className="merchant-cluster-card-header">
          <div>
            <div className="card-title">{raw("Category focus")}</div>
            <div className="card-subtitle">{raw("Filter the current store menu by section or keyword")}</div>
          </div>
        </div>

        <div className="filter-bar merchant-menu-filter-bar">
          <button
            className={`filter-chip ${!selectedCategory ? "active" : ""}`}
            onClick={() => setSelectedCategory(null)}
          >
            <LayoutGrid size={14} />
            {raw("All")} ({data.items.length})
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
              placeholder={raw("Search items or descriptions")}
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
            {replaceCount(
              filteredItems.length === 1
                ? "{count} item in the current view"
                : "{count} items in the current view",
              filteredItems.length,
            )}
          </p>
        </div>
        <div className="merchant-inline-note">
          <UtensilsCrossed size={14} />
          {raw("Live menu editing")}
        </div>
      </div>

      {availabilityError ? (
        <div className="merchant-action-result merchant-action-result--error">
          <strong>{raw("Availability update failed")}</strong>
          <p>{availabilityError}</p>
        </div>
      ) : null}

      <div className="menu-item-grid">
        {filteredItems.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <div className="empty-state-icon">{"\uD83C\uDF7D"}</div>
              <div className="empty-state-title">{raw("No items found")}</div>
              <div className="empty-state-desc">
                {searchQuery
                  ? raw('No items matching "{query}"').replace("{query}", searchQuery)
                  : raw("This category has no items yet")}
              </div>
            </div>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div key={item.id} className="menu-item-row merchant-menu-item-row">
              <div className="menu-item-thumb">
                {item.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.imageUrl} alt="" className="merchant-menu-thumb-img" />
                ) : (
                  itemEmojis[item.categoryName] ?? "\uD83C\uDF7D"
                )}
              </div>
              <div className="menu-item-info">
                <div className="menu-item-name">
                  {item.name}
                  {item.popular ? (
                    <span className="popular-badge" style={{ marginLeft: "var(--space-2)" }}>
                      {raw("Popular")}
                    </span>
                  ) : null}
                </div>
                <div className="menu-item-desc">{item.description}</div>
              </div>
              <div className="menu-item-meta">
                <div className="menu-item-price">{formatMoney(item.price)}</div>
                <label
                  className="toggle"
                  title={raw("Toggle availability")}
                >
                  <input
                    type="checkbox"
                    checked={item.available}
                    onChange={(event) => {
                      const nextAvailable = event.target.checked;
                      setAvailabilityError(null);
                      startTransition(async () => {
                        const result = await setMerchantMenuItemAvailabilityAction({
                          storeId,
                          itemId: item.id,
                          isAvailable: nextAvailable,
                        });
                        if (result.ok) {
                          setData(result.data);
                          return;
                        }
                        setAvailabilityError(result.error);
                      });
                    }}
                  />
                  <span className="toggle-slider" />
                </label>
                <button
                  className="btn btn-ghost btn-sm"
                  type="button"
                  onClick={() => setEditingItem(item)}
                >
                  {raw("Edit")}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function LabeledInput({
  label,
  name,
  defaultValue,
  placeholder,
  type = "text",
  step,
  min,
  required = false,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  type?: string;
  step?: string;
  min?: string;
  required?: boolean;
}) {
  const { raw } = useMerchantI18n();
  return (
    <label className="form-group">
      <span className="form-label">{raw(label)}</span>
      <input
        className="form-input"
        name={name}
        type={type}
        step={step}
        min={min}
        defaultValue={defaultValue}
        placeholder={placeholder ? raw(placeholder) : undefined}
        required={required}
      />
    </label>
  );
}
