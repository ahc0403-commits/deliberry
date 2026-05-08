#!/usr/bin/env node

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { randomBytes } from "node:crypto";

const supabaseUrl = requireEnv("SUPABASE_URL");
const anonKey = requireEnv("SUPABASE_ANON_KEY");
const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");

const outputRoot = process.env.MERCHANT_REVIEW_AUDIT_OUTPUT_ROOT ?? "output/merchant-review-audit";
const runStamp = new Date().toISOString().replace(/[:.]/g, "-");
const runDir = join(outputRoot, `phase1-merchant-review-audit-${runStamp}`);
mkdirSync(runDir, { recursive: true });

const emailSuffix = runStamp.toLowerCase().replace(/[^a-z0-9-]/g, "");

const fixtures = {
  merchant: {
    email: `phase1.review.audit.owner.${emailSuffix}@deliberry.local`,
    displayName: "Phase 1 Review Audit Owner",
    actorType: "merchant_owner",
  },
  otherMerchant: {
    email: `phase1.review.audit.other.${emailSuffix}@deliberry.local`,
    displayName: "Phase 1 Review Audit Other",
    actorType: "merchant_owner",
  },
  customer: {
    email: `phase1.review.audit.customer.${emailSuffix}@deliberry.local`,
    displayName: "Phase 1 Review Audit Customer",
    actorType: "customer",
  },
};

const ids = {
  ownStore: "phase1-review-audit-store",
  unownedStore: "phase1-review-audit-unowned-store",
  order: "phase1-review-audit-order-001",
  review: "phase1-review-audit-review-001",
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
        surface: "phase1-review-audit",
        actor_type: fixture.actorType,
      },
      app_metadata: {
        provider: "email",
        providers: ["email"],
        surface: "phase1-review-audit",
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

async function countAuditRows() {
  const result = await serviceGet(
    `audit_logs?select=id,action,resource_type,resource_id,before_state,after_state&action=eq.merchant_review_response_updated&resource_id=eq.${ids.review}`,
  );
  if (!Array.isArray(result.body)) {
    fail("count review audit rows", JSON.stringify(result, null, 2));
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
    `resource_id=eq.${ids.review}&action=eq.merchant_review_response_updated`,
  );

  await restUpsert(
    "actor_profiles",
    [
      {
        id: users.merchant.id,
        actor_type: "merchant_owner",
        display_name: fixtures.merchant.displayName,
        email: fixtures.merchant.email,
        phone_number: "+84 900 200 201",
      },
      {
        id: users.otherMerchant.id,
        actor_type: "merchant_owner",
        display_name: fixtures.otherMerchant.displayName,
        email: fixtures.otherMerchant.email,
        phone_number: "+84 900 200 202",
      },
      {
        id: users.customer.id,
        actor_type: "customer",
        display_name: fixtures.customer.displayName,
        email: fixtures.customer.email,
        phone_number: "+84 900 200 301",
      },
    ],
    "id",
  );
  pass("review audit actor profiles upserted");

  await restUpsert(
    "merchant_profiles",
    [
      {
        user_id: users.merchant.id,
        merchant_name: "Phase 1 Review Audit Owner",
        onboarding_complete: true,
      },
      {
        user_id: users.otherMerchant.id,
        merchant_name: "Phase 1 Review Audit Other",
        onboarding_complete: true,
      },
    ],
    "user_id",
  );
  pass("review audit merchant profiles upserted");

  await restUpsert(
    "stores",
    [
      {
        id: ids.ownStore,
        merchant_actor_id: users.merchant.id,
        name: "Phase 1 Review Audit Store",
        city: "Ho Chi Minh City",
        is_open: true,
        address: "31 Audit Row",
        phone: "+84 28 3000 3300",
        email: "review-audit-store@deliberry.local",
        rating: 4.4,
        review_count: 1,
        status: "open",
        cuisine_type: "Vietnamese",
        hours_json: [{ day: "Monday", open: "09:00", close: "22:00" }],
        delivery_radius: "5 km",
        avg_prep_time: "20 min",
        accepting_orders: true,
        settings_json: {},
      },
      {
        id: ids.unownedStore,
        merchant_actor_id: users.otherMerchant.id,
        name: "Phase 1 Review Audit Unowned Store",
        city: "Ho Chi Minh City",
        is_open: false,
        address: "44 Hidden Row",
        phone: "+84 28 3000 4400",
        email: "review-audit-unowned@deliberry.local",
        rating: 0,
        review_count: 0,
        status: "paused",
        cuisine_type: "Hidden",
        hours_json: [],
        delivery_radius: "0 km",
        avg_prep_time: "N/A",
        accepting_orders: false,
        settings_json: {},
      },
    ],
    "id",
  );
  pass("review audit stores upserted");

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
  pass("review audit memberships upserted");

  await restUpsert(
    "orders",
    [
      {
        id: ids.order,
        customer_actor_id: users.customer.id,
        store_id: ids.ownStore,
        status: "delivered",
        payment_status: "pending",
        payment_method: "cash",
        total_centavos: 140000,
        currency: "VND",
        customer_name: fixtures.customer.displayName,
        customer_phone: "+84 900 200 301",
        delivery_address: "10 Customer Ave",
        notes: null,
        subtotal_centavos: 105000,
        delivery_fee_centavos: 35000,
        estimated_delivery_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        line_items_summary: [{ name: "Audit Pho", quantity: 1, unit_price_centavos: 105000 }],
        order_number: "#R3001",
      },
    ],
    "id",
  );
  pass("review audit order upserted");

  await restUpsert(
    "customer_reviews",
    [
      {
        id: ids.review,
        order_id: ids.order,
        store_id: ids.ownStore,
        customer_actor_id: users.customer.id,
        rating: 4,
        review_text: "Great broth, could be a little hotter.",
        tags_json: ["Great food"],
        response_text: null,
        response_created_at: null,
        response_actor_id: null,
      },
    ],
    "id",
  );
  pass("review audit fixture upserted");

  return users;
}

async function main() {
  await prepareFixture();

  const ownerToken = await signIn(fixtures.merchant.email, fixturePasswords.get("merchant"));
  const otherToken = await signIn(fixtures.otherMerchant.email, fixturePasswords.get("otherMerchant"));

  const responseText = "Thanks for the note. We tightened the pickup and soup handoff process tonight.";

  const first = await authedRpc(ownerToken, "respond_to_customer_review_with_audit", {
    p_review_id: ids.review,
    p_store_id: ids.ownStore,
    p_response_text: responseText,
  });
  if (!first.ok || first.body?.response_text !== responseText) {
    fail("merchant review response mutation succeeds", JSON.stringify(first, null, 2));
  }
  pass("merchant review response mutation succeeds");

  const auditRows = await countAuditRows();
  expect(auditRows.length === 1, "review response mutation writes one audit row");
  expect(auditRows[0].resource_type === "Review", "review response audit row uses Review resource type", JSON.stringify(auditRows[0], null, 2));
  expect(
    auditRows[0].before_state?.response_text === null &&
      auditRows[0].after_state?.response_text === responseText,
    "review response audit captures before and after state",
    JSON.stringify(auditRows[0], null, 2),
  );

  const replay = await authedRpc(ownerToken, "respond_to_customer_review_with_audit", {
    p_review_id: ids.review,
    p_store_id: ids.ownStore,
    p_response_text: responseText,
  });
  if (!replay.ok || replay.body?.response_text !== responseText) {
    fail("review response duplicate replay succeeds", JSON.stringify(replay, null, 2));
  }
  pass("review response duplicate replay succeeds");

  const afterReplayRows = await countAuditRows();
  expect(afterReplayRows.length === 1, "review response duplicate replay does not duplicate audit rows");

  const changed = await authedRpc(ownerToken, "respond_to_customer_review_with_audit", {
    p_review_id: ids.review,
    p_store_id: ids.ownStore,
    p_response_text: "Follow-up response with an updated merchant note.",
  });
  if (!changed.ok || changed.body?.response_text !== "Follow-up response with an updated merchant note.") {
    fail("review response changed payload creates a new mutation", JSON.stringify(changed, null, 2));
  }
  pass("review response changed payload creates a new mutation");

  const afterChangedRows = await countAuditRows();
  expect(afterChangedRows.length === 2, "review response changed payload creates a second audit row");

  const foreignAttempt = await authedRpc(otherToken, "respond_to_customer_review_with_audit", {
    p_review_id: ids.review,
    p_store_id: ids.ownStore,
    p_response_text: "Forbidden foreign reply.",
  });
  expect(!foreignAttempt.ok, "foreign merchant cannot respond to another store review", JSON.stringify(foreignAttempt, null, 2));

  const summary = {
    generated_at: new Date().toISOString(),
    supabase_url: supabaseUrl,
    checks: results,
    review_id: ids.review,
    store_id: ids.ownStore,
  };
  const summaryPath = join(runDir, "summary.json");
  writeFileSync(summaryPath, JSON.stringify(summary, null, 2));

  console.log("PASS: phase 1 merchant review response audit E2E complete");
  console.log(`Summary: ${summaryPath}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
