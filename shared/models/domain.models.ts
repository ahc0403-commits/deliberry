import type {
  AnalyticsRange,
  AuthActorType,
  OrderStatus,
  PaymentMethod,
  PermissionRole,
  PromotionType,
  SettlementState,
  SupportChannel,
  SupportTicketStatus,
} from "../types/domain.types";
import type {
  CurrencyCode,
  EntityId,
  ISODateString,
  ISODateTimeString,
  MoneyAmount,
} from "../types/common.types";

export interface AuthActor {
  id: EntityId;
  actorType: AuthActorType;
  displayName: string;
}

export interface StoreSummary {
  id: EntityId;
  name: string;
  city: string;
  isOpen: boolean;
}

export interface MenuItemSummary {
  id: EntityId;
  storeId: EntityId;
  name: string;
  price: MoneyAmount;
  currency: CurrencyCode;
}

export interface OrderSummary {
  id: EntityId;
  storeId: EntityId;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  total: MoneyAmount;
  currency: CurrencyCode;
  createdAt: ISODateTimeString;
  // Per-status timestamps per DATE.md Law 10 / FLOW.md Section 1.2
  // Populated as the order progresses through its lifecycle.
  confirmedAt?: ISODateTimeString;
  preparingAt?: ISODateTimeString;
  readyAt?: ISODateTimeString;
  pickedUpAt?: ISODateTimeString;
  deliveredAt?: ISODateTimeString;
  cancelledAt?: ISODateTimeString;
  disputedAt?: ISODateTimeString;
  updatedAt?: ISODateTimeString;
}

export interface ReviewSummary {
  id: EntityId;
  orderId: EntityId;
  rating: number;
  hasMerchantResponse: boolean;
}

export interface PromotionSummary {
  id: EntityId;
  storeId: EntityId;
  type: PromotionType;
  title: string;
}

export interface SettlementSummary {
  id: EntityId;
  storeId: EntityId;
  state: SettlementState;
  amount: MoneyAmount;
  currency: CurrencyCode;
  periodEnd: ISODateString;
}

export interface AnalyticsSlice {
  id: EntityId;
  range: AnalyticsRange;
  label: string;
  value: number;
}

export interface PermissionMatrixSummary {
  role: PermissionRole;
  scopes: string[];
}

export interface SupportCaseSummary {
  id: EntityId;
  channel: SupportChannel;
  subject: string;
  status: SupportTicketStatus;
}
