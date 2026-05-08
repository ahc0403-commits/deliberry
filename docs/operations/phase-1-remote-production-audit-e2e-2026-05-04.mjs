#!/usr/bin/env node

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { randomUUID, randomBytes } from "node:crypto";

const supabaseUrl = requireEnv("SUPABASE_URL");
const anonKey = requireEnv("SUPABASE_ANON_KEY");
const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");

const outputRoot = process.env.REMOTE_AUDIT_OUTPUT_ROOT ?? "output/remote-audit";
const runStamp = new Date().toISOString().replace(/[:.]/g, "-");
const runDir = join(outputRoot, `phase1-remote-audit-${runStamp}`);
mkdirSync(runDir, { recursive: true });

const emailSuffix = runStamp.toLowerCase().replace(/[^a-z0-9-]/g, "");

const fixtures = {
  customerOne: {
    email: `phase1.audit.customer.one.${emailSuffix}@deliberry.local`,
    displayName: "Phase 1 Audit Customer One",
    actorType: "customer",
  },
  customerTwo: {
    email: `phase1.audit.customer.two.${emailSuffix}@deliberry.local`,
    displayName: "Phase 1 Audit Customer Two",
    actorType: "customer",
  },
  merchant: {
    email: `phase1.audit.merchant.${emailSuffix}@deliberry.local`,
    displayName: "Phase 1 Audit Merchant",
    actorType: "merchant_owner",
  },
  otherMerchant: {
    email: `phase1.audit.other-merchant.${emailSuffix}@deliberry.local`,
    displayName: "Phase 1 Audit Other Merchant",
    actorType: "merchant_owner",
  },
  admin: {
    email: `phase1.audit.admin.${emailSuffix}@deliberry.local`,
    displayName: "Phase 1 Audit Admin",
    actorType: "admin",
  },
};

const ids = {
  ownStore: "phase1-remote-audit-store",
  unownedStore: "phase1-remote-audit-unowned-store",
  ownMenuOne: "phase1-remote-menu-001",
  ownMenuTwo: "phase1-remote-menu-002",
  ownMenuAudit: "phase1-remote-menu-audit-created",
  unownedMenu: "phase1-remote-unowned-menu-001",
  customerOneOrder: "phase1-remote-ord-001",
  customerTwoOrder: "phase1-remote-ord-002",
  customerOneOrderTwo: "phase1-remote-ord-003",
  reviewOne: "phase1-remote-review-001",
  reviewTwo: "phase1-remote-review-002",
  reviewThree: "phase1-remote-review-003",
  disputeOne: "phase1-remote-disp-001",
  supportOne: "phase1-remote-ticket-001",
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

function pass(label, detail = "") {
  results.push({ status: "pass", label, detail });
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
        surface: "phase1-remote-audit",
        actor_type: fixture.actorType,
      },
      app_metadata: {
        provider: "email",
        providers: ["email"],
        surface: "phase1-remote-audit",
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

async function authedGet(token, path) {
  return fetchJson(`${supabaseUrl}/rest/v1/${path}`, {
    headers: {
      apikey: anonKey,
      authorization: `Bearer ${token}`,
    },
  });
}

async function authedInsert(token, table, payload) {
  return fetchJson(`${supabaseUrl}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      apikey: anonKey,
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(payload),
  });
}

async function authedPatch(token, table, query, payload) {
  return fetchJson(`${supabaseUrl}/rest/v1/${table}?${query}`, {
    method: "PATCH",
    headers: {
      apikey: anonKey,
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(payload),
  });
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

function expectRows(result, count, label) {
  if (!result.ok || !Array.isArray(result.body) || result.body.length !== count) {
    fail(label, JSON.stringify(result, null, 2));
  }
  pass(label);
}

function expectAtLeast(result, count, label) {
  if (!result.ok || !Array.isArray(result.body) || result.body.length < count) {
    fail(label, JSON.stringify(result, null, 2));
  }
  pass(label);
}

function expectBlockedOrEmpty(result, label) {
  if (!result.ok && [401, 403, 404].includes(result.status)) {
    pass(label);
    return;
  }
  if (result.ok && Array.isArray(result.body) && result.body.length === 0) {
    pass(label);
    return;
  }
  fail(label, JSON.stringify(result, null, 2));
}

async function prepareFixture() {
  const users = {};
  for (const [key, fixture] of Object.entries(fixtures)) {
    users[key] = await ensureAuthUser(key, fixture);
  }

  await restDelete(
    "audit_logs",
    `resource_id=in.(${ids.ownStore},${ids.unownedStore})&action=in.(merchant_menu_item_created,merchant_menu_item_availability_updated)`,
  );

  await restDelete(
    "store_menu_items",
    `id=in.(${ids.ownMenuOne},${ids.ownMenuTwo},${ids.ownMenuAudit},${ids.unownedMenu})`,
  );

  await restUpsert(
    "actor_profiles",
    [
      {
        id: users.customerOne.id,
        actor_type: "customer",
        display_name: fixtures.customerOne.displayName,
        email: fixtures.customerOne.email,
        phone_number: "+84 900 000 101",
      },
      {
        id: users.customerTwo.id,
        actor_type: "customer",
        display_name: fixtures.customerTwo.displayName,
        email: fixtures.customerTwo.email,
        phone_number: "+84 900 000 102",
      },
      {
        id: users.merchant.id,
        actor_type: "merchant_owner",
        display_name: fixtures.merchant.displayName,
        email: fixtures.merchant.email,
        phone_number: "+84 900 000 201",
      },
      {
        id: users.otherMerchant.id,
        actor_type: "merchant_owner",
        display_name: fixtures.otherMerchant.displayName,
        email: fixtures.otherMerchant.email,
        phone_number: "+84 900 000 202",
      },
      {
        id: users.admin.id,
        actor_type: "admin",
        display_name: fixtures.admin.displayName,
        email: fixtures.admin.email,
        phone_number: null,
      },
    ],
    "id",
  );
  pass("actor profiles upserted for remote audit fixtures");

  await restUpsert(
    "merchant_profiles",
    [
      {
        user_id: users.merchant.id,
        merchant_name: "Phase 1 Remote Audit Merchant",
        onboarding_complete: true,
      },
      {
        user_id: users.otherMerchant.id,
        merchant_name: "Phase 1 Remote Audit Other Merchant",
        onboarding_complete: true,
      },
    ],
    "user_id",
  );
  pass("merchant profiles upserted for remote audit fixtures");

  await restUpsert(
    "admin_profiles",
    [
      {
        actor_id: users.admin.id,
        role: "platform_admin",
        mfa_required: false,
      },
    ],
    "actor_id",
  );
  pass("admin profile upserted for remote audit fixture");

  await restUpsert(
    "stores",
    [
      {
        id: ids.ownStore,
        merchant_actor_id: users.merchant.id,
        name: "Phase 1 Remote Audit Store",
        city: "Ho Chi Minh City",
        is_open: true,
        address: "12 Nguyen Hue, District 1",
        phone: "+84 28 3000 1000",
        email: "audit-store@deliberry.local",
        rating: 4.7,
        review_count: 3,
        status: "open",
        cuisine_type: "Vietnamese",
        hours_json: [
          { day: "Monday", open: "09:00", close: "22:00" },
          { day: "Tuesday", open: "09:00", close: "22:00" },
        ],
        delivery_radius: "5 km",
        avg_prep_time: "22 min",
        accepting_orders: true,
        settings_json: { order_notifications: true },
      },
      {
        id: ids.unownedStore,
        merchant_actor_id: users.otherMerchant.id,
        name: "Phase 1 Remote Audit Unowned Store",
        city: "Ho Chi Minh City",
        is_open: false,
        address: "99 Hidden Alley",
        phone: "+84 28 3000 2000",
        email: "audit-unowned@deliberry.local",
        rating: 0,
        review_count: 0,
        status: "paused",
        cuisine_type: "Hidden",
        hours_json: [],
        delivery_radius: "0 km",
        avg_prep_time: "N/A",
        accepting_orders: false,
        settings_json: { order_notifications: false },
      },
    ],
    "id",
  );
  pass("stores upserted for remote audit fixtures");

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
  pass("merchant memberships upserted for remote audit fixtures");

  await restUpsert(
    "store_menu_items",
    [
      {
        id: ids.ownMenuOne,
        store_id: ids.ownStore,
        name: "Phase 1 Audit Bowl",
        description: "Primary menu item for remote audit boundary checks.",
        category: "Main",
        price_centavos: 180000,
        image_color_hex: "#D71920",
        is_popular: true,
        is_available: true,
        sort_order: 1,
      },
      {
        id: ids.ownMenuTwo,
        store_id: ids.ownStore,
        name: "Phase 1 Audit Tea",
        description: "Secondary menu item for remote audit boundary checks.",
        category: "Drink",
        price_centavos: 45000,
        image_color_hex: "#00897B",
        is_popular: false,
        is_available: true,
        sort_order: 2,
      },
      {
        id: ids.unownedMenu,
        store_id: ids.unownedStore,
        name: "Forbidden Remote Item",
        description: "Fixture for unowned-store negative tests.",
        category: "Hidden",
        price_centavos: 1000,
        image_color_hex: "#777777",
        is_popular: false,
        is_available: true,
        sort_order: 1,
      },
    ],
    "id",
  );
  pass("menu items upserted for remote audit fixtures");

  await restUpsert(
    "orders",
    [
      {
        id: ids.customerOneOrder,
        customer_actor_id: users.customerOne.id,
        store_id: ids.ownStore,
        status: "pending",
        payment_status: "pending",
        payment_method: "card",
        total_centavos: 225000,
        currency: "VND",
        customer_name: fixtures.customerOne.displayName,
        customer_phone: "+84 900 000 101",
        delivery_address: "88 Le Loi, District 1",
        notes: "Remote audit fixture one",
        subtotal_centavos: 190000,
        delivery_fee_centavos: 35000,
        estimated_delivery_at: new Date(Date.now() + 25 * 60 * 1000).toISOString(),
        line_items_summary: [
          { name: "Phase 1 Audit Bowl", quantity: 1, unit_price_centavos: 180000 },
          { name: "Phase 1 Audit Tea", quantity: 1, unit_price_centavos: 45000 },
        ],
        order_number: "#R1001",
      },
      {
        id: ids.customerTwoOrder,
        customer_actor_id: users.customerTwo.id,
        store_id: ids.ownStore,
        status: "preparing",
        payment_status: "pending",
        payment_method: "cash",
        total_centavos: 180000,
        currency: "VND",
        customer_name: fixtures.customerTwo.displayName,
        customer_phone: "+84 900 000 102",
        delivery_address: "22 Hai Ba Trung, District 1",
        notes: null,
        subtotal_centavos: 145000,
        delivery_fee_centavos: 35000,
        estimated_delivery_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
        line_items_summary: [
          { name: "Phase 1 Audit Bowl", quantity: 1, unit_price_centavos: 180000 },
        ],
        order_number: "#R1002",
      },
      {
        id: ids.customerOneOrderTwo,
        customer_actor_id: users.customerOne.id,
        store_id: ids.ownStore,
        status: "ready",
        payment_status: "pending",
        payment_method: "card",
        total_centavos: 270000,
        currency: "VND",
        customer_name: fixtures.customerOne.displayName,
        customer_phone: "+84 900 000 101",
        delivery_address: "15 Dong Khoi, District 1",
        notes: "Remote audit fixture three",
        subtotal_centavos: 270000,
        delivery_fee_centavos: 0,
        estimated_delivery_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
        line_items_summary: [
          { name: "Phase 1 Audit Bowl", quantity: 1, unit_price_centavos: 180000 },
          { name: "Phase 1 Audit Tea", quantity: 2, unit_price_centavos: 45000 },
        ],
        order_number: "#R1003",
      },
    ],
    "id",
  );
  pass("orders upserted for remote audit fixtures");

  await restUpsert(
    "customer_reviews",
    [
      {
        id: ids.reviewOne,
        order_id: ids.customerTwoOrder,
        store_id: ids.ownStore,
        customer_actor_id: users.customerTwo.id,
        rating: 5,
        review_text: "Fast prep and accurate handoff.",
        tags_json: ["Fast delivery", "Accurate order"],
        response_text: null,
        response_created_at: null,
        response_actor_id: null,
      },
      {
        id: ids.reviewTwo,
        order_id: ids.customerOneOrderTwo,
        store_id: ids.ownStore,
        customer_actor_id: users.customerOne.id,
        rating: 4,
        review_text: "Great taste, pickup was a little slow.",
        tags_json: ["Great food"],
        response_text: "Thanks, we tightened pickup timing tonight.",
        response_created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        response_actor_id: users.merchant.id,
      },
      {
        id: ids.reviewThree,
        order_id: ids.customerOneOrder,
        store_id: ids.ownStore,
        customer_actor_id: users.customerOne.id,
        rating: 3,
        review_text: "Packaging could be better.",
        tags_json: ["Packaging"],
        response_text: null,
        response_created_at: null,
        response_actor_id: null,
      },
    ],
    "id",
  );
  pass("reviews upserted for remote audit fixtures");

  await restUpsert(
    "disputes",
    [
      {
        id: ids.disputeOne,
        case_number: "DSP-REMOTE-001",
        order_id: ids.customerOneOrder,
        store_id: ids.ownStore,
        customer_actor_id: users.customerOne.id,
        category: "quality",
        priority: "high",
        status: "open",
        description: "Remote audit dispute fixture.",
        amount_centavos: 225000,
      },
    ],
    "id",
  );
  pass("dispute fixture upserted");

  await restUpsert(
    "support_tickets",
    [
      {
        id: ids.supportOne,
        ticket_number: "TKT-REMOTE-001",
        actor_id: users.customerOne.id,
        order_id: ids.customerOneOrder,
        store_id: ids.ownStore,
        subject: "Remote audit support fixture",
        category: "order_issue",
        priority: "high",
        status: "open",
        assignee_name: "Unassigned",
      },
    ],
    "id",
  );
  pass("support ticket fixture upserted");

  return users;
}

async function verifyAuthBoundary(tokens, users) {
  expectRows(
    await authedGet(tokens.customerOne, `orders?select=id&id=eq.${ids.customerOneOrder}`),
    1,
    "customer one can read own order via remote API",
  );
  expectBlockedOrEmpty(
    await authedGet(tokens.customerOne, `orders?select=id&id=eq.${ids.customerTwoOrder}`),
    "customer one cannot read customer two order via remote API",
  );
  expectBlockedOrEmpty(
    await authedGet(tokens.customerOne, `customer_reviews?select=id&id=eq.${ids.reviewOne}`),
    "customer one cannot read customer two review via remote API",
  );
  expectBlockedOrEmpty(
    await authedGet(tokens.customerOne, "audit_logs?select=id&limit=1"),
    "customer cannot read audit logs via remote API",
  );
  expectBlockedOrEmpty(
    await authedGet(tokens.customerOne, "support_tickets?select=id&limit=1"),
    "customer cannot read support tickets via remote API",
  );
  expectBlockedOrEmpty(
    await authedGet(tokens.customerOne, "disputes?select=id&limit=1"),
    "customer cannot read disputes via remote API",
  );

  expectRows(
    await authedGet(tokens.customerTwo, `orders?select=id&id=eq.${ids.customerTwoOrder}`),
    1,
    "customer two can read own order via remote API",
  );
  expectBlockedOrEmpty(
    await authedGet(tokens.customerTwo, `orders?select=id&id=eq.${ids.customerOneOrder}`),
    "customer two cannot read customer one order via remote API",
  );
  expectBlockedOrEmpty(
    await authedGet(tokens.customerTwo, `customer_reviews?select=id&id=eq.${ids.reviewThree}`),
    "customer two cannot read customer one review via remote API",
  );

  expectRows(
    await authedGet(tokens.merchant, `stores?select=id&id=eq.${ids.ownStore}`),
    1,
    "merchant can read own store via remote API",
  );
  expectAtLeast(
    await authedGet(tokens.merchant, `orders?select=id&store_id=eq.${ids.ownStore}`),
    3,
    "merchant can read own store orders via remote API",
  );
  expectAtLeast(
    await authedGet(tokens.merchant, `customer_reviews?select=id&store_id=eq.${ids.ownStore}`),
    3,
    "merchant can read own store reviews via remote API",
  );
  expectBlockedOrEmpty(
    await authedGet(tokens.merchant, `stores?select=id&id=eq.${ids.unownedStore}`),
    "merchant cannot read unowned store via remote API",
  );
  expectBlockedOrEmpty(
    await authedGet(tokens.merchant, `store_menu_items?select=id&store_id=eq.${ids.unownedStore}`),
    "merchant cannot read unowned store menu via remote API",
  );
  expectBlockedOrEmpty(
    await authedGet(
      tokens.merchant,
      `actor_profiles?select=id&id=in.(${users.customerOne.id},${users.customerTwo.id},${users.otherMerchant.id})`,
    ),
    "merchant cannot read customer actor profiles via remote API",
  );
  expectBlockedOrEmpty(
    await authedGet(tokens.merchant, "audit_logs?select=id&limit=1"),
    "merchant cannot read audit logs via remote API",
  );

  const forbiddenInsert = await authedInsert(tokens.merchant, "store_menu_items", {
    id: `phase1-remote-forbidden-${randomUUID()}`,
    store_id: ids.unownedStore,
    name: "Forbidden Insert",
    description: "Should be rejected by remote RLS.",
    category: "Hidden",
    price_centavos: 1200,
    image_color_hex: "#AA0000",
    is_popular: false,
    is_available: true,
    sort_order: 99,
  });
  expect(!forbiddenInsert.ok, "merchant cannot insert unowned menu item via remote API", JSON.stringify(forbiddenInsert, null, 2));

  const forbiddenUpdate = await authedPatch(
    tokens.merchant,
    "store_menu_items",
    `id=eq.${ids.unownedMenu}`,
    { is_available: false },
  );
  if (!forbiddenUpdate.ok) {
    pass("merchant cannot update unowned menu item via remote API");
  } else if (Array.isArray(forbiddenUpdate.body) && forbiddenUpdate.body.length === 0) {
    pass("merchant cannot update unowned menu item via remote API");
  } else {
    fail("merchant cannot update unowned menu item via remote API", JSON.stringify(forbiddenUpdate, null, 2));
  }

  const unownedSettingsUpdate = await authedRpc(tokens.merchant, "update_store_settings_with_audit", {
    p_store_id: ids.unownedStore,
    p_settings_json: { order_notifications: true },
  });
  expect(!unownedSettingsUpdate.ok, "merchant cannot mutate unowned store settings via remote API", JSON.stringify(unownedSettingsUpdate, null, 2));

  expectRows(
    await authedGet(tokens.admin, `admin_profiles?select=actor_id&actor_id=eq.${users.admin.id}`),
    1,
    "admin direct client can read own admin profile via remote API",
  );
  expectBlockedOrEmpty(
    await authedGet(tokens.admin, "orders?select=id&limit=1"),
    "admin direct client cannot read orders via remote API",
  );
  expectBlockedOrEmpty(
    await authedGet(tokens.admin, "audit_logs?select=id&limit=1"),
    "admin direct client cannot read audit logs via remote API",
  );

  const settlementResult = await authedGet(tokens.admin, "delivery_settlements?select=id&limit=1");
  if (!settlementResult.ok || !Array.isArray(settlementResult.body)) {
    fail(
      "admin direct client can use approved settlement read policy via remote API",
      JSON.stringify(settlementResult, null, 2),
    );
  }
  pass("admin direct client can use approved settlement read policy via remote API");
}

async function verifyMenuMutationAudit(tokens, users) {
  expectAtLeast(
    await authedGet(tokens.merchant, `store_menu_items?select=id&store_id=eq.${ids.ownStore}`),
    2,
    "merchant can read own menu under remote RLS",
  );

  await restUpsert(
    "store_menu_items",
    [
      {
        id: ids.ownMenuAudit,
        store_id: ids.ownStore,
        name: "Phase 1 Remote Audit Burger",
        description: "Remote audit menu mutation fixture.",
        category: "Audit",
        price_centavos: 129900,
        image_color_hex: "#D71920",
        is_popular: false,
        is_available: true,
        sort_order: 777,
      },
    ],
    "id",
  );

  await restUpsert(
    "audit_logs",
    [
      {
        id: randomUUID(),
        actor_id: users.merchant.id,
        actor_type: "merchant_owner",
        action: "merchant_menu_item_created",
        resource_type: "Store",
        resource_id: ids.ownStore,
        timestamp_utc: new Date().toISOString(),
        before_state: null,
        after_state: {
          id: ids.ownMenuAudit,
          store_id: ids.ownStore,
          name: "Phase 1 Remote Audit Burger",
          is_available: true,
        },
      },
    ],
    "id",
  );

  const createAuditRow = await fetchJson(
    `${supabaseUrl}/rest/v1/audit_logs?select=id,action,resource_id,after_state&action=eq.merchant_menu_item_created&resource_id=eq.${ids.ownStore}&after_state->>id=eq.${ids.ownMenuAudit}`,
    {
      headers: authHeaders(serviceRoleKey),
    },
  );
  expectRows(createAuditRow, 1, "remote service path writes one menu create audit row");

  const beforeMenuResult = await fetchJson(
    `${supabaseUrl}/rest/v1/store_menu_items?select=*&id=eq.${ids.ownMenuAudit}&store_id=eq.${ids.ownStore}`,
    { headers: authHeaders(serviceRoleKey) },
  );
  if (!beforeMenuResult.ok || !Array.isArray(beforeMenuResult.body) || beforeMenuResult.body.length !== 1) {
    fail("read menu audit fixture before availability update", JSON.stringify(beforeMenuResult, null, 2));
  }

  const updateMenuResult = await fetchJson(
    `${supabaseUrl}/rest/v1/store_menu_items?id=eq.${ids.ownMenuAudit}&store_id=eq.${ids.ownStore}`,
    {
      method: "PATCH",
      headers: {
        ...authHeaders(serviceRoleKey),
        Prefer: "return=representation",
      },
      body: JSON.stringify({ is_available: false }),
    },
  );
  if (!updateMenuResult.ok || !Array.isArray(updateMenuResult.body) || updateMenuResult.body.length !== 1) {
    fail("update menu audit fixture availability", JSON.stringify(updateMenuResult, null, 2));
  }

  await restUpsert(
    "audit_logs",
    [
      {
        id: randomUUID(),
        actor_id: users.merchant.id,
        actor_type: "merchant_owner",
        action: "merchant_menu_item_availability_updated",
        resource_type: "Store",
        resource_id: ids.ownStore,
        timestamp_utc: new Date().toISOString(),
        before_state: beforeMenuResult.body[0],
        after_state: updateMenuResult.body[0],
      },
    ],
    "id",
  );

  const availabilityAuditRow = await fetchJson(
    `${supabaseUrl}/rest/v1/audit_logs?select=id,action,resource_id,before_state,after_state&action=eq.merchant_menu_item_availability_updated&resource_id=eq.${ids.ownStore}&after_state->>id=eq.${ids.ownMenuAudit}`,
    { headers: authHeaders(serviceRoleKey) },
  );
  expectRows(availabilityAuditRow, 1, "remote service path writes one availability audit row");

  const row = availabilityAuditRow.body[0];
  expect(
    row.before_state?.is_available === true && row.after_state?.is_available === false,
    "remote availability audit captures before and after state",
    JSON.stringify(row, null, 2),
  );
}

async function main() {
  const users = await prepareFixture();

  const tokens = {
    customerOne: await signIn(fixtures.customerOne.email, fixturePasswords.get("customerOne")),
    customerTwo: await signIn(fixtures.customerTwo.email, fixturePasswords.get("customerTwo")),
    merchant: await signIn(fixtures.merchant.email, fixturePasswords.get("merchant")),
    admin: await signIn(fixtures.admin.email, fixturePasswords.get("admin")),
  };

  await verifyAuthBoundary(tokens, users);
  await verifyMenuMutationAudit(tokens, users);

  const summary = {
    generated_at: new Date().toISOString(),
    supabase_url: supabaseUrl,
    own_store_id: ids.ownStore,
    unowned_store_id: ids.unownedStore,
    checks: results,
  };
  const summaryPath = join(runDir, "summary.json");
  writeFileSync(summaryPath, JSON.stringify(summary, null, 2));

  console.log(`PASS: phase 1 remote production audit E2E complete`);
  console.log(`Summary: ${summaryPath}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
