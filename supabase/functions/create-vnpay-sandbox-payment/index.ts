import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  assertSandboxPaymentCreationEnabled,
  createSupabaseAdminClient,
  hmacSha512Hex,
  normalizeSandboxPaymentUrl,
  normalizeSandboxReturnUrl,
  requireEnv,
  sortedQuery,
  textFromEnv,
} from "../_shared/vnpay-sandbox.ts";

type OrderRow = {
  id: string;
  customer_actor_id: string;
  payment_method: string;
  payment_status: string;
  total_centavos: number;
  currency: string;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Cache-Control": "no-store",
};

const allowedBankCodes = new Set(["", "VNPAYQR", "VNBANK", "INTCARD"]);

function jsonResponse(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

function vnpayTimestamp(date: Date) {
  const vietnamTime = new Date(date.getTime() + 7 * 60 * 60 * 1000);
  const pad = (value: number) => String(value).padStart(2, "0");
  return [
    vietnamTime.getUTCFullYear(),
    pad(vietnamTime.getUTCMonth() + 1),
    pad(vietnamTime.getUTCDate()),
    pad(vietnamTime.getUTCHours()),
    pad(vietnamTime.getUTCMinutes()),
    pad(vietnamTime.getUTCSeconds()),
  ].join("");
}

function clientIpFor(request: Request) {
  return (request.headers.get("x-forwarded-for") ?? "127.0.0.1")
    .split(",")[0]
    .trim() || "127.0.0.1";
}

function normalizeOrderInfo(orderId: string) {
  return `Deliberry sandbox order ${orderId}`.replace(/[^A-Za-z0-9 .:_-]/g, "");
}

function assertPaymentRailMatchesOrder(order: OrderRow, bankCode: string) {
  if (order.payment_method === "cash") {
    throw new Error(
      "Cash orders must not open the VNPAY sandbox payment flow.",
    );
  }

  if (order.payment_method === "digital_wallet" && bankCode !== "VNPAYQR") {
    throw new Error(
      "Digital wallet sandbox payments must use the VNPAYQR rail.",
    );
  }

  if (order.payment_method === "card" && bankCode === "VNPAYQR") {
    throw new Error(
      "Card sandbox payments must not use the VNPAYQR wallet rail.",
    );
  }
}

function sandboxAmountVndFor(order: OrderRow) {
  const fixedAmount = Number(textFromEnv("VNPAY_SANDBOX_FIXED_AMOUNT_VND"));
  if (Number.isInteger(fixedAmount) && fixedAmount > 0) {
    return fixedAmount;
  }

  if (order.currency === "VND") {
    return Math.max(1_000, Math.round(order.total_centavos));
  }

  return 10_000;
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return jsonResponse(405, {
      error_code: "method_not_allowed",
      message: "Use POST for VNPAY sandbox payment creation.",
    });
  }

  try {
    assertSandboxPaymentCreationEnabled();

    const supabaseUrl = requireEnv("SUPABASE_URL");
    const supabaseAnonKey = requireEnv("SUPABASE_ANON_KEY");
    const tmnCode = requireEnv("VNPAY_TMN_CODE");
    const hashSecret = requireEnv("VNPAY_HASH_SECRET");
    const returnUrl = normalizeSandboxReturnUrl(requireEnv("VNPAY_RETURN_URL"));
    const paymentUrl = normalizeSandboxPaymentUrl(
      textFromEnv("VNPAY_PAYMENT_URL") ||
        "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
    );

    const authorization = request.headers.get("Authorization") ?? "";
    if (!authorization.toLowerCase().startsWith("bearer ")) {
      return jsonResponse(401, {
        error_code: "auth_required",
        message: "A customer session is required to create a sandbox payment.",
      });
    }

    const body = await request.json().catch(() => ({}));
    const orderId = typeof body.order_id === "string"
      ? body.order_id.trim()
      : "";
    const bankCode = typeof body.bank_code === "string"
      ? body.bank_code.trim().toUpperCase()
      : "";
    const locale = body.locale === "en" ? "en" : "vn";

    if (!orderId) {
      return jsonResponse(400, {
        error_code: "order_id_required",
        message: "order_id is required.",
      });
    }

    if (!allowedBankCodes.has(bankCode)) {
      return jsonResponse(400, {
        error_code: "unsupported_vnpay_bank_code",
        message: "Use VNPAYQR, VNBANK, INTCARD, or omit bank_code.",
      });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: authorization },
      },
    });

    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData.user) {
      return jsonResponse(401, {
        error_code: "auth_invalid",
        message: "The customer session could not be verified.",
      });
    }

    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .select(
        "id, customer_actor_id, payment_method, payment_status, total_centavos, currency",
      )
      .eq("id", orderId)
      .eq("customer_actor_id", authData.user.id)
      .maybeSingle();

    if (orderError) {
      throw orderError;
    }

    if (!orderData) {
      return jsonResponse(404, {
        error_code: "order_not_found",
        message: "The order was not found for the current customer.",
      });
    }

    const order = orderData as OrderRow;
    if (order.payment_status !== "pending") {
      return jsonResponse(409, {
        error_code: "payment_not_pending",
        message:
          "Sandbox payment URL can only be created for pending payments.",
      });
    }
    assertPaymentRailMatchesOrder(order, bankCode);

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 15 * 60 * 1000);
    const paymentReference = `vnpay-test-${order.id}-${now.getTime()}`;
    const amountVnd = sandboxAmountVndFor(order);
    const params: Record<string, string> = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: tmnCode,
      vnp_Amount: String(amountVnd * 100),
      vnp_CurrCode: "VND",
      vnp_TxnRef: paymentReference,
      vnp_OrderInfo: normalizeOrderInfo(order.id),
      vnp_OrderType: "other",
      vnp_Locale: locale,
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: clientIpFor(request),
      vnp_CreateDate: vnpayTimestamp(now),
      vnp_ExpireDate: vnpayTimestamp(expiresAt),
    };

    if (bankCode) {
      params.vnp_BankCode = bankCode;
    }

    const signData = sortedQuery(params);
    const secureHash = await hmacSha512Hex(hashSecret, signData);
    const redirectUrl =
      `${paymentUrl}?${signData}&vnp_SecureHash=${secureHash}`;

    const supabaseAdmin = createSupabaseAdminClient();
    const { error: attemptError } = await supabaseAdmin
      .from("vnpay_sandbox_payment_attempts")
      .insert({
        order_id: order.id,
        customer_actor_id: order.customer_actor_id,
        payment_reference: paymentReference,
        payment_method: order.payment_method,
        expected_amount_vnd: amountVnd,
        expected_currency: "VND",
        expected_bank_code: bankCode || null,
        environment: "sandbox",
        return_url: returnUrl,
        payment_url: paymentUrl,
        expires_at: expiresAt.toISOString(),
      });

    if (attemptError) {
      throw attemptError;
    }

    return jsonResponse(200, {
      ok: true,
      provider: "vnpay",
      mode: "sandbox",
      order_id: order.id,
      payment_reference: paymentReference,
      payment_url: redirectUrl,
      amount_vnd: amountVnd,
      bank_code: bankCode || null,
      state_effect: "none",
      message:
        "Sandbox URL created. Contract/live payment completion remains disabled.",
    });
  } catch (error) {
    return jsonResponse(500, {
      error_code: "vnpay_sandbox_payment_create_failed",
      message: error instanceof Error ? error.message : String(error),
    });
  }
});
