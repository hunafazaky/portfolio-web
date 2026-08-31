import type { Config } from "@react-router/dev/config";

export default {
  // SPA mode: static build only, no Node server — required for GitHub
  // Pages hosting. See portfolio-frontend-context.md for why.
  ssr: false,

  // Every route has a fixed path (no dynamic params), so all of them are
  // listed here to prerender — this generates a real index.html at each
  // path (e.g. build/client/dashboard/login/index.html), which is what
  // fixes GitHub Pages 404ing on /dashboard and /dashboard/login: without
  // this, those paths only exist as client-side routes, with no matching
  // file for GitHub Pages to serve on a direct visit or refresh.
  prerender: [
    "/",
    "/dashboard/login",
    "/dashboard/callback",
    "/dashboard",
    "/dashboard/profile",
    "/dashboard/experiences",
    "/dashboard/projects",
    "/dashboard/education",
    "/dashboard/skills",
    "/dashboard/certificates",
    "/dashboard/messages",
  ],
} satisfies Config;
