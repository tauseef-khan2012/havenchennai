
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Spinner className="mx-auto mb-4" />
          <p>Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (!priceBreakdown) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Unable to Load Booking</h2>
          <p className="text-gray-600 mb-4">There was an error loading your booking details.</p>
          <Button onClick={() => navigate('/booking')}>
            Return to Booking
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-bold text-gray-900">Complete Your Booking</h1>
            <p className="text-gray-600 mt-2">Review your details and proceed to payment</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <EnhancedContactSection
                contactInfo={contactInfo}
                onContactInfoChange={setContactInfo}
                errors={errors}
                onFieldChange={handleFieldChange}
              />
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Booking Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium">Dates</h4>
                      <p className="text-sm text-gray-600">
                        {checkInDate && checkOutDate && (
                          `${new Date(checkInDate).toLocaleDateString()} - ${new Date(checkOutDate).toLocaleDateString()}`
                        )}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium">Guests</h4>
                      <p className="text-sm text-gray-600">{guestCount} guests</p>
                    </div>
                    <PriceSummary priceBreakdown={priceBreakdown} />
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => navigate('/booking')}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handleProceedToPayment}
                  disabled={isProcessing || isPaymentLoading}
                  className="flex-1 bg-green-700 hover:bg-green-800"
                >
                  {isProcessing || isPaymentLoading ? 'Processing...' : 'Proceed to Payment'}
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
