import { cookies } from "next/headers";

import {
  defaultLocale,
  isLocale,
  localeCookieName,
  type Locale,
} from "./config";
import { messagesByLocale, type Messages } from "./messages";

export type TranslateValues = Record<string, string | number>;

function formatMessage(template: string, values?: TranslateValues): string {
  if (!values) {
    return template;
  }

  return Object.entries(values).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, String(value)),
    template,
  );
}

export async function getRequestLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const locale = cookieStore.get(localeCookieName)?.value;
  return isLocale(locale) ? locale : defaultLocale;
}

export function getMessages(locale: Locale): Messages {
  return messagesByLocale[locale] ?? messagesByLocale[defaultLocale];
}

export async function getTranslations() {
  const locale = await getRequestLocale();
  const messages = getMessages(locale);

  return {
    locale,
    messages,
    t: (key: string, values?: TranslateValues) =>
      formatMessage(messages[key] ?? messagesByLocale[defaultLocale][key] ?? key, values),
  };
}
