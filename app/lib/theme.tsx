// Dark/light toggle. Dark is the default ambiance (Nord is a dark-native
// palette — see app.css). The actual .dark class is set synchronously by
// an inline script in root.tsx's <head> (THEME_INIT_SCRIPT below) before
// first paint, so there's no flash of the wrong theme; this context just
// keeps React's state in sync with that class for the toggle button.

import { createContext, useContext, useLayoutEffect, useState, type ReactNode } from "react";

const STORAGE_KEY = "portfolio_theme";
export type Theme = "light" | "dark";

// Inlined into root.tsx's <head> verbatim — see the Layout export there.
export const THEME_INIT_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem('${STORAGE_KEY}');
    var theme = stored === 'light' || stored === 'dark' ? stored : 'dark';
    if (theme === 'dark') document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;

type ThemeContextValue = { theme: Theme; toggleTheme: () => void };

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Always "dark" on first render, client or server/prerender — matching
  // the prerendered HTML's default exactly avoids a hydration mismatch
  // (prerendering runs in Node, where there's no document/localStorage to
  // read a real preference from, so it always falls back to "dark"; if
  // the client's first render read the real stored value instead, it
  // could differ from what was prerendered — e.g. any visitor who'd
  // previously switched to light mode — which is exactly what React's
  // hydration mismatch warning is flagging).
  //
  // The correct theme is already visually applied before this even runs
  // (THEME_INIT_SCRIPT sets the .dark class synchronously in <head>,
  // before React loads), so this state is purely to keep ThemeToggle's
  // icon in sync — corrected in useLayoutEffect below, which runs after
  // hydration completes rather than during it, so it doesn't trigger the
  // mismatch warning, and before paint, so there's no visible icon flash.
  const [theme, setTheme] = useState<Theme>("dark");

  useLayoutEffect(() => {
    const actual: Theme = document.documentElement.classList.contains("dark") ? "dark" : "light";
    if (actual !== theme) setTheme(actual);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
