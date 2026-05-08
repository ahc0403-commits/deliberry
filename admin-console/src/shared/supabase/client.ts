import "server-only";

import { cookies } from "next/headers";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  assertAdminSupabaseConfig,
  assertAdminSupabasePublicConfig,
} from "./config";

const ADMIN_SUPABASE_SESSION_KEY = "admin_supabase_session";

type AuthStorage = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
};

async function createAdminCookieStorage(): Promise<AuthStorage> {
  const store = await cookies();

  return {
    getItem(key: string) {
      return store.get(key)?.value ?? null;
    },
    setItem(key: string, value: string) {
      try {
        store.set(key, value, {
          httpOnly: true,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          path: "/",
        });
      } catch {
        // Server-component reads may invoke auth helpers in a read-only cookie context.
        // Ignore attempted persistence there and let server actions own real cookie mutation.
      }
    },
    removeItem(key: string) {
      try {
        store.delete(key);
      } catch {
        // See setItem above: read-only render paths must not crash on auth storage cleanup.
      }
    },
  };
}

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

export async function createAdminServerSupabaseClient(): Promise<SupabaseClient> {
  const config = assertAdminSupabasePublicConfig();
  const storage = await createAdminCookieStorage();

  return createClient(config.url, config.anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: false,
      storage,
      storageKey: ADMIN_SUPABASE_SESSION_KEY,
    },
  });
}
