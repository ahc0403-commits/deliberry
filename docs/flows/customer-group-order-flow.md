# Customer Group Order Flow

Status: active
Authority: operational
Surface: customer-app
Domains: group-order, invite-preview, partial-support
Last updated: 2026-03-16
Last verified: 2026-03-16
Retrieve when:
- changing group-order preview behavior or invite-copy actions
- checking why the group-order flow is intentionally partial
Related files:
- customer-app/lib/features/group_order/presentation/group_order_screen.dart
- customer-app/lib/features/group_order/presentation/group_order_share_screen.dart
- docs/ui-governance/RUNTIME_REALITY_MAP.md

## Purpose

Document the current group-order flow honestly as a local preview path, not a live shared-cart flow.

## Entry points

- direct route entry into `/group-order`
- create-preview path into `/group-order/share`

## Main route sequence

- `/group-order` -> `/group-order/share`
- `/group-order` -> join-room attempt -> explicit unavailable feedback

## Source-of-truth files involved

- [app_router.dart](/Users/andremacmini/Deliberry/customer-app/lib/app/router/app_router.dart)
  - route ownership and route argument threading for preview code
- [group_order_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/group_order/presentation/group_order_screen.dart)
  - preview-code generation and host/join entry behavior
- [group_order_share_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/group_order/presentation/group_order_share_screen.dart)
  - preview invite copy actions

## Key dependent screens/files

- [group_order_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/group_order/presentation/group_order_screen.dart)
- [group_order_share_screen.dart](/Users/andremacmini/Deliberry/customer-app/lib/features/group_order/presentation/group_order_share_screen.dart)
- [route_names.dart](/Users/andremacmini/Deliberry/customer-app/lib/app/router/route_names.dart)

## What is authoritative vs derived in this flow

- Authoritative:
  - route ownership
  - preview code passed in route arguments
  - copy-to-clipboard actions
- Derived:
  - generated preview code value
  - preview participant labels
  - explanatory copy shown on both screens
- Not authoritative:
  - there is no shared room membership truth
  - there is no live shared-cart truth

## Known shallow / partial / local-only limits

- This flow is intentionally local-only.
- Join-room is explicitly unavailable.
- Share/invite behavior copies preview text only.
- There is no participant sync, live room state, or group cart runtime.

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
