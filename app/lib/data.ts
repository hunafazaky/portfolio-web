// Dev/prod data-source split — the whole point of the rebuild-on-save
// architecture (see portfolio-frontend-context.md). Every function here
// has the same shape regardless of environment; components never branch
// on this themselves.
//
// DEV: fetch the live API directly (import.meta.env.DEV).
// PROD: statically import the JSON scripts/fetch-data.mjs generated at
// build time — zero runtime API calls, so Render's cold start never
// touches a visitor.
//
// Static imports are written out explicitly per language file (rather
// than a dynamic `import(\`...${lang}.json\`)`) so Vite/Rollup can bundle
// them reliably — a templated dynamic import path isn't guaranteed to be
// statically analyzable.

import { api } from "./api";
import type {
  Profile,
  Experience,
  Project,
  Education,
  Skill,
  Certificate,
} from "./types";

export type Lang = "en" | "id";

async function loadBilingual<T>(
  lang: Lang,
  devPath: string,
  loadEn: () => Promise<{ default: T }>,
  loadId: () => Promise<{ default: T }>,
): Promise<T> {
  if (import.meta.env.DEV) {
    return api.get<T>(`${devPath}?lang=${lang}`);
  }
  const mod = lang === "id" ? await loadId() : await loadEn();
  return mod.default as T;
}

async function loadUniversal<T>(
  devPath: string,
  loadStatic: () => Promise<{ default: T }>,
): Promise<T> {
  if (import.meta.env.DEV) {
    return api.get<T>(devPath);
  }
  const mod = await loadStatic();
  return mod.default as T;
}

export const getProfile = (lang: Lang = "en") =>
  loadBilingual<Profile>(
    lang,
    "/api/profile",
    () => import("~/data/profile.en.json"),
    () => import("~/data/profile.id.json"),
  );

export const getExperiences = (lang: Lang = "en") =>
  loadBilingual<Experience[]>(
    lang,
    "/api/experiences",
    () => import("~/data/experiences.en.json"),
    () => import("~/data/experiences.id.json"),
  );

export const getProjects = (lang: Lang = "en") =>
  loadBilingual<Project[]>(
    lang,
    "/api/projects",
    () => import("~/data/projects.en.json"),
    () => import("~/data/projects.id.json"),
  );

export const getEducation = (lang: Lang = "en") =>
  loadBilingual<Education[]>(
    lang,
    "/api/education",
    () => import("~/data/education.en.json"),
    () => import("~/data/education.id.json"),
  );

// Skills and certificates have no bilingual fields — one file, no lang param.
export const getSkills = () =>
  loadUniversal<Skill[]>("/api/skills", () => import("~/data/skills.json"));

export const getCertificates = () =>
  loadUniversal<Certificate[]>(
    "/api/certificates",
    () => import("~/data/certificates.json"),
  );
