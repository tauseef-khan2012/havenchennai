
import React from 'react';
import AvailabilityCalendar from './AvailabilityCalendar';
import PlatformComparison from './PlatformComparison';
import { UUID } from '@/types/booking';
import { EnhancedPriceBreakdown } from '@/services/enhancedPriceService';

interface BookingContentProps {
  propertyId: UUID;
  property: any;
  selectedCheckIn?: Date;
  selectedCheckOut?: Date;
  priceBreakdown: EnhancedPriceBreakdown | null;
  platformComparisons: any[];
  onDateRangeSelect: (checkIn: Date, checkOut: Date) => void;
  onPlatformBooking: (platform: string, url?: string) => void;
}

export const BookingContent: React.FC<BookingContentProps> = ({
  propertyId,
  property,
  selectedCheckIn,
  selectedCheckOut,
  priceBreakdown,
  platformComparisons,
  onDateRangeSelect,
  onPlatformBooking
}) => {
  return (
    <div className="lg:col-span-2 space-y-6">
      <AvailabilityCalendar
        propertyId={propertyId}
        onDateRangeSelect={onDateRangeSelect}
        selectedCheckIn={selectedCheckIn}
        selectedCheckOut={selectedCheckOut}
      />

      {selectedCheckIn && selectedCheckOut && priceBreakdown && (
        <PlatformComparison
          directPrice={priceBreakdown.totalAmountDue}
          platformComparisons={platformComparisons}
          currency={property.currency}
          onPlatformSelect={onPlatformBooking}
        />
      )}
    </div>
  );
};
