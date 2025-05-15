
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { SignupForm } from '@/components/auth/SignupForm';
import { SignUpCredentials } from '@/types/auth';

interface SignupTabContentProps {
  onSignup: (credentials: SignUpCredentials) => Promise<void>;
  onLogin: () => void;
  isSubmitting: boolean;
}

export const SignupTabContent: React.FC<SignupTabContentProps> = ({
  onSignup,
  onLogin,
  isSubmitting
}) => {
  return (
    <Card className="border-haven-green/20 shadow-lg">
      <CardHeader>
        <CardTitle className="font-serif text-2xl">Create an Account</CardTitle>
        <CardDescription>Sign up to book stays and experiences at Haven.</CardDescription>
      </CardHeader>
      <CardContent>
        <SignupForm 
          onSubmit={onSignup}
          isSubmitting={isSubmitting}
        />
      </CardContent>
      <CardFooter className="flex justify-center border-t border-gray-100 pt-6">
        <p className="text-sm text-gray-600 text-center">
          Already have an account?{" "}
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
