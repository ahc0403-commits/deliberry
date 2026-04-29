import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { isAbsolute, join, resolve } from "node:path";

const configuredOutputRoot = process.env.PLAYWRIGHT_OUTPUT_ROOT?.trim();
const outputRoot = configuredOutputRoot
  ? (isAbsolute(configuredOutputRoot)
      ? configuredOutputRoot
      : resolve(process.cwd(), configuredOutputRoot))
  : join(process.cwd(), "..", "output", "playwright");

const outputDir = join(
  outputRoot,
  `phase1-route-width-${new Date().toISOString().replace(/[:.]/g, "-")}`,
);

mkdirSync(outputDir, { recursive: true });

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

function parseTarget(value) {
  const url = new URL(value);
  return {
    accessUrl: url.searchParams.has("_vercel_share") ? value : undefined,
    baseUrl: url.origin,
  };
}

const targets = {
  customer: parseTarget(envOrDefault(process.env.CUSTOMER_URL, "https://deliberry-customer.vercel.app")),
  merchant: parseTarget(envOrDefault(process.env.MERCHANT_URL, "https://merchant-console-six.vercel.app")),
  admin: parseTarget(envOrDefault(process.env.ADMIN_URL, "https://deliberry-admin.vercel.app")),
  public: parseTarget(envOrDefault(process.env.PUBLIC_URL, "https://go.deli-berry.com")),
};

const customerAuth = {
  email: firstNonEmpty(process.env.CUSTOMER_EMAIL, process.env.CUSTOMER_E2E_EMAIL),
  password: firstNonEmpty(process.env.CUSTOMER_PASSWORD, process.env.CUSTOMER_E2E_PASSWORD),
  supabaseUrl: envOrDefault(firstNonEmpty(process.env.CUSTOMER_SUPABASE_URL, process.env.SUPABASE_URL), "https://gjcwxsezrovxcrpdnazc.supabase.co"),
  supabaseAnonKey: envOrDefault(
    firstNonEmpty(process.env.CUSTOMER_SUPABASE_ANON_KEY, process.env.SUPABASE_ANON_KEY),
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqY3d4c2V6cm92eGNycGRuYXpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3MzAxMTAsImV4cCI6MjA4OTMwNjExMH0.dPbfYDbgr48qaN2axk5esW_0OMhFDUDOWCts2aZoMLc",
  ),
};

const credentials = {
  merchantEmail: firstNonEmpty(process.env.MERCHANT_EMAIL, process.env.MERCHANT_E2E_EMAIL),
  merchantPassword: firstNonEmpty(process.env.MERCHANT_PASSWORD, process.env.MERCHANT_E2E_PASSWORD),
  adminEmail: firstNonEmpty(process.env.ADMIN_EMAIL, process.env.ADMIN_E2E_EMAIL),
  adminPassword: firstNonEmpty(process.env.ADMIN_PASSWORD, process.env.ADMIN_E2E_PASSWORD),
};

const bypassSecrets = {
  customer: process.env.CUSTOMER_VERCEL_AUTOMATION_BYPASS_SECRET,
  merchant: process.env.MERCHANT_VERCEL_AUTOMATION_BYPASS_SECRET,
  admin: process.env.ADMIN_VERCEL_AUTOMATION_BYPASS_SECRET,
  public: process.env.PUBLIC_VERCEL_AUTOMATION_BYPASS_SECRET,
  fallback: process.env.VERCEL_AUTOMATION_BYPASS_SECRET,
};

const viewports = [
  { label: "mobile", width: 390, height: 844, isMobile: true, hasTouch: true },
  { label: "tablet", width: 768, height: 1024, isMobile: false, hasTouch: true },
  { label: "desktop", width: 1366, height: 900, isMobile: false, hasTouch: false },
];

function note(message) {
  console.log(`NOTE: ${message}`);
}

function pass(message) {
  console.log(`PASS: ${message}`);
}

function assert(condition, label, detail = "") {
  if (!condition) {
    throw new Error(`FAIL: ${label}${detail ? `\n${detail}` : ""}`);
  }
  pass(label);
}

function bypassSecretForSurface(surface) {
  return bypassSecrets[surface] ?? bypassSecrets.fallback ?? "";
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

async function waitForSettled(page) {
  await page.waitForLoadState("domcontentloaded");
  await page.waitForLoadState("networkidle").catch(() => {});
}

async function screenshot(page, name) {
  await page.screenshot({
    path: join(outputDir, `${name}.png`),
    fullPage: true,
  });
}

async function openAccessUrlIfNeeded(page, target) {
  if (!target.accessUrl) {
    return;
  }
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

async function assertNoGenericError(page, label) {
  const text = await page.locator("body").innerText({ timeout: 5000 }).catch(() => "");
  assert(
    !/application error|something went wrong|internal server error|server-side exception|this page could not be found|\b500\b/i.test(text),
    label,
    text.slice(0, 1200),
  );
}

async function assertNoHorizontalOverflow(page, label) {
  const metrics = await page.evaluate(() => {
    const viewportWidth = window.innerWidth;
    const offenders = [];

    for (const el of Array.from(document.body.querySelectorAll("*"))) {
      const rect = el.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) {
        continue;
      }
      if (rect.right > viewportWidth + 2 || rect.left < -2) {
        offenders.push({
          tag: el.tagName,
          className: typeof el.className === "string" ? el.className : "",
          text: (el.textContent ?? "").trim().replace(/\s+/g, " ").slice(0, 120),
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        });
      }
      if (offenders.length >= 12) {
        break;
      }
    }

    return {
      documentScrollWidth: document.documentElement.scrollWidth,
      scrollingElementScrollWidth:
        document.scrollingElement?.scrollWidth ?? document.documentElement.scrollWidth,
      innerWidth: viewportWidth,
      clientWidth: document.documentElement.clientWidth,
      offenders,
    };
  });

  const effectiveWidth = Math.max(metrics.innerWidth, metrics.clientWidth, 1);
  const maxWidth = Math.max(
    metrics.documentScrollWidth,
    metrics.scrollingElementScrollWidth,
  );
  assert(
    maxWidth <= effectiveWidth + 2,
    `${label} has no horizontal overflow`,
    JSON.stringify(metrics, null, 2),
  );
}

async function resolveCustomerSessionJson() {
  if (!customerAuth.email || !customerAuth.password) {
    return undefined;
  }

  const response = await fetch(`${customerAuth.supabaseUrl}/auth/v1/token?grant_type=password`, {
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
  });

  const body = await response.json().catch(() => null);
  assert(
    response.ok && body && typeof body.access_token === "string",
    "customer width QA fixture can mint a session",
    JSON.stringify(body, null, 2),
  );

  return JSON.stringify(body);
}

async function seedCustomerSession(page, sessionJson) {
  const authStorageKey = `sb-${new URL(customerAuth.supabaseUrl).host.split(".")[0]}-auth-token`;
  await page.addInitScript(
    ({ authKey, rawSession }) => {
      window.localStorage.setItem(authKey, rawSession);
      const session = JSON.parse(rawSession);
      const snapshot = {
        version: 1,
        kind: "authenticated",
        userId: session.user?.id,
        email: session.user?.email ?? null,
        displayName: session.user?.user_metadata?.full_name ?? null,
        phoneNumber: session.user?.phone ?? null,
        provider: session.user?.app_metadata?.provider ?? "email",
      };
      window.localStorage.setItem("customer_session_snapshot_v1", JSON.stringify(snapshot));
    },
    { authKey: authStorageKey, rawSession: sessionJson },
  );
}

async function loginMerchant(page) {
  await openAccessUrlIfNeeded(page, targets.merchant);
  await page.goto(`${targets.merchant.baseUrl}/login`, { waitUntil: "domcontentloaded" });
  await waitForSettled(page);
  await page.fill("#email", credentials.merchantEmail);
  await page.fill("#password", credentials.merchantPassword);
  await Promise.all([
    page.waitForURL(/\/onboarding|\/select-store|\/demo-store\/dashboard|\/demo-store\/orders/, {
      timeout: 20000,
    }),
    page.getByRole("button", { name: /^Sign in$/i }).click(),
  ]);
  await waitForSettled(page);

  if (page.url().includes("/onboarding")) {
    await Promise.all([
      page.waitForURL(/\/select-store|\/demo-store\/dashboard|\/demo-store\/orders/, {
        timeout: 20000,
      }),
      page.getByRole("button", { name: /Continue to store selection/i }).click(),
    ]);
    await waitForSettled(page);
  }

  if (page.url().includes("/select-store")) {
    await Promise.all([
      page.waitForURL(/\/demo-store\/dashboard|\/demo-store\/orders/, { timeout: 20000 }),
      page.getByRole("button", { name: /demo-store/i }).first().click(),
    ]);
    await waitForSettled(page);
  }
}

async function loginAdmin(page) {
  await openAccessUrlIfNeeded(page, targets.admin);
  await page.goto(`${targets.admin.baseUrl}/login`, { waitUntil: "domcontentloaded" });
  await waitForSettled(page);
  await page.fill("#email", credentials.adminEmail);
  await page.fill("#password", credentials.adminPassword);
  await Promise.all([
    page.waitForURL(/\/access-boundary|\/dashboard/, { timeout: 20000 }),
    page.getByRole("button", { name: /Sign in to Admin Console/i }).click(),
  ]);
  await waitForSettled(page);
  if (page.url().includes("/access-boundary")) {
    await Promise.all([
      page.waitForURL(/\/dashboard/, { timeout: 20000 }),
      page.getByRole("button", { name: /Continue as Platform Admin/i }).click(),
    ]);
    await waitForSettled(page);
  }
}

async function runPublic(browser, viewport) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    isMobile: viewport.isMobile,
    hasTouch: viewport.hasTouch,
  });
  await installBypassRouting(context, "public", targets.public);
  const page = await context.newPage();
  await openAccessUrlIfNeeded(page, targets.public);

  for (const route of ["/", "/download"]) {
    await page.goto(`${targets.public.baseUrl}${route}`, { waitUntil: "domcontentloaded" });
    await waitForSettled(page);
    await screenshot(page, `public-${route === "/" ? "landing" : "download"}-${viewport.label}`);
    await assertNoGenericError(page, `public ${route} renders without generic error on ${viewport.label}`);
    await assertNoHorizontalOverflow(page, `public ${route} viewport fits on ${viewport.label}`);
  }

  await context.close();
}

async function runCustomer(browser, viewport, sessionJson) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    isMobile: viewport.isMobile,
    hasTouch: viewport.hasTouch,
  });
  await installBypassRouting(context, "customer", targets.customer);
  const page = await context.newPage();
  await openAccessUrlIfNeeded(page, targets.customer);

  await page.goto(targets.customer.baseUrl, { waitUntil: "domcontentloaded" });
  await waitForSettled(page);
  await page.waitForTimeout(2500);
  await enableFlutterSemantics(page);

  const continueGuest = page.getByRole("button", { name: /Continue as Guest/i }).first();
  if ((await continueGuest.count()) > 0) {
    await continueGuest.click();
    await page.waitForTimeout(1200);
  }
  const browseGuest = page.getByRole("button", { name: /Browse as Guest/i }).first();
  if ((await browseGuest.count()) > 0) {
    await browseGuest.click();
    await page.waitForTimeout(2200);
  }

  await assertNoGenericError(page, `customer home renders without generic error on ${viewport.label}`);
  await assertNoHorizontalOverflow(page, `customer home viewport fits on ${viewport.label}`);
  await screenshot(page, `customer-home-${viewport.label}`);

  await page.goto(`${targets.customer.baseUrl}/#/store/menu`, { waitUntil: "domcontentloaded" });
  await waitForSettled(page);
  await page.waitForTimeout(2200);
  await screenshot(page, `customer-store-menu-${viewport.label}`);
  await assertNoGenericError(page, `customer store menu renders without generic error on ${viewport.label}`);
  await assertNoHorizontalOverflow(page, `customer store menu viewport fits on ${viewport.label}`);

  if (sessionJson) {
    const authContext = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      isMobile: viewport.isMobile,
      hasTouch: viewport.hasTouch,
    });
    await installBypassRouting(authContext, "customer", targets.customer);
    const authPage = await authContext.newPage();
    await seedCustomerSession(authPage, sessionJson);
    await openAccessUrlIfNeeded(authPage, targets.customer);
    await authPage.goto(`${targets.customer.baseUrl}/#/orders`, { waitUntil: "domcontentloaded" });
    await waitForSettled(authPage);
    await authPage.waitForTimeout(2200);
    await enableFlutterSemantics(authPage);
    await screenshot(authPage, `customer-orders-${viewport.label}`);
    await assertNoGenericError(authPage, `customer orders renders without generic error on ${viewport.label}`);
    await assertNoHorizontalOverflow(authPage, `customer orders viewport fits on ${viewport.label}`);
    await authContext.close();
  } else {
    note(`customer authenticated width QA skipped on ${viewport.label} because fixture credentials are absent`);
  }

  await context.close();
}

async function runMerchant(browser, viewport) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    isMobile: viewport.isMobile,
    hasTouch: viewport.hasTouch,
  });
  await installBypassRouting(context, "merchant", targets.merchant);
  const page = await context.newPage();
  await loginMerchant(page);

  for (const route of ["/demo-store/dashboard", "/demo-store/orders"]) {
    await page.goto(`${targets.merchant.baseUrl}${route}`, { waitUntil: "domcontentloaded" });
    await waitForSettled(page);
    await screenshot(page, `merchant-${route.split("/").pop()}-${viewport.label}`);
    await assertNoGenericError(page, `merchant ${route} renders without generic error on ${viewport.label}`);
    await assertNoHorizontalOverflow(page, `merchant ${route} viewport fits on ${viewport.label}`);
  }

  await context.close();
}

async function runAdmin(browser, viewport) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    isMobile: viewport.isMobile,
    hasTouch: viewport.hasTouch,
  });
  await installBypassRouting(context, "admin", targets.admin);
  const page = await context.newPage();
  await loginAdmin(page);

  for (const route of ["/dashboard", "/orders"]) {
    await page.goto(`${targets.admin.baseUrl}${route}`, { waitUntil: "domcontentloaded" });
    await waitForSettled(page);
    await screenshot(page, `admin-${route.replace("/", "")}-${viewport.label}`);
    await assertNoGenericError(page, `admin ${route} renders without generic error on ${viewport.label}`);
    await assertNoHorizontalOverflow(page, `admin ${route} viewport fits on ${viewport.label}`);
  }

  await context.close();
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  try {
    const sessionJson = await resolveCustomerSessionJson().catch(() => undefined);
    for (const viewport of viewports) {
      note(`running route-width QA for ${viewport.label}`);
      await runPublic(browser, viewport);
      await runCustomer(browser, viewport, sessionJson);
      await runMerchant(browser, viewport);
      await runAdmin(browser, viewport);
    }
    note(`screenshots written to ${outputDir}`);
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
