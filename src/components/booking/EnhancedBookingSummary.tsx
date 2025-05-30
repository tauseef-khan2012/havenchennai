
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

  return (
    <Card className="shadow-lg border-haven-teal/20">
      <CardHeader className="bg-haven-teal/5">
        <CardTitle className="text-xl font-serif text-gray-900 flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-haven-teal" />
          Reserve Haven
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {/* Property Details */}
        {showPropertyDetails && (
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-haven-teal mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-gray-900">{property.name}</h3>
                <p className="text-sm text-gray-600">{property.location_details || 'Lakeside Location'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Booking Details */}
        {selectedCheckIn && selectedCheckOut ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-haven-teal" />
                  <span>Check-in</span>
                </div>
                <span className="font-medium">{formatDate(selectedCheckIn)}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-haven-teal" />
                  <span>Check-out</span>
                </div>
                <span className="font-medium">{formatDate(selectedCheckOut)}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-haven-teal" />
                  <span>Duration</span>
                </div>
                <span className="font-medium">{nights} {nights === 1 ? 'night' : 'nights'}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-haven-teal" />
                  <span>Guests</span>
                </div>
                <span className="font-medium">{guestCount} {guestCount === 1 ? 'guest' : 'guests'}</span>
              </div>
            </div>
            
            <Separator />
            
            {/* Pricing */}
            {priceBreakdown ? (
              <div className="space-y-4">
                <EnhancedPriceSummary 
                  priceBreakdown={priceBreakdown} 
                  nights={nights}
                  showCompetitorComparison={false}
                />
                
                {priceBreakdown.savingsFromCompetitors && priceBreakdown.savingsFromCompetitors > 0 && (
                  <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-green-800">Direct Booking Savings</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Save {formatPrice(priceBreakdown.savingsFromCompetitors, priceBreakdown.currency)}
                      </Badge>
                    </div>
                  </div>
                )}
                
                <Button 
                  onClick={onProceedToPayment}
                  className="w-full bg-haven-teal hover:bg-haven-teal/90 text-white py-3 text-lg font-medium"
                  disabled={!canProceed}
                  size="lg"
                >
                  {isCalculatingPrice ? 'Calculating...' : 'Continue to Checkout'}
                </Button>
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="text-sm text-gray-500">
                  {isCalculatingPrice ? 'Calculating pricing...' : 'Select dates to see pricing'}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="font-medium text-gray-900 mb-2">Select your dates</h3>
            <p className="text-gray-500 text-sm">
              Choose your check-in and check-out dates to see pricing and availability
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
