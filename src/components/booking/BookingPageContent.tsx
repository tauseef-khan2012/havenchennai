
import React from 'react';
import { PropertyHeader } from '@/components/booking/PropertyHeader';
import { BookingContent } from '@/components/booking/BookingContent';
import { PropertyImageSlider } from '@/components/booking/PropertyImageSlider';
import { BookingPageGrid } from '@/components/booking/BookingPageGrid';
import { BookingContentColumn } from '@/components/booking/BookingContentColumn';
import { BookingSummaryColumn } from '@/components/booking/BookingSummaryColumn';
import { DesktopBookingSummary } from '@/components/booking/DesktopBookingSummary';
import { FloatingBookingSummary } from '@/components/booking/FloatingBookingSummary';
import { calculateNights } from '@/utils/bookingUtils';
import { UUID } from '@/types/booking';
import { EnhancedPriceBreakdown } from '@/services/enhancedPriceService';
import { DiscountApplication } from '@/services/discountService';

interface BookingPageContentProps {
  property: any;
  propertyId: UUID;
  selectedCheckIn?: Date;
  selectedCheckOut?: Date;
  priceBreakdown: EnhancedPriceBreakdown | null;
  platformComparisons: any[];
  appliedDiscount?: DiscountApplication;
  isCalculatingPrice: boolean;
  onDateRangeSelect: (checkIn: Date, checkOut: Date) => void;
  onPlatformBooking: (platform: string, url?: string) => void;
  onDiscountApplied: (discount: DiscountApplication) => void;
  onProceedToPayment: () => void;
}

export const BookingPageContent: React.FC<BookingPageContentProps> = ({
  property,
  propertyId,
  selectedCheckIn,
  selectedCheckOut,
  priceBreakdown,
  platformComparisons,
  appliedDiscount,
  isCalculatingPrice,
  onDateRangeSelect,
  onPlatformBooking,
  onDiscountApplied,
  onProceedToPayment
}) => {
  const [guestCount, setGuestCount] = React.useState(2);
  const nights = selectedCheckIn && selectedCheckOut ? calculateNights(selectedCheckIn, selectedCheckOut) : 0;

  return (
    <>
      <BookingPageGrid>
        {/* Left Column - Property Content */}
        <BookingContentColumn>
          {/* Property Header */}
          <PropertyHeader property={property} />

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
            onDateRangeSelect={onDateRangeSelect}
            onPlatformBooking={onPlatformBooking}
          />
        </BookingContentColumn>

        {/* Right Column - Desktop Booking Summary */}
        <BookingSummaryColumn>
          <DesktopBookingSummary
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
            onDiscountApplied={onDiscountApplied}
            onProceedToPayment={onProceedToPayment}
          />
        </BookingSummaryColumn>
      </BookingPageGrid>

      {/* Mobile Floating Summary - Only shows on mobile */}
      <div className="lg:hidden">
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
          onDiscountApplied={onDiscountApplied}
          onProceedToPayment={onProceedToPayment}
        />
      </div>
    </>
  );
};
