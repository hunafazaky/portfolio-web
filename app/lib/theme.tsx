// Dark/light toggle. Dark is the default ambiance (Nord is a dark-native
// palette — see app.css). The actual .dark class is set synchronously by
// an inline script in root.tsx's <head> (THEME_INIT_SCRIPT below) before
// first paint, so there's no flash of the wrong theme; this context just
// keeps React's state in sync with that class for the toggle button.

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

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
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof document === "undefined") return "dark";
    return document.documentElement.classList.contains("dark") ? "dark" : "light";
  });

  useEffect(() => {
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
