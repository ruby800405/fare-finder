import type { User } from "@supabase/supabase-js";
import { useOutletContext } from "react-router-dom";

export type AuthContext = { user: User };

/**
 * Reads the authenticated user that `<ProtectedRoute />` supplies to its
 * children — the client-side stand-in for `Route.useRouteContext()`.
 */
export function useAuthContext() {
  return useOutletContext<AuthContext>();
}
