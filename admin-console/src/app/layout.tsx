import "./globals.css";
import type { ReactNode } from "react";

import {
  AdminI18nProvider,
  AdminLanguageDock,
  AdminTextLocalizer,
} from "../shared/i18n/client";
import { getTranslations } from "../shared/i18n/server";

export const metadata = {
  title: "Deliberry Admin Console",
  description: "Admin Console",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const { locale, messages } = await getTranslations();

  return (
    <html lang={locale}>
      <body>
        <AdminI18nProvider locale={locale} messages={messages}>
          {children}
          <AdminTextLocalizer />
          <AdminLanguageDock />
        </AdminI18nProvider>
      </body>
    </html>
  );
}
