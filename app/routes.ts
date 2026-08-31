import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),

  route("dashboard/login", "routes/dashboard/login.tsx"),

  layout("routes/dashboard/layout.tsx", [
    route("dashboard", "routes/dashboard/overview.tsx"),
    route("dashboard/profile", "routes/dashboard/profile.tsx"),
    route("dashboard/experiences", "routes/dashboard/experiences.tsx"),
    route("dashboard/projects", "routes/dashboard/projects.tsx"),
    route("dashboard/education", "routes/dashboard/education.tsx"),
    route("dashboard/skills", "routes/dashboard/skills.tsx"),
    route("dashboard/certificates", "routes/dashboard/certificates.tsx"),
    route("dashboard/messages", "routes/dashboard/messages.tsx"),
  ]),
] satisfies RouteConfig;
