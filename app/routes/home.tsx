import type { Route } from "./+types/home";
import { useLang } from "~/lib/language";
import { usePortfolioData } from "~/hooks/usePortfolioData";
import { Nav } from "~/components/layout/Nav";
import { Footer } from "~/components/layout/Footer";
import { Hero } from "~/components/sections/Hero";
import { Summary } from "~/components/sections/Summary";
import { Experience } from "~/components/sections/Experience";
import { Project } from "~/components/sections/Project";
import { Education } from "~/components/sections/Education";
import { Skill } from "~/components/sections/Skill";
import { Certificate } from "~/components/sections/Certificate";
import { Contact } from "~/components/sections/Contact";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "hunafazaky" },
    { name: "description", content: "Portfolio of hunafazaky." },
  ];
}

export default function Home() {
  const { lang } = useLang();
  const { data, error } = usePortfolioData(lang);

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6 text-center">
        <p className="font-mono text-sm text-danger">
          Failed to load portfolio data: {error.message}
        </p>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="font-mono text-sm text-foreground-muted">Loading…</p>
      </main>
    );
  }

  return (
    <>
      <Nav />
      <main>
        <Hero profile={data.profile} />
        <Summary profile={data.profile} />
        <Experience experiences={data.experiences} />
        <Project projects={data.projects} />
        <Education education={data.education} />
        <Skill skills={data.skills} />
        <Certificate certificates={data.certificates} />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
