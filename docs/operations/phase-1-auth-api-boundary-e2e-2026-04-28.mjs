#!/usr/bin/env node

import { execFileSync } from "node:child_process";

const apiUrl = process.env.SUPABASE_API_URL ?? "http://127.0.0.1:54321";
const anonKey =
  process.env.SUPABASE_ANON_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0";
const dbUrl =
  process.env.SUPABASE_DB_URL ??
  "postgresql://postgres:postgres@127.0.0.1:54322/postgres";

const users = {
  customerOne: {
    email: "customer.one@example.com",
    password: "customerpass123",
  },
  customerTwo: {
    email: "customer.two@example.com",
    password: "customerpass456",
  },
  merchant: {
    email: "demo@saborcriollo.com",
    password: "demo1234",
  },
  admin: {
    email: "admin@deliberry.local",
    password: "admin1234",
  },
};

function pass(label) {
  console.log(`PASS: ${label}`);
}

function fail(label, detail) {
  const suffix = detail == null ? "" : `\n${detail}`;
  throw new Error(`FAIL: ${label}${suffix}`);
}

function ensureLocalFixture() {
  const sql = `
insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change,
  email_change_token_current,
  reauthentication_token,
  phone_change,
  phone_change_token,
  is_super_admin,
  is_sso_user,
  is_anonymous,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
)
values (
  '00000000-0000-0000-0000-000000000000',
  '55555555-5555-4555-8555-555555555555',
  'authenticated',
  'authenticated',
  'merchant.other@example.com',
  extensions.crypt('merchantother123', extensions.gen_salt('bf')),
  timezone('utc', now()),
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  false,
  false,
  false,
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"surface":"merchant-console","mode":"phase1-api-boundary-test"}'::jsonb,
  timezone('utc', now()),
  timezone('utc', now())
)
on conflict (id) do update
set
  email = excluded.email,
  encrypted_password = coalesce(excluded.encrypted_password, auth.users.encrypted_password),
  email_confirmed_at = excluded.email_confirmed_at,
  raw_app_meta_data = excluded.raw_app_meta_data,
  raw_user_meta_data = excluded.raw_user_meta_data,
  updated_at = timezone('utc', now());

insert into public.actor_profiles (
  id,
  actor_type,
  display_name,
  email,
  phone_number
)
values (
  '55555555-5555-4555-8555-555555555555',
  'merchant_owner',
  'Other Merchant',
  'merchant.other@example.com',
  '+54 11 4000 2000'
)
on conflict (id) do update
set
  actor_type = excluded.actor_type,
  display_name = excluded.display_name,
  email = excluded.email,
  phone_number = excluded.phone_number,
  updated_at = timezone('utc', now());

insert into public.merchant_profiles (
  user_id,
  merchant_name,
  onboarding_complete
)
values (
  '55555555-5555-4555-8555-555555555555',
  'Other Merchant',
  true
)
on conflict (user_id) do update
set
  merchant_name = excluded.merchant_name,
  onboarding_complete = excluded.onboarding_complete,
  updated_at = timezone('utc', now());

insert into public.stores (
  id,
  merchant_actor_id,
  name,
  city,
  is_open,
  address,
  rating,
  review_count,
  status,
  accepting_orders
)
values (
  'phase1-unowned-store',
  '55555555-5555-4555-8555-555555555555',
  'Phase 1 Unowned Store',
  'Ho Chi Minh City',
  false,
  'Hidden test address',
  0,
  0,
  'paused',
  false
)
on conflict (id) do update
set
  merchant_actor_id = excluded.merchant_actor_id,
  name = excluded.name,
  city = excluded.city,
  is_open = excluded.is_open,
  address = excluded.address,
  rating = excluded.rating,
  review_count = excluded.review_count,
  status = excluded.status,
  accepting_orders = excluded.accepting_orders,
  updated_at = timezone('utc', now());

insert into public.store_menu_items (
  id,
  store_id,
  name,
  description,
  category,
  price_centavos,
  image_color_hex,
  is_popular,
  is_available,
  sort_order
)
values (
  'phase1-unowned-menu-item',
  'phase1-unowned-store',
  'Hidden Menu Item',
  'Fixture for merchant API negative tests.',
  'Hidden',
  1000,
  '#999999',
  false,
  true,
  1
)
on conflict (id) do update
set
  store_id = excluded.store_id,
  name = excluded.name,
  description = excluded.description,
  category = excluded.category,
  price_centavos = excluded.price_centavos,
  image_color_hex = excluded.image_color_hex,
  is_popular = excluded.is_popular,
  is_available = excluded.is_available,
  sort_order = excluded.sort_order,
  updated_at = timezone('utc', now());

insert into public.merchant_memberships (
  user_id,
  store_id,
  role,
  is_default
)
values (
  '55555555-5555-4555-8555-555555555555',
  'phase1-unowned-store',
  'merchant_owner',
  true
)
on conflict (user_id, store_id) do update
set
  role = excluded.role,
  is_default = excluded.is_default;
`;

  execFileSync("psql", [dbUrl, "-v", "ON_ERROR_STOP=1", "-c", sql], {
    stdio: "pipe",
  });
  pass("local unowned merchant fixture is present");
}

async function signIn({ email, password }) {
  const response = await fetch(`${apiUrl}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      apikey: anonKey,
      "content-type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok || typeof body.access_token !== "string") {
    fail(`sign in ${email}`, JSON.stringify(body, null, 2));
  }
  pass(`sign in ${email}`);
  return body.access_token;
}

async function restGet(token, path) {
  const response = await fetch(`${apiUrl}/rest/v1/${path}`, {
    headers: {
      apikey: anonKey,
      authorization: `Bearer ${token}`,
    },
  });
  const body = await response.json().catch(() => null);
  return { ok: response.ok, status: response.status, body };
}

async function rpcPost(token, name, payload) {
  const response = await fetch(`${apiUrl}/rest/v1/rpc/${name}`, {
    method: "POST",
    headers: {
      apikey: anonKey,
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const body = await response.json().catch(() => null);
  return { ok: response.ok, status: response.status, body };
}

function expectRows(result, count, label) {
  if (!result.ok || !Array.isArray(result.body) || result.body.length !== count) {
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

function expectAtLeast(result, count, label) {
  if (!result.ok || !Array.isArray(result.body) || result.body.length < count) {
    fail(label, JSON.stringify(result, null, 2));
  }
  pass(label);
}

async function main() {
  ensureLocalFixture();

  const customerOne = await signIn(users.customerOne);
  const customerTwo = await signIn(users.customerTwo);
  const merchant = await signIn(users.merchant);
  const admin = await signIn(users.admin);

  expectRows(
    await restGet(customerOne, "orders?select=id&id=eq.ord-demo-001"),
    1,
    "customer one can read own order via API",
  );
  expectBlockedOrEmpty(
    await restGet(customerOne, "orders?select=id&id=eq.ord-demo-002"),
    "customer one cannot read customer two order via API",
  );
  expectBlockedOrEmpty(
    await restGet(customerOne, "customer_reviews?select=id&id=eq.review-demo-001"),
    "customer one cannot read customer two review via API",
  );
  expectBlockedOrEmpty(
    await restGet(customerOne, "audit_logs?select=id&limit=1"),
    "customer cannot read audit logs via API",
  );
  expectBlockedOrEmpty(
    await restGet(customerOne, "support_tickets?select=id&limit=1"),
    "customer cannot read support tickets via API",
  );
  expectBlockedOrEmpty(
    await restGet(customerOne, "disputes?select=id&limit=1"),
    "customer cannot read disputes via API",
  );

  expectRows(
    await restGet(customerTwo, "orders?select=id&id=eq.ord-demo-002"),
    1,
    "customer two can read own order via API",
  );
  expectBlockedOrEmpty(
    await restGet(customerTwo, "orders?select=id&id=eq.ord-demo-001"),
    "customer two cannot read customer one order via API",
  );
  expectBlockedOrEmpty(
    await restGet(customerTwo, "customer_reviews?select=id&id=eq.review-demo-003"),
    "customer two cannot read customer one review via API",
  );

  expectRows(
    await restGet(merchant, "stores?select=id&id=eq.demo-store"),
    1,
    "merchant can read own store via API",
  );
  expectAtLeast(
    await restGet(merchant, "orders?select=id&store_id=eq.demo-store"),
    3,
    "merchant can read own store orders via API",
  );
  expectAtLeast(
    await restGet(merchant, "customer_reviews?select=id&store_id=eq.demo-store"),
    3,
    "merchant can read own store reviews via API",
  );
  expectBlockedOrEmpty(
    await restGet(merchant, "stores?select=id&id=eq.phase1-unowned-store"),
    "merchant cannot read non-public unowned store via API",
  );
  expectBlockedOrEmpty(
    await restGet(merchant, "store_menu_items?select=id&store_id=eq.phase1-unowned-store"),
    "merchant cannot read non-public unowned store menu via API",
  );
  expectBlockedOrEmpty(
    await restGet(
      merchant,
      "actor_profiles?select=id&id=in.(22222222-2222-4222-8222-222222222222,33333333-3333-4333-8333-333333333333)",
    ),
    "merchant cannot read customer actor profiles via API",
  );
  expectBlockedOrEmpty(
    await restGet(merchant, "audit_logs?select=id&limit=1"),
    "merchant cannot read audit logs via API",
  );
  const unownedSettingsUpdate = await rpcPost(merchant, "update_store_settings_with_audit", {
    p_store_id: "phase1-unowned-store",
    p_settings_json: { order_notifications: true },
  });
  if (unownedSettingsUpdate.ok) {
    fail(
      "merchant cannot mutate unowned store settings via API",
      JSON.stringify(unownedSettingsUpdate, null, 2),
    );
  }
  pass("merchant cannot mutate unowned store settings via API");

  expectRows(
    await restGet(admin, "admin_profiles?select=actor_id&actor_id=eq.44444444-4444-4444-8444-444444444444"),
    1,
    "admin direct client can read own admin profile via API",
  );
  expectBlockedOrEmpty(
    await restGet(admin, "orders?select=id&limit=1"),
    "admin direct client cannot read orders via API",
  );
  expectBlockedOrEmpty(
    await restGet(admin, "audit_logs?select=id&limit=1"),
    "admin direct client cannot read audit logs via API",
  );
  const settlementResult = await restGet(admin, "delivery_settlements?select=id&limit=1");
  if (!settlementResult.ok || !Array.isArray(settlementResult.body)) {
    fail("admin direct client can use approved settlement read policy via API", JSON.stringify(settlementResult, null, 2));
  }
  pass("admin direct client can use approved settlement read policy via API");

  pass("phase 1 auth API boundary E2E complete");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
