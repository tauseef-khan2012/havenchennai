
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { Mail, Lock, Phone, Eye, EyeOff } from 'lucide-react';
import { SelectCountry } from '@/components/auth/SelectCountry';
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

interface SignupFormProps {
  onSubmit: (credentials: SignUpCredentials) => Promise<void>;
  isSubmitting: boolean;
}

export const SignupForm: React.FC<SignupFormProps> = ({
  onSubmit,
  isSubmitting
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      countryCode: '+1',
      password: '',
      confirmPassword: '',
    },
  });
  
  const watchPassword = form.watch('password');
  
  const passwordStrength = !watchPassword 
    ? 0 
    : watchPassword.length < 6 
      ? 1 
      : watchPassword.length < 10 
        ? 2 
        : 3;

  const passwordStrengthText = !watchPassword 
    ? 'Enter a password' 
    : watchPassword.length < 6 
      ? 'Password is too weak' 
      : watchPassword.length < 10 
        ? 'Password is good' 
        : 'Password is strong';

  const handleFormSubmit = async (data: SignupFormValues) => {
    await onSubmit({
      email: data.email,
      password: data.password,
      fullName: data.fullName,
      phoneNumber: data.phone ? `${data.countryCode}${data.phone}` : undefined
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
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <FormControl>
                  <Input 
                    id="signup-email" 
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

        <div className="space-y-2">
          <FormLabel htmlFor="signup-phone">Phone Number (Optional)</FormLabel>
          <div className="flex space-x-2">
            <FormField
              control={form.control}
              name="countryCode"
              render={({ field }) => (
                <SelectCountry 
                  value={field.value || '+1'} 
                  onChange={field.onChange}
                  disabled={isSubmitting}
                  className="w-24"
                />
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <div className="relative flex-grow">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <FormControl>
                    <Input 
                      id="signup-phone" 
                      type="tel" 
                      placeholder="123456789 (Optional)"
                      className="pl-10"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                </div>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel htmlFor="signup-password">Password</FormLabel>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <FormControl>
                  <Input 
                    id="signup-password" 
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
              <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden mt-1">
                <div 
                  className={`h-full ${
                    !watchPassword 
                      ? 'w-0' 
                      : passwordStrength === 1
                        ? 'w-1/4 bg-red-500' 
                        : passwordStrength === 2
                          ? 'w-2/4 bg-yellow-500' 
                          : 'w-full bg-green-500'
                  }`}
                ></div>
              </div>
              <p className="text-xs text-gray-500">{passwordStrengthText}</p>
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
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <FormControl>
                  <Input 
                    id="signup-confirm-password" 
                    type={showConfirmPassword ? "text" : "password"}
                    className="pl-10 pr-10"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full bg-haven-green hover:bg-haven-green/90"
          disabled={isSubmitting || !form.formState.isValid}
        >
          {isSubmitting ? 'Creating Account...' : 'Sign Up'}
        </Button>
        <p className="text-sm text-gray-600 text-center">
          By signing up, you agree to our <Link to="#" className="text-haven-green hover:underline">Terms of Service</Link> and <Link to="#" className="text-haven-green hover:underline">Privacy Policy</Link>.
        </p>
      </form>
    </Form>
  );
};
