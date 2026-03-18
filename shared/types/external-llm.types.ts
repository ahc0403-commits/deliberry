/**
 * External LLM transmission audit type definitions.
 * Governs data egress to external AI/LLM systems with masking profiles,
 * classification enforcement, and audit logging.
 */

import type { AuthActorType } from "./domain.types";

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

/**
 * Masked merchant store export bundle for external LLM consumption.
 * All PII and sensitive fields are stripped or replaced with masked tokens.
 */
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
