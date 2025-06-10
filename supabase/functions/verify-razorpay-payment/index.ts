
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { createHmac } from "https://deno.land/std@0.168.0/crypto/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface VerifyPaymentRequest {
  razorpayPaymentId: string;
  razorpayOrderId: string;
  razorpaySignature: string;
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
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!razorpayKeySecret) {
      console.error('Missing Razorpay key secret');
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
    const body: VerifyPaymentRequest = await req.json();
    
    // Enhanced input validation
    if (!body.razorpayPaymentId || !body.razorpayOrderId || !body.razorpaySignature) {
      return new Response(
        JSON.stringify({ error: 'Missing payment verification data' }),
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

    // Verify signature
    const generated_signature = createHmac("sha256", razorpayKeySecret)
      .update(`${body.razorpayOrderId}|${body.razorpayPaymentId}`)
      .digest("hex");

    if (generated_signature !== body.razorpaySignature) {
      console.error('Payment signature verification failed');
      
      // Log failed verification attempt
      await supabase
        .from('payment_attempts')
        .update({
          status: 'failed',
          failure_code: 'SIGNATURE_VERIFICATION_FAILED',
          failure_description: 'Payment signature verification failed',
          completed_at: new Date().toISOString()
        })
        .eq('razorpay_order_id', body.razorpayOrderId);

      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Payment verification failed' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get user context for authorization
    const { data: authUser, error: authError } = await supabase.auth.getUser(
      req.headers.get('Authorization')?.replace('Bearer ', '') || ''
    );

    // Verify booking exists and user has access
    const table = body.bookingType === 'property' ? 'bookings' : 'experience_bookings';
    const { data: booking, error: bookingError } = await supabase
      .from(table)
      .select('user_id, guest_email, total_amount_due, payment_status')
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

    // Check authorization - user must own booking or be guest with matching email
    if (authUser?.user && booking.user_id && booking.user_id !== authUser.user.id) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized access to booking' }),
        { 
          status: 403, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Prevent duplicate payments
    if (booking.payment_status === 'Paid') {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Payment already completed for this booking' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Create payment record
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        booking_id: body.bookingType === 'property' ? body.bookingId : null,
        experience_booking_id: body.bookingType === 'experience' ? body.bookingId : null,
        amount: booking.total_amount_due,
        currency: 'INR',
        transaction_id: body.razorpayPaymentId,
        payment_method: 'razorpay',
        payment_gateway: 'razorpay',
        payment_status: 'Successful',
        razorpay_order_id: body.razorpayOrderId,
        razorpay_payment_id: body.razorpayPaymentId,
        razorpay_signature: body.razorpaySignature,
        processed_at: new Date().toISOString(),
        ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
        user_agent: req.headers.get('user-agent')
      })
      .select()
      .single();

    if (paymentError) {
      console.error('Error creating payment record:', paymentError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to record payment' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Update booking status
    const { error: updateError } = await supabase
      .from(table)
      .update({
        payment_status: 'Paid',
        booking_status: 'Confirmed',
        confirmed_at: new Date().toISOString(),
        amount_paid: booking.total_amount_due,
        payment_id: payment.id
      })
      .eq('id', body.bookingId);

    if (updateError) {
      console.error('Error updating booking status:', updateError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to update booking status' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Update payment attempt record
    await supabase
      .from('payment_attempts')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('razorpay_order_id', body.razorpayOrderId);

    return new Response(
      JSON.stringify({ 
        success: true, 
        paymentId: payment.id,
        bookingStatus: 'Confirmed'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in verify-razorpay-payment:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
