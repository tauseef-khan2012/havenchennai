
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { createHmac } from "https://deno.land/std@0.190.0/node/crypto.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { 
      razorpayPaymentId, 
      razorpayOrderId, 
      razorpaySignature, 
      bookingId, 
      bookingType 
    } = await req.json()

    console.log('Verifying payment:', { razorpayPaymentId, razorpayOrderId, bookingId, bookingType })

    // Get Razorpay secret
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET')
    if (!razorpayKeySecret) {
      throw new Error('Razorpay secret key not configured')
    }

    // Verify signature
    const body = razorpayOrderId + "|" + razorpayPaymentId
    const expectedSignature = createHmac('sha256', razorpayKeySecret)
      .update(body)
      .digest('hex')

    console.log('Signature verification:', { 
      expected: expectedSignature, 
      received: razorpaySignature 
    })

    if (expectedSignature !== razorpaySignature) {
      console.error('Signature verification failed')
      
      // Record failed payment attempt
      await supabase
        .from('payment_attempts')
        .update({
          status: 'failed',
          failure_code: 'SIGNATURE_VERIFICATION_FAILED',
          failure_description: 'Payment signature verification failed',
          completed_at: new Date().toISOString()
        })
        .eq('razorpay_order_id', razorpayOrderId)

      throw new Error('Payment signature verification failed')
    }

    // Get payment details from Razorpay
    const razorpayKeyId = 'rzp_test_Cr76JJQnGN8YSj'
    const paymentResponse = await fetch(`https://api.razorpay.com/v1/payments/${razorpayPaymentId}`, {
      headers: {
        'Authorization': `Basic ${btoa(`${razorpayKeyId}:${razorpayKeySecret}`)}`,
      }
    })

    if (!paymentResponse.ok) {
      throw new Error('Failed to fetch payment details from Razorpay')
    }

    const paymentDetails = await paymentResponse.json()
    console.log('Payment details from Razorpay:', paymentDetails)

    // Determine table based on booking type
    const table = bookingType === 'property' ? 'bookings' : 'experience_bookings'

    // Update booking status
    const { error: bookingError } = await supabase
      .from(table)
      .update({
        booking_status: 'Confirmed',
        payment_status: 'Paid',
        confirmed_at: new Date().toISOString()
      })
      .eq('id', bookingId)

    if (bookingError) {
      console.error('Error updating booking:', bookingError)
      throw new Error('Failed to update booking status')
    }

    // Record payment in payments table
    const { error: paymentError } = await supabase
      .from('payments')
      .insert({
        booking_id: bookingType === 'property' ? bookingId : null,
        experience_booking_id: bookingType === 'experience' ? bookingId : null,
        amount: paymentDetails.amount / 100, // Convert from paise
        currency: paymentDetails.currency,
        transaction_id: razorpayPaymentId,
        payment_method: paymentDetails.method,
        payment_status: 'Successful',
        payment_gateway: 'Razorpay',
        razorpay_order_id: razorpayOrderId,
        razorpay_payment_id: razorpayPaymentId,
        razorpay_signature: razorpaySignature,
        processed_at: new Date().toISOString()
      })

    if (paymentError) {
      console.error('Error recording payment:', paymentError)
    }

    // Update payment attempt as successful
    const { error: attemptError } = await supabase
      .from('payment_attempts')
      .update({
        status: 'success',
        payment_method: paymentDetails.method,
        completed_at: new Date().toISOString()
      })
      .eq('razorpay_order_id', razorpayOrderId)

    if (attemptError) {
      console.error('Error updating payment attempt:', attemptError)
    }

    // Record successful booking analytics
    const { error: analyticsError } = await supabase
      .from('booking_analytics')
      .insert({
        booking_id: bookingType === 'property' ? bookingId : null,
        experience_booking_id: bookingType === 'experience' ? bookingId : null,
        event_type: 'booking_complete',
        event_data: {
          razorpay_payment_id: razorpayPaymentId,
          razorpay_order_id: razorpayOrderId,
          payment_method: paymentDetails.method,
          amount: paymentDetails.amount / 100
        },
        created_at: new Date().toISOString()
      })

    if (analyticsError) {
      console.error('Error recording analytics:', analyticsError)
    }

    console.log('Payment verification successful')

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error in verify-razorpay-payment:', error)
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || 'Payment verification failed' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
