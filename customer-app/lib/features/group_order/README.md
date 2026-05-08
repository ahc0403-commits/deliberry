# Customer Group Order

Status: Active
Authority: Operational
Surface: customer-app
Domains: group-order, invite-preview, partial-support
Last updated: 2026-05-05
Retrieve when:
- editing the group-order preview flow
- checking whether invite, join, or share behavior is real or intentionally partial
Related files:
- customer-app/lib/features/group_order/presentation/group_order_screen.dart
- customer-app/lib/features/group_order/presentation/group_order_share_screen.dart
- customer-app/lib/app/router/app_router.dart

## Purpose

Owns the customer group-order preview flow.

## Primary Routes and Screens

- `/group-order` -> `group_order_screen.dart`
- `/group-order/share` -> `group_order_share_screen.dart`

## Source of Truth

- Route ownership and route argument threading live in `customer-app/lib/app/router/app_router.dart`
- Local room code and participant state live in `customer-app/lib/core/data/customer_runtime_controller.dart`
- Host/join UI live in `group_order_screen.dart`
- Invite/share display and copy actions live in `group_order_share_screen.dart`

## Key Files to Read First

- `customer-app/lib/features/group_order/presentation/group_order_screen.dart`
- `customer-app/lib/features/group_order/presentation/group_order_share_screen.dart`
- `customer-app/lib/app/router/app_router.dart`
- `customer-app/lib/app/router/route_names.dart`

## Related Shared Widgets and Patterns

- `customer-app/lib/features/common/presentation/widgets.dart`

## Related Governance Docs

- `docs/flows/customer-group-order-flow.md`
- `docs/ui-governance/RUNTIME_REALITY_MAP.md`
- `docs/ui-governance/STABILIZATION_REPORT.md`

## Known Limitations

- This is a local room flow only.
- Join-room works only for a room created on the same device in the current runtime session.
- Invite/share actions copy local-room text only.
- There is no cross-device room state or shared-cart truth.

## Safe Modification Guidance

- Keep honesty and limited-scope copy intact unless real cross-device runtime support exists.
- Change preview route behavior in `app_router.dart`.
- Change preview UI and copy actions in the two screen files.

## What Not to Change Casually

- Do not make the local room code look like a real backend room id.
- Do not imply cross-device join or participant sync without runtime support.
- Do not hide the current partial-support state behind polished but deceptive UI.
