import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  ArrowUpTrayIcon,
} from "@heroicons/react/24/outline";
import { api } from "~/lib/api";
import { Button } from "~/components/ui/Button";
import { Card } from "~/components/ui/Card";
import { Field, inputClass } from "~/components/dashboard/Field";

// Mirrors dto.ProjectAdminResponse / dto.ProjectRequest.
type Project = {
  id: number;
  title: string;
  category: string;
  description_en: string;
  description_id: string;
  tech_stack: string[];
  project_url: string;
  repo_url: string;
  image_url: string;
  sort_order: number;
};

type FormState = Omit<Project, "id">;

const emptyForm: FormState = {
  title: "",
  category: "",
  description_en: "",
  description_id: "",
  tech_stack: [],
  project_url: "",
  repo_url: "",
  image_url: "",
  sort_order: 0,
};

export default function DashboardProjects() {
  const { t } = useTranslation();
  const [items, setItems] = useState<Project[] | null>(null);
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [techStackInput, setTechStackInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  function refresh() {
    api.get<Project[]>("/api/admin/projects").then(setItems);
  }
  useEffect(refresh, []);

  function startCreate() {
    setForm(emptyForm);
    setTechStackInput("");
    setEditingId("new");
  }

  function startEdit(p: Project) {
    const { id, ...rest } = p;
    setForm(rest);
    setTechStackInput(rest.tech_stack.join(", "));
    setEditingId(id);
  }

  async function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await api.upload(file);
      setForm((f) => ({ ...f, image_url: url }));
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        tech_stack: techStackInput
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };
      if (editingId === "new") {
        await api.post("/api/admin/projects", payload);
      } else {
        await api.put(`/api/admin/projects/${editingId}`, payload);
      }
      setEditingId(null);
      refresh();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm(t("dashboard.confirmDelete"))) return;
    await api.delete(`/api/admin/projects/${id}`);
    refresh();
  }

  if (!items)
    return (
      <p className="font-mono text-sm text-foreground-muted">
        {t("dashboard.loading")}
      </p>
    );

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-mono text-lg font-semibold text-foreground">
          {t("dashboard.projects")}
        </h1>
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
              <Field label="Title">
                <input
                  className={inputClass}
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </Field>
              <Field label="Category">
                <input
                  className={inputClass}
                  placeholder="backend, frontend, simple..."
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                />
              </Field>
            </div>

            <Field label="Image">
              <div className="flex items-center gap-3">
                {form.image_url && (
                  <img
                    src={form.image_url}
                    alt=""
                    className="size-16 rounded-md object-cover"
                  />
                )}
                <label className="flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-2 font-mono text-sm text-foreground-muted hover:text-foreground">
                  <ArrowUpTrayIcon className="size-4" />
                  {uploading ? "Uploading..." : "Upload"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Project URL">
                <input
                  className={inputClass}
                  value={form.project_url}
                  onChange={(e) =>
                    setForm({ ...form, project_url: e.target.value })
                  }
                />
              </Field>
              <Field label="Repo URL">
                <input
                  className={inputClass}
                  value={form.repo_url}
                  onChange={(e) =>
                    setForm({ ...form, repo_url: e.target.value })
                  }
                />
              </Field>
            </div>

            <Field label="Tech stack (comma-separated)">
              <input
                className={inputClass}
                placeholder="Go, React, Postgres"
                value={techStackInput}
                onChange={(e) => setTechStackInput(e.target.value)}
              />
            </Field>

            <Field label="Description (English)">
              <textarea
                className={inputClass}
                rows={3}
                value={form.description_en}
                onChange={(e) =>
                  setForm({ ...form, description_en: e.target.value })
                }
              />
            </Field>
            <Field label="Description (Indonesian)">
              <textarea
                className={inputClass}
                rows={3}
                value={form.description_id}
                onChange={(e) =>
                  setForm({ ...form, description_id: e.target.value })
                }
              />
            </Field>

            <Field label="Sort order">
              <input
                type="number"
                className={inputClass}
                value={form.sort_order}
                onChange={(e) =>
                  setForm({ ...form, sort_order: Number(e.target.value) })
                }
              />
            </Field>

            <div className="flex gap-3">
              <Button type="submit" disabled={saving}>
                {saving ? t("dashboard.saving") : t("dashboard.save")}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingId(null)}
              >
                {t("dashboard.cancel")}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((p) => (
          <Card key={p.id} className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate font-medium text-foreground">{p.title}</p>
              <p className="font-mono text-xs text-foreground-muted">
                {p.category || "—"}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                onClick={() => startEdit(p)}
                className="p-2 text-foreground-muted hover:text-foreground"
              >
                <PencilIcon className="size-4" />
              </button>
              <button
                onClick={() => handleDelete(p.id)}
                className="p-2 text-foreground-muted hover:text-danger"
              >
                <TrashIcon className="size-4" />
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
