
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  AuthState,
  AuthUser,
  AuthSession,
  AuthProvider,
  UserProfile,
  SignInCredentials,
  PhoneSignInCredentials,
  SignUpCredentials,
  AuthError
} from '@/types/auth';
import * as authService from '@/services/authService';

interface AuthContextType extends AuthState {
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signInWithPhone: (credentials: PhoneSignInCredentials) => Promise<void>;
  signInWithProvider: (provider: AuthProvider) => Promise<void>;
  signUp: (credentials: SignUpCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  resendConfirmationEmail: (email: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const initialState: AuthState = {
  session: null,
  user: null,
  profile: null,
  isLoading: true,
  error: null
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState);
  const { toast } = useToast();
  const navigate = useNavigate();

  const updateState = useCallback((newState: Partial<AuthState>) => {
    setState(prevState => ({ ...prevState, ...newState }));
  }, []);

  const handleError = useCallback((error: AuthError, title: string) => {
    console.error(`Auth error (${title}):`, error);
    toast({
      title,
      description: error.message || "An error occurred",
      variant: "destructive",
    });
    updateState({ error });
  }, [toast, updateState]);

  const refreshProfile = useCallback(async () => {
    if (!state.user) return;
    
    try {
      const profile = await authService.fetchUserProfile(state.user.id);
      updateState({ profile });
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  }, [state.user, updateState]);

  // Initialize auth state
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event);
        
        updateState({
          session: currentSession,
          user: currentSession?.user ?? null,
        });
        
        // Fetch profile data if user exists
        if (currentSession?.user) {
          setTimeout(() => {
            authService.fetchUserProfile(currentSession.user.id)
              .then(profile => updateState({ profile }))
              .catch(error => console.error('Error fetching profile:', error));
          }, 0);
        } else {
          updateState({ profile: null });
        }
      }
    );

    // THEN check for existing session
    authService.getCurrentSession()
      .then(({ session }) => {
        updateState({
          session,
          user: session?.user ?? null,
          isLoading: false
        });
        
        if (session?.user) {
          authService.fetchUserProfile(session.user.id)
            .then(profile => updateState({ profile }))
            .catch(error => console.error('Error fetching profile:', error));
        }
      })
      .catch(error => {
        console.error('Error getting session:', error);
        updateState({ isLoading: false });
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [updateState]);

  const signIn = async (credentials: SignInCredentials) => {
    try {
      updateState({ isLoading: true, error: null });
      await authService.signInWithEmail(credentials);
      
      toast({
        title: "Success!",
        description: "You've been logged in successfully.",
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      if (error.message === 'Email not confirmed') {
        toast({
          title: "Email not confirmed",
          description: "Please check your inbox and confirm your email before logging in.",
          variant: "destructive",
        });
      } else {
        handleError(error, "Login failed");
      }
      throw error;
    } finally {
      updateState({ isLoading: false });
    }
  };

  const signInWithPhone = async (credentials: PhoneSignInCredentials) => {
    try {
      updateState({ isLoading: true, error: null });
      await authService.signInWithPhone(credentials);
      
      toast({
        title: "Success!",
        description: "You've been logged in successfully.",
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      handleError(error, "Login failed");
      throw error;
    } finally {
      updateState({ isLoading: false });
    }
  };

  const signInWithProvider = async (provider: AuthProvider) => {
    try {
      updateState({ isLoading: true, error: null });
      await authService.signInWithProvider(provider);
      // No toast or navigate here as OAuth will redirect
    } catch (error: any) {
      handleError(error, "Login failed");
      throw error;
    } finally {
      updateState({ isLoading: false });
    }
  };

  const signUp = async (credentials: SignUpCredentials) => {
    try {
      updateState({ isLoading: true, error: null });
      await authService.signUp(credentials);
      
      toast({
        title: "Account created!",
        description: "Please check your email to confirm your account before logging in.",
      });
    } catch (error: any) {
      handleError(error, "Sign up failed");
      throw error;
    } finally {
      updateState({ isLoading: false });
    }
  };

  const signOut = async () => {
    try {
      updateState({ isLoading: true, error: null });
      await authService.signOut();
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      
      navigate('/');
    } catch (error: any) {
      handleError(error, "Logout failed");
    } finally {
      updateState({ isLoading: false });
    }
  };

  const resendConfirmationEmail = async (email: string) => {
    try {
      updateState({ isLoading: true, error: null });
      await authService.resendConfirmationEmail(email);
      
      toast({
        title: "Confirmation email sent",
        description: "Please check your inbox and follow the link to confirm your email.",
      });
    } catch (error: any) {
      handleError(error, "Failed to resend confirmation");
    } finally {
      updateState({ isLoading: false });
    }
  };

  const resetPassword = async (email: string) => {
    try {
      updateState({ isLoading: true, error: null });
      await authService.resetPassword(email);
      
      toast({
        title: "Reset instructions sent",
        description: "If an account with that email exists, you will receive password reset instructions.",
      });
    } catch (error: any) {
      handleError(error, "Password reset failed");
    } finally {
      updateState({ isLoading: false });
    }
  };

  const value = {
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
