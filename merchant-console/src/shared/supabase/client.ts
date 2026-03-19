import { createBrowserClient, createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { assertMerchantSupabaseConfig } from "./config";

type CookieShape = {
  name: string;
  value: string;
  options?: CookieOptions;
};

export function createMerchantBrowserSupabaseClient(): SupabaseClient {
  const config = assertMerchantSupabaseConfig();
  return createBrowserClient(config.url, config.anonKey);
}

export function createMerchantServiceSupabaseClient(): SupabaseClient {
  const config = assertMerchantSupabaseConfig();
  if (!config.serviceRoleKey) {
    throw new Error("Merchant Supabase service role key is missing.");
  }

  return createClient(config.url, config.serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export async function createMerchantServerSupabaseClient(): Promise<SupabaseClient> {
  const config = assertMerchantSupabaseConfig();
  const cookieStore = await cookies();

  return createServerClient(config.url, config.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(values: CookieShape[]) {
        try {
          values.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server components may expose a read-only cookie store. Phase 2B
          // only needs session reads here, so refresh writes can be deferred.
        }
      },
    },
  });
}
