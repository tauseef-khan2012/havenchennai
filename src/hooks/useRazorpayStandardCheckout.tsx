
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { UUID, BookingType } from '@/types/booking';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayStandardCheckoutProps {
  onSuccess: (paymentId: string, orderId: string, signature: string) => void;
  onFailure: (error: any) => void;
}

export const useRazorpayStandardCheckout = ({
  onSuccess,
  onFailure
}: RazorpayStandardCheckoutProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const { toast } = useToast();

  // Load Razorpay script
  const loadRazorpayScript = useCallback(() => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        setIsScriptLoaded(true);
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        setIsScriptLoaded(true);
        resolve(true);
      };
      script.onerror = () => {
        console.error('Failed to load Razorpay script');
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }, []);

  const initiatePayment = useCallback(async (
    bookingId: UUID,
    bookingType: BookingType,
    amount: number,
    currency: string,
    customerDetails: {
      name: string;
      email: string;
      phone?: string;
    },
    bookingReference: string
  ) => {
    setIsLoading(true);

    try {
      // Load Razorpay script first
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load payment gateway');
      }

      // Create Razorpay order via Supabase Edge Function
      const { data: orderData, error: orderError } = await supabase.functions.invoke(
        'create-razorpay-order',
        {
          body: {
            amount,
            currency,
            receipt: bookingReference,
            notes: {
              bookingId,
              bookingType,
              bookingReference
            },
            bookingId,
            bookingType
          }
        }
      );

      if (orderError || !orderData) {
        console.error('Error creating order:', orderError);
        throw new Error(orderError?.message || 'Failed to create payment order');
      }

      console.log('Order created successfully:', orderData);

      // Configure Razorpay options for Standard Checkout
      const options = {
        key: orderData.razorpayKey,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Haven',
        description: `Booking ${bookingReference}`,
        order_id: orderData.orderId,
        prefill: {
          name: customerDetails.name,
          email: customerDetails.email,
          contact: customerDetails.phone || ''
        },
        notes: {
          bookingId,
          bookingType,
          bookingReference
        },
        theme: {
          color: '#2D4F3C' // Haven brand color
        },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          console.log('Payment successful:', response);
          onSuccess(
            response.razorpay_payment_id,
            response.razorpay_order_id,
            response.razorpay_signature
          );
        },
        modal: {
          ondismiss: () => {
            console.log('Payment modal dismissed');
            onFailure({
              code: 'PAYMENT_CANCELLED',
              message: 'Payment was cancelled by user'
            });
          }
        }
      };

      // Open Razorpay Standard Checkout
      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', (response: any) => {
        console.error('Payment failed:', response);
        onFailure({
          code: response.error.code,
          message: response.error.description,
          razorpayOrderId: orderData.orderId
        });
      });

      rzp.open();

    } catch (error) {
      console.error('Error initiating payment:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      toast({
        title: 'Payment initialization failed',
        description: errorMessage,
        variant: 'destructive'
      });
      
      onFailure({
        code: 'INITIALIZATION_FAILED',
        message: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  }, [loadRazorpayScript, onSuccess, onFailure, toast]);

  return {
    isLoading,
    isScriptLoaded,
    initiatePayment
  };
};
