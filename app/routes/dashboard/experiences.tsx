import { useEffect, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import { api } from "~/lib/api";
import { Button } from "~/components/ui/Button";
import { Card } from "~/components/ui/Card";
import { Field, inputClass } from "~/components/dashboard/Field";

// Mirrors dto.ExperienceAdminResponse / dto.ExperienceRequest.
type Experience = {
  id: number;
  company: string;
  role: string;
  location: string;
  description_en: string;
  description_id: string;
  start_date: string;
  end_date: string | null;
  sort_order: number;
};

type FormState = Omit<Experience, "id">;

const emptyForm: FormState = {
  company: "",
  role: "",
  location: "",
  description_en: "",
  description_id: "",
  start_date: "",
  end_date: "",
  sort_order: 0,
};

export default function DashboardExperiences() {
  const { t } = useTranslation();
  const [items, setItems] = useState<Experience[] | null>(null);
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);

  function refresh() {
    api.get<Experience[]>("/api/admin/experiences").then(setItems);
  }
  useEffect(refresh, []);

  function startCreate() {
    setForm(emptyForm);
    setEditingId("new");
  }

  function startEdit(exp: Experience) {
    const { id, ...rest } = exp;
    setForm({ ...rest, end_date: rest.end_date ?? "" });
    setEditingId(id);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, end_date: form.end_date || "" };
      if (editingId === "new") {
        await api.post("/api/admin/experiences", payload);
      } else {
        await api.put(`/api/admin/experiences/${editingId}`, payload);
      }
      setEditingId(null);
      refresh();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm(t("dashboard.confirmDelete"))) return;
    await api.delete(`/api/admin/experiences/${id}`);
    refresh();
  }

  if (!items) return <p className="font-mono text-sm text-foreground-muted">{t("dashboard.loading")}</p>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-mono text-lg font-semibold text-foreground">{t("dashboard.experiences")}</h1>
        {editingId === null && (
          <Button onClick={startCreate}>
            <PlusIcon className="size-4" /> {t("dashboard.create")}
          </Button>
        )}
      </div>

      {editingId !== null && (
        <Card className="mb-6 max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Company">
                <input
                  className={inputClass}
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  required
                />
              </Field>
              <Field label="Role">
                <input
                  className={inputClass}
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  required
                />
              </Field>
            </div>
            <Field label="Location">
              <input
                className={inputClass}
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Start date">
                <input
                  type="date"
                  className={inputClass}
                  value={form.start_date}
                  onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                  required
                />
              </Field>
              <Field label="End date (blank = present)">
                <input
                  type="date"
                  className={inputClass}
                  value={form.end_date ?? ""}
                  onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                />
              </Field>
            </div>
            <Field label="Description (English)">
              <textarea
                className={inputClass}
                rows={3}
                value={form.description_en}
                onChange={(e) => setForm({ ...form, description_en: e.target.value })}
              />
            </Field>
            <Field label="Description (Indonesian)">
              <textarea
                className={inputClass}
                rows={3}
                value={form.description_id}
                onChange={(e) => setForm({ ...form, description_id: e.target.value })}
              />
            </Field>
            <Field label="Sort order">
              <input
                type="number"
                className={inputClass}
                value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
              />
            </Field>
            <div className="flex gap-3">
              <Button type="submit" disabled={saving}>
                {saving ? t("dashboard.saving") : t("dashboard.save")}
              </Button>
              <Button type="button" variant="outline" onClick={() => setEditingId(null)}>
                {t("dashboard.cancel")}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="space-y-3">
        {items.map((exp) => (
          <Card key={exp.id} className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">
                {exp.role} · {exp.company}
              </p>
              <p className="font-mono text-xs text-foreground-muted">
                {exp.start_date} — {exp.end_date ?? "present"}
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(exp)} className="p-2 text-foreground-muted hover:text-foreground">
                <PencilIcon className="size-4" />
              </button>
              <button onClick={() => handleDelete(exp.id)} className="p-2 text-foreground-muted hover:text-danger">
                <TrashIcon className="size-4" />
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
