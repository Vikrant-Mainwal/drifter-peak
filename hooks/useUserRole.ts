"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function useUserRole() {
  const [user, setUser] = useState<any>(undefined); // 👈 important
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser(); //  FIXED

      setUser(user ?? null);
      setLoading(false);
    };

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
  };

  return {
    user,
    isLoggedIn: !!user,
    isAdmin: user?.email === process.env.ADMIN_EMAIL,
    loading,
    logout,
  };
}