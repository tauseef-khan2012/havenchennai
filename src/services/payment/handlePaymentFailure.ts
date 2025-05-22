
import { supabase } from '@/integrations/supabase/client';
import { PaymentFailureData } from '@/types/booking';

/**
 * Handles a payment failure
 * @param failureData Payment failure data
 */
export const handlePaymentFailure = async (
  failureData: PaymentFailureData
): Promise<void> => {
  try {
    // Call Supabase Edge Function to handle payment failure
    const { error } = await supabase.functions.invoke('handle-razorpay-failure', {
      body: failureData
    });

    if (error) {
      console.error('Error handling payment failure:', error);
      throw new Error(`Failed to handle payment failure: ${error.message}`);
    }
  } catch (error) {
    console.error('Error in handlePaymentFailure:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Failed to record payment failure: ${errorMessage}`);
  }
};
