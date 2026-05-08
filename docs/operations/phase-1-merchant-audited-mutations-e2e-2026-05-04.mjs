#!/usr/bin/env node

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { randomUUID, randomBytes } from "node:crypto";

const supabaseUrl = requireEnv("SUPABASE_URL");
const anonKey = requireEnv("SUPABASE_ANON_KEY");
const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");

const outputRoot = process.env.MERCHANT_AUDIT_OUTPUT_ROOT ?? "output/merchant-audit";
const runStamp = new Date().toISOString().replace(/[:.]/g, "-");
const runDir = join(outputRoot, `phase1-merchant-audit-${runStamp}`);
mkdirSync(runDir, { recursive: true });

const emailSuffix = runStamp.toLowerCase().replace(/[^a-z0-9-]/g, "");

const fixtures = {
  merchant: {
    email: `phase1.merchant.audit.owner.${emailSuffix}@deliberry.local`,
    displayName: "Phase 1 Merchant Audit Owner",
    actorType: "merchant_owner",
  },
  otherMerchant: {
    email: `phase1.merchant.audit.other.${emailSuffix}@deliberry.local`,
    displayName: "Phase 1 Merchant Audit Other Owner",
    actorType: "merchant_owner",
  },
};

const ids = {
  ownStore: "phase1-merchant-audit-store",
  unownedStore: "phase1-merchant-audit-unowned-store",
  ownOrder: "phase1-merchant-audit-order-001",
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
        surface: "phase1-merchant-audit",
        actor_type: fixture.actorType,
      },
      app_metadata: {
        provider: "email",
        providers: ["email"],
        surface: "phase1-merchant-audit",
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

async function countAuditRows(action, resourceId) {
  const result = await serviceGet(
    `audit_logs?select=id,action,resource_id,before_state,after_state&action=eq.${action}&resource_id=eq.${resourceId}`,
  );
  if (!Array.isArray(result.body)) {
    fail("count audit rows", JSON.stringify(result, null, 2));
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
    `resource_id=in.(${ids.ownStore},${ids.unownedStore},${ids.ownOrder})&action=in.(merchant_order_status_updated,merchant_store_settings_updated,merchant_store_profile_updated)`,
  );

  await restUpsert(
    "actor_profiles",
    [
      {
        id: users.merchant.id,
        actor_type: "merchant_owner",
        display_name: fixtures.merchant.displayName,
        email: fixtures.merchant.email,
        phone_number: "+84 900 100 201",
      },
      {
        id: users.otherMerchant.id,
        actor_type: "merchant_owner",
        display_name: fixtures.otherMerchant.displayName,
        email: fixtures.otherMerchant.email,
        phone_number: "+84 900 100 202",
      },
    ],
    "id",
  );
  pass("merchant actor profiles upserted");

  await restUpsert(
    "merchant_profiles",
    [
      {
        user_id: users.merchant.id,
        merchant_name: "Phase 1 Merchant Audit Owner",
        onboarding_complete: true,
      },
      {
        user_id: users.otherMerchant.id,
        merchant_name: "Phase 1 Merchant Audit Other Owner",
        onboarding_complete: true,
      },
    ],
    "user_id",
  );
  pass("merchant profiles upserted");

  await restUpsert(
    "stores",
    [
      {
        id: ids.ownStore,
        merchant_actor_id: users.merchant.id,
        name: "Phase 1 Merchant Audit Store",
        city: "Ho Chi Minh City",
        is_open: true,
        address: "1 Audit Street",
        phone: "+84 28 3000 1100",
        email: "merchant-audit-store@deliberry.local",
        rating: 4.5,
        review_count: 0,
        status: "open",
        cuisine_type: "Vietnamese",
        hours_json: [{ day: "Monday", open: "09:00", close: "22:00" }],
        delivery_radius: "4 km",
        avg_prep_time: "18 min",
        accepting_orders: true,
        settings_json: {
          auto_accept_orders: false,
          order_notifications: true,
          rush_hour_mode: false,
          allow_special_instructions: true,
          email_reports: true,
          review_alerts: true,
          settlement_notifications: true,
          low_stock_alerts: false,
        },
      },
      {
        id: ids.unownedStore,
        merchant_actor_id: users.otherMerchant.id,
        name: "Phase 1 Merchant Audit Unowned Store",
        city: "Ho Chi Minh City",
        is_open: false,
        address: "2 Hidden Street",
        phone: "+84 28 3000 2200",
        email: "merchant-audit-unowned@deliberry.local",
        rating: 0,
        review_count: 0,
        status: "paused",
        cuisine_type: "Hidden",
        hours_json: [],
        delivery_radius: "0 km",
        avg_prep_time: "N/A",
        accepting_orders: false,
        settings_json: {
          auto_accept_orders: false,
          order_notifications: false,
        },
      },
    ],
    "id",
  );
  pass("audit stores upserted");

  await restUpsert(
    "merchant_memberships",
    [
      {
        user_id: users.merchant.id,
        store_id: ids.ownStore,
        role: "merchant_owner",
        is_default: true,
      },
      {
        user_id: users.otherMerchant.id,
        store_id: ids.unownedStore,
        role: "merchant_owner",
        is_default: true,
      },
    ],
    "user_id,store_id",
  );
  pass("merchant memberships upserted");

  await restUpsert(
    "orders",
    [
      {
        id: ids.ownOrder,
        customer_actor_id: users.merchant.id,
        store_id: ids.ownStore,
        status: "pending",
        payment_status: "pending",
        payment_method: "card",
        total_centavos: 125000,
        currency: "VND",
        customer_name: "Audit Customer",
        customer_phone: "+84 900 400 500",
        delivery_address: "5 Test Lane",
        notes: "merchant audited mutation fixture",
        subtotal_centavos: 90000,
        delivery_fee_centavos: 35000,
        estimated_delivery_at: new Date(Date.now() + 20 * 60 * 1000).toISOString(),
        line_items_summary: [{ name: "Audit Noodles", quantity: 1, unit_price_centavos: 90000 }],
        order_number: "#M2001",
      },
    ],
    "id",
  );
  pass("merchant order fixture upserted");

  return users;
}

async function verifyOrderStatusMutation(ownerToken, otherToken) {
  const idempotencyKey = randomUUID();

  const first = await authedRpc(ownerToken, "update_order_status_with_audit", {
    p_order_id: ids.ownOrder,
    p_store_id: ids.ownStore,
    p_next_status: "confirmed",
    p_idempotency_key: idempotencyKey,
  });
  if (!first.ok || first.body?.status !== "confirmed") {
    fail("merchant order status mutation succeeds", JSON.stringify(first, null, 2));
  }
  pass("merchant order status mutation succeeds");

  const afterFirstRows = await countAuditRows("merchant_order_status_updated", ids.ownOrder);
  expect(afterFirstRows.length === 1, "order status mutation writes one audit row");
  expect(
    afterFirstRows[0].before_state?.status === "pending" &&
      afterFirstRows[0].after_state?.status === "confirmed",
    "order status audit captures before and after state",
    JSON.stringify(afterFirstRows[0], null, 2),
  );

  const replay = await authedRpc(ownerToken, "update_order_status_with_audit", {
    p_order_id: ids.ownOrder,
    p_store_id: ids.ownStore,
    p_next_status: "confirmed",
    p_idempotency_key: idempotencyKey,
  });
  if (!replay.ok || replay.body?.status !== "confirmed") {
    fail("order status idempotency replay succeeds", JSON.stringify(replay, null, 2));
  }
  pass("order status idempotency replay succeeds");

  const afterReplayRows = await countAuditRows("merchant_order_status_updated", ids.ownOrder);
  expect(afterReplayRows.length === 1, "order status idempotency replay does not duplicate audit rows");

  const conflict = await authedRpc(ownerToken, "update_order_status_with_audit", {
    p_order_id: ids.ownOrder,
    p_store_id: ids.ownStore,
    p_next_status: "preparing",
    p_idempotency_key: idempotencyKey,
  });
  expect(!conflict.ok, "order status idempotency key rejects mismatched payload reuse", JSON.stringify(conflict, null, 2));

  const foreignAttempt = await authedRpc(otherToken, "update_order_status_with_audit", {
    p_order_id: ids.ownOrder,
    p_store_id: ids.ownStore,
    p_next_status: "preparing",
    p_idempotency_key: randomUUID(),
  });
  expect(!foreignAttempt.ok, "foreign merchant cannot mutate another store order status", JSON.stringify(foreignAttempt, null, 2));
}

async function verifyStoreSettingsMutation(ownerToken, otherToken) {
  const update = await authedRpc(ownerToken, "update_store_settings_with_audit", {
    p_store_id: ids.ownStore,
    p_settings_json: {
      auto_accept_orders: true,
      order_notifications: false,
      rush_hour_mode: true,
      allow_special_instructions: true,
      email_reports: false,
      review_alerts: true,
      settlement_notifications: true,
      low_stock_alerts: true,
    },
  });
  if (!update.ok || update.body?.settings_json?.order_notifications !== false) {
    fail("merchant store settings mutation succeeds", JSON.stringify(update, null, 2));
  }
  pass("merchant store settings mutation succeeds");

  const rows = await countAuditRows("merchant_store_settings_updated", ids.ownStore);
  expect(rows.length === 1, "store settings mutation writes one audit row");
  expect(
    rows[0].before_state?.settings_json?.order_notifications === true &&
      rows[0].after_state?.settings_json?.order_notifications === false,
    "store settings audit captures before and after state",
    JSON.stringify(rows[0], null, 2),
  );

  const foreignAttempt = await authedRpc(otherToken, "update_store_settings_with_audit", {
    p_store_id: ids.ownStore,
    p_settings_json: { order_notifications: true },
  });
  expect(!foreignAttempt.ok, "foreign merchant cannot mutate another store settings", JSON.stringify(foreignAttempt, null, 2));
}

async function verifyStoreProfileMutation(ownerToken, otherToken) {
  const update = await authedRpc(ownerToken, "update_store_profile_with_audit", {
    p_store_id: ids.ownStore,
    p_name: "Phase 1 Merchant Audit Store Updated",
    p_cuisine_type: "Vietnamese / Fusion",
    p_phone: "+84 28 3000 1199",
    p_email: "merchant-audit-store-updated@deliberry.local",
    p_address: "77 Updated Audit Street",
    p_delivery_radius: "6 km",
    p_avg_prep_time: "24 min",
    p_accepting_orders: true,
    p_hours_json: [
      { day: "Monday", open: "08:30", close: "22:30" },
      { day: "Tuesday", open: "08:30", close: "22:30" },
    ],
  });
  if (!update.ok || update.body?.name !== "Phase 1 Merchant Audit Store Updated") {
    fail("merchant store profile mutation succeeds", JSON.stringify(update, null, 2));
  }
  pass("merchant store profile mutation succeeds");

  const rows = await countAuditRows("merchant_store_profile_updated", ids.ownStore);
  expect(rows.length === 1, "store profile mutation writes one audit row");
  expect(
    rows[0].before_state?.name === "Phase 1 Merchant Audit Store" &&
      rows[0].after_state?.name === "Phase 1 Merchant Audit Store Updated",
    "store profile audit captures before and after state",
    JSON.stringify(rows[0], null, 2),
  );

  const foreignAttempt = await authedRpc(otherToken, "update_store_profile_with_audit", {
    p_store_id: ids.ownStore,
    p_name: "Foreign Mutation Attempt",
    p_cuisine_type: "Hidden",
    p_phone: "+84 28 9999 9999",
    p_email: "forbidden@deliberry.local",
    p_address: "Forbidden",
    p_delivery_radius: "1 km",
    p_avg_prep_time: "60 min",
    p_accepting_orders: false,
    p_hours_json: [],
  });
  expect(!foreignAttempt.ok, "foreign merchant cannot mutate another store profile", JSON.stringify(foreignAttempt, null, 2));
}

async function main() {
  await prepareFixture();

  const ownerToken = await signIn(fixtures.merchant.email, fixturePasswords.get("merchant"));
  const otherToken = await signIn(fixtures.otherMerchant.email, fixturePasswords.get("otherMerchant"));

  await verifyOrderStatusMutation(ownerToken, otherToken);
  await verifyStoreSettingsMutation(ownerToken, otherToken);
  await verifyStoreProfileMutation(ownerToken, otherToken);

  const summary = {
    generated_at: new Date().toISOString(),
    supabase_url: supabaseUrl,
    checks: results,
    store_id: ids.ownStore,
    order_id: ids.ownOrder,
  };
  const summaryPath = join(runDir, "summary.json");
  writeFileSync(summaryPath, JSON.stringify(summary, null, 2));

  console.log("PASS: phase 1 merchant audited mutations E2E complete");
  console.log(`Summary: ${summaryPath}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
