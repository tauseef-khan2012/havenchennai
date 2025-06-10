import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useBookingPayment } from '@/hooks/useBookingPayment';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EnhancedContactSection } from '@/components/booking/EnhancedContactSection';
import { PriceSummary } from '@/components/booking/PriceSummary';
import { Spinner } from '@/components/ui/spinner';
import { calculateBookingPrice } from '@/services/priceService';
import { createBooking } from '@/services/bookingService';
import { createGuestBooking } from '@/services/guestBookingService';
import { PriceBreakdown, UUID } from '@/types/booking';
import { Calendar, Users, CreditCard, Shield } from 'lucide-react';

const BookingPaymentPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { processPayment, isLoading: isPaymentLoading } = useBookingPayment();
  
  const [contactInfo, setContactInfo] = useState({
    fullName: '',
    email: '',
    phone: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [priceBreakdown, setPriceBreakdown] = useState<PriceBreakdown | null>(null);
  const [isLoadingPrice, setIsLoadingPrice] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Extract booking details from URL params
  const propertyId = searchParams.get('propertyId') as UUID;
  const checkInDate = searchParams.get('checkIn');
  const checkOutDate = searchParams.get('checkOut');
  const guestCount = parseInt(searchParams.get('guests') || '2');
  const discountCode = searchParams.get('discountCode');

  // Validate contact information
  const validateContactInfo = () => {
    const newErrors: Record<string, string> = {};
    
    if (!contactInfo.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (!contactInfo.email.trim()) {
      newErrors.email = 'Email is required';
    }
    if (!contactInfo.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFieldChange = (field: keyof typeof contactInfo, value: string) => {
    setContactInfo(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Load pricing on mount
  useEffect(() => {
    const loadPricing = async () => {
      if (!propertyId || !checkInDate || !checkOutDate) {
        toast({
          title: 'Missing booking details',
          description: 'Required booking information is missing.',
          variant: 'destructive'
        });
        navigate('/booking');
        return;
      }

      try {
        setIsLoadingPrice(true);
        const bookingDetails = {
          type: 'property' as const,
          propertyId,
          checkInDate: new Date(checkInDate),
          checkOutDate: new Date(checkOutDate),
          numberOfAttendees: guestCount,
        };
        
        const breakdown = await calculateBookingPrice(bookingDetails);
        setPriceBreakdown(breakdown);
      } catch (error) {
        console.error('Failed to load pricing:', error);
        toast({
          title: 'Error loading pricing',
          description: 'Unable to calculate booking price. Please try again.',
          variant: 'destructive'
        });
      } finally {
        setIsLoadingPrice(false);
      }
    };

    loadPricing();
  }, [propertyId, checkInDate, checkOutDate, guestCount]);

  const handleProceedToPayment = async () => {
    if (!validateContactInfo()) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required contact details.',
        variant: 'destructive'
      });
      return;
    }

    if (!priceBreakdown || !propertyId || !checkInDate || !checkOutDate) {
      toast({
        title: 'Missing booking details',
        description: 'Required booking information is missing.',
        variant: 'destructive'
      });
      return;
    }

    setIsProcessing(true);

    try {
      let bookingResult;

      if (user) {
        // Authenticated user booking
        const bookingData = {
          type: 'property' as const,
          userId: user.id,
          priceBreakdown,
          guests: [{
            name: contactInfo.fullName,
            age: undefined
          }],
          selectedAddonExperiences: [],
          property: {
            propertyId,
            checkInDate: new Date(checkInDate),
            checkOutDate: new Date(checkOutDate),
            numberOfGuests: guestCount,
            specialRequests: '',
            customerNotes: `Contact: ${contactInfo.fullName} (${contactInfo.email}, ${contactInfo.phone})`
          }
        };
        
        bookingResult = await createBooking(bookingData);
      } else {
        // Guest booking
        const guestBookingData = {
          type: 'property' as const,
          guestName: contactInfo.fullName,
          guestEmail: contactInfo.email,
          guestPhone: contactInfo.phone,
          priceBreakdown,
          propertyId,
          checkInDate: new Date(checkInDate),
          checkOutDate: new Date(checkOutDate),
          numberOfGuests: guestCount,
          specialRequests: ''
        };
        
        bookingResult = await createGuestBooking(guestBookingData);
      }

      // Proceed to payment processing
      const success = await processPayment(
        bookingResult.bookingId,
        'property',
        priceBreakdown.totalAmountDue,
        priceBreakdown.currency,
        bookingResult.bookingReference
      );

      if (success) {
        navigate(`/booking/confirmation?bookingReference=${bookingResult.bookingReference}`);
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: 'Booking failed',
        description: error instanceof Error ? error.message : 'Unable to create booking. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoadingPrice) {
    return (
      <div className="min-h-screen bg-navy-gradient flex items-center justify-center">
        <div className="text-center glass-panel-navy rounded-3xl p-12 animate-fade-in">
          <Spinner className="mx-auto mb-4 text-haven-yellow" />
          <p className="text-haven-beige font-serif text-lg">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (!priceBreakdown) {
    return (
      <div className="min-h-screen bg-navy-gradient flex items-center justify-center">
        <div className="text-center glass-panel-navy rounded-3xl p-12 animate-fade-in">
          <h2 className="text-xl font-serif font-semibold mb-4 text-haven-beige">Unable to Load Booking</h2>
          <p className="text-haven-beige/80 mb-4">There was an error loading your booking details.</p>
          <Button 
            onClick={() => navigate('/booking')}
            className="bg-yellow-gradient hover:shadow-yellow text-haven-navy font-semibold"
          >
            Return to Booking
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-gradient py-8">
      <div className="absolute inset-0 bg-organic-texture opacity-20"></div>
      <div className="absolute inset-0 leaf-pattern opacity-15"></div>
      
      {/* Floating decorative elements */}
      <div className="absolute top-16 left-8 w-20 h-20 rounded-organic bg-haven-yellow/10 animate-float-gentle"></div>
      <div className="absolute bottom-20 right-12 w-16 h-16 rounded-organic-2 bg-haven-navy-light/20 animate-float-gentle" style={{ animationDelay: '1s' }}></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center animate-fade-in">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-1 bg-yellow-gradient rounded-full"></div>
              <span className="font-handwritten text-2xl text-haven-yellow">Secure Booking</span>
              <div className="w-12 h-1 bg-yellow-gradient rounded-full"></div>
            </div>
            <h1 className="text-4xl font-serif font-bold text-haven-beige mb-2">Complete Your Booking</h1>
            <p className="text-haven-beige/80">Review your details and proceed to secure payment</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6 animate-fade-in-delay">
              <Card className="glass-panel-navy border-haven-yellow/20 shadow-navy">
                <CardHeader>
                  <CardTitle className="text-haven-beige font-serif flex items-center gap-2">
                    <Users className="h-5 w-5 text-haven-yellow" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <EnhancedContactSection
                    contactInfo={contactInfo}
                    onContactInfoChange={setContactInfo}
                    errors={errors}
                    onFieldChange={handleFieldChange}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6 animate-fade-in-delay-2">
              <Card className="glass-panel-navy border-haven-yellow/20 shadow-navy">
                <CardHeader>
                  <CardTitle className="text-haven-beige font-serif flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-haven-yellow" />
                    Booking Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="glass-panel rounded-2xl p-4 border-l-4 border-haven-yellow">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <h4 className="font-medium text-haven-beige">Check-in</h4>
                          <p className="text-haven-beige/80">
                            {checkInDate && new Date(checkInDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium text-haven-beige">Check-out</h4>
                          <p className="text-haven-beige/80">
                            {checkOutDate && new Date(checkOutDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium text-haven-beige">Guests</h4>
                          <p className="text-haven-beige/80">{guestCount} guests</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-haven-beige">Duration</h4>
                          <p className="text-haven-beige/80">
                            {checkInDate && checkOutDate && 
                              Math.ceil((new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60 * 24))
                            } nights
                          </p>
                        </div>
                      </div>
                    </div>
                    <PriceSummary priceBreakdown={priceBreakdown} />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-panel-navy border-haven-yellow/20 shadow-navy">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-haven-yellow mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-haven-beige mb-1">Secure Payment</p>
                      <p className="text-haven-beige/80">
                        Your payment is processed securely through Razorpay with bank-level encryption
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => navigate('/booking')}
                  className="flex-1 glass-panel border-haven-yellow/30 text-haven-beige hover:bg-haven-navy-light/50"
                >
                  Back
                </Button>
                <Button
                  onClick={handleProceedToPayment}
                  disabled={isProcessing || isPaymentLoading}
                  className="flex-1 bg-yellow-gradient hover:shadow-yellow text-haven-navy font-semibold py-3 text-lg transition-all duration-300 transform hover:scale-105 ripple-effect"
                >
                  {isProcessing || isPaymentLoading ? (
                    <>
                      <Spinner className="mr-2 h-4 w-4" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-5 w-5" />
                      Proceed to Payment
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPaymentPage;
