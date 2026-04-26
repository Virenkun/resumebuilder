import { Navigate, Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAuth } from "../../hooks/useAuth";
import { FadeIn } from "@/components/motion";

function AppLayout() {
  const { session, loading } = useAuth();
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

  if (!session) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="min-w-0 flex-1">
        <FadeIn duration={0.25} once={false} key={location.pathname}>
          <Outlet />
        </FadeIn>
      </main>
    </div>
  );
}

export default AppLayout;
