
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Users, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { EnhancedPriceBreakdown } from '@/services/enhancedPriceService';
import { DiscountApplication } from '@/services/discountService';
import { UUID } from '@/types/booking';
import { useCurrency } from '@/contexts/CurrencyContext';
import EnhancedDiscountInput from './EnhancedDiscountInput';

interface FloatingBookingSummaryProps {
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

export const FloatingBookingSummary: React.FC<FloatingBookingSummaryProps> = ({
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
  const [isMinimized, setIsMinimized] = useState(false);
  const { formatPrice } = useCurrency();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    /* Mobile Bottom Sheet - Only visible on mobile */
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <Card className="rounded-t-2xl border-0 shadow-2xl bg-white">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-serif">
              {isMinimized ? 'Booking Summary' : property.name}
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              {isMinimized ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="space-y-4 max-h-[70vh] overflow-y-auto">
            {/* Date Selection Summary */}
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-500 uppercase font-medium">Check-in</div>
                <div className="font-semibold text-gray-900">
                  {selectedCheckIn ? formatDate(selectedCheckIn) : 'Select'}
                </div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-500 uppercase font-medium">Check-out</div>
                <div className="font-semibold text-gray-900">
                  {selectedCheckOut ? formatDate(selectedCheckOut) : 'Select'}
                </div>
              </div>
            </div>

            {nights > 0 && (
              <div className="text-center text-sm text-gray-600 font-medium">
                {nights} {nights === 1 ? 'night' : 'nights'}
              </div>
            )}

            {/* Guest Selection */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block flex items-center gap-2">
                <Users className="h-4 w-4" />
                Guests
              </label>
              <select
                value={guestCount}
                onChange={(e) => setGuestCount(parseInt(e.target.value))}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm focus:border-haven-teal focus:ring-2 focus:ring-haven-teal focus:ring-opacity-20 transition-all"
              >
                {Array.from({ length: property.max_guests }, (_, i) => i + 1).map(num => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Guest' : 'Guests'}
                  </option>
                ))}
              </select>
            </div>

            {/* Discount Code */}
            {selectedCheckIn && selectedCheckOut && priceBreakdown && (
              <EnhancedDiscountInput
                bookingType="property"
                itemId={propertyId}
                totalAmount={priceBreakdown.subtotalAfterDiscount}
                onDiscountApplied={onDiscountApplied}
                appliedDiscount={appliedDiscount}
              />
            )}

            {/* Price Summary */}
            {selectedCheckIn && selectedCheckOut && priceBreakdown && (
              <div className="space-y-3 bg-gray-50 rounded-lg p-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>₹4,000 × {nights} nights</span>
                    <span>₹{formatPrice(priceBreakdown.basePrice, 'INR')}</span>
                  </div>
                  
                  {priceBreakdown.discountAmount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount</span>
                      <span>-₹{formatPrice(priceBreakdown.discountAmount, 'INR')}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm">
                    <span>GST (18%)</span>
                    <span>₹{formatPrice(priceBreakdown.taxAmount, 'INR')}</span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{formatPrice(priceBreakdown.totalAmountDue, 'INR')}</span>
                </div>
              </div>
            )}

            <Button 
              onClick={onProceedToPayment}
              className="w-full bg-haven-teal hover:bg-haven-teal/90 text-white font-semibold py-4 text-lg rounded-lg transition-all transform hover:scale-[0.98] active:scale-95"
              disabled={isCalculatingPrice || !selectedCheckIn || !selectedCheckOut}
              size="lg"
            >
              {isCalculatingPrice ? 'Calculating...' : 'Reserve Haven'}
            </Button>

            {/* Initial State */}
            {(!selectedCheckIn || !selectedCheckOut) && (
              <div className="text-center py-6">
                <Calendar className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">
                  Select dates to see pricing
                </p>
              </div>
            )}
          </CardContent>
        )}

        {isMinimized && priceBreakdown && (
          <CardContent className="pt-0 pb-4">
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-lg font-bold">₹{formatPrice(priceBreakdown.totalAmountDue, 'INR')}</span>
                <span className="text-xs text-gray-500">{nights} nights</span>
              </div>
              <Button 
                onClick={onProceedToPayment}
                className="bg-haven-teal hover:bg-haven-teal/90 text-white px-6 py-2"
                disabled={isCalculatingPrice || !selectedCheckIn || !selectedCheckOut}
              >
                Reserve
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};
