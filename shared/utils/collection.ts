export function uniqueValues<T>(items: readonly T[]): T[] {
  return Array.from(new Set(items));
}

export function groupByKey<T>(
  items: readonly T[],
  getKey: (item: T) => string,
): Record<string, T[]> {
  return items.reduce<Record<string, T[]>>((acc, item) => {
    const key = getKey(item);
    acc[key] = acc[key] ?? [];
    acc[key].push(item);
    return acc;
  }, {});
}
