
import { supabase } from '@/integrations/supabase/client';
import { 
  UUID, 
  BookingType,
  PaymentInitiationData,
  PaymentConfirmationData,
  PaymentFailureData,
  PaymentRecord
} from '@/types/booking';

/**
 * Initiates a payment with the payment gateway
 * @param paymentData Payment initiation data
 * @returns Order ID and gateway API key
 */
export const initiatePayment = async (
  paymentData: PaymentInitiationData
): Promise<{
  orderId: string;
  razorpayKey: string;
}> => {
  try {
    // Call Supabase Edge Function to create Razorpay order
    const { data, error } = await supabase.functions.invoke('create-razorpay-order', {
      body: {
        bookingId: paymentData.bookingId,
        bookingType: paymentData.bookingType,
        amount: paymentData.amount,
        currency: paymentData.currency,
        receipt: paymentData.bookingReference,
        notes: {
          bookingReference: paymentData.bookingReference,
          userEmail: paymentData.userEmail,
          userName: paymentData.userName
        }
      }
    });

    if (error) {
      console.error('Error initiating payment:', error);
      throw new Error(`Failed to initiate payment: ${error.message}`);
    }

    if (!data || !data.orderId) {
      throw new Error('Failed to create payment order: No order ID returned');
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
