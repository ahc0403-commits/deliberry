// GOVERNANCE: This is the ONLY permitted import boundary into repo-level shared.
// See docs/governance/STRUCTURE.md R-005.
// Do NOT import directly from shared/* in feature/screen files.

export {
  AUTH_ACTOR_TYPES,
  ORDER_STATUSES,
  PAYMENT_METHODS,
  PAYMENT_METHOD_PLACEHOLDERS,
  PAYMENT_STATUSES,
  PROMOTION_TYPES,
  SETTLEMENT_STATES,
} from "../../../shared/constants/domain.constants";

export type {
  CurrencyCode,
  ISODateTimeUTC,
  MoneyAmount,
} from "../../../shared/types/common.types";

export type {
  AuthActorType,
  OrderStatus,
  PaymentMethod,
  PaymentMethodPlaceholder,
  PaymentStatus,
  PromotionType,
  SettlementState,
} from "../../../shared/types/domain.types";

export { formatMoney } from "../../../shared/utils/currency";

// --- Product Telemetry ---

export type {
  ProductTelemetryEvent,
  ProductTelemetryFunnel,
  ProductTelemetryFunnelSummary,
  ProductTelemetryConversionSummary,
  ProductTelemetryRouteViewSummary,
} from "../../../shared/types/telemetry.types";

export {
  buildProductTelemetryEvent,
  mapProductTelemetryStepKey,
} from "../../../shared/utils/telemetry";

// --- Runtime Observability ---

export type {
  RuntimeObservabilityEvent,
  RuntimeObservabilityFailureClass,
  RuntimeObservabilityOperatorSummary,
  RuntimeObservabilityThresholdSummary,
} from "../../../shared/types/observability.types";

export {
  buildRuntimeObservabilityEvent,
  classifyRuntimeFailure,
} from "../../../shared/utils/observability";

// --- Sanitization ---

export { sanitizeForLogsAndTelemetry } from "../../../shared/utils/sanitize";

// --- External LLM Transmission ---

export type {
  ExternalLlmTransmissionAuditRecord,
  ExternalMaskingProfile,
  MaskedMerchantStoreExportBundleForLLM,
  MaskedTransmissionEnvelope,
} from "../../../shared/types/external-llm.types";

export {
  buildGovernedExternalLlmSinkWrite,
  buildExternalLlmTransmissionAuditRecord,
  buildExternalLlmMaskedTransmissionEnvelope,
} from "../../../shared/utils/external-llm";
