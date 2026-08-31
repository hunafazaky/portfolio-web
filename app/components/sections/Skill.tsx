import { useTranslation } from "react-i18next";
import * as HeroIcons from "@heroicons/react/24/outline";
import { CodeBracketSquareIcon } from "@heroicons/react/24/outline";
import { Section } from "~/components/ui/Section";
import type { Skill as SkillType } from "~/lib/types";

// icon_key is a heroicons component name, e.g. "CommandLineIcon" — set by
// the dashboard when creating/editing a skill. Falls back to a generic
// icon if the stored key doesn't match a known heroicon.
function SkillIcon({ iconKey }: { iconKey: string }) {
  const Icon = (
    HeroIcons as Record<string, React.ComponentType<{ className?: string }>>
  )[iconKey];
  const Resolved = Icon ?? CodeBracketSquareIcon;
  return <Resolved className="size-6 text-primary" />;
}

export function Skill({ skills }: { skills: SkillType[] }) {
  const { t } = useTranslation();
  if (skills.length === 0) return null;
  return (
    <Section id="skills" title={t("sections.skills")}>
      <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="flex flex-col items-center gap-2 rounded-lg border border-border p-4 text-center"
            title={skill.name}
          >
            <SkillIcon iconKey={skill.icon_key} />
            <span className="font-mono text-xs text-foreground-muted">
              {skill.name}
            </span>
          </div>
        ))}
      </div>
    </Section>
  );
}
