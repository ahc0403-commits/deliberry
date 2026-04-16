# Runtime Truth Documentation Audit -- 2026-04-16

> **Classification: Supporting Operational Artifact** -- This is NOT a canonical governance document.
> This file records a focused re-audit of runtime-truth documentation against currently verified customer runtime behavior.

Status: resolved in docs
Authority: operational (supporting artifact)
Surface: customer-app
Domains: runtime-truth, documentation-drift, reviews
Last updated: 2026-04-16
Last verified: 2026-04-16
Retrieve when:
- reconciling customer order and review runtime-truth docs against live persisted behavior
- validating whether the April documentation reconciliation fully closed customer runtime drift
- deciding whether a runtime-truth document can still be treated as authoritative
Related files:
- docs/runtime-truth/customer-orders-truth.md
- docs/governance/AUDIT_REOPENED_FINDINGS_2026-04.md
- customer-app/lib/core/data/customer_runtime_controller.dart
- customer-app/lib/core/data/supabase_customer_runtime_gateway.dart
- supabase/migrations/20260408113000_customer_security_boundary_hardening.sql

## Purpose

This report isolates a remaining runtime-truth documentation error discovered after the broader April reconciliation work.

It exists because runtime-truth documents are supposed to describe current runtime behavior, and this one still understates a live persisted review path.

## Audit Verdict

Verdict: fail
Severity: medium
Finding ID: RT-2026-04-16-01

`docs/runtime-truth/customer-orders-truth.md` still says review save is local preview only, but the live runtime persists customer review writes.

## Claimed Runtime Truth

The current document states that reviews read order identity coherently, but review save remains local preview behavior only.

Evidence:

- [customer-orders-truth.md](/Users/andremacmini/Deliberry/docs/runtime-truth/customer-orders-truth.md:47)

## Implementation Evidence

### Controller path

Customer runtime controller forwards review submission into the gateway-backed runtime path.

Evidence:

- [customer_runtime_controller.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/data/customer_runtime_controller.dart:295)
- [customer_runtime_controller.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/data/customer_runtime_controller.dart:303)

### Gateway path

The Supabase gateway persists the review through a hardened RPC.

Evidence:

- [supabase_customer_runtime_gateway.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/data/supabase_customer_runtime_gateway.dart:263)
- [supabase_customer_runtime_gateway.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/data/supabase_customer_runtime_gateway.dart:282)

### Database path

The hardened RPC exists in the live migration set.

Evidence:

- [20260408113000_customer_security_boundary_hardening.sql](/Users/andremacmini/Deliberry/supabase/migrations/20260408113000_customer_security_boundary_hardening.sql:215)

## Impact

- A runtime-truth document is currently less accurate than the code path it is meant to explain.
- Future audits may incorrectly believe customer review writes are still preview-only.
- Review persistence work that is already live can be overlooked during debugging, security review, or data-model validation.
- The April documentation reconciliation cannot be treated as fully complete while this contradiction remains.

## Remediation

Update `docs/runtime-truth/customer-orders-truth.md` so it says:

- review submission persists through the Supabase-backed runtime path when the required order context is present
- only the missing-context or unsupported fallback experience remains preview-like

If any feature README or flow document still mirrors the old preview-only claim, reconcile those at the same time.

## Acceptance Criteria

- `customer-orders-truth.md` accurately describes persisted review save.
- wording distinguishes persisted runtime behavior from any preview or fallback-only screen state.
- the updated runtime-truth document references the actual controller, gateway, and RPC owner path.

## Current Conclusion

This finding is resolved in docs.

Resolution evidence:

- `docs/runtime-truth/customer-orders-truth.md`

The runtime-truth document now describes persisted review submission accurately and limits preview-only language to the no-context fallback path.
