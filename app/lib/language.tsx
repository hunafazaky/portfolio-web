// Drives both the static UI language (i18next) and the content language
// (the `lang` param passed to lib/data.ts's getters) from one place, so a
// single switcher click updates everything at once. Persisted to
// localStorage; this is a real deployed site, not a sandboxed preview, so
// localStorage is fine here.

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import i18n from "./i18n";
import type { Lang } from "./data";

const STORAGE_KEY = "portfolio_lang";

type LanguageContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function readInitialLang(): Lang {
  if (typeof window === "undefined") return "en";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "en" || stored === "id") return stored;
  return window.navigator.language.startsWith("id") ? "id" : "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readInitialLang);

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang]);

  function setLang(next: Lang) {
    window.localStorage.setItem(STORAGE_KEY, next);
    setLangState(next);
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used within a LanguageProvider");
  return ctx;
}
