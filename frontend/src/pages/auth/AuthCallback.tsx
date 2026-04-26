import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function AuthCallback() {
  const { session, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    // OnboardingGate will forward completed users from /welcome → /dashboard.
    navigate(session ? "/welcome" : "/login", { replace: true });
  }, [session, loading, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
        <span className="size-2 animate-pulse rounded-full bg-primary" />
        Signing you in…
      </div>
    </div>
  );
}
