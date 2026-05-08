"use client";

import { useActionState } from "react";
import type { DisputeStatus } from "../../../shared/domain";
import { useAdminI18n } from "../../../shared/i18n/client";
import {
  INITIAL_DISPUTE_TRANSITION_STATE,
  transitionDisputeStatusAction,
} from "../server/dispute-actions";

const ACTIONS_BY_STATUS: Record<DisputeStatus, readonly { label: string; nextStatus: DisputeStatus; tone: "primary" | "secondary" }[]> = {
  open: [
    { label: "Start review", nextStatus: "investigating", tone: "primary" },
    { label: "Escalate", nextStatus: "escalated", tone: "secondary" },
  ],
  investigating: [
    { label: "Resolve", nextStatus: "resolved", tone: "primary" },
    { label: "Escalate", nextStatus: "escalated", tone: "secondary" },
  ],
  escalated: [
    { label: "Resolve", nextStatus: "resolved", tone: "primary" },
  ],
  resolved: [],
};

export function DisputeActionCell({
  disputeId,
  status,
}: {
  disputeId: string;
  status: DisputeStatus;
}) {
  const { raw } = useAdminI18n();
  const [state, formAction, isPending] = useActionState(
    transitionDisputeStatusAction,
    INITIAL_DISPUTE_TRANSITION_STATE,
  );

  const actions = ACTIONS_BY_STATUS[status];

  if (actions.length === 0) {
    return <span className="btn-preview">{raw("Resolved")}</span>;
  }

  return (
    <div className="dispute-action-cell">
      <form action={formAction} className="dispute-action-form">
        <input type="hidden" name="disputeId" value={disputeId} />
        <div className="dispute-action-buttons">
          {actions.map((action) => (
            <button
              key={action.nextStatus}
              className={`btn ${action.tone === "primary" ? "btn-primary" : "btn-secondary"} dispute-action-button`}
              type="submit"
              name="nextStatus"
              value={action.nextStatus}
              disabled={isPending}
            >
              {isPending ? raw("Saving...") : raw(action.label)}
            </button>
          ))}
        </div>
      </form>
      {state.disputeId === disputeId && state.message ? (
        <p className={`dispute-action-feedback dispute-action-feedback--${state.status}`}>
          {state.message}
        </p>
      ) : null}
    </div>
  );
}
