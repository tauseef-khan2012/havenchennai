
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { 
  SignInCredentials, 
  PhoneSignInCredentials, 
  SignUpCredentials 
} from '@/types/auth';
import { Provider } from '@supabase/supabase-js';

export const useAuthForms = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailConfirmationNeeded, setEmailConfirmationNeeded] = useState(false);
  const [passwordResetSent, setPasswordResetSent] = useState(false);
  const { toast } = useToast();
  const { 
    signIn, 
    signInWithPhone,
    signInWithProvider, 
    signUp, 
    resendConfirmationEmail,
    resetPassword 
  } = useAuth();

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleLogin = async (credentials: SignInCredentials | PhoneSignInCredentials) => {
    if ('email' in credentials && !credentials.password) {
      toast({
        title: "Error",
        description: "Please enter both email and password.",
        variant: "destructive"
      });
      return;
    } else if ('phone' in credentials && !credentials.password) {
      toast({
        title: "Error",
        description: "Please enter both phone and password.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      if ('email' in credentials) {
        await signIn(credentials);
      } else {
        await signInWithPhone(credentials);
      }
    } catch (error: any) {
      if (error.message === 'Email not confirmed') {
        setEmailConfirmationNeeded(true);
      }
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
    if (!credentials.fullName || !credentials.email || !credentials.password) {
      toast({
        title: "Error",
        description: "Please fill out all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    if (credentials.password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long.",
        variant: "destructive"
      });
      return;
    }
    
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
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address.",
        variant: "destructive"
      });
      return;
    }
    
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
    handleResendConfirmation,
    handleSignup,
    handleSocialLogin,
    handleResetPassword
  };
};
