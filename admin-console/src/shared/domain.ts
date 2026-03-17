// GOVERNANCE: This is the ONLY permitted import boundary into repo-level shared.
// See docs/governance/STRUCTURE.md R-005.
// Do NOT import directly from shared/* in feature/screen files.

export {
  AUTH_ACTOR_TYPES,
  DISPUTE_STATUSES,
  ORDER_STATUSES,
  PAYMENT_METHODS,
  PAYMENT_METHOD_PLACEHOLDERS,
  PAYMENT_STATUSES,
  PERMISSION_ROLES,
  SETTLEMENT_STATES,
  SUPPORT_CHANNELS,
  SUPPORT_TICKET_STATUSES,
} from "../../../shared/constants/domain.constants";

export type {
  CurrencyCode,
  ISODateTimeUTC,
  MoneyAmount,
} from "../../../shared/types/common.types";

export type {
  AuthActorType,
  DisputeStatus,
  OrderStatus,
  PaymentMethod,
  PaymentMethodPlaceholder,
  PaymentStatus,
  PermissionRole,
  SettlementState,
  SupportChannel,
  SupportTicketStatus,
} from "../../../shared/types/domain.types";

export { formatMoney } from "../../../shared/utils/currency";
