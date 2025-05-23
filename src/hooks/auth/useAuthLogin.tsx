
import { useCallback } from 'react';
import { Provider as AuthProvider } from '@supabase/supabase-js';
import {
  SignInCredentials,
  PhoneSignInCredentials,
  AuthError,
} from '@/types/auth';
import * as authService from '@/services/authService';
import { useErrorHandler } from '@/hooks/useErrorHandler';

export function useAuthLogin(
  updateState: (state: any) => void,
  navigate: (path: string) => void,
  toast: any
) {
  const { handleAsyncError } = useErrorHandler();

  const signIn = useCallback(async (credentials: SignInCredentials) => {
    updateState({ isLoading: true, error: null });
    
    const result = await handleAsyncError(
      async () => {
        await authService.signInWithEmail(credentials);
        
        toast({
          title: "Success!",
          description: "You've been logged in successfully.",
        });
        
        navigate('/dashboard');
      },
      {
        title: "Login failed",
        fallbackMessage: "Failed to sign in. Please check your credentials."
      }
    );

    updateState({ isLoading: false });
    
    if (!result) {
      throw new Error("Login failed");
    }
  }, [updateState, navigate, toast, handleAsyncError]);

  const signInWithPhone = useCallback(async (credentials: PhoneSignInCredentials) => {
    updateState({ isLoading: true, error: null });
    
    const result = await handleAsyncError(
      async () => {
        await authService.signInWithPhone(credentials);
        
        toast({
          title: "Success!",
          description: "You've been logged in successfully.",
        });
        
        navigate('/dashboard');
      },
      {
        title: "Login failed",
        fallbackMessage: "Failed to sign in with phone. Please check your credentials."
      }
    );

    updateState({ isLoading: false });
    
    if (!result) {
      throw new Error("Phone login failed");
    }
  }, [updateState, navigate, toast, handleAsyncError]);

  const signInWithProvider = useCallback(async (provider: AuthProvider) => {
    updateState({ isLoading: true, error: null });
    
    const result = await handleAsyncError(
      async () => {
        await authService.signInWithProvider(provider);
        // No toast or navigate here as OAuth will redirect
      },
      {
        title: "Login failed",
        fallbackMessage: `Failed to sign in with ${provider}. Please try again.`
      }
    );

    updateState({ isLoading: false });
    
    if (!result) {
      throw new Error(`${provider} login failed`);
    }
  }, [updateState, handleAsyncError]);

  return {
    signIn,
    signInWithPhone,
    signInWithProvider
  };
}
