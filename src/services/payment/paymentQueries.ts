
import { supabase } from '@/integrations/supabase/client';
import { PaymentRecord, UUID, BookingType } from '@/types/booking';

/**
 * Gets details for a specific payment
 * @param transactionId Transaction ID
 * @returns Payment record
 */
export const getPaymentDetails = async (transactionId: string): Promise<PaymentRecord | null> => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('transaction_id', transactionId)
      .maybeSingle();

    if (error) {
      console.error('Error getting payment details:', error);
      throw new Error(`Failed to get payment details: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    return {
      bookingId: data.booking_id,
      bookingType: data.booking_type as BookingType,
      amount: data.amount,
      currency: data.currency,
      transactionId: data.transaction_id,
      paymentMethod: data.payment_method,
      paymentStatus: data.status
    };
  } catch (error) {
    console.error('Error in getPaymentDetails:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Failed to get payment details: ${errorMessage}`);
  }
};

/**
 * Gets all payments for a booking
 * @param bookingId Booking ID
 * @param bookingType Booking type
 * @returns Array of payment records
 */
export const getBookingPayments = async (
  bookingId: UUID,
  bookingType: BookingType
): Promise<PaymentRecord[]> => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('booking_id', bookingId)
      .eq('booking_type', bookingType);

    if (error) {
      console.error('Error getting booking payments:', error);
      throw new Error(`Failed to get booking payments: ${error.message}`);
    }

    if (!data || data.length === 0) {
      return [];
    }

    return data.map(item => ({
      bookingId: item.booking_id,
      bookingType: item.booking_type as BookingType,
      amount: item.amount,
      currency: item.currency,
      transactionId: item.transaction_id,
      paymentMethod: item.payment_method,
      paymentStatus: item.status
    }));
  } catch (error) {
    console.error('Error in getBookingPayments:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Failed to get booking payments: ${errorMessage}`);
  }
};
