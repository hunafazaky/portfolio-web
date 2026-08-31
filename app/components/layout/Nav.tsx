import { useTranslation } from "react-i18next";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitch } from "./LanguageSwitch";
import { Container } from "~/components/ui/Container";

const links = [
  "summary",
  "experience",
  "projects",
  "education",
  "skills",
  "certificates",
  "contact",
] as const;

export function Nav() {
  const { t } = useTranslation();
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <a
          href="#"
          className="font-mono text-sm font-semibold tracking-widest text-foreground"
        >
          hunafazaky
        </a>
        <nav className="hidden gap-6 font-mono text-sm text-foreground-muted md:flex">
          {links.map((key) => (
            <a key={key} href={`#${key}`} className="hover:text-foreground">
              {t(`nav.${key}`)}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <LanguageSwitch />
          <ThemeToggle />
        </div>
      </Container>
    </header>
  );
}
