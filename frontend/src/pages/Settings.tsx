import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../lib/supabase";
import { LogOut, Mail, User as UserIcon, KeyRound, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FadeInUp } from "@/components/motion";
import { useUserProfile } from "@/hooks/useUserProfile";
import {
  EXPERIENCE_LEVEL_OPTIONS,
  INDUSTRY_OPTIONS,
  PRIMARY_GOAL_OPTIONS,
  type ExperienceLevel,
  type PrimaryGoal,
} from "@/types/profile";

export default function Settings() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { profile, update: updateProfile } = useUserProfile();

  const [fullName, setFullName] = useState<string>(
    (user?.user_metadata?.full_name as string) || "",
  );
  const [savingName, setSavingName] = useState(false);
  const [nameMsg, setNameMsg] = useState<string | null>(null);

  const [newPassword, setNewPassword] = useState("");
  const [savingPwd, setSavingPwd] = useState(false);
  const [pwdMsg, setPwdMsg] = useState<string | null>(null);

  const [targetRole, setTargetRole] = useState("");
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel | "">("");
  const [yearsExperience, setYearsExperience] = useState("");
  const [industry, setIndustry] = useState("");
  const [primaryGoal, setPrimaryGoal] = useState<PrimaryGoal | "">("");
  const [skills, setSkills] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) return;
    setTargetRole(profile.target_role ?? "");
    setExperienceLevel(profile.experience_level ?? "");
    setYearsExperience(
      profile.years_experience != null ? String(profile.years_experience) : "",
    );
    setIndustry(profile.industry ?? "");
    setPrimaryGoal(profile.primary_goal ?? "");
    setSkills((profile.skills ?? []).join(", "));
    if (profile.full_name) setFullName(profile.full_name);
  }, [profile]);

  const handleSaveName = async (e: FormEvent) => {
    e.preventDefault();
    setSavingName(true);
    setNameMsg(null);
    const { error } = await supabase.auth.updateUser({
      data: { full_name: fullName },
    });
    if (!error) {
      try {
        await updateProfile({ full_name: fullName });
      } catch (err) {
        console.warn("[settings] profile name mirror failed:", err);
      }
    }
    setSavingName(false);
    setNameMsg(error ? error.message : "Saved.");
  };

  const handleSaveProfile = async (e: FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg(null);
    try {
      await updateProfile({
        target_role: targetRole.trim() || null,
        experience_level: experienceLevel || null,
        years_experience:
          yearsExperience && experienceLevel !== "student"
            ? Number(yearsExperience)
            : null,
        industry: industry.trim() || null,
        primary_goal: primaryGoal || null,
        skills: skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      });
      setProfileMsg("Saved.");
    } catch (err) {
      setProfileMsg(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setPwdMsg("Password must be at least 6 characters.");
      return;
    }
    setSavingPwd(true);
    setPwdMsg(null);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setSavingPwd(false);
    if (error) {
      setPwdMsg(error.message);
    } else {
      setPwdMsg("Password updated.");
      setNewPassword("");
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/", { replace: true });
  };

  return (
    <div className="mx-auto max-w-3xl p-8">
      <FadeInUp>
        <h1 className="font-display text-5xl text-foreground">Settings</h1>
        <p className="mt-2 mb-10 text-sm text-muted-foreground">
          Manage your profile and account.
        </p>
      </FadeInUp>

      <Section title="Profile" icon={<UserIcon className="size-4" />}>
        <div className="flex items-center gap-3 rounded-2xl bg-muted px-4 py-3">
          <Mail className="size-4 text-muted-foreground" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Email
          </span>
          <span className="ml-auto text-sm font-semibold text-foreground">
            {user?.email}
          </span>
        </div>

        <form onSubmit={handleSaveName} className="mt-5 space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="fullName">Full name</Label>
            <Input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <Button type="submit" disabled={savingName} size="sm">
              {savingName ? "Saving…" : "Save"}
            </Button>
            {nameMsg && (
              <span className="text-xs text-muted-foreground">{nameMsg}</span>
            )}
          </div>
        </form>
      </Section>

      <Section title="Personalization" icon={<Sparkles className="size-4" />}>
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="targetRole">Target role</Label>
            <Input
              id="targetRole"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Senior Backend Engineer"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Experience level</Label>
              <Select
                value={experienceLevel || undefined}
                onValueChange={(v) => setExperienceLevel(v as ExperienceLevel)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a level" />
                </SelectTrigger>
                <SelectContent>
                  {EXPERIENCE_LEVEL_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="yearsExperience">Years of experience</Label>
              <Input
                id="yearsExperience"
                type="number"
                min={0}
                max={60}
                value={yearsExperience}
                onChange={(e) => setYearsExperience(e.target.value)}
                disabled={experienceLevel === "student"}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Industry</Label>
              <Select value={industry || undefined} onValueChange={setIndustry}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an industry" />
                </SelectTrigger>
                <SelectContent>
                  {INDUSTRY_OPTIONS.map((o) => (
                    <SelectItem key={o} value={o}>
                      {o}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Primary goal</Label>
              <Select
                value={primaryGoal || undefined}
                onValueChange={(v) => setPrimaryGoal(v as PrimaryGoal)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a goal" />
                </SelectTrigger>
                <SelectContent>
                  {PRIMARY_GOAL_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="skills">Skills (comma-separated)</Label>
            <Input
              id="skills"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g. Python, React, AWS"
            />
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={savingProfile} size="sm">
              {savingProfile ? "Saving…" : "Save personalization"}
            </Button>
            {profileMsg && (
              <span className="text-xs text-muted-foreground">{profileMsg}</span>
            )}
          </div>
        </form>
      </Section>

      <Section title="Password" icon={<KeyRound className="size-4" />}>
        <form onSubmit={handleChangePassword} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="newPassword">New password</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 6 characters"
            />
          </div>
          <div className="flex items-center gap-3">
            <Button type="submit" disabled={savingPwd} size="sm">
              {savingPwd ? "Updating…" : "Update password"}
            </Button>
            {pwdMsg && (
              <span className="text-xs text-muted-foreground">{pwdMsg}</span>
            )}
          </div>
        </form>
      </Section>

      <Section title="Session">
        <Button variant="outline" size="sm" onClick={handleSignOut}>
          <LogOut className="size-4" /> Sign out
        </Button>
      </Section>
    </div>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="shadow-ring mb-5 rounded-3xl bg-card p-6">
      <h2 className="mb-5 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
        {icon}
        {title}
      </h2>
      {children}
    </section>
  );
}
