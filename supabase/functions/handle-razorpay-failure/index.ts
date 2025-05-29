
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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
      razorpayOrderId, 
      errorCode, 
      errorDescription, 
      bookingId, 
      bookingType 
    } = await req.json()

    console.log('Handling payment failure:', { 
      razorpayOrderId, 
      errorCode, 
      errorDescription, 
      bookingId, 
      bookingType 
    })

    // Update payment attempt as failed
    const { error: attemptError } = await supabase
      .from('payment_attempts')
      .update({
        status: 'failed',
        failure_code: errorCode,
        failure_description: errorDescription,
        completed_at: new Date().toISOString()
      })
      .eq('razorpay_order_id', razorpayOrderId)

    if (attemptError) {
      console.error('Error updating payment attempt:', attemptError)
    }

    // Record payment failure in payments table
    const { error: paymentError } = await supabase
      .from('payments')
      .insert({
        booking_id: bookingType === 'property' ? bookingId : null,
        experience_booking_id: bookingType === 'experience' ? bookingId : null,
        amount: 0,
        currency: 'INR',
        transaction_id: `failed_${razorpayOrderId}`,
        payment_method: 'unknown',
        payment_status: 'Failed',
        payment_gateway: 'Razorpay',
        razorpay_order_id: razorpayOrderId,
        failure_reason: `${errorCode}: ${errorDescription}`,
        processed_at: new Date().toISOString()
      })

    if (paymentError) {
      console.error('Error recording failed payment:', paymentError)
    }

    // Record analytics for failed payment
    const { error: analyticsError } = await supabase
      .from('booking_analytics')
      .insert({
        booking_id: bookingType === 'property' ? bookingId : null,
        experience_booking_id: bookingType === 'experience' ? bookingId : null,
        event_type: 'payment_failed',
        event_data: {
          razorpay_order_id: razorpayOrderId,
          error_code: errorCode,
          error_description: errorDescription
        },
        created_at: new Date().toISOString()
      })

    if (analyticsError) {
      console.error('Error recording failure analytics:', analyticsError)
    }

    console.log('Payment failure handled successfully')

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error in handle-razorpay-failure:', error)
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || 'Failed to handle payment failure' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
