import { useTranslation } from "react-i18next";
import { Section } from "~/components/ui/Section";
import type { Experience as ExperienceType } from "~/lib/types";

function formatRange(start: string, end: string | null) {
  const fmt = (d: string) => new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "short" });
  return `${fmt(start)} — ${end ? fmt(end) : "Present"}`;
}

export function Experience({ experiences }: { experiences: ExperienceType[] }) {
  const { t } = useTranslation();
  if (experiences.length === 0) return null;
  return (
    <Section id="experience" title={t("sections.experience")} side="right" tint="teal">
      <ol className="space-y-10 border-l border-border pl-6">
        {experiences.map((exp) => (
          <li key={exp.id} className="relative">
            <span className="absolute -left-[29px] top-1.5 size-2.5 rounded-full bg-primary" />
            <p className="font-mono text-xs text-foreground-muted">{formatRange(exp.start_date, exp.end_date)}</p>
            <h3 className="mt-1 font-semibold text-foreground">
              {exp.role} · {exp.company}
            </h3>
            {exp.location && <p className="text-sm text-foreground-muted">{exp.location}</p>}
            {exp.description && <p className="mt-2 max-w-2xl text-foreground-muted">{exp.description}</p>}
          </li>
        ))}
      </ol>
    </Section>
  );
}
