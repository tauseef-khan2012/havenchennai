
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

    const { amount, currency, receipt, notes, bookingId, bookingType } = await req.json()

    console.log('Creating Razorpay order:', { amount, currency, receipt, bookingId, bookingType })

    // Validate input
    if (!amount || amount <= 0) {
      throw new Error('Invalid amount')
    }

    if (!bookingId || !bookingType) {
      throw new Error('Missing booking details')
    }

    // Get Razorpay credentials
    const razorpayKeyId = 'rzp_test_Cr76JJQnGN8YSj'
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET')

    if (!razorpayKeySecret) {
      throw new Error('Razorpay secret key not configured')
    }

    // Create Razorpay order
    const orderData = {
      amount: Math.round(amount * 100), // Convert to paise
      currency: currency || 'INR',
      receipt: receipt || `order_${Date.now()}`,
      notes: notes || {}
    }

    console.log('Razorpay order data:', orderData)

    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${razorpayKeyId}:${razorpayKeySecret}`)}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData)
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Razorpay API error:', errorData)
      throw new Error(`Razorpay API error: ${response.status} ${errorData}`)
    }

    const order = await response.json()
    console.log('Razorpay order created:', order)

    // Track payment attempt in database
    const table = bookingType === 'property' ? 'bookings' : 'experience_bookings'
    
    // Update booking with payment attempt
    const { error: updateError } = await supabase
      .from(table)
      .update({
        payment_attempt_count: supabase.sql`COALESCE(payment_attempt_count, 0) + 1`,
        last_payment_attempt_at: new Date().toISOString(),
        checkout_started_at: supabase.sql`COALESCE(checkout_started_at, now())`
      })
      .eq('id', bookingId)

    if (updateError) {
      console.error('Error updating booking:', updateError)
    }

    // Record payment attempt
    const { error: attemptError } = await supabase
      .from('payment_attempts')
      .insert({
        booking_id: bookingType === 'property' ? bookingId : null,
        experience_booking_id: bookingType === 'experience' ? bookingId : null,
        razorpay_order_id: order.id,
        attempt_number: 1,
        amount: amount,
        currency: currency || 'INR',
        status: 'initiated',
        user_agent: req.headers.get('user-agent'),
        created_at: new Date().toISOString()
      })

    if (attemptError) {
      console.error('Error recording payment attempt:', attemptError)
    }

    // Record analytics event
    const { error: analyticsError } = await supabase
      .from('booking_analytics')
      .insert({
        booking_id: bookingType === 'property' ? bookingId : null,
        experience_booking_id: bookingType === 'experience' ? bookingId : null,
        event_type: 'payment_attempt',
        event_data: {
          razorpay_order_id: order.id,
          amount: amount,
          currency: currency
        },
        user_agent: req.headers.get('user-agent'),
        created_at: new Date().toISOString()
      })

    if (analyticsError) {
      console.error('Error recording analytics:', analyticsError)
    }

    return new Response(
      JSON.stringify({
        orderId: order.id,
        razorpayKey: razorpayKeyId,
        amount: order.amount,
        currency: order.currency
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error in create-razorpay-order:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        details: error.toString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
