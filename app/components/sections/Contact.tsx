import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { Section } from "~/components/ui/Section";
import { Button } from "~/components/ui/Button";
import { api, ApiError } from "~/lib/api";

// The one part of the public site that always hits the live API — a
// contact submission is a write, so it can't be baked into the static
// build. That means it's also the one place a visitor can still notice
// Render's cold start (rare, and only if the API's been idle ~15min+).
// The pending state below sets that expectation explicitly rather than
// looking stuck, and the form is replaced (not just disabled) so the
// visitor can keep scrolling without the section demanding attention.
type Status = "idle" | "sending" | "success" | "error";

function PendingDots() {
  return (
    <span className="inline-flex">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
        >
          .
        </motion.span>
      ))}
    </span>
  );
}

function StatusCard({ status, onRetry }: { status: "sending" | "success" | "error"; onRetry: () => void }) {
  const { t } = useTranslation();
  const copy = {
    sending: { title: t("contact.pendingTitle"), body: t("contact.pendingBody") },
    success: { title: t("contact.successTitle"), body: t("contact.successBody") },
    error: { title: t("contact.errorTitle"), body: t("contact.errorBody") },
  }[status];

  return (
    <motion.div
      key={status}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      className="flex max-w-lg items-start gap-3 rounded-lg border border-border bg-surface p-6"
    >
      {status === "sending" && (
        <span className="mt-0.5 size-5 shrink-0 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      )}
      {status === "success" && <CheckCircleIcon className="mt-0.5 size-5 shrink-0 text-success" />}
      {status === "error" && <ExclamationCircleIcon className="mt-0.5 size-5 shrink-0 text-danger" />}

      <div>
        <p className="font-mono text-sm font-medium text-foreground">
          {copy.title}
          {status === "sending" && <PendingDots />}
        </p>
        <p className="mt-1 text-sm text-foreground-muted">{copy.body}</p>
        {status === "error" && (
          <Button variant="outline" className="mt-4" onClick={onRetry}>
            {t("contact.tryAgain")}
          </Button>
        )}
      </div>
    </motion.div>
  );
}

export function Contact() {
  const { t } = useTranslation();
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = new FormData(e.currentTarget);

    try {
      await api.post("/api/contact", {
        name: form.get("name"),
        email: form.get("email"),
        message: form.get("message"),
      });
      setStatus("success");
    } catch (err) {
      setStatus("error");
      console.error(err instanceof ApiError ? err.message : err);
    }
  }

  return (
    <Section id="contact" title={t("sections.contact")} side="left" tint="primary">
      <AnimatePresence mode="wait">
        {status === "idle" ? (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="max-w-lg space-y-4"
          >
            <div>
              <label htmlFor="name" className="mb-1 block font-mono text-xs text-foreground-muted">
                {t("contact.name")}
              </label>
              <input
                id="name"
                name="name"
                required
                className="w-full rounded-md border border-border bg-surface px-3 py-2 text-foreground outline-none focus:border-primary"
              />
            </div>
            <div>
              <label htmlFor="email" className="mb-1 block font-mono text-xs text-foreground-muted">
                {t("contact.email")}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full rounded-md border border-border bg-surface px-3 py-2 text-foreground outline-none focus:border-primary"
              />
            </div>
            <div>
              <label htmlFor="message" className="mb-1 block font-mono text-xs text-foreground-muted">
                {t("contact.message")}
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                maxLength={5000}
                className="w-full rounded-md border border-border bg-surface px-3 py-2 text-foreground outline-none focus:border-primary"
              />
            </div>
            <Button type="submit">{t("contact.send")}</Button>
          </motion.form>
        ) : (
          <StatusCard status={status} onRetry={() => setStatus("idle")} />
        )}
      </AnimatePresence>
    </Section>
  );
}
