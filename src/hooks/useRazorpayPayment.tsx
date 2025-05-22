
import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface UseRazorpayPaymentProps {
  onSuccess?: (paymentId: string, orderId: string, signature: string) => Promise<boolean> | void;
  onFailure?: (error: any) => Promise<boolean> | void;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: {
    name: string;
    email: string;
    contact?: string;
  };
  notes: {
    [key: string]: any;
  };
  theme: {
    color: string;
  };
}

export const useRazorpayPayment = ({
  onSuccess,
  onFailure
}: UseRazorpayPaymentProps = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const { toast } = useToast();

  // Load Razorpay script
  useEffect(() => {
    if (window.Razorpay) {
      setIsScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setIsScriptLoaded(true);
    script.onerror = () => {
      console.error('Failed to load Razorpay script');
      toast({
        title: 'Payment error',
        description: 'Failed to load payment gateway. Please try again later.',
        variant: 'destructive'
      });
    };
    
    document.body.appendChild(script);
    
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [toast]);

  const processPayment = useCallback((options: RazorpayOptions) => {
    if (!isScriptLoaded) {
      toast({
        title: 'Payment error',
        description: 'Payment gateway is not loaded yet. Please try again.',
        variant: 'destructive'
      });
      if (onFailure) onFailure(new Error('Payment gateway not loaded'));
      return;
    }

    setIsLoading(true);

    try {
      const rzp = new window.Razorpay({
        ...options,
        handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
          setIsLoading(false);
          
          if (onSuccess) {
            await onSuccess(
              response.razorpay_payment_id,
              response.razorpay_order_id,
              response.razorpay_signature
            );
          }
        },
        modal: {
          ondismiss: async () => {
            setIsLoading(false);
            toast({
              title: 'Payment cancelled',
              description: 'You have cancelled the payment process.',
              variant: 'destructive'
            });
            if (onFailure) await onFailure(new Error('Payment cancelled by user'));
          }
        }
      });

      rzp.on('payment.failed', async (response: any) => {
        setIsLoading(false);
        toast({
          title: 'Payment failed',
          description: response.error.description || 'Your payment has failed. Please try again.',
          variant: 'destructive'
        });
        if (onFailure) await onFailure(response.error);
      });

      rzp.open();
    } catch (error) {
      setIsLoading(false);
      console.error('Error opening Razorpay:', error);
      toast({
        title: 'Payment error',
        description: 'Failed to open payment gateway. Please try again.',
        variant: 'destructive'
      });
      if (onFailure) onFailure(error);
    }
  }, [isScriptLoaded, onSuccess, onFailure, toast]);

  return {
    isLoading,
    isReady: isScriptLoaded,
    processPayment
  };
};
