export type EntityId = string;
export type ISODateString = string;
export type ISODateTimeString = string;
export type CurrencyCode = "ARS" | "USD";

/**
 * All monetary values MUST be integer centavos. Never float.
 * Example: $42.50 = 4250.
 * See CONSTITUTION.md R-010, R-011.
 */
export type MoneyAmount = number & { readonly __brand: "centavos" };

/** Alias for MoneyAmount — all values are integer centavos. */
export type Centavos = MoneyAmount;

/**
 * ISO 8601 UTC timestamp string. Must end with 'Z'.
 * Example: "2026-03-14T15:30:00Z"
 * See CONSTITUTION.md R-050, R-051.
 */
export type ISODateTimeUTC = string & { readonly __brand: "utc-datetime" };

export type DateRange = {
  from: ISODateString;
  to: ISODateString;
};

export type Paging = {
  cursor?: string;
  limit?: number;
};
