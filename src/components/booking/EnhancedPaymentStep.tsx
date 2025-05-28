
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  CreditCard, 
  Shield, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Loader2
} from 'lucide-react';
import { EnhancedPriceSummary } from './EnhancedPriceSummary';
import { useRazorpayPayment } from '@/hooks/useRazorpayPayment';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useCurrency } from '@/contexts/CurrencyContext';
import { initiatePayment, verifyPayment } from '@/services/payment';
import { EnhancedPriceBreakdown } from '@/services/enhancedPriceService';
import { UUID } from '@/types/booking';

interface EnhancedPaymentStepProps {
  bookingId: UUID;
  bookingReference: string;
  property: any;
  selectedCheckIn: Date;
  selectedCheckOut: Date;
  guestCount: number;
  nights: number;
  priceBreakdown: EnhancedPriceBreakdown;
  contactInfo: {
    fullName: string;
    email: string;
    phone: string;
  };
  onPaymentSuccess: () => void;
  onPaymentFailure: (error: string) => void;
}

export const EnhancedPaymentStep: React.FC<EnhancedPaymentStepProps> = ({
  bookingId,
  bookingReference,
  property,
  selectedCheckIn,
  selectedCheckOut,
  guestCount,
  nights,
  priceBreakdown,
  contactInfo,
  onPaymentSuccess,
  onPaymentFailure
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { formatPrice } = useCurrency();
  const [isInitiating, setIsInitiating] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'initiating' | 'processing' | 'success' | 'failed'>('idle');

  const { processPayment, isLoading: isRazorpayLoading, isReady } = useRazorpayPayment({
    onSuccess: async (paymentId, orderId, signature) => {
      try {
        setPaymentStatus('processing');
        await verifyPayment({
          razorpayPaymentId: paymentId,
          razorpayOrderId: orderId,
          razorpaySignature: signature,
          bookingId,
          bookingType: 'property'
        });
        setPaymentStatus('success');
        onPaymentSuccess();
        return true;
      } catch (error) {
        console.error('Payment verification failed:', error);
        setPaymentStatus('failed');
        onPaymentFailure('Payment verification failed');
        return false;
      }
    },
    onFailure: async (error) => {
      setPaymentStatus('failed');
      onPaymentFailure(error.message || 'Payment failed');
      return false;
    }
  });

  const handlePayment = async () => {
    if (!user || !isReady) {
      toast({
        title: 'Payment not ready',
        description: 'Please wait for the payment system to load.',
        variant: 'destructive'
      });
      return;
    }

    setIsInitiating(true);
    setPaymentStatus('initiating');

    try {
      const { orderId, razorpayKey } = await initiatePayment({
        bookingId,
        bookingType: 'property',
        amount: priceBreakdown.totalAmountDue,
        currency: priceBreakdown.currency,
        userEmail: contactInfo.email,
        userName: contactInfo.fullName,
        bookingReference
      });

      const options = {
        key: razorpayKey,
        amount: priceBreakdown.totalAmountDue * 100,
        currency: priceBreakdown.currency,
        name: 'Haven',
        description: `Booking ${bookingReference}`,
        order_id: orderId,
        prefill: {
          name: contactInfo.fullName,
          email: contactInfo.email,
          contact: contactInfo.phone
        },
        notes: {
          bookingId,
          bookingReference,
          propertyName: property.name
        },
        theme: {
          color: '#2D4F3C'
        }
      };

      processPayment(options);
    } catch (error) {
      console.error('Error initiating payment:', error);
      setPaymentStatus('failed');
      onPaymentFailure('Failed to initiate payment');
    } finally {
      setIsInitiating(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'processing':
      case 'initiating':
        return <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />;
      default:
        return <CreditCard className="h-5 w-5 text-haven-teal" />;
    }
  };

  const getStatusText = () => {
    switch (paymentStatus) {
      case 'initiating':
        return 'Initiating payment...';
      case 'processing':
        return 'Processing payment...';
      case 'success':
        return 'Payment successful!';
      case 'failed':
        return 'Payment failed';
      default:
        return 'Complete Payment';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Booking Confirmation */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <div>
              <h2 className="text-xl font-semibold text-green-900">Booking Created Successfully</h2>
              <p className="text-green-700">Booking Reference: <strong>{bookingReference}</strong></p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-green-900 mb-2">Booking Details</h3>
              <div className="space-y-1 text-sm text-green-800">
                <p><strong>Property:</strong> {property.name}</p>
                <p><strong>Check-in:</strong> {formatDate(selectedCheckIn)}</p>
                <p><strong>Check-out:</strong> {formatDate(selectedCheckOut)}</p>
                <p><strong>Guests:</strong> {guestCount}</p>
                <p><strong>Duration:</strong> {nights} {nights === 1 ? 'night' : 'nights'}</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-green-900 mb-2">Contact Information</h3>
              <div className="space-y-1 text-sm text-green-800">
                <p><strong>Name:</strong> {contactInfo.fullName}</p>
                <p><strong>Email:</strong> {contactInfo.email}</p>
                <p><strong>Phone:</strong> {contactInfo.phone}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Method */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon()}
              {getStatusText()}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-blue-900 mb-1">Secure Payment</p>
                  <p className="text-blue-800">
                    Your payment is processed securely through Razorpay with 256-bit SSL encryption.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-gray-600" />
                <span className="text-sm">Credit & Debit Cards</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">💳</span>
                <span className="text-sm">UPI & Net Banking</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">📱</span>
                <span className="text-sm">Digital Wallets</span>
              </div>
            </div>
            
            <Button 
              onClick={handlePayment}
              disabled={!isReady || isInitiating || isRazorpayLoading || paymentStatus === 'processing' || paymentStatus === 'success'}
              className="w-full bg-haven-teal hover:bg-haven-teal/90 text-white py-3 text-lg font-medium"
              size="lg"
            >
              {isInitiating || isRazorpayLoading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : paymentStatus === 'success' ? (
                <>
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Payment Complete
                </>
              ) : (
                <>
                  <CreditCard className="h-5 w-5 mr-2" />
                  Pay {formatPrice(priceBreakdown.totalAmountDue, priceBreakdown.currency)}
                </>
              )}
            </Button>
            
            {paymentStatus === 'idle' && (
              <p className="text-xs text-gray-500 text-center">
                Click to proceed to secure payment gateway
              </p>
            )}
          </CardContent>
        </Card>

        {/* Price Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <EnhancedPriceSummary 
              priceBreakdown={priceBreakdown} 
              nights={nights}
              showCompetitorComparison={false}
            />
            
            {priceBreakdown.savingsFromCompetitors && priceBreakdown.savingsFromCompetitors > 0 && (
              <>
                <Separator className="my-4" />
                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-800">You saved by booking direct</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {formatPrice(priceBreakdown.savingsFromCompetitors, priceBreakdown.currency)}
                    </Badge>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Important Notes */}
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-amber-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-amber-900 mb-1">Important Information</p>
              <ul className="text-amber-800 space-y-1">
                <li>• Payment must be completed within 15 minutes to secure your booking</li>
                <li>• You will receive a confirmation email once payment is successful</li>
                <li>• Check-in instructions will be sent 24 hours before your arrival</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
