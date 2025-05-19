
import React from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { verifyOtpSchema, VerifyOtpFormValues } from '@/schemas/auth';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot
} from '@/components/ui/input-otp';

interface OtpVerificationFormProps {
  onSubmit: (otp: string) => Promise<void>;
  onResendOtp: () => Promise<void>;
  isSubmitting: boolean;
  contactMethod: string;
  verificationType: 'phone' | 'email';
}

export const OtpVerificationForm: React.FC<OtpVerificationFormProps> = ({
  onSubmit,
  onResendOtp,
  isSubmitting,
  contactMethod,
  verificationType
}) => {
  const form = useForm<VerifyOtpFormValues>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      otp: '',
    },
  });

  const handleFormSubmit = async (data: VerifyOtpFormValues) => {
    await onSubmit(data.otp);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <Alert className="bg-blue-50 border-blue-200">
          <AlertDescription className="text-blue-700">
            We've sent a verification code to {contactMethod}. Please enter the code below to verify your {verificationType}.
          </AlertDescription>
        </Alert>

        <FormField
          control={form.control}
          name="otp"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel htmlFor="verification-code">Verification Code</FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col space-y-3">
          <Button
            type="submit"
            className="w-full bg-haven-green hover:bg-haven-green/90"
            disabled={isSubmitting || !form.formState.isValid}
          >
            {isSubmitting ? 'Verifying...' : 'Verify Code'}
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            className="text-sm"
            onClick={async () => await onResendOtp()}
            disabled={isSubmitting}
          >
            Didn't receive a code? Resend
          </Button>
        </div>
      </form>
    </Form>
  );
};
