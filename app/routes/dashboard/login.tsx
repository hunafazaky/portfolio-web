import { useTranslation } from "react-i18next";
import { GlobeAltIcon } from "@heroicons/react/24/outline";
import { Button } from "~/components/ui/Button";
import { loginWithGitHub } from "~/lib/auth";

export default function DashboardLogin() {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm border border-border rounded-lg p-8 text-center">
        <GlobeAltIcon className="mx-auto mb-4 size-8 text-primary" />
        <h1 className="mb-6 font-mono text-lg font-semibold text-foreground">
          Dashboard
        </h1>
        <Button onClick={loginWithGitHub} className="w-full justify-center">
          {t("dashboard.login")}
        </Button>
      </div>
    </div>
  );
}
