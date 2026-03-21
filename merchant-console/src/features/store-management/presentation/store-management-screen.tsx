"use client";

import { useActionState, useEffect, useState } from "react";
import { Save, Store } from "lucide-react";
import type { StoreManagementData } from "../../../shared/data/merchant-repository";
import {
  updateMerchantStoreManagementAction,
  type MerchantStoreManagementActionState,
} from "../server/store-management-actions";

type MerchantStoreManagementScreenProps = {
  storeId: string;
  initialData: StoreManagementData;
};

const INITIAL_ACTION_STATE: MerchantStoreManagementActionState = {
  status: "idle",
  message: null,
  data: null,
};

export function MerchantStoreManagementScreen({
  storeId,
  initialData,
}: MerchantStoreManagementScreenProps) {
  const [data, setData] = useState(initialData);
  const [store, setStore] = useState(initialData.store);
  const [actionState, formAction, isPending] = useActionState(
    updateMerchantStoreManagementAction.bind(null, storeId),
    INITIAL_ACTION_STATE,
  );

  useEffect(() => {
    if (actionState.status === "success" && actionState.data) {
      setData(actionState.data);
      setStore(actionState.data.store);
    }
  }, [actionState]);

  return (
    <div className="merchant-surface">
      <section className="merchant-hero merchant-hero-insights">
        <div className="merchant-hero-copy">
          <span className="merchant-eyebrow">Store profile</span>
          <h1 className="merchant-hero-title">Store Information</h1>
          <p className="merchant-hero-subtitle">
            Update the active store profile, service settings, and weekly hours
            from the merchant console.
          </p>
          <div className="merchant-context-row">
            <span className="merchant-context-pill">
              <Store size={14} />
              {data.store.name}
            </span>
            <span className="merchant-context-pill merchant-context-pill-muted">
              Persisted store-scoped profile
            </span>
          </div>
        </div>
        <div className="merchant-hero-panel">
          <div className="merchant-hero-panel-label">Store status</div>
          <div className="merchant-hero-panel-value">
            {store.acceptingOrders ? "Accepting orders" : "Paused"}
          </div>
          <div className="merchant-hero-panel-text">
            Profile updates reload against the persisted store record after save.
          </div>
        </div>
      </section>

      <div className="merchant-summary-band">
        <div className="merchant-summary-card">
          <div className="merchant-summary-label">Customer rating</div>
          <div className="merchant-summary-value">{store.rating} / 5.0</div>
          <div className="merchant-summary-meta">
            Based on {store.reviewCount} persisted review entr{store.reviewCount === 1 ? "y" : "ies"}
          </div>
        </div>
        <div className="merchant-summary-card">
          <div className="merchant-summary-label">Delivery radius</div>
          <div className="merchant-summary-value">{store.deliveryRadius}</div>
          <div className="merchant-summary-meta">Current service radius for this store</div>
        </div>
        <div className="merchant-summary-card">
          <div className="merchant-summary-label">Save status</div>
          <div className="merchant-summary-value">
            {actionState.status === "success" ? "Saved" : "Ready"}
          </div>
          <div className="merchant-summary-meta">
            {actionState.message ?? "Store profile changes write back to persisted store data."}
          </div>
        </div>
      </div>

      <form action={formAction} className="merchant-cluster-card">
        <div className="merchant-cluster-card-header">
          <div>
            <div className="card-title">Store profile</div>
            <div className="card-subtitle">
              Core identity, service configuration, and hours for the active store
            </div>
          </div>
          <div className="page-actions merchant-page-actions">
            <button className="btn btn-primary" type="submit" disabled={isPending}>
              <Save size={14} />
              {isPending ? "Saving..." : "Save store profile"}
            </button>
          </div>
        </div>

        {actionState.message ? (
          <div className="merchant-settings-intro">
            <strong>{actionState.status === "success" ? "Store profile updated" : "Save failed"}</strong>
            <p>{actionState.message}</p>
          </div>
        ) : null}

        <input type="hidden" name="rating" value={store.rating} />
        <input type="hidden" name="reviewCount" value={store.reviewCount} />
        <input type="hidden" name="status" value={store.status} />

        <div className="grid-2 merchant-grid merchant-settings-grid">
          <div className="card merchant-card">
            <div className="card-header">
              <div>
                <div className="card-title">Store Profile</div>
                <div className="card-subtitle">Core identity and contact details</div>
              </div>
            </div>
            <div className="card-body">
              <div className="form-section">
                <LabeledInput
                  label="Store Name"
                  name="name"
                  value={store.name}
                  onChange={(value) => setStore((current) => ({ ...current, name: value }))}
                />
                <LabeledInput
                  label="Cuisine Type"
                  name="cuisineType"
                  value={store.cuisineType}
                  onChange={(value) =>
                    setStore((current) => ({ ...current, cuisineType: value }))
                  }
                />
                <div className="form-row">
                  <LabeledInput
                    label="Phone"
                    name="phone"
                    type="tel"
                    value={store.phone}
                    onChange={(value) => setStore((current) => ({ ...current, phone: value }))}
                  />
                  <LabeledInput
                    label="Email"
                    name="email"
                    type="email"
                    value={store.email}
                    onChange={(value) => setStore((current) => ({ ...current, email: value }))}
                  />
                </div>
                <LabeledInput
                  label="Address"
                  name="address"
                  value={store.address}
                  onChange={(value) => setStore((current) => ({ ...current, address: value }))}
                />
              </div>
            </div>
          </div>

          <div className="card merchant-card">
            <div className="card-header">
              <div>
                <div className="card-title">Store Status</div>
                <div className="card-subtitle">Visibility and service defaults</div>
              </div>
            </div>
            <div className="card-body">
              <div className="form-section">
                <div className="form-toggle-row">
                  <div>
                    <div className="form-toggle-label">Accepting Orders</div>
                    <div className="form-toggle-desc">
                      Pause or resume incoming orders for this store
                    </div>
                  </div>
                  <label className="toggle">
                    <input
                      type="checkbox"
                      name="acceptingOrders"
                      checked={store.acceptingOrders}
                      onChange={(event) =>
                        setStore((current) => ({
                          ...current,
                          acceptingOrders: event.target.checked,
                        }))
                      }
                    />
                    <span className="toggle-slider" />
                  </label>
                </div>
              </div>

              <div className="form-section" style={{ marginTop: "var(--space-6)" }}>
                <div className="form-section-title">Service Settings</div>
                <div className="form-row">
                  <LabeledInput
                    label="Delivery Radius"
                    name="deliveryRadius"
                    value={store.deliveryRadius}
                    onChange={(value) =>
                      setStore((current) => ({ ...current, deliveryRadius: value }))
                    }
                  />
                  <LabeledInput
                    label="Avg Preparation Time"
                    name="avgPrepTime"
                    value={store.avgPrepTime}
                    onChange={(value) =>
                      setStore((current) => ({ ...current, avgPrepTime: value }))
                    }
                  />
                </div>
              </div>

              <div className="merchant-status-highlight">
                <span className="merchant-status-highlight-icon">{"\u2B50"}</span>
                <div>
                  <div className="merchant-status-highlight-value">{store.rating} / 5.0</div>
                  <div className="merchant-status-highlight-copy">
                    Based on {store.reviewCount} reviews
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card merchant-card">
          <div className="card-header">
            <div>
              <div className="card-title">Operating Hours</div>
              <div className="card-subtitle">Weekly hours saved with the store profile</div>
            </div>
          </div>
          <div className="card-body">
            <table className="hours-table">
              <tbody>
                {store.hours.map((hour, index) => (
                  <tr key={hour.day}>
                    <td>
                      {hour.day}
                      <input type="hidden" name="hoursDay" value={hour.day} />
                    </td>
                    <td>
                      <div className="form-row">
                        <input
                          className="form-input"
                          type="time"
                          name="hoursOpen"
                          value={hour.open}
                          onChange={(event) =>
                            setStore((current) => ({
                              ...current,
                              hours: current.hours.map((currentHour, currentIndex) =>
                                currentIndex === index
                                  ? { ...currentHour, open: event.target.value }
                                  : currentHour,
                              ),
                            }))
                          }
                        />
                        <input
                          className="form-input"
                          type="time"
                          name="hoursClose"
                          value={hour.close}
                          onChange={(event) =>
                            setStore((current) => ({
                              ...current,
                              hours: current.hours.map((currentHour, currentIndex) =>
                                currentIndex === index
                                  ? { ...currentHour, close: event.target.value }
                                  : currentHour,
                              ),
                            }))
                          }
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </form>
    </div>
  );
}

function LabeledInput({
  label,
  name,
  value,
  type = "text",
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  type?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input
        className="form-input"
        type={type}
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
