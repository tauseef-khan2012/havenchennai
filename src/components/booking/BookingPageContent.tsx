
import React from 'react';
import { BookingContent } from './BookingContent';
import { SimplePriceBreakdown } from '@/services/simplePricingService';
import { UUID } from '@/types/booking';

interface BookingPageContentProps {
  property: any;
  propertyId: UUID;
  selectedCheckIn?: Date;
  selectedCheckOut?: Date;
  priceBreakdown: SimplePriceBreakdown | null;
  platformComparisons: any[];
  appliedDiscount?: any;
  isCalculatingPrice: boolean;
  onDateRangeSelect: (checkIn: Date, checkOut: Date) => void;
  onPlatformBooking: (platform: string, url?: string) => void;
  onDiscountApplied: (discount: any) => void;
  onProceedToPayment: () => void;
  guestCount: number;
  setGuestCount: (count: number) => void;
  nights: number;
}

export const BookingPageContent: React.FC<BookingPageContentProps> = ({
  property,
  propertyId,
  selectedCheckIn,
  selectedCheckOut,
  priceBreakdown,
  platformComparisons,
  isCalculatingPrice,
  onDateRangeSelect,
  onPlatformBooking,
  onProceedToPayment,
  guestCount,
  setGuestCount,
  nights
}) => {
  return (
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
      nights={nights}
    />
  );
};
