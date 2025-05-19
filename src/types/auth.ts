
import { Provider, Session, User } from '@supabase/supabase-js';

export type AuthUser = User;
export type AuthSession = Session;
export type AuthProvider = Provider;

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone_number?: string;
  registration_source?: string;
  last_login_at?: string;
  created_at?: string;
  updated_at?: string;
}

export type SignInCredentials = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

export type PhoneSignInCredentials = {
  phone: string;
  password: string;
  countryCode: string;
  rememberMe?: boolean;
};

export type SignUpCredentials = {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  countryCode?: string;
  acceptTerms: boolean;
};

export interface AuthError extends Error {
  status?: number;
  code?: string;
}

export type AuthState = {
  session: AuthSession | null;
  user: AuthUser | null;
  profile: UserProfile | null;
  isLoading: boolean;
  error: AuthError | null;
  isInitialized: boolean;
};
