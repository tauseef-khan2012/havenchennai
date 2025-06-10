
import React, { useEffect } from 'react';
import { usePropertyBooking } from '@/hooks/usePropertyBooking';
import { useBookingPricing } from '@/hooks/useBookingPricing';
import { useBookingDates } from '@/hooks/useBookingDates';
import { useBookingNavigation } from '@/hooks/useBookingNavigation';
import { useSearchParams } from 'react-router-dom';
import { BookingPageLayout } from '@/components/booking/BookingPageLayout';
import { BookingPageLoadingState } from '@/components/booking/BookingPageLoadingState';
import { BookingPageNotFound } from '@/components/booking/BookingPageNotFound';
import { BookingPageContent } from '@/components/booking/BookingPageContent';

const BookingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { property, propertyId, isLoading, error, user, retryFetch } = usePropertyBooking();
  const { selectedCheckIn, selectedCheckOut, handleDateRangeSelect } = useBookingDates();
  const {
    priceBreakdown,
    appliedDiscount,
    isCalculatingPrice,
    calculatePricing,
    handleDiscountApplied
  } = useBookingPricing();
  const { handleProceedToPayment, handlePlatformBooking } = useBookingNavigation();

  // Parse URL parameters and set initial dates/guests
  useEffect(() => {
    const checkInParam = searchParams.get('checkIn');
    const checkOutParam = searchParams.get('checkOut');
    const guestsParam = searchParams.get('guests');

    console.log('BookingPage - URL params:', { checkInParam, checkOutParam, guestsParam });

    if (checkInParam && checkOutParam) {
      const checkInDate = new Date(checkInParam);
      const checkOutDate = new Date(checkOutParam);
      
      console.log('BookingPage - Parsed dates:', { checkInDate, checkOutDate });
      
      // Validate dates
      if (!isNaN(checkInDate.getTime()) && !isNaN(checkOutDate.getTime()) && checkOutDate > checkInDate) {
        console.log('BookingPage - Setting initial dates from URL');
        handleDateRangeSelect(checkInDate, checkOutDate);
      }
    }
  }, [searchParams, handleDateRangeSelect]);

  // Auto-calculate pricing when dates change and propertyId is available
  useEffect(() => {
    if (selectedCheckIn && selectedCheckOut && propertyId) {
      const guestsParam = searchParams.get('guests');
      const guestCount = guestsParam ? parseInt(guestsParam) : 2;
      
      console.log('BookingPage - Auto-calculating pricing for date change:', {
        selectedCheckIn,
        selectedCheckOut,
        propertyId,
        guestCount
      });
      
      calculatePricing(propertyId, selectedCheckIn, selectedCheckOut, guestCount);
    }
  }, [selectedCheckIn, selectedCheckOut, propertyId, calculatePricing, searchParams]);

  const handleDateSelection = async (checkIn: Date, checkOut: Date) => {
    console.log('BookingPage - Date selection:', { checkIn, checkOut, propertyId });
    handleDateRangeSelect(checkIn, checkOut);
    
    // Pricing will be calculated automatically by the useEffect above
  };

  const handlePaymentProceed = () => {
    const guestsParam = searchParams.get('guests');
    const guestCount = guestsParam ? parseInt(guestsParam) : 2;
    
    console.log('BookingPage - Proceeding to payment with:', {
      user: user?.id,
      propertyId,
      selectedCheckIn,
      selectedCheckOut,
      guestCount,
      priceBreakdown: !!priceBreakdown
    });
    
    handleProceedToPayment(
      user,
      propertyId,
      selectedCheckIn,
      selectedCheckOut,
      guestCount,
      priceBreakdown,
      appliedDiscount
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-navy-gradient flex items-center justify-center">
        <div className="absolute inset-0 bg-organic-texture opacity-20"></div>
        <div className="absolute inset-0 leaf-pattern opacity-15"></div>
        <div className="relative z-10">
          <BookingPageLoadingState />
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-navy-gradient flex items-center justify-center">
        <div className="absolute inset-0 bg-organic-texture opacity-20"></div>
        <div className="absolute inset-0 leaf-pattern opacity-15"></div>
        <div className="relative z-10">
          <BookingPageNotFound error={error} onRetry={retryFetch} />
        </div>
      </div>
    );
  }

  return (
    <BookingPageLayout>
      <BookingPageContent
        property={property}
        propertyId={propertyId}
        selectedCheckIn={selectedCheckIn}
        selectedCheckOut={selectedCheckOut}
        priceBreakdown={priceBreakdown}
        platformComparisons={[]} // Empty for simplified version
        appliedDiscount={appliedDiscount}
        isCalculatingPrice={isCalculatingPrice}
        onDateRangeSelect={handleDateSelection}
        onPlatformBooking={handlePlatformBooking}
        onDiscountApplied={handleDiscountApplied}
        onProceedToPayment={handlePaymentProceed}
      />
    </BookingPageLayout>
  );
};

export default BookingPage;
