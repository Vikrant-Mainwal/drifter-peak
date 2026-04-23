import { createClient } from "@/lib/supabase/client";
import type { UserProfile } from "@/types/auth.types";

export const AuthService = {

  async sendMagicLink(email: string) {
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: "http://localhost:3000", // change in prod
      },
    });

    return { error: error?.message ?? null };
  },

  // Step 1: send OTP
  async sendOtp(email: string): Promise<{ error: string | null }> {
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });

    return { error: error?.message ?? null };
  },

  // Step 2: verify OTP
  async verifyOtp(email: string, token: string): Promise<{ error: string | null }> {
    const supabase = createClient();

    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    });

    return { error: error?.message ?? null };
  },

  // Get profile
  async getProfile(userId: string): Promise<UserProfile | null> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error || !data) return null;
    return data as UserProfile;
  },

  async signOut(): Promise<void> {
    const supabase = createClient();
    await supabase.auth.signOut();
  },

  // Auth listener
  onAuthStateChange(cb: (userId: string | null) => void) {
    const supabase = createClient();

    return supabase.auth.onAuthStateChange((_, session) => {
      cb(session?.user?.id ?? null);
    });
  },
};