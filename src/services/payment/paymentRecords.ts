
import { supabase } from '@/integrations/supabase/client';
import { PaymentRecord, UUID, BookingType, PaymentStatus } from '@/types/booking';

/**
 * Records a payment in the database
 * @param paymentRecord Payment record data
 */
export const recordPayment = async (paymentRecord: PaymentRecord): Promise<void> => {
  try {
    // Determine which booking ID field to use based on booking type
    const bookingIdField = paymentRecord.bookingType === 'property' ? 'booking_id' : 'experience_booking_id';
    
    const { error } = await supabase.from('payments').insert({
      [bookingIdField]: paymentRecord.bookingId,
      amount: paymentRecord.amount,
      currency: paymentRecord.currency,
      transaction_id: paymentRecord.transactionId,
      payment_method: paymentRecord.paymentMethod,
      payment_status: paymentRecord.paymentStatus,
      payment_gateway: 'Razorpay' // Adding a default value
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
