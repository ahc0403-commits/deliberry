# Retrieval Entry: Public

Status: Active
Authority: Operational
Surface: public-website
Domains: retrieval, public-website, landing, service, merchant, legal, support
Last updated: 2026-03-17
Retrieve when:
- starting public-website route, content, or shell work
- determining whether a live public route is owned by screen code, layout code, or only by structural content boundaries
Related files:
- docs/rag-architecture/RAG_ACTIVE_INDEX.md
- docs/runtime-truth/public-landing-truth.md
- docs/runtime-truth/public-service-truth.md
- docs/runtime-truth/public-merchant-truth.md
- docs/runtime-truth/public-legal-truth.md
- docs/runtime-truth/public-support-truth.md

## Surface Purpose

Public marketing and legal surface for landing, service explanation, merchant acquisition, customer handoff, legal policy routes, and static support/help content.

## Start Here First

1. [docs/rag-architecture/RAG_ACTIVE_INDEX.md](/Users/andremacmini/Deliberry/docs/rag-architecture/RAG_ACTIVE_INDEX.md)
2. [docs/02-surface-ownership.md](/Users/andremacmini/Deliberry/docs/02-surface-ownership.md)
3. [docs/03-navigation-ia.md](/Users/andremacmini/Deliberry/docs/03-navigation-ia.md)
4. Relevant public runtime-truth doc for the route cluster you are touching

## Binding Authority Docs

- [docs/governance/CONSTITUTION.md](/Users/andremacmini/Deliberry/docs/governance/CONSTITUTION.md)
- [docs/governance/STRUCTURE.md](/Users/andremacmini/Deliberry/docs/governance/STRUCTURE.md)
- [docs/governance/FLOW.md](/Users/andremacmini/Deliberry/docs/governance/FLOW.md)
- [docs/02-surface-ownership.md](/Users/andremacmini/Deliberry/docs/02-surface-ownership.md)
- [docs/03-navigation-ia.md](/Users/andremacmini/Deliberry/docs/03-navigation-ia.md)

## Runtime-Truth Docs to Read Next

- [docs/runtime-truth/public-landing-truth.md](/Users/andremacmini/Deliberry/docs/runtime-truth/public-landing-truth.md)
- [docs/runtime-truth/public-service-truth.md](/Users/andremacmini/Deliberry/docs/runtime-truth/public-service-truth.md)
- [docs/runtime-truth/public-merchant-truth.md](/Users/andremacmini/Deliberry/docs/runtime-truth/public-merchant-truth.md)
- [docs/runtime-truth/public-app-download-truth.md](/Users/andremacmini/Deliberry/docs/runtime-truth/public-app-download-truth.md)
- [docs/runtime-truth/public-legal-truth.md](/Users/andremacmini/Deliberry/docs/runtime-truth/public-legal-truth.md)
- [docs/runtime-truth/public-support-truth.md](/Users/andremacmini/Deliberry/docs/runtime-truth/public-support-truth.md)

## Filemaps to Read Next

- [docs/filemaps/public-landing-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/public-landing-filemap.md)
- [docs/filemaps/public-service-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/public-service-filemap.md)
- [docs/filemaps/public-merchant-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/public-merchant-filemap.md)
- [docs/filemaps/public-app-download-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/public-app-download-filemap.md)
- [docs/filemaps/public-legal-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/public-legal-filemap.md)
- [docs/filemaps/public-support-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/public-support-filemap.md)

## Local Feature READMEs to Read Next

- [public-website/src/features/landing/README.md](/Users/andremacmini/Deliberry/public-website/src/features/landing/README.md)
- [public-website/src/features/service-introduction/README.md](/Users/andremacmini/Deliberry/public-website/src/features/service-introduction/README.md)
- [public-website/src/features/merchant-onboarding/README.md](/Users/andremacmini/Deliberry/public-website/src/features/merchant-onboarding/README.md)
- [public-website/src/features/app-download/README.md](/Users/andremacmini/Deliberry/public-website/src/features/app-download/README.md)
- [public-website/src/features/legal/README.md](/Users/andremacmini/Deliberry/public-website/src/features/legal/README.md)
- [public-website/src/features/support/README.md](/Users/andremacmini/Deliberry/public-website/src/features/support/README.md)

## Flow Docs to Read Next

- [docs/flows/public-landing-to-download-flow.md](/Users/andremacmini/Deliberry/docs/flows/public-landing-to-download-flow.md)
- [docs/flows/public-service-flow.md](/Users/andremacmini/Deliberry/docs/flows/public-service-flow.md)
- [docs/flows/public-merchant-flow.md](/Users/andremacmini/Deliberry/docs/flows/public-merchant-flow.md)
- [docs/flows/public-legal-flow.md](/Users/andremacmini/Deliberry/docs/flows/public-legal-flow.md)
- [docs/flows/public-support-flow.md](/Users/andremacmini/Deliberry/docs/flows/public-support-flow.md)

## Common Task Categories

- Landing-page and download-page content changes
- Service-page content changes
- Merchant-acquisition page content changes
- Legal content changes
- Support-page content changes
- Marketing-shell navigation/footer changes

## Common Traps and False Source-of-Truth Locations

- Do not assume [public-website/src/shared/data/content-service.ts](/Users/andremacmini/Deliberry/public-website/src/shared/data/content-service.ts) controls the live public routes. For current landing, download, legal, and support flows, it does not.
- Do not assume the landing docs fully cover `/service` or `/merchant`. Both are live route clusters with their own screen owners and now have their own retrieval docs.
- Do not edit `features/support/` and expect `/support` to change without checking the route import. The live implementation is in `features/customer-support/`.
- Do not treat static presentation routes as if they already have backend content management or dynamic integrations.
- Do not use public review-era notes as primary truth when runtime-truth docs already exist.

## Fast Retrieval Sequence Examples

- Landing or download content change:
  - relevant runtime-truth doc -> relevant filemap -> feature README -> route screen
- Service route change:
  - [docs/runtime-truth/public-service-truth.md](/Users/andremacmini/Deliberry/docs/runtime-truth/public-service-truth.md) -> [docs/filemaps/public-service-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/public-service-filemap.md) -> [public-website/src/features/service-introduction/README.md](/Users/andremacmini/Deliberry/public-website/src/features/service-introduction/README.md)
- Merchant route change:
  - [docs/runtime-truth/public-merchant-truth.md](/Users/andremacmini/Deliberry/docs/runtime-truth/public-merchant-truth.md) -> [docs/filemaps/public-merchant-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/public-merchant-filemap.md) -> [public-website/src/features/merchant-onboarding/README.md](/Users/andremacmini/Deliberry/public-website/src/features/merchant-onboarding/README.md)
- Legal copy change:
  - [docs/runtime-truth/public-legal-truth.md](/Users/andremacmini/Deliberry/docs/runtime-truth/public-legal-truth.md) -> [docs/filemaps/public-legal-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/public-legal-filemap.md) -> [public-website/src/features/legal/README.md](/Users/andremacmini/Deliberry/public-website/src/features/legal/README.md)
- Support route change:
  - [docs/runtime-truth/public-support-truth.md](/Users/andremacmini/Deliberry/docs/runtime-truth/public-support-truth.md) -> [docs/filemaps/public-support-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/public-support-filemap.md) -> [public-website/src/features/support/README.md](/Users/andremacmini/Deliberry/public-website/src/features/support/README.md)
