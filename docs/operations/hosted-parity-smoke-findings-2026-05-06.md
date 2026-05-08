# Hosted Parity Smoke Findings -- 2026-05-06

Status: active
Authority: operational
Surface: public-website, customer-app, merchant-console, admin-console, vercel
Domains: hosted-parity, smoke, release-hardening
Last updated: 2026-05-06
Last verified: 2026-05-06

## Purpose

Record the hosted-parity smoke pass after the local RC hardening work, including the first stale-alias findings and the post-redeploy verification state.

## Deployment Targets Used

- Public website production deployment before parity redeploy:
  - `https://deliberry-mwko028zm-andres-projects-c63d3b09.vercel.app/`
- Public website production alias after parity redeploy:
  - `https://go.deli-berry.com/`
- Customer app production deployment:
  - `https://deliberry-customer-4mor1unhm-andres-projects-c63d3b09.vercel.app/`
- Merchant console production deployment before parity redeploy:
  - `https://merchant-console-ldtsl68ve-andres-projects-c63d3b09.vercel.app/login`
- Merchant console production alias after parity redeploy:
  - `https://merchant-console-six.vercel.app/login`
- Admin console production deployment:
  - `https://deliberry-admin-bq04xuzpv-andres-projects-c63d3b09.vercel.app/login`

All four deployment URLs were resolved from the current Vercel production deployment list on 2026-05-06.

## Results

### Public website

Status: PASS (anonymous public routes re-verified after redeploy)

Observed:
- public production alias responds `200 OK` on `/`, `/download`, and `/support`
- post-redeploy HTML now reflects the current Ho Chi Minh City / Vietnam-market baseline:
  - `Ho Chi Minh City delivery, merchant growth, and app launch updates`
  - `Loved by thousands across Ho Chi Minh City`
  - `Fast, reliable food delivery connecting Ho Chi Minh City with the restaurants people love.`
  - `The app is coming soon.`
  - `No install flow yet, but no dead end either`
  - `Clear help paths for orders, accounts, and refunds`
- the earlier `Buenos Aires` / `8 barrios` stale content is no longer present on the production alias
- default server response still renders `lang="en"` unless a locale cookie is present, which is expected for this smoke depth

Meaning:
- production public alias is reachable
- production public anonymous routes are now parity-aligned with the current repo baseline at the HTML/content level

### Merchant console

Status: PASS (anonymous login surface re-verified after redeploy)

Observed:
- `/login` responds `200 OK`
- post-redeploy login now reflects the current merchant baseline:
  - `Merchant sign-in`
  - `Return to your store workspace`
  - `Store-scoped access`
  - `Runtime-backed data`
  - `Admin-provisioned merchants`
  - `Platform admins create merchant credentials first; store owners then sign in here...`
  - partner handoff is now `mailto:partners@deliberry.com`
- the older stale markers are no longer present:
  - `demo@saborcriollo.com`
  - `https://your-main-site.com/merchant`

Meaning:
- production merchant alias is reachable
- production merchant anonymous login surface is now parity-aligned with the current repo baseline
- authenticated store-scoped parity still needs a separate hosted smoke pass

### Admin console

Status: PASS (login surface only)

Observed:
- `/login` responds `200 OK`
- hosted admin login reflects the current intended hosted-auth posture:
  - `Sign in with the hosted admin identity`
  - role-aware / hosted / live-runtime entry pills
  - no obvious old-market residue in the fetched login HTML

Meaning:
- production admin login surface is closer to current parity than public/merchant
- protected-route parity still requires authenticated smoke

### Customer app

Status: PARTIAL

Observed:
- hosted customer root responds `200 OK`
- root HTML is the expected Flutter web shell bootstrap
- this confirms deployment reachability, but not runtime parity of localized in-app flows

Meaning:
- production customer alias is alive
- runtime parity still needs browser-driven smoke after bootstrap

## Hosted Parity Verdict

Current hosted parity is **substantially refreshed and operationally re-verified**.

Blocked areas:
1. physical target-device evidence is still separate from hosted browser parity
2. hosted parity should still be re-run after any future material auth, routing, or deployment-baseline change

## Immediate Implications

- Hosted browser parity is no longer the primary blocker.
- Keep using the local RC regression matrix together with the refreshed deployed-boundary run as the current release-readiness baseline.
- The remaining stronger release blocker is physical target-device evidence, not anonymous-hosted or authenticated-hosted route drift.

## Recommended Next Steps

1. Run browser-driven hosted smoke for the customer app with a governed signed-in fixture.
2. Run authenticated hosted smoke for merchant store-scoped routes after login.
3. Run authenticated hosted smoke for admin oversight routes after login.
4. Attach parity evidence back into the release gate checklist and local RC hardening summary once those hosted flows are verified.

## Authenticated Hosted Smoke Notes

- The deployed browser harness already supports governed customer authenticated smoke through:
  - `CUSTOMER_AUTH_SESSION_JSON`
  - `CUSTOMER_E2E_EMAIL`
  - `CUSTOMER_E2E_PASSWORD`
- Those inputs are already wired through the deployed browser workflows and repo secrets, as documented in:
  - `docs/operations/phase-1-deployed-browser-e2e-2026-04-28.md`
  - `.github/workflows/phase1-deployed-boundary-e2e.yml`
  - `.github/workflows/phase1-route-width-qa.yml`
- A fresh hosted boundary refresh run has now been queued against the current redeployed aliases:
- That hosted boundary refresh run has now completed green:
  - GitHub Actions run id: `25420411267`
  - workflow: `Phase 1 Deployed Boundary E2E`
  - branch: `main`
  - explicit overrides used: `public_url=https://go.deli-berry.com`, `merchant_url=https://merchant-console-six.vercel.app`
- Result:
  - conclusion: `success`
  - job: `Deployed boundary E2E`
  - completed at: `2026-05-06T06:43:08Z`
  - run URL: `https://github.com/ahc0403-commits/deliberry/actions/runs/25420411267`
- Prior hosted evidence already recorded green authenticated customer, merchant, and admin fixture coverage in GitHub Actions. The remaining parity task here is not to invent a new harness, but to re-run the governed hosted smoke against the current redeployed aliases and attach fresh evidence.

## Refreshed Hosted Verdict

- Public anonymous routes: PASS
- Merchant anonymous login: PASS
- Deployed governed boundary workflow against current aliases: PASS
- Customer authenticated hosted smoke: refreshed through the green boundary workflow
- Merchant authenticated store-scoped hosted smoke: refreshed through the green boundary workflow
- Admin authenticated hosted smoke: refreshed through the green boundary workflow

Remaining release evidence gap after this refresh:
- physical target-device QA
