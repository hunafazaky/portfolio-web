import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "~/lib/api";
import { Card } from "~/components/ui/Card";
import type {
  Experience as ExperienceAdmin,
  Project as ProjectAdmin,
  Education as EducationAdmin,
  Skill,
  Certificate,
} from "~/lib/types";

type ContactMessage = { id: number; read_at: string | null };

type Counts = {
  experiences: number;
  projects: number;
  education: number;
  skills: number;
  certificates: number;
  unreadMessages: number;
};

export default function DashboardOverview() {
  const { t } = useTranslation();
  const [counts, setCounts] = useState<Counts | null>(null);

  useEffect(() => {
    Promise.all([
      api.get<ExperienceAdmin[]>("/api/admin/experiences"),
      api.get<ProjectAdmin[]>("/api/admin/projects"),
      api.get<EducationAdmin[]>("/api/admin/education"),
      api.get<Skill[]>("/api/admin/skills"),
      api.get<Certificate[]>("/api/admin/certificates"),
      api.get<ContactMessage[]>("/api/admin/contact-messages"),
    ]).then(([experiences, projects, education, skills, certificates, messages]) => {
      setCounts({
        experiences: experiences.length,
        projects: projects.length,
        education: education.length,
        skills: skills.length,
        certificates: certificates.length,
        unreadMessages: messages.filter((m) => !m.read_at).length,
      });
    });
  }, []);

  const stats = counts
    ? [
        { label: t("dashboard.experiences"), value: counts.experiences },
        { label: t("dashboard.projects"), value: counts.projects },
        { label: t("dashboard.education"), value: counts.education },
        { label: t("dashboard.skills"), value: counts.skills },
        { label: t("dashboard.certificates"), value: counts.certificates },
        { label: t("dashboard.messages"), value: counts.unreadMessages, highlight: counts.unreadMessages > 0 },
      ]
    : [];

  return (
    <div>
      <h1 className="mb-6 font-mono text-lg font-semibold text-foreground">{t("dashboard.overview")}</h1>
      {!counts ? (
        <p className="font-mono text-sm text-foreground-muted">{t("dashboard.loading")}</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {stats.map((s) => (
            <Card key={s.label}>
              <p className={`text-2xl font-semibold ${s.highlight ? "text-primary" : "text-foreground"}`}>
                {s.value}
              </p>
              <p className="mt-1 font-mono text-xs text-foreground-muted">{s.label}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
