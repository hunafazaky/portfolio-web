import { useLang } from "~/lib/language";

export function LanguageSwitch() {
  const { lang, setLang } = useLang();
  return (
    <div className="flex items-center rounded-md border border-border font-mono text-xs">
      {(["en", "id"] as const).map((code) => (
        <button
          key={code}
          onClick={() => setLang(code)}
          className={`px-2 py-1.5 uppercase transition-colors ${
            lang === code
              ? "bg-primary text-background"
              : "text-foreground-muted hover:text-foreground"
          }`}
        >
          {code}
        </button>
      ))}
    </div>
  );
}
