# Payment Server-Side Credentials Plan -- 2026-05-04

Status: active
Authority: operational
Surface: customer-app, public-website, supabase, edge-functions, deployment
Domains: payment, credentials, vnpay, secrets, gate-4, deployment
Last updated: 2026-05-04
Last verified: 2026-05-04

## Purpose

This document fixes the required storage and runtime handling rules for VNPAY production credentials before Gate 4 may be closed.

It does not authorize live payment. It defines where production credentials may exist, where they must never exist, and how Deliberry must consume them.

## Source Of Truth

- `docs/06-guardrails.md`
- `docs/operations/payment-go-live-guardrail-record-2026-05-04.md`
- `docs/operations/payment-ipn-owned-state-transition-design-2026-05-04.md`
- `docs/operations/payment-event-persistence-design-2026-05-04.md`
- `docs/operations/production-definition-freeze-2026-04-28.md`
- `docs/operations/vnpay-sandbox-readiness.md`

## Current Safe Baseline

Current safe posture:

- customer runtime has only public Supabase values in [customer-app/.env.production](/Users/andremacmini/Deliberry/customer-app/.env.production)
- VNPAY sandbox secrets are used only from server-side Edge Function environments
- no client-side source file is allowed to embed VNPAY terminal or hash secret material

This baseline must remain true when production credentials are introduced.

## Required Production Credential Set

Production go-live requires these server-only values:

- `VNPAY_ENVIRONMENT=production`
- `VNPAY_TMN_CODE`
- `VNPAY_HASH_SECRET`
- `VNPAY_RETURN_URL`
- `VNPAY_IPN_ALLOWLIST` or equivalent source restriction input, if VNPAY-side source validation is added
- `VNPAY_PAYMENT_URL`, only if it must differ from the documented provider default

Optional but recommended:

- `VNPAY_PRODUCTION_ENABLED`
- `VNPAY_TERMINAL_LABEL`
- `VNPAY_EXPECTED_CURRENCY`

## Allowed Storage Locations

Production VNPAY credentials may exist only in server-side deployment secret stores, such as:

- Supabase Edge Function secrets
- an equivalent server-only deployment environment store attached to the payment-owning backend runtime

Allowed use:

- create production payment URLs
- validate Return URL checksum for display-only messaging
- validate IPN checksum
- resolve server-side provider configuration

## Forbidden Storage Locations

Production VNPAY credentials must never exist in:

- `customer-app/.env.production`
- any client-bundled `.env` file
- Flutter source code
- web client source code
- repo-tracked example files
- GitHub Actions logs or plaintext artifacts
- public legal or operational docs

The following must never be shipped to the client:

- `VNPAY_TMN_CODE`
- `VNPAY_HASH_SECRET`
- any equivalent provider signing secret

## Runtime Consumption Rule

The only approved runtime consumers of production VNPAY credentials are server-side payment handlers:

- payment URL creation handler
- Return URL checksum validator
- IPN handler

The customer app may call a server-side payment URL creator, but it must never read production credential values directly.

## Environment Separation Rule

Deliberry must keep sandbox and production credentials fully separate.

Required:

- production and sandbox values are stored under separate deployment environments
- production deployments do not reuse sandbox secrets
- sandbox deployments do not accidentally point at production provider endpoints
- environment flags make the active provider mode explicit

## Rotation Rule

Production VNPAY credentials must support rotation without source-code changes.

Required:

- credential values are read at runtime from deployment secrets
- there is a documented operator path for rotation
- rotation does not require a client release
- credential rotation does not require rewriting historical payment events

## Observability And Leak Prevention Rule

Production credentials must not leak through:

- client-visible JSON payloads
- logs
- screenshots
- CI artifacts
- crash messages

Allowed observability:

- terminal label or non-secret environment label
- provider environment name
- non-secret provider reference values

Forbidden observability:

- raw hash secret
- full credential blobs
- redacted-looking but still reconstructable secret forms

## Build And Deployment Rule

Before Gate 4 can be closed:

- production VNPAY credentials must be present only in the production server-side secret store
- sandbox credentials must remain isolated in sandbox/test environments
- deployment validation must confirm the payment-owning server runtime sees the production values
- deployment validation must also confirm no client bundle contains those values

## Verification Checklist

The credential plan is only satisfied when all of the following are true:

1. no tracked repo file contains production VNPAY secret values
2. no client runtime env file contains production VNPAY secret values
3. server-side payment handlers resolve the values from deployment secrets only
4. logs and artifacts do not print the values
5. sandbox and production environments are distinct
6. rotation can happen without a mobile or web client rebuild

## Relationship To Gate 4

This document supports the Gate 4 checklist item:

- `Production VNPAY credentials are stored server-side only.`

It does not close that item by itself. Closure still requires:

- actual production secret provisioning
- deployment verification
- no-client-leak verification

## What This Plan Does Not Approve

This plan does not approve:

- live payment verification by itself
- client-side payment completion
- Return URL completion
- refund or reversal automation
- any expansion of client credential access

It only fixes the required secret-storage boundary for future production payment work.
