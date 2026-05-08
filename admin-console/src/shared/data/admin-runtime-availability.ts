export type AdminRuntimeResult<T> =
  | { available: true; data: T }
  | { available: false; error: Error };

const ADMIN_RUNTIME_UNAVAILABLE_PATTERNS = [
  /fetch failed/i,
  /failed to fetch/i,
  /networkerror/i,
  /econnrefused/i,
  /admin supabase .*missing/i,
];

function normalizeError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }

  return new Error(typeof error === "string" ? error : "Unknown admin runtime error");
}

export function isAdminRuntimeUnavailableError(error: unknown): boolean {
  const normalized = normalizeError(error);
  return ADMIN_RUNTIME_UNAVAILABLE_PATTERNS.some((pattern) => pattern.test(normalized.message));
}

export async function readAdminRuntimeSafely<T>(
  read: () => Promise<T>,
): Promise<AdminRuntimeResult<T>> {
  try {
    return {
      available: true,
      data: await read(),
    };
  } catch (error) {
    if (isAdminRuntimeUnavailableError(error)) {
      return {
        available: false,
        error: normalizeError(error),
      };
    }

    throw error;
  }
}
