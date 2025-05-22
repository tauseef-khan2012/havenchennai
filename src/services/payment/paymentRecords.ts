
import { supabase } from '@/integrations/supabase/client';
import { PaymentRecord, UUID, BookingType, PaymentStatus } from '@/types/booking';

/**
 * Records a payment in the database
 * @param paymentRecord Payment record data
 */
export const recordPayment = async (paymentRecord: PaymentRecord): Promise<void> => {
  try {
    const { error } = await supabase.from('payments').insert({
      booking_id: paymentRecord.bookingId,
      booking_type: paymentRecord.bookingType,
      amount: paymentRecord.amount,
      currency: paymentRecord.currency,
      transaction_id: paymentRecord.transactionId,
      payment_method: paymentRecord.paymentMethod,
      status: paymentRecord.paymentStatus
    });

    if (error) {
      console.error('Error recording payment:', error);
      throw new Error(`Failed to record payment: ${error.message}`);
    }
  } catch (error) {
    console.error('Error in recordPayment:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Failed to record payment: ${errorMessage}`);
  }
};
