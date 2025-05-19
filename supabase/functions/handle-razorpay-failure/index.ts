
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

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
    const { razorpayOrderId, errorCode, errorDescription, bookingId, bookingType } = await req.json();
    
    // Validate request data
    if (!razorpayOrderId || !bookingId || !bookingType) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Record failed payment attempt
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        [bookingType === 'property' ? 'booking_id' : 'experience_booking_id']: bookingId,
        amount: 0, // Failed payment, no amount captured
        currency: 'INR', // Default currency
        transaction_id: razorpayOrderId,
        payment_method: 'Unknown',
        payment_gateway: 'Razorpay',
        payment_status: 'Failed',
        processed_at: new Date().toISOString()
      })
      .select('id')
      .single();
    
    if (paymentError) {
      console.error('Error recording failed payment:', paymentError);
      return new Response(
        JSON.stringify({ error: 'Failed to record payment failure' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Update booking with payment failure information
    const table = bookingType === 'property' ? 'bookings' : 'experience_bookings';
    
    const { error: updateError } = await supabase
      .from(table)
      .update({
        payment_id: payment.id,
        payment_status: 'Failed',
        internal_notes: `Payment failed: ${errorCode || 'Unknown error'} - ${errorDescription || 'No description'}`
      })
      .eq('id', bookingId);
    
    if (updateError) {
      console.error('Error updating booking with payment failure:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to update booking with payment failure information' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error handling Razorpay payment failure:', error);
    
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
