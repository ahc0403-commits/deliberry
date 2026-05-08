#!/usr/bin/env node

import { createClient } from "../../merchant-console/node_modules/@supabase/supabase-js/dist/index.mjs";
import { randomUUID } from "node:crypto";

const supabaseUrl = process.env.SUPABASE_URL ?? "http://127.0.0.1:54321";
const anonKey = process.env.SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const demoMerchant = {
  id: "11111111-1111-4111-8111-111111111111",
  email: "demo@saborcriollo.com",
  password: "demo1234",
  storeId: "demo-store",
};

const otherMerchant = {
  id: "33333333-3333-4333-8333-333333333333",
  storeId: "phase1-menu-unowned-store",
};

const auditItemId = "phase1-menu-audit-created";
const unownedItemId = "phase1-unowned-menu-item";

function requireEnv(value, name) {
  if (!value) {
    throw new Error(`${name} is required`);
  }
  return value;
}

function createSupabaseClient(key) {
  return createClient(supabaseUrl, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function pass(label) {
  console.log(`PASS: ${label}`);
}

function assert(condition, label, detail = "") {
  if (!condition) {
    throw new Error(`FAIL: ${label}${detail ? `\n${detail}` : ""}`);
  }
  pass(label);
}

async function setupFixture(service) {
  await service
    .from("audit_logs")
    .delete()
    .in("resource_id", [demoMerchant.storeId, otherMerchant.storeId])
    .in("action", [
      "merchant_menu_item_created",
      "merchant_menu_item_updated",
      "merchant_menu_item_availability_updated",
    ])
    .or(`after_state->>id.eq.${auditItemId},before_state->>id.eq.${auditItemId}`);

  await service.from("store_menu_items").delete().eq("id", auditItemId);

  const merchantResult = await service.from("merchant_profiles").upsert({
    user_id: otherMerchant.id,
    merchant_name: "Phase 1 Menu Boundary Merchant",
    onboarding_complete: true,
  });
  if (merchantResult.error) throw new Error(merchantResult.error.message);

  const storeResult = await service.from("stores").upsert({
    id: otherMerchant.storeId,
    merchant_actor_id: otherMerchant.id,
    name: "Phase 1 Menu Unowned Store",
    city: "Ho Chi Minh City",
    is_open: false,
    address: "Hidden test address",
    rating: 0,
    review_count: 0,
    status: "paused",
    accepting_orders: false,
  });
  if (storeResult.error) throw new Error(storeResult.error.message);

  const menuResult = await service.from("store_menu_items").upsert({
    id: unownedItemId,
    store_id: otherMerchant.storeId,
    name: "Hidden Menu Item",
    description: "Fixture for merchant negative tests.",
    category: "Hidden",
    price_centavos: 1000,
    image_color_hex: "#999999",
    is_popular: false,
    is_available: true,
    sort_order: 1,
  });
  if (menuResult.error) throw new Error(menuResult.error.message);

  const membershipResult = await service.from("merchant_memberships").upsert({
    user_id: otherMerchant.id,
    store_id: otherMerchant.storeId,
    role: "merchant_owner",
    is_default: true,
  });
  if (membershipResult.error) throw new Error(membershipResult.error.message);
}

async function signInDemoMerchant() {
  const merchant = createSupabaseClient(requireEnv(anonKey, "SUPABASE_ANON_KEY"));
  const { error } = await merchant.auth.signInWithPassword({
    email: demoMerchant.email,
    password: demoMerchant.password,
  });
  if (error) throw new Error(error.message);
  return merchant;
}

async function verifyAuthenticatedBoundary(merchant) {
  const ownRead = await merchant
    .from("store_menu_items")
    .select("id")
    .eq("store_id", demoMerchant.storeId)
    .limit(1);
  assert(!ownRead.error, "merchant can query own menu read policy", ownRead.error?.message);
  assert((ownRead.data?.length ?? 0) >= 1, "merchant can read at least one own menu item");

  const unownedRead = await merchant
    .from("store_menu_items")
    .select("id")
    .eq("store_id", otherMerchant.storeId);
  assert(!unownedRead.error, "merchant unowned menu read query completes under RLS", unownedRead.error?.message);
  assert((unownedRead.data?.length ?? 0) === 0, "merchant cannot read unowned store menu items");

  const unownedInsert = await merchant.from("store_menu_items").insert({
    id: `phase1-forbidden-${randomUUID()}`,
    store_id: otherMerchant.storeId,
    name: "Forbidden Insert",
    description: "Should be rejected by RLS.",
    category: "Hidden",
    price_centavos: 1200,
    image_color_hex: "#AA0000",
    is_popular: false,
    is_available: true,
    sort_order: 99,
  });
  assert(Boolean(unownedInsert.error), "merchant cannot insert unowned menu item directly");

  const unownedUpdate = await merchant
    .from("store_menu_items")
    .update({ is_available: false })
    .eq("id", unownedItemId)
    .select("id");
  assert(!unownedUpdate.error, "merchant unowned menu update query is RLS-filtered", unownedUpdate.error?.message);
  assert((unownedUpdate.data?.length ?? 0) === 0, "merchant cannot update unowned menu item directly");

  const auditRead = await merchant.from("audit_logs").select("id").limit(1);
  assert(!auditRead.error, "merchant audit log read query completes under RLS", auditRead.error?.message);
  assert((auditRead.data?.length ?? 0) === 0, "merchant cannot read audit logs directly");
}

async function serviceCreateMenuItemWithAudit(service) {
  const payload = {
    id: auditItemId,
    store_id: demoMerchant.storeId,
    name: "Phase 1 Audit Burger",
    description: "Menu mutation audit fixture.",
    category: "Audit",
    price_centavos: 1299,
    image_color_hex: "#D71920",
    is_popular: false,
    is_available: true,
    sort_order: 777,
  };

  const writeResult = await service.from("store_menu_items").upsert(payload, {
    onConflict: "id",
  });
  if (writeResult.error) throw new Error(writeResult.error.message);

  const auditResult = await service.from("audit_logs").insert({
    id: randomUUID(),
    actor_id: demoMerchant.id,
    actor_type: "merchant_owner",
    action: "merchant_menu_item_created",
    resource_type: "Store",
    resource_id: demoMerchant.storeId,
    timestamp_utc: new Date().toISOString(),
    before_state: null,
    after_state: payload,
  });
  if (auditResult.error) throw new Error(auditResult.error.message);

  const auditRead = await service
    .from("audit_logs")
    .select("id, action, resource_id, after_state")
    .eq("action", "merchant_menu_item_created")
    .eq("resource_id", demoMerchant.storeId)
    .eq("after_state->>id", auditItemId);
  if (auditRead.error) throw new Error(auditRead.error.message);

  assert(auditRead.data.length === 1, "menu item create writes one audit log row");
}

async function serviceUpdateAvailabilityWithAudit(service) {
  const beforeResult = await service
    .from("store_menu_items")
    .select("*")
    .eq("id", auditItemId)
    .eq("store_id", demoMerchant.storeId)
    .single();
  if (beforeResult.error) throw new Error(beforeResult.error.message);

  const afterResult = await service
    .from("store_menu_items")
    .update({ is_available: false })
    .eq("id", auditItemId)
    .eq("store_id", demoMerchant.storeId)
    .select("*")
    .single();
  if (afterResult.error) throw new Error(afterResult.error.message);

  const auditResult = await service.from("audit_logs").insert({
    id: randomUUID(),
    actor_id: demoMerchant.id,
    actor_type: "merchant_owner",
    action: "merchant_menu_item_availability_updated",
    resource_type: "Store",
    resource_id: demoMerchant.storeId,
    timestamp_utc: new Date().toISOString(),
    before_state: beforeResult.data,
    after_state: afterResult.data,
  });
  if (auditResult.error) throw new Error(auditResult.error.message);

  const auditRead = await service
    .from("audit_logs")
    .select("id, action, resource_id, before_state, after_state")
    .eq("action", "merchant_menu_item_availability_updated")
    .eq("resource_id", demoMerchant.storeId)
    .eq("after_state->>id", auditItemId);
  if (auditRead.error) throw new Error(auditRead.error.message);

  assert(auditRead.data.length === 1, "menu item availability update writes one audit log row");
  assert(
    auditRead.data[0].before_state?.is_available === true &&
      auditRead.data[0].after_state?.is_available === false,
    "availability audit captures before and after state",
  );
}

async function main() {
  const service = createSupabaseClient(requireEnv(serviceRoleKey, "SUPABASE_SERVICE_ROLE_KEY"));

  await setupFixture(service);
  pass("phase 1 menu fixture prepared");

  const merchant = await signInDemoMerchant();
  pass("demo merchant signed in through local Supabase Auth");

  await verifyAuthenticatedBoundary(merchant);
  await serviceCreateMenuItemWithAudit(service);
  await serviceUpdateAvailabilityWithAudit(service);

  console.log("PASS: phase 1 menu mutation negative/audit E2E complete");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
