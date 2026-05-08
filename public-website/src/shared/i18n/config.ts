export const supportedLocales = ["en", "ko", "vi"] as const;

export type Locale = (typeof supportedLocales)[number];

export const defaultLocale: Locale = "en";
export const localeCookieName = "dlb_locale";

export const localeLabels: Record<Locale, string> = {
  en: "English",
  ko: "한국어",
  vi: "Tiếng Việt",
};

export function isLocale(value: string | undefined | null): value is Locale {
  return Boolean(value && supportedLocales.includes(value as Locale));
}
