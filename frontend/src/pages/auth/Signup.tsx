import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthShell, Divider } from "./Login";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Signup() {
  const { signUp, signInWithOAuth } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setSubmitting(true);
    const { error: err, needsConfirmation } = await signUp(
      email,
      password,
      fullName,
    );
    setSubmitting(false);
    if (err) {
      setError(err);
      return;
    }
    if (needsConfirmation) {
      setConfirmationSent(true);
      return;
    }
    navigate("/welcome", { replace: true });
  };

  if (confirmationSent) {
    return (
      <AuthShell
        title="Check your inbox"
        subtitle={`We've sent a confirmation link to ${email}. Click it to activate your account.`}
      >
        <Button asChild className="w-full" size="lg">
          <Link to="/login">Go to sign in</Link>
        </Button>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Create account" subtitle="Start building for free.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="fullName">Full name</Label>
          <Input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            autoComplete="name"
          />
        </div>
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
            autoComplete="new-password"
            required
            placeholder="At least 6 characters"
          />
        </div>

        {error && (
          <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-3 py-2 text-xs font-semibold text-destructive">
            {error}
          </div>
        )}

        <Button type="submit" disabled={submitting} className="w-full" size="lg">
          {submitting ? "Creating account…" : "Create account"}
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
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-foreground no-underline hover:underline"
        >
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
