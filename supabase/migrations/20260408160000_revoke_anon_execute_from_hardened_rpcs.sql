-- Revoke anon execute from hardened RPCs
-- Date: 2026-04-08
-- Addresses: Q5 from supabase-security-verification-queries-2026-04-08.md
-- Reason: REVOKE ALL FROM public does not affect the anon role in Supabase.
--         All 10 hardened functions require auth.uid() and should not be
--         callable by the anon role at all.

-- Customer RPCs (from migration 20260408113000)
revoke execute on function public.set_customer_default_address(text) from anon;
revoke execute on function public.delete_customer_address_with_default_ensure(text) from anon;
revoke execute on function public.upsert_customer_review_with_store_projection(text, integer, text, jsonb) from anon;
revoke execute on function public.create_customer_order(text, text, text, text, jsonb, text, timestamptz) from anon;

-- Merchant RPCs (from migration 20260408140000)
revoke execute on function public.assert_merchant_store_membership(text, text) from anon;
revoke execute on function public.get_merchant_dashboard_kpi_snapshot(text) from anon;
revoke execute on function public.update_order_status_with_audit(text, text, text) from anon;
revoke execute on function public.update_store_settings_with_audit(text, jsonb) from anon;
revoke execute on function public.update_store_profile_with_audit(text, text, text, text, text, text, text, text, boolean, jsonb) from anon;
revoke execute on function public.set_merchant_default_store(text) from anon;
