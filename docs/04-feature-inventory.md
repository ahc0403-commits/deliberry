# Deliberry Feature Inventory

Status: active
Authority: binding
Surface: cross-surface
Domains: feature-scope, planning, ownership
Last updated: 2026-03-16
Last verified: 2026-03-16
Retrieve when:
- checking whether a feature is in approved scope
- validating that implementation work is not dropping required product areas
Related files:
- docs/02-surface-ownership.md
- docs/05-implementation-phases.md
- docs/07-post-phase-roadmap.md

## Purpose

This document defines the full-version feature inventory for the rebuild. It is the reference list for future implementation planning.

## Customer App

- auth
- onboarding
- home
- discovery
- search
- filter
- store detail
- menu browsing
- group order via room code
- group order share flow
- cart
- checkout
- order list
- order detail
- order status presentation
- reviews
- profile
- settings
- addresses
- notifications

## Merchant Console

- login
- store selection
- onboarding
- dashboard
- order management
- menu management
- store management
- reviews
- customer response
- coupons
- promotions
- settlement
- analytics
- settings

## Admin Console

- admin auth
- permissions
- platform dashboard
- user management
- merchant management
- store management
- order oversight
- dispute management
- customer service
- settlement oversight
- finance oversight
- marketing
- announcements
- catalog
- B2B
- analytics
- reporting
- system management

## Public Website

- landing page
- service introduction
- merchant onboarding pages
- customer support
- privacy policy
- terms
- refund and cancellation policy
- app download page

## Placeholder-Only Features

- checkout payment method selection
- card payment option placeholder
- alternate pay method placeholder
- finance and settlement payment-state surfaces that must stay non-verifying

## Excluded Features

- payment verification
- map API address autocomplete
- QR generation library
- QR scanner camera integration
- real-time order tracking

## Inventory Rules

1. Placeholder-only features may keep surface-level UI structure without real backend completion logic.
2. Excluded features must not be partially implemented.
3. Missing items from this document should be treated as out of scope until explicitly added.
4. Old implementation may be checked for parity, but this document is the source of truth for future work.
