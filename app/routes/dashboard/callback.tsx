import { useEffect } from "react";
import { useNavigate } from "react-router";
import { setToken } from "~/lib/auth";

// The API's OAuth callback redirects here with #token=<jwt> in the URL
// fragment (never sent to any server, never logged — see
// portfolio-backend's auth_handler.go Callback for why a fragment). This
// page's only job is to grab it, store it, and move on.
export default function DashboardCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.slice(1));
    const token = params.get("token");

    if (token) {
      setToken(token);
      navigate("/dashboard", { replace: true });
    } else {
      navigate("/dashboard/login", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="font-mono text-sm text-foreground-muted">Signing in…</p>
    </div>
  );
}
