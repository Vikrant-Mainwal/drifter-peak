export type Role = "admin" | "user";

export interface UserProfile {
  id: string;
  email: string;
  role: Role;
  created_at?: string;
}

export interface AuthState {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
}