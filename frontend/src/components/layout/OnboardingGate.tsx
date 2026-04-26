import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUserProfile } from "@/hooks/useUserProfile";

export default function OnboardingGate() {
  const { profile, loading, error } = useUserProfile();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
          <span className="size-2 animate-pulse rounded-full bg-primary" />
          Loading…
        </div>
      </div>
    );
  }

  if (error) {
    // Fail open: don't block the app if the profile query failed; the user can
    // still reach Settings and retry. Log for debugging.
    console.warn("[OnboardingGate] profile load failed:", error);
    return <Outlet />;
  }

  if (profile && !profile.onboarding_completed && location.pathname !== "/welcome") {
    return <Navigate to="/welcome" replace />;
  }

  return <Outlet />;
}
