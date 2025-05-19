
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { createHmac } from "https://deno.land/std@0.167.0/node/crypto.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Get request data
    const { razorpayPaymentId, razorpayOrderId, razorpaySignature, bookingId, bookingType } = await req.json();
    
    // Validate request data
    if (!razorpayPaymentId || !razorpayOrderId || !razorpaySignature || !bookingId || !bookingType) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Verify signature
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET')!;
    const generatedSignature = createHmac('sha256', razorpayKeySecret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');
    
    if (generatedSignature !== razorpaySignature) {
      console.error('Invalid Razorpay signature');
      return new Response(
        JSON.stringify({ error: 'Invalid payment signature', success: false }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Fetch payment details from Razorpay
    const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID')!;
    const razorpayAuth = btoa(`${razorpayKeyId}:${razorpayKeySecret}`);
    
    const paymentResponse = await fetch(`https://api.razorpay.com/v1/payments/${razorpayPaymentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${razorpayAuth}`,
        'Content-Type': 'application/json'
      }
    });
    
    const paymentData = await paymentResponse.json();
    
    if (!paymentResponse.ok) {
      console.error('Failed to fetch payment details:', paymentData);
      return new Response(
        JSON.stringify({ error: 'Failed to verify payment details', success: false }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Verify payment status
    if (paymentData.status !== 'captured') {
      console.error('Payment not captured:', paymentData);
      return new Response(
        JSON.stringify({ error: 'Payment not captured', success: false }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Record payment in database
    const table = bookingType === 'property' ? 'bookings' : 'experience_bookings';
    
    // Get booking information
    const { data: booking, error: bookingError } = await supabase
      .from(table)
      .select('*')
      .eq('id', bookingId)
      .single();
    
    if (bookingError || !booking) {
      console.error('Booking not found:', bookingError);
      return new Response(
        JSON.stringify({ error: 'Booking not found', success: false }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Insert payment record
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        [bookingType === 'property' ? 'booking_id' : 'experience_booking_id']: bookingId,
        amount: paymentData.amount / 100, // Convert from paise to INR
        currency: paymentData.currency,
        transaction_id: paymentData.id,
        payment_method: paymentData.method,
        payment_gateway: 'Razorpay',
        payment_status: 'Successful',
        processed_at: new Date().toISOString()
      })
      .select('id')
      .single();
    
    if (paymentError) {
      console.error('Error recording payment:', paymentError);
      return new Response(
        JSON.stringify({ error: 'Failed to record payment', success: false }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Update booking status
    const { error: updateError } = await supabase
      .from(table)
      .update({
        payment_id: payment.id,
        payment_status: 'Paid',
        booking_status: 'Confirmed',
        amount_paid: paymentData.amount / 100, // Convert from paise to INR
        confirmed_at: new Date().toISOString()
      })
      .eq('id', bookingId);
    
    if (updateError) {
      console.error('Error updating booking status:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to update booking status', success: false }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        paymentId: payment.id,
        bookingStatus: 'Confirmed'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error verifying Razorpay payment:', error);
    
    return new Response(
      JSON.stringify({ error: 'Internal server error', success: false }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
