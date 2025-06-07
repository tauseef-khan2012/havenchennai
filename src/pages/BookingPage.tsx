
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
  const { property, propertyId, isLoading, user } = usePropertyBooking();
  const { selectedCheckIn, selectedCheckOut, handleDateRangeSelect } = useBookingDates();
  const {
    priceBreakdown,
    platformComparisons,
    appliedDiscount,
    isCalculatingPrice,
    calculatePricing,
    fetchPlatformComparisons,
    handleDiscountApplied
  } = useBookingPricing();
  const { handleProceedToPayment, handlePlatformBooking } = useBookingNavigation();

  // Parse URL parameters and set initial dates/guests
  useEffect(() => {
    const checkInParam = searchParams.get('checkIn');
    const checkOutParam = searchParams.get('checkOut');
    const guestsParam = searchParams.get('guests');

    if (checkInParam && checkOutParam) {
      const checkInDate = new Date(checkInParam);
      const checkOutDate = new Date(checkOutParam);
      
      // Validate dates
      if (!isNaN(checkInDate.getTime()) && !isNaN(checkOutDate.getTime()) && checkOutDate > checkInDate) {
        handleDateRangeSelect(checkInDate, checkOutDate);
      }
    }
  }, [searchParams, handleDateRangeSelect]);

  const handleDateSelection = async (checkIn: Date, checkOut: Date) => {
    handleDateRangeSelect(checkIn, checkOut);
    
    if (propertyId) {
      await calculatePricing(propertyId, checkIn, checkOut);
      await fetchPlatformComparisons(propertyId, checkIn, checkOut);
    }
  };

  const handlePaymentProceed = () => {
    const guestsParam = searchParams.get('guests');
    const guestCount = guestsParam ? parseInt(guestsParam) : 2;
    
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

  // Re-calculate pricing when discount is applied
  useEffect(() => {
    if (selectedCheckIn && selectedCheckOut && propertyId) {
      calculatePricing(propertyId, selectedCheckIn, selectedCheckOut);
    }
  }, [appliedDiscount]);

  if (isLoading) {
    return <BookingPageLoadingState />;
  }

  if (!property) {
    return <BookingPageNotFound />;
  }

  return (
    <BookingPageLayout>
      <BookingPageContent
        property={property}
        propertyId={propertyId}
        selectedCheckIn={selectedCheckIn}
        selectedCheckOut={selectedCheckOut}
        priceBreakdown={priceBreakdown}
        platformComparisons={platformComparisons}
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
