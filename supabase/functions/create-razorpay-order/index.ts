
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CreateOrderRequest {
  amount: number;
  currency: string;
  receipt: string;
  notes: Record<string, any>;
  bookingId: string;
  bookingType: 'property' | 'experience';
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get environment variables
    const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID');
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!razorpayKeyId || !razorpayKeySecret) {
      console.error('Missing Razorpay credentials');
      return new Response(
        JSON.stringify({ error: 'Payment gateway configuration error' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase configuration');
      return new Response(
        JSON.stringify({ error: 'Database configuration error' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Parse and validate request body
    const body: CreateOrderRequest = await req.json();
    
    // Enhanced input validation
    if (!body.amount || body.amount <= 0 || body.amount > 1000000) {
      return new Response(
        JSON.stringify({ error: 'Invalid amount. Must be between 1 and 1,000,000.' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (!body.currency || !['INR', 'USD'].includes(body.currency)) {
      return new Response(
        JSON.stringify({ error: 'Invalid currency. Only INR and USD are supported.' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (!body.receipt || body.receipt.length > 40) {
      return new Response(
        JSON.stringify({ error: 'Invalid receipt. Must be provided and less than 40 characters.' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (!body.bookingId || !body.bookingType) {
      return new Response(
        JSON.stringify({ error: 'Missing booking information' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify booking exists and get user context
    const { data: authUser, error: authError } = await supabase.auth.getUser(
      req.headers.get('Authorization')?.replace('Bearer ', '') || ''
    );

    // Verify booking ownership for authenticated users
    if (authUser?.user) {
      const table = body.bookingType === 'property' ? 'bookings' : 'experience_bookings';
      const { data: booking, error: bookingError } = await supabase
        .from(table)
        .select('user_id, guest_email')
        .eq('id', body.bookingId)
        .single();

      if (bookingError || !booking) {
        return new Response(
          JSON.stringify({ error: 'Booking not found' }),
          { 
            status: 404, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Check if user owns the booking (for authenticated users)
      if (booking.user_id && booking.user_id !== authUser.user.id) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized access to booking' }),
          { 
            status: 403, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
    }

    // Create Razorpay order
    const razorpayOrder = {
      amount: Math.round(body.amount * 100), // Convert to paise/cents
      currency: body.currency,
      receipt: body.receipt,
      notes: {
        ...body.notes,
        bookingId: body.bookingId,
        bookingType: body.bookingType
      }
    };

    const auth = btoa(`${razorpayKeyId}:${razorpayKeySecret}`);
    
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(razorpayOrder),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Razorpay API error:', errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to create payment order' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const order = await response.json();

    // Store payment attempt in database for audit trail
    await supabase
      .from('payment_attempts')
      .insert({
        booking_id: body.bookingType === 'property' ? body.bookingId : null,
        experience_booking_id: body.bookingType === 'experience' ? body.bookingId : null,
        attempt_number: 1,
        amount: body.amount,
        currency: body.currency,
        status: 'initiated',
        razorpay_order_id: order.id,
        ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
        user_agent: req.headers.get('user-agent')
      });

    return new Response(
      JSON.stringify({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        razorpayKey: razorpayKeyId
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in create-razorpay-order:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
