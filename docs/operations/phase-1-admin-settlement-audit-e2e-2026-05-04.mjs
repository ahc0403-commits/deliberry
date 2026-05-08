#!/usr/bin/env node

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { randomBytes } from "node:crypto";

const supabaseUrl = requireEnv("SUPABASE_URL");
const anonKey = requireEnv("SUPABASE_ANON_KEY");
const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");

const outputRoot = process.env.ADMIN_SETTLEMENT_AUDIT_OUTPUT_ROOT ?? "output/admin-settlement-audit";
const runStamp = new Date().toISOString().replace(/[:.]/g, "-");
const runDir = join(outputRoot, `phase1-admin-settlement-audit-${runStamp}`);
mkdirSync(runDir, { recursive: true });

const emailSuffix = runStamp.toLowerCase().replace(/[^a-z0-9-]/g, "");

const fixtures = {
  financeAdmin: { email: `phase1.settlement.finance.${emailSuffix}@deliberry.local`, displayName: "Phase 1 Settlement Finance Admin", actorType: "admin", role: "finance_admin" },
  platformAdmin: { email: `phase1.settlement.platform.${emailSuffix}@deliberry.local`, displayName: "Phase 1 Settlement Platform Admin", actorType: "admin", role: "platform_admin" },
  supportAdmin: { email: `phase1.settlement.support.${emailSuffix}@deliberry.local`, displayName: "Phase 1 Settlement Support Admin", actorType: "admin", role: "support_admin" },
  marketingAdmin: { email: `phase1.settlement.marketing.${emailSuffix}@deliberry.local`, displayName: "Phase 1 Settlement Marketing Admin", actorType: "admin", role: "marketing_admin" },
  merchant: { email: `phase1.settlement.merchant.${emailSuffix}@deliberry.local`, displayName: "Phase 1 Settlement Merchant", actorType: "merchant_owner" },
};

const ids = {
  store: "phase1-admin-settlement-store",
  financeCalculated: "11111111-1111-4111-8111-111111111111",
  platformCalculated: "22222222-2222-4222-8222-222222222222",
  pendingSettlement: "33333333-3333-4333-8333-333333333333",
};

const fixturePasswords = new Map();
const results = [];

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required`);
  return value;
}

function pass(label) {
  results.push({ status: "pass", label });
  console.log(`PASS: ${label}`);
}

function fail(label, detail = "") {
  throw new Error(`FAIL: ${label}${detail ? `\n${detail}` : ""}`);
}

function expect(condition, label, detail = "") {
  if (!condition) fail(label, detail);
  pass(label);
}

function authHeaders(key) {
  return {
    apikey: key,
    authorization: `Bearer ${key}`,
    "content-type": "application/json",
  };
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  const text = await response.text();
  let body = null;
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
  }
  return { ok: response.ok, status: response.status, body };
}

async function ensureAuthUser(key, fixture) {
  const password = `P1-${randomBytes(12).toString("base64url")}`;
  fixturePasswords.set(key, password);
  const createResult = await fetchJson(`${supabaseUrl}/auth/v1/admin/users`, {
    method: "POST",
    headers: authHeaders(serviceRoleKey),
    body: JSON.stringify({
      email: fixture.email,
      password,
      email_confirm: true,
      user_metadata: { surface: "phase1-admin-settlement-audit", actor_type: fixture.actorType },
      app_metadata: { provider: "email", providers: ["email"], surface: "phase1-admin-settlement-audit" },
    }),
  });
  if (!createResult.ok || !createResult.body?.id) {
    fail(`create auth user ${fixture.email}`, JSON.stringify(createResult, null, 2));
  }
  pass(`created auth fixture ${fixture.email}`);
  return createResult.body;
}

async function restUpsert(table, rows, onConflict) {
  const result = await fetchJson(`${supabaseUrl}/rest/v1/${table}?on_conflict=${encodeURIComponent(onConflict)}`, {
    method: "POST",
    headers: { ...authHeaders(serviceRoleKey), Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify(rows),
  });
  if (!result.ok) fail(`upsert ${table}`, JSON.stringify(result, null, 2));
  return result.body;
}

async function restDelete(table, query) {
  const result = await fetchJson(`${supabaseUrl}/rest/v1/${table}?${query}`, {
    method: "DELETE",
    headers: { ...authHeaders(serviceRoleKey), Prefer: "return=representation" },
  });
  if (!result.ok) fail(`delete ${table}`, JSON.stringify(result, null, 2));
  return result.body;
}

async function serviceGet(path) {
  const result = await fetchJson(`${supabaseUrl}/rest/v1/${path}`, { headers: authHeaders(serviceRoleKey) });
  if (!result.ok) fail(`service get ${path}`, JSON.stringify(result, null, 2));
  return result;
}

async function signIn(email, password) {
  const result = await fetchJson(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: anonKey, "content-type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!result.ok || typeof result.body?.access_token !== "string") {
    fail(`sign in ${email}`, JSON.stringify(result, null, 2));
  }
  pass(`sign in ${email}`);
  return result.body.access_token;
}

async function authedRpc(token, name, payload) {
  return fetchJson(`${supabaseUrl}/rest/v1/rpc/${name}`, {
    method: "POST",
    headers: { apikey: anonKey, authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
}

async function getSettlementAuditRows(settlementId) {
  const result = await serviceGet(
    `audit_logs?select=id,action,resource_type,resource_id,before_state,after_state,timestamp_utc&action=eq.admin_settlement_received_acknowledged&resource_id=eq.${settlementId}&order=timestamp_utc.asc`,
  );
  if (!Array.isArray(result.body)) fail("load settlement audit rows", JSON.stringify(result, null, 2));
  return result.body;
}

async function prepareFixture() {
  const users = {};
  for (const [key, fixture] of Object.entries(fixtures)) {
    users[key] = await ensureAuthUser(key, fixture);
  }

  await restDelete(
    "audit_logs",
    `resource_id=in.(${ids.financeCalculated},${ids.platformCalculated},${ids.pendingSettlement})&action=eq.admin_settlement_received_acknowledged`,
  );
  await restDelete(
    "admin_settlement_receipt_idempotency",
    `settlement_id=in.(${ids.financeCalculated},${ids.platformCalculated},${ids.pendingSettlement})`,
  );

  await restUpsert("actor_profiles", [
    { id: users.financeAdmin.id, actor_type: "admin", display_name: fixtures.financeAdmin.displayName, email: fixtures.financeAdmin.email },
    { id: users.platformAdmin.id, actor_type: "admin", display_name: fixtures.platformAdmin.displayName, email: fixtures.platformAdmin.email },
    { id: users.supportAdmin.id, actor_type: "admin", display_name: fixtures.supportAdmin.displayName, email: fixtures.supportAdmin.email },
    { id: users.marketingAdmin.id, actor_type: "admin", display_name: fixtures.marketingAdmin.displayName, email: fixtures.marketingAdmin.email },
    { id: users.merchant.id, actor_type: "merchant_owner", display_name: fixtures.merchant.displayName, email: fixtures.merchant.email },
  ], "id");
  pass("settlement audit actor profiles upserted");

  await restUpsert("admin_profiles", [
    { actor_id: users.financeAdmin.id, role: "finance_admin", mfa_required: false },
    { actor_id: users.platformAdmin.id, role: "platform_admin", mfa_required: false },
    { actor_id: users.supportAdmin.id, role: "support_admin", mfa_required: false },
    { actor_id: users.marketingAdmin.id, role: "marketing_admin", mfa_required: false },
  ], "actor_id");
  pass("settlement audit admin profiles upserted");

  await restUpsert("merchant_profiles", [
    { user_id: users.merchant.id, merchant_name: "Phase 1 Settlement Merchant", onboarding_complete: true },
  ], "user_id");
  pass("settlement audit merchant profile upserted");

  await restUpsert("stores", [
    {
      id: ids.store,
      merchant_actor_id: users.merchant.id,
      name: "Phase 1 Settlement Audit Store",
      city: "Ho Chi Minh City",
      is_open: true,
      address: "10 Settlement Road",
      phone: "+84 28 3000 8800",
      email: "settlement-audit-store@deliberry.local",
      rating: 4.5,
      review_count: 0,
      status: "open",
      cuisine_type: "Vietnamese",
      hours_json: [{ day: "Monday", open: "09:00", close: "22:00" }],
      delivery_radius: "5 km",
      avg_prep_time: "19 min",
      accepting_orders: true,
      settings_json: {},
    },
  ], "id");
  pass("settlement audit store upserted");

  await restUpsert("delivery_settlements", [
    {
      id: ids.financeCalculated,
      restaurant_id: ids.store,
      source_system: "deliberry",
      period_start: "2026-05-01",
      period_end: "2026-05-03",
      period_label: "2026-W18-finance",
      gross_total: 300000,
      total_deductions: 45000,
      net_settlement: 255000,
      status: "calculated",
      received_at: null,
      notes: "finance acknowledgment fixture",
    },
    {
      id: ids.platformCalculated,
      restaurant_id: ids.store,
      source_system: "deliberry",
      period_start: "2026-05-04",
      period_end: "2026-05-06",
      period_label: "2026-W18-platform",
      gross_total: 340000,
      total_deductions: 51000,
      net_settlement: 289000,
      status: "calculated",
      received_at: null,
      notes: "platform acknowledgment fixture",
    },
    {
      id: ids.pendingSettlement,
      restaurant_id: ids.store,
      source_system: "deliberry",
      period_start: "2026-05-07",
      period_end: "2026-05-09",
      period_label: "2026-W18-pending",
      gross_total: 200000,
      total_deductions: 30000,
      net_settlement: 170000,
      status: "pending",
      received_at: null,
      notes: "invalid transition fixture",
    },
  ], "id");
  pass("settlement audit settlement rows upserted");

  await restUpsert("delivery_settlement_items", [
    {
      id: "44444444-4444-4444-8444-444444444441",
      settlement_id: ids.financeCalculated,
      item_type: "platform_commission",
      amount: 45000,
      description: "Platform commission",
    },
    {
      id: "44444444-4444-4444-8444-444444444442",
      settlement_id: ids.platformCalculated,
      item_type: "platform_commission",
      amount: 51000,
      description: "Platform commission",
    },
    {
      id: "44444444-4444-4444-8444-444444444443",
      settlement_id: ids.pendingSettlement,
      item_type: "platform_commission",
      amount: 30000,
      description: "Platform commission",
    },
  ], "id");
  pass("settlement audit settlement items upserted");
}

async function main() {
  await prepareFixture();

  const financeToken = await signIn(fixtures.financeAdmin.email, fixturePasswords.get("financeAdmin"));
  const platformToken = await signIn(fixtures.platformAdmin.email, fixturePasswords.get("platformAdmin"));
  const supportToken = await signIn(fixtures.supportAdmin.email, fixturePasswords.get("supportAdmin"));
  const marketingToken = await signIn(fixtures.marketingAdmin.email, fixturePasswords.get("marketingAdmin"));
  const merchantToken = await signIn(fixtures.merchant.email, fixturePasswords.get("merchant"));

  const first = await authedRpc(financeToken, "acknowledge_settlement_received_with_audit", {
    p_settlement_id: ids.financeCalculated,
  });
  if (!first.ok || first.body?.status !== "received") {
    fail("finance admin acknowledges calculated settlement", JSON.stringify(first, null, 2));
  }
  pass("finance admin acknowledges calculated settlement");

  let auditRows = await getSettlementAuditRows(ids.financeCalculated);
  expect(auditRows.length === 1, "first settlement acknowledgment writes one audit row");
  expect(
    auditRows[0].before_state?.status === "calculated" &&
      auditRows[0].after_state?.status === "received",
    "settlement acknowledgment captures before and after state",
    JSON.stringify(auditRows[0], null, 2),
  );

  const replay = await authedRpc(financeToken, "acknowledge_settlement_received_with_audit", {
    p_settlement_id: ids.financeCalculated,
  });
  if (!replay.ok || replay.body?.status !== "received") {
    fail("duplicate settlement acknowledgment replay succeeds", JSON.stringify(replay, null, 2));
  }
  pass("duplicate settlement acknowledgment replay succeeds");

  auditRows = await getSettlementAuditRows(ids.financeCalculated);
  expect(auditRows.length === 1, "duplicate settlement acknowledgment does not duplicate audit rows");

  const platformAck = await authedRpc(platformToken, "acknowledge_settlement_received_with_audit", {
    p_settlement_id: ids.platformCalculated,
  });
  if (!platformAck.ok || platformAck.body?.status !== "received") {
    fail("platform admin acknowledges calculated settlement", JSON.stringify(platformAck, null, 2));
  }
  pass("platform admin acknowledges calculated settlement");

  const platformRows = await getSettlementAuditRows(ids.platformCalculated);
  expect(platformRows.length === 1, "platform settlement acknowledgment writes one audit row");

  const invalid = await authedRpc(platformToken, "acknowledge_settlement_received_with_audit", {
    p_settlement_id: ids.pendingSettlement,
  });
  expect(!invalid.ok && invalid.status >= 400, "pending settlement cannot be acknowledged as received", JSON.stringify(invalid, null, 2));

  const supportBlocked = await authedRpc(supportToken, "acknowledge_settlement_received_with_audit", {
    p_settlement_id: ids.pendingSettlement,
  });
  expect(!supportBlocked.ok && supportBlocked.status >= 400, "support admin cannot acknowledge settlements", JSON.stringify(supportBlocked, null, 2));

  const marketingBlocked = await authedRpc(marketingToken, "acknowledge_settlement_received_with_audit", {
    p_settlement_id: ids.pendingSettlement,
  });
  expect(!marketingBlocked.ok && marketingBlocked.status >= 400, "marketing admin cannot acknowledge settlements", JSON.stringify(marketingBlocked, null, 2));

  const merchantBlocked = await authedRpc(merchantToken, "acknowledge_settlement_received_with_audit", {
    p_settlement_id: ids.pendingSettlement,
  });
  expect(!merchantBlocked.ok && merchantBlocked.status >= 400, "non-admin actor cannot acknowledge settlements", JSON.stringify(merchantBlocked, null, 2));

  const summary = { runStamp, ids, results };
  const summaryPath = join(runDir, "summary.json");
  writeFileSync(summaryPath, `${JSON.stringify(summary, null, 2)}\n`);
  console.log(`Wrote admin settlement audit summary to ${summaryPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
