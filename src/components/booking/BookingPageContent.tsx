
import React from 'react';
import { PropertyHeader } from '@/components/booking/PropertyHeader';
import { BookingContent } from '@/components/booking/BookingContent';
import { PropertyImageSlider } from '@/components/booking/PropertyImageSlider';
import { BookingPageGrid } from '@/components/booking/BookingPageGrid';
import { BookingContentColumn } from '@/components/booking/BookingContentColumn';
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

  return (
    <BookingPageGrid>
      {/* Single Column Layout - Full Width Content */}
      <BookingContentColumn>
        {/* Property Header */}
        <PropertyHeader property={property} />

        {/* Property Images */}
        <PropertyImageSlider property={property} />

        {/* Booking Content with integrated calendar and summary */}
        <BookingContent
          propertyId={propertyId}
          property={property}
          selectedCheckIn={selectedCheckIn}
          selectedCheckOut={selectedCheckOut}
          priceBreakdown={priceBreakdown}
          platformComparisons={platformComparisons}
          onDateRangeSelect={onDateRangeSelect}
          onPlatformBooking={onPlatformBooking}
          guestCount={guestCount}
          setGuestCount={setGuestCount}
          isCalculatingPrice={isCalculatingPrice}
          onProceedToPayment={onProceedToPayment}
        />
      </BookingContentColumn>
    </BookingPageGrid>
  );
};
