export type AdminSupabaseConfig = {
  url: string | null;
  anonKey: string | null;
  serviceRoleKey: string | null;
};

export type AdminAuthAvailability =
  | { available: true }
  | { available: false; reason: "missing_public_config" | "missing_service_role" };

function readEnv(name: string): string | null {
  const value = process.env[name]?.trim();
  return value ? value : null;
}

export function readAdminSupabaseConfig(): AdminSupabaseConfig {
  return {
    url: readEnv("NEXT_PUBLIC_SUPABASE_URL"),
    anonKey: readEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    serviceRoleKey: readEnv("SUPABASE_SERVICE_ROLE_KEY"),
  };
}

export function isAdminSupabaseConfigured(): boolean {
  const config = readAdminSupabaseConfig();
  return Boolean(config.url && config.serviceRoleKey);
}

export function isAdminSupabasePublicConfigured(): boolean {
  const config = readAdminSupabaseConfig();
  return Boolean(config.url && config.anonKey);
}

export function readAdminAuthAvailability(): AdminAuthAvailability {
  const config = readAdminSupabaseConfig();

  if (!config.url || !config.anonKey) {
    return { available: false, reason: "missing_public_config" };
  }

  if (!config.serviceRoleKey) {
    return { available: false, reason: "missing_service_role" };
  }

  return { available: true };
}

export function assertAdminSupabaseConfig(): {
  url: string;
  anonKey: string | null;
  serviceRoleKey: string;
} {
  const config = readAdminSupabaseConfig();
  if (!config.url || !config.serviceRoleKey) {
    throw new Error(
      "Admin Supabase config is missing. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  return {
    url: config.url,
    anonKey: config.anonKey,
    serviceRoleKey: config.serviceRoleKey,
  };
}

export function assertAdminSupabasePublicConfig(): {
  url: string;
  anonKey: string;
} {
  const config = readAdminSupabaseConfig();
  if (!config.url || !config.anonKey) {
    throw new Error(
      "Admin Supabase public config is missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }

  return {
    url: config.url,
    anonKey: config.anonKey,
  };
}
