
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
    <div className="space-y-8">
      {/* Availability Calendar */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-serif font-bold mb-6">Select Your Dates</h2>
        <AvailabilityCalendar
          propertyId={propertyId}
          onDateRangeSelect={onDateRangeSelect}
          selectedCheckIn={selectedCheckIn}
          selectedCheckOut={selectedCheckOut}
        />
      </div>

      {/* Platform Comparison */}
      {selectedCheckIn && selectedCheckOut && priceBreakdown && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-serif font-bold mb-6">Compare Prices</h2>
          <PlatformComparison
            directPrice={priceBreakdown.totalAmountDue}
            platformComparisons={platformComparisons}
            currency={property.currency}
            onPlatformSelect={onPlatformBooking}
          />
        </div>
      )}

      {/* Property Description */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-serif font-bold mb-4">About This Place</h2>
        <p className="text-gray-600 leading-relaxed">
          {property.long_description || property.short_description || 
           "Experience the tranquility of lakeside living in our beautifully designed container home. Nestled on the shores of Muttukadu Lake in Chennai, this unique accommodation offers modern amenities with stunning natural views. Perfect for couples or small families seeking a peaceful retreat from city life."}
        </p>
        
        {property.amenities && property.amenities.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold mb-3">What This Place Offers</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {property.amenities.map((amenity: string, index: number) => (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-haven-teal rounded-full"></div>
                  {amenity}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
