
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

interface BookingConfirmationStepProps {
  bookingReference: string;
  onViewBookings: () => void;
}

const BookingConfirmationStep: React.FC<BookingConfirmationStepProps> = ({
  bookingReference,
  onViewBookings
}) => {
  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <CardTitle className="text-2xl font-serif">Booking Confirmed!</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <p className="mb-4">Thank you for your booking. Your reservation has been confirmed.</p>
        <div className="bg-gray-50 p-4 rounded-md inline-block">
          <p className="text-sm text-gray-500">Booking Reference</p>
          <p className="text-xl font-semibold">{bookingReference}</p>
        </div>
        <p className="mt-4 text-sm text-gray-600">
          A confirmation email has been sent to your registered email address.
        </p>
      </CardContent>
      <CardFooter className="justify-center">
        <Button onClick={onViewBookings}>
          View My Bookings
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BookingConfirmationStep;
