import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { getSession } from "~/lib/auth";
import { Sidebar } from "~/components/dashboard/Sidebar";

// Every /dashboard/* route except /dashboard/login renders through this
// layout, which gates access on a valid session cookie. There's no
// server-side redirect available (SPA mode, static hosting) — this is a
// client-side check on mount, which is the correct trade-off here since
// the data itself is still protected server-side by RequireAuth on the
// API; this guard is about UX, not the actual security boundary.
export default function DashboardLayout() {
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getSession().then((session) => {
      if (cancelled) return;
      if (!session) {
        navigate("/dashboard/login", { replace: true });
      } else {
        setChecked(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  if (!checked) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="font-mono text-sm text-foreground-muted">Loading…</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
