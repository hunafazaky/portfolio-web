import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { EnvelopeIcon, EnvelopeOpenIcon } from "@heroicons/react/24/outline";
import { api } from "~/lib/api";
import { Card } from "~/components/ui/Card";

// Mirrors dto.ContactMessageAdminResponse. No create/update/delete — this
// is purely an inbox, read-only besides marking read.
type ContactMessage = {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
  read_at: string | null;
};

export default function DashboardMessages() {
  const { t } = useTranslation();
  const [items, setItems] = useState<ContactMessage[] | null>(null);

  function refresh() {
    api.get<ContactMessage[]>("/api/admin/contact-messages").then(setItems);
  }
  useEffect(refresh, []);

  async function markRead(id: number) {
    await api.post(`/api/admin/contact-messages/${id}/read`);
    setItems(
      (prev) =>
        prev?.map((m) =>
          m.id === id ? { ...m, read_at: new Date().toISOString() } : m,
        ) ?? prev,
    );
  }

  if (!items)
    return (
      <p className="font-mono text-sm text-foreground-muted">
        {t("dashboard.loading")}
      </p>
    );

  return (
    <div>
      <h1 className="mb-6 font-mono text-lg font-semibold text-foreground">
        {t("dashboard.messages")}
      </h1>

      {items.length === 0 ? (
        <p className="font-mono text-sm text-foreground-muted">
          No messages yet.
        </p>
      ) : (
        <div className="space-y-3">
          {items.map((m) => (
            <Card key={m.id} className={m.read_at ? "opacity-70" : ""}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-foreground">
                    {m.name}{" "}
                    <span className="font-mono text-xs text-foreground-muted">
                      &lt;{m.email}&gt;
                    </span>
                  </p>
                  <p className="font-mono text-xs text-foreground-muted">
                    {new Date(m.created_at).toLocaleString()}
                  </p>
                </div>
                {!m.read_at && (
                  <button
                    onClick={() => markRead(m.id)}
                    className="flex shrink-0 items-center gap-1 rounded-md border border-border px-2 py-1 font-mono text-xs text-foreground-muted hover:text-foreground"
                  >
                    <EnvelopeOpenIcon className="size-3.5" /> Mark read
                  </button>
                )}
                {m.read_at && (
                  <span className="flex shrink-0 items-center gap-1 font-mono text-xs text-foreground-muted">
                    <EnvelopeIcon className="size-3.5" /> read
                  </span>
                )}
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm text-foreground-muted">
                {m.message}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
