
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PasswordResetForm } from '@/components/auth/PasswordResetForm';

interface ResetPasswordTabContentProps {
  onResetPassword: (email: string) => Promise<void>;
  onLogin: () => void;
  isSubmitting: boolean;
  resetSent: boolean;
}

export const ResetPasswordTabContent: React.FC<ResetPasswordTabContentProps> = ({
  onResetPassword,
  onLogin,
  isSubmitting,
  resetSent
}) => {
  return (
    <Card className="border-haven-green/20 shadow-lg">
      <CardHeader>
        <CardTitle className="font-serif text-2xl">Reset Password</CardTitle>
        <CardDescription>Enter your email to receive password reset instructions.</CardDescription>
      </CardHeader>
      <CardContent>
        <PasswordResetForm
          onSubmit={onResetPassword}
          isSubmitting={isSubmitting}
          resetSent={resetSent}
        />
      </CardContent>
      <CardFooter className="flex justify-center border-t border-gray-100 pt-6">
        <p className="text-sm text-gray-600">
          Remember your password?{" "}
          <button 
            type="button"
            onClick={onLogin} 
            className="text-haven-green font-medium hover:underline"
          >
            Log In
          </button>
        </p>
      </CardFooter>
    </Card>
  );
};
