import type {
  ANALYTICS_RANGES,
  AUTH_ACTOR_TYPES,
  DISPUTE_STATUSES,
  LEGAL_DOCUMENT_TYPES,
  ORDER_STATUSES,
  PAYMENT_METHODS,
  PAYMENT_STATUSES,
  PERMISSION_ROLES,
  PROMOTION_TYPES,
  SETTLEMENT_STATES,
  SUPPORT_CHANNELS,
  SUPPORT_TICKET_STATUSES,
} from "../constants/domain.constants";

export type AuthActorType = (typeof AUTH_ACTOR_TYPES)[number];
export type OrderStatus = (typeof ORDER_STATUSES)[number];
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];
/** @deprecated Use PaymentMethod instead */
export type PaymentMethodPlaceholder = PaymentMethod;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];
export type PromotionType = (typeof PROMOTION_TYPES)[number];
export type SettlementState = (typeof SETTLEMENT_STATES)[number];
export type DisputeStatus = (typeof DISPUTE_STATUSES)[number];
export type AnalyticsRange = (typeof ANALYTICS_RANGES)[number];
export type PermissionRole = (typeof PERMISSION_ROLES)[number];
export type SupportChannel = (typeof SUPPORT_CHANNELS)[number];
export type SupportTicketStatus = (typeof SUPPORT_TICKET_STATUSES)[number];
export type LegalDocumentType = (typeof LEGAL_DOCUMENT_TYPES)[number];
