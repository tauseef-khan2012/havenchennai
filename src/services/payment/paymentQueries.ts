
import { supabase } from '@/integrations/supabase/client';
import { UUID, BookingType } from '@/types/booking';

/**
 * Gets payment details by ID
 * @param paymentId Payment ID
 * @returns Payment details
 */
export const getPaymentDetails = async (paymentId: UUID): Promise<any> => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('id', paymentId)
      .single();

    if (error) {
      console.error('Error fetching payment details:', error);
      throw new Error(`Failed to fetch payment: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error in getPaymentDetails:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Failed to get payment details: ${errorMessage}`);
  }
};

/**
 * Gets payments for a booking
 * @param bookingId Booking ID
 * @param bookingType Type of booking
 * @returns List of payments
 */
export const getBookingPayments = async (
  bookingId: UUID,
  bookingType: BookingType
): Promise<any[]> => {
  try {
    const column = bookingType === 'property' ? 'booking_id' : 'experience_booking_id';
    
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq(column, bookingId)
      .order('processed_at', { ascending: false });

    if (error) {
      console.error('Error fetching booking payments:', error);
      throw new Error(`Failed to fetch payments: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error in getBookingPayments:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Failed to get booking payments: ${errorMessage}`);
  }
};
