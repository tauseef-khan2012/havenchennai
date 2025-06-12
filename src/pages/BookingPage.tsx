
import React, { useEffect, useCallback, useState } from 'react';
import { usePropertyBooking } from '@/hooks/usePropertyBooking';
import { useSimpleBookingPricing } from '@/hooks/useSimpleBookingPricing';
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
    isCalculatingPrice,
    calculatePricing,
    resetPricing
  } = useSimpleBookingPricing();
  const { handleProceedToPayment, handlePlatformBooking } = useBookingNavigation();

  // Update URL when guest count changes - using React Router navigation
  const updateGuestCount = useCallback((newGuestCount: number) => {
    console.log('BookingPage - Guest count changing from', guestCount, 'to', newGuestCount);
    setGuestCount(newGuestCount);
    
    // Update URL params using React Router navigation
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('guests', newGuestCount.toString());
    navigate(currentUrl.pathname + currentUrl.search, { replace: true });
  }, [guestCount, navigate]);

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

  // Auto-calculate pricing when dates or guest count changes
  useEffect(() => {
    if (selectedCheckIn && selectedCheckOut && propertyId && guestCount > 0) {
      console.log('BookingPage - Auto-calculating pricing for state change:', {
        selectedCheckIn,
        selectedCheckOut,
        propertyId,
        guestCount
      });
      
      calculatePricing(propertyId, selectedCheckIn, selectedCheckOut, guestCount);
    }
  }, [selectedCheckIn, selectedCheckOut, propertyId, guestCount, calculatePricing]);

  const handleDateSelection = useCallback(async (checkIn: Date, checkOut: Date) => {
    console.log('BookingPage - Date selection received:', { checkIn, checkOut, propertyId });
    
    // Reset pricing when dates change
    resetPricing();
    
    // Update dates
    handleDateRangeSelect(checkIn, checkOut);
    
    // Update URL params using React Router navigation
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('checkIn', checkIn.toISOString().split('T')[0]);
    currentUrl.searchParams.set('checkOut', checkOut.toISOString().split('T')[0]);
    navigate(currentUrl.pathname + currentUrl.search, { replace: true });
  }, [handleDateRangeSelect, resetPricing, propertyId, navigate]);

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
      undefined // No discount for simplified version
    );
  }, [
    user,
    propertyId,
    selectedCheckIn,
    selectedCheckOut,
    guestCount,
    priceBreakdown,
    handleProceedToPayment
  ]);

  const nights = selectedCheckIn && selectedCheckOut ? 
    Math.ceil((selectedCheckOut.getTime() - selectedCheckIn.getTime()) / (1000 * 60 * 60 * 24)) : 0;

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
        appliedDiscount={undefined}
        isCalculatingPrice={isCalculatingPrice}
        onDateRangeSelect={handleDateSelection}
        onPlatformBooking={handlePlatformBooking}
        onDiscountApplied={() => {}} // No discount functionality
        onProceedToPayment={handlePaymentProceed}
        guestCount={guestCount}
        setGuestCount={handleGuestCountChange}
        nights={nights}
      />
    </BookingPageLayout>
  );
};

export default BookingPage;
