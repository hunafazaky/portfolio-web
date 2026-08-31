import { NavLink } from "react-router";
import { useTranslation } from "react-i18next";
import {
  Squares2X2Icon,
  UserIcon,
  BriefcaseIcon,
  FolderIcon,
  AcademicCapIcon,
  WrenchScrewdriverIcon,
  TrophyIcon,
  EnvelopeIcon,
  ArrowLeftStartOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { logout } from "~/lib/auth";

type NavItem = {
  to: string;
  label: string;
  icon: typeof Squares2X2Icon;
  end?: boolean;
};

const items: NavItem[] = [
  { to: "/dashboard", label: "overview", icon: Squares2X2Icon, end: true },
  { to: "/dashboard/profile", label: "profile", icon: UserIcon },
  { to: "/dashboard/experiences", label: "experiences", icon: BriefcaseIcon },
  { to: "/dashboard/projects", label: "projects", icon: FolderIcon },
  { to: "/dashboard/education", label: "education", icon: AcademicCapIcon },
  { to: "/dashboard/skills", label: "skills", icon: WrenchScrewdriverIcon },
  { to: "/dashboard/certificates", label: "certificates", icon: TrophyIcon },
  { to: "/dashboard/messages", label: "messages", icon: EnvelopeIcon },
];

export function Sidebar() {
  const { t } = useTranslation();

  async function handleLogout() {
    await logout();
    window.location.href = "/dashboard/login";
  }

  return (
    <aside className="flex h-screen w-56 shrink-0 flex-col border-r border-border bg-surface">
      <div className="border-b border-border px-4 py-5 font-mono text-sm font-semibold text-foreground">
        dashboard
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-md px-3 py-2 font-mono text-sm transition-colors ${
                isActive ? "bg-primary text-background" : "text-foreground-muted hover:bg-surface-alt"
              }`
            }
          >
            <Icon className="size-4" />
            {t(`dashboard.${label}`)}
          </NavLink>
        ))}
      </nav>
      <button
        onClick={handleLogout}
        className="m-3 flex items-center gap-2 rounded-md px-3 py-2 font-mono text-sm text-foreground-muted hover:bg-surface-alt"
      >
        <ArrowLeftStartOnRectangleIcon className="size-4" />
        {t("dashboard.logout")}
      </button>
    </aside>
  );
}
