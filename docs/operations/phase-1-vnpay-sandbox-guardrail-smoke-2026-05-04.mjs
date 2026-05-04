#!/usr/bin/env node

import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { createHmac, randomUUID } from "node:crypto";

const supabaseUrl = process.env.SUPABASE_URL ?? "";
const anonKey = process.env.SUPABASE_ANON_KEY ?? "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const vnpayHashSecret = process.env.VNPAY_SANDBOX_HASH_SECRET ?? "";
const outputRoot =
  process.env.VNPAY_GUARDRAIL_OUTPUT_ROOT ?? "output/vnpay-guardrail-smoke";
const callbackBaseUrl =
  process.env.VNPAY_CALLBACK_BASE_URL ??
  `${supabaseUrl.replace(/\/$/, "")}/functions/v1`;
const fixedAmountVnd = Number(
  process.env.VNPAY_SANDBOX_FIXED_AMOUNT_VND ?? "10000",
);

if (!supabaseUrl || !anonKey || !serviceRoleKey || !vnpayHashSecret) {
  throw new Error(
    "SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, and VNPAY_SANDBOX_HASH_SECRET are required.",
  );
}

if (!Number.isInteger(fixedAmountVnd) || fixedAmountVnd <= 0) {
  throw new Error("VNPAY_SANDBOX_FIXED_AMOUNT_VND must be a positive integer.");
}

const outputDir = resolve(
  outputRoot,
  `phase1-vnpay-guardrail-smoke-${new Date().toISOString().replaceAll(":", "-")}`,
);
mkdirSync(outputDir, { recursive: true });

function encodeQueryValue(value) {
  return encodeURIComponent(value).replace(/%20/g, "+");
}

function sortedQuery(params) {
  return Object.keys(params)
    .sort()
    .map((key) => `${encodeQueryValue(key)}=${encodeQueryValue(String(params[key]))}`)
    .join("&");
}

function signVnpay(params) {
  return createHmac("sha512", vnpayHashSecret)
    .update(sortedQuery(params))
    .digest("hex");
}

function serviceHeaders() {
  return {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    "Content-Type": "application/json",
  };
}

function anonHeaders() {
  return {
    apikey: anonKey,
  };
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  const text = await response.text();
  let body = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }
  return { status: response.status, ok: response.ok, body };
}

async function rest(path, options = {}) {
  return fetchJson(`${supabaseUrl.replace(/\/$/, "")}/rest/v1${path}`, options);
}

async function publicFunction(path) {
  const response = await fetch(`${callbackBaseUrl}/${path}`, {
    headers: anonHeaders(),
  });
  return {
    status: response.status,
    body: await response.text(),
  };
}

function pass(label, details) {
  return { label, status: "pass", details };
}

function fail(label, details) {
  throw new Error(`${label}: ${details}`);
}

async function findFixtureOrder() {
  const response = await rest(
    "/orders?select=id,customer_actor_id,payment_method,payment_status&payment_method=eq.card&payment_status=eq.pending&order=created_at.desc&limit=1",
    { headers: serviceHeaders() },
  );
  if (!response.ok || !Array.isArray(response.body) || response.body.length === 0) {
    fail(
      "fixture_order_missing",
      `No pending card order found. Response: ${JSON.stringify(response.body)}`,
    );
  }
  return response.body[0];
}

async function cleanupReference(paymentReference) {
  await rest(
    `/vnpay_sandbox_callback_receipts?payment_reference=eq.${encodeURIComponent(paymentReference)}`,
    { method: "DELETE", headers: serviceHeaders() },
  );
  await rest(
    `/vnpay_sandbox_payment_attempts?payment_reference=eq.${encodeURIComponent(paymentReference)}`,
    { method: "DELETE", headers: serviceHeaders() },
  );
}

async function seedAttempt({ order, paymentReference, amountVnd }) {
  const payload = {
    order_id: order.id,
    customer_actor_id: order.customer_actor_id,
    payment_reference: paymentReference,
    payment_method: "card",
    expected_amount_vnd: amountVnd,
    expected_currency: "VND",
    expected_bank_code: "VNBANK",
    environment: "sandbox",
    return_url: `${callbackBaseUrl}/vnpay-sandbox-return`,
    payment_url: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
    expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
  };
  const response = await rest("/vnpay_sandbox_payment_attempts", {
    method: "POST",
    headers: {
      ...serviceHeaders(),
      Prefer: "return=representation",
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    fail("seed_attempt_failed", JSON.stringify(response.body));
  }
  return payload;
}

function buildVnpayParams({ orderId, paymentReference, amountMinor, currency }) {
  return {
    vnp_Amount: String(amountMinor),
    vnp_BankCode: "NCB",
    vnp_BankTranNo: `VNP${Date.now()}`,
    vnp_CardType: "ATM",
    vnp_CurrCode: currency,
    vnp_OrderInfo: `Deliberry sandbox order ${orderId}`,
    vnp_PayDate: "20260504170500",
    vnp_ResponseCode: "00",
    vnp_TmnCode: "I2EPE8L4",
    vnp_TransactionNo: String(Date.now()).slice(-8),
    vnp_TransactionStatus: "00",
    vnp_TxnRef: paymentReference,
  };
}

async function readReceipts(paymentReference) {
  return rest(
    `/vnpay_sandbox_callback_receipts?select=callback_kind,validation_result,validation_reason,provider_amount_minor,provider_currency&payment_reference=eq.${encodeURIComponent(paymentReference)}&order=created_at.asc`,
    { headers: serviceHeaders() },
  );
}

async function readOrder(orderId) {
  return rest(
    `/orders?select=id,payment_status,status&id=eq.${encodeURIComponent(orderId)}`,
    { headers: serviceHeaders() },
  );
}

async function main() {
  const steps = [];
  const order = await findFixtureOrder();
  steps.push(pass("fixture_order_found", order));

  const paymentReference = `vnpay-test-${order.id}-${Date.now()}`;
  await cleanupReference(paymentReference);
  const seeded = await seedAttempt({
    order,
    paymentReference,
    amountVnd: fixedAmountVnd,
  });
  steps.push(pass("seed_attempt_inserted", seeded));

  const okParams = buildVnpayParams({
    orderId: order.id,
    paymentReference,
    amountMinor: fixedAmountVnd * 100,
    currency: "VND",
  });
  const wrongAmountParams = {
    ...okParams,
    vnp_Amount: String(fixedAmountVnd * 100 + 100),
  };
  const wrongCurrencyParams = {
    ...okParams,
    vnp_CurrCode: "USD",
  };

  const returnOk = await publicFunction(
    `vnpay-sandbox-return?${sortedQuery(okParams)}&vnp_SecureHash=${signVnpay(okParams)}`,
  );
  if (!returnOk.body.includes("Sandbox return accepted")) {
    fail("return_ok_failed", returnOk.body);
  }
  steps.push(pass("return_ok", returnOk));

  const returnDuplicate = await publicFunction(
    `vnpay-sandbox-return?${sortedQuery(okParams)}&vnp_SecureHash=${signVnpay(okParams)}`,
  );
  if (!returnDuplicate.body.includes("Sandbox return already recorded")) {
    fail("return_duplicate_failed", returnDuplicate.body);
  }
  steps.push(pass("return_duplicate", returnDuplicate));

  const ipnOk = await publicFunction(
    `vnpay-sandbox-ipn?${sortedQuery(okParams)}&vnp_SecureHash=${signVnpay(okParams)}`,
  );
  if (!String(ipnOk.body).includes('"RspCode":"00"')) {
    fail("ipn_ok_failed", ipnOk.body);
  }
  steps.push(pass("ipn_ok", ipnOk));

  const ipnDuplicate = await publicFunction(
    `vnpay-sandbox-ipn?${sortedQuery(okParams)}&vnp_SecureHash=${signVnpay(okParams)}`,
  );
  if (!String(ipnDuplicate.body).includes("duplicate acknowledged safely")) {
    fail("ipn_duplicate_failed", ipnDuplicate.body);
  }
  steps.push(pass("ipn_duplicate", ipnDuplicate));

  const ipnWrongAmount = await publicFunction(
    `vnpay-sandbox-ipn?${sortedQuery(wrongAmountParams)}&vnp_SecureHash=${signVnpay(wrongAmountParams)}`,
  );
  if (!String(ipnWrongAmount.body).includes("Sandbox payment amount mismatch")) {
    fail("ipn_wrong_amount_failed", ipnWrongAmount.body);
  }
  steps.push(pass("ipn_wrong_amount", ipnWrongAmount));

  const ipnWrongCurrency = await publicFunction(
    `vnpay-sandbox-ipn?${sortedQuery(wrongCurrencyParams)}&vnp_SecureHash=${signVnpay(wrongCurrencyParams)}`,
  );
  if (!String(ipnWrongCurrency.body).includes("Sandbox payment currency mismatch")) {
    fail("ipn_wrong_currency_failed", ipnWrongCurrency.body);
  }
  steps.push(pass("ipn_wrong_currency", ipnWrongCurrency));

  const receipts = await readReceipts(paymentReference);
  if (!receipts.ok) {
    fail("receipt_read_failed", JSON.stringify(receipts.body));
  }
  steps.push(pass("receipt_rows", receipts.body));

  const orderAfter = await readOrder(order.id);
  if (
    !orderAfter.ok ||
    !Array.isArray(orderAfter.body) ||
    orderAfter.body[0]?.payment_status !== "pending"
  ) {
    fail("order_pending_boundary_failed", JSON.stringify(orderAfter.body));
  }
  steps.push(pass("order_remains_pending", orderAfter.body[0]));

  await cleanupReference(paymentReference);
  steps.push(pass("cleanup_complete", { paymentReference }));

  const summary = {
    ran_at: new Date().toISOString(),
    fixture_order_id: order.id,
    payment_reference: paymentReference,
    amount_vnd: fixedAmountVnd,
    callback_base_url: callbackBaseUrl,
    steps,
  };
  const summaryPath = resolve(outputDir, "summary.json");
  writeFileSync(summaryPath, `${JSON.stringify(summary, null, 2)}\n`);
  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack : String(error));
  process.exitCode = 1;
});
