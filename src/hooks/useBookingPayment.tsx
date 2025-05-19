
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { UUID, BookingType } from '@/types/booking';
import { 
  initiatePayment, 
  verifyPayment, 
  handlePaymentFailure 
} from '@/services/paymentService';

/**
 * Hook for processing payments for bookings
 */
export const useBookingPayment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  /**
   * Process payment for a booking
   */
  const processPayment = async (
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
      // Initiate payment with Razorpay
      const { orderId, razorpayKey } = await initiatePayment({
        bookingId,
        bookingType,
        amount,
        currency,
        userEmail: user.email || '',
        userName: user.user_metadata?.full_name || 'Guest',
        bookingReference
      });
      
      // Open Razorpay payment UI
      const options = {
        key: razorpayKey,
        amount: amount * 100, // In paise
        currency,
        name: 'Haven',
        description: `Booking ${bookingReference}`,
        order_id: orderId,
        prefill: {
          name: user.user_metadata?.full_name || 'Guest',
          email: user.email || '',
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
        // Verify and record payment (in real implementation, this would come from Razorpay callback)
        await verifyPayment({
          razorpayPaymentId: 'pay_' + Math.random().toString(36).substring(7),
          razorpayOrderId: orderId,
          razorpaySignature: 'sig_' + Math.random().toString(36).substring(7),
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
      toast({
        title: 'Error',
        description: 'Failed to process payment. Please try again.',
        variant: 'destructive'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    processPayment
  };
};
