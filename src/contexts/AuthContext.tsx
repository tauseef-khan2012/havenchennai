
import { createContext, useContext } from 'react';
import { useAuthProvider } from '@/hooks/useAuthProvider';
import { useAuthActions } from '@/hooks/useAuthActions';
import {
  AuthState,
  AuthProvider as ProviderType,
  SignInCredentials,
  SignUpCredentials,
} from '@/types/auth';

interface AuthContextType extends AuthState {
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signInWithOtp: (phone: string) => Promise<boolean>;
  verifyOtp: (phone: string, otp: string) => Promise<boolean>; // Changed to match Promise<boolean>
  signInWithProvider: (provider: ProviderType) => Promise<void>;
  signUp: (credentials: SignUpCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
  refreshProfile: () => Promise<void>;
  resendConfirmationEmail: (email: string) => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { state, updateState, handleError, refreshProfile, toast, navigate } = useAuthProvider();
  
  const {
    signIn,
    signInWithOtp,
    verifyOtp,
    signInWithProvider,
    signUp,
    signOut,
    resendConfirmationEmail,
    resetPassword,
    refreshSession: refreshSessionAction
  } = useAuthActions(updateState, handleError, navigate, toast, refreshProfile);

  const value: AuthContextType = {
    ...state,
    signIn,
    signInWithOtp,
    verifyOtp,
    signInWithProvider,
    signUp,
    signOut,
    refreshProfile,
    refreshSession: refreshSessionAction,
    resendConfirmationEmail,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
