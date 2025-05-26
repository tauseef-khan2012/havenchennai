
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { PropertyHeader } from '@/components/booking/PropertyHeader';
import { BookingContent } from '@/components/booking/BookingContent';
import { PropertyImageSlider } from '@/components/booking/PropertyImageSlider';
import { FloatingBookingSummary } from '@/components/booking/FloatingBookingSummary';
import { Button } from '@/components/ui/button';
import { UUID } from '@/types/booking';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { calculateEnhancedPropertyBookingPrice, EnhancedPriceBreakdown } from '@/services/enhancedPriceService';
import { getPlatformRatesForProperty, comparePlatformPricing } from '@/services/platformRatesService';
import { DiscountApplication } from '@/services/discountService';
import { calculateNights } from '@/utils/bookingUtils';

const BookingPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { user } = useAuth();

  const propertyId = searchParams.get('propertyId') as UUID;
  const [property, setProperty] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCheckIn, setSelectedCheckIn] = useState<Date | undefined>();
  const [selectedCheckOut, setSelectedCheckOut] = useState<Date | undefined>();
  const [guestCount, setGuestCount] = useState(2);
  const [priceBreakdown, setPriceBreakdown] = useState<EnhancedPriceBreakdown | null>(null);
  const [platformComparisons, setPlatformComparisons] = useState<any[]>([]);
  const [appliedDiscount, setAppliedDiscount] = useState<DiscountApplication | undefined>();
  const [isCalculatingPrice, setIsCalculatingPrice] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!propertyId) {
        toast({
          title: "Error",
          description: "No property selected for booking.",
          variant: "destructive"
        });
        navigate('/stay');
        return;
      }

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('id', propertyId)
          .eq('is_published', true)
          .single();

        if (error || !data) {
          throw new Error('Property not found');
        }

        setProperty(data);
      } catch (error) {
        console.error('Error fetching property:', error);
        toast({
          title: "Error",
          description: "Failed to load property details.",
          variant: "destructive"
        });
        navigate('/stay');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId, navigate, toast]);

  const handleDateRangeSelect = async (checkIn: Date, checkOut: Date) => {
    setSelectedCheckIn(checkIn);
    setSelectedCheckOut(checkOut);
    
    if (propertyId) {
      await calculatePricing(checkIn, checkOut);
      await fetchPlatformComparisons(checkIn, checkOut);
    }
  };

  const calculatePricing = async (checkIn: Date, checkOut: Date) => {
    setIsCalculatingPrice(true);
    try {
      const pricing = await calculateEnhancedPropertyBookingPrice(
        propertyId,
        checkIn,
        checkOut
      );
      
      // Apply discount if one exists
      let finalPricing = pricing;
      if (appliedDiscount?.isValid && appliedDiscount.discountAmount > 0) {
        const subtotalAfterDiscount = pricing.subtotalAfterDiscount - appliedDiscount.discountAmount;
        const gstAmount = subtotalAfterDiscount * 0.18;
        
        finalPricing = {
          ...pricing,
          discountAmount: pricing.discountAmount + appliedDiscount.discountAmount,
          subtotalAfterDiscount,
          taxAmount: gstAmount,
          totalAmountDue: subtotalAfterDiscount + gstAmount
        };
      }
      
      setPriceBreakdown(finalPricing);
    } catch (error) {
      console.error('Error calculating pricing:', error);
      toast({
        title: "Error",
        description: "Failed to calculate pricing.",
        variant: "destructive"
      });
    } finally {
      setIsCalculatingPrice(false);
    }
  };

  const fetchPlatformComparisons = async (checkIn: Date, checkOut: Date) => {
    try {
      const platformRates = await getPlatformRatesForProperty(propertyId, checkIn, checkOut);
      const nights = calculateNights(checkIn, checkOut);
      const directPrice = priceBreakdown?.totalAmountDue || 0;
      
      const comparisons = comparePlatformPricing(directPrice, platformRates, nights);
      setPlatformComparisons(comparisons);
    } catch (error) {
      console.error('Error fetching platform comparisons:', error);
    }
  };

  const handleDiscountApplied = (discount: DiscountApplication) => {
    setAppliedDiscount(discount);
    
    if (selectedCheckIn && selectedCheckOut) {
      calculatePricing(selectedCheckIn, selectedCheckOut);
    }
  };

  const handleProceedToPayment = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to complete your booking.",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    if (!selectedCheckIn || !selectedCheckOut || !priceBreakdown) {
      toast({
        title: "Missing information",
        description: "Please select dates and ensure pricing is calculated.",
        variant: "destructive"
      });
      return;
    }

    // Navigate to payment with booking details
    const bookingParams = new URLSearchParams({
      propertyId,
      checkIn: selectedCheckIn.toISOString(),
      checkOut: selectedCheckOut.toISOString(),
      guests: guestCount.toString(),
      ...(appliedDiscount?.isValid && { discountCode: appliedDiscount.discountCode?.code || '' })
    });

    navigate(`/booking/payment?${bookingParams.toString()}`);
  };

  const handlePlatformBooking = (platform: string, url?: string) => {
    if (url) {
      window.open(url, '_blank');
    } else {
      toast({
        title: "Not available",
        description: `Booking via ${platform} is not available for these dates.`,
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="container mx-auto max-w-7xl px-4 py-8">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              <div className="aspect-[16/10] bg-gray-200 rounded-xl"></div>
              <div className="h-96 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!property) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h1>
            <p className="text-gray-600 mb-8">The property you're looking for could not be found.</p>
            <Button onClick={() => navigate('/stay')}>
              Browse Properties
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const nights = selectedCheckIn && selectedCheckOut ? calculateNights(selectedCheckIn, selectedCheckOut) : 0;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Add bottom padding on mobile to account for floating summary */}
        <div className="container mx-auto max-w-7xl px-4 py-8 pb-32 lg:pb-8 lg:pr-[420px]">
          {/* Property Header */}
          <PropertyHeader property={property} />

          {/* Main Content Layout */}
          <div className="space-y-8">
            {/* Property Images */}
            <PropertyImageSlider property={property} />

            {/* Booking Content */}
            <BookingContent
              propertyId={propertyId}
              property={property}
              selectedCheckIn={selectedCheckIn}
              selectedCheckOut={selectedCheckOut}
              priceBreakdown={priceBreakdown}
              platformComparisons={platformComparisons}
              onDateRangeSelect={handleDateRangeSelect}
              onPlatformBooking={handlePlatformBooking}
            />
          </div>
        </div>

        {/* Floating Booking Summary */}
        <FloatingBookingSummary
          property={property}
          propertyId={propertyId}
          guestCount={guestCount}
          setGuestCount={setGuestCount}
          selectedCheckIn={selectedCheckIn}
          selectedCheckOut={selectedCheckOut}
          priceBreakdown={priceBreakdown}
          appliedDiscount={appliedDiscount}
          nights={nights}
          isCalculatingPrice={isCalculatingPrice}
          onDiscountApplied={handleDiscountApplied}
          onProceedToPayment={handleProceedToPayment}
        />
      </main>
      <Footer />
    </>
  );
};

export default BookingPage;
