/**
 * Currency formatting utilities.
 * MUST use integer centavos. Never call with float dollars.
 * See CONSTITUTION.md R-010, R-013.
 */

/**
 * Formats an integer centavo amount for display.
 * @param centavos - Integer amount in centavos (e.g., 4250 for $42.50)
 * @param currency - Currency code, defaults to 'ARS'
 */
export function formatMoney(
  centavos: number,
  currency: "ARS" | "USD" = "ARS",
): string {
  const dollars = centavos / 100;
  return new Intl.NumberFormat(currency === "ARS" ? "es-AR" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(dollars);
}

/**
 * Parses a display currency string to integer centavos.
 * Examples: "$42.50" -> 4250, "1.234,50" -> 123450
 * @param display - A currency display string
 * @returns Integer centavos
 */
export function parseToCentavos(display: string): number {
  // Strip currency symbols and whitespace
  const cleaned = display.replace(/[^0-9.,\-]/g, "").trim();
  // Handle Argentine format (1.234,50) vs US format (1,234.50)
  // If the last separator is a comma and has exactly 2 digits after, treat as decimal
  const commaMatch = cleaned.match(/,(\d{2})$/);
  if (commaMatch) {
    // Argentine format: dots are thousands, comma is decimal
    const normalized = cleaned.replace(/\./g, "").replace(",", ".");
    return Math.round(parseFloat(normalized) * 100);
  }
  // US format or plain number
  const normalized = cleaned.replace(/,/g, "");
  return Math.round(parseFloat(normalized) * 100);
}
