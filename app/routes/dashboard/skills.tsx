import { useEffect, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import * as HeroIcons from "@heroicons/react/24/outline";
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import { api } from "~/lib/api";
import { Button } from "~/components/ui/Button";
import { Card } from "~/components/ui/Card";
import { Field, inputClass } from "~/components/dashboard/Field";

// Mirrors dto.SkillResponse / dto.SkillRequest.
type Skill = {
  id: number;
  name: string;
  icon_key: string;
  category: string;
  sort_order: number;
};
type FormState = Omit<Skill, "id">;

const emptyForm: FormState = {
  name: "",
  icon_key: "",
  category: "",
  sort_order: 0,
};

function IconPreview({ iconKey }: { iconKey: string }) {
  const Icon = (
    HeroIcons as Record<string, React.ComponentType<{ className?: string }>>
  )[iconKey];
  if (!iconKey)
    return <QuestionMarkCircleIcon className="size-5 text-foreground-muted" />;
  if (!Icon)
    return <span className="font-mono text-xs text-danger">not found</span>;
  return <Icon className="size-5 text-primary" />;
}

export default function DashboardSkills() {
  const { t } = useTranslation();
  const [items, setItems] = useState<Skill[] | null>(null);
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);

  function refresh() {
    api.get<Skill[]>("/api/admin/skills").then(setItems);
  }
  useEffect(refresh, []);

  function startCreate() {
    setForm(emptyForm);
    setEditingId("new");
  }

  function startEdit(s: Skill) {
    const { id, ...rest } = s;
    setForm(rest);
    setEditingId(id);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId === "new") {
        await api.post("/api/admin/skills", form);
      } else {
        await api.put(`/api/admin/skills/${editingId}`, form);
      }
      setEditingId(null);
      refresh();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm(t("dashboard.confirmDelete"))) return;
    await api.delete(`/api/admin/skills/${id}`);
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
          {t("dashboard.skills")}
        </h1>
        {editingId === null && (
          <Button onClick={startCreate}>
            <PlusIcon className="size-4" /> {t("dashboard.create")}
          </Button>
        )}
      </div>

      {editingId !== null && (
        <Card className="mb-6 max-w-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Name">
              <input
                className={inputClass}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </Field>
            <Field label="Icon key (heroicons outline component name)">
              <div className="flex items-center gap-3">
                <input
                  className={inputClass}
                  placeholder="CommandLineIcon"
                  value={form.icon_key}
                  onChange={(e) =>
                    setForm({ ...form, icon_key: e.target.value })
                  }
                  required
                />
                <IconPreview iconKey={form.icon_key} />
              </div>
              <p className="mt-1 font-mono text-xs text-foreground-muted">
                Browse names at heroicons.com (outline set)
              </p>
            </Field>
            <Field label="Category">
              <input
                className={inputClass}
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
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

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {items.map((s) => (
          <Card
            key={s.id}
            className="flex flex-col items-center gap-2 text-center"
          >
            <IconPreview iconKey={s.icon_key} />
            <p className="text-sm text-foreground">{s.name}</p>
            <div className="flex gap-2">
              <button
                onClick={() => startEdit(s)}
                className="p-1 text-foreground-muted hover:text-foreground"
              >
                <PencilIcon className="size-4" />
              </button>
              <button
                onClick={() => handleDelete(s.id)}
                className="p-1 text-foreground-muted hover:text-danger"
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
