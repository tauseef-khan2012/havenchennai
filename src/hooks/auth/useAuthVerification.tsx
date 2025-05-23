
import { useCallback } from 'react';
import { AuthError } from '@/types/auth';
import * as authService from '@/services/authService';
import { useErrorHandler } from '@/hooks/useErrorHandler';

export function useAuthVerification(
  updateState: (state: any) => void,
  navigate: (path: string) => void,
  toast: any
) {
  const { handleAsyncError } = useErrorHandler();

  const signInWithOtp = useCallback(async (phone: string) => {
    updateState({ isLoading: true, error: null });
    
    const result = await handleAsyncError(
      async () => {
        const success = await authService.sendOtpToPhone(phone);
        
        if (success) {
          toast({
            title: "OTP Sent",
            description: "A verification code has been sent to your phone number.",
          });
        }
        
        return success;
      },
      {
        title: "Failed to send verification code",
        fallbackMessage: "Could not send OTP. Please check your phone number."
      }
    );

    updateState({ isLoading: false });
    return result || false;
  }, [updateState, toast, handleAsyncError]);

  const verifyOtp = useCallback(async (phone: string, otp: string) => {
    updateState({ isLoading: true, error: null });
    
    const result = await handleAsyncError(
      async () => {
        const success = await authService.verifyOtp(phone, otp);
        
        if (success) {
          toast({
            title: "Verification successful",
            description: "Your phone number has been verified successfully.",
          });
          
          navigate('/dashboard');
        }
        
        return success;
      },
      {
        title: "OTP verification failed",
        fallbackMessage: "Invalid verification code. Please try again."
      }
    );

    updateState({ isLoading: false });
    return result || false;
  }, [updateState, navigate, toast, handleAsyncError]);

  const resetPassword = useCallback(async (email: string) => {
    updateState({ isLoading: true, error: null });
    
    const result = await handleAsyncError(
      async () => {
        const success = await authService.resetPassword(email);
        
        if (success) {
          toast({
            title: "Reset instructions sent",
            description: "If an account with that email exists, you will receive password reset instructions.",
          });
        }
        
        return success;
      },
      {
        title: "Password reset failed",
        fallbackMessage: "Could not send reset email. Please try again."
      }
    );

    updateState({ isLoading: false });
    return result || false;
  }, [updateState, toast, handleAsyncError]);

  return {
    signInWithOtp,
    verifyOtp,
    resetPassword
  };
}
