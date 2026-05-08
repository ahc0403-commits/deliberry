import "./globals.css";
import type { ReactNode } from "react";

import {
  MerchantI18nProvider,
  MerchantLanguageDock,
  MerchantTextLocalizer,
} from "../shared/i18n/client";
import { getTranslations } from "../shared/i18n/server";

export const metadata = {
  title: "Deliberry Merchant Console",
  description: "Merchant Console",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const { locale, messages } = await getTranslations();

  return (
    <html lang={locale}>
      <body>
        <MerchantI18nProvider locale={locale} messages={messages}>
          {children}
          <MerchantTextLocalizer />
          <MerchantLanguageDock />
        </MerchantI18nProvider>
      </body>
    </html>
  );
}
