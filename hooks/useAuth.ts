"use client";
import { useState, useEffect } from "react";
import { AuthService } from "@/services/auth.service";
import type { UserProfile } from "@/types/auth.types";

export function useAuth() {
  const [user, setUser]       = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = AuthService.onAuthStateChange(
      async (userId) => {
        if (!userId) { setUser(null); setLoading(false); return; }
        const profile = await AuthService.getProfile(userId);
        setUser(profile);
        setLoading(false);
      }
    );
    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await AuthService.signOut();
    setUser(null);
  };

  return { user, loading, logout };
}