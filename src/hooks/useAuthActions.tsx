
import { useCallback } from 'react';
import { Provider as AuthProvider } from '@supabase/supabase-js';
import {
  SignInCredentials,
  PhoneSignInCredentials,
  SignUpCredentials,
  AuthError,
} from '@/types/auth';
import * as authService from '@/services/authService';

export function useAuthActions(
  updateState: (state: any) => void,
  handleError: (error: AuthError, title: string) => void,
  navigate: (path: string) => void,
  toast: any,
  refreshProfile: () => Promise<void>
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

  const signInWithOtp = useCallback(async (phone: string) => {
    try {
      updateState({ isLoading: true, error: null });
      await authService.sendOtpToPhone(phone);
      
      toast({
        title: "OTP Sent",
        description: "A verification code has been sent to your phone number.",
      });
      
      return true;
    } catch (error: any) {
      handleError(error, "Failed to send verification code");
      throw error;
    } finally {
      updateState({ isLoading: false });
    }
  }, [updateState, handleError, toast]);

  const verifyOtp = useCallback(async (phone: string, otp: string) => {
    try {
      updateState({ isLoading: true, error: null });
      await authService.verifyOtp(phone, otp);
      
      toast({
        title: "Verification successful",
        description: "Your phone number has been verified successfully.",
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      handleError(error, "OTP verification failed");
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

  const signOut = useCallback(async () => {
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
  }, [updateState, handleError, navigate, toast]);

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

  const resetPassword = useCallback(async (email: string) => {
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
  }, [updateState, handleError, toast]);

  const refreshSession = useCallback(async () => {
    try {
      updateState({ isLoading: true, error: null });
      const { session } = await authService.refreshSession();
      
      if (session) {
        updateState({ session, user: session.user });
        return true;
      }
      return false;
    } catch (error: any) {
      handleError(error, "Session refresh failed");
      return false;
    } finally {
      updateState({ isLoading: false });
    }
  }, [updateState, handleError]);

  return {
    signIn,
    signInWithPhone,
    signInWithOtp,
    verifyOtp,
    signInWithProvider,
    signUp,
    signOut,
    resendConfirmationEmail,
    resetPassword,
    refreshSession
  };
}
