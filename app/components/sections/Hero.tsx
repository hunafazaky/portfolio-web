import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { LinkButton } from "~/components/ui/Button";
import { Container } from "~/components/ui/Container";
import { ContourDivider } from "~/components/ui/ContourDivider";
import { GitHubIcon, LinkedInIcon } from "~/components/ui/BrandIcons";
import type { Profile } from "~/lib/types";

// TODO: not backed by the CMS yet — profile.ts (backend) has no
// github_url/linkedin_url fields, and adding them means a schema
// migration + admin form update on that side. Hardcoded here to keep this
// change scoped to the frontend; update LINKEDIN_URL to your real profile,
// and wire these to the backend later if you want them dashboard-editable.
const GITHUB_URL = "https://github.com/hunafazaky";
const LINKEDIN_URL = "https://linkedin.com/in/hunafazaky";

export function Hero({ profile }: { profile: Profile }) {
  const { t } = useTranslation();
  return (
    <>
      <section className="bg-grid flex min-h-screen items-center py-24">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <p className="mb-3 font-mono text-sm text-primary">{profile.title}</p>
            <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
              {profile.name}
            </h1>

            {profile.speed_read && (
              <p className="mt-6 max-w-xl border-l-2 border-primary pl-4 font-mono text-sm text-foreground-muted">
                {profile.speed_read}
              </p>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {profile.resume_pdf_url && (
                <LinkButton href={profile.resume_pdf_url} target="_blank" rel="noreferrer">
                  <ArrowDownTrayIcon className="size-4" />
                  {t("hero.downloadResume")}
                </LinkButton>
              )}
              <LinkButton href={GITHUB_URL} target="_blank" rel="noreferrer" variant="outline">
                <GitHubIcon className="size-4" />
                GitHub
              </LinkButton>
              <LinkButton href={LINKEDIN_URL} target="_blank" rel="noreferrer" variant="outline">
                <LinkedInIcon className="size-4" />
                LinkedIn
              </LinkButton>
            </div>
          </motion.div>
        </Container>
      </section>
      <ContourDivider />
    </>
  );
}
