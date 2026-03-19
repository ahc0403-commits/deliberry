export type MerchantSupabaseConfig = {
  url: string | null;
  anonKey: string | null;
  serviceRoleKey: string | null;
};

function readEnv(name: string): string | null {
  const value = process.env[name]?.trim();
  return value ? value : null;
}

export function readMerchantSupabaseConfig(): MerchantSupabaseConfig {
  return {
    url: readEnv("NEXT_PUBLIC_SUPABASE_URL"),
    anonKey: readEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    serviceRoleKey: readEnv("SUPABASE_SERVICE_ROLE_KEY"),
  };
}

export function isMerchantSupabaseConfigured(): boolean {
  const config = readMerchantSupabaseConfig();
  return Boolean(config.url && config.anonKey);
}

export function assertMerchantSupabaseConfig(): {
  url: string;
  anonKey: string;
  serviceRoleKey: string | null;
} {
  const config = readMerchantSupabaseConfig();
  if (!config.url || !config.anonKey) {
    throw new Error("Merchant Supabase config is missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  }

  return {
    url: config.url,
    anonKey: config.anonKey,
    serviceRoleKey: config.serviceRoleKey,
  };
}
