import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const outputDir = join(
  process.cwd(),
  "..",
  "output",
  "playwright",
  `phase1-deployed-boundary-${new Date().toISOString().replace(/[:.]/g, "-")}`,
);

mkdirSync(outputDir, { recursive: true });

function parseTarget(value) {
  const url = new URL(value);
  return {
    accessUrl: url.searchParams.has("_vercel_share") ? value : undefined,
    baseUrl: url.origin,
  };
}

function envOrDefault(value, fallback) {
  if (typeof value !== "string" || value.trim() === "") {
    return fallback;
  }

  return value;
}

function firstNonEmpty(...values) {
  for (const value of values) {
    if (typeof value === "string" && value.trim() !== "") {
      return value;
    }
  }

  return undefined;
}

const targets = {
  customer: parseTarget(
    envOrDefault(
      process.env.CUSTOMER_URL,
      "https://deliberry-customer.vercel.app",
    ),
  ),
  merchant: parseTarget(
    envOrDefault(
      process.env.MERCHANT_URL,
      "https://merchant-console-six.vercel.app",
    ),
  ),
  admin: parseTarget(
    envOrDefault(
      process.env.ADMIN_URL,
      "https://deliberry-admin.vercel.app",
    ),
  ),
  public: parseTarget(
    envOrDefault(
      process.env.PUBLIC_URL,
      "https://go.deli-berry.com",
    ),
  ),
};

const credentials = {
  merchantEmail: firstNonEmpty(process.env.MERCHANT_EMAIL, process.env.MERCHANT_E2E_EMAIL),
  merchantPassword: firstNonEmpty(process.env.MERCHANT_PASSWORD, process.env.MERCHANT_E2E_PASSWORD),
  adminEmail: firstNonEmpty(process.env.ADMIN_EMAIL, process.env.ADMIN_E2E_EMAIL),
  adminPassword: firstNonEmpty(process.env.ADMIN_PASSWORD, process.env.ADMIN_E2E_PASSWORD),
};

const customerAuth = {
  sessionJson: firstNonEmpty(
    process.env.CUSTOMER_AUTH_SESSION_JSON,
    process.env.CUSTOMER_E2E_SESSION_JSON,
  ),
  email: firstNonEmpty(process.env.CUSTOMER_EMAIL, process.env.CUSTOMER_E2E_EMAIL),
  password: firstNonEmpty(process.env.CUSTOMER_PASSWORD, process.env.CUSTOMER_E2E_PASSWORD),
  supabaseUrl: envOrDefault(
    firstNonEmpty(process.env.CUSTOMER_SUPABASE_URL, process.env.SUPABASE_URL),
    "https://gjcwxsezrovxcrpdnazc.supabase.co",
  ),
  supabaseAnonKey: envOrDefault(
    firstNonEmpty(process.env.CUSTOMER_SUPABASE_ANON_KEY, process.env.SUPABASE_ANON_KEY),
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqY3d4c2V6cm92eGNycGRuYXpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3MzAxMTAsImV4cCI6MjA4OTMwNjExMH0.dPbfYDbgr48qaN2axk5esW_0OMhFDUDOWCts2aZoMLc",
  ),
};

const allowProtectedSkip = process.env.ALLOW_DEPLOYMENT_PROTECTION_SKIP === "1";

const bypassSecrets = {
  customer: process.env.CUSTOMER_VERCEL_AUTOMATION_BYPASS_SECRET,
  merchant: process.env.MERCHANT_VERCEL_AUTOMATION_BYPASS_SECRET,
  admin: process.env.ADMIN_VERCEL_AUTOMATION_BYPASS_SECRET,
  public: process.env.PUBLIC_VERCEL_AUTOMATION_BYPASS_SECRET,
  fallback: process.env.VERCEL_AUTOMATION_BYPASS_SECRET,
};

function pass(label) {
  console.log(`PASS: ${label}`);
}

function skip(label) {
  console.log(`SKIP: ${label}`);
}

function note(label) {
  console.log(`NOTE: ${label}`);
}

function assert(condition, label, detail = "") {
  if (!condition) {
    throw new Error(`FAIL: ${label}${detail ? `\n${detail}` : ""}`);
  }
  pass(label);
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function bypassSecretForSurface(surface) {
  const secret = bypassSecrets[surface] ?? bypassSecrets.fallback;
  if (!secret) {
    return "";
  }

  note(`${surface} uses Vercel automation protection bypass headers`);
  return secret;
}

function bypassHeaders(secret) {
  if (!secret) {
    return {};
  }

  return {
    "x-vercel-protection-bypass": secret,
    "x-vercel-set-bypass-cookie": "true",
  };
}

async function installBypassRouting(context, surface, target) {
  const secret = bypassSecretForSurface(surface);
  if (!secret) {
    return;
  }

  const protectedHost = new URL(target.baseUrl).host;
  await context.route("**/*", async (route) => {
    const request = route.request();
    const requestHost = new URL(request.url()).host;

    if (requestHost !== protectedHost) {
      await route.continue();
      return;
    }

    await route.continue({
      headers: {
        ...request.headers(),
        ...bypassHeaders(secret),
      },
    });
  });
}

function isVercelProtectionText(text) {
  return /vercel authentication|deployment protection|sign in to vercel|log in to vercel/i.test(text);
}

async function screenshot(page, name) {
  await page.screenshot({
    path: join(outputDir, `${name}.png`),
    fullPage: true,
  });
}

async function waitForSettled(page) {
  await page.waitForLoadState("domcontentloaded");
  await page.waitForLoadState("networkidle").catch(() => {});
}

async function gotoChecked(page, url, label, options = {}) {
  const response = await page.goto(url, { waitUntil: "domcontentloaded" });
  await waitForSettled(page);
  const status = response?.status() ?? 0;
  const text = await page.locator("body").innerText({ timeout: 5000 }).catch(() => "");

  assert(status > 0 && status < 500, `${label} returns a browser-renderable response`, `status=${status}`);
  const protectedByVercel = isVercelProtectionText(text);
  if (protectedByVercel && options.allowProtectedSkip && allowProtectedSkip) {
    skip(`${label} blocked by Vercel deployment protection`);
    return { status, text, protectedByVercel };
  }

  assert(!protectedByVercel, `${label} is not blocked by Vercel deployment protection`);
  return { status, text, protectedByVercel };
}

async function openAccessUrlIfNeeded(page, target, label) {
  if (!target.accessUrl) {
    return;
  }

  note(`${label} uses temporary Vercel share access`);
  await page.goto(target.accessUrl, { waitUntil: "domcontentloaded" });
  await waitForSettled(page);
}

async function enableFlutterSemantics(page) {
  const placeholder = page.locator('flt-semantics-placeholder[aria-label="Enable accessibility"]');
  if ((await placeholder.count()) > 0) {
    await placeholder.evaluate((element) => element.click());
  await page.waitForTimeout(1000);
  }
}

async function assertBodyDoesNotShowGenericError(page, label) {
  const text = await page.locator("body").innerText({ timeout: 5000 }).catch(() => "");
  assert(!/application error|something went wrong|500|internal server error/i.test(text), label);
  return text;
}

async function createProtectedContext(browser, surface, target, viewport) {
  const context = await browser.newContext({ viewport });
  await installBypassRouting(context, surface, target);
  return context;
}

async function resolveCustomerSessionJson() {
  if (customerAuth.sessionJson) {
    return customerAuth.sessionJson;
  }
  if (!customerAuth.email || !customerAuth.password) {
    return undefined;
  }

  const response = await fetch(
    `${customerAuth.supabaseUrl}/auth/v1/token?grant_type=password`,
    {
      method: "POST",
      headers: {
        apikey: customerAuth.supabaseAnonKey,
        Authorization: `Bearer ${customerAuth.supabaseAnonKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: customerAuth.email,
        password: customerAuth.password,
      }),
    },
  );
  const body = await response.json().catch(() => null);
  assert(
    response.ok && body && typeof body.access_token === "string",
    "customer deployed auth fixture password grant can mint a session",
    body ? JSON.stringify(body) : `status=${response.status}`,
  );
  return JSON.stringify(body);
}

function customerSupabaseStorageKey() {
  return `sb-${new URL(customerAuth.supabaseUrl).host.split(".")[0]}-auth-token`;
}

async function seedCustomerAuthStorage(page) {
  const sessionJson = await resolveCustomerSessionJson();
  if (!sessionJson) {
    return false;
  }

  await page.goto(`${targets.customer.baseUrl}/robots.txt?codex-seed=1`, {
    waitUntil: "domcontentloaded",
  });
  await page.evaluate(async ({ sessionJson, storageKey, snapshotKey, publicKey }) => {
    const encoder = new TextEncoder();
    const secureStorageKey = `${publicKey}.${snapshotKey}`;
    const snapshotJson = JSON.stringify({
      status: "authenticated",
      phoneNumber: null,
      allowSupabaseRestore: true,
    });

    async function persistFlutterSecureStorageValue(key, value) {
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const algorithm = { name: "AES-GCM", length: 256, iv };
      let rawKey = localStorage.getItem(publicKey);

      if (!rawKey) {
        const generatedKey = await crypto.subtle.generateKey(
          algorithm,
          true,
          ["encrypt", "decrypt"],
        );
        const exported = await crypto.subtle.exportKey("raw", generatedKey);
        rawKey = btoa(String.fromCharCode(...new Uint8Array(exported)));
        localStorage.setItem(publicKey, rawKey);
      }

      const keyBytes = Uint8Array.from(atob(rawKey), (char) => char.charCodeAt(0));
      const cryptoKey = await crypto.subtle.importKey(
        "raw",
        keyBytes,
        algorithm,
        false,
        ["encrypt", "decrypt"],
      );
      const encrypted = await crypto.subtle.encrypt(
        algorithm,
        cryptoKey,
        encoder.encode(value),
      );
      const payload = `${btoa(String.fromCharCode(...iv))}.${btoa(
        String.fromCharCode(...new Uint8Array(encrypted)),
      )}`;
      localStorage.setItem(key, payload);
    }

    localStorage.setItem(storageKey, sessionJson);
    await persistFlutterSecureStorageValue(secureStorageKey, snapshotJson);
  }, {
    sessionJson,
    storageKey: customerSupabaseStorageKey(),
    snapshotKey: "customer_session_snapshot_v1",
    publicKey: "FlutterSecureStorage",
  });
  return true;
}

async function signInAdminForRole(browser, roleButtonName) {
  const context = await createProtectedContext(browser, "admin", targets.admin, {
    width: 1280,
    height: 900,
  });
  const page = await context.newPage();

  await openAccessUrlIfNeeded(page, targets.admin, "admin console");
  const adminEntry = await gotoChecked(page, `${targets.admin.baseUrl}/orders`, "admin protected route", {
    allowProtectedSkip: true,
  });
  if (adminEntry.protectedByVercel) {
    await screenshot(page, "admin-vercel-protected");
    await context.close();
    return null;
  }

  assert(page.url().includes("/login"), "admin deployed protected route redirects anonymous user to login", page.url());

  if (!credentials.adminEmail || !credentials.adminPassword) {
    skip("admin deployed authenticated smoke not run because admin E2E credentials are not set");
    await context.close();
    return null;
  }

  await page.fill("#email", credentials.adminEmail);
  await page.fill("#password", credentials.adminPassword);
  await Promise.all([
    page.waitForURL(/\/access-boundary|\/dashboard/, { timeout: 20000 }),
    page.getByRole("button", { name: /Sign in to Admin Console/i }).click(),
  ]);
  await waitForSettled(page);
  assert(
    /\/access-boundary|\/dashboard/.test(page.url()),
    "admin deployed authenticated entry reaches role boundary or dashboard",
    page.url(),
  );

  if (!page.url().includes("/access-boundary")) {
    await page.goto(`${targets.admin.baseUrl}/access-boundary`, { waitUntil: "domcontentloaded" });
    await waitForSettled(page);
  }

  assert((await page.getByText(/Select your role for this session/i).count()) > 0, "admin deployed access boundary exposes role selection");
  await Promise.all([
    page.waitForURL(/\/dashboard/, { timeout: 20000 }),
    page.getByRole("button", { name: roleButtonName }).click(),
  ]);
  await waitForSettled(page);

  return { context, page };
}

async function assertNavLabelVisibility(page, { visible = [], hidden = [] }, roleLabel, surfaceLabel = "admin deployed") {
  for (const label of visible) {
    const exactLink = page.getByRole("link", { name: new RegExp(escapeRegex(label), "i") });
    assert(
      (await exactLink.count()) > 0,
      `${surfaceLabel} ${roleLabel} nav includes ${label.toLowerCase()}`,
    );
  }

  for (const label of hidden) {
    const exactLink = page.getByRole("link", { name: new RegExp(escapeRegex(label), "i") });
    assert(
      (await exactLink.count()) === 0,
      `${surfaceLabel} ${roleLabel} nav hides ${label.toLowerCase()}`,
    );
  }
}

async function assertMerchantNavVisibility(page) {
  await assertNavLabelVisibility(
    page,
    {
      visible: ["Dashboard", "Orders", "Menu", "Store Info", "Reviews", "Promotions", "Settlement", "Analytics", "Settings"],
      hidden: [],
    },
    "merchant-store",
    "merchant deployed",
  );
}

async function runPublic(browser) {
  const context = await browser.newContext({ viewport: { width: 1366, height: 900 } });
  await installBypassRouting(context, "public", targets.public);
  const page = await context.newPage();
  const routes = [
    ["/", "public landing"],
    ["/service", "public service"],
    ["/merchant", "public merchant onboarding"],
    ["/support", "public support"],
    ["/download", "public download"],
    ["/privacy", "public privacy"],
    ["/terms", "public terms"],
    ["/refund-policy", "public refund policy"],
  ];

  for (const [route, label] of routes) {
    const { status, text } = await gotoChecked(page, `${targets.public.baseUrl}${route}`, label);
    assert(status < 400, `${label} route is not an HTTP error`, `status=${status}`);
    assert(text.trim().length > 80, `${label} route renders substantive content`);
    assert(!/404|not found|application error/i.test(text), `${label} route does not render a generic error`);
    await screenshot(page, label.replaceAll(" ", "-"));
  }

  await context.close();
}

async function runCustomer(browser) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  await installBypassRouting(context, "customer", targets.customer);
  const page = await context.newPage();

  await openAccessUrlIfNeeded(page, targets.customer, "customer app");
  const customerEntry = await gotoChecked(page, targets.customer.baseUrl, "customer app", {
    allowProtectedSkip: true,
  });
  if (customerEntry.protectedByVercel) {
    await screenshot(page, "customer-vercel-protected");
    await context.close();
    return;
  }
  await page.waitForTimeout(3500);
  await enableFlutterSemantics(page);
  await screenshot(page, "customer-entry");

  const guestLink = page.getByRole("button", { name: /Continue as Guest/i }).first();
  assert((await guestLink.count()) > 0, "customer deployed entry exposes guest path");

  await guestLink.click();
  await page.waitForTimeout(1500);
  const browseAsGuest = page.getByRole("button", { name: /Browse as Guest/i }).first();
  assert((await browseAsGuest.count()) > 0, "customer guest explanation exposes browse action");

  await browseAsGuest.click();
  await page.waitForTimeout(2500);
  await screenshot(page, "customer-guest-home");
  assert((await page.getByRole("button", { name: /Search stores or cuisines/i }).count()) > 0, "customer deployed guest home exposes category browsing");
  const categoryButtons = page.getByRole("button", { name: /Pizza|Burgers|Sushi|Healthy|Desserts|Coffee|Mexican|Asian/i });
  assert((await categoryButtons.count()) >= 4, "customer deployed guest home exposes category chips");
  assert((await page.getByRole("button", { name: /Featured for tonight|See all/i }).count()) > 0, "customer deployed guest home exposes popular stores");
  const featuredStoreCard = page.getByRole("button", { name: /Sabor Criollo Kitchen/i }).first();
  assert((await featuredStoreCard.count()) > 0, "customer deployed guest home exposes a tappable store card");
  await featuredStoreCard.click();
  await page.waitForTimeout(2500);
  await screenshot(page, "customer-store");
  assert(page.url().includes("/#/store"), "customer deployed guest flow can open a store detail route", page.url());
  assert((await page.getByText(/Sabor Criollo Kitchen/i).count()) > 0, "customer deployed store route exposes the store name");
  assert((await page.getByText(/^Menu$/i).count()) > 0, "customer deployed store route exposes the menu section");
  assert((await page.getByText(/Cart starts here/i).count()) > 0, "customer deployed store route exposes the cart-start signal");
  await page.goto(`${targets.customer.baseUrl}/#/store/menu`, { waitUntil: "domcontentloaded" });
  await waitForSettled(page);
  await page.waitForTimeout(2500);
  await screenshot(page, "customer-store-menu");
  assert(page.url().includes("/#/store/menu"), "customer deployed guest flow can open the store menu route", page.url());
  assert((await page.getByText(/Menu categories/i).count()) > 0, "customer deployed store menu route exposes category browsing");
  const unlabeledButtons = page.getByRole("button", { name: "" });
  assert((await unlabeledButtons.count()) >= 10, "customer deployed store menu route exposes add-item controls");
  await unlabeledButtons.nth(7).click();
  await page.waitForTimeout(2000);
  assert((await page.getByText(/added to cart/i).count()) > 0, "customer deployed store menu route can add an item to cart");
  const viewCartCta = page.getByRole("button", { name: /View cart/i }).first();
  assert((await viewCartCta.count()) > 0, "customer deployed store menu route exposes the cart CTA after adding an item");
  await viewCartCta.click();
  await page.waitForTimeout(2500);
  await screenshot(page, "customer-cart");
  assert(page.url().includes("/#/cart"), "customer deployed guest flow can open the cart route", page.url());
  assert((await page.getByText(/^Cart$/i).count()) > 0, "customer deployed cart route exposes the cart heading");
  assert((await page.getByText(/Subtotal/i).count()) > 0, "customer deployed cart route exposes the subtotal row");
  assert((await page.getByText(/Total/i).count()) > 0, "customer deployed cart route exposes the total row");
  const checkoutCta = page.getByRole("button", { name: /Continue to checkout/i }).first();
  assert((await checkoutCta.count()) > 0, "customer deployed cart route exposes the checkout CTA");
  await checkoutCta.click();
  await page.waitForTimeout(2500);
  await screenshot(page, "customer-checkout");
  assert(page.url().includes("/#/checkout"), "customer deployed guest flow can open the checkout route", page.url());
  assert((await page.getByText(/^Checkout$/i).count()) > 0, "customer deployed checkout route exposes the checkout heading");
  assert((await page.getByText(/Delivery Address/i).count()) > 0, "customer deployed checkout route exposes the delivery address section");
  assert((await page.getByText(/Cash/i).count()) > 0, "customer deployed checkout route exposes the cash payment option");
  assert((await page.getByText(/VNPAY Card Test/i).count()) > 0, "customer deployed checkout route exposes the VNPAY card placeholder");
  assert((await page.getByText(/VNPAY Pay Test/i).count()) > 0, "customer deployed checkout route exposes the VNPAY pay placeholder");
  assert((await page.getByText(/Order Summary/i).count()) > 0, "customer deployed checkout route exposes the order summary section");
  assert((await page.getByText(/Price Breakdown/i).count()) > 0, "customer deployed checkout route exposes the price breakdown section");
  assert((await page.getByRole("button", { name: /Place Order/i }).count()) > 0, "customer deployed checkout route exposes the place-order CTA");

  await page.goto(`${targets.customer.baseUrl}/#/orders`, { waitUntil: "domcontentloaded" });
  await waitForSettled(page);
  await page.waitForTimeout(2500);
  await screenshot(page, "customer-guest-orders-guard");

  const authVisible =
    (await page.getByText(/Welcome back/i).count()) > 0 ||
    (await page.getByText(/Continue with Zalo/i).count()) > 0 ||
    (await page.getByText(/Sign in/i).count()) > 0;
  assert(authVisible, "customer deployed guest orders route falls back to auth");

  await context.close();

  const hasCustomerAuthFixture =
    Boolean(customerAuth.sessionJson) ||
    Boolean(customerAuth.email && customerAuth.password);
  if (!hasCustomerAuthFixture) {
    skip("customer deployed authenticated orders smoke not run because customer auth fixture env is not set");
    return;
  }

  const authenticatedContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  await installBypassRouting(authenticatedContext, "customer", targets.customer);
  const authenticatedPage = await authenticatedContext.newPage();

  await seedCustomerAuthStorage(authenticatedPage);
  await authenticatedPage.goto(`${targets.customer.baseUrl}`, {
    waitUntil: "domcontentloaded",
  });
  await waitForSettled(authenticatedPage);
  await authenticatedPage.waitForTimeout(3500);
  await enableFlutterSemantics(authenticatedPage);
  await screenshot(authenticatedPage, "customer-auth-entry");

  const authWelcomeVisible =
    (await authenticatedPage.getByText(/Welcome back/i).count()) > 0 ||
    (await authenticatedPage.getByText(/Continue with Zalo/i).count()) > 0;
  assert(!authWelcomeVisible, "customer deployed authenticated session restores without falling back to auth");

  await authenticatedPage.goto(`${targets.customer.baseUrl}/#/orders`, {
    waitUntil: "domcontentloaded",
  });
  await waitForSettled(authenticatedPage);
  await authenticatedPage.waitForTimeout(2500);
  await screenshot(authenticatedPage, "customer-auth-orders");

  assert(
    authenticatedPage.url().includes("/#/orders"),
    "customer deployed authenticated session can open the orders route after restore",
    authenticatedPage.url(),
  );
  assert((await authenticatedPage.getByText(/^Orders$/i).count()) > 0, "customer deployed authenticated orders route exposes the Orders heading");
  assert((await authenticatedPage.getByRole("tab", { name: /^Active$/i }).count()) > 0, "customer deployed authenticated orders route exposes the Active tab");
  assert((await authenticatedPage.getByRole("tab", { name: /^History$/i }).count()) > 0, "customer deployed authenticated orders route exposes the History tab");

  const activeOrderCards = authenticatedPage.getByText(/Sabor Criollo Kitchen|Andes Green Bowl|Harbor Noodle Bar/i);
  if ((await activeOrderCards.count()) > 0) {
    await activeOrderCards.first().click();
    await authenticatedPage.waitForTimeout(2500);
    await screenshot(authenticatedPage, "customer-auth-order-status");
    assert(
      authenticatedPage.url().includes("/#/orders/status"),
      "customer deployed authenticated orders flow can open order status",
      authenticatedPage.url(),
    );
    assert((await authenticatedPage.getByText(/^Order Status$/i).count()) > 0, "customer deployed order status route exposes the status heading");
    assert((await authenticatedPage.getByText(/Estimated Delivery/i).count()) > 0, "customer deployed order status route exposes the ETA section");
    assert((await authenticatedPage.getByText(/Order Progress/i).count()) > 0, "customer deployed order status route exposes the milestone section");
    const detailCta =
      authenticatedPage.getByRole("button", { name: /View Order Details/i }).first();
    const detailText = authenticatedPage.getByText(/View Order Details/i).first();
    const detailIconButton =
      authenticatedPage.getByRole("button", { name: /Order details/i }).first();
    assert(
      (await detailCta.count()) > 0 ||
        (await detailText.count()) > 0 ||
        (await detailIconButton.count()) > 0,
      "customer deployed order status route exposes the detail CTA",
    );
    if ((await detailCta.count()) > 0) {
      await detailCta.click();
    } else if ((await detailIconButton.count()) > 0) {
      await detailIconButton.click();
    } else {
      await detailText.click();
    }
    await authenticatedPage.waitForTimeout(2500);
    await screenshot(authenticatedPage, "customer-auth-order-detail");
    assert(
      authenticatedPage.url().includes("/#/orders/detail"),
      "customer deployed authenticated order status flow can open order detail",
      authenticatedPage.url(),
    );
    assert((await authenticatedPage.getByText(/^Order Details$/i).count()) > 0, "customer deployed order detail route exposes the detail heading");
    assert((await authenticatedPage.getByText(/Items Ordered/i).count()) > 0, "customer deployed order detail route exposes ordered items");
  } else {
    assert(
      (await authenticatedPage.getByText(/No active orders|No past orders/i).count()) > 0,
      "customer deployed authenticated orders route renders a stable empty-state when no orders are available",
    );
  }

  await authenticatedContext.close();
}

async function runMerchant(browser) {
  const context = await createProtectedContext(browser, "merchant", targets.merchant, {
    width: 1280,
    height: 900,
  });
  const page = await context.newPage();

  await openAccessUrlIfNeeded(page, targets.merchant, "merchant console");
  const merchantEntry = await gotoChecked(page, `${targets.merchant.baseUrl}/demo-store/orders`, "merchant protected route", {
    allowProtectedSkip: true,
  });
  if (merchantEntry.protectedByVercel) {
    await screenshot(page, "merchant-vercel-protected");
    await context.close();
    return;
  }
  assert(page.url().includes("/login"), "merchant deployed protected route redirects anonymous user to login", page.url());
  await screenshot(page, "merchant-login-guard");

  if (!credentials.merchantEmail || !credentials.merchantPassword) {
    skip("merchant deployed authenticated smoke not run because merchant E2E credentials are not set");
    await context.close();
    return;
  }

  await page.fill("#email", credentials.merchantEmail);
  await page.fill("#password", credentials.merchantPassword);
  await Promise.all([
    page.waitForURL(/\/dashboard|\/select-store|\/onboarding/, { timeout: 20000 }),
    page.getByRole("button", { name: "Sign in" }).click(),
  ]);
  await waitForSettled(page);
  assert(
    /\/dashboard|\/select-store|\/onboarding/.test(page.url()),
    "merchant deployed authenticated entry reaches an allowed merchant destination",
    page.url(),
  );
  await screenshot(page, "merchant-auth-entry");

  await page.goto(`${targets.merchant.baseUrl}/demo-store/orders`, { waitUntil: "domcontentloaded" });
  await waitForSettled(page);
  await assertBodyDoesNotShowGenericError(page, "merchant deployed orders queue does not render a generic server error");
  assert(page.url().includes("/demo-store/orders"), "merchant deployed authenticated session can open the store order queue", page.url());
  await assertMerchantNavVisibility(page);
  assert((await page.getByText(/Order operations/i).count()) > 0, "merchant deployed order queue exposes the operations hero");
  assert((await page.getByRole("heading", { name: /^Orders$/i }).count()) > 0, "merchant deployed order queue exposes the Orders heading");
  assert((await page.getByText(/Awaiting response/i).count()) > 0, "merchant deployed order queue exposes intake summary");
  assert((await page.getByRole("columnheader", { name: /^Customer$/i }).count()) > 0, "merchant deployed order queue exposes the customer column");
  assert((await page.getByRole("columnheader", { name: /^Payment$/i }).count()) > 0, "merchant deployed order queue exposes the payment column");
  assert((await page.locator("table tbody tr").count()) > 0, "merchant deployed order queue renders at least one order row");
  await page.getByRole("button", { name: /Completed/i }).click();
  await page.waitForTimeout(500);
  assert(/Completed/i.test(await page.locator("button.tab.active").innerText()), "merchant deployed order queue can switch to the completed tab");
  await page.getByRole("button", { name: /Cancelled/i }).click();
  await page.waitForTimeout(500);
  assert(/Cancelled/i.test(await page.locator("button.tab.active").innerText()), "merchant deployed order queue can switch to the cancelled tab");
  await page.getByRole("button", { name: /Active/i }).click();
  await page.waitForTimeout(500);
  assert(/Active/i.test(await page.locator("button.tab.active").innerText()), "merchant deployed order queue can return to the active tab");
  await page.getByRole("button", { name: /^View$/i }).first().click();
  await page.waitForTimeout(1000);
  assert((await page.getByText(/Live queue detail/i).count()) > 0, "merchant deployed order queue opens the detail drawer");
  assert((await page.getByText(/^Customer$/i).count()) > 0, "merchant deployed order drawer exposes the customer summary");
  assert((await page.getByText(/^Total$/i).count()) > 0, "merchant deployed order drawer exposes the total summary");
  assert((await page.getByText(/^Payment$/i).count()) > 0, "merchant deployed order drawer exposes the payment section");
  await page.goto(`${targets.merchant.baseUrl}/demo-store/dashboard`, { waitUntil: "domcontentloaded" });
  await waitForSettled(page);
  assert(page.url().includes("/demo-store/dashboard"), "merchant deployed store-scoped dashboard route remains on the selected store", page.url());
  assert((await page.getByRole("heading", { name: /^Dashboard$/i }).count()) > 0, "merchant deployed dashboard route exposes the dashboard heading");
  assert((await page.getByText(/Queue snapshot/i).count()) > 0, "merchant deployed dashboard route exposes the queue snapshot card");
  assert((await page.locator(".data-table tbody tr").count()) > 0, "merchant deployed dashboard queue snapshot renders at least one row");
  assert((await page.locator(".alert-list .alert-item").count()) > 0, "merchant deployed dashboard alert list renders at least one item");
  await page.goto(`${targets.merchant.baseUrl}/demo-store/menu`, { waitUntil: "domcontentloaded" });
  await waitForSettled(page);
  assert(page.url().includes("/demo-store/menu"), "merchant deployed store-scoped menu route remains on the selected store", page.url());
  assert((await page.getByRole("heading", { name: /^Menu$/i }).count()) > 0, "merchant deployed menu route exposes the menu heading");
  await page.goto(`${targets.merchant.baseUrl}/demo-store/store`, { waitUntil: "domcontentloaded" });
  await waitForSettled(page);
  assert(page.url().includes("/demo-store/store"), "merchant deployed store-scoped store info route remains on the selected store", page.url());
  assert((await page.getByRole("heading", { name: /Store Information/i }).count()) > 0, "merchant deployed store info route exposes the store information heading");
  assert((await page.getByText(/Operating Hours/i).count()) > 0, "merchant deployed store info route exposes the operating hours section");
  assert((await page.locator(".hours-table tbody tr").count()) > 0, "merchant deployed store info route renders operating hours rows");
  await page.goto(`${targets.merchant.baseUrl}/demo-store/reviews`, { waitUntil: "domcontentloaded" });
  await waitForSettled(page);
  assert(page.url().includes("/demo-store/reviews"), "merchant deployed store-scoped reviews route remains on the selected store", page.url());
  assert((await page.getByRole("heading", { name: /^Reviews$/i }).count()) > 0, "merchant deployed reviews route exposes the reviews heading");
  assert((await page.getByText(/Review queue/i).count()) > 0, "merchant deployed reviews route exposes the review queue section");
  assert((await page.locator(".merchant-review-list .merchant-review-card").count()) > 0, "merchant deployed reviews route renders at least one review card");
  await page.goto(`${targets.merchant.baseUrl}/demo-store/promotions`, { waitUntil: "domcontentloaded" });
  await waitForSettled(page);
  assert(page.url().includes("/demo-store/promotions"), "merchant deployed store-scoped promotions route remains on the selected store", page.url());
  assert((await page.getByRole("heading", { name: /^Promotions$/i }).count()) > 0, "merchant deployed promotions route exposes the promotions heading");
  await page.goto(`${targets.merchant.baseUrl}/demo-store/settlement`, { waitUntil: "domcontentloaded" });
  await waitForSettled(page);
  assert(page.url().includes("/demo-store/settlement"), "merchant deployed store-scoped settlement route remains on the selected store", page.url());
  assert((await page.getByRole("heading", { name: /^Settlement$/i }).count()) > 0, "merchant deployed settlement route exposes the settlement heading");
  await page.goto(`${targets.merchant.baseUrl}/demo-store/analytics`, { waitUntil: "domcontentloaded" });
  await waitForSettled(page);
  assert(page.url().includes("/demo-store/analytics"), "merchant deployed store-scoped analytics route remains on the selected store", page.url());
  assert((await page.getByRole("heading", { name: /^Analytics$/i }).count()) > 0, "merchant deployed analytics route exposes the analytics heading");
  await page.goto(`${targets.merchant.baseUrl}/demo-store/settings`, { waitUntil: "domcontentloaded" });
  await waitForSettled(page);
  assert(page.url().includes("/demo-store/settings"), "merchant deployed store-scoped settings route remains on the selected store", page.url());
  assert((await page.getByRole("heading", { name: /^Settings$/i }).count()) > 0, "merchant deployed settings route exposes the settings heading");
  await page.goto(`${targets.merchant.baseUrl}/wrong-store/orders`, { waitUntil: "domcontentloaded" });
  await waitForSettled(page);
  assert(page.url().includes("/demo-store/dashboard"), "merchant deployed foreign store route is redirected back to the selected store home", page.url());
  await screenshot(page, "merchant-orders-queue");
  await context.close();
}

async function runAdmin(browser) {
  const platformSession = await signInAdminForRole(
    browser,
    /Continue as Platform Admin/i,
  );
  if (platformSession) {
    const { context: platformContext, page: platformPage } = platformSession;
    await waitForSettled(platformPage);
    await assertNavLabelVisibility(
      platformPage,
      {
        visible: ["Dashboard", "Users", "Merchants", "Stores", "Orders", "Disputes", "Customer Service", "Settlements", "Finance", "Marketing", "Announcements", "Catalog", "B2B", "Analytics", "Reporting", "System Management"],
        hidden: [],
      },
      "platform-role",
    );
    await platformPage.goto(`${targets.admin.baseUrl}/users`, { waitUntil: "domcontentloaded" });
    await waitForSettled(platformPage);
    assert(platformPage.url().includes("/users"), "admin deployed platform role can open the users route directly", platformPage.url());
    assert((await platformPage.getByRole("heading", { name: /User Management/i }).count()) > 0, "admin deployed platform users route exposes the user management heading");
    await platformPage.goto(`${targets.admin.baseUrl}/finance`, { waitUntil: "domcontentloaded" });
    await waitForSettled(platformPage);
    assert(platformPage.url().includes("/finance"), "admin deployed platform role can open the finance route directly", platformPage.url());
    assert((await platformPage.getByRole("heading", { name: /Finance Oversight/i }).count()) > 0, "admin deployed platform finance route exposes the finance heading");
    await platformPage.goto(`${targets.admin.baseUrl}/marketing`, { waitUntil: "domcontentloaded" });
    await waitForSettled(platformPage);
    assert(platformPage.url().includes("/marketing"), "admin deployed platform role can open the marketing route directly", platformPage.url());
    assert((await platformPage.getByRole("heading", { name: /^Marketing$/i }).count()) > 0, "admin deployed platform marketing route exposes the marketing heading");
    await platformPage.goto(`${targets.admin.baseUrl}/system-management`, { waitUntil: "domcontentloaded" });
    await waitForSettled(platformPage);
    assert(platformPage.url().includes("/system-management"), "admin deployed platform role can open the system management route directly", platformPage.url());
    assert((await platformPage.getByRole("heading", { name: /System Management/i }).count()) > 0, "admin deployed platform system management route exposes the system heading");
    await screenshot(platformPage, "admin-platform-role");
    await platformContext.close();
  }

  const supportSession = await signInAdminForRole(
    browser,
    /Continue as Support Admin/i,
  );
  if (!supportSession) {
    return;
  }
  const { context, page } = supportSession;
  await screenshot(page, "admin-auth-entry");
  await waitForSettled(page);
  await assertBodyDoesNotShowGenericError(page, "admin deployed dashboard does not render a generic server error");
  assert(page.url().includes("/dashboard"), "admin deployed authenticated session can open the dashboard", page.url());
  assert((await page.getByRole("heading", { name: /Platform Dashboard/i }).count()) > 0, "admin deployed dashboard exposes the platform heading");
  assert((await page.getByText(/Recent Orders/i).count()) > 0, "admin deployed dashboard exposes the recent orders panel");
  assert((await page.getByText(/Platform Alerts/i).count()) > 0, "admin deployed dashboard exposes the alert panel");
  await assertNavLabelVisibility(
    page,
    {
      visible: ["Dashboard", "Orders", "Disputes", "Customer Service"],
      hidden: ["Users", "Merchants", "Stores", "Settlements", "Finance", "Marketing", "Announcements", "Catalog", "B2B", "Analytics", "Reporting", "System Management"],
    },
    "support-role",
  );
  assert((await page.locator("table tbody tr").count()) > 0, "admin deployed dashboard recent orders table renders at least one row");
  await page.goto(`${targets.admin.baseUrl}/finance`, { waitUntil: "domcontentloaded" });
  await waitForSettled(page);
  assert(page.url().includes("/dashboard"), "admin deployed support role is redirected away from finance to its allowed home", page.url());
  await page.goto(`${targets.admin.baseUrl}/orders`, { waitUntil: "domcontentloaded" });
  await waitForSettled(page);
  assert(page.url().includes("/orders"), "admin deployed support role can open the orders route directly", page.url());
  assert((await page.getByRole("heading", { name: /Order Oversight/i }).count()) > 0, "admin deployed orders route exposes the oversight heading");
  await page.goto(`${targets.admin.baseUrl}/customer-service`, { waitUntil: "domcontentloaded" });
  await waitForSettled(page);
  assert(page.url().includes("/customer-service"), "admin deployed support role can open the customer service route directly", page.url());
  assert((await page.getByRole("heading", { name: /Customer Service/i }).count()) > 0, "admin deployed customer service route exposes the service heading");
  await screenshot(page, "admin-dashboard");
  await context.close();

  const financeSession = await signInAdminForRole(
    browser,
    /Continue as Finance Admin/i,
  );
  if (financeSession) {
    const { context: financeContext, page: financePage } = financeSession;
    await assertNavLabelVisibility(
      financePage,
      {
        visible: ["Dashboard", "Settlements", "Finance", "Analytics", "Reporting"],
        hidden: ["Users", "Merchants", "Stores", "Orders", "Disputes", "Customer Service", "Marketing", "Announcements", "Catalog", "B2B", "System Management"],
      },
      "finance-role",
    );
    await financePage.goto(`${targets.admin.baseUrl}/settlements`, { waitUntil: "domcontentloaded" });
    await waitForSettled(financePage);
    assert(financePage.url().includes("/settlements"), "admin deployed finance role can open the settlements route directly", financePage.url());
    assert((await financePage.getByRole("heading", { name: /Settlement Oversight/i }).count()) > 0, "admin deployed settlements route exposes the settlement heading");
    await financePage.goto(`${targets.admin.baseUrl}/finance`, { waitUntil: "domcontentloaded" });
    await waitForSettled(financePage);
    assert(financePage.url().includes("/finance"), "admin deployed finance role can open the finance route directly", financePage.url());
    assert((await financePage.getByRole("heading", { name: /Finance Oversight/i }).count()) > 0, "admin deployed finance route exposes the finance heading");
    await financePage.goto(`${targets.admin.baseUrl}/marketing`, { waitUntil: "domcontentloaded" });
    await waitForSettled(financePage);
    assert(financePage.url().includes("/dashboard"), "admin deployed finance role is redirected away from marketing to its allowed home", financePage.url());
    await screenshot(financePage, "admin-finance-role");
    await financeContext.close();
  }

  const marketingSession = await signInAdminForRole(
    browser,
    /Continue as Marketing Admin/i,
  );
  if (marketingSession) {
    const { context: marketingContext, page: marketingPage } = marketingSession;
    await assertNavLabelVisibility(
      marketingPage,
      {
        visible: ["Dashboard", "Marketing", "Announcements", "Catalog", "B2B", "Analytics", "Reporting"],
        hidden: ["Users", "Merchants", "Stores", "Orders", "Disputes", "Customer Service", "Settlements", "Finance", "System Management"],
      },
      "marketing-role",
    );
    await marketingPage.goto(`${targets.admin.baseUrl}/marketing`, { waitUntil: "domcontentloaded" });
    await waitForSettled(marketingPage);
    assert(marketingPage.url().includes("/marketing"), "admin deployed marketing role can open the marketing route directly", marketingPage.url());
    assert((await marketingPage.getByRole("heading", { name: /^Marketing$/i }).count()) > 0, "admin deployed marketing route exposes the marketing heading");
    await marketingPage.goto(`${targets.admin.baseUrl}/announcements`, { waitUntil: "domcontentloaded" });
    await waitForSettled(marketingPage);
    assert(marketingPage.url().includes("/announcements"), "admin deployed marketing role can open the announcements route directly", marketingPage.url());
    assert((await marketingPage.getByRole("heading", { name: /Announcements/i }).count()) > 0, "admin deployed announcements route exposes the announcements heading");
    await marketingPage.goto(`${targets.admin.baseUrl}/orders`, { waitUntil: "domcontentloaded" });
    await waitForSettled(marketingPage);
    assert(marketingPage.url().includes("/dashboard"), "admin deployed marketing role is redirected away from orders to its allowed home", marketingPage.url());
    await screenshot(marketingPage, "admin-marketing-role");
    await marketingContext.close();
  }

  const operationsSession = await signInAdminForRole(
    browser,
    /Continue as Operations Admin/i,
  );
  if (operationsSession) {
    const { context: operationsContext, page: operationsPage } = operationsSession;
    await assertNavLabelVisibility(
      operationsPage,
      {
        visible: ["Dashboard", "Users", "Merchants", "Stores", "Orders", "Disputes", "Customer Service", "Analytics", "Reporting"],
        hidden: ["Settlements", "Finance", "Marketing", "Announcements", "Catalog", "B2B", "System Management"],
      },
      "operations-role",
    );
    await operationsPage.goto(`${targets.admin.baseUrl}/users`, { waitUntil: "domcontentloaded" });
    await waitForSettled(operationsPage);
    assert(operationsPage.url().includes("/users"), "admin deployed operations role can open the users route directly", operationsPage.url());
    assert((await operationsPage.getByRole("heading", { name: /User Management/i }).count()) > 0, "admin deployed users route exposes the user management heading");
    await operationsPage.goto(`${targets.admin.baseUrl}/disputes`, { waitUntil: "domcontentloaded" });
    await waitForSettled(operationsPage);
    assert(operationsPage.url().includes("/disputes"), "admin deployed operations role can open the disputes route directly", operationsPage.url());
    assert((await operationsPage.getByRole("heading", { name: /^Disputes$/i }).count()) > 0, "admin deployed disputes route exposes the disputes heading");
    await operationsPage.goto(`${targets.admin.baseUrl}/finance`, { waitUntil: "domcontentloaded" });
    await waitForSettled(operationsPage);
    assert(operationsPage.url().includes("/dashboard"), "admin deployed operations role is redirected away from finance to its allowed home", operationsPage.url());
    await screenshot(operationsPage, "admin-operations-role");
    await operationsContext.close();
  }
}

async function main() {
  note(`customer=${targets.customer.baseUrl}`);
  note(`merchant=${targets.merchant.baseUrl}`);
  note(`admin=${targets.admin.baseUrl}`);
  note(`public=${targets.public.baseUrl}`);

  const browser = await chromium.launch({ headless: true });
  try {
    await runPublic(browser);
    await runCustomer(browser);
    await runMerchant(browser);
    await runAdmin(browser);
  } finally {
    await browser.close();
  }

  console.log(`Output: ${outputDir}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
