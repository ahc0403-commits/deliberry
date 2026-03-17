# Customer Group Order

Status: Active
Authority: Operational
Surface: customer-app
Domains: group-order, invite-preview, partial-support
Last updated: 2026-03-17
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

- Route ownership and preview-code threading live in `customer-app/lib/app/router/app_router.dart`
- Preview-code generation and host/join UI live in `group_order_screen.dart`
- Invite-preview display and copy actions live in `group_order_share_screen.dart`

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

- This is a local preview flow only.
- Join-room is intentionally unavailable.
- Invite/share actions copy preview text only.
- There is no shared room state or shared-cart truth.

## Safe Modification Guidance

- Keep honesty and limited-scope copy intact unless real runtime support exists.
- Change preview route behavior in `app_router.dart`.
- Change preview UI and copy actions in the two screen files.

## What Not to Change Casually

- Do not make the preview code look like a real backend room id.
- Do not imply live join or participant sync without runtime support.
- Do not hide the current partial-support state behind polished but deceptive UI.
