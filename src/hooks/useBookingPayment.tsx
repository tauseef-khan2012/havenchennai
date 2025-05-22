
import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { UUID, BookingType } from '@/types/booking';
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
      
      // This part would use the Razorpay JS SDK
      // For now, we'll mock a successful payment
      const paymentSuccess = true;
      
      if (paymentSuccess) {
        // Generate mock payment ID for testing
        const mockPaymentId = 'pay_' + Math.random().toString(36).substring(7);
        const mockSignature = 'sig_' + Math.random().toString(36).substring(7);
        
        // Verify and record payment (in real implementation, this would come from Razorpay callback)
        await verifyPayment({
          razorpayPaymentId: mockPaymentId,
          razorpayOrderId: orderId,
          razorpaySignature: mockSignature,
          bookingId,
          bookingType
        });
        
        toast({
          title: 'Payment successful',
          description: 'Your booking has been confirmed.',
        });
        
        return true;
      } else {
        // Handle payment failure
        await handlePaymentFailure({
          razorpayOrderId: orderId,
          errorCode: 'PAYMENT_FAILED',
          errorDescription: 'Payment was not completed',
          bookingId,
          bookingType
        });
        
        toast({
          title: 'Payment failed',
          description: 'Your payment could not be processed. Please try again.',
          variant: 'destructive'
        });
        
        return false;
      }
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
  }, [user, toast]);

  return {
    isLoading,
    processPayment
  };
};
