
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { SignInCredentials, SignUpCredentials } from '@/types/auth';
import { Provider } from '@supabase/supabase-js';

export const useAuthForms = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailConfirmationNeeded, setEmailConfirmationNeeded] = useState(false);
  const [passwordResetSent, setPasswordResetSent] = useState(false);
  const { toast } = useToast();
  const { 
    signIn, 
    signInWithOtp,
    verifyOtp,
    signInWithProvider, 
    signUp, 
    resendConfirmationEmail,
    resetPassword 
  } = useAuth();

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Reset states when changing tabs
    setEmailConfirmationNeeded(false);
    setPasswordResetSent(false);
  };

  const handleLogin = async (credentials: SignInCredentials) => {
    setIsSubmitting(true);
    try {
      await signIn(credentials);
    } catch (error: any) {
      if (error.message === 'Email not confirmed') {
        setEmailConfirmationNeeded(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendOtp = async (phone: string) => {
    setIsSubmitting(true);
    try {
      const result = await signInWithOtp(phone);
      return result;
    } catch (error) {
      // Error handling is done in signInWithOtp function
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (phone: string, otp: string) => {
    setIsSubmitting(true);
    try {
      await verifyOtp(phone, otp);
    } catch (error) {
      // Error handling is done in verifyOtp function
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendConfirmation = async () => {
    const loginEmail = document.getElementById('login-email') as HTMLInputElement;
    const email = loginEmail?.value;
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address.",
        variant: "destructive"
      });
      return;
    }
    
    await resendConfirmationEmail(email);
  };

  const handleSignup = async (credentials: SignUpCredentials) => {
    setIsSubmitting(true);
    try {
      await signUp(credentials);
      
      setActiveTab('login');
      setEmailConfirmationNeeded(true);
    } catch (error) {
      // Error handling is done in signUp function
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = async (provider: Provider) => {
    try {
      await signInWithProvider(provider);
    } catch (error) {
      // Error handling is done in signInWithProvider function
    }
  };

  const handleResetPassword = async (email: string) => {
    setIsSubmitting(true);
    try {
      await resetPassword(email);
      setPasswordResetSent(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    activeTab,
    isSubmitting,
    emailConfirmationNeeded,
    passwordResetSent,
    handleTabChange,
    handleLogin,
    handleSendOtp,
    handleVerifyOtp,
    handleResendConfirmation,
    handleSignup,
    handleSocialLogin,
    handleResetPassword
  };
};
