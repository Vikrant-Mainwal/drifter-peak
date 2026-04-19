import { supabase } from "@/lib/db/supabase";
import type { UserProfile } from "@/types/auth.types";

export const AuthService = {

  async sendMagicLink(email: string) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: "http://localhost:3000", // change in prod
    },
  });

  return { error: error?.message ?? null };
},

  // Step 1: send OTP to email
  async sendOtp(email: string): Promise<{ error: string | null }> {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });
    return { error: error?.message ?? null };
  },

  // Step 2: verify OTP
  async verifyOtp(email: string, token: string): Promise<{ error: string | null }> {
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    });
    return { error: error?.message ?? null };
  },

  // Get profile with role from profiles table
  async getProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    if (error || !data) return null;
    return data as UserProfile;
  },

  async signOut(): Promise<void> {
    await supabase.auth.signOut();
  },

  // Listen to auth changes — call in useAuth hook
  onAuthStateChange(cb: (userId: string | null) => void) {
    return supabase.auth.onAuthStateChange((_, session) => {
      cb(session?.user?.id ?? null);
    });
  },
};