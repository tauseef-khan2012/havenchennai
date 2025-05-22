
import { supabase } from '@/integrations/supabase/client';
import { PaymentInitiationData } from '@/types/booking';

/**
 * Initiates a payment with Razorpay
 * @param paymentData Payment initiation data
 * @returns Order ID and Razorpay key
 */
export const initiatePayment = async (
  paymentData: PaymentInitiationData
): Promise<{ orderId: string; razorpayKey: string }> => {
  try {
    // Call Supabase Edge Function to create Razorpay order
    const { data, error } = await supabase.functions.invoke('create-razorpay-order', {
      body: {
        amount: paymentData.amount,
        currency: paymentData.currency,
        receipt: paymentData.bookingReference,
        notes: {
          bookingId: paymentData.bookingId,
          bookingType: paymentData.bookingType,
          userEmail: paymentData.userEmail
        }
      }
    });

    if (error) {
      console.error('Error initiating payment:', error);
      throw new Error(`Failed to initiate payment: ${error.message}`);
    }

    if (!data || !data.orderId || !data.razorpayKey) {
      throw new Error('Invalid response from payment initiation');
    }

    return {
      orderId: data.orderId,
      razorpayKey: data.razorpayKey
    };
  } catch (error) {
    console.error('Error in initiatePayment:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Payment initiation failed: ${errorMessage}`);
  }
};
