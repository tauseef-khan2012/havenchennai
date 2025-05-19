
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

interface BookingStepPaymentProps {
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
  onSuccess: (bookingId: UUID, bookingReference: string) => void;
}

const BookingStep_Payment: React.FC<BookingStepPaymentProps> = ({
  bookingType,
  priceBreakdown,
  propertyDetails,
  experienceDetails,
  guests,
  selectedAddonExperiences,
  onBack,
  onSuccess
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);

  // Calculate nights for property bookings
  const nights = propertyDetails 
    ? calculateNights(propertyDetails.checkInDate, propertyDetails.checkOutDate) 
    : undefined;

  const handlePayment = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to complete your booking.",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // 1. Create the booking
      const bookingData = {
        type: bookingType,
        userId: user.id,
        property: propertyDetails,
        experience: experienceDetails,
        priceBreakdown,
        guests,
        selectedAddonExperiences
      };
      
      const { bookingId, bookingReference } = await createBooking(bookingData);
      
      // 2. Initiate payment
      const { orderId, razorpayKey } = await initiatePayment({
        bookingId,
        bookingType,
        amount: priceBreakdown.totalAmountDue,
        currency: priceBreakdown.currency,
        userEmail: user.email || '',
        userName: user.user_metadata?.full_name || 'Guest',
        bookingReference
      });
      
      // 3. Show Razorpay checkout
      // In a real implementation, this would use the Razorpay JS SDK
      // For now, we'll mock success
      toast({
        title: "Payment processed successfully",
        description: "Your booking has been confirmed.",
      });
      
      // Redirect to success
      onSuccess(bookingId, bookingReference);
    } catch (error) {
      console.error('Error processing payment:', error);
      toast({
        title: "Payment failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

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
              <Button variant="outline" onClick={onBack} disabled={isProcessing}>
                Back
              </Button>
              <Button 
                onClick={handlePayment} 
                disabled={isProcessing || !user}
                className="bg-haven-green hover:bg-haven-green/90"
              >
                {isProcessing ? (
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
