# Customer Group Order Flow

Status: active
Authority: operational
Surface: customer-app
Domains: group-order, invite-preview, partial-support
Last updated: 2026-05-05
Last verified: 2026-05-05
Retrieve when:
- changing group-order preview behavior or invite-copy actions
- checking why the group-order flow is intentionally partial
Related files:
- customer-app/lib/features/group_order/presentation/group_order_screen.dart
- customer-app/lib/features/group_order/presentation/group_order_share_screen.dart
- docs/ui-governance/RUNTIME_REALITY_MAP.md

## Purpose

Document the current group-order flow honestly as a local room path, not a live shared-cart flow.

## Entry points

- direct route entry into `/group-order`
- create-room path into `/group-order/share`

## Main route sequence

- `/group-order` -> create local room -> `/group-order/share`
- `/group-order` -> join matching local room code -> `/group-order/share`
- `/group-order` -> join unknown code -> explicit local-only feedback

## Source-of-truth files involved

- [customer_runtime_controller.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/data/customer_runtime_controller.dart)
  - local room code and participant state
- [group_order_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/group_order/presentation/group_order_screen.dart)
  - local room creation and join entry behavior
- [group_order_share_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/group_order/presentation/group_order_share_screen.dart)
  - invite copy actions and local participant rendering

## Key dependent screens/files

- [group_order_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/group_order/presentation/group_order_screen.dart)
- [group_order_share_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/group_order/presentation/group_order_share_screen.dart)
- [customer_runtime_controller.dart](/Users/andremacmini/Deliberry/customer-app/lib/core/data/customer_runtime_controller.dart)
- [route_names.dart](/Users/andremacmini/Deliberry/customer-app/lib/app/router/route_names.dart)

## What is authoritative vs derived in this flow

- Authoritative:
  - route ownership
  - local room code and participant state in `CustomerRuntimeController`
  - copy-to-clipboard actions
- Derived:
  - route argument fallback for room code
  - participant labels derived from local profile/session identity
  - explanatory copy shown on both screens
- Not authoritative:
  - there is no cross-device shared room membership truth
  - there is no live shared-cart truth

## Known shallow / partial / local-only limits

- This flow is intentionally local-only.
- Join-room now works only for a room code created on the same device in the current runtime session.
- Share/invite behavior copies local-room text only.
- There is no participant sync across devices, no backend room persistence, and no group cart runtime.

## Common edit mistakes

- Treating the preview code as if it identifies a real backend room.
- Adding UI that implies live join or participant presence without introducing real runtime truth.
- Hiding the current limited-scope copy and making the flow look more complete than it is.

## Related filemaps

- [customer-runtime-filemap.md](/Users/andremacmini/Deliberry/docs/filemaps/customer-runtime-filemap.md)

## Related runtime-truth docs

- [customer-runtime-truth.md](/Users/andremacmini/Deliberry/docs/runtime-truth/customer-runtime-truth.md)

## Related governance docs

- [RUNTIME_REALITY_MAP.md](/Users/andremacmini/Deliberry/docs/ui-governance/RUNTIME_REALITY_MAP.md)
- [STABILIZATION_REPORT.md](/Users/andremacmini/Deliberry/docs/ui-governance/STABILIZATION_REPORT.md)
- [UI_GAP_AUDIT.md](/Users/andremacmini/Deliberry/docs/ui-governance/UI_GAP_AUDIT.md)
