
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Lock, Phone, Eye, EyeOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SignInCredentials } from '@/types/auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormValues } from '@/schemas/auth';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { PhoneLoginForm } from '@/components/auth/PhoneLoginForm';

interface LoginFormProps {
  onSubmit: (credentials: SignInCredentials) => Promise<void>;
  onSendOtp: (phone: string) => Promise<boolean>;
  onVerifyOtp: (phone: string, otp: string) => Promise<boolean>;
  onResetPassword: () => void;
  onResendConfirmation: () => void;
  isSubmitting: boolean;
  emailConfirmationNeeded: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  onSendOtp,
  onVerifyOtp,
  onResetPassword,
  onResendConfirmation,
  isSubmitting,
  emailConfirmationNeeded
}) => {
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [showPassword, setShowPassword] = useState(false);

  const emailForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleEmailSubmit = async (data: LoginFormValues) => {
    await onSubmit({
      email: data.email,
      password: data.password
    });
  };

  return (
    <div className="space-y-6">
      {emailConfirmationNeeded && (
        <Alert className="mb-4 bg-amber-50 border-amber-200">
          <AlertDescription className="text-amber-700">
            Please confirm your email before logging in.
            <Button 
              variant="link" 
              className="p-0 h-auto font-normal hover:underline text-haven-green ml-1"
              onClick={onResendConfirmation}
              disabled={isSubmitting}
            >
              Resend confirmation email
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex space-x-2 mb-4">
        <Button 
          type="button" 
          variant={loginMethod === 'email' ? "default" : "outline"}
          className={`w-1/2 ${loginMethod === 'email' ? 'bg-haven-green hover:bg-haven-green/90' : ''}`}
          onClick={() => setLoginMethod('email')}
          disabled={isSubmitting}
        >
          <Mail className="mr-2 h-4 w-4" />
          Email
        </Button>
        <Button 
          type="button" 
          variant={loginMethod === 'phone' ? "default" : "outline"}
          className={`w-1/2 ${loginMethod === 'phone' ? 'bg-haven-green hover:bg-haven-green/90' : ''}`}
          onClick={() => setLoginMethod('phone')}
          disabled={isSubmitting}
        >
          <Phone className="mr-2 h-4 w-4" />
          Phone
        </Button>
      </div>

      {loginMethod === 'email' ? (
        <Form {...emailForm}>
          <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)} className="space-y-4">
            <FormField
              control={emailForm.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor="login-email">Email</FormLabel>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <FormControl>
                      <Input 
                        id="login-email" 
                        type="email" 
                        placeholder="your.email@example.com"
                        className="pl-10"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={emailForm.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <div className="flex justify-between">
                    <FormLabel htmlFor="login-password">Password</FormLabel>
                    <button
                      type="button"
                      onClick={onResetPassword}
                      className="text-sm text-haven-green hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <FormControl>
                      <Input 
                        id="login-password" 
                        type={showPassword ? "text" : "password"}
                        className="pl-10 pr-10"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full bg-haven-green hover:bg-haven-green/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </Form>
      ) : (
        <PhoneLoginForm
          onSendOtp={onSendOtp}
          onVerifyOtp={onVerifyOtp}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};
