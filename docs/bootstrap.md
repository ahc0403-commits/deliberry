# Deliberry Bootstrap

This repository keeps each surface independently bootstrapped. There is no workspace tooling or monorepo package orchestration at this stage.

## Surfaces

- `customer-app` uses Flutter.
- `merchant-console` uses Next.js App Router with TypeScript.
- `admin-console` uses Next.js App Router with TypeScript.
- `public-website` uses Next.js App Router with TypeScript.
- `shared` is documentation and cross-surface contracts only.

## Run

### Customer App

```bash
cd customer-app
flutter pub get
flutter run
```

### Merchant Console

```bash
cd merchant-console
npm install
npm run dev
```

### Admin Console

```bash
cd admin-console
npm install
npm run dev
```

Local Supabase seed credentials for admin smoke tests:

- Email: `admin@deliberry.local`
- Password: `admin1234`
- Role: `platform_admin`

### Public Website

```bash
cd public-website
npm install
npm run dev
```

## Notes

- The web surfaces are intentionally independent and do not use shared workspace tooling yet.
- The current setup is bootstrap-only: no business logic, API integration, or UI polish has been added.
- `shared/docs/architecture-boundaries.md` defines what may and may not live in `shared/`.
- Vercel linking is surface-local: run `vercel` from `customer-app/`, `merchant-console/`, `admin-console/`, or `public-website/` only.
- Do not rely on a repo-root `.vercel` link; each deployed surface should keep its own project link and tracing root.
- Settlement edge functions are intentionally gated. The linked Supabase project now has `delivery_settlements`, `delivery_settlement_items`, and `external_sales.settlement_id`, but `ENABLE_SETTLEMENT_RUNTIME` must still remain unset until the settlement rollout is explicitly approved.
