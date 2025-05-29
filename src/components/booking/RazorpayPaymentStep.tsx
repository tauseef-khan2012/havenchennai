
import React, { useState } from 'react';
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
  Loader2,
  ExternalLink
} from 'lucide-react';
import { EnhancedPriceSummary } from './EnhancedPriceSummary';
import { useEnhancedBookingPayment } from '@/hooks/useEnhancedBookingPayment';
import { useAuth } from '@/contexts/AuthContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { EnhancedPriceBreakdown } from '@/services/enhancedPriceService';
import { UUID } from '@/types/booking';

interface RazorpayPaymentStepProps {
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

export const RazorpayPaymentStep: React.FC<RazorpayPaymentStepProps> = ({
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
  const { formatPrice } = useCurrency();
  const { processBookingPayment, isLoading } = useEnhancedBookingPayment();
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');

  const handlePayment = async () => {
    if (!user) {
      onPaymentFailure('Please sign in to complete payment');
      return;
    }

    setPaymentStatus('processing');

    const success = await processBookingPayment(
      bookingId,
      'property',
      priceBreakdown.totalAmountDue,
      priceBreakdown.currency,
      {
        name: contactInfo.fullName,
        email: contactInfo.email,
        phone: contactInfo.phone
      },
      bookingReference,
      (paymentSuccess: boolean) => {
        if (paymentSuccess) {
          setPaymentStatus('success');
          onPaymentSuccess();
        } else {
          setPaymentStatus('failed');
          onPaymentFailure('Payment processing failed');
        }
      }
    );

    if (!success) {
      setPaymentStatus('failed');
      onPaymentFailure('Failed to initiate payment');
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
        return <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />;
      default:
        return <CreditCard className="h-5 w-5 text-haven-teal" />;
    }
  };

  const getStatusText = () => {
    switch (paymentStatus) {
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
        {/* Razorpay Standard Checkout */}
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
                  <p className="font-medium text-blue-900 mb-1">Secure Payment via Razorpay</p>
                  <p className="text-blue-800">
                    You'll be redirected to Razorpay's secure checkout page to complete your payment safely.
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
                <span className="text-sm">Digital Wallets (Paytm, PhonePe, etc.)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">🏦</span>
                <span className="text-sm">EMI Options Available</span>
              </div>
            </div>
            
            <Button 
              onClick={handlePayment}
              disabled={isLoading || paymentStatus === 'processing' || paymentStatus === 'success'}
              className="w-full bg-haven-teal hover:bg-haven-teal/90 text-white py-3 text-lg font-medium"
              size="lg"
            >
              {isLoading || paymentStatus === 'processing' ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Opening Razorpay...
                </>
              ) : paymentStatus === 'success' ? (
                <>
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Payment Complete
                </>
              ) : (
                <>
                  <ExternalLink className="h-5 w-5 mr-2" />
                  Pay {formatPrice(priceBreakdown.totalAmountDue, priceBreakdown.currency)} via Razorpay
                </>
              )}
            </Button>
            
            {paymentStatus === 'idle' && (
              <p className="text-xs text-gray-500 text-center">
                Powered by Razorpay - India's most trusted payment gateway
              </p>
            )}
            
            {paymentStatus === 'processing' && (
              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-800 text-center">
                  <strong>Please complete your payment on the Razorpay page</strong><br />
                  Don't close this window until payment is complete
                </p>
              </div>
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
                <li>• Your booking is confirmed immediately after successful payment</li>
                <li>• You will receive confirmation email and booking voucher</li>
                <li>• Check-in instructions will be sent 24 hours before arrival</li>
                <li>• All payments are processed securely through Razorpay</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
