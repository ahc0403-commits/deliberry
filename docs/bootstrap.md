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
