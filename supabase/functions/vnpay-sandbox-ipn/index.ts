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

const responseHeaders = {
  "Content-Type": "application/json",
  "Cache-Control": "no-store",
};

function jsonResponse(body: Record<string, string>) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: responseHeaders,
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
  if (request.method !== "GET") {
    return jsonResponse({
      RspCode: "99",
      Message: "Invalid request",
    });
  }

  try {
    assertSandboxEnvironment();
  } catch (_error) {
    return jsonResponse({
      RspCode: "99",
      Message: "Sandbox IPN disabled",
    });
  }

  const hashSecret = textFromEnv("VNPAY_HASH_SECRET");
  if (!hashSecret) {
    return jsonResponse({
      RspCode: "99",
      Message: "Sandbox IPN disabled",
    });
  }

  const url = new URL(request.url);
  const secureHash = url.searchParams.get("vnp_SecureHash") ?? "";
  const vnpParams = vnpayParamsFrom(url);
  const txnRef = url.searchParams.get("vnp_TxnRef") ?? "";
  const responseCode = url.searchParams.get("vnp_ResponseCode") ?? "";
  const transactionStatus = url.searchParams.get("vnp_TransactionStatus") ?? "";
  const providerAmountMinor = parseProviderAmountMinor(
    url.searchParams.get("vnp_Amount"),
  );
  const providerCurrency = (url.searchParams.get("vnp_CurrCode") ?? "").trim()
    .toUpperCase();

  if (!secureHash || Object.keys(vnpParams).length === 0 || !txnRef) {
    return jsonResponse({
      RspCode: "99",
      Message: "Invalid request",
    });
  }

  const expected = await hmacSha512Hex(hashSecret, sortedQuery(vnpParams));
  const checksumValid = expected.toLowerCase() === secureHash.toLowerCase();
  if (!checksumValid) {
    return jsonResponse({
      RspCode: "97",
      Message: "Invalid checksum",
    });
  }

  const supabaseAdmin = createSupabaseAdminClient();
  const { data: attemptRow, error: attemptError } = await supabaseAdmin
    .from("vnpay_sandbox_payment_attempts")
    .select(
      "order_id, payment_reference, expected_amount_vnd, expected_currency, expires_at",
    )
    .eq("payment_reference", txnRef)
    .maybeSingle();

  if (attemptError || !attemptRow) {
    return jsonResponse({
      RspCode: "99",
      Message: attemptError
        ? `Payment attempt lookup failed: ${attemptError.message}`
        : "Unknown sandbox payment reference",
    });
  }

  const attempt = attemptRow as PaymentAttemptRow;
  if (new Date(attempt.expires_at).getTime() < Date.now()) {
    return jsonResponse({
      RspCode: "99",
      Message: "Sandbox payment attempt expired",
    });
  }

  if (
    providerAmountMinor == null ||
    providerAmountMinor !== attempt.expected_amount_vnd * 100
  ) {
    return jsonResponse({
      RspCode: "99",
      Message: "Sandbox payment amount mismatch",
    });
  }

  if (providerCurrency !== attempt.expected_currency) {
    return jsonResponse({
      RspCode: "99",
      Message: "Sandbox payment currency mismatch",
    });
  }

  const { data: orderRow, error: orderError } = await supabaseAdmin
    .from("orders")
    .select("payment_status")
    .eq("id", attempt.order_id)
    .maybeSingle();
  if (orderError || !orderRow) {
    return jsonResponse({
      RspCode: "99",
      Message: orderError
        ? `Order lookup failed: ${orderError.message}`
        : "Order not found for sandbox payment",
    });
  }

  if (orderRow.payment_status !== "pending") {
    return jsonResponse({
      RspCode: "99",
      Message: "Order payment state is no longer pending",
    });
  }

  const callbackFingerprint = await sha256Hex(
    `ipn:${sortedQuery(vnpParams)}:${secureHash.toLowerCase()}`,
  );
  const { data: existingReceipt, error: existingReceiptError } =
    await supabaseAdmin
      .from("vnpay_sandbox_callback_receipts")
      .select("id")
      .eq("callback_kind", "ipn")
      .eq("callback_fingerprint", callbackFingerprint)
      .maybeSingle();
  if (existingReceiptError) {
    return jsonResponse({
      RspCode: "99",
      Message:
        `Sandbox IPN receipt lookup failed: ${existingReceiptError.message}`,
    });
  }

  if (existingReceipt) {
    return jsonResponse({
      RspCode: "00",
      Message:
        "Sandbox IPN duplicate acknowledged safely. Order state updates remain disabled before contract go-live.",
    });
  }

  const { error: receiptInsertError } = await supabaseAdmin
    .from("vnpay_sandbox_callback_receipts")
    .insert({
      payment_reference: txnRef,
      callback_kind: "ipn",
      callback_fingerprint: callbackFingerprint,
      secure_hash: secureHash,
      checksum_valid: true,
      validation_result: "accepted",
      validation_reason:
        "Sandbox IPN checksum, reference, amount, currency, and pending order checks passed. Payment state mutation intentionally remains disabled.",
      provider_amount_minor: providerAmountMinor,
      provider_currency: providerCurrency,
      provider_response_code: responseCode || null,
      provider_transaction_status: transactionStatus || null,
    });
  if (receiptInsertError) {
    return jsonResponse({
      RspCode: "99",
      Message:
        `Sandbox IPN receipt insert failed: ${receiptInsertError.message}`,
    });
  }

  const { error: attemptUpdateError } = await supabaseAdmin
    .from("vnpay_sandbox_payment_attempts")
    .update({ last_ipn_at: new Date().toISOString() })
    .eq("payment_reference", txnRef);
  if (attemptUpdateError) {
    return jsonResponse({
      RspCode: "99",
      Message:
        `Sandbox payment attempt update failed: ${attemptUpdateError.message}`,
    });
  }

  return jsonResponse({
    RspCode: "00",
    Message:
      "Sandbox IPN checksum and server-side sandbox checks passed. Order state updates remain disabled before contract go-live.",
  });
});
