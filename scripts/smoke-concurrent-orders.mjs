#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { randomUUID } from "node:crypto";

const root = resolve(new URL("..", import.meta.url).pathname);

const envFiles = [
  ".env.local",
  "customer-app/.env.local",
  "merchant-console/.env.local",
  "admin-console/.env.local",
];

for (const envFile of envFiles) {
  const path = resolve(root, envFile);
  if (!existsSync(path)) {
    continue;
  }

  const lines = readFileSync(path, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
      continue;
    }
    const [key, ...rawValue] = trimmed.split("=");
    if (process.env[key]) {
      continue;
    }
    process.env[key] = rawValue.join("=").replace(/^["']|["']$/g, "");
  }
}

const supabaseUrl =
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey =
  process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const customerEmail =
  process.env.SMOKE_CUSTOMER_EMAIL ?? "customer.one@example.com";
const customerPassword =
  process.env.SMOKE_CUSTOMER_PASSWORD ?? "customerpass123";
const merchantEmail =
  process.env.SMOKE_MERCHANT_EMAIL ?? "demo@saborcriollo.com";
const merchantPassword =
  process.env.SMOKE_MERCHANT_PASSWORD ?? "demo1234";

const storeOrders = [
  {
    storeId: "smoke-store-01",
    menuItemId: "menu-smoke-01-001",
    quantity: 1,
  },
  {
    storeId: "smoke-store-02",
    menuItemId: "menu-smoke-02-001",
    quantity: 1,
  },
  {
    storeId: "smoke-store-03",
    menuItemId: "menu-smoke-03-001",
    quantity: 1,
  },
  {
    storeId: "smoke-store-04",
    menuItemId: "menu-smoke-04-001",
    quantity: 1,
  },
  {
    storeId: "smoke-store-05",
    menuItemId: "menu-smoke-05-001",
    quantity: 1,
  },
];

if (!supabaseUrl || !anonKey) {
  throw new Error(
    "Missing Supabase env. Set SUPABASE_URL/SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_URL/NEXT_PUBLIC_SUPABASE_ANON_KEY.",
  );
}

const endpoint = (path) => `${supabaseUrl.replace(/\/$/, "")}${path}`;

async function request(path, options = {}) {
  const response = await fetch(endpoint(path), {
    ...options,
    headers: {
      apikey: anonKey,
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  const text = await response.text();
  const body = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message =
      body?.message ?? body?.error_description ?? body?.error ?? text;
    throw new Error(`${options.method ?? "GET"} ${path} failed: ${message}`);
  }

  return body;
}

async function signIn(email, password) {
  const body = await request("/auth/v1/token?grant_type=password", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (!body?.access_token) {
    throw new Error(`Sign-in succeeded without access token for ${email}`);
  }

  return body.access_token;
}

function authHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
  };
}

async function createOrder(token, input) {
  return request("/rest/v1/rpc/create_customer_order", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({
      p_store_id: input.storeId,
      p_payment_method: "cash",
      p_delivery_address: `Smoke delivery address for ${input.storeId}`,
      p_notes: "Concurrent smoke order. No payment verification.",
      p_line_items: [
        {
          menu_item_id: input.menuItemId,
          quantity: input.quantity,
          modifiers: [],
        },
      ],
      p_promo_code: null,
      p_estimated_delivery_at: new Date(
        Date.now() + 30 * 60 * 1000,
      ).toISOString(),
      p_idempotency_key: randomUUID(),
    }),
  });
}

async function readOrders(token, orderIds) {
  const encodedIds = orderIds.join(",");
  const columns = [
    "id",
    "store_id",
    "status",
    "payment_status",
    "payment_method",
    "total_centavos",
    "customer_actor_id",
    "line_items_summary",
  ].join(",");

  return request(`/rest/v1/orders?select=${columns}&id=in.(${encodedIds})`, {
    headers: authHeaders(token),
  });
}

function assertOrderSet(label, rows, expectedOrderIds) {
  const foundIds = new Set(rows.map((row) => row.id));
  const missing = expectedOrderIds.filter((id) => !foundIds.has(id));
  if (missing.length > 0) {
    throw new Error(`${label} missing orders: ${missing.join(", ")}`);
  }

  const missingStores = storeOrders
    .map((order) => order.storeId)
    .filter((storeId) => !rows.some((row) => row.store_id === storeId));
  if (missingStores.length > 0) {
    throw new Error(
      `${label} missing store scopes: ${missingStores.join(", ")}`,
    );
  }

  const nonPendingPayment = rows.filter(
    (row) => row.payment_status !== "pending",
  );
  if (nonPendingPayment.length > 0) {
    throw new Error(
      `${label} found non-placeholder payment status: ${nonPendingPayment
        .map((row) => `${row.id}:${row.payment_status}`)
        .join(", ")}`,
    );
  }
}

console.log("=== Deliberry Concurrent Order Smoke ===");
console.log(`Supabase: ${supabaseUrl}`);
console.log(`Stores: ${storeOrders.map((order) => order.storeId).join(", ")}`);

const customerToken = await signIn(customerEmail, customerPassword);
const createdOrders = await Promise.all(
  storeOrders.map((order) => createOrder(customerToken, order)),
);

const orderIds = createdOrders.map((order) => order.id);
assertOrderSet("RPC response", createdOrders, orderIds);

const customerRows = await readOrders(customerToken, orderIds);
assertOrderSet("Customer readback", customerRows, orderIds);

const merchantToken = await signIn(merchantEmail, merchantPassword);
const merchantRows = await readOrders(merchantToken, orderIds);
assertOrderSet("Merchant readback", merchantRows, orderIds);

console.table(
  createdOrders.map((order) => ({
    order_id: order.id,
    store_id: order.store_id,
    status: order.status,
    payment_status: order.payment_status,
    total_centavos: order.total_centavos,
  })),
);

console.log("RESULT: PASS - 5 concurrent smoke orders created and read back.");
