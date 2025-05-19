
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Phone } from 'lucide-react';
import { SelectCountry } from '@/components/auth/SelectCountry';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { phoneLoginSchema, PhoneLoginFormValues } from '@/schemas/auth';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { OtpVerificationForm } from './OtpVerificationForm';
import { Input } from '@/components/ui/input';

interface PhoneLoginFormProps {
  onSendOtp: (phone: string) => Promise<boolean>;
  onVerifyOtp: (phone: string, otp: string) => Promise<void>; // Changed to match the expected type
  isSubmitting: boolean;
}

export const PhoneLoginForm: React.FC<PhoneLoginFormProps> = ({
  onSendOtp,
  onVerifyOtp,
  isSubmitting
}) => {
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  const form = useForm<PhoneLoginFormValues>({
    resolver: zodResolver(phoneLoginSchema),
    defaultValues: {
      phone: '',
      countryCode: '+1',
    },
  });

  const handlePhoneSubmit = async (data: PhoneLoginFormValues) => {
    const fullPhone = `${data.countryCode}${data.phone}`;
    setPhoneNumber(fullPhone);
    
    try {
      const success = await onSendOtp(fullPhone);
      if (success) {
        setShowOtpForm(true);
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
    }
  };

  const handleVerifyOtp = async (otp: string): Promise<boolean> => {
    try {
      await onVerifyOtp(phoneNumber, otp);
      return true; // Assuming successful verification
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return false;
    }
  };

  const handleResendOtp = async () => {
    try {
      return await onSendOtp(phoneNumber);
    } catch (error) {
      console.error('Error resending OTP:', error);
      return false;
    }
  };

  if (showOtpForm) {
    return (
      <OtpVerificationForm
        onSubmit={handleVerifyOtp}
        onResendOtp={handleResendOtp}
        isSubmitting={isSubmitting}
        contactMethod={phoneNumber}
        verificationType="phone"
      />
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handlePhoneSubmit)} className="space-y-4">
        <Alert className="bg-blue-50 border-blue-200">
          <AlertDescription className="text-blue-700">
            Enter your phone number to receive a verification code for login.
          </AlertDescription>
        </Alert>

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel htmlFor="phone-login">Phone Number</FormLabel>
              <div className="flex space-x-2">
                <FormField
                  control={form.control}
                  name="countryCode"
                  render={({ field: countryField }) => (
                    <SelectCountry 
                      value={countryField.value} 
                      onChange={countryField.onChange}
                      disabled={isSubmitting}
                      className="w-24"
                    />
                  )}
                />
                <div className="relative flex-grow">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <FormControl>
                    <Input 
                      id="phone-login" 
                      type="tel" 
                      placeholder="123456789"
                      className="pl-10"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                </div>
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
          {isSubmitting ? 'Sending Code...' : 'Send Verification Code'}
        </Button>
      </form>
    </Form>
  );
};
