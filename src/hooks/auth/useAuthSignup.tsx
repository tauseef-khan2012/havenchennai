
import { useCallback } from 'react';
import {
  SignUpCredentials,
  AuthError,
} from '@/types/auth';
import * as authService from '@/services/authService';
import { useErrorHandler } from '@/hooks/useErrorHandler';

export function useAuthSignup(
  updateState: (state: any) => void,
  toast: any
) {
  const { handleAsyncError } = useErrorHandler();

  const signUp = useCallback(async (credentials: SignUpCredentials) => {
    updateState({ isLoading: true, error: null });
    
    const result = await handleAsyncError(
      async () => {
        await authService.signUp(credentials);
        
        toast({
          title: "Account created!",
          description: "Please check your email to confirm your account before logging in.",
        });
      },
      {
        title: "Sign up failed",
        fallbackMessage: "Failed to create account. Please try again."
      }
    );

    updateState({ isLoading: false });
    
    if (!result) {
      throw new Error("Sign up failed");
    }
  }, [updateState, toast, handleAsyncError]);

  const resendConfirmationEmail = useCallback(async (email: string) => {
    updateState({ isLoading: true, error: null });
    
    await handleAsyncError(
      async () => {
        await authService.resendConfirmationEmail(email);
        
        toast({
          title: "Confirmation email sent",
          description: "Please check your inbox and follow the link to confirm your email.",
        });
      },
      {
        title: "Failed to resend confirmation",
        fallbackMessage: "Could not send confirmation email. Please try again."
      }
    );

    updateState({ isLoading: false });
  }, [updateState, toast, handleAsyncError]);

  return {
    signUp,
    resendConfirmationEmail
  };
}
