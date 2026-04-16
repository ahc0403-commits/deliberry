# Customer Address Truth

Status: active
Authority: operational
Surface: customer-app
Domains: addresses, delivery-address, checkout-context
Last updated: 2026-04-15
Last verified: 2026-04-15
Retrieve when:
- changing address add/edit/delete/default behavior
- debugging why checkout or order records show the wrong delivery address
Related files:
- customer-app/lib/core/data/customer_runtime_controller.dart
- customer-app/lib/features/addresses/presentation/addresses_screen.dart
- customer-app/lib/features/checkout/README.md

## Purpose

Document where delivery-address truth lives and how signed-in address behavior now bridges runtime state with persisted customer address storage.

## Real source-of-truth location(s)

- Authoritative runtime owner: [customer_runtime_controller.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/data/customer_runtime_controller.dart)
  - `_addresses`
  - `addAddress`
  - `updateAddress`
  - `deleteAddress`
  - `setDefaultAddress`
- Persisted signed-in gateway: [supabase_customer_runtime_gateway.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/data/supabase_customer_runtime_gateway.dart)
  - `readAddresses`
  - `saveAddress`
  - `deleteAddress`
  - `setDefaultAddress`
- Presentation/editor: [addresses_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/addresses/presentation/addresses_screen.dart)

## What state is owned there

- current runtime address list used by the UI
- signed-in persisted customer addresses in Supabase
- default-address selection and repair behavior
- runtime-generated ids for newly added local fallback addresses

## What screens depend on it

- [addresses_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/addresses/presentation/addresses_screen.dart)
- [checkout_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/checkout/presentation/checkout_screen.dart)
- order creation in [customer_runtime_controller.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/data/customer_runtime_controller.dart)
- order record display paths that render the captured address from the submitted record

## What is derived vs authoritative

- Authoritative:
  - `_addresses`
  - address mutation methods in `CustomerRuntimeController`
  - signed-in address persistence in `SupabaseCustomerRuntimeGateway`
- Derived:
  - `addresses`
  - `deliveryAddress`
- Seed-only, not authoritative after runtime starts:
  - [mock_data.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/data/mock_data.dart) address fixtures

## What is still shallow / partial / local-only

- Signed-in users get backend persistence through Supabase-backed address reads and writes.
- Signed-out fallback behavior is still runtime-local.
- There is still no geocoding or address normalization.
- Validation remains minimal and form-driven in the UI layer.

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
- Preserve the rule that runtime state stays the single UI owner even when signed-in writes are synchronized to Supabase.

## Related filemaps

- [customer-runtime-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/customer-runtime-filemap.md)
- [customer-checkout-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/customer-checkout-filemap.md)

## Related governance docs

- [RUNTIME_REALITY_MAP.md](/Users/andremacmini/Deliberry/docs/ui-governance/RUNTIME_REALITY_MAP.md)
- [STABILIZATION_REPORT.md](/Users/andremacmini/Deliberry/docs/ui-governance/STABILIZATION_REPORT.md)
- [STATE_MODELING_RULES.md](/Users/andremacmini/Deliberry/docs/ui-governance/STATE_MODELING_RULES.md)
