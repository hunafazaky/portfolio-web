import { useTranslation } from "react-i18next";
import {
  CodeBracketIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";
import { Section } from "~/components/ui/Section";
import { Card } from "~/components/ui/Card";
import { Badge } from "~/components/ui/Badge";
import type { Project as ProjectType } from "~/lib/types";

export function Project({ projects }: { projects: ProjectType[] }) {
  const { t } = useTranslation();
  if (projects.length === 0) return null;
  return (
    <Section id="projects" title={t("sections.projects")}>
      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((p) => (
          <Card key={p.id} className="flex flex-col">
            {p.image_url && (
              <img
                src={p.image_url}
                alt={p.title}
                className="mb-4 aspect-video rounded-md object-cover"
              />
            )}
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-foreground">{p.title}</h3>
              {p.category && <Badge>{p.category}</Badge>}
            </div>
            {p.description && (
              <p className="mt-2 flex-1 text-sm text-foreground-muted">
                {p.description}
              </p>
            )}
            {p.tech_stack.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {p.tech_stack.map((tech) => (
                  <Badge key={tech}>{tech}</Badge>
                ))}
              </div>
            )}
            <div className="mt-4 flex gap-4 font-mono text-xs text-foreground-muted">
              {p.project_url && (
                <a
                  href={p.project_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 hover:text-primary"
                >
                  <ArrowTopRightOnSquareIcon className="size-3.5" />{" "}
                  {t("project.viewProject")}
                </a>
              )}
              {p.repo_url && (
                <a
                  href={p.repo_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 hover:text-primary"
                >
                  <CodeBracketIcon className="size-3.5" />{" "}
                  {t("project.viewCode")}
                </a>
              )}
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}
