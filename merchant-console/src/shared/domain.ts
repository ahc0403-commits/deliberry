/**
 * Standalone merchant-console domain helpers.
 * This file must stay self-contained so the app can build when deployed from
 * the merchant-console directory as its own Vercel project.
 */

export type CurrencyCode = "ARS" | "USD";
export type MoneyAmount = number & { readonly __brand: "centavos" };
export type ISODateTimeUTC = string & { readonly __brand: "utc-datetime" };

export type AuthActorType =
  | "guest"
  | "customer"
  | "merchant_owner"
  | "merchant_staff"
  | "rider"
  | "admin"
  | "system";

export type OrderStatus =
  | "draft"
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "in_transit"
  | "delivered"
  | "cancelled"
  | "disputed";

export type PaymentMethod = "cash" | "card" | "digital_wallet";
export type PaymentMethodPlaceholder = PaymentMethod;
export type PaymentStatus =
  | "pending"
  | "captured"
  | "settled"
  | "failed"
  | "refunded"
  | "partially_refunded";
export type PromotionType =
  | "percentage"
  | "fixed"
  | "free_delivery"
  | "coupon"
  | "discount";
export type SettlementState =
  | "pending"
  | "scheduled"
  | "processing"
  | "paid"
  | "failed";

export function formatMoney(
  centavos: number,
  currency: CurrencyCode = "ARS",
): string {
  const amount = centavos / 100;
  return new Intl.NumberFormat(currency === "ARS" ? "es-AR" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(amount);
}

export type ProductTelemetryAudience = "customer" | "merchant" | "admin";
export type ProductTelemetrySurface =
  | "customer-app"
  | "merchant-console"
  | "admin-console"
  | "public-website";
export type ProductTelemetryOutcome =
  | "success"
  | "failure"
  | "abandoned"
  | "skipped"
  | "viewed"
  | "attempted"
  | "started"
  | "succeeded"
  | "failed"
  | "fallback_activated";
export type ProductTelemetrySessionMode =
  | "authenticated"
  | "anonymous"
  | "service"
  | "merchant_session";
export type ProductTelemetryFunnel =
  | "customer_order_placement"
  | "customer_registration"
  | "merchant_order_fulfillment"
  | "merchant_onboarding";

export interface ProductTelemetryEvent {
  audience: ProductTelemetryAudience;
  surface: ProductTelemetrySurface;
  eventName: string;
  outcome: ProductTelemetryOutcome;
  sessionMode: ProductTelemetrySessionMode;
  actorType: AuthActorType;
  storeId?: string;
  orderId?: string;
  itemCount?: number;
  paymentMethod?: string;
  reviewRating?: number;
  source?: string;
  metadata?: Record<string, unknown>;
  occurredAtUtc: string;
}

export interface ProductTelemetryFunnelStep {
  stepKey: string;
  eventName: string;
  outcome: string;
  eventCount: number;
}

export interface ProductTelemetryFunnelSummary {
  funnel: ProductTelemetryFunnel;
  windowMinutes: number;
  steps: ProductTelemetryFunnelStep[];
}

export interface ProductTelemetryConversionSummary {
  funnel: ProductTelemetryFunnel;
  windowMinutes: number;
  totalEntries: number;
  totalCompletions: number;
  conversionRate: number;
}

export interface ProductTelemetryRouteViewSummary {
  surface: ProductTelemetrySurface;
  windowMinutes: number;
  routes: Array<{
    route: string;
    viewCount: number;
  }>;
}

export function buildProductTelemetryEvent(
  input: Omit<ProductTelemetryEvent, "audience" | "occurredAtUtc">,
): ProductTelemetryEvent {
  const audience =
    input.surface === "customer-app"
      ? "customer"
      : input.surface === "merchant-console"
        ? "merchant"
        : "admin";

  return {
    ...input,
    audience,
    occurredAtUtc: new Date().toISOString(),
  };
}

const PRODUCT_TELEMETRY_STEP_KEY_MAP: Record<string, Record<string, string>> = {
  "customer.browse_menu": { success: "menu_viewed" },
  "customer.add_to_cart": { success: "item_added" },
  "customer.checkout_started": { success: "checkout_started" },
  "customer.order_placed": { success: "order_placed" },
  "customer.order_delivered": { success: "order_delivered" },
  "merchant.orders_viewed": { success: "orders_viewed" },
  "merchant.order_status_update": { success: "order_updated" },
  "merchant.onboarding_started": { success: "onboarding_started" },
  "merchant.onboarding_completed": { success: "onboarding_completed" },
};

export function mapProductTelemetryStepKey(
  eventName: string,
  outcome: string,
): string | null {
  return PRODUCT_TELEMETRY_STEP_KEY_MAP[eventName]?.[outcome] ?? null;
}

export type RuntimeObservabilityAudience = "customer" | "merchant" | "admin";
export type RuntimeObservabilitySurface =
  | "customer-app"
  | "merchant-console"
  | "admin-console"
  | "public-website";
export type RuntimeObservabilityLayer =
  | "data"
  | "action"
  | "ui"
  | "auth"
  | "integration"
  | "service"
  | "repository";
export type RuntimeObservabilityOutcome =
  | "success"
  | "failure"
  | "fallback"
  | "denied"
  | "started"
  | "succeeded"
  | "failed"
  | "fallback_activated"
  | "transition_rejected";
export type RuntimeObservabilityFailureClass =
  | "network"
  | "auth"
  | "auth_missing"
  | "validation"
  | "not_found"
  | "conflict"
  | "rate_limit"
  | "timeout"
  | "internal"
  | "unknown"
  | "rls_denied"
  | "membership_denied"
  | "fallback_triggered"
  | "status_update_failed"
  | "settings_write_failed"
  | "store_profile_write_failed"
  | "unexpected_null_reload"
  | "transition_rejected";
export type RuntimeObservabilityThresholdSignal =
  | "high_failure_rate"
  | "elevated_latency"
  | "access_denial_spike"
  | "write_failure_cluster";

export interface RuntimeObservabilityEvent {
  audience: RuntimeObservabilityAudience;
  surface: RuntimeObservabilitySurface;
  layer: RuntimeObservabilityLayer;
  operation: string;
  outcome: RuntimeObservabilityOutcome;
  traceId?: string;
  attemptSource?: string;
  failureClass?: RuntimeObservabilityFailureClass;
  actorType?: AuthActorType;
  storeId?: string;
  orderId?: string;
  itemCount?: number;
  paymentMethod?: PaymentMethod | string;
  fromStatus?: OrderStatus | string;
  toStatus?: OrderStatus | string;
  resourceType?: string;
  resourceScope?: string;
  durationMs?: number;
  metadata?: Record<string, unknown>;
  recordedAtUtc: string;
}

export interface RuntimeObservabilityThresholdSummary {
  windowMinutes: number;
  signals: RuntimeObservabilityThresholdSignal[];
  counts: Record<string, number>;
}

export interface RuntimeObservabilityOperatorSummary {
  windowMinutes: number;
  totals: {
    events: number;
    fallbacks: number;
    accessDenials: number;
    writeFailures: number;
  };
  hotOperations: Array<{
    operation: string;
    count: number;
    failureRate: number;
  }>;
}

export function buildRuntimeObservabilityEvent(
  input: Omit<RuntimeObservabilityEvent, "audience" | "recordedAtUtc">,
): RuntimeObservabilityEvent {
  const audience =
    input.surface === "customer-app"
      ? "customer"
      : input.surface === "merchant-console"
        ? "merchant"
        : "admin";

  return {
    ...input,
    audience,
    recordedAtUtc: new Date().toISOString(),
  };
}

export function classifyRuntimeFailure(
  error: unknown,
): RuntimeObservabilityFailureClass {
  if (error == null) return "unknown";

  const message =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : String(error);
  const lower = message.toLowerCase();

  if (lower.includes("fetch") || lower.includes("network") || lower.includes("econnrefused")) {
    return "network";
  }
  if (lower.includes("unauthorized") || lower.includes("403") || lower.includes("jwt")) {
    return "auth";
  }
  if (lower.includes("validation") || lower.includes("invalid") || lower.includes("required")) {
    return "validation";
  }
  if (lower.includes("not found") || lower.includes("404") || lower.includes("no rows")) {
    return "not_found";
  }
  if (lower.includes("conflict") || lower.includes("409") || lower.includes("duplicate")) {
    return "conflict";
  }
  if (lower.includes("rate limit") || lower.includes("429") || lower.includes("too many")) {
    return "rate_limit";
  }
  if (lower.includes("timeout") || lower.includes("timed out") || lower.includes("deadline")) {
    return "timeout";
  }
  if (lower.includes("internal") || lower.includes("500")) {
    return "internal";
  }

  return "unknown";
}

const SENSITIVE_KEY_PATTERNS = [
  /password/i,
  /secret/i,
  /token/i,
  /authorization/i,
  /cookie/i,
  /session/i,
  /credit.?card/i,
  /card.?number/i,
  /cvv/i,
  /ssn/i,
  /social.?security/i,
  /phone/i,
  /email/i,
  /address/i,
  /birth/i,
  /passport/i,
];

function isSensitiveKey(key: string): boolean {
  return SENSITIVE_KEY_PATTERNS.some((pattern) => pattern.test(key));
}

function sanitizeObject(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (isSensitiveKey(key)) {
      result[key] = "[REDACTED]";
    } else if (value != null && typeof value === "object" && !Array.isArray(value)) {
      result[key] = sanitizeObject(value as Record<string, unknown>);
    } else {
      result[key] = value;
    }
  }

  return result;
}

export function sanitizeForLogsAndTelemetry(input: {
  dataFamily: string;
  payload: Record<string, unknown>;
}): { dataFamily: string; payload: Record<string, unknown> } {
  return {
    dataFamily: input.dataFamily,
    payload: sanitizeObject(input.payload),
  };
}

export type ExternalLlmTransmissionOutcome = "allowed" | "denied";
export type ExternalLlmClassification =
  | "LLM_MASK_REQUIRED"
  | "LLM_SAFE"
  | "LLM_BLOCKED";
export type ExternalMaskingProfile =
  | "external_llm_prompt"
  | "external_llm_retrieval"
  | "external_llm_analytics"
  | "none";
export type ExternalLlmPayloadKind =
  | "masked_merchant_store_export_bundle_for_llm"
  | "masked_customer_order_export_for_llm"
  | "raw_text";

export interface ExternalLlmTransmissionAuditRecord {
  callerId: string;
  outcome: ExternalLlmTransmissionOutcome;
  reason: string;
  actorId: string;
  actorType: AuthActorType;
  surface: string;
  attemptedAtUtc: string;
  dataFamily: string;
  classification: ExternalLlmClassification;
  profile: ExternalMaskingProfile;
  payloadKind: ExternalLlmPayloadKind | string;
  sanitizedContext: Record<string, unknown>;
}

export interface GovernedExternalLlmSinkWrite {
  audience: string;
  callerId: string;
  outcome: ExternalLlmTransmissionOutcome;
  reason: string;
  actorId: string;
  actorType: AuthActorType;
  surface: string;
  attemptedAtUtc: string;
  dataFamily: string;
  classification: ExternalLlmClassification;
  profile: ExternalMaskingProfile;
  payloadKind: ExternalLlmPayloadKind | string;
  sanitizedContext: Record<string, unknown>;
}

export interface MaskedTransmissionEnvelope<T = unknown> {
  callerId: string;
  surface: string;
  classification: ExternalLlmClassification;
  dataFamily: string;
  profile: ExternalMaskingProfile;
  payloadKind: ExternalLlmPayloadKind | string;
  payload: T;
  transmittedAtUtc: string;
}

export interface MaskedMerchantStoreExportBundleForLLM {
  storeId: string;
  storeName: string;
  city: string;
  isOpen: boolean;
  menuItemCount: number;
  activePromotionCount: number;
  recentOrderCount: number;
  averageRating: number | null;
  categories: string[];
}

export function buildGovernedExternalLlmSinkWrite(input: {
  attempt: ExternalLlmTransmissionAuditRecord;
}): GovernedExternalLlmSinkWrite {
  const { attempt } = input;
  const audience =
    attempt.surface === "customer-app"
      ? "customer"
      : attempt.surface === "merchant-console"
        ? "merchant"
        : "admin";

  return {
    audience,
    callerId: attempt.callerId,
    outcome: attempt.outcome,
    reason: attempt.reason,
    actorId: attempt.actorId,
    actorType: attempt.actorType,
    surface: attempt.surface,
    attemptedAtUtc: attempt.attemptedAtUtc,
    dataFamily: attempt.dataFamily,
    classification: attempt.classification,
    profile: attempt.profile,
    payloadKind: attempt.payloadKind,
    sanitizedContext: attempt.sanitizedContext,
  };
}

export function buildExternalLlmTransmissionAuditRecord(input: {
  callerId: string;
  outcome: ExternalLlmTransmissionOutcome;
  reason: string;
  actorId: string;
  actorType: AuthActorType;
  surface: string;
  dataFamily: string;
  classification: ExternalLlmClassification;
  profile: ExternalMaskingProfile;
  payloadKind: ExternalLlmPayloadKind | string;
  sanitizedContext: Record<string, unknown>;
}): ExternalLlmTransmissionAuditRecord {
  return {
    ...input,
    attemptedAtUtc: new Date().toISOString(),
  };
}

export function buildExternalLlmMaskedTransmissionEnvelope<T = unknown>(input: {
  callerId: string;
  surface: string;
  classification: ExternalLlmClassification;
  dataFamily: string;
  profile: ExternalMaskingProfile;
  payloadKind: ExternalLlmPayloadKind | string;
  payload: T;
}): MaskedTransmissionEnvelope<T> {
  return {
    callerId: input.callerId,
    surface: input.surface,
    classification: input.classification,
    dataFamily: input.dataFamily,
    profile: input.profile,
    payloadKind: input.payloadKind,
    payload: input.payload,
    transmittedAtUtc: new Date().toISOString(),
  };
}
