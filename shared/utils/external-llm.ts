/**
 * External LLM transmission audit builder utilities.
 * Factory functions for constructing governed sink writes, audit records,
 * and masked transmission envelopes.
 */

import type {
  ExternalLlmClassification,
  ExternalLlmPayloadKind,
  ExternalLlmTransmissionAuditRecord,
  ExternalLlmTransmissionOutcome,
  ExternalMaskingProfile,
  GovernedExternalLlmSinkWrite,
  MaskedTransmissionEnvelope,
} from "../types/external-llm.types";
import type { AuthActorType } from "../types/domain.types";

/**
 * Build a governed sink write from a transmission audit record.
 * The governed write adds the audience field for Supabase insertion.
 */
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

/**
 * Build an ExternalLlmTransmissionAuditRecord from explicit fields.
 * Stamps attemptedAtUtc automatically.
 */
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

/**
 * Build a masked transmission envelope for external LLM consumption.
 * Generic over the payload type to support different export bundles.
 */
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
