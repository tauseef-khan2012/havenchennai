
import { useCallback } from 'react';
import {
  SignUpCredentials,
  AuthError,
} from '@/types/auth';
import * as authService from '@/services/authService';

export function useAuthSignup(
  updateState: (state: any) => void,
  handleError: (error: AuthError, title: string) => void,
  toast: any
) {
  const signUp = useCallback(async (credentials: SignUpCredentials) => {
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
  }, [updateState, handleError, toast]);

  const resendConfirmationEmail = useCallback(async (email: string) => {
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
  }, [updateState, handleError, toast]);

  return {
    signUp,
    resendConfirmationEmail
  };
}
