"use client";

import { createContext, useContext, useEffect, useMemo, type PropsWithChildren } from "react";

import {
  defaultLocale,
  localeCookieName,
  localeLabels,
  supportedLocales,
  type Locale,
} from "./config";
import type { Messages } from "./messages";
import { rawMessagesByLocale } from "./messages";

type AdminI18nValue = {
  locale: Locale;
  t: (key: string) => string;
  raw: (value: string) => string;
  setLocale: (locale: Locale) => void;
};

const AdminI18nContext = createContext<AdminI18nValue | null>(null);

export function AdminI18nProvider({
  locale,
  messages,
  children,
}: PropsWithChildren<{ locale: Locale; messages: Messages }>) {
  const value = useMemo<AdminI18nValue>(
    () => ({
      locale,
      t: (key) => messages[key] ?? key,
      raw: (value) => rawMessagesByLocale[locale]?.[value] ?? value,
      setLocale: (nextLocale) => {
        const expires = 60 * 60 * 24 * 365;
        document.cookie = `${localeCookieName}=${nextLocale}; path=/; max-age=${expires}; SameSite=Lax`;
        window.location.reload();
      },
    }),
    [locale, messages],
  );

  return <AdminI18nContext.Provider value={value}>{children}</AdminI18nContext.Provider>;
}

export function useAdminI18n() {
  const value = useContext(AdminI18nContext);
  if (!value) {
    throw new Error("useAdminI18n must be used within AdminI18nProvider");
  }
  return value;
}

export function AdminLanguageDock() {
  const { locale, setLocale, t } = useAdminI18n();

  return (
    <div
      style={{
        position: "fixed",
        top: 16,
        right: 16,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 12px",
        borderRadius: 10,
        background: "rgba(255, 255, 255, 0.96)",
        border: "1px solid rgba(15, 23, 42, 0.08)",
        boxShadow: "0 8px 24px rgba(15, 23, 42, 0.14)",
        backdropFilter: "blur(10px)",
      }}
    >
      <label htmlFor="admin-language-select" style={{ fontSize: 12, fontWeight: 700 }}>
        {t("dock.label")}
      </label>
      <select
        id="admin-language-select"
        value={locale}
        onChange={(event) => setLocale(event.target.value as Locale)}
        style={{
          borderRadius: 8,
          border: "1px solid rgba(15, 23, 42, 0.12)",
          padding: "8px 10px",
          fontSize: 13,
          fontWeight: 600,
          background: "#fff",
        }}
      >
        {supportedLocales.map((supportedLocale) => (
          <option key={supportedLocale} value={supportedLocale}>
            {localeLabels[supportedLocale]}
          </option>
        ))}
      </select>
    </div>
  );
}

function localizeDocumentText(locale: Locale) {
  if (locale === defaultLocale) return;
  const rawMessages = rawMessagesByLocale[locale];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];
  let node = walker.nextNode();

  while (node) {
    textNodes.push(node as Text);
    node = walker.nextNode();
  }

  for (const textNode of textNodes) {
    const original = textNode.nodeValue ?? "";
    const trimmed = original.trim();
    const replacement = rawMessages[trimmed];
    if (!replacement) continue;
    textNode.nodeValue = original.replace(trimmed, replacement);
  }

  for (const element of Array.from(document.body.querySelectorAll("*"))) {
    for (const attribute of ["aria-label", "title", "placeholder", "alt"]) {
      const original = element.getAttribute(attribute);
      if (!original) continue;
      const replacement = rawMessages[original.trim()];
      if (!replacement) continue;
      element.setAttribute(attribute, original.replace(original.trim(), replacement));
    }
  }
}

export function AdminTextLocalizer() {
  const { locale } = useAdminI18n();

  useEffect(() => {
    localizeDocumentText(locale);
    if (locale === defaultLocale) return;

    const observer = new MutationObserver(() => localizeDocumentText(locale));
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [locale]);

  return null;
}
