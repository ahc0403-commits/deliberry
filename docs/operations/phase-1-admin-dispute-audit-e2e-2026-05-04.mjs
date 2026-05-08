#!/usr/bin/env node

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { randomBytes } from "node:crypto";

const supabaseUrl = requireEnv("SUPABASE_URL");
const anonKey = requireEnv("SUPABASE_ANON_KEY");
const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");

const outputRoot = process.env.ADMIN_DISPUTE_AUDIT_OUTPUT_ROOT ?? "output/admin-dispute-audit";
const runStamp = new Date().toISOString().replace(/[:.]/g, "-");
const runDir = join(outputRoot, `phase1-admin-dispute-audit-${runStamp}`);
mkdirSync(runDir, { recursive: true });

const emailSuffix = runStamp.toLowerCase().replace(/[^a-z0-9-]/g, "");

const fixtures = {
  supportAdmin: {
    email: `phase1.dispute.support.${emailSuffix}@deliberry.local`,
    displayName: "Phase 1 Dispute Support Admin",
    actorType: "admin",
    role: "support_admin",
  },
  operationsAdmin: {
    email: `phase1.dispute.operations.${emailSuffix}@deliberry.local`,
    displayName: "Phase 1 Dispute Operations Admin",
    actorType: "admin",
    role: "operations_admin",
  },
  platformAdmin: {
    email: `phase1.dispute.platform.${emailSuffix}@deliberry.local`,
    displayName: "Phase 1 Dispute Platform Admin",
    actorType: "admin",
    role: "platform_admin",
  },
  financeAdmin: {
    email: `phase1.dispute.finance.${emailSuffix}@deliberry.local`,
    displayName: "Phase 1 Dispute Finance Admin",
    actorType: "admin",
    role: "finance_admin",
  },
  marketingAdmin: {
    email: `phase1.dispute.marketing.${emailSuffix}@deliberry.local`,
    displayName: "Phase 1 Dispute Marketing Admin",
    actorType: "admin",
    role: "marketing_admin",
  },
  merchant: {
    email: `phase1.dispute.merchant.${emailSuffix}@deliberry.local`,
    displayName: "Phase 1 Dispute Merchant",
    actorType: "merchant_owner",
  },
  customer: {
    email: `phase1.dispute.customer.${emailSuffix}@deliberry.local`,
    displayName: "Phase 1 Dispute Customer",
    actorType: "customer",
  },
};

const ids = {
  store: "phase1-admin-dispute-store",
  order: "phase1-admin-dispute-order-001",
  chainDispute: "phase1-admin-dispute-chain-001",
  invalidDispute: "phase1-admin-dispute-invalid-001",
};

const fixturePasswords = new Map();
const results = [];

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required`);
  }
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
  if (!condition) {
    fail(label, detail);
  }
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
      user_metadata: {
        surface: "phase1-admin-dispute-audit",
        actor_type: fixture.actorType,
      },
      app_metadata: {
        provider: "email",
        providers: ["email"],
        surface: "phase1-admin-dispute-audit",
      },
    }),
  });

  if (!createResult.ok || !createResult.body?.id) {
    fail(`create auth user ${fixture.email}`, JSON.stringify(createResult, null, 2));
  }

  pass(`created auth fixture ${fixture.email}`);
  return createResult.body;
}

async function restUpsert(table, rows, onConflict) {
  const result = await fetchJson(
    `${supabaseUrl}/rest/v1/${table}?on_conflict=${encodeURIComponent(onConflict)}`,
    {
      method: "POST",
      headers: {
        ...authHeaders(serviceRoleKey),
        Prefer: "resolution=merge-duplicates,return=representation",
      },
      body: JSON.stringify(rows),
    },
  );
  if (!result.ok) {
    fail(`upsert ${table}`, JSON.stringify(result, null, 2));
  }
  return result.body;
}

async function restDelete(table, query) {
  const result = await fetchJson(`${supabaseUrl}/rest/v1/${table}?${query}`, {
    method: "DELETE",
    headers: {
      ...authHeaders(serviceRoleKey),
      Prefer: "return=representation",
    },
  });
  if (!result.ok) {
    fail(`delete ${table}`, JSON.stringify(result, null, 2));
  }
  return result.body;
}

async function serviceGet(path) {
  const result = await fetchJson(`${supabaseUrl}/rest/v1/${path}`, {
    headers: authHeaders(serviceRoleKey),
  });
  if (!result.ok) {
    fail(`service get ${path}`, JSON.stringify(result, null, 2));
  }
  return result;
}

async function signIn(email, password) {
  const result = await fetchJson(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      apikey: anonKey,
      "content-type": "application/json",
    },
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
    headers: {
      apikey: anonKey,
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

async function getDisputeAuditRows(disputeId) {
  const result = await serviceGet(
    `audit_logs?select=id,action,resource_type,resource_id,before_state,after_state,timestamp_utc&action=eq.admin_dispute_status_updated&resource_id=eq.${disputeId}&order=timestamp_utc.asc`,
  );
  if (!Array.isArray(result.body)) {
    fail("load dispute audit rows", JSON.stringify(result, null, 2));
  }
  return result.body;
}

async function prepareFixture() {
  const users = {};
  for (const [key, fixture] of Object.entries(fixtures)) {
    users[key] = await ensureAuthUser(key, fixture);
  }

  await restDelete(
    "audit_logs",
    `resource_id=in.(${ids.chainDispute},${ids.invalidDispute})&action=eq.admin_dispute_status_updated`,
  );
  await restDelete(
    "admin_dispute_status_idempotency",
    `dispute_id=in.(${ids.chainDispute},${ids.invalidDispute})`,
  );

  await restUpsert(
    "actor_profiles",
    [
      {
        id: users.supportAdmin.id,
        actor_type: "admin",
        display_name: fixtures.supportAdmin.displayName,
        email: fixtures.supportAdmin.email,
      },
      {
        id: users.operationsAdmin.id,
        actor_type: "admin",
        display_name: fixtures.operationsAdmin.displayName,
        email: fixtures.operationsAdmin.email,
      },
      {
        id: users.platformAdmin.id,
        actor_type: "admin",
        display_name: fixtures.platformAdmin.displayName,
        email: fixtures.platformAdmin.email,
      },
      {
        id: users.financeAdmin.id,
        actor_type: "admin",
        display_name: fixtures.financeAdmin.displayName,
        email: fixtures.financeAdmin.email,
      },
      {
        id: users.marketingAdmin.id,
        actor_type: "admin",
        display_name: fixtures.marketingAdmin.displayName,
        email: fixtures.marketingAdmin.email,
      },
      {
        id: users.merchant.id,
        actor_type: "merchant_owner",
        display_name: fixtures.merchant.displayName,
        email: fixtures.merchant.email,
      },
      {
        id: users.customer.id,
        actor_type: "customer",
        display_name: fixtures.customer.displayName,
        email: fixtures.customer.email,
      },
    ],
    "id",
  );
  pass("dispute audit actor profiles upserted");

  await restUpsert(
    "admin_profiles",
    [
      { actor_id: users.supportAdmin.id, role: "support_admin", mfa_required: false },
      { actor_id: users.operationsAdmin.id, role: "operations_admin", mfa_required: false },
      { actor_id: users.platformAdmin.id, role: "platform_admin", mfa_required: false },
      { actor_id: users.financeAdmin.id, role: "finance_admin", mfa_required: false },
      { actor_id: users.marketingAdmin.id, role: "marketing_admin", mfa_required: false },
    ],
    "actor_id",
  );
  pass("dispute audit admin profiles upserted");

  await restUpsert(
    "merchant_profiles",
    [
      {
        user_id: users.merchant.id,
        merchant_name: "Phase 1 Dispute Merchant",
        onboarding_complete: true,
      },
    ],
    "user_id",
  );
  pass("dispute audit merchant profile upserted");

  await restUpsert(
    "stores",
    [
      {
        id: ids.store,
        merchant_actor_id: users.merchant.id,
        name: "Phase 1 Dispute Audit Store",
        city: "Ho Chi Minh City",
        is_open: true,
        address: "88 Dispute Lane",
        phone: "+84 28 3000 5500",
        email: "dispute-audit-store@deliberry.local",
        rating: 4.6,
        review_count: 0,
        status: "open",
        cuisine_type: "Vietnamese",
        hours_json: [{ day: "Monday", open: "09:00", close: "22:00" }],
        delivery_radius: "5 km",
        avg_prep_time: "20 min",
        accepting_orders: true,
        settings_json: {},
      },
    ],
    "id",
  );
  pass("dispute audit store upserted");

  await restUpsert(
    "orders",
    [
      {
        id: ids.order,
        customer_actor_id: users.customer.id,
        store_id: ids.store,
        status: "disputed",
        payment_status: "pending",
        payment_method: "cash",
        total_centavos: 180000,
        currency: "VND",
        customer_name: fixtures.customer.displayName,
        customer_phone: "+84 900 555 101",
        delivery_address: "77 Customer Street",
        notes: "Dispute audit fixture",
        subtotal_centavos: 150000,
        delivery_fee_centavos: 30000,
        estimated_delivery_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        line_items_summary: [{ name: "Audit Bun Bo", quantity: 1, unit_price_centavos: 150000 }],
        order_number: "#D5001",
      },
    ],
    "id",
  );
  pass("dispute audit order upserted");

  await restUpsert(
    "disputes",
    [
      {
        id: ids.chainDispute,
        case_number: "DSP-5001",
        order_id: ids.order,
        store_id: ids.store,
        customer_actor_id: users.customer.id,
        category: "delivery",
        priority: "high",
        status: "open",
        description: "Driver left the order at the wrong lobby.",
        amount_centavos: 180000,
      },
      {
        id: ids.invalidDispute,
        case_number: "DSP-5002",
        order_id: ids.order,
        store_id: ids.store,
        customer_actor_id: users.customer.id,
        category: "billing",
        priority: "medium",
        status: "open",
        description: "Customer reports duplicate charge review.",
        amount_centavos: 120000,
      },
    ],
    "id",
  );
  pass("dispute audit disputes upserted");

  return users;
}

async function main() {
  await prepareFixture();

  const supportToken = await signIn(fixtures.supportAdmin.email, fixturePasswords.get("supportAdmin"));
  const operationsToken = await signIn(fixtures.operationsAdmin.email, fixturePasswords.get("operationsAdmin"));
  const platformToken = await signIn(fixtures.platformAdmin.email, fixturePasswords.get("platformAdmin"));
  const financeToken = await signIn(fixtures.financeAdmin.email, fixturePasswords.get("financeAdmin"));
  const marketingToken = await signIn(fixtures.marketingAdmin.email, fixturePasswords.get("marketingAdmin"));
  const merchantToken = await signIn(fixtures.merchant.email, fixturePasswords.get("merchant"));

  const first = await authedRpc(supportToken, "update_dispute_status_with_audit", {
    p_dispute_id: ids.chainDispute,
    p_next_status: "investigating",
    p_admin_role: "support_admin",
  });
  if (!first.ok || first.body?.status !== "investigating") {
    fail("support admin moves dispute to investigating", JSON.stringify(first, null, 2));
  }
  pass("support admin moves dispute to investigating");

  let auditRows = await getDisputeAuditRows(ids.chainDispute);
  expect(auditRows.length === 1, "first dispute transition writes one audit row");
  expect(
    auditRows[0].before_state?.status === "open" &&
      auditRows[0].after_state?.status === "investigating",
    "first dispute transition captures before and after state",
    JSON.stringify(auditRows[0], null, 2),
  );

  const replay = await authedRpc(supportToken, "update_dispute_status_with_audit", {
    p_dispute_id: ids.chainDispute,
    p_next_status: "investigating",
    p_admin_role: "support_admin",
  });
  if (!replay.ok || replay.body?.status !== "investigating") {
    fail("duplicate dispute transition replay succeeds", JSON.stringify(replay, null, 2));
  }
  pass("duplicate dispute transition replay succeeds");

  auditRows = await getDisputeAuditRows(ids.chainDispute);
  expect(auditRows.length === 1, "duplicate dispute transition does not duplicate audit rows");

  const escalated = await authedRpc(operationsToken, "update_dispute_status_with_audit", {
    p_dispute_id: ids.chainDispute,
    p_next_status: "escalated",
    p_admin_role: "operations_admin",
  });
  if (!escalated.ok || escalated.body?.status !== "escalated") {
    fail("operations admin escalates investigating dispute", JSON.stringify(escalated, null, 2));
  }
  pass("operations admin escalates investigating dispute");

  auditRows = await getDisputeAuditRows(ids.chainDispute);
  expect(auditRows.length === 2, "second dispute transition appends audit row");
  expect(
    auditRows[1].before_state?.status === "investigating" &&
      auditRows[1].after_state?.status === "escalated",
    "escalation audit row captures before and after state",
    JSON.stringify(auditRows[1], null, 2),
  );

  const resolved = await authedRpc(platformToken, "update_dispute_status_with_audit", {
    p_dispute_id: ids.chainDispute,
    p_next_status: "resolved",
    p_admin_role: "platform_admin",
  });
  if (!resolved.ok || resolved.body?.status !== "resolved") {
    fail("platform admin resolves escalated dispute", JSON.stringify(resolved, null, 2));
  }
  pass("platform admin resolves escalated dispute");

  auditRows = await getDisputeAuditRows(ids.chainDispute);
  expect(auditRows.length === 3, "resolved dispute appends third audit row");
  expect(
    auditRows[2].before_state?.status === "escalated" &&
      auditRows[2].after_state?.status === "resolved",
    "resolved audit row captures before and after state",
    JSON.stringify(auditRows[2], null, 2),
  );

  const invalidTransition = await authedRpc(platformToken, "update_dispute_status_with_audit", {
    p_dispute_id: ids.invalidDispute,
    p_next_status: "resolved",
    p_admin_role: "platform_admin",
  });
  expect(
    !invalidTransition.ok && invalidTransition.status >= 400,
    "invalid dispute transition is rejected",
    JSON.stringify(invalidTransition, null, 2),
  );

  const financeBlocked = await authedRpc(financeToken, "update_dispute_status_with_audit", {
    p_dispute_id: ids.invalidDispute,
    p_next_status: "investigating",
    p_admin_role: "finance_admin",
  });
  expect(
    !financeBlocked.ok && financeBlocked.status >= 400,
    "finance admin cannot mutate disputes",
    JSON.stringify(financeBlocked, null, 2),
  );

  const marketingBlocked = await authedRpc(marketingToken, "update_dispute_status_with_audit", {
    p_dispute_id: ids.invalidDispute,
    p_next_status: "investigating",
    p_admin_role: "marketing_admin",
  });
  expect(
    !marketingBlocked.ok && marketingBlocked.status >= 400,
    "marketing admin cannot mutate disputes",
    JSON.stringify(marketingBlocked, null, 2),
  );

  const merchantBlocked = await authedRpc(merchantToken, "update_dispute_status_with_audit", {
    p_dispute_id: ids.invalidDispute,
    p_next_status: "investigating",
    p_admin_role: "support_admin",
  });
  expect(
    !merchantBlocked.ok && merchantBlocked.status >= 400,
    "non-admin actor cannot mutate disputes even with admin role payload",
    JSON.stringify(merchantBlocked, null, 2),
  );

  const summary = {
    runStamp,
    ids,
    results,
  };
  const summaryPath = join(runDir, "summary.json");
  writeFileSync(summaryPath, `${JSON.stringify(summary, null, 2)}\n`);
  console.log(`Wrote admin dispute audit summary to ${summaryPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
