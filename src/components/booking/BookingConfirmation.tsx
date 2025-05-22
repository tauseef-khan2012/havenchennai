
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PaymentReceipt } from '@/components/payment/PaymentReceipt';
import { CheckCircle, CalendarDays, Home, Users, Clock } from 'lucide-react';
import { formatDate } from '@/utils/formatters';
import { Link } from 'react-router-dom';
import { BookingType, PaymentStatus } from '@/types/booking';

interface BookingConfirmationProps {
  bookingType: BookingType;
  bookingReference: string;
  bookingStatus: string;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  transactionId?: string;
  amount: number;
  currency: string;
  paymentMethod?: string;
  paymentDate?: Date | string;
  propertyName?: string;
  experienceName?: string;
  checkInDate?: Date | string;
  checkOutDate?: Date | string;
  experienceDate?: Date | string;
  numberOfGuests?: number;
  numberOfAttendees?: number;
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  bookingType,
  bookingReference,
  bookingStatus,
  paymentStatus,
  paymentId,
  transactionId,
  amount,
  currency,
  paymentMethod,
  paymentDate,
  propertyName,
  experienceName,
  checkInDate,
  checkOutDate,
  experienceDate,
  numberOfGuests,
  numberOfAttendees,
}) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-2xl md:text-3xl font-serif font-bold">Booking Confirmed!</h1>
        <p className="text-gray-600 mt-2">
          Thank you for your booking. Your reservation has been confirmed.
        </p>
      </div>
      
      <div className="grid md:grid-cols-5 gap-6">
        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Booking Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">Booking Reference</p>
                  <p className="font-medium">{bookingReference}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <p className="font-medium">{bookingStatus}</p>
                </div>
              </div>
              
              <div className="pt-2">
                <p className="text-sm font-medium text-gray-500 mb-2">
                  {bookingType === 'property' ? 'Property' : 'Experience'}
                </p>
                <div className="flex items-start">
                  {bookingType === 'property' ? (
                    <Home className="h-5 w-5 mr-2 mt-0.5 text-green-600" />
                  ) : (
                    <Clock className="h-5 w-5 mr-2 mt-0.5 text-green-600" />
                  )}
                  <div>
                    <p className="font-medium">{propertyName || experienceName}</p>
                    {bookingType === 'property' && checkInDate && checkOutDate && (
                      <p className="text-sm text-gray-600">
                        {formatDate(new Date(checkInDate))} - {formatDate(new Date(checkOutDate))}
                      </p>
                    )}
                    {bookingType === 'experience' && experienceDate && (
                      <p className="text-sm text-gray-600">
                        {formatDate(new Date(experienceDate))}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="pt-2">
                <p className="text-sm font-medium text-gray-500 mb-2">
                  {bookingType === 'property' ? 'Guests' : 'Attendees'}
                </p>
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-green-600" />
                  <p>
                    {bookingType === 'property' ? numberOfGuests : numberOfAttendees} {bookingType === 'property' ? 'guests' : 'attendees'}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="w-full flex flex-col sm:flex-row justify-between gap-3">
                <Button asChild variant="outline">
                  <Link to="/dashboard">View All Bookings</Link>
                </Button>
                {bookingType === 'property' && (
                  <Button asChild>
                    <Link to="/stay">Browse More Properties</Link>
                  </Button>
                )}
                {bookingType === 'experience' && (
                  <Button asChild>
                    <Link to="/experiences">Browse More Experiences</Link>
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <PaymentReceipt
            paymentId={paymentId}
            transactionId={transactionId}
            amount={amount}
            currency={currency}
            status={paymentStatus}
            paymentMethod={paymentMethod}
            paymentDate={paymentDate}
            paymentGateway="Razorpay"
            bookingReference={bookingReference}
          />
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
