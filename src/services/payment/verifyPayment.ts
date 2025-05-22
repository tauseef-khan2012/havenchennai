
import { supabase } from '@/integrations/supabase/client';
import { PaymentConfirmationData } from '@/types/booking';

/**
 * Verifies a payment after successful processing
 * @param paymentData Payment confirmation data
 * @returns Success status
 */
export const verifyPayment = async (
  paymentData: PaymentConfirmationData
): Promise<boolean> => {
  try {
    // Call Supabase Edge Function to verify the payment
    const { data, error } = await supabase.functions.invoke('verify-razorpay-payment', {
      body: {
        razorpayPaymentId: paymentData.razorpayPaymentId,
        razorpayOrderId: paymentData.razorpayOrderId,
        razorpaySignature: paymentData.razorpaySignature,
        bookingId: paymentData.bookingId,
        bookingType: paymentData.bookingType
      }
    });

    if (error) {
      console.error('Error verifying payment:', error);
      throw new Error(`Failed to verify payment: ${error.message}`);
    }

    if (!data || data.success === undefined) {
      throw new Error('Invalid response from payment verification');
    }

    return data.success;
  } catch (error) {
    console.error('Error in verifyPayment:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Payment verification failed: ${errorMessage}`);
  }
};
