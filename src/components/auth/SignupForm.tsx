
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { SignUpCredentials } from '@/types/auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, SignupFormValues } from '@/schemas/auth';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { EmailInput } from '@/components/auth/EmailInput';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { PasswordStrengthIndicator } from '@/components/auth/PasswordStrengthIndicator';
import { PhoneInputGroup } from '@/components/auth/PhoneInputGroup';
import { TermsCheckbox } from '@/components/auth/TermsCheckbox';

interface SignupFormProps {
  onSubmit: (credentials: SignUpCredentials) => Promise<void>;
  isSubmitting: boolean;
}

export const SignupForm: React.FC<SignupFormProps> = ({
  onSubmit,
  isSubmitting
}) => {
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      countryCode: '+1',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  });
  
  const watchPassword = form.watch('password');

  const handleFormSubmit = async (data: SignupFormValues) => {
    await onSubmit({
      email: data.email,
      password: data.password,
      fullName: data.fullName,
      phone: data.phone,
      countryCode: data.countryCode,
      acceptTerms: data.acceptTerms
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel htmlFor="signup-name">Full Name</FormLabel>
              <FormControl>
                <Input 
                  id="signup-name" 
                  placeholder="John Doe"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel htmlFor="signup-email">Email</FormLabel>
              <EmailInput 
                id="signup-email"
                field={field}
                disabled={isSubmitting}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <PhoneInputGroup form={form} isSubmitting={isSubmitting} />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel htmlFor="signup-password">Password</FormLabel>
              <PasswordInput 
                id="signup-password"
                field={field}
                disabled={isSubmitting}
              />
              <PasswordStrengthIndicator password={watchPassword} />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel htmlFor="signup-confirm-password">Confirm Password</FormLabel>
              <PasswordInput 
                id="signup-confirm-password"
                field={field}
                disabled={isSubmitting}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="acceptTerms"
          render={({ field }) => (
            <TermsCheckbox 
              field={field}
              isSubmitting={isSubmitting}
            />
          )}
        />

        <Button 
          type="submit" 
          className="w-full bg-haven-green hover:bg-haven-green/90"
          disabled={isSubmitting || !form.formState.isValid}
        >
          {isSubmitting ? 'Creating Account...' : 'Sign Up'}
        </Button>
      </form>
    </Form>
  );
};
