import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  assertAdminSupabaseConfig,
  assertAdminSupabasePublicConfig,
} from "./config";

export function createAdminServiceSupabaseClient(): SupabaseClient {
  const config = assertAdminSupabaseConfig();

  return createClient(config.url, config.serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export function createAdminPublicSupabaseClient(): SupabaseClient {
  const config = assertAdminSupabasePublicConfig();

  return createClient(config.url, config.anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
