
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBookingPayment } from '@/hooks/useBookingPayment';
import { createBooking } from '@/services/bookingService';
import { EnhancedPriceSummary } from '@/components/booking/EnhancedPriceSummary';
import { calculateEnhancedPropertyBookingPrice } from '@/services/enhancedPriceService';
import { formatCurrency, getCurrencyConfig } from '@/services/currencyService';
import { CreditCard, Shield, CheckCircle } from 'lucide-react';

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { user } = useAuth();
  const { currentCurrency } = useCurrency();
  const { processPayment, isLoading: isPaymentLoading } = useBookingPayment();

  const [priceBreakdown, setPriceBreakdown] = useState(null);
  const [isCalculating, setIsCalculating] = useState(true);
  const [isCreatingBooking, setIsCreatingBooking] = useState(false);

  // Get parameters from URL
  const propertyId = searchParams.get('propertyId');
  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');
  const guests = searchParams.get('guests');
  const displayCurrency = searchParams.get('displayCurrency') || 'INR';

  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to access payment.",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    if (!propertyId || !checkIn || !checkOut) {
      toast({
        title: "Missing booking details",
        description: "Please go back and select your booking details.",
        variant: "destructive"
      });
      navigate('/stay');
      return;
    }

    calculatePricing();
  }, [propertyId, checkIn, checkOut, user]);

  const calculatePricing = async () => {
    try {
      setIsCalculating(true);
      const pricing = await calculateEnhancedPropertyBookingPrice(
        propertyId,
        new Date(checkIn),
        new Date(checkOut),
        undefined,
        getCurrencyConfig(displayCurrency)
      );
      setPriceBreakdown(pricing);
    } catch (error) {
      console.error('Error calculating pricing:', error);
      toast({
        title: "Error",
        description: "Failed to calculate pricing.",
        variant: "destructive"
      });
      navigate('/stay');
    } finally {
      setIsCalculating(false);
    }
  };

  const handlePayment = async () => {
    if (!priceBreakdown || !user) return;

    setIsCreatingBooking(true);
    
    try {
      // Create booking first
      const bookingData = {
        type: 'property' as const,
        userId: user.id,
        priceBreakdown,
        guests: [],
        property: {
          propertyId,
          checkInDate: new Date(checkIn),
          checkOutDate: new Date(checkOut),
          numberOfGuests: parseInt(guests || '2'),
          specialRequests: '',
          customerNotes: ''
        }
      };

      const { bookingId, bookingReference } = await createBooking(bookingData);

      // Process payment with Razorpay (always in INR)
      const amountInINR = priceBreakdown.displayCurrency !== 'INR' 
        ? priceBreakdown.totalAmountDue / priceBreakdown.exchangeRate
        : priceBreakdown.totalAmountDue;

      const paymentSuccess = await processPayment(
        bookingId,
        'property',
        Math.round(amountInINR), // Round to avoid decimal issues
        'INR',
        bookingReference
      );

      if (paymentSuccess) {
        toast({
          title: "Payment successful!",
          description: "Your booking has been confirmed.",
        });
        navigate(`/booking/confirmation?bookingId=${bookingId}`);
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      toast({
        title: "Payment failed",
        description: "Please try again or contact support.",
        variant: "destructive"
      });
    } finally {
      setIsCreatingBooking(false);
    }
  };

  if (isCalculating) {
    return (
      <>
        <Navbar />
        <main className="py-16 bg-gray-50">
          <div className="container mx-auto max-w-4xl px-4">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!priceBreakdown) {
    return (
      <>
        <Navbar />
        <main className="py-16 bg-gray-50">
          <div className="container mx-auto max-w-4xl px-4 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Payment Error</h1>
            <p className="text-gray-600 mb-8">Unable to load payment details.</p>
            <Button onClick={() => navigate('/stay')}>
              Back to Properties
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="py-8 bg-gray-50 min-h-screen">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-bold mb-2">Complete Your Payment</h1>
            <p className="text-gray-600">Secure payment processing powered by Razorpay</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">RZP</span>
                      </div>
                      <div>
                        <p className="font-medium">Razorpay</p>
                        <p className="text-sm text-gray-600">Credit/Debit Cards, UPI, Net Banking</p>
                      </div>
                    </div>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Shield className="h-4 w-4" />
                    <span>256-bit SSL encryption</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Shield className="h-4 w-4" />
                    <span>PCI DSS compliant</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Shield className="h-4 w-4" />
                    <span>Your payment information is secure</span>
                  </div>
                </div>

                {priceBreakdown.displayCurrency !== 'INR' && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> Payment will be processed in INR (₹{Math.round(priceBreakdown.totalAmountDue / priceBreakdown.exchangeRate)}) 
                      as per Indian regulations.
                    </p>
                  </div>
                )}

                <Button 
                  onClick={handlePayment}
                  disabled={isCreatingBooking || isPaymentLoading}
                  className="w-full bg-green-700 hover:bg-green-800 text-lg py-6"
                  size="lg"
                >
                  {isCreatingBooking || isPaymentLoading ? (
                    'Processing...'
                  ) : (
                    `Pay ${formatCurrency(priceBreakdown.totalAmountDue, getCurrencyConfig(displayCurrency))}`
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Booking Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span>Check-in</span>
                    <span>{new Date(checkIn).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Check-out</span>
                    <span>{new Date(checkOut).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Guests</span>
                    <span>{guests}</span>
                  </div>
                </div>

                <EnhancedPriceSummary 
                  priceBreakdown={priceBreakdown}
                  nights={Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))}
                  showCompetitorComparison={false}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default PaymentPage;
