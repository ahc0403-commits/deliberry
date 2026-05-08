import {
  assertSandboxEnvironment,
  createSupabaseAdminClient,
  hmacSha512Hex,
  sha256Hex,
  sortedQuery,
  textFromEnv,
  vnpayParamsFrom,
} from "../_shared/vnpay-sandbox.ts";

type PaymentAttemptRow = {
  order_id: string;
  payment_reference: string;
  expected_amount_vnd: number;
  expected_currency: string;
  expires_at: string;
};

function textResponse(body: string) {
  return new Response(body, {
    status: 200,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

function parseProviderAmountMinor(rawValue: string | null) {
  if (!rawValue) {
    return null;
  }
  const parsed = Number(rawValue);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

Deno.serve(async (request) => {
  const url = new URL(request.url);
  const hashSecret = textFromEnv("VNPAY_HASH_SECRET");
  const secureHash = url.searchParams.get("vnp_SecureHash") ?? "";
  const params = vnpayParamsFrom(url);
  const responseCode = url.searchParams.get("vnp_ResponseCode") ?? "";
  const transactionStatus = url.searchParams.get("vnp_TransactionStatus") ?? "";
  const txnRef = url.searchParams.get("vnp_TxnRef") ?? "";
  const providerAmountMinor = parseProviderAmountMinor(
    url.searchParams.get("vnp_Amount"),
  );
  const providerCurrency = (url.searchParams.get("vnp_CurrCode") ?? "").trim()
    .toUpperCase();
  const validationIssues: string[] = [];

  try {
    assertSandboxEnvironment();
  } catch (error) {
    validationIssues.push(
      error instanceof Error ? error.message : "Sandbox return disabled.",
    );
  }

  const isSigned =
    Boolean(hashSecret && secureHash && Object.keys(params).length) &&
    (await hmacSha512Hex(hashSecret, sortedQuery(params))).toLowerCase() ===
      secureHash.toLowerCase();
  if (!isSigned) {
    validationIssues.push(
      "The VNPAY return signature was missing or invalid.",
    );
  }

  let attempt: PaymentAttemptRow | null = null;
  let duplicateReturn = false;

  if (!txnRef) {
    validationIssues.push("The VNPAY return reference was missing.");
  } else {
    const supabaseAdmin = createSupabaseAdminClient();
    const { data: attemptRow, error: attemptError } = await supabaseAdmin
      .from("vnpay_sandbox_payment_attempts")
      .select(
        "order_id, payment_reference, expected_amount_vnd, expected_currency, expires_at",
      )
      .eq("payment_reference", txnRef)
      .maybeSingle();

    if (attemptError) {
      validationIssues.push(`Attempt lookup failed: ${attemptError.message}`);
    } else if (!attemptRow) {
      validationIssues.push("No matching sandbox payment attempt was found.");
    } else {
      attempt = attemptRow as PaymentAttemptRow;
      if (new Date(attempt.expires_at).getTime() < Date.now()) {
        validationIssues.push(
          "The sandbox payment attempt had already expired.",
        );
      }
      if (providerAmountMinor == null) {
        validationIssues.push(
          "The VNPAY return amount was missing or invalid.",
        );
      } else if (providerAmountMinor !== attempt.expected_amount_vnd * 100) {
        validationIssues.push(
          `Amount mismatch for sandbox payment reference ${txnRef}.`,
        );
      }
      if (providerCurrency != attempt.expected_currency) {
        validationIssues.push(
          `Currency mismatch for sandbox payment reference ${txnRef}.`,
        );
      }

      const { data: orderRow, error: orderError } = await supabaseAdmin
        .from("orders")
        .select("payment_status")
        .eq("id", attempt.order_id)
        .maybeSingle();
      if (orderError) {
        validationIssues.push(`Order lookup failed: ${orderError.message}`);
      } else if (!orderRow) {
        validationIssues.push(
          "The order for this sandbox payment no longer exists.",
        );
      } else if (orderRow.payment_status !== "pending") {
        validationIssues.push("The order payment state is no longer pending.");
      }

      const callbackFingerprint = await sha256Hex(
        `return:${sortedQuery(params)}:${secureHash.toLowerCase()}`,
      );
      const { data: existingReceipt, error: receiptLookupError } =
        await supabaseAdmin
          .from("vnpay_sandbox_callback_receipts")
          .select("id")
          .eq("callback_kind", "return")
          .eq("callback_fingerprint", callbackFingerprint)
          .maybeSingle();

      if (receiptLookupError) {
        validationIssues.push(
          `Sandbox return receipt lookup failed: ${receiptLookupError.message}`,
        );
      } else if (existingReceipt) {
        duplicateReturn = true;
      } else {
        const validationResult = validationIssues.length == 0
          ? "accepted"
          : "rejected";
        const { error: receiptInsertError } = await supabaseAdmin
          .from("vnpay_sandbox_callback_receipts")
          .insert({
            payment_reference: txnRef,
            callback_kind: "return",
            callback_fingerprint: callbackFingerprint,
            secure_hash: secureHash,
            checksum_valid: isSigned,
            validation_result: validationResult,
            validation_reason: validationIssues.length == 0
              ? null
              : validationIssues.join(" | "),
            provider_amount_minor: providerAmountMinor,
            provider_currency: providerCurrency || null,
            provider_response_code: responseCode || null,
            provider_transaction_status: transactionStatus || null,
          });
        if (receiptInsertError) {
          validationIssues.push(
            `Sandbox return receipt insert failed: ${receiptInsertError.message}`,
          );
        }
      }

      const { error: attemptUpdateError } = await supabaseAdmin
        .from("vnpay_sandbox_payment_attempts")
        .update({ last_return_at: new Date().toISOString() })
        .eq("payment_reference", txnRef);
      if (attemptUpdateError) {
        validationIssues.push(
          `Sandbox return attempt update failed: ${attemptUpdateError.message}`,
        );
      }
    }
  }

  const resultLabel = validationIssues.length == 0 && responseCode === "00" &&
      (transactionStatus === "00" || transactionStatus === "")
    ? duplicateReturn
      ? "Sandbox return already recorded"
      : "Sandbox return accepted"
    : "Sandbox return rejected";
  const detail = validationIssues.length == 0
    ? duplicateReturn
      ? "The VNPAY return matched a previously recorded sandbox callback. Deliberry kept payment state pending and ignored the duplicate safely."
      : "The VNPAY return signature and server-side sandbox checks matched the recorded payment attempt. Deliberry still kept payment state pending because live payment completion is disabled before contract go-live."
    : validationIssues.join(" ");

  return textResponse([
    "Deliberry VNPAY Sandbox",
    "",
    resultLabel,
    detail,
    "",
    `Reference: ${txnRef || "Unavailable"}`,
    `Response code: ${responseCode || "Unavailable"}`,
    `Transaction status: ${transactionStatus || "Unavailable"}`,
    `Recorded duplicate: ${duplicateReturn ? "yes" : "no"}`,
    `Order state mutation: disabled`,
  ].join("\n"));
});
