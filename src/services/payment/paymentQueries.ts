
import { supabase } from '@/integrations/supabase/client';
import { PaymentRecord, UUID, BookingType, PaymentStatus, Currency } from '@/types/booking';

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

    // Map database fields to our PaymentRecord type
    return {
      bookingId: data.booking_id || data.experience_booking_id || '',
      bookingType: data.booking_id ? 'property' : 'experience',
      amount: data.amount,
      currency: (data.currency === 'USD' ? 'USD' : 'INR') as Currency,
      transactionId: data.transaction_id,
      paymentMethod: data.payment_method || '',
      paymentStatus: (data.payment_status as PaymentStatus) || 'Unpaid'
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
    // Select the correct booking ID field based on the booking type
    const idField = bookingType === 'property' ? 'booking_id' : 'experience_booking_id';
    
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq(idField, bookingId);

    if (error) {
      console.error('Error getting booking payments:', error);
      throw new Error(`Failed to get booking payments: ${error.message}`);
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Map database records to our PaymentRecord type
    return data.map(item => ({
      bookingId: item.booking_id || item.experience_booking_id || '',
      bookingType: item.booking_id ? 'property' : 'experience',
      amount: item.amount,
      currency: (item.currency === 'USD' ? 'USD' : 'INR') as Currency,
      transactionId: item.transaction_id,
      paymentMethod: item.payment_method || '',
      paymentStatus: (item.payment_status as PaymentStatus) || 'Unpaid'
    }));
  } catch (error) {
    console.error('Error in getBookingPayments:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Failed to get booking payments: ${errorMessage}`);
  }
};
