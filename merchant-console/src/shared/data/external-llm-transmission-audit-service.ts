import "server-only";

import {
  buildGovernedExternalLlmSinkWrite,
  type ExternalLlmTransmissionAuditRecord,
} from "../domain";
import { createMerchantServiceSupabaseClient } from "../supabase/client";

export async function recordMerchantExternalLlmTransmissionAttempt(
  attempt: ExternalLlmTransmissionAuditRecord,
): Promise<void> {
  const supabase = createMerchantServiceSupabaseClient();
  const governedWrite = buildGovernedExternalLlmSinkWrite({ attempt });
  const { error } = await supabase.from("external_llm_transmission_audits").insert({
    audience: governedWrite.audience,
    caller_id: governedWrite.callerId,
    outcome: governedWrite.outcome,
    reason: governedWrite.reason,
    actor_id: governedWrite.actorId,
    actor_type: governedWrite.actorType,
    surface: governedWrite.surface,
    attempted_at: governedWrite.attemptedAtUtc,
    data_family: governedWrite.dataFamily,
    classification: governedWrite.classification,
    profile: governedWrite.profile,
    payload_kind: governedWrite.payloadKind,
    sanitized_context: governedWrite.sanitizedContext,
  });

  if (error) {
    throw new Error(error.message);
  }
}
