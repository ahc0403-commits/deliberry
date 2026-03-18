/**
 * Product telemetry type definitions.
 * Supports funnel analysis, route-view summaries, and conversion tracking
 * across customer-app and merchant-console surfaces.
 */

import type { AuthActorType } from "./domain.types";

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
