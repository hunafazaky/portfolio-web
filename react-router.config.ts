import type { Config } from "@react-router/dev/config";

export default {
  // SPA mode: static build only, no Node server — required for GitHub
  // Pages hosting. See portfolio-frontend-context.md for why.
  ssr: false,
} satisfies Config;
