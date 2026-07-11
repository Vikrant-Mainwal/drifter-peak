"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import type { UserProfile } from "@/types/auth.types";

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  isLoggedIn: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// One Supabase client for the whole app. Every previous hook (useAuth,
// useUserRole, and several page-level `createClient()` calls) was creating
// its own client + its own `onAuthStateChange` listener. Those listeners
// raced independently on every login/logout/tab-focus, which is why the UI
// could go stale until a hard refresh. Now there's exactly one.
const supabase = createClient();

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Prevents a duplicate initial fetch: onAuthStateChange fires once
  // immediately on subscribe (INITIAL_SESSION) in addition to the explicit
  // getSession() call below.
  const initialized = useRef(false);

  // Tracks the last known user id purely for the TOKEN_REFRESHED check
  // below — kept as a ref (not the `user` dependency itself) so the
  // onAuthStateChange subscription is set up exactly once, not torn down
  // and recreated on every login/logout.
  const lastUserId = useRef<string | null>(null);

  const fetchProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, phone, name, email, photo_url, dob, gender")
      .eq("id", userId)
      .single();

    if (error) {
      setProfile(null);
      return;
    }

    setProfile(data as UserProfile);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    await fetchProfile(user.id);
  }, [user, fetchProfile]);

  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const currentUser = session?.user ?? null;
      setUser(currentUser);
      lastUserId.current = currentUser?.id ?? null;

      if (currentUser) {
        await fetchProfile(currentUser.id);
      }

      initialized.current = true;
      setLoading(false);
    };

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Skip the event that fires synchronously on subscribe — init()
      // above already handles the first load.
      if (!initialized.current) return;

      const currentUser = session?.user ?? null;
      // Supabase's browser client re-validates/refreshes the session
      // whenever the tab/window regains focus, firing a TOKEN_REFRESHED
      // event with a brand-new `user` object even though the logged-in
      // user hasn't changed. Every effect elsewhere that depends on `user`
      // (cart sync, address sync) would see that as "the user changed" and
      // needlessly re-run — which is why the cart used to flash back to a
      // loading state just from switching windows. When it's really the
      // same user, we don't touch state at all so those effects don't fire.
      if (event === "TOKEN_REFRESHED" && currentUser?.id === lastUserId.current) {
        return;
      }
 
      lastUserId.current = currentUser?.id ?? null;
      setUser(currentUser);
 
      if (currentUser) {
        await fetchProfile(currentUser.id);
      } else {
        setProfile(null);
      }
 
      setLoading(false);
    });
 
    return () => subscription.unsubscribe();
  }, [fetchProfile]);
 
  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    lastUserId.current = null;
    setUser(null);
    setProfile(null);
  }, []);

  const value: AuthContextValue = {
    user,
    profile,
    isLoggedIn: !!user,
    loading,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an <AuthProvider>");
  }
  return ctx;
}
