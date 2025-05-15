
import { createContext, useContext } from 'react';
import { useAuthProvider } from '@/hooks/useAuthProvider';
import { useAuthActions } from '@/hooks/useAuthActions';
import {
  AuthState,
  AuthProvider as ProviderType,
  SignInCredentials,
  PhoneSignInCredentials,
  SignUpCredentials,
} from '@/types/auth';

interface AuthContextType extends AuthState {
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signInWithPhone: (credentials: PhoneSignInCredentials) => Promise<void>;
  signInWithProvider: (provider: ProviderType) => Promise<void>;
  signUp: (credentials: SignUpCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  resendConfirmationEmail: (email: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { state, updateState, handleError, refreshProfile, toast, navigate } = useAuthProvider();
  
  const {
    signIn,
    signInWithPhone,
    signInWithProvider,
    signUp,
    signOut,
    resendConfirmationEmail,
    resetPassword
  } = useAuthActions(updateState, handleError, navigate, toast, refreshProfile);

  const value: AuthContextType = {
    ...state,
    signIn,
    signInWithPhone,
    signInWithProvider,
    signUp,
    signOut,
    refreshProfile,
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
