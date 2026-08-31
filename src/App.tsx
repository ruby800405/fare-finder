import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthPage from "./pages/Auth";
import DashboardPage from "./pages/Dashboard";
import LandingPage from "./pages/Landing";
import NotFoundPage from "./pages/NotFound";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<LandingPage />} />

            {/* Sign-in and sign-up are the same page in two modes, so each one
                is directly linkable while the UI stays exactly as it was. */}
            <Route path="/sign-in" element={<AuthPage mode="signin" />} />
            <Route path="/sign-up" element={<AuthPage mode="signup" />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/app" element={<DashboardPage />} />
            </Route>

            {/* Legacy paths from the TanStack Start version. */}
            <Route path="/auth" element={<Navigate to="/sign-in" replace />} />
            <Route path="/dashboard" element={<Navigate to="/app" replace />} />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
