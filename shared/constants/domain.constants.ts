export const AUTH_ACTOR_TYPES = [
  "guest",
  "customer",
  "merchant_owner",
  "merchant_staff",
  "rider",
  "admin",
  "system",
] as const;

export const ORDER_STATUSES = [
  "draft",
  "pending",
  "confirmed",
  "preparing",
  "ready",
  // DEPRECATED: "ready_for_delivery" — renamed to "ready" per FLOW.md Section 1.6
  "in_transit",
  "delivered",
  "cancelled",
  "disputed",
] as const;

export const PAYMENT_METHODS = [
  "cash",
  "card",
  "digital_wallet",
] as const;

/** @deprecated Use PAYMENT_METHODS instead */
export const PAYMENT_METHOD_PLACEHOLDERS = PAYMENT_METHODS;

export const PAYMENT_STATUSES = [
  "pending",
  "captured",
  "settled",
  "failed",
  "refunded",
  "partially_refunded",
] as const;

export const PROMOTION_TYPES = [
  "percentage",
  "fixed",
  "free_delivery",
  "coupon",
  "discount",
] as const;

export const SETTLEMENT_STATES = [
  "pending",
  "scheduled",
  "processing",
  "paid",
  "failed",
] as const;

export const DISPUTE_STATUSES = [
  "open",
  "investigating",
  "escalated",
  "resolved",
] as const;

export const ANALYTICS_RANGES = [
  "today",
  "7d",
  "30d",
  "custom",
] as const;

export const PERMISSION_ROLES = [
  "platform_admin",
  "operations_admin",
  "support_admin",
  "finance_admin",
  "marketing_admin",
] as const;

export const SUPPORT_CHANNELS = [
  "faq",
  "email",
  "merchant_inquiry",
  "customer_support",
] as const;

export const SUPPORT_TICKET_STATUSES = [
  "open",
  "in_progress",
  "awaiting_reply",
  "resolved",
  "closed",
] as const;

export const LEGAL_DOCUMENT_TYPES = [
  "privacy",
  "terms",
  "refund_policy",
] as const;
