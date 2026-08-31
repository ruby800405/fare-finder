import type { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { supabase } from "@/integrations/supabase/client";
import type { AuthContext } from "@/lib/auth-context";

/**
 * Client-side replacement for the `_authenticated` layout route's `beforeLoad`
 * guard. Same rule: no valid Supabase user means a redirect to the sign-in page.
 */
export default function ProtectedRoute() {
  const [user, setUser] = useState<User | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let active = true;

    supabase.auth
      .getUser()
      .then(({ data, error }) => {
        if (!active) return;
        setUser(error ? null : data.user);
      })
      .catch(() => {
        // Network failure while validating the session — treat as signed out
        // rather than leaving the route stuck on the loading shell.
        if (active) setUser(null);
      })
      .finally(() => {
        if (active) setChecked(true);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") setUser(null);
      if (session?.user) setUser(session.user);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  // Hold the shell until the session check resolves, so a signed-in user never
  // sees a flash of the sign-in page on a hard load of /app.
  if (!checked) return <div className="min-h-screen bg-background" />;
  if (!user) return <Navigate to="/sign-in" replace />;

  return <Outlet context={{ user } satisfies AuthContext} />;
}
