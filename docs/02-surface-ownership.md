# Deliberry Surface Ownership

Status: active
Authority: binding
Surface: cross-surface
Domains: ownership, surfaces, feature-boundaries
Last updated: 2026-03-16
Last verified: 2026-03-16
Retrieve when:
- deciding where a feature or flow belongs
- checking whether a surface may own a route, UI, or runtime concern
Related files:
- docs/01-product-architecture.md
- docs/03-navigation-ia.md
- shared/docs/architecture-boundaries.md

## Purpose

This document defines exact ownership boundaries for every Deliberry surface. Future implementation work must use these boundaries to decide where code belongs.

## `customer-app`

### Owns

- auth
- onboarding
- home and discovery
- search and filtering
- store detail and menu browsing
- group order via room code and share flow
- cart
- checkout
- order list, order detail, and order status presentation
- reviews
- profile
- settings
- addresses
- notifications

### Must Never Own

- merchant operational tooling
- admin governance tooling
- public marketing or legal page composition
- real payment verification
- QR or map integrations from the exclusion list

## `merchant-console`

### Owns

- merchant login
- merchant onboarding
- store selection
- merchant dashboard
- order management
- menu management
- store management
- reviews and customer response
- coupons and promotions
- settlement visibility
- analytics
- merchant settings

### Must Never Own

- platform-wide permissions governance
- admin moderation flows
- customer ordering flows
- public marketing/legal content
- payment verification tooling

## `admin-console`

### Owns

- admin auth
- permissions
- platform dashboard
- user management
- merchant and store governance
- order operations oversight
- disputes
- customer service operations
- settlement oversight
- finance oversight
- marketing management
- announcements
- catalog and B2B management
- analytics and reporting
- system management

### Must Never Own

- merchant self-service page flows
- customer app experience
- public website content composition
- real payment verification logic
- merchant store-ops UI copied from merchant console

## `public-website`

### Owns

- landing page
- service introduction
- merchant onboarding pages
- customer support pages
- privacy policy
- terms
- refund and cancellation policy
- app download page

### Must Never Own

- authenticated merchant flows
- authenticated admin flows
- customer checkout or order flows
- dashboard features
- internal operations UI

## `shared`

### Owns

- contracts
- DTOs
- models
- enums and constants
- types
- validation schemas
- pure utilities
- architecture docs

### Must Never Own

- UI components
- router code
- app state
- runtime-specific orchestration
- customer-specific flows
- merchant-specific flows
- admin-specific flows
- public website composition

## Boundary Decisions

### Merchant vs Admin

Merchant owns store operations. Admin owns platform governance. They may share domain terms such as order, store, settlement, and promotion, but not route groups, shells, or workflow code.

### Customer vs Public

Customer app owns transactional and authenticated customer behavior. Public website owns acquisition, legal, and support content.

### Local Shared vs Repo Shared

Surface-local shared helpers may exist inside each surface. Repo-level `shared` remains contract-only.
