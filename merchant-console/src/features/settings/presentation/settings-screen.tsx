"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { Save, Settings2, Store } from "lucide-react";
import type { SettingsData } from "../../../shared/data/merchant-repository";
import {
  updateMerchantSettingsAction,
  type MerchantSettingsActionState,
} from "../server/settings-actions";

type MerchantSettingsScreenProps = {
  storeId: string;
  initialData: SettingsData;
};

const INITIAL_ACTION_STATE: MerchantSettingsActionState = {
  status: "idle",
  message: null,
  data: null,
};

type ToggleKey = keyof SettingsData["toggles"];

function countEnabledToggles(toggles: SettingsData["toggles"], keys: ToggleKey[]) {
  return keys.filter((key) => toggles[key]).length;
}

export function MerchantSettingsScreen({
  storeId,
  initialData,
}: MerchantSettingsScreenProps) {
  const [data, setData] = useState(initialData);
  const [draftToggles, setDraftToggles] = useState(initialData.toggles);
  const [actionState, formAction, isPending] = useActionState(
    updateMerchantSettingsAction.bind(null, storeId),
    INITIAL_ACTION_STATE,
  );

  useEffect(() => {
    if (actionState.status === "success" && actionState.data) {
      setData(actionState.data);
      setDraftToggles(actionState.data.toggles);
    }
  }, [actionState]);

  const operationsEnabled = countEnabledToggles(draftToggles, [
    "autoAcceptOrders",
    "orderNotifications",
    "rushHourMode",
    "allowSpecialInstructions",
  ]);
  const notificationsEnabled = countEnabledToggles(draftToggles, [
    "emailReports",
    "reviewAlerts",
    "settlementNotifications",
    "lowStockAlerts",
  ]);

  return (
    <div className="merchant-surface">
      <section className="merchant-hero merchant-hero-insights">
        <div className="merchant-hero-copy">
          <span className="merchant-eyebrow">Store configuration</span>
          <h1 className="merchant-hero-title">Settings</h1>
          <p className="merchant-hero-subtitle">
            Update persisted operating preferences and notification defaults for the
            active store.
          </p>
          <div className="merchant-context-row">
            <span className="merchant-context-pill">
              <Store size={14} />
              {data.store.name}
            </span>
            <span className="merchant-context-pill merchant-context-pill-muted">
              <Settings2 size={14} />
              Persisted store-scoped settings
            </span>
          </div>
        </div>
        <div className="merchant-hero-panel">
          <div className="merchant-hero-panel-label">Current route truth</div>
          <div className="merchant-hero-panel-value">Persisted</div>
          <div className="merchant-hero-panel-text">
            Changes on this route write back to the store settings record and are
            reloaded after save.
          </div>
        </div>
      </section>

      <div className="merchant-summary-band">
        <div className="merchant-summary-card">
          <div className="merchant-summary-label">Operations controls</div>
          <div className="merchant-summary-value">{operationsEnabled} enabled</div>
          <div className="merchant-summary-meta">
            Auto-accept, alerts, rush mode, and special instructions
          </div>
        </div>
        <div className="merchant-summary-card">
          <div className="merchant-summary-label">Notification defaults</div>
          <div className="merchant-summary-value">{notificationsEnabled} enabled</div>
          <div className="merchant-summary-meta">
            Email, reviews, settlements, and stock alerts
          </div>
        </div>
        <div className="merchant-summary-card">
          <div className="merchant-summary-label">Save status</div>
          <div className="merchant-summary-value">
            {actionState.status === "success" ? "Saved" : "Ready"}
          </div>
          <div className="merchant-summary-meta">
            {actionState.message ?? "No unsignaled fallback writes are allowed on this route."}
          </div>
        </div>
      </div>

      <form action={formAction} className="merchant-cluster-card">
        <div className="merchant-cluster-card-header">
          <div>
            <div className="card-title">Store settings</div>
            <div className="card-subtitle">
              Persisted operational controls for the active store
            </div>
          </div>
          <div className="page-actions merchant-page-actions">
            <button className="btn btn-primary" type="submit" disabled={isPending}>
              <Save size={14} />
              {isPending ? "Saving..." : "Save settings"}
            </button>
          </div>
        </div>

        {actionState.message ? (
          <div className="merchant-settings-intro">
            <strong>{actionState.status === "success" ? "Settings updated" : "Save failed"}</strong>
            <p>{actionState.message}</p>
          </div>
        ) : null}

        <div className="grid-2 merchant-grid merchant-settings-grid">
          <div className="card merchant-card">
            <div className="card-header">
              <div>
                <div className="card-title">Operations</div>
                <div className="card-subtitle">Order-handling defaults for this store</div>
              </div>
            </div>
            <div className="card-body">
              <SettingsToggle
                name="autoAcceptOrders"
                label="Auto-accept orders"
                description="Automatically accept new orders without manual review"
                checked={draftToggles.autoAcceptOrders}
                onChange={(checked) =>
                  setDraftToggles((current) => ({
                    ...current,
                    autoAcceptOrders: checked,
                  }))
                }
              />
              <SettingsToggle
                name="orderNotifications"
                label="Order notifications"
                description="Play a notification when new orders arrive"
                checked={draftToggles.orderNotifications}
                onChange={(checked) =>
                  setDraftToggles((current) => ({
                    ...current,
                    orderNotifications: checked,
                  }))
                }
              />
              <SettingsToggle
                name="rushHourMode"
                label="Rush hour mode"
                description="Extend estimated prep times during peak periods"
                checked={draftToggles.rushHourMode}
                onChange={(checked) =>
                  setDraftToggles((current) => ({
                    ...current,
                    rushHourMode: checked,
                  }))
                }
              />
              <SettingsToggle
                name="allowSpecialInstructions"
                label="Allow special instructions"
                description="Let customers add notes to their orders"
                checked={draftToggles.allowSpecialInstructions}
                onChange={(checked) =>
                  setDraftToggles((current) => ({
                    ...current,
                    allowSpecialInstructions: checked,
                  }))
                }
              />
            </div>
          </div>

          <div className="card merchant-card">
            <div className="card-header">
              <div>
                <div className="card-title">Notifications</div>
                <div className="card-subtitle">Merchant-facing alerts and summary delivery</div>
              </div>
            </div>
            <div className="card-body">
              <SettingsToggle
                name="emailReports"
                label="Email reports"
                description="Receive daily summary emails"
                checked={draftToggles.emailReports}
                onChange={(checked) =>
                  setDraftToggles((current) => ({
                    ...current,
                    emailReports: checked,
                  }))
                }
              />
              <SettingsToggle
                name="reviewAlerts"
                label="Review alerts"
                description="Get notified for new customer reviews"
                checked={draftToggles.reviewAlerts}
                onChange={(checked) =>
                  setDraftToggles((current) => ({
                    ...current,
                    reviewAlerts: checked,
                  }))
                }
              />
              <SettingsToggle
                name="settlementNotifications"
                label="Settlement notifications"
                description="Get notified when payout summaries are updated"
                checked={draftToggles.settlementNotifications}
                onChange={(checked) =>
                  setDraftToggles((current) => ({
                    ...current,
                    settlementNotifications: checked,
                  }))
                }
              />
              <SettingsToggle
                name="lowStockAlerts"
                label="Low stock alerts"
                description="Alert when frequently unavailable items need review"
                checked={draftToggles.lowStockAlerts}
                onChange={(checked) =>
                  setDraftToggles((current) => ({
                    ...current,
                    lowStockAlerts: checked,
                  }))
                }
              />
            </div>
          </div>
        </div>
      </form>

      <div className="card merchant-card">
        <div className="card-header">
          <div>
            <div className="card-title">Related routes</div>
            <div className="card-subtitle">
              Continue into other store-scoped operational screens
            </div>
          </div>
        </div>
        <div className="card-body">
          <div className="merchant-link-grid">
            <Link href={`/${storeId}/store`} className="btn btn-secondary" style={{ justifyContent: "center" }}>
              Edit Store Profile
            </Link>
            <Link href={`/${storeId}/orders`} className="btn btn-secondary" style={{ justifyContent: "center" }}>
              View Orders
            </Link>
            <Link href={`/${storeId}/reviews`} className="btn btn-secondary" style={{ justifyContent: "center" }}>
              Review Feedback
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsToggle({
  name,
  label,
  description,
  checked,
  onChange,
}: {
  name: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="form-toggle-row">
      <div>
        <div className="form-toggle-label">{label}</div>
        <div className="form-toggle-desc">{description}</div>
      </div>
      <label className="toggle">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
        />
        <span className="toggle-slider" />
      </label>
    </div>
  );
}
