
import React, { useEffect, useCallback, useState } from 'react';
import { usePropertyBooking } from '@/hooks/usePropertyBooking';
import { useBookingPricing } from '@/hooks/useBookingPricing';
import { useBookingDates } from '@/hooks/useBookingDates';
import { useBookingNavigation } from '@/hooks/useBookingNavigation';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { BookingPageLayout } from '@/components/booking/BookingPageLayout';
import { BookingPageLoadingState } from '@/components/booking/BookingPageLoadingState';
import { BookingPageNotFound } from '@/components/booking/BookingPageNotFound';
import { BookingPageContent } from '@/components/booking/BookingPageContent';

const BookingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { property, propertyId, isLoading, error, user, retryFetch } = usePropertyBooking();
  const { selectedCheckIn, selectedCheckOut, handleDateRangeSelect } = useBookingDates();
  
  // Guest count state management - both in state and URL
  const [guestCount, setGuestCount] = useState(() => {
    const guestsParam = searchParams.get('guests');
    return guestsParam ? parseInt(guestsParam) : 2;
  });
  
  const {
    priceBreakdown,
    appliedDiscount,
    isCalculatingPrice,
    calculatePricing,
    handleDiscountApplied,
    resetPricing
  } = useBookingPricing();
  const { handleProceedToPayment, handlePlatformBooking } = useBookingNavigation();

  // Update URL when guest count changes
  const updateGuestCount = useCallback((newGuestCount: number) => {
    console.log('BookingPage - Guest count changing from', guestCount, 'to', newGuestCount);
    setGuestCount(newGuestCount);
    
    // Update URL params
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('guests', newGuestCount.toString());
    navigate(`?${newSearchParams.toString()}`, { replace: true });
  }, [guestCount, searchParams, navigate]);

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
      
      if (!isNaN(checkInDate.getTime()) && !isNaN(checkOutDate.getTime()) && checkOutDate > checkInDate) {
        console.log('BookingPage - Setting initial dates from URL');
        handleDateRangeSelect(checkInDate, checkOutDate);
      }
    }

    // Update guest count from URL if different from current state
    if (guestsParam) {
      const urlGuestCount = parseInt(guestsParam);
      if (!isNaN(urlGuestCount) && urlGuestCount !== guestCount) {
        console.log('BookingPage - Updating guest count from URL:', urlGuestCount);
        setGuestCount(urlGuestCount);
      }
    }
  }, [searchParams, handleDateRangeSelect, guestCount]);

  // Debounced price calculation to prevent race conditions
  const debouncedPriceCalculation = useCallback(
    (checkIn: Date, checkOut: Date, guests: number) => {
      if (!propertyId) return;
      
      console.log('BookingPage - Debounced price calculation:', {
        checkIn,
        checkOut,
        propertyId,
        guests
      });
      
      // Add small delay to prevent rapid-fire calculations
      const timeoutId = setTimeout(() => {
        calculatePricing(propertyId, checkIn, checkOut, guests);
      }, 300);
      
      return () => clearTimeout(timeoutId);
    },
    [propertyId, calculatePricing]
  );

  // Auto-calculate pricing when dates or guest count changes
  useEffect(() => {
    if (selectedCheckIn && selectedCheckOut && propertyId && guestCount > 0) {
      console.log('BookingPage - Auto-calculating pricing for state change:', {
        selectedCheckIn,
        selectedCheckOut,
        propertyId,
        guestCount
      });
      
      const cleanup = debouncedPriceCalculation(selectedCheckIn, selectedCheckOut, guestCount);
      return cleanup;
    }
  }, [selectedCheckIn, selectedCheckOut, propertyId, guestCount, debouncedPriceCalculation]);

  const handleDateSelection = useCallback(async (checkIn: Date, checkOut: Date) => {
    console.log('BookingPage - Date selection received:', { checkIn, checkOut, propertyId });
    
    // Reset pricing when dates change
    resetPricing();
    
    // Update dates
    handleDateRangeSelect(checkIn, checkOut);
    
    // Update URL params
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('checkIn', checkIn.toISOString().split('T')[0]);
    newSearchParams.set('checkOut', checkOut.toISOString().split('T')[0]);
    navigate(`?${newSearchParams.toString()}`, { replace: true });
  }, [handleDateRangeSelect, resetPricing, propertyId, searchParams, navigate]);

  const handleGuestCountChange = useCallback((newGuestCount: number) => {
    console.log('BookingPage - Guest count change received:', { oldCount: guestCount, newCount: newGuestCount });
    updateGuestCount(newGuestCount);
  }, [guestCount, updateGuestCount]);

  const handlePaymentProceed = useCallback(() => {
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
  }, [
    user,
    propertyId,
    selectedCheckIn,
    selectedCheckOut,
    guestCount,
    priceBreakdown,
    appliedDiscount,
    handleProceedToPayment
  ]);

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
        platformComparisons={[]}
        appliedDiscount={appliedDiscount}
        isCalculatingPrice={isCalculatingPrice}
        onDateRangeSelect={handleDateSelection}
        onPlatformBooking={handlePlatformBooking}
        onDiscountApplied={handleDiscountApplied}
        onProceedToPayment={handlePaymentProceed}
        guestCount={guestCount}
        setGuestCount={handleGuestCountChange}
      />
    </BookingPageLayout>
  );
};

export default BookingPage;
