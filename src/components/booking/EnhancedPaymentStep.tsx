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
  ExternalLink,
  Calendar,
  Users,
  MapPin
} from 'lucide-react';
import { EnhancedPriceSummary } from './EnhancedPriceSummary';
import { useEnhancedBookingPayment } from '@/hooks/useEnhancedBookingPayment';
import { useAuth } from '@/contexts/AuthContext';
import { useCurrency } from '@/contexts/CurrencyContext';
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
        return <CheckCircle className="h-5 w-5 text-haven-yellow" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-400" />;
      case 'processing':
        return <Loader2 className="h-5 w-5 text-haven-yellow animate-spin" />;
      default:
        return <CreditCard className="h-5 w-5 text-haven-yellow" />;
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
    <div className="min-h-screen bg-navy-gradient py-8">
      <div className="absolute inset-0 bg-organic-texture opacity-20"></div>
      <div className="absolute inset-0 leaf-pattern opacity-15"></div>
      
      {/* Floating decorative elements */}
      <div className="absolute top-16 left-8 w-20 h-20 rounded-organic bg-haven-yellow/10 animate-float-gentle"></div>
      <div className="absolute bottom-20 right-12 w-16 h-16 rounded-organic-2 bg-haven-navy-light/20 animate-float-gentle" style={{ animationDelay: '1s' }}></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Booking Confirmation */}
          <Card className="bg-yellow-gradient/10 border-haven-yellow/30 shadow-yellow animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="h-6 w-6 text-haven-yellow" />
                <div>
                  <h2 className="text-xl font-serif font-semibold text-haven-beige">Booking Created Successfully</h2>
                  <p className="text-haven-beige/80">Booking Reference: <strong className="text-haven-yellow">{bookingReference}</strong></p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-panel rounded-2xl p-4">
                  <h3 className="font-medium text-haven-beige mb-3 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-haven-yellow" />
                    Booking Details
                  </h3>
                  <div className="space-y-2 text-sm text-haven-beige/80">
                    <p><strong className="text-haven-beige">Property:</strong> {property.name}</p>
                    <p><strong className="text-haven-beige">Check-in:</strong> {formatDate(selectedCheckIn)}</p>
                    <p><strong className="text-haven-beige">Check-out:</strong> {formatDate(selectedCheckOut)}</p>
                    <p><strong className="text-haven-beige">Guests:</strong> {guestCount}</p>
                    <p><strong className="text-haven-beige">Duration:</strong> {nights} {nights === 1 ? 'night' : 'nights'}</p>
                  </div>
                </div>
                
                <div className="glass-panel rounded-2xl p-4">
                  <h3 className="font-medium text-haven-beige mb-3 flex items-center gap-2">
                    <Users className="h-4 w-4 text-haven-yellow" />
                    Contact Information
                  </h3>
                  <div className="space-y-2 text-sm text-haven-beige/80">
                    <p><strong className="text-haven-beige">Name:</strong> {contactInfo.fullName}</p>
                    <p><strong className="text-haven-beige">Email:</strong> {contactInfo.email}</p>
                    <p><strong className="text-haven-beige">Phone:</strong> {contactInfo.phone}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Razorpay Standard Checkout */}
            <Card className="glass-panel-navy border-haven-yellow/20 shadow-navy animate-fade-in-delay">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-haven-beige">
                  {getStatusIcon()}
                  {getStatusText()}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-yellow-gradient/10 p-4 rounded-2xl border border-haven-yellow/30">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-haven-yellow mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-haven-beige mb-1">Secure Payment via Razorpay</p>
                      <p className="text-haven-beige/80">
                        You'll be redirected to Razorpay's secure checkout page to complete your payment safely.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-haven-beige/80">
                    <CreditCard className="h-4 w-4 text-haven-yellow" />
                    <span className="text-sm">Credit & Debit Cards</span>
                  </div>
                  <div className="flex items-center gap-2 text-haven-beige/80">
                    <span className="text-sm">💳</span>
                    <span className="text-sm">UPI & Net Banking</span>
                  </div>
                  <div className="flex items-center gap-2 text-haven-beige/80">
                    <span className="text-sm">📱</span>
                    <span className="text-sm">Digital Wallets (Paytm, PhonePe, etc.)</span>
                  </div>
                  <div className="flex items-center gap-2 text-haven-beige/80">
                    <span className="text-sm">🏦</span>
                    <span className="text-sm">EMI Options Available</span>
                  </div>
                </div>
                
                <Button 
                  onClick={handlePayment}
                  disabled={isLoading || paymentStatus === 'processing' || paymentStatus === 'success'}
                  className="w-full bg-yellow-gradient hover:shadow-yellow text-haven-navy py-3 text-lg font-medium transition-all duration-300 transform hover:scale-105 ripple-effect"
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
                  <p className="text-xs text-haven-beige/60 text-center">
                    Powered by Razorpay - India's most trusted payment gateway
                  </p>
                )}
                
                {paymentStatus === 'processing' && (
                  <div className="bg-yellow-gradient/10 p-3 rounded-2xl border border-haven-yellow/30">
                    <p className="text-sm text-haven-beige text-center">
                      <strong>Please complete your payment on the Razorpay page</strong><br />
                      Don't close this window until payment is complete
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Price Summary */}
            <Card className="glass-panel-navy border-haven-yellow/20 shadow-navy animate-fade-in-delay-2">
              <CardHeader>
                <CardTitle className="text-haven-beige flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-haven-yellow" />
                  Payment Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <EnhancedPriceSummary 
                  priceBreakdown={priceBreakdown} 
                  nights={nights}
                  showCompetitorComparison={false}
                />
                
                {priceBreakdown.savingsFromCompetitors && priceBreakdown.savingsFromCompetitors > 0 && (
                  <>
                    <Separator className="my-4 bg-haven-yellow/20" />
                    <div className="bg-yellow-gradient/10 p-3 rounded-2xl border border-haven-yellow/30">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-haven-beige">You saved by booking direct</span>
                        <Badge variant="secondary" className="bg-haven-yellow text-haven-navy">
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
          <Card className="bg-yellow-gradient/5 border-haven-yellow/20 shadow-yellow animate-fade-in-delay">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-haven-yellow mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-haven-beige mb-2">Important Information</p>
                  <ul className="text-haven-beige/80 space-y-1">
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
      </div>
    </div>
  );
};
