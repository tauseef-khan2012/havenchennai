
import { useCallback } from 'react';
import { AuthError } from '@/types/auth';
import * as authService from '@/services/authService';

export function useAuthVerification(
  updateState: (state: any) => void,
  handleError: (error: AuthError, title: string) => void,
  navigate: (path: string) => void,
  toast: any
) {
  const signInWithOtp = useCallback(async (phone: string) => {
    try {
      updateState({ isLoading: true, error: null });
      const result = await authService.sendOtpToPhone(phone);
      
      if (result) {
        toast({
          title: "OTP Sent",
          description: "A verification code has been sent to your phone number.",
        });
      }
      
      return result;
    } catch (error: any) {
      handleError(error, "Failed to send verification code");
      return false;
    } finally {
      updateState({ isLoading: false });
    }
  }, [updateState, handleError, toast]);

  const verifyOtp = useCallback(async (phone: string, otp: string) => {
    try {
      updateState({ isLoading: true, error: null });
      const result = await authService.verifyOtp(phone, otp);
      
      if (result) {
        toast({
          title: "Verification successful",
          description: "Your phone number has been verified successfully.",
        });
        
        navigate('/dashboard');
      }
      
      return result;
    } catch (error: any) {
      handleError(error, "OTP verification failed");
      return false;
    } finally {
      updateState({ isLoading: false });
    }
  }, [updateState, handleError, navigate, toast]);

  const resetPassword = useCallback(async (email: string) => {
    try {
      updateState({ isLoading: true, error: null });
      const result = await authService.resetPassword(email);
      
      if (result) {
        toast({
          title: "Reset instructions sent",
          description: "If an account with that email exists, you will receive password reset instructions.",
        });
      }
      
      return result;
    } catch (error: any) {
      handleError(error, "Password reset failed");
      return false;
    } finally {
      updateState({ isLoading: false });
    }
  }, [updateState, handleError, toast]);

  return {
    signInWithOtp,
    verifyOtp,
    resetPassword
  };
}
