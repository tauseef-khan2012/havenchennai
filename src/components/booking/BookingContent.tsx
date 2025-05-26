
import React from 'react';
import AvailabilityCalendar from './AvailabilityCalendar';
import PlatformComparison from './PlatformComparison';
import { CompactBookingSummary } from './CompactBookingSummary';
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
  guestCount: number;
  setGuestCount: (count: number) => void;
  isCalculatingPrice: boolean;
  onProceedToPayment: () => void;
}

export const BookingContent: React.FC<BookingContentProps> = ({
  propertyId,
  property,
  selectedCheckIn,
  selectedCheckOut,
  priceBreakdown,
  platformComparisons,
  onDateRangeSelect,
  onPlatformBooking,
  guestCount,
  setGuestCount,
  isCalculatingPrice,
  onProceedToPayment
}) => {
  const nights = selectedCheckIn && selectedCheckOut ? 
    Math.ceil((selectedCheckOut.getTime() - selectedCheckIn.getTime()) / (1000 * 60 * 60 * 24)) : 0;

  return (
    <div className="space-y-8">
      {/* Calendar and Booking Summary Side by Side */}
      <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
        <h2 className="text-2xl lg:text-3xl font-serif font-bold mb-6 text-gray-900">Select Your Dates</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calendar Section */}
          <div>
            <AvailabilityCalendar
              propertyId={propertyId}
              onDateRangeSelect={onDateRangeSelect}
              selectedCheckIn={selectedCheckIn}
              selectedCheckOut={selectedCheckOut}
            />
          </div>
          
          {/* Compact Booking Summary */}
          <div>
            <CompactBookingSummary
              property={property}
              propertyId={propertyId}
              guestCount={guestCount}
              setGuestCount={setGuestCount}
              selectedCheckIn={selectedCheckIn}
              selectedCheckOut={selectedCheckOut}
              priceBreakdown={priceBreakdown}
              nights={nights}
              isCalculatingPrice={isCalculatingPrice}
              onProceedToPayment={onProceedToPayment}
            />
          </div>
        </div>
      </div>

      {/* Platform Comparison */}
      {selectedCheckIn && selectedCheckOut && priceBreakdown && (
        <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
          <h2 className="text-2xl lg:text-3xl font-serif font-bold mb-6 text-gray-900">Compare Prices</h2>
          <PlatformComparison
            directPrice={priceBreakdown.totalAmountDue}
            platformComparisons={platformComparisons}
            currency={property.currency}
            onPlatformSelect={onPlatformBooking}
          />
        </div>
      )}

      {/* Property Description */}
      <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
        <h2 className="text-2xl lg:text-3xl font-serif font-bold mb-6 text-gray-900">About This Place</h2>
        <p className="text-gray-600 leading-relaxed text-lg mb-6">
          {property.long_description || property.short_description || 
           "Experience the tranquility of lakeside living in our beautifully designed container home. Nestled on the shores of Muttukadu Lake in Chennai, this unique accommodation offers modern amenities with stunning natural views. Perfect for couples or small families seeking a peaceful retreat from city life."}
        </p>
        
        {property.amenities && property.amenities.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">What This Place Offers</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {property.amenities.map((amenity: string, index: number) => (
                <div key={index} className="flex items-center gap-3 text-gray-700 bg-gray-50 rounded-lg p-3">
                  <div className="w-2 h-2 bg-haven-teal rounded-full flex-shrink-0"></div>
                  <span className="text-sm font-medium">{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
