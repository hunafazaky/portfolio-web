// Fetches all public data in parallel and re-fetches whenever the
// language changes. This is deliberately a plain useEffect hook rather
// than a React Router clientLoader — clientLoaders run outside the
// component tree (no context/hooks access), but the language choice lives
// in React context (lib/language.tsx) and needs to trigger a re-fetch
// reactively when the visitor flips the switcher, without a navigation.

import { useEffect, useState } from "react";
import {
  getProfile,
  getExperiences,
  getProjects,
  getEducation,
  getSkills,
  getCertificates,
  type Lang,
} from "~/lib/data";
import type { Profile, Experience, Project, Education, Skill, Certificate } from "~/lib/types";

type PortfolioData = {
  profile: Profile;
  experiences: Experience[];
  projects: Project[];
  education: Education[];
  skills: Skill[];
  certificates: Certificate[];
};

export function usePortfolioData(lang: Lang) {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    setError(null);

    Promise.all([
      getProfile(lang),
      getExperiences(lang),
      getProjects(lang),
      getEducation(lang),
      getSkills(),
      getCertificates(),
    ])
      .then(([profile, experiences, projects, education, skills, certificates]) => {
        if (!cancelled) setData({ profile, experiences, projects, education, skills, certificates });
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err : new Error("failed to load portfolio data"));
      });

    return () => {
      cancelled = true;
    };
  }, [lang]);

  return { data, error };
}
