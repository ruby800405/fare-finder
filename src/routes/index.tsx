import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Plane, Bell, CircleSlash2, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Flight Price Notifier · 機票降價通知" },
      {
        name: "description",
        content:
          "設定航線與目標價，機票降價就通知你。Set a route and a target price — we email you when the fare drops.",
      },
      { property: "og:title", content: "Flight Price Notifier · 機票降價通知" },
      {
        property: "og:description",
        content:
          "設定航線與目標價，機票降價就通知你。We watch fares from Taipei and email you when they hit your target price.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: LandingPage,
});

function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={visible ? "reveal reveal-visible" : "reveal"}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

const FEATURES = [
  {
    icon: Plane,
    title: "盯緊熱門航線",
    subtitle: "Always-on route watching",
    description: "持續監控台北出發的熱門航線（東京、首爾），自動抓最低票價。",
  },
  {
    icon: Bell,
    title: "達標自動通知",
    subtitle: "Target-price email alerts",
    description: "低於你設定的目標價，就寄 email 提醒你，附上立即訂購連結。",
  },
  {
    icon: CircleSlash2,
    title: "隨時取消",
    subtitle: "Cancel anytime",
    description: "月訂閱制，不想用隨時停，沒有綁約。",
  },
];

function Header() {
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSignedIn(Boolean(data.session));
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") setSignedIn(true);
      if (event === "SIGNED_OUT") setSignedIn(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-20 border-b border-border/60 bg-background/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Plane className="size-4" />
          </span>
          <span className="text-sm font-semibold tracking-tight">
            Flight Price Notifier
          </span>
        </Link>
        <Link
          to={signedIn ? "/dashboard" : "/auth"}
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25 transition hover:bg-primary/90"
        >
          {signedIn ? "Dashboard" : "Sign in / 登入"}
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </header>
  );
}

function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Hero */}
      <section className="glow-violet relative overflow-hidden">
        <div className="mx-auto max-w-5xl px-6 pb-24 pt-24 text-center sm:pt-32">
          <p className="animate-fade-up mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground">
            <Plane className="size-3 text-primary" />
            台北出發 · 東京 / 首爾 熱門航線
          </p>
          <h1
            className="animate-fade-up text-4xl font-extrabold tracking-tight sm:text-6xl"
            style={{ animationDelay: "80ms" }}
          >
            Flight Price Notifier
          </h1>
          <p
            className="animate-fade-up mt-6 text-xl font-medium sm:text-2xl"
            style={{ animationDelay: "160ms" }}
          >
            設定航線與目標價，機票降價就通知你
          </p>
          <p
            className="animate-fade-up mx-auto mt-3 max-w-xl text-base text-muted-foreground"
            style={{ animationDelay: "240ms" }}
          >
            Set a route and a target price — we email you when the fare drops.
          </p>
          <div
            className="animate-fade-up mt-10"
            style={{ animationDelay: "320ms" }}
          >
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground shadow-xl shadow-primary/30 transition hover:scale-[1.02] hover:bg-primary/90"
            >
              Sign in / 登入
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-6 pb-28">
        <div className="grid gap-5 sm:grid-cols-3">
          {FEATURES.map((feature, i) => (
            <Reveal key={feature.title} delay={i * 120}>
              <div className="h-full rounded-2xl border border-border bg-card p-7 transition-colors hover:border-primary/40">
                <span className="mb-5 inline-flex size-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <feature.icon className="size-5" />
                </span>
                <h2 className="text-lg font-semibold">{feature.title}</h2>
                <p className="mt-1 text-sm font-medium text-primary/90">
                  {feature.subtitle}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <footer className="border-t border-border/60">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-center px-6 text-sm text-muted-foreground">
          © 2026 Flight Price Notifier
        </div>
      </footer>
    </div>
  );
}
