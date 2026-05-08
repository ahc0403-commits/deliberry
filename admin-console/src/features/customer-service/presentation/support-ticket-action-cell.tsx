"use client";

import { useActionState } from "react";
import type { SupportTicketStatus } from "../../../shared/domain";
import { useAdminI18n } from "../../../shared/i18n/client";
import {
  INITIAL_SUPPORT_TICKET_TRANSITION_STATE,
  transitionSupportTicketStatusAction,
} from "../server/customer-service-actions";

const ACTIONS_BY_STATUS: Record<SupportTicketStatus, readonly { label: string; nextStatus: SupportTicketStatus; tone: "primary" | "secondary" }[]> = {
  open: [
    { label: "Start work", nextStatus: "in_progress", tone: "primary" },
    { label: "Close", nextStatus: "closed", tone: "secondary" },
  ],
  in_progress: [
    { label: "Await reply", nextStatus: "awaiting_reply", tone: "secondary" },
    { label: "Resolve", nextStatus: "resolved", tone: "primary" },
    { label: "Close", nextStatus: "closed", tone: "secondary" },
  ],
  awaiting_reply: [
    { label: "Resume", nextStatus: "in_progress", tone: "secondary" },
    { label: "Resolve", nextStatus: "resolved", tone: "primary" },
    { label: "Close", nextStatus: "closed", tone: "secondary" },
  ],
  resolved: [
    { label: "Close", nextStatus: "closed", tone: "primary" },
  ],
  closed: [],
};

export function SupportTicketActionCell({
  ticketId,
  status,
}: {
  ticketId: string;
  status: SupportTicketStatus;
}) {
  const { raw } = useAdminI18n();
  const [state, formAction, isPending] = useActionState(
    transitionSupportTicketStatusAction,
    INITIAL_SUPPORT_TICKET_TRANSITION_STATE,
  );

  const actions = ACTIONS_BY_STATUS[status];

  if (actions.length === 0) {
    return <span className="btn-preview">{raw("Closed")}</span>;
  }

  return (
    <div className="dispute-action-cell">
      <form action={formAction} className="dispute-action-form">
        <input type="hidden" name="ticketId" value={ticketId} />
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
      {state.ticketId === ticketId && state.message ? (
        <p className={`dispute-action-feedback dispute-action-feedback--${state.status}`}>
          {state.message}
        </p>
      ) : null}
    </div>
  );
}
