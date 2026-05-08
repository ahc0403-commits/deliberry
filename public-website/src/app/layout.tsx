import "./globals.css";
import type { ReactNode } from "react";

import {
  PublicI18nProvider,
  PublicLanguageDock,
  PublicTextLocalizer,
} from "../shared/i18n/client";
import { getTranslations } from "../shared/i18n/server";

export const metadata = {
  title: "Deliberry",
  description: "Public Website",
  other: {
    "zalo-platform-site-verification": "PzwL3RVB91jirhL5xSPYRHV5q7VximKfCpav",
  },
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const { locale, messages } = await getTranslations();

  return (
    <html lang={locale}>
      <body>
        <PublicI18nProvider locale={locale} messages={messages}>
          {children}
          <PublicTextLocalizer />
          <PublicLanguageDock />
        </PublicI18nProvider>
      </body>
    </html>
  );
}
