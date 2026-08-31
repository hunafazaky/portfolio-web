import { useTranslation } from "react-i18next";
import { Container } from "~/components/ui/Container";

export function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border py-8">
      <Container className="flex flex-col items-center justify-between gap-2 font-mono text-xs text-foreground-muted md:flex-row">
        <span>
          © {year} hunafazaky. {t("footer.rights")}
        </span>
      </Container>
    </footer>
  );
}
