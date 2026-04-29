# Phase 1 Deployed Browser E2E -- 2026-04-28

Status: active
Authority: operational
Surface: customer-app, merchant-console, admin-console, public-website
Domains: deployed-smoke, browser-e2e, access-boundaries, release-gates
Last updated: 2026-04-29
Last verified: 2026-04-29

## Purpose

This document records the Phase 1 deployed browser smoke test pass against the currently deployed Vercel artifacts.

This verification is read-only. It does not implement or exercise live payment verification, map autocomplete, QR generation/scanning, or real-time order tracking.

## Source Of Truth

- `docs/01-product-architecture.md`
- `docs/02-surface-ownership.md`
- `docs/03-navigation-ia.md`
- `docs/04-feature-inventory.md`
- `docs/05-implementation-phases.md`
- `docs/06-guardrails.md`
- `shared/docs/architecture-boundaries.md`
- `docs/operations/production-roadmap-2026-04-28.md`
- `docs/operations/phase-1-deployed-browser-e2e-secret-checklist-2026-04-28.md`
- `.playwright-cli/phase1-deployed-boundary-e2e.mjs`
- `scripts/run-phase1-deployed-boundary-e2e.sh`
- `scripts/check-phase1-deployed-boundary-env.sh`
- `.github/workflows/phase1-deployed-boundary-e2e.yml`

## Tested Deployment Artifacts

The latest non-skip deployed smoke test targeted the stable production aliases:

- customer-app: `https://deliberry-customer.vercel.app`
- merchant-console: `https://merchant-console-six.vercel.app`
- admin-console: `https://deliberry-admin.vercel.app`
- public-website: `https://go.deli-berry.com`

The customer-app production alias now points at deployment `deliberry-customer-dv2klhiei-andres-projects-c63d3b09.vercel.app`, which includes the customer deep-link preservation fix from `customer-app/lib/app/app.dart`.

The latest green GitHub Actions baseline is run `25096403811` on commit `ca4ce4b440b0401eea74b2b4a7f5026cdd9471d5`. That run closed the full non-skip deployed boundary suite across the public, customer, merchant, and admin production aliases.

## Test Coverage

The deployed script covers:

- public website route rendering for `/`, `/service`, `/merchant`, `/support`, `/download`, `/privacy`, `/terms`, and `/refund-policy`
- Vercel deployment-protection detection
- Vercel Deployment Protection automation bypass through `x-vercel-protection-bypass` and `x-vercel-set-bypass-cookie` headers when a bypass secret is provided
- customer-app root rendering and guest entry path when deployment access is available
- merchant-console anonymous protected-route guard for `/demo-store/orders` when deployment access is available
- admin-console anonymous protected-route guard for `/orders`
- optional merchant and admin authenticated entry checks when credentials are provided through environment variables

The script intentionally does not run write mutations against deployed environments.

## CI Runner

The deployed verification can be run manually from GitHub Actions through:

```text
Phase 1 Deployed Boundary E2E
```

Required or recommended repository secrets:

- `VERCEL_AUTOMATION_BYPASS_SECRET`, or surface-specific bypass secrets:
  `CUSTOMER_VERCEL_AUTOMATION_BYPASS_SECRET`, `MERCHANT_VERCEL_AUTOMATION_BYPASS_SECRET`,
  `ADMIN_VERCEL_AUTOMATION_BYPASS_SECRET`, `PUBLIC_VERCEL_AUTOMATION_BYPASS_SECRET`
- optional deployment URL overrides:
  `CUSTOMER_URL`, `MERCHANT_URL`, `ADMIN_URL`, `PUBLIC_URL`
- optional authenticated smoke credentials:
  `MERCHANT_E2E_EMAIL`, `MERCHANT_E2E_PASSWORD`, `ADMIN_E2E_EMAIL`, `ADMIN_E2E_PASSWORD`
- optional authenticated customer session seed:
  `CUSTOMER_AUTH_SESSION_JSON`
  - expected shape: the raw Supabase session JSON that `supabase_flutter` stores under the web auth key
  - the harness encrypts `customer_session_snapshot_v1` into FlutterSecureStorage format before loading `/#/orders`
- optional authenticated customer credentials:
  `CUSTOMER_E2E_EMAIL`, `CUSTOMER_E2E_PASSWORD`
  - if supplied, the harness mints a fresh Supabase password-grant session before seeding the customer app

If deployment URL secrets are absent, the harness falls back to the latest recorded deployed URLs from this Phase 1 run.

The workflow is intentionally `workflow_dispatch` only. It is not attached to pull requests because the deployed test uses protected deployment and optional login secrets.

The workflow now sets `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24=true` at the job level so the JavaScript-based Actions steps execute on the Node 24 runtime path ahead of the GitHub-hosted Node 20 removal. The job env also carries the governed customer browser fixture credentials directly from `CUSTOMER_E2E_EMAIL` and `CUSTOMER_E2E_PASSWORD`.

The exact input contract and release-gate rule for skip mode are recorded in `docs/operations/phase-1-deployed-browser-e2e-secret-checklist-2026-04-28.md`.

## Commands Run

```text
GitHub Actions run 25096403811
```

Result on 2026-04-29: passed end-to-end on `main` with non-skip deployed browser boundary coverage enabled for public, customer, merchant, and admin surfaces.

```bash
node --check .playwright-cli/phase1-deployed-boundary-e2e.mjs
```

Result after adding bypass-header support: passed.

```bash
ALLOW_DEPLOYMENT_PROTECTION_SKIP=1 scripts/run-phase1-deployed-boundary-e2e.sh
```

Result after adding the guarded runner: completed with protected customer-app and merchant-console checks recorded as skipped.

Latest guarded-run screenshots were written under:

```text
/Users/andremacmini/output/playwright/phase1-deployed-boundary-2026-04-28T08-02-39-688Z
```

After adding explicit environment preflight checks, the latest guarded-run screenshots were written under:

```text
/Users/andremacmini/output/playwright/phase1-deployed-boundary-2026-04-28T08-08-51-594Z
```

```bash
vercel deploy --prod --yes --scope andres-projects-c63d3b09 --archive=tgz
```

Result from a customer-linked temporary deploy workspace: passed. The customer-app production alias was updated to deployment `dpl_DHQEAAG44uxb4muGWnEo1JDPU2Sf`.

```bash
scripts/run-phase1-deployed-boundary-e2e.sh
```

Result without a bypass secret: failed fast with an explicit instruction to provide `VERCEL_AUTOMATION_BYPASS_SECRET` or surface-specific bypass secrets. This is expected and prevents false production-readiness claims against protected deployments.

```bash
VERCEL_AUTOMATION_BYPASS_SECRET=<shared-bypass-secret> \
CUSTOMER_URL=https://deliberry-customer.vercel.app \
MERCHANT_URL=https://merchant-console-six.vercel.app \
ADMIN_URL=https://deliberry-admin.vercel.app \
PUBLIC_URL=https://go.deli-berry.com \
scripts/run-phase1-deployed-boundary-e2e.sh
```

Result after the customer production redeploy: passed for public routes, customer guest entry and guest `/orders` auth guard, merchant anonymous login guard, and admin anonymous login guard. Authenticated merchant/admin smoke remained skipped because environment credentials were not set.

Latest non-skip screenshots were written under:

```text
/Users/andremacmini/output/playwright/phase1-deployed-boundary-2026-04-28T08-48-23-128Z
```

```bash
VERCEL_AUTOMATION_BYPASS_SECRET=<or surface-specific bypass secrets> \
MERCHANT_E2E_EMAIL=<merchant-test-email> \
MERCHANT_E2E_PASSWORD=<merchant-test-password> \
ADMIN_E2E_EMAIL=<admin-test-email> \
ADMIN_E2E_PASSWORD=<admin-test-password> \
scripts/run-phase1-deployed-boundary-e2e.sh
```

Result after production env alignment and auth-smoke credential provisioning on 2026-04-29: passed for public routes, customer guest/auth boundary, merchant anonymous guard plus authenticated entry, and admin anonymous guard plus authenticated entry.

Latest full authenticated screenshots were written under:

```text
/Users/andremacmini/output/playwright/phase1-deployed-boundary-2026-04-29T00-41-17-023Z
```

```bash
VERCEL_AUTOMATION_BYPASS_SECRET=<or surface-specific bypass secrets> \
MERCHANT_E2E_EMAIL=<merchant-test-email> \
MERCHANT_E2E_PASSWORD=<merchant-test-password> \
ADMIN_E2E_EMAIL=<admin-test-email> \
ADMIN_E2E_PASSWORD=<admin-test-password> \
scripts/run-phase1-deployed-boundary-e2e.sh
```

Result after extending the harness to read-only authenticated surface checks on 2026-04-29: passed for merchant authenticated order-queue visibility and admin authenticated dashboard visibility.

Latest authenticated read-only screenshots were written under:

```text
/Users/andremacmini/output/playwright/phase1-deployed-boundary-2026-04-29T00-49-26-051Z
```

```bash
VERCEL_AUTOMATION_BYPASS_SECRET=<or surface-specific bypass secrets> \
MERCHANT_E2E_EMAIL=<merchant-test-email> \
MERCHANT_E2E_PASSWORD=<merchant-test-password> \
ADMIN_E2E_EMAIL=<admin-test-email> \
ADMIN_E2E_PASSWORD=<admin-test-password> \
scripts/run-phase1-deployed-boundary-e2e.sh
```

Result after extending the harness again on 2026-04-29: passed for merchant order-queue table structure and row presence, plus admin support-role dashboard navigation filtering and recent-orders row presence.

Latest authenticated structural screenshots were written under:

```text
/Users/andremacmini/output/playwright/phase1-deployed-boundary-2026-04-29T00-52-35-594Z
```

```bash
VERCEL_AUTOMATION_BYPASS_SECRET=<or surface-specific bypass secrets> \
MERCHANT_E2E_EMAIL=<merchant-test-email> \
MERCHANT_E2E_PASSWORD=<merchant-test-password> \
ADMIN_E2E_EMAIL=<admin-test-email> \
ADMIN_E2E_PASSWORD=<admin-test-password> \
scripts/run-phase1-deployed-boundary-e2e.sh
```

Result after extending the harness once more on 2026-04-29: passed for merchant order-detail drawer visibility and admin support-role route-level redirect away from `/finance`.

Latest authenticated detail and role-boundary screenshots were written under:

```text
/Users/andremacmini/output/playwright/phase1-deployed-boundary-2026-04-29T00-56-30-594Z
```

```bash
VERCEL_AUTOMATION_BYPASS_SECRET=<or surface-specific bypass secrets> \
MERCHANT_E2E_EMAIL=<merchant-test-email> \
MERCHANT_E2E_PASSWORD=<merchant-test-password> \
ADMIN_E2E_EMAIL=<admin-test-email> \
ADMIN_E2E_PASSWORD=<admin-test-password> \
scripts/run-phase1-deployed-boundary-e2e.sh
```

Result after extending the harness again on 2026-04-29: passed for merchant order-queue tab switching and admin support-role direct entry into `/orders` and `/customer-service`.

Latest authenticated route-scope screenshots were written under:

```text
/Users/andremacmini/output/playwright/phase1-deployed-boundary-2026-04-29T00-59-02-396Z
```

```bash
VERCEL_AUTOMATION_BYPASS_SECRET=<or surface-specific bypass secrets> \
MERCHANT_E2E_EMAIL=<merchant-test-email> \
MERCHANT_E2E_PASSWORD=<merchant-test-password> \
ADMIN_E2E_EMAIL=<admin-test-email> \
ADMIN_E2E_PASSWORD=<admin-test-password> \
scripts/run-phase1-deployed-boundary-e2e.sh
```

Result after extending the harness to a broader admin role matrix on 2026-04-29: passed for platform-role full-nav visibility plus direct entry into `/users`, `/finance`, `/marketing`, and `/system-management`; support-role nav visibility and suppression; finance-role nav visibility and suppression plus direct entry into `/settlements` and `/finance` with redirect away from `/marketing`; marketing-role nav visibility and suppression plus direct entry into `/marketing` and `/announcements` with redirect away from `/orders`; and operations-role nav visibility and suppression plus direct entry into `/users` and `/disputes` with redirect away from `/finance`.

Latest authenticated role-matrix screenshots were written under:

```text
/Users/andremacmini/output/playwright/phase1-deployed-boundary-2026-04-29T01-25-30-912Z
/Users/andremacmini/output/playwright/phase1-deployed-boundary-2026-04-29T01-28-08-643Z
/Users/andremacmini/output/playwright/phase1-deployed-boundary-2026-04-29T01-40-42-954Z
/Users/andremacmini/output/playwright/phase1-deployed-boundary-2026-04-29T01-46-21-945Z
/Users/andremacmini/output/playwright/phase1-deployed-boundary-2026-04-29T02-27-25-502Z
/Users/andremacmini/output/playwright/phase1-deployed-boundary-2026-04-29T02-35-01-962Z
```

```bash
VERCEL_AUTOMATION_BYPASS_SECRET=<or surface-specific bypass secrets> \
CUSTOMER_E2E_EMAIL=<test-customer-email> \
CUSTOMER_E2E_PASSWORD=<test-customer-password> \
MERCHANT_E2E_EMAIL=<merchant-test-email> \
MERCHANT_E2E_PASSWORD=<merchant-test-password> \
ADMIN_E2E_EMAIL=<admin-test-email> \
ADMIN_E2E_PASSWORD=<admin-test-password> \
node .playwright-cli/phase1-deployed-boundary-e2e.mjs
```

Result after provisioning a governed customer browser fixture on 2026-04-29: passed for customer authenticated session restore, `/#/orders`, order status, and order detail, while the existing merchant/admin/public deployed smoke continued to pass in the same run.

Latest full cross-surface screenshots were written under:

```text
/Users/andremacmini/output/playwright/phase1-deployed-boundary-2026-04-29T03-06-38-331Z
```

```bash
ruby -e 'require "yaml"; YAML.load_file(".github/workflows/phase1-deployed-boundary-e2e.yml"); puts "yaml-ok"'
npx --prefix .playwright-cli playwright --version
bash -n scripts/run-phase1-deployed-boundary-e2e.sh
```

Result after adding the GitHub Actions runner: passed.

Earlier commands from the initial deployed run:

```bash
node --check .playwright-cli/phase1-deployed-boundary-e2e.mjs
```

Result: passed.

```bash
node .playwright-cli/phase1-deployed-boundary-e2e.mjs
```

Result: failed at customer-app because the deployment returned Vercel Authentication instead of the application.

```bash
ALLOW_DEPLOYMENT_PROTECTION_SKIP=1 node .playwright-cli/phase1-deployed-boundary-e2e.mjs
```

Result: completed with protected customer-app and merchant-console checks recorded as skipped.

Screenshots were written under:

```text
/Users/andremacmini/output/playwright/phase1-deployed-boundary-2026-04-28T07-50-43-926Z
```

## Results

Passed:

- Public landing route renders substantive content and is not blocked by Vercel protection.
- Public service route renders substantive content and is not blocked by Vercel protection.
- Public merchant onboarding route renders substantive content and is not blocked by Vercel protection.
- Public support route renders substantive content and is not blocked by Vercel protection.
- Public download route renders substantive content and is not blocked by Vercel protection.
- Public privacy route renders substantive content and is not blocked by Vercel protection.
- Public terms route renders substantive content and is not blocked by Vercel protection.
- Public refund policy route renders substantive content and is not blocked by Vercel protection.
- Customer deployed entry renders and exposes the guest path.
- Customer guest browse flow renders and direct guest navigation to `/#/orders` falls back to auth on the deployed app.
- Customer deployed guest home now verifies category browsing, popular-store discovery, and a tappable store card.
- Customer deployed store route now verifies store identity, menu section visibility, and the cart-start signal.
- Customer deployed store menu route now verifies category browsing, add-item controls, item-to-cart success feedback, and the cart CTA.
- Customer deployed cart route now verifies the cart heading, price summary rows, and the checkout CTA.
- Customer deployed checkout route now verifies delivery-address gating, cash and VNPAY placeholder payment options, order-summary visibility, price breakdown, and the place-order CTA.
- Customer deployed harness now supports an authenticated session seed through `CUSTOMER_AUTH_SESSION_JSON`; when provided, it verifies `/#/orders` and continues into order status/detail if an active order card is present.
- Customer deployed harness now also supports `CUSTOMER_E2E_EMAIL` plus `CUSTOMER_E2E_PASSWORD`, minting a fresh Supabase session on demand before the same authenticated orders/status/detail pass.
- Customer deployed authenticated browser smoke now passes with a governed test customer fixture that:
  - restores an authenticated customer session without falling back to auth,
  - opens `/#/orders`,
  - opens an active order status screen,
  - and reaches order detail successfully.
- Merchant deployed protected route `/demo-store/orders` redirects an anonymous user to `/login`.
- Merchant deployed authenticated entry reaches an allowed merchant destination with the configured browser test account.
- Merchant deployed authenticated session can open `/demo-store/orders`, avoids a generic server error, and exposes the order-queue hero, heading, and intake summary.
- Merchant deployed authenticated order queue also exposes stable `Customer` and `Payment` columns and renders at least one order row.
- Merchant deployed authenticated order queue can open the detail drawer and expose customer, total, and payment summaries.
- Merchant deployed authenticated order queue can switch across `Active`, `Completed`, and `Cancelled` tabs and return to `Active`.
- Merchant deployed store-scoped nav now verifies the full console link set for the selected store.
- Merchant deployed dashboard route now verifies the queue snapshot card, at least one queue row, and at least one alert item.
- Merchant deployed store information route now verifies the operating-hours section and at least one hours row.
- Merchant deployed reviews route now verifies the review queue section and at least one review card.
- Merchant deployed direct entry into `/menu`, `/promotions`, `/settlement`, `/analytics`, and `/settings` now stays inside the selected store scope and exposes each route's primary heading.
- Merchant deployed direct entry into a foreign `storeId` now redirects back to the selected store home scope.
- Admin deployed protected route `/orders` redirects an anonymous user to `/login`.
- Admin deployed authenticated entry reaches the role boundary or dashboard with the configured browser test account.
- Admin deployed authenticated session can cross the role boundary, open `/dashboard`, avoid a generic server error, and expose the dashboard heading, recent orders panel, and alert panel.
- Admin deployed support-role dashboard nav shows `Dashboard`, `Orders`, and `Customer Service`, hides `Finance` and `Marketing`, and renders at least one recent-order row.
- Admin deployed platform role nav now verifies the full allowed platform surface and confirms direct entry into `/users`, `/finance`, `/marketing`, and `/system-management`.
- Admin deployed support role is redirected away from `/finance` back to its allowed home scope.
- Admin deployed support role can also open `/orders` and `/customer-service` directly and see each route's primary heading.
- Admin deployed support role nav now verifies both allowed links and hidden disallowed links.
- Admin deployed finance role can open `/settlements` and `/finance` directly and is redirected away from `/marketing`.
- Admin deployed finance role nav now verifies both allowed links and hidden disallowed links.
- Admin deployed marketing role can open `/marketing` and `/announcements` directly and is redirected away from `/orders`.
- Admin deployed marketing role nav now verifies both allowed links and hidden disallowed links.
- Admin deployed operations role can open `/users` and `/disputes` directly and is redirected away from `/finance`.
- Admin deployed operations role nav now verifies both allowed links and hidden disallowed links.

Skipped or blocked:

- None in the latest authenticated deployed run.
- Historical note: customer authenticated deployed smoke was environment-gated until a governed customer browser fixture was provisioned. The harness retains both session-json seeding and password-grant fixture support because phone fallback is still intentionally disabled and production social login is a higher-friction automation path.

## Production Readiness Impact

This pass improves Phase 1 confidence for public-website deployed route availability, customer-app deployed guest/auth boundaries, merchant-console anonymous and authenticated entry protection, and admin-console anonymous and authenticated entry protection.

This pass closes the deployed boundary gate for the currently deployed customer-app, merchant-console, admin-console, and public-website surfaces when the runner has the documented Vercel automation bypass secrets and configured browser test credentials.

The harness now supports the documented Vercel automation path. Configure the Vercel project Deployment Protection bypass secret and pass it to the runner as either:

- `VERCEL_AUTOMATION_BYPASS_SECRET` for all protected surfaces, or
- `CUSTOMER_VERCEL_AUTOMATION_BYPASS_SECRET`, `MERCHANT_VERCEL_AUTOMATION_BYPASS_SECRET`, `ADMIN_VERCEL_AUTOMATION_BYPASS_SECRET`, and `PUBLIC_VERCEL_AUTOMATION_BYPASS_SECRET` for surface-specific secrets.

The guarded runner refuses a non-skip deployed verification run unless one of those bypass secrets is present.

Current state after direct operator configuration on 2026-04-28:

- Vercel automation protection bypass has been configured directly on the deployed customer-app, merchant-console, admin-console, and public-website projects.
- The GitHub repository now carries surface-specific Vercel automation bypass secrets for customer, merchant, admin, and public deployed E2E runs.
- GitHub repository URL secrets have been synchronized to stable deployed URLs for customer, merchant, admin, and public surfaces.
- Non-skip deployed E2E now reaches all four protected deployments instead of the Vercel Authentication wall.
- Customer guest Orders deep-link behavior was fixed locally, redeployed to production, and verified on the live alias.
- Merchant production project settings were aligned to `rootDirectory=merchant-console` with `sourceFilesOutsideRootDirectory=true` so repo-root shared imports resolve during Vercel production builds.
- Merchant and admin production env vars were realigned to the active Supabase project URL, anon key, and service-role key.
- A dedicated admin browser test account was provisioned in the linked Supabase project and synchronized into GitHub Actions secrets.
- Merchant and admin authenticated browser smoke now run in the deployed harness.

Workspace fix prepared after the deployed diagnosis:

- `customer-app/lib/app/app.dart` now resolves the initial route from `platformDispatcher.defaultRouteName` instead of always forcing `/entry`.
- This preserves direct deep links such as `/orders` so the route guard can redirect guest users to auth instead of silently bouncing through the entry screen back to `/home`.
- `customer-app/test/app/app_initial_route_test.dart` verifies the root-route fallback and deep-link preservation behavior.

## Next Required Action

Extend the authenticated merchant/admin smoke from current role-matrix assertions into stable row-selection persistence, tab row-count expectations, and additional admin-role route guards such as operations-role visibility without crossing into destructive mutations. Re-run:

```bash
CUSTOMER_URL=<staging-customer-url> \
MERCHANT_URL=<staging-merchant-url> \
ADMIN_URL=<staging-admin-url> \
PUBLIC_URL=<staging-public-url> \
VERCEL_AUTOMATION_BYPASS_SECRET=<vercel-automation-bypass-secret> \
scripts/run-phase1-deployed-boundary-e2e.sh
```

If authenticated checks are required, provide non-production test credentials through:

```bash
MERCHANT_E2E_EMAIL=<test-merchant-email> \
MERCHANT_E2E_PASSWORD=<test-merchant-password> \
ADMIN_E2E_EMAIL=<test-admin-email> \
ADMIN_E2E_PASSWORD=<test-admin-password> \
CUSTOMER_E2E_EMAIL=<test-customer-email> \
CUSTOMER_E2E_PASSWORD=<test-customer-password> \
CUSTOMER_AUTH_SESSION_JSON=<serialized-supabase-session-json>
```

The runner also accepts the normalized local names `MERCHANT_EMAIL`, `MERCHANT_PASSWORD`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`.
