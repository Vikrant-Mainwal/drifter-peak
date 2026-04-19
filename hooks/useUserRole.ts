"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/db/supabase";

const ADMIN_EMAIL = "mainwalop@gmail.com";

export function useUserRole() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      setUser(session?.user ?? null);
      setLoading(false);
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return {
    user,
    isLoggedIn: !!user,
    isAdmin: user?.email === ADMIN_EMAIL,
    loading,
    logout,
  };
}