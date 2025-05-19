
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PriceSummary } from '@/components/booking/PriceSummary';
import { GuestInfo, PriceBreakdown } from '@/types/booking';
import { calculateNights } from '@/utils/bookingUtils';

interface BookingStepSummaryProps {
  type: 'property' | 'experience';
  checkInDate: string;
  checkOutDate: string;
  guestCount: number;
  attendeeCount: number;
  guests: GuestInfo[];
  specialRequests: string;
  priceBreakdown: PriceBreakdown | null;
  onBack: () => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const BookingStep_Summary: React.FC<BookingStepSummaryProps> = ({
  type,
  checkInDate,
  checkOutDate,
  guestCount,
  attendeeCount,
  guests,
  specialRequests,
  priceBreakdown,
  onBack,
  onSubmit,
  isLoading
}) => {
  // Calculate nights for property bookings
  const nights = checkInDate && checkOutDate 
    ? calculateNights(new Date(checkInDate), new Date(checkOutDate))
    : 0;

  if (!priceBreakdown) return null;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-serif">Booking Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {type === 'property' && (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Dates</span>
                <span>{new Date(checkInDate).toLocaleDateString()} - {new Date(checkOutDate).toLocaleDateString()}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Guests</span>
                <span>{guestCount}</span>
              </div>
              
              <Separator className="my-2" />
              
              <div className="space-y-1">
                <span className="text-gray-600">Guest Names</span>
                <ul className="list-disc list-inside">
                  {guests.map((guest, index) => (
                    <li key={index}>{guest.name}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          
          {type === 'experience' && (
            <div className="flex justify-between">
              <span className="text-gray-600">Attendees</span>
              <span>{attendeeCount}</span>
            </div>
          )}
          
          {specialRequests && (
            <div className="space-y-1">
              <span className="text-gray-600">Special Requests</span>
              <p className="border p-2 rounded bg-gray-50 text-sm">{specialRequests}</p>
            </div>
          )}
          
          <PriceSummary priceBreakdown={priceBreakdown} nights={type === 'property' ? nights : undefined} />
        </div>
        
        <div className="pt-4">
          <Button onClick={onBack} variant="outline" className="mr-2">
            Back
          </Button>
          <Button onClick={onSubmit} disabled={isLoading}>
            {isLoading ? 'Processing...' : 'Confirm Booking'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingStep_Summary;
