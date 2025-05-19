
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface BookingStepConfirmationProps {
  bookingReference: string;
  onViewBookings: () => void;
}

const BookingStep_Confirmation: React.FC<BookingStepConfirmationProps> = ({
  bookingReference,
  onViewBookings
}) => {
  return (
    <Card className="w-full">
      <CardContent className="pt-6 space-y-4 text-center">
        <div className="text-green-600 text-5xl mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h3 className="font-serif text-2xl font-semibold">Booking Confirmed!</h3>
        
        <p>Thank you for your booking. Your reservation is now confirmed.</p>
        
        <div className="bg-gray-50 border p-4 rounded-md my-4">
          <p className="font-medium">Booking Reference</p>
          <p className="text-xl font-mono">{bookingReference}</p>
        </div>
        
        <p className="text-sm text-gray-600">
          A confirmation email has been sent to your registered email address.
        </p>
        
        <div className="pt-4">
          <Button onClick={onViewBookings} className="w-full">
            View My Bookings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingStep_Confirmation;
