
import { supabase } from '@/integrations/supabase/client';
import { 
  UUID, 
  BookingType,
  PaymentInitiationData,
  PaymentConfirmationData,
  PaymentFailureData
} from '@/types/booking';

// This function would typically call a backend API/Edge Function
// that would securely create a Razorpay order
export const initiatePayment = async (paymentData: PaymentInitiationData): Promise<{
  orderId: string;
  razorpayKey: string;
}> => {
  try {
    // In a production environment, this should be a call to a Supabase Edge Function
    // that securely creates a Razorpay order with your API key
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
      throw new Error('Failed to create payment order');
    }

    return {
      orderId: data.orderId,
      razorpayKey: data.razorpayKey
    };
  } catch (error) {
    console.error('Error in initiatePayment:', error);
    throw error;
  }
};

// This function would verify payment and update booking status
export const verifyPayment = async (paymentData: PaymentConfirmationData): Promise<boolean> => {
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

    return data.success;
  } catch (error) {
    console.error('Error in verifyPayment:', error);
    throw error;
  }
};

// This function would be called when a payment fails
export const handlePaymentFailure = async (failureData: PaymentFailureData): Promise<void> => {
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
    throw error;
  }
};

// Record a payment in the database
export const recordPayment = async (
  bookingId: UUID,
  bookingType: BookingType,
  amount: number,
  currency: string,
  transactionId: string,
  paymentMethod: string,
  paymentStatus: string
): Promise<UUID> => {
  try {
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
      // Continue despite update error, as payment is recorded
    }

    return data.id;
  } catch (error) {
    console.error('Error in recordPayment:', error);
    throw error;
  }
};
