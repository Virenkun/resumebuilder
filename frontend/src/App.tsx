import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import AppLayout from "./components/layout/AppLayout";
import OnboardingGate from "./components/layout/OnboardingGate";
import PublicOnlyRoute from "./components/layout/PublicOnlyRoute";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import AuthCallback from "./pages/auth/AuthCallback";

import Dashboard from "./pages/Dashboard";
import Onboarding from "./pages/Onboarding";
import Welcome from "./pages/Welcome";
import CreateResume from "./pages/CreateResume";
import Editor from "./pages/Editor";
import Preview from "./pages/Preview";
import TailorDiff from "./pages/TailorDiff";
import TailorPicker from "./pages/TailorPicker";
import ATSScore from "./pages/ATSScore";
import Templates from "./pages/Templates";
import Settings from "./pages/Settings";

function App() {
  return (
    <AuthProvider>
      <TooltipProvider>
        <Router>
          <div className="min-h-screen bg-background text-foreground">
            <Routes>
              {/* Public routes — redirect to /dashboard if already signed in */}
              <Route element={<PublicOnlyRoute />}>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
              </Route>

              {/* OAuth callback — no redirect guard */}
              <Route path="/auth/callback" element={<AuthCallback />} />

              {/* Protected app — wrapped by AppLayout (sidebar + auth guard) */}
              <Route element={<AppLayout />}>
                {/* /welcome runs inside AppLayout but outside OnboardingGate
                    so that the gate does not redirect /welcome → /welcome. */}
                <Route path="/welcome" element={<Welcome />} />

                <Route element={<OnboardingGate />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/onboarding" element={<Onboarding />} />
                  <Route path="/create" element={<CreateResume />} />
                  <Route path="/editor" element={<Editor />} />
                  <Route path="/editor/:id" element={<Editor />} />
                  <Route path="/preview" element={<Preview />} />
                  <Route path="/preview/:id" element={<Preview />} />
                  <Route path="/tailor" element={<TailorPicker />} />
                  <Route path="/tailor/:id" element={<TailorDiff />} />
                  <Route path="/score" element={<ATSScore />} />
                  <Route path="/score/:id" element={<ATSScore />} />
                  <Route path="/templates" element={<Templates />} />
                  <Route path="/settings" element={<Settings />} />
                </Route>
              </Route>
            </Routes>
          </div>
          <Toaster richColors position="top-right" />
        </Router>
      </TooltipProvider>
    </AuthProvider>
  );
}

export default App;
