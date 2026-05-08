-- Revoke anon execute from idempotent order RPC signatures.
-- Date: 2026-04-28
-- Reason: migration 20260415173000 replaced customer order creation and
-- merchant order status update with idempotency-aware signatures. Supabase
-- still reports anon EXECUTE for those new signatures unless revoked
-- explicitly from the anon role.

revoke execute on function public.create_customer_order(
  text,
  text,
  text,
  text,
  jsonb,
  text,
  timestamptz,
  text
) from anon;

revoke execute on function public.update_order_status_with_audit(
  text,
  text,
  text,
  text
) from anon;
