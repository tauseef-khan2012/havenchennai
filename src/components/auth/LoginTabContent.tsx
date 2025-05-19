
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LoginForm } from '@/components/auth/LoginForm';
import { SocialLoginButtons } from '@/components/auth/SocialLoginButtons';
import { SignInCredentials } from '@/types/auth';
import { Provider } from '@supabase/supabase-js';

interface LoginTabContentProps {
  onLogin: (credentials: SignInCredentials) => Promise<void>;
  onSendOtp: (phone: string) => Promise<boolean>;
  onVerifyOtp: (phone: string, otp: string) => Promise<void>;
  onSocialLogin: (provider: Provider) => Promise<void>;
  onResetPassword: () => void;
  onResendConfirmation: () => void;
  onSignUp: () => void;
  isSubmitting: boolean;
  emailConfirmationNeeded: boolean;
}

export const LoginTabContent: React.FC<LoginTabContentProps> = ({
  onLogin,
  onSendOtp,
  onVerifyOtp,
  onSocialLogin,
  onResetPassword,
  onResendConfirmation,
  onSignUp,
  isSubmitting,
  emailConfirmationNeeded
}) => {
  return (
    <Card className="border-haven-green/20 shadow-lg">
      <CardHeader>
        <CardTitle className="font-serif text-2xl">Welcome Back</CardTitle>
        <CardDescription>Log in to manage your bookings and experiences.</CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm 
          onSubmit={onLogin}
          onSendOtp={onSendOtp}
          onVerifyOtp={onVerifyOtp}
          onResetPassword={onResetPassword}
          onResendConfirmation={onResendConfirmation}
          isSubmitting={isSubmitting}
          emailConfirmationNeeded={emailConfirmationNeeded}
        />
        
        <SocialLoginButtons
          onSocialLogin={onSocialLogin}
          isSubmitting={isSubmitting}
        />
      </CardContent>
      <CardFooter className="flex justify-center border-t border-gray-100 pt-6">
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <button 
            onClick={onSignUp} 
            className="text-haven-green font-medium hover:underline"
          >
            Sign Up
          </button>
        </p>
      </CardFooter>
    </Card>
  );
};
