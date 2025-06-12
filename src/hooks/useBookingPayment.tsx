
import { useState, useCallback, useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { UUID, BookingType } from '@/types/booking';
import { useRazorpayPayment } from './useRazorpayPayment';
import { 
  initiatePayment, 
  verifyPayment, 
  handlePaymentFailure 
} from '@/services/payment';

/**
 * Hook for processing payments for bookings with improved error handling
 */
export const useBookingPayment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const successHandlerRef = useRef<
    ((paymentId: string, orderId: string, signature: string) => Promise<boolean> | void) | null
  >(null);
  const failureHandlerRef = useRef<((error: any) => Promise<boolean> | void) | null>(null);

  const razorpay = useRazorpayPayment({
    onSuccess: (paymentId, orderId, signature) =>
      successHandlerRef.current?.(paymentId, orderId, signature),
    onFailure: (error) => failureHandlerRef.current?.(error)
  });
  
  const handlePaymentSuccess = async (
    paymentId: string, 
    orderId: string, 
    signature: string,
    bookingId: UUID,
    bookingType: BookingType
  ) => {
    try {
      await verifyPayment({
        razorpayPaymentId: paymentId,
        razorpayOrderId: orderId,
        razorpaySignature: signature,
        bookingId,
        bookingType
      });
      
      toast({
        title: 'Payment successful',
        description: 'Your booking has been confirmed.',
      });
      
      return true;
    } catch (error) {
      console.error('Error verifying payment:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      toast({
        title: 'Payment verification failed',
        description: errorMessage,
        variant: 'destructive'
      });
      
      return false;
    }
  };
  
  const handlePaymentError = async (
    error: any,
    orderId: string,
    bookingId: UUID,
    bookingType: BookingType
  ) => {
    try {
      await handlePaymentFailure({
        razorpayOrderId: orderId,
        errorCode: error.code || 'PAYMENT_FAILED',
        errorDescription: error.message || 'Payment was not completed',
        bookingId,
        bookingType
      });
      
      toast({
        title: 'Payment failed',
        description: 'Your payment could not be processed. Please try again.',
        variant: 'destructive'
      });
    } catch (err) {
      console.error('Error handling payment failure:', err);
    }
    
    return false;
  };

  /**
   * Process payment for a booking
   */
  const processPayment = useCallback(async (
    bookingId: UUID,
    bookingType: BookingType,
    amount: number,
    currency: string,
    bookingReference: string
  ): Promise<boolean> => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to process payment.',
        variant: 'destructive'
      });
      return false;
    }
    
    setIsLoading(true);
    
    try {
      // Validate input
      if (!bookingId || !bookingType || amount <= 0 || !currency || !bookingReference) {
        throw new Error('Invalid payment details');
      }

      // Ensure user has necessary details
      const userName = user.user_metadata?.full_name || 'Guest';
      const userEmail = user.email || '';
      
      if (!userEmail) {
        throw new Error('User email not available');
      }
      
      // Initiate payment with payment gateway
      const { orderId, razorpayKey } = await initiatePayment({
        bookingId,
        bookingType,
        amount,
        currency,
        userEmail,
        userName,
        bookingReference
      });
      
      if (!orderId || !razorpayKey) {
        throw new Error('Failed to initialize payment');
      }
      
      // Configure payment options
      const options = {
        key: razorpayKey,
        amount: amount * 100, // In paise
        currency,
        name: 'Haven',
        description: `Booking ${bookingReference}`,
        order_id: orderId,
        prefill: {
          name: userName,
          email: userEmail,
          contact: user.user_metadata?.phone_number || ''
        },
        notes: {
          bookingId,
          bookingType,
          bookingReference
        },
        theme: {
          color: '#2D4F3C' // Haven green
        }
      };
      
      successHandlerRef.current = async (paymentId, oid, signature) =>
        await handlePaymentSuccess(paymentId, oid, signature, bookingId, bookingType);
      failureHandlerRef.current = async (error) =>
        await handlePaymentError(error, orderId, bookingId, bookingType);
      
      // Check if Razorpay is ready before processing payment
      if (!razorpay.isReady) {
        toast({
          title: 'Payment gateway not ready',
          description: 'Please try again in a few moments.',
          variant: 'destructive'
        });
        return false;
      }
      
      razorpay.processPayment(options);
      return true;
      
    } catch (error) {
      console.error('Error processing payment:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      toast({
        title: 'Payment error',
        description: `Failed to process payment: ${errorMessage}`,
        variant: 'destructive'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user, toast, razorpay]);

  return {
    isLoading,
    processPayment
  };
};
