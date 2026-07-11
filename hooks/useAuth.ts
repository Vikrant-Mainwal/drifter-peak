// Single source of truth for auth state. This used to be two separate,
// independent hooks (useAuth + useUserRole), each with its own Supabase
// client and its own onAuthStateChange listener — that duplication is what
// caused the UI to go stale until a hard refresh. Both are now replaced by
// one shared context; this file just re-exports it so existing imports of
// "@/hooks/useAuth" keep working unchanged.
export { useAuth } from "@/components/providers/AuthProvider";
