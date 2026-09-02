import { Link, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Plane, LogOut, Radar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/lib/auth-context";
import { usePageMeta } from "@/lib/use-page-meta";

export default function DashboardPage() {
  usePageMeta({
    title: "Dashboard · Flight Price Notifier",
    description: "Manage your fare alerts. 管理你的機票降價通知。",
    robots: "noindex",
  });

  const { user } = useAuthContext();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate("/sign-in", { replace: true });
  }

  return (
    <div className="glow-pool min-h-screen bg-background text-foreground">
      <header className="border-b border-border/60 bg-background/70 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <Link to="/app" className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <Plane className="size-4" />
            </span>
            <span className="text-sm font-semibold tracking-tight">
              Flight Price Notifier
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-muted-foreground sm:block">
              {user.email}
            </span>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium transition hover:border-primary/40 hover:text-primary"
            >
              <LogOut className="size-3.5" />
              Sign out / 登出
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-16">
        <div className="animate-fade-up">
          <h1 className="text-3xl font-bold tracking-tight">你的降價通知</h1>
          <p className="mt-2 text-muted-foreground">
            Welcome back — your fare alerts will live here.
          </p>
        </div>

        <div className="animate-fade-up mt-10 flex flex-col items-center justify-center rounded-2xl border border-dashed border-input bg-card/70 px-6 py-20 text-center" style={{ animationDelay: "120ms" }}>
          <span className="mb-5 inline-flex size-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <Radar className="size-6" />
          </span>
          <h2 className="text-lg font-semibold">還沒有追蹤的航線</h2>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
            航線訂閱與目標價設定即將上線 — you'll soon be able to watch routes
            like 台北 → 東京 and get emailed when fares drop to your target price.
          </p>
        </div>
      </main>
    </div>
  );
}
