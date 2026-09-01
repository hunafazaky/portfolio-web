import { useTranslation } from "react-i18next";
import { Section } from "~/components/ui/Section";
import type { Profile } from "~/lib/types";

export function Summary({ profile }: { profile: Profile }) {
  const { t } = useTranslation();
  if (!profile.summary) return null;
  return (
    <Section id="summary" title={t("sections.summary")} side="left" tint="primary">
      <p className="max-w-2xl leading-relaxed text-foreground-muted">{profile.summary}</p>
    </Section>
  );
}
