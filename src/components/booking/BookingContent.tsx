
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  MapPin, 
  Users, 
  Calendar, 
  Camera,
  Wifi,
  Coffee,
  Car,
  Waves,
  TreePine,
  Eye
} from 'lucide-react';
import { PropertyImageSlider } from './PropertyImageSlider';
import { CalendarDatePicker } from './calendar/CalendarDatePicker';
import { EnhancedBookingSummary } from './EnhancedBookingSummary';
import { EnhancedPriceBreakdown } from '@/services/enhancedPriceService';
import { UUID } from '@/types/booking';

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

  const amenities = [
    { icon: <Wifi className="h-4 w-4" />, label: "High-Speed WiFi" },
    { icon: <Coffee className="h-4 w-4" />, label: "Full Kitchen" },
    { icon: <Car className="h-4 w-4" />, label: "Free Parking" },
    { icon: <Waves className="h-4 w-4" />, label: "Lakeside Location" },
    { icon: <TreePine className="h-4 w-4" />, label: "Nature Views" },
    { icon: <Eye className="h-4 w-4" />, label: "Multi-Level Decks" }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="text-center animate-fade-in">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="w-12 h-1 bg-yellow-gradient rounded-full"></div>
          <span className="font-handwritten text-xl text-haven-yellow">Book Your Stay</span>
          <div className="w-12 h-1 bg-yellow-gradient rounded-full"></div>
        </div>
        <h1 className="text-3xl lg:text-4xl font-serif font-bold text-haven-beige mb-2">
          {property.name}
        </h1>
        <div className="flex items-center justify-center gap-2 text-haven-beige/80">
          <MapPin className="h-4 w-4 text-haven-yellow" />
          <span>Padur, Chennai OMR • Beside Muttukadu Lake</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Property Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <Card className="glass-panel-navy border-haven-yellow/20 shadow-navy overflow-hidden animate-fade-in">
            <PropertyImageSlider property={property} />
          </Card>

          {/* Property Description */}
          <Card className="glass-panel-navy border-haven-yellow/20 shadow-navy animate-fade-in-delay">
            <CardHeader>
              <CardTitle className="text-haven-beige flex items-center gap-2">
                <Camera className="h-5 w-5 text-haven-yellow" />
                About This Place
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-haven-beige/90 leading-relaxed whitespace-pre-line">
                {property.long_description}
              </div>
              
              <Separator className="bg-haven-yellow/20" />
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-yellow-gradient/10 rounded-xl border border-haven-yellow/20">
                  <Users className="h-5 w-5 text-haven-yellow mx-auto mb-1" />
                  <div className="text-sm font-medium text-haven-beige">Up to {property.max_guests}</div>
                  <div className="text-xs text-haven-beige/70">Guests</div>
                </div>
                <div className="text-center p-3 bg-yellow-gradient/10 rounded-xl border border-haven-yellow/20">
                  <MapPin className="h-5 w-5 text-haven-yellow mx-auto mb-1" />
                  <div className="text-sm font-medium text-haven-beige">Lakeside</div>
                  <div className="text-xs text-haven-beige/70">Location</div>
                </div>
                <div className="text-center p-3 bg-yellow-gradient/10 rounded-xl border border-haven-yellow/20">
                  <Eye className="h-5 w-5 text-haven-yellow mx-auto mb-1" />
                  <div className="text-sm font-medium text-haven-beige">3 Levels</div>
                  <div className="text-xs text-haven-beige/70">Deck Views</div>
                </div>
                <div className="text-center p-3 bg-yellow-gradient/10 rounded-xl border border-haven-yellow/20">
                  <TreePine className="h-5 w-5 text-haven-yellow mx-auto mb-1" />
                  <div className="text-sm font-medium text-haven-beige">Eco-Friendly</div>
                  <div className="text-xs text-haven-beige/70">Container Home</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Amenities */}
          <Card className="glass-panel-navy border-haven-yellow/20 shadow-navy animate-fade-in-delay-2">
            <CardHeader>
              <CardTitle className="text-haven-beige">What This Place Offers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-yellow-gradient/5 rounded-xl border border-haven-yellow/10 hover:border-haven-yellow/30 transition-colors duration-300">
                    <div className="text-haven-yellow">{amenity.icon}</div>
                    <span className="text-sm text-haven-beige">{amenity.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Date Selection */}
          <Card className="glass-panel-navy border-haven-yellow/20 shadow-navy animate-fade-in-delay">
            <CardHeader>
              <CardTitle className="text-haven-beige flex items-center gap-2">
                <Calendar className="h-5 w-5 text-haven-yellow" />
                Select Your Dates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CalendarDatePicker
                selectedCheckIn={selectedCheckIn}
                selectedCheckOut={selectedCheckOut}
                onDateRangeSelect={onDateRangeSelect}
                propertyId={propertyId}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Booking Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <EnhancedBookingSummary
              property={property}
              propertyId={propertyId}
              guestCount={guestCount}
              selectedCheckIn={selectedCheckIn}
              selectedCheckOut={selectedCheckOut}
              priceBreakdown={priceBreakdown}
              nights={nights}
              isCalculatingPrice={isCalculatingPrice}
              onProceedToPayment={onProceedToPayment}
              showPropertyDetails={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
