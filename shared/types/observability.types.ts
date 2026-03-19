/**
 * Runtime observability type definitions.
 * Supports failure classification, threshold monitoring, and operator summaries
 * across all surfaces.
 */

import type { AuthActorType, OrderStatus, PaymentMethod } from "./domain.types";

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
