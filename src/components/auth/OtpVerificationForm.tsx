
import React, { useState, useEffect } from 'react';
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
  onSubmit: (otp: string) => Promise<boolean>; // Changed to match Promise<boolean>
  onResendOtp: () => Promise<boolean>;
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
  const [resendCooldown, setResendCooldown] = useState(0);
  const form = useForm<VerifyOtpFormValues>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      otp: '',
    },
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown(prev => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const handleFormSubmit = async (data: VerifyOtpFormValues) => {
    await onSubmit(data.otp);
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    
    const success = await onResendOtp();
    if (success) {
      setResendCooldown(60); // 60 second cooldown
    }
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
            onClick={handleResend}
            disabled={isSubmitting || resendCooldown > 0}
          >
            {resendCooldown > 0 
              ? `Resend code in ${resendCooldown}s` 
              : "Didn't receive a code? Resend"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
