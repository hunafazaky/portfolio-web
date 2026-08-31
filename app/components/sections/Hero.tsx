import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { LinkButton } from "~/components/ui/Button";
import { Container } from "~/components/ui/Container";
import type { Profile } from "~/lib/types";

export function Hero({ profile }: { profile: Profile }) {
  const { t } = useTranslation();
  return (
    <section className="bg-grid border-b border-border py-24">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p className="mb-3 font-mono text-sm text-primary">{profile.title}</p>
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
            {profile.name}
          </h1>

          {profile.speed_read && (
            <p className="mt-6 max-w-xl border-l-2 border-primary pl-4 font-mono text-sm text-foreground-muted">
              {profile.speed_read}
            </p>
          )}

          {profile.resume_pdf_url && (
            <LinkButton
              href={profile.resume_pdf_url}
              target="_blank"
              rel="noreferrer"
              className="mt-8"
            >
              <ArrowDownTrayIcon className="size-4" />
              {t("hero.downloadResume")}
            </LinkButton>
          )}
        </motion.div>
      </Container>
    </section>
  );
}
