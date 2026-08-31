import { useTranslation } from "react-i18next";
import { Section } from "~/components/ui/Section";
import { Badge } from "~/components/ui/Badge";
import type { Education as EducationType } from "~/lib/types";

export function Education({ education }: { education: EducationType[] }) {
  const { t } = useTranslation();
  if (education.length === 0) return null;
  return (
    <Section id="education" title={t("sections.education")}>
      <div className="grid gap-6 md:grid-cols-2">
        {education.map((e) => (
          <div key={e.id} className="border border-border rounded-lg p-6">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-foreground">{e.institution}</h3>
              {e.category && <Badge>{e.category}</Badge>}
            </div>
            {(e.degree || e.field) && (
              <p className="mt-1 text-sm text-foreground-muted">
                {[e.degree, e.field].filter(Boolean).join(" · ")}
              </p>
            )}
            {e.description && (
              <p className="mt-2 text-sm text-foreground-muted">
                {e.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </Section>
  );
}
