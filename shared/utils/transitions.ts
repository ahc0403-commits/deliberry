/**
 * State machine transition validation utilities.
 * Enforces FLOW.md canonical allowed transitions for all domain state machines.
 * See CONSTITUTION.md R-040–R-043, FLOW.md Sections 1–5.
 *
 * Each domain has an ALLOWED_TRANSITIONS map: { fromStatus: [toStatus1, toStatus2, ...] }.
 * If a from→to pair is not in the map, the transition is forbidden.
 */

import type {
  DisputeStatus,
  OrderStatus,
  PaymentStatus,
  SettlementState,
  SupportTicketStatus,
} from "../types/domain.types";

// ── Order Transitions (FLOW.md Section 1.3) ─────────────────────────────

const ORDER_ALLOWED_TRANSITIONS: Record<OrderStatus, readonly OrderStatus[]> = {
  draft: ["pending", "cancelled"],
  pending: ["confirmed", "cancelled"],
  confirmed: ["preparing", "cancelled"],
  preparing: ["ready", "cancelled"],
  ready: ["in_transit", "cancelled"],
  in_transit: ["delivered"],
  delivered: ["disputed"],
  cancelled: [],
  disputed: [],
};

export function isValidOrderTransition(from: OrderStatus, to: OrderStatus): boolean {
  return ORDER_ALLOWED_TRANSITIONS[from]?.includes(to) ?? false;
}

// ── Payment Transitions (FLOW.md Section 2.3) ───────────────────────────

const PAYMENT_ALLOWED_TRANSITIONS: Record<PaymentStatus, readonly PaymentStatus[]> = {
  pending: ["captured", "failed"],
  captured: ["settled", "refunded", "partially_refunded"],
  settled: [],
  failed: [],
  refunded: [],
  partially_refunded: [],
};

export function isValidPaymentTransition(from: PaymentStatus, to: PaymentStatus): boolean {
  return PAYMENT_ALLOWED_TRANSITIONS[from]?.includes(to) ?? false;
}

// ── Settlement Transitions (FLOW.md Section 3.1) ────────────────────────

const SETTLEMENT_ALLOWED_TRANSITIONS: Record<SettlementState, readonly SettlementState[]> = {
  pending: ["scheduled"],
  scheduled: ["processing", "failed"],
  processing: ["paid", "failed"],
  paid: [],
  failed: ["pending"],
};

export function isValidSettlementTransition(from: SettlementState, to: SettlementState): boolean {
  return SETTLEMENT_ALLOWED_TRANSITIONS[from]?.includes(to) ?? false;
}

// ── Dispute Transitions (FLOW.md Section 4.1) ───────────────────────────

const DISPUTE_ALLOWED_TRANSITIONS: Record<DisputeStatus, readonly DisputeStatus[]> = {
  open: ["investigating", "escalated"],
  investigating: ["resolved", "escalated"],
  escalated: ["resolved"],
  resolved: [],
};

export function isValidDisputeTransition(from: DisputeStatus, to: DisputeStatus): boolean {
  return DISPUTE_ALLOWED_TRANSITIONS[from]?.includes(to) ?? false;
}

// ── Support Ticket Transitions (FLOW.md Section 5.1) ────────────────────

const SUPPORT_TICKET_ALLOWED_TRANSITIONS: Record<SupportTicketStatus, readonly SupportTicketStatus[]> = {
  open: ["in_progress", "closed"],
  in_progress: ["awaiting_reply", "resolved", "closed"],
  awaiting_reply: ["in_progress", "resolved", "closed"],
  resolved: ["closed"],
  closed: [],
};

export function isValidSupportTicketTransition(from: SupportTicketStatus, to: SupportTicketStatus): boolean {
  return SUPPORT_TICKET_ALLOWED_TRANSITIONS[from]?.includes(to) ?? false;
}
