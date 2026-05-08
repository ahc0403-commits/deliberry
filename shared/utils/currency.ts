/**
 * Currency formatting utilities.
 * MUST use integer minor money units. Never call with floats.
 * See CONSTITUTION.md R-010, R-013.
 */

/**
 * Formats an integer money amount for display.
 * @param centavos - Integer amount in the platform money unit.
 * For VND this is whole dong. For USD this is cents.
 * @param currency - Currency code, defaults to 'VND'
 */
export function formatMoney(
  centavos: number,
  currency: "VND" | "USD" = "VND",
): string {
  const amount = currency === "USD" ? centavos / 100 : centavos;
  return new Intl.NumberFormat(currency === "USD" ? "en-US" : "vi-VN", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "USD" ? 2 : 0,
    minimumFractionDigits: currency === "USD" ? 2 : 0,
  }).format(amount);
}

/**
 * Parses a display currency string to integer platform money units.
 * Examples: "₫42,500" -> 42500, "$42.50" -> 4250
 * @param display - A currency display string
 * @returns Integer platform money units
 */
export function parseToCentavos(
  display: string,
  currency: "VND" | "USD" = "VND",
): number {
  const cleaned = display.replace(/[^0-9.,\-]/g, "").trim();
  if (currency === "VND") {
    return Number.parseInt(cleaned.replace(/[.,]/g, ""), 10);
  }

  const normalized = cleaned.replace(/,/g, "");
  return Math.round(parseFloat(normalized) * 100);
}
