
import { useCallback } from 'react';
import { Provider as AuthProvider } from '@supabase/supabase-js';
import {
  SignInCredentials,
  PhoneSignInCredentials,
  AuthError,
} from '@/types/auth';
import * as authService from '@/services/authService';

export function useAuthLogin(
  updateState: (state: any) => void,
  handleError: (error: AuthError, title: string) => void,
  navigate: (path: string) => void,
  toast: any
) {
  const signIn = useCallback(async (credentials: SignInCredentials) => {
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
  }, [updateState, handleError, navigate, toast]);

  const signInWithPhone = useCallback(async (credentials: PhoneSignInCredentials) => {
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
  }, [updateState, handleError, navigate, toast]);

  const signInWithProvider = useCallback(async (provider: AuthProvider) => {
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
  }, [updateState, handleError]);

  return {
    signIn,
    signInWithPhone,
    signInWithProvider
  };
}
