# Public Legal Filemap

Status: Active
Authority: Operational
Surface: public-website
Domains: legal, privacy, terms, refund-policy
Last updated: 2026-03-16
Retrieve when:
- changing legal document copy or legal navigation
- debugging whether a legal change belongs in one document or the legal shell
- checking whether legal content is live in screens or only structurally represented in the repository
Related files:
- public-website/src/app/(legal)/layout.tsx
- public-website/src/app/(legal)/privacy/page.tsx
- public-website/src/app/(legal)/terms/page.tsx
- public-website/src/app/(legal)/refund-policy/page.tsx

## Purpose

Show the narrow file cluster for the public legal routes, the legal-only shell, and the three live legal documents.

## When To Retrieve This Filemap

- before changing privacy, terms, or refund-policy content
- before changing legal nav behavior or route framing
- when one legal page changes and cross-document consistency matters

## Entry Files

- `public-website/src/app/(legal)/layout.tsx`
- `public-website/src/app/(legal)/privacy/page.tsx`
- `public-website/src/app/(legal)/terms/page.tsx`
- `public-website/src/app/(legal)/refund-policy/page.tsx`

## Adjacent Files Usually Read Together

- `public-website/src/features/legal/presentation/privacy-screen.tsx`
- `public-website/src/features/legal/presentation/terms-screen.tsx`
- `public-website/src/features/legal/presentation/refund-policy-screen.tsx`
- `public-website/src/shared/data/content-service.ts`
- `public-website/src/shared/data/public-content-repository.ts`

## Source-of-Truth Files

- `public-website/src/features/legal/presentation/privacy-screen.tsx`
- `public-website/src/features/legal/presentation/terms-screen.tsx`
- `public-website/src/features/legal/presentation/refund-policy-screen.tsx`
- `public-website/src/app/(legal)/layout.tsx`

The live truth is split: document copy lives in the three legal screen files, while legal navigation and shell framing live in the legal layout.

## Files Often Mistaken as Source of Truth but Are Not

- `public-website/src/shared/data/content-service.ts`
- `public-website/src/shared/data/public-content-repository.ts`
- `public-website/src/shared/domain.ts`

These represent a structural content boundary, not the current live legal-document source.

## High-Risk Edit Points

- manual dates, contact emails, and policy terms in the three legal screens
- cross-links between refund policy and support/legal routes
- legal shell navigation in `public-website/src/app/(legal)/layout.tsx`

## Related Governance Docs

- `docs/02-surface-ownership.md`
- `docs/03-navigation-ia.md`
- `docs/05-implementation-phases.md`
- `docs/governance/STRUCTURE.md`
- `shared/docs/architecture-boundaries.md`

## Related Local Feature READMEs

- `public-website/src/features/legal/README.md`
- `public-website/src/features/support/README.md`

## Safe Edit Sequence

1. Identify whether the change belongs to one document or the legal shell.
2. Update the specific legal screen file that owns the live copy.
3. Update the legal layout only if navigation or shell framing must change.
4. Check the other legal documents for shared dates, emails, and terminology before finishing.
