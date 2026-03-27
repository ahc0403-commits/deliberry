import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { assertAdminSupabaseConfig } from "./config";

export function createAdminServiceSupabaseClient(): SupabaseClient {
  const config = assertAdminSupabaseConfig();

  return createClient(config.url, config.serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
