export function normalizeEntityId(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, "-");
}

export function joinScopedId(scope: string, id: string): string {
  return `${normalizeEntityId(scope)}:${normalizeEntityId(id)}`;
}
