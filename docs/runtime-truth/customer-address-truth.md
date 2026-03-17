# Customer Address Truth

Status: active
Authority: operational
Surface: customer-app
Domains: addresses, delivery-address, checkout-context
Last updated: 2026-03-16
Last verified: 2026-03-16
Retrieve when:
- changing address add/edit/delete/default behavior
- debugging why checkout or order records show the wrong delivery address
Related files:
- customer-app/lib/core/data/customer_runtime_controller.dart
- customer-app/lib/features/addresses/presentation/addresses_screen.dart
- customer-app/lib/features/checkout/README.md

## Purpose

Document where delivery-address truth lives and where address behavior is still only local-session support.

## Real source-of-truth location(s)

- Authoritative mutable owner: [customer_runtime_controller.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/data/customer_runtime_controller.dart)
  - `_addresses`
  - `_nextAddressId`
- Presentation/editor: [addresses_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/addresses/presentation/addresses_screen.dart)

## What state is owned there

- saved addresses for the current session
- default-address selection
- runtime-generated ids for newly added addresses

## What screens depend on it

- [addresses_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/addresses/presentation/addresses_screen.dart)
- [checkout_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/checkout/presentation/checkout_screen.dart)
- order creation in [customer_runtime_controller.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/data/customer_runtime_controller.dart)
- order record display paths that render the captured address from the submitted record

## What is derived vs authoritative

- Authoritative:
  - `_addresses`
  - address mutation methods:
    - `addAddress`
    - `updateAddress`
    - `deleteAddress`
    - `setDefaultAddress`
- Derived:
  - `addresses`
  - `deliveryAddress`
- Seed-only, not authoritative after runtime starts:
  - [mock_data.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/data/mock_data.dart) address fixtures

## What is still shallow / partial / local-only

- Addresses are durable only within the running surface session.
- No disk persistence, backend persistence, geocoding, or address normalization exists.
- Validation is minimal and form-driven in the UI layer.

## Known risks

- Deleting the default address promotes the first remaining address to default; this behavior is implicit and easy to overlook.
- `_seedOrders()` uses the runtime address list on startup, so changing address seeding affects initial order records.
- Home and other screens can drift if they bypass `deliveryAddress` and read fixtures directly.

## Safe modification guidance

- Change address mutation logic in [customer_runtime_controller.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/data/customer_runtime_controller.dart) first.
- Then verify:
  - addresses list UI
  - checkout delivery card
  - order submission path
- Preserve the rule that address fixtures seed runtime state once, then runtime owns it.

## Related filemaps

- [customer-runtime-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/customer-runtime-filemap.md)
- [customer-checkout-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/customer-checkout-filemap.md)

## Related governance docs

- [RUNTIME_REALITY_MAP.md](/Users/andremacmini/Deliberry/docs/ui-governance/RUNTIME_REALITY_MAP.md)
- [STABILIZATION_REPORT.md](/Users/andremacmini/Deliberry/docs/ui-governance/STABILIZATION_REPORT.md)
- [STATE_MODELING_RULES.md](/Users/andremacmini/Deliberry/docs/ui-governance/STATE_MODELING_RULES.md)
