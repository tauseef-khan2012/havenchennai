
import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PriceSummary } from '@/components/booking/PriceSummary';
import { UUID, PriceBreakdown, GuestInfo, BookingType } from '@/types/booking';
import { useAuth } from '@/contexts/AuthContext';
import { calculateNights } from '@/utils/bookingUtils';
import { createBooking } from '@/services/bookingService';
import { initiatePayment } from '@/services/paymentService';
import { Spinner } from '@/components/ui/spinner';

export interface BookingStepPaymentProps {
  bookingType: BookingType;
  priceBreakdown: PriceBreakdown;
  propertyDetails?: {
    propertyId: UUID;
    checkInDate: Date;
    checkOutDate: Date;
    numberOfGuests: number;
    specialRequests?: string;
    customerNotes?: string;
  };
  experienceDetails?: {
    instanceId: UUID;
    numberOfAttendees: number;
    specialRequests?: string;
  };
  guests?: GuestInfo[];
  selectedAddonExperiences?: {
    instanceId: UUID;
    attendees: number;
  }[];
  onBack: () => void;
  onSuccess: UUID;
  onPayment: () => Promise<void>;
  isLoading: boolean;
}

const BookingStep_Payment: React.FC<BookingStepPaymentProps> = ({
  bookingType,
  priceBreakdown,
  propertyDetails,
  experienceDetails,
  guests,
  selectedAddonExperiences,
  onBack,
  onSuccess,
  onPayment,
  isLoading
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Calculate nights for property bookings
  const nights = propertyDetails 
    ? calculateNights(propertyDetails.checkInDate, propertyDetails.checkOutDate) 
    : undefined;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-serif">Review & Payment</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Booking details summary */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Booking Details</h3>
            
            {propertyDetails && (
              <div className="space-y-2">
                <p><span className="font-medium">Check-in:</span> {propertyDetails.checkInDate.toLocaleDateString()}</p>
                <p><span className="font-medium">Check-out:</span> {propertyDetails.checkOutDate.toLocaleDateString()}</p>
                <p><span className="font-medium">Guests:</span> {propertyDetails.numberOfGuests}</p>
                {propertyDetails.specialRequests && (
                  <p><span className="font-medium">Special Requests:</span> {propertyDetails.specialRequests}</p>
                )}
                {propertyDetails.customerNotes && (
                  <p><span className="font-medium">Notes:</span> {propertyDetails.customerNotes}</p>
                )}
              </div>
            )}
            
            {experienceDetails && (
              <div className="space-y-2">
                <p><span className="font-medium">Experience ID:</span> {experienceDetails.instanceId}</p>
                <p><span className="font-medium">Attendees:</span> {experienceDetails.numberOfAttendees}</p>
                {experienceDetails.specialRequests && (
                  <p><span className="font-medium">Special Requests:</span> {experienceDetails.specialRequests}</p>
                )}
              </div>
            )}
            
            {selectedAddonExperiences && selectedAddonExperiences.length > 0 && (
              <div className="space-y-2">
                <p className="font-medium">Add-on Experiences:</p>
                <ul className="list-disc pl-5">
                  {selectedAddonExperiences.map((addon, index) => (
                    <li key={addon.instanceId}>
                      Experience #{index + 1}: {addon.attendees} attendees
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <Separator />
          
          {/* Price summary */}
          <PriceSummary priceBreakdown={priceBreakdown} nights={nights} />
          
          <Separator />
          
          {/* Payment button */}
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              By clicking "Complete Payment", you agree to our terms and conditions and cancellation policy.
            </p>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={onBack} disabled={isLoading}>
                Back
              </Button>
              <Button 
                onClick={onPayment} 
                disabled={isLoading || !user}
                className="bg-haven-green hover:bg-haven-green/90"
              >
                {isLoading ? (
                  <>
                    <Spinner className="mr-2" />
                    Processing...
                  </>
                ) : (
                  'Complete Payment'
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingStep_Payment;
