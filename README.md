# Deliberry

Deliberry is split into five repository-level surfaces:

- `customer-app` - Flutter customer application
- `merchant-console` - Next.js merchant operations console
- `admin-console` - Next.js platform administration console
- `public-website` - Next.js marketing, support, and legal website
- `shared` - cross-surface contracts, models, enums, types, docs, and pure utilities

Current scope:

- Route and feature skeletons are in place.
- Bootstrap manifests/configs are intentionally minimal.
- Business features, data fetching, payment verification, QR/map integrations, and realtime tracking are not implemented.

Quick start:

- Customer app: `cd customer-app && flutter pub get && flutter run`
- Merchant console: `cd merchant-console && npm install && npm run dev`
- Admin console: `cd admin-console && npm install && npm run dev`
- Public website: `cd public-website && npm install && npm run dev`

More detailed bootstrap notes live in [docs/bootstrap.md](docs/bootstrap.md).

Customer app UX/UI governance lives in [docs/ui-governance/README.md](docs/ui-governance/README.md).
