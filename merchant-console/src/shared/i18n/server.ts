import { cookies } from "next/headers";

import {
  defaultLocale,
  isLocale,
  localeCookieName,
  type Locale,
} from "./config";
import { messagesByLocale, type Messages } from "./messages";

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
    t: (key: string) => messages[key] ?? messagesByLocale[defaultLocale][key] ?? key,
  };
}
