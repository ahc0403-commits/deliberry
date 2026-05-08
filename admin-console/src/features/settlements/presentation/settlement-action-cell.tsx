"use client";

import { useActionState } from "react";
import type { SettlementState } from "../../../shared/domain";
import {
  INITIAL_SETTLEMENT_RECEIPT_STATE,
  acknowledgeSettlementReceivedAction,
} from "../server/settlement-actions";

export function SettlementActionCell({
  settlementId,
  status,
}: {
  settlementId: string;
  status: SettlementState;
}) {
  const [state, formAction, isPending] = useActionState(
    acknowledgeSettlementReceivedAction,
    INITIAL_SETTLEMENT_RECEIPT_STATE,
  );

  if (status !== "calculated") {
    return <span className="btn-preview">Visibility only</span>;
  }

  return (
    <div className="dispute-action-cell">
      <form action={formAction} className="dispute-action-form">
        <input type="hidden" name="settlementId" value={settlementId} />
        <div className="dispute-action-buttons">
          <button
            className="btn btn-primary dispute-action-button"
            type="submit"
            disabled={isPending}
          >
            {isPending ? "Saving..." : "Acknowledge receipt"}
          </button>
        </div>
      </form>
      {state.settlementId === settlementId && state.message ? (
        <p className={`dispute-action-feedback dispute-action-feedback--${state.status}`}>
          {state.message}
        </p>
      ) : null}
    </div>
  );
}
