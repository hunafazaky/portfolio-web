import type { Config } from "@react-router/dev/config";

export default {
  // SPA mode: static build only, no Node server — required for GitHub
  // Pages hosting. See portfolio-frontend-context.md for why.
  ssr: false,
  prerender: [
    "/",
    "/dashboard/login",
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
