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

Deployment note:

- Run Vercel commands from the owning surface directory only.
- Keep one `.vercel` link per surface and avoid a repo-root `.vercel` link so deployments cannot collide across `customer-app`, `merchant-console`, `admin-console`, and `public-website`.
- Keep settlement edge functions disabled by default. Only set `ENABLE_SETTLEMENT_RUNTIME=true` after the settlement schema migration has been applied to the linked Supabase project and the rollout is explicitly approved.

More detailed bootstrap notes live in [docs/bootstrap.md](docs/bootstrap.md).

Customer app UX/UI governance lives in [docs/ui-governance/README.md](docs/ui-governance/README.md).
