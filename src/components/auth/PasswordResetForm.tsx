
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PasswordResetFormProps {
  onSubmit: (email: string) => Promise<void>;
  isSubmitting: boolean;
  resetSent: boolean;
}

export const PasswordResetForm: React.FC<PasswordResetFormProps> = ({
  onSubmit,
  isSubmitting,
  resetSent
}) => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(email);
  };

  if (resetSent) {
    return (
      <Alert className="bg-green-50 border-green-200">
        <AlertDescription className="text-green-700">
          If an account with that email exists, you will receive a password reset link shortly. 
          Please check your inbox and follow the instructions to reset your password.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="reset-email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            id="reset-email" 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@example.com"
            className="pl-10"
            required
            disabled={isSubmitting}
          />
        </div>
      </div>
      <Button 
        type="submit" 
        className="w-full bg-haven-green hover:bg-haven-green/90"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Sending...' : 'Send Reset Instructions'}
      </Button>
    </form>
  );
};
