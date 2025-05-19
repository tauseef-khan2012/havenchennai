
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
    const { bookingId, bookingType, amount, currency, receipt, notes } = await req.json();
    
    // Validate request data
    if (!bookingId || !bookingType || !amount || !currency) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Verify booking exists
    const table = bookingType === 'property' ? 'bookings' : 'experience_bookings';
    const { data: booking, error: bookingError } = await supabase
      .from(table)
      .select('*')
      .eq('id', bookingId)
      .single();
    
    if (bookingError || !booking) {
      return new Response(
        JSON.stringify({ error: 'Booking not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Initialize Razorpay API with keys from environment variables
    const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID')!;
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET')!;
    
    // Base64 encode the API key and secret for Basic Auth
    const razorpayAuth = btoa(`${razorpayKeyId}:${razorpayKeySecret}`);
    
    // Create Razorpay order
    const razorpayResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${razorpayAuth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: amount * 100, // Razorpay expects amount in paise (100 paise = 1 INR)
        currency,
        receipt,
        notes
      })
    });
    
    const razorpayData = await razorpayResponse.json();
    
    if (!razorpayResponse.ok) {
      console.error('Razorpay error:', razorpayData);
      return new Response(
        JSON.stringify({ error: 'Failed to create Razorpay order' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        orderId: razorpayData.id,
        razorpayKey: razorpayKeyId
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
