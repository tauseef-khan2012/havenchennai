
import { supabase } from '@/integrations/supabase/client';
import { UUID, BookingType, PaymentRecord } from '@/types/booking';

/**
 * Records a payment in the database
 * @param paymentRecord Payment record data
 * @returns Payment record ID
 */
export const recordPayment = async (
  paymentRecord: PaymentRecord
): Promise<UUID> => {
  try {
    const { 
      bookingId, 
      bookingType, 
      amount, 
      currency, 
      transactionId, 
      paymentMethod, 
      paymentStatus 
    } = paymentRecord;

    // Insert payment record
    const { data, error } = await supabase
      .from('payments')
      .insert({
        amount,
        currency,
        transaction_id: transactionId,
        payment_method: paymentMethod,
        payment_status: paymentStatus,
        payment_gateway: 'Razorpay',
        processed_at: new Date().toISOString(),
        ...(bookingType === 'property' ? { booking_id: bookingId } : { experience_booking_id: bookingId })
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error recording payment:', error);
      throw new Error(`Failed to record payment: ${error.message}`);
    }

    if (!data || !data.id) {
      throw new Error('Failed to record payment: No payment ID returned');
    }

    // Update the booking with payment information
    const table = bookingType === 'property' ? 'bookings' : 'experience_bookings';
    const { error: updateError } = await supabase
      .from(table)
      .update({
        payment_id: data.id,
        payment_status: paymentStatus,
        booking_status: paymentStatus === 'Successful' ? 'Confirmed' : 'Pending Payment',
        amount_paid: amount
      })
      .eq('id', bookingId);

    if (updateError) {
      console.error('Error updating booking with payment info:', updateError);
      // We don't throw here since the payment is recorded successfully
      // but we do log the error
    }

    return data.id;
  } catch (error) {
    console.error('Error in recordPayment:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Failed to record payment: ${errorMessage}`);
  }
};
