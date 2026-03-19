import "server-only";

import {
  buildExternalLlmTransmissionAuditRecord,
  buildExternalLlmMaskedTransmissionEnvelope,
  type AuthActorType,
  type ExternalMaskingProfile,
  type MaskedMerchantStoreExportBundleForLLM,
} from "../domain";
import { recordMerchantExternalLlmTransmissionAttempt } from "./external-llm-transmission-audit-service";
import { merchantRepository } from "./merchant-repository";
import { supabaseMerchantRuntimeRepository } from "./supabase-merchant-runtime-repository";

export type MerchantMaskedExternalLlmExportResult = {
  source: "persisted" | "fallback";
  transmission: ReturnType<
    typeof buildExternalLlmMaskedTransmissionEnvelope<MaskedMerchantStoreExportBundleForLLM>
  >;
};

const MERCHANT_EXTERNAL_LLM_CALLER_ID =
  "merchant_masked_store_export_service" as const;

export async function buildMerchantStoreMaskedExternalLlmTransmission(input: {
  storeId: string;
  actorId: string;
  actorType: Extract<AuthActorType, "merchant_owner" | "merchant_staff">;
  profile?: Extract<
    ExternalMaskingProfile,
    "external_llm_prompt" | "external_llm_retrieval"
  >;
}): Promise<MerchantMaskedExternalLlmExportResult> {
  const profile = input.profile ?? "external_llm_retrieval";

  try {
    const payload =
      (await supabaseMerchantRuntimeRepository.exportMaskedStoreSnapshotForExternalLlm(
        input,
      )) as unknown as MaskedMerchantStoreExportBundleForLLM;

    const transmission = buildExternalLlmMaskedTransmissionEnvelope({
      callerId: MERCHANT_EXTERNAL_LLM_CALLER_ID,
      surface: "merchant-console",
      classification: "LLM_MASK_REQUIRED",
      dataFamily: "merchant_store_profile",
      profile,
      payloadKind: "masked_merchant_store_export_bundle_for_llm",
      payload,
    });

    await recordMerchantExternalLlmTransmissionAttempt(
      buildExternalLlmTransmissionAuditRecord({
        callerId: MERCHANT_EXTERNAL_LLM_CALLER_ID,
        outcome: "allowed",
        reason: "Approved masked merchant store export assembled for external transmission.",
        actorId: input.actorId,
        actorType: input.actorType,
        surface: "merchant-console",
        dataFamily: "merchant_store_profile",
        classification: "LLM_MASK_REQUIRED",
        profile,
        payloadKind: "masked_merchant_store_export_bundle_for_llm",
        sanitizedContext: payload as unknown as Record<string, unknown>,
      }),
    );

    return {
      source: "persisted",
      transmission,
    };
  } catch (persistedError) {
    try {
      const payload =
        merchantRepository.exportMaskedStoreSnapshotForExternalLlm(
          input,
        ) as unknown as MaskedMerchantStoreExportBundleForLLM;

      const transmission = buildExternalLlmMaskedTransmissionEnvelope({
        callerId: MERCHANT_EXTERNAL_LLM_CALLER_ID,
        surface: "merchant-console",
        classification: "LLM_MASK_REQUIRED",
        dataFamily: "merchant_store_profile",
        profile,
        payloadKind: "masked_merchant_store_export_bundle_for_llm",
        payload,
      });

      await recordMerchantExternalLlmTransmissionAttempt(
        buildExternalLlmTransmissionAuditRecord({
          callerId: MERCHANT_EXTERNAL_LLM_CALLER_ID,
          outcome: "allowed",
          reason:
            "Approved masked merchant store export assembled through fallback data source.",
          actorId: input.actorId,
          actorType: input.actorType,
          surface: "merchant-console",
          dataFamily: "merchant_store_profile",
          classification: "LLM_MASK_REQUIRED",
          profile,
          payloadKind: "masked_merchant_store_export_bundle_for_llm",
          sanitizedContext: payload as unknown as Record<string, unknown>,
        }),
      );

      return {
        source: "fallback",
        transmission,
      };
    } catch (finalError) {
      const denialReason =
        finalError instanceof Error ? finalError.message : String(finalError);

      try {
        await recordMerchantExternalLlmTransmissionAttempt(
          buildExternalLlmTransmissionAuditRecord({
            callerId: MERCHANT_EXTERNAL_LLM_CALLER_ID,
            outcome: "denied",
            reason: denialReason,
            actorId: input.actorId,
            actorType: input.actorType,
            surface: "merchant-console",
            dataFamily: "merchant_store_profile",
            classification: "LLM_MASK_REQUIRED",
            profile,
            payloadKind: "masked_merchant_store_export_bundle_for_llm",
            sanitizedContext: {
              source: "merchant-console",
              profile,
              payloadKind: "masked_merchant_store_export_bundle_for_llm",
            },
          }),
        );
      } catch {
        // Denial must still block transmission even if the internal audit sink is unavailable.
      }

      throw (finalError instanceof Error ? finalError : new Error(denialReason));
    }
  }
}
