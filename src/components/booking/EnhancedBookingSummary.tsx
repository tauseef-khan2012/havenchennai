
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, MapPin, Clock, CreditCard } from 'lucide-react';
import { EnhancedPriceSummary } from './EnhancedPriceSummary';
import { EnhancedPriceBreakdown } from '@/services/enhancedPriceService';
import { useCurrency } from '@/contexts/CurrencyContext';
import { UUID } from '@/types/booking';

interface EnhancedBookingSummaryProps {
  property: any;
  propertyId: UUID;
  guestCount: number;
  selectedCheckIn?: Date;
  selectedCheckOut?: Date;
  priceBreakdown: EnhancedPriceBreakdown | null;
  nights: number;
  isCalculatingPrice: boolean;
  onProceedToPayment: () => void;
  showPropertyDetails?: boolean;
}

export const EnhancedBookingSummary: React.FC<EnhancedBookingSummaryProps> = ({
  property,
  propertyId,
  guestCount,
  selectedCheckIn,
  selectedCheckOut,
  priceBreakdown,
  nights,
  isCalculatingPrice,
  onProceedToPayment,
  showPropertyDetails = true
}) => {
  const { formatPrice } = useCurrency();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const canProceed = selectedCheckIn && selectedCheckOut && priceBreakdown && !isCalculatingPrice;
  const hasDatesSelected = selectedCheckIn && selectedCheckOut;

  console.log('EnhancedBookingSummary - State check:', {
    selectedCheckIn,
    selectedCheckOut,
    priceBreakdown: !!priceBreakdown,
    isCalculatingPrice,
    hasDatesSelected,
    canProceed
  });

  return (
    <Card className="glass-panel-navy border-haven-yellow/20 shadow-navy">
      <CardContent className="p-6 space-y-6">
        {/* Property Details */}
        {showPropertyDetails && (
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-haven-yellow mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-haven-beige">{property.name}</h3>
                <p className="text-sm text-haven-beige/60">{property.location_details || 'Lakeside Location'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Booking Details - Show when dates are selected */}
        {hasDatesSelected ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-haven-yellow" />
                  <span className="text-haven-beige">Check-in</span>
                </div>
                <span className="font-medium text-haven-beige">{formatDate(selectedCheckIn!)}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-haven-yellow" />
                  <span className="text-haven-beige">Check-out</span>
                </div>
                <span className="font-medium text-haven-beige">{formatDate(selectedCheckOut!)}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-haven-yellow" />
                  <span className="text-haven-beige">Duration</span>
                </div>
                <span className="font-medium text-haven-beige">{nights} {nights === 1 ? 'night' : 'nights'}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-haven-yellow" />
                  <span className="text-haven-beige">Guests</span>
                </div>
                <span className="font-medium text-haven-beige">{guestCount} {guestCount === 1 ? 'guest' : 'guests'}</span>
              </div>
            </div>
            
            <Separator className="bg-haven-yellow/20" />
            
            {/* Pricing */}
            {priceBreakdown ? (
              <div className="space-y-4">
                <EnhancedPriceSummary 
                  priceBreakdown={priceBreakdown} 
                  nights={nights}
                  showCompetitorComparison={false}
                />
                
                {priceBreakdown.savingsFromCompetitors && priceBreakdown.savingsFromCompetitors > 0 && (
                  <div className="bg-green-900/20 p-3 rounded-lg border border-green-400/20">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-green-400">Direct Booking Savings</span>
                      <Badge variant="secondary" className="bg-green-900/30 text-green-400 border-green-400/20">
                        Save {formatPrice(priceBreakdown.savingsFromCompetitors, priceBreakdown.currency)}
                      </Badge>
                    </div>
                  </div>
                )}
                
                <Button 
                  onClick={onProceedToPayment}
                  className="w-full bg-haven-yellow hover:bg-haven-yellow/90 text-haven-navy-dark py-3 text-lg font-medium"
                  disabled={!canProceed}
                  size="lg"
                >
                  {isCalculatingPrice ? 'Calculating...' : 'Continue to Checkout'}
                </Button>
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="text-sm text-haven-beige/60">
                  {isCalculatingPrice ? 'Calculating pricing...' : 'Loading pricing...'}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-haven-beige/30 mx-auto mb-4" />
            <h3 className="font-medium text-haven-beige mb-2">Select your dates</h3>
            <p className="text-haven-beige/60 text-sm">
              Choose your check-in and check-out dates to see pricing and availability
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
