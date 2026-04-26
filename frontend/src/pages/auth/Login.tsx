import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FileCheck2 } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LocationState {
  from?: string;
}

export default function Login() {
  const { signIn, signInWithOAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as LocationState | null)?.from ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error: err } = await signIn(email, password);
    setSubmitting(false);
    if (err) {
      setError(err);
      return;
    }
    navigate(redirectTo, { replace: true });
  };

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to your account.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>

        {error && (
          <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-3 py-2 text-xs font-semibold text-destructive">
            {error}
          </div>
        )}

        <Button type="submit" disabled={submitting} className="w-full" size="lg">
          {submitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <Divider />

      <Button
        type="button"
        variant="outline"
        size="lg"
        className="w-full"
        onClick={() => signInWithOAuth("google")}
      >
        Continue with Google
      </Button>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Don't have an account?{" "}
        <Link
          to="/signup"
          className="font-semibold text-foreground no-underline hover:underline"
        >
          Sign up
        </Link>
      </p>
    </AuthShell>
  );
}

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-10">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 -top-40 size-[500px] rounded-full opacity-50 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(159,232,112,0.55) 0%, transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -right-40 size-[400px] rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(205,255,173,0.55) 0%, transparent 70%)",
        }}
      />
      <div className="relative w-full max-w-md">
        <Link
          to="/"
          className="mb-8 flex items-center gap-2 no-underline text-foreground"
        >
          <div className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <FileCheck2 className="size-4" />
          </div>
          <span className="font-display text-lg">Resume</span>
        </Link>

        <div className="shadow-ring rounded-[30px] bg-card p-8">
          <h1 className="font-display text-4xl text-foreground">{title}</h1>
          {subtitle && (
            <p className="mt-2 mb-7 text-sm text-muted-foreground">
              {subtitle}
            </p>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}

export function Divider() {
  return (
    <div className="my-5 flex items-center gap-3">
      <div className="h-px flex-1 bg-[rgba(14,15,12,0.08)]" />
      <span className="text-[11px] font-medium text-muted-foreground">or</span>
      <div className="h-px flex-1 bg-[rgba(14,15,12,0.08)]" />
    </div>
  );
}
