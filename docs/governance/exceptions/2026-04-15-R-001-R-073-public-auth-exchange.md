# Exception Record -- Public Customer Auth Exchange

Status: active
Authority: approved exception
Rule IDs: R-001, R-073
Created: 2026-04-15
Sunset review date: 2026-07-15
Owner: governance remediation track
Surface: public-website
Domains: auth, session, boundary-exception
Related files:
- docs/governance/CONSTITUTION.md
- docs/governance/STRUCTURE.md
- docs/08-auth-session-strategy.md
- public-website/src/app/customer-zalo-auth-exchange/route.ts

## Purpose

This record documents the temporary exception that allows `public-website` to host the customer Zalo auth exchange route at `/customer-zalo-auth-exchange`.

Without this record, the route conflicts with the normal public-surface rule that `public-website` must not own authenticated flows or console behavior.

## Approved Exception

`public-website` MAY host the customer Zalo auth exchange route as a stateless bridge endpoint only.

This exception is approved because the route currently serves as:

- provider redirect landing point
- stateless token exchange boundary
- normalized callback handoff back into `customer-app`

This route is not approved as a general-purpose customer runtime owner.

## What Is Allowed

- GET redirect handling for the Zalo callback
- POST token exchange needed to complete the provider flow
- Supabase identity resolution required to complete the exchange
- returning a normalized completion payload back to `customer-app`

## What Is Not Allowed

- no public-surface customer shell or authenticated route group
- no general customer session browsing, profile, orders, or mutation ownership
- no merchant or admin session behavior
- no reuse of this exception to justify other authenticated business routes in `public-website`
- no cross-surface session sharing

## Reason This Is Temporary

This route solves a specific callback and provider-redirect constraint, but it still creates a structural exception to the normal surface model.

The team must revisit whether this path should remain a governed exception or be relocated to a more explicit backend or customer-owned boundary.

## Sunset Review Questions

1. Does the provider flow still require a public redirect landing point?
2. Can the exchange be moved without breaking customer login continuity?
3. Has the route expanded beyond the narrow stateless bridge shape approved here?
4. Does any newer auth architecture make this exception obsolete?

## Rollback Position

If a relocation attempt causes auth instability, the rollback position is:

- keep the current route in `public-website`
- preserve only the currently approved stateless exchange scope
- continue to treat the route as a formal temporary exception until the next review

