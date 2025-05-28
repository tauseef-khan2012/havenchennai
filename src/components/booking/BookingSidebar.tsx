
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Users, Calendar, MapPin, Wifi } from 'lucide-react';
import { EnhancedPriceSummary } from './EnhancedPriceSummary';
import DiscountCodeInput from './DiscountCodeInput';
import { EnhancedPriceBreakdown } from '@/services/enhancedPriceService';
import { DiscountApplication } from '@/services/discountService';
import { UUID } from '@/types/booking';

interface BookingSidebarProps {
  property: any;
  propertyId: UUID;
  guestCount: number;
  setGuestCount: (count: number) => void;
  selectedCheckIn?: Date;
  selectedCheckOut?: Date;
  priceBreakdown: EnhancedPriceBreakdown | null;
  appliedDiscount?: DiscountApplication;
  nights: number;
  isCalculatingPrice: boolean;
  onDiscountApplied: (discount: DiscountApplication) => void;
  onProceedToPayment: () => void;
}

export const BookingSidebar: React.FC<BookingSidebarProps> = ({
  property,
  propertyId,
  guestCount,
  setGuestCount,
  selectedCheckIn,
  selectedCheckOut,
  priceBreakdown,
  appliedDiscount,
  nights,
  isCalculatingPrice,
  onDiscountApplied,
  onProceedToPayment
}) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Column - Date & Guest Selection */}
      <div className="space-y-6">
        {/* Date Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-haven-teal" />
              Select Dates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-500 uppercase tracking-wide">Check-in</div>
                <div className="font-medium">
                  {selectedCheckIn ? formatDate(selectedCheckIn) : 'Select date'}
                </div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-500 uppercase tracking-wide">Check-out</div>
                <div className="font-medium">
                  {selectedCheckOut ? formatDate(selectedCheckOut) : 'Select date'}
                </div>
              </div>
            </div>
            
            {nights > 0 && (
              <div className="text-center text-sm text-gray-600">
                {nights} {nights === 1 ? 'night' : 'nights'}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Guest Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-haven-teal" />
              Guests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <select
              value={guestCount}
              onChange={(e) => setGuestCount(parseInt(e.target.value))}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:border-haven-teal focus:ring-haven-teal"
            >
              {Array.from({ length: property.max_guests }, (_, i) => i + 1).map(num => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'Guest' : 'Guests'}
                </option>
              ))}
            </select>
          </CardContent>
        </Card>

        {/* Property Highlights */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-4 w-4 text-haven-teal" />
              <span className="text-sm font-medium">Lakeside</span>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <Wifi className="h-4 w-4 text-haven-teal" />
              <span className="text-sm font-medium">WiFi</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-haven-teal" />
              <span className="text-sm font-medium">Kitchen</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column - Reserve Haven Summary */}
      <div className="space-y-6">
        {selectedCheckIn && selectedCheckOut && priceBreakdown ? (
          <>
            {/* Discount Code */}
            <DiscountCodeInput
              bookingType="property"
              itemId={propertyId}
              totalAmount={priceBreakdown.subtotalAfterDiscount}
              onDiscountApplied={onDiscountApplied}
              appliedDiscount={appliedDiscount}
            />

            {/* Reserve Haven Card */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Reserve Haven</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Check-in</span>
                    <span>{selectedCheckIn.toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Check-out</span>
                    <span>{selectedCheckOut.toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Nights</span>
                    <span>{nights}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Guests</span>
                    <span>{guestCount}</span>
                  </div>
                  
                  <Separator />
                  
                  <EnhancedPriceSummary 
                    priceBreakdown={priceBreakdown} 
                    nights={nights}
                    showCompetitorComparison={false}
                  />
                  
                  <Button 
                    onClick={onProceedToPayment}
                    className="w-full bg-haven-teal hover:bg-haven-teal/90 text-white py-3 text-lg font-medium"
                    disabled={isCalculatingPrice}
                    size="lg"
                  >
                    {isCalculatingPrice ? 'Calculating...' : 'Continue to Checkout'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card className="shadow-lg">
            <CardContent className="p-8 text-center">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="font-medium text-gray-900 mb-2">Select your dates</h3>
              <p className="text-gray-500 text-sm">
                Choose your check-in and check-out dates to see pricing and availability
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
