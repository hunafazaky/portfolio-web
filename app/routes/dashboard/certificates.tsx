import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { PencilIcon, TrashIcon, PlusIcon, ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { api } from "~/lib/api";
import { Button } from "~/components/ui/Button";
import { Card } from "~/components/ui/Card";
import { Field, inputClass } from "~/components/dashboard/Field";

// Mirrors dto.CertificateResponse / dto.CertificateRequest.
type Certificate = {
  id: number;
  title: string;
  issuer: string;
  category: string;
  issue_date: string | null;
  credential_url: string;
  image_url: string;
  sort_order: number;
};

type FormState = Omit<Certificate, "id">;

const emptyForm: FormState = {
  title: "",
  issuer: "",
  category: "",
  issue_date: "",
  credential_url: "",
  image_url: "",
  sort_order: 0,
};

export default function DashboardCertificates() {
  const { t } = useTranslation();
  const [items, setItems] = useState<Certificate[] | null>(null);
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  function refresh() {
    api.get<Certificate[]>("/api/admin/certificates").then(setItems);
  }
  useEffect(refresh, []);

  function startCreate() {
    setForm(emptyForm);
    setEditingId("new");
  }

  function startEdit(c: Certificate) {
    const { id, ...rest } = c;
    setForm({ ...rest, issue_date: rest.issue_date ?? "" });
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
      if (editingId === "new") {
        await api.post("/api/admin/certificates", form);
      } else {
        await api.put(`/api/admin/certificates/${editingId}`, form);
      }
      setEditingId(null);
      refresh();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm(t("dashboard.confirmDelete"))) return;
    await api.delete(`/api/admin/certificates/${id}`);
    refresh();
  }

  if (!items) return <p className="font-mono text-sm text-foreground-muted">{t("dashboard.loading")}</p>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-mono text-lg font-semibold text-foreground">{t("dashboard.certificates")}</h1>
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
              <Field label="Issuer">
                <input
                  className={inputClass}
                  value={form.issuer}
                  onChange={(e) => setForm({ ...form, issuer: e.target.value })}
                />
              </Field>
            </div>

            <Field label="Image">
              <div className="flex items-center gap-3">
                {form.image_url && (
                  <img src={form.image_url} alt="" className="size-16 rounded-md object-cover" />
                )}
                <label className="flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-2 font-mono text-sm text-foreground-muted hover:text-foreground">
                  <ArrowUpTrayIcon className="size-4" />
                  {uploading ? "Uploading..." : "Upload"}
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
              </div>
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Category">
                <input
                  className={inputClass}
                  placeholder="devops, web dev, data..."
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                />
              </Field>
              <Field label="Issue date">
                <input
                  type="date"
                  className={inputClass}
                  value={form.issue_date ?? ""}
                  onChange={(e) => setForm({ ...form, issue_date: e.target.value })}
                />
              </Field>
            </div>

            <Field label="Credential URL">
              <input
                className={inputClass}
                value={form.credential_url}
                onChange={(e) => setForm({ ...form, credential_url: e.target.value })}
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

      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {items.map((c) => (
          <Card key={c.id} className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate font-medium text-foreground">{c.title}</p>
              <p className="truncate font-mono text-xs text-foreground-muted">{c.issuer || "—"}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button onClick={() => startEdit(c)} className="p-2 text-foreground-muted hover:text-foreground">
                <PencilIcon className="size-4" />
              </button>
              <button onClick={() => handleDelete(c.id)} className="p-2 text-foreground-muted hover:text-danger">
                <TrashIcon className="size-4" />
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
