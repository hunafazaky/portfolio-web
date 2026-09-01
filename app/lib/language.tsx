// Drives both the static UI language (i18next) and the content language
// (the `lang` param passed to lib/data.ts's getters) from one place, so a
// single switcher click updates everything at once. Persisted to
// localStorage; this is a real deployed site, not a sandboxed preview, so
// localStorage is fine here.

import { createContext, useContext, useLayoutEffect, useState, type ReactNode } from "react";
import i18n from "./i18n";
import type { Lang } from "./data";

const STORAGE_KEY = "portfolio_lang";

type LanguageContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function readStoredLang(): Lang {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "en" || stored === "id") return stored;
  return window.navigator.language.startsWith("id") ? "id" : "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Always "en" on first render, client or server/prerender — same
  // reasoning as ThemeProvider (see lib/theme.tsx): prerendering runs in
  // Node with no localStorage/navigator to read a real preference from,
  // so it always falls back to "en". If the client's first render read
  // localStorage directly instead, it could differ from what was
  // prerendered for any returning Indonesian-preferring visitor — a
  // hydration mismatch.
  //
  // Trade-off worth knowing: unlike the theme fix, there's no equivalent
  // of THEME_INIT_SCRIPT here — page *content* (not just an icon) depends
  // on language, and content can't be set before paint the way a CSS
  // class can. So a returning "id" visitor will briefly see English
  // before this corrects it post-mount. Fixing that properly would mean
  // server-side language detection, which isn't available in a static
  // GitHub Pages build.
  const [lang, setLangState] = useState<Lang>("en");

  useLayoutEffect(() => {
    const actual = readStoredLang();
    if (actual !== lang) setLangState(actual);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang]);

  function setLang(next: Lang) {
    window.localStorage.setItem(STORAGE_KEY, next);
    setLangState(next);
  }

  return <LanguageContext.Provider value={{ lang, setLang }}>{children}</LanguageContext.Provider>;
}

export function useLang(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used within a LanguageProvider");
  return ctx;
}
