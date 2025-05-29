
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useRazorpayStandardCheckout } from './useRazorpayStandardCheckout';
import { UUID, BookingType } from '@/types/booking';

export const useEnhancedBookingPayment = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handlePaymentSuccess = useCallback(async (
    paymentId: string,
    orderId: string,
    signature: string,
    bookingId: UUID,
    bookingType: BookingType
  ) => {
    try {
      setIsProcessing(true);
      
      console.log('Verifying payment:', { paymentId, orderId, signature });

      // Verify payment via Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('verify-razorpay-payment', {
        body: {
          razorpayPaymentId: paymentId,
          razorpayOrderId: orderId,
          razorpaySignature: signature,
          bookingId,
          bookingType
        }
      });

      if (error || !data?.success) {
        throw new Error(error?.message || 'Payment verification failed');
      }

      console.log('Payment verified successfully');
      
      toast({
        title: 'Payment Successful!',
        description: 'Your booking has been confirmed. You will receive a confirmation email shortly.',
      });

      return true;
    } catch (error) {
      console.error('Payment verification error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Payment verification failed';
      
      toast({
        title: 'Payment Verification Failed',
        description: errorMessage,
        variant: 'destructive'
      });
      
      return false;
    } finally {
      setIsProcessing(false);
    }
  }, [toast]);

  const handlePaymentFailure = useCallback(async (
    error: any,
    bookingId?: UUID,
    bookingType?: BookingType
  ) => {
    try {
      console.log('Handling payment failure:', error);

      // Record failure if we have booking details
      if (bookingId && bookingType && error.razorpayOrderId) {
        await supabase.functions.invoke('handle-razorpay-failure', {
          body: {
            razorpayOrderId: error.razorpayOrderId,
            errorCode: error.code || 'UNKNOWN_ERROR',
            errorDescription: error.message || 'Payment failed',
            bookingId,
            bookingType
          }
        });
      }

      const errorMessage = error.code === 'PAYMENT_CANCELLED' 
        ? 'Payment was cancelled. You can try again anytime.'
        : `Payment failed: ${error.message || 'Please try again'}`;

      toast({
        title: 'Payment Failed',
        description: errorMessage,
        variant: 'destructive'
      });

    } catch (failureError) {
      console.error('Error handling payment failure:', failureError);
    }
  }, [toast]);

  const { initiatePayment, isLoading: isCheckoutLoading } = useRazorpayStandardCheckout({
    onSuccess: (paymentId, orderId, signature) => {
      // This will be handled by the component using this hook
      console.log('Payment completed, verification needed');
    },
    onFailure: handlePaymentFailure
  });

  const processBookingPayment = useCallback(async (
    bookingId: UUID,
    bookingType: BookingType,
    amount: number,
    currency: string,
    customerDetails: {
      name: string;
      email: string;
      phone?: string;
    },
    bookingReference: string,
    onSuccess?: (success: boolean) => void
  ) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to complete payment.',
        variant: 'destructive'
      });
      return false;
    }

    try {
      // Create a custom success handler that includes verification
      const customOnSuccess = async (paymentId: string, orderId: string, signature: string) => {
        const verified = await handlePaymentSuccess(paymentId, orderId, signature, bookingId, bookingType);
        if (onSuccess) {
          onSuccess(verified);
        }
      };

      // Create a custom failure handler with booking context
      const customOnFailure = (error: any) => {
        handlePaymentFailure(error, bookingId, bookingType);
        if (onSuccess) {
          onSuccess(false);
        }
      };

      // Start payment process
      await initiatePayment(
        bookingId,
        bookingType,
        amount,
        currency,
        customerDetails,
        bookingReference
      );

      return true;
    } catch (error) {
      console.error('Error processing payment:', error);
      const errorMessage = error instanceof Error ? error.message : 'Payment processing failed';
      
      toast({
        title: 'Payment Error',
        description: errorMessage,
        variant: 'destructive'
      });
      
      if (onSuccess) {
        onSuccess(false);
      }
      return false;
    }
  }, [user, toast, initiatePayment, handlePaymentSuccess, handlePaymentFailure]);

  return {
    processBookingPayment,
    isLoading: isCheckoutLoading || isProcessing
  };
};
