import { supabase } from "../lib/supabase";
import type { UserProfile } from "../types/profile";

const TABLE = "user_profiles";

async function requireUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    throw new Error("Not authenticated");
  }
  return data.user.id;
}

export async function getMyProfile(): Promise<UserProfile | null> {
  const userId = await requireUserId();
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return (data as UserProfile) ?? null;
}

export async function ensureProfileRow(): Promise<UserProfile> {
  const userId = await requireUserId();
  const existing = await getMyProfile();
  if (existing) return existing;
  const { data, error } = await supabase
    .from(TABLE)
    .insert({ user_id: userId })
    .select("*")
    .single();
  if (error) throw error;
  return data as UserProfile;
}

export async function upsertMyProfile(
  patch: Partial<Omit<UserProfile, "user_id" | "created_at" | "updated_at">>,
): Promise<UserProfile> {
  const userId = await requireUserId();
  const { data, error } = await supabase
    .from(TABLE)
    .upsert({ user_id: userId, ...patch }, { onConflict: "user_id" })
    .select("*")
    .single();
  if (error) throw error;
  return data as UserProfile;
}

export async function completeOnboarding(
  patch: Partial<Omit<UserProfile, "user_id" | "created_at" | "updated_at">>,
): Promise<UserProfile> {
  return upsertMyProfile({
    ...patch,
    onboarding_completed: true,
    onboarding_completed_at: new Date().toISOString(),
  });
}
