
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { passwordResetSchema, PasswordResetFormValues } from '@/schemas/auth';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

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
  const form = useForm<PasswordResetFormValues>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      email: '',
    },
  });

  const handleFormSubmit = async (data: PasswordResetFormValues) => {
    await onSubmit(data.email);
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel htmlFor="reset-email">Email</FormLabel>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <FormControl>
                  <Input 
                    id="reset-email" 
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

        <Button 
          type="submit" 
          className="w-full bg-haven-green hover:bg-haven-green/90"
          disabled={isSubmitting || !form.formState.isValid}
        >
          {isSubmitting ? 'Sending...' : 'Send Reset Instructions'}
        </Button>
      </form>
    </Form>
  );
};
