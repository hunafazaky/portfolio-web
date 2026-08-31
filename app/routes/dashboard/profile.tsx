import { useEffect, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { api } from "~/lib/api";
import { Button } from "~/components/ui/Button";
import { Field, inputClass } from "~/components/dashboard/Field";

// Mirrors dto.ProfileAdminResponse / dto.ProfileUpdateRequest in
// portfolio-backend. speedread_*/resume_pdf_url_* are read-only here —
// they're written by the Speed-Read and PDF-generation services (not yet
// built), not typed by hand, matching the backend's ProfileUpdateRequest
// which deliberately omits them too.
type ProfileAdmin = {
  name: string;
  title: string;
  summary_en: string;
  summary_id: string;
  speedread_en: string;
  speedread_id: string;
  resume_pdf_url_en: string;
  resume_pdf_url_id: string;
};

export default function DashboardProfile() {
  const { t } = useTranslation();
  const [profile, setProfile] = useState<ProfileAdmin | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    api.get<ProfileAdmin>("/api/admin/profile").then(setProfile);
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    try {
      const updated = await api.put<ProfileAdmin>("/api/admin/profile", {
        name: profile.name,
        title: profile.title,
        summary_en: profile.summary_en,
        summary_id: profile.summary_id,
      });
      setProfile(updated);
      setSavedAt(Date.now());
    } finally {
      setSaving(false);
    }
  }

  if (!profile) {
    return <p className="font-mono text-sm text-foreground-muted">{t("dashboard.loading")}</p>;
  }

  return (
    <div>
      <h1 className="mb-6 font-mono text-lg font-semibold text-foreground">{t("dashboard.profile")}</h1>

      <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
        <Field label="Name">
          <input
            className={inputClass}
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            required
          />
        </Field>

        <Field label="Title">
          <input
            className={inputClass}
            value={profile.title}
            onChange={(e) => setProfile({ ...profile, title: e.target.value })}
          />
        </Field>

        <Field label="Summary (English)">
          <textarea
            className={inputClass}
            rows={5}
            value={profile.summary_en}
            onChange={(e) => setProfile({ ...profile, summary_en: e.target.value })}
          />
        </Field>

        <Field label="Summary (Indonesian)">
          <textarea
            className={inputClass}
            rows={5}
            value={profile.summary_id}
            onChange={(e) => setProfile({ ...profile, summary_id: e.target.value })}
          />
        </Field>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? t("dashboard.saving") : t("dashboard.save")}
          </Button>
          {savedAt && !saving && <span className="font-mono text-xs text-success">Saved</span>}
        </div>
      </form>

      <div className="mt-10 max-w-xl rounded-lg border border-border bg-surface p-4">
        <p className="font-mono text-xs text-foreground-muted">
          Speed-Read summary and resume PDF are generated automatically (not built yet) — read-only for now:
        </p>
        <p className="mt-2 text-sm text-foreground-muted">{profile.speedread_en || "—"}</p>
      </div>
    </div>
  );
}
