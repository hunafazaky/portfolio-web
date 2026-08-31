import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import { useTheme } from "~/lib/theme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="rounded-md border border-border p-2 text-foreground-muted hover:text-foreground"
    >
      {theme === "dark" ? <SunIcon className="size-4" /> : <MoonIcon className="size-4" />}
    </button>
  );
}
