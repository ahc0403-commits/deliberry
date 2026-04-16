# Audit Mutation Inventory -- 2026-04

Status: Active
Owner: governance remediation track
Last updated: 2026-04-15
Related plan:
- `docs/governance/AUDIT_REMEDIATION_PLAN_2026-04.md`
- `docs/governance/AUDIT_REMEDIATION_CHECKLIST_2026-04.md`

## Purpose

Tracks the current governed mutation inventory for constitutional audit coverage. This document is operational rather than normative: it records which mutation paths are presently hardened, audited, both, or still missing.

## Status Labels

- `audited and hardened`: runtime path derives actor identity from trusted context and writes an immutable audit record
- `hardened but not audited`: runtime path derives actor identity from trusted context but does not yet write an audit record
- `neither`: no governed runtime mutation path is currently implemented or the known path does not yet satisfy hardening plus audit expectations

## Inventory

| Resource | Mutation path | Current status | Evidence |
| --- | --- | --- | --- |
| Order | `public.create_customer_order` | audited and hardened | `supabase/migrations/20260408113000_customer_security_boundary_hardening.sql` |
| Order | `public.update_order_status_with_audit` | audited and hardened | `supabase/migrations/20260408140000_merchant_admin_security_hardening.sql` |
| Payment | No governed payment verification or completion mutation implemented by design | neither | `docs/06-guardrails.md`, `docs/governance/CURRENCY_POLICY_CLARIFICATION_2026-04.md` |
| Settlement | No governed settlement mutation implemented in runtime code or migrations reviewed in this audit tranche | neither | audit search on `supabase/migrations`, `admin-console/src`, `merchant-console/src` |
| User | Customer settings/profile preference persistence exists, but no governed audit write path is yet attached | hardened but not audited | `customer-app/lib/core/data/supabase_customer_runtime_gateway.dart` |
| Merchant | No standalone governed merchant mutation path was confirmed outside store-scoped runtime flows | neither | audit search on `merchant-console/src`, `supabase/migrations` |
| Store | `public.update_store_settings_with_audit` | audited and hardened | `supabase/migrations/20260408140000_merchant_admin_security_hardening.sql` |
| Store | `public.update_store_profile_with_audit` | audited and hardened | `supabase/migrations/20260408140000_merchant_admin_security_hardening.sql` |
| Dispute | No governed dispute mutation path confirmed in current runtime implementation | neither | audit search on `admin-console/src`, `supabase/migrations` |
| SupportTicket | No governed support-ticket mutation path confirmed in current runtime implementation | neither | audit search on `admin-console/src`, `supabase/migrations` |

## Notes

- This inventory intentionally separates runtime reality from future governance intent. A `neither` row is not an approval; it is a gap marker.
- `admin-console` now has a supported read-only audit visibility path through the system-management route, but that does not by itself satisfy mutation coverage for resources that still lack audited writes.
- Merchant audited mutations continue to use `actor_type = 'merchant_owner'` or `actor_type = 'merchant_staff'`, which remains compatible with the reconciled identity model because the generic `admin` decision only applies to admin actors.
