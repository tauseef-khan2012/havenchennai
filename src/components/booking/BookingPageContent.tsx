
import React from 'react';
import { PropertyHeader } from '@/components/booking/PropertyHeader';
import { BookingContent } from '@/components/booking/BookingContent';
import { PropertyImageSlider } from '@/components/booking/PropertyImageSlider';
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
          onDateRangeSelect={onDateRangeSelect}
          onPlatformBooking={onPlatformBooking}
        />
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
        onDiscountApplied={onDiscountApplied}
        onProceedToPayment={onProceedToPayment}
      />
    </div>
  );
};
