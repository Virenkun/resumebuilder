import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "./useAuth";
import {
  completeOnboarding,
  ensureProfileRow,
  getMyProfile,
  upsertMyProfile,
} from "../services/userProfile";
import type { UserProfile } from "../types/profile";

interface State {
  profile: UserProfile | null;
  loading: boolean;
  error: Error | null;
}

export function useUserProfile() {
  const { user } = useAuth();
  const [state, setState] = useState<State>({
    profile: null,
    loading: true,
    error: null,
  });
  const currentUserId = useRef<string | null>(null);

  const load = useCallback(async () => {
    if (!user) {
      currentUserId.current = null;
      setState({ profile: null, loading: false, error: null });
      return;
    }
    currentUserId.current = user.id;
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      let profile = await getMyProfile();
      if (!profile) {
        profile = await ensureProfileRow();
      }
      if (currentUserId.current === user.id) {
        setState({ profile, loading: false, error: null });
      }
    } catch (e) {
      if (currentUserId.current === user.id) {
        setState({
          profile: null,
          loading: false,
          error: e instanceof Error ? e : new Error(String(e)),
        });
      }
    }
  }, [user]);

  useEffect(() => {
    void load();
  }, [load]);

  const update = useCallback(
    async (patch: Partial<UserProfile>) => {
      const next = await upsertMyProfile(patch);
      setState((s) => ({ ...s, profile: next }));
      return next;
    },
    [],
  );

  const complete = useCallback(async (patch: Partial<UserProfile>) => {
    const next = await completeOnboarding(patch);
    setState((s) => ({ ...s, profile: next }));
    return next;
  }, []);

  return {
    profile: state.profile,
    loading: state.loading,
    error: state.error,
    refresh: load,
    update,
    complete,
  };
}
