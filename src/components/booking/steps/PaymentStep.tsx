
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PaymentReceipt } from '@/components/payment/PaymentReceipt';
import { PriceSummary } from '@/components/booking/PriceSummary';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  UUID, 
  BookingType, 
  PriceBreakdown, 
  PropertyBookingDetails,
  ExperienceBookingDetails,
  GuestInfo
} from '@/types/booking';
import { createBooking } from '@/services/bookingService';
import { createGuestBooking } from '@/services/guestBookingService';
import { CreditCard, AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export interface PaymentStepProps {
  bookingType: BookingType;
  priceBreakdown: PriceBreakdown;
  propertyDetails?: PropertyBookingDetails;
  experienceDetails?: ExperienceBookingDetails;
  guests?: GuestInfo[];
  selectedAddonExperiences?: {instanceId: UUID, attendees: number}[];
  contactInfo: {
    fullName: string;
    email: string;
    phone: string;
  };
  onBack: () => void;
  onSuccess: (bookingId: UUID, bookingReference: string) => void;
  isLoading?: boolean;
}

const PaymentStep: React.FC<PaymentStepProps> = ({
  bookingType,
  priceBreakdown,
  propertyDetails,
  experienceDetails,
  guests = [],
  selectedAddonExperiences = [],
  contactInfo,
  onBack,
  onSuccess,
  isLoading = false
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [bookingCreated, setBookingCreated] = useState(false);
  const [bookingId, setBookingId] = useState<UUID | null>(null);
  const [bookingReference, setBookingReference] = useState<string | null>(null);

  // Validate contact information before proceeding
  const validateContactInfo = () => {
    if (!contactInfo.fullName.trim()) {
      return { isValid: false, message: 'Full name is required' };
    }
    if (!contactInfo.email.trim()) {
      return { isValid: false, message: 'Email address is required' };
    }
    if (!contactInfo.phone.trim()) {
      return { isValid: false, message: 'Phone number is required' };
    }
    return { isValid: true, message: '' };
  };

  const handlePayment = async () => {
    console.log('Payment initiated with contact info:', contactInfo);
    console.log('User status:', user ? 'Logged in' : 'Guest');
    
    // Validate contact information
    const validation = validateContactInfo();
    if (!validation.isValid) {
      toast({
        title: 'Missing contact information',
        description: validation.message,
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);
    setPaymentError(null);
    
    try {
      let result;
      
      if (user) {
        // User is logged in - create regular booking
        console.log('Creating authenticated user booking');
        const bookingData = {
          type: bookingType,
          userId: user.id,
          priceBreakdown: priceBreakdown,
          guests: guests,
          selectedAddonExperiences: selectedAddonExperiences,
          property: propertyDetails,
          experience: experienceDetails
        };
        
        result = await createBooking(bookingData);
      } else {
        // Guest booking - no authentication required
        console.log('Creating guest booking');
        const guestBookingData = {
          type: bookingType,
          guestName: contactInfo.fullName,
          guestEmail: contactInfo.email,
          guestPhone: contactInfo.phone,
          priceBreakdown: priceBreakdown,
          propertyId: propertyDetails?.propertyId,
          checkInDate: propertyDetails?.checkInDate,
          checkOutDate: propertyDetails?.checkOutDate,
          numberOfGuests: propertyDetails?.numberOfGuests,
          specialRequests: propertyDetails?.specialRequests,
          instanceId: experienceDetails?.instanceId,
          numberOfAttendees: experienceDetails?.numberOfAttendees
        };
        
        result = await createGuestBooking(guestBookingData);
      }
      
      setBookingCreated(true);
      setBookingId(result.bookingId);
      setBookingReference(result.bookingReference);
      
      toast({
        title: 'Booking created!',
        description: user 
          ? 'Redirecting to payment...' 
          : 'Your booking has been created. Proceeding to payment...',
      });

      onSuccess(result.bookingId, result.bookingReference);
    } catch (error: any) {
      console.error('Error creating booking:', error);
      setPaymentError(error.message || 'Failed to create booking. Please try again.');
      
      toast({
        title: 'Error',
        description: error.message || 'Failed to create booking. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-serif">Payment Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-3">Booking Summary</h3>
            <PriceSummary priceBreakdown={priceBreakdown} />
            
            {/* Contact Information Summary */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Contact Details</h4>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Name:</span> {contactInfo.fullName}</p>
                <p><span className="font-medium">Email:</span> {contactInfo.email}</p>
                <p><span className="font-medium">Phone:</span> {contactInfo.phone}</p>
              </div>
              {!user && (
                <p className="text-xs text-gray-600 mt-2">
                  Booking as guest • You can create an account later to manage your bookings
                </p>
              )}
            </div>
            
            {/* Booking Status */}
            <div className="mt-4">
              {user ? (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>Signed in • Faster checkout</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>Guest booking • No account required</span>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Payment Method</h3>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200 flex items-center">
              <CreditCard className="h-5 w-5 mr-2 text-green-600" />
              <div>
                <p className="font-medium">Razorpay</p>
                <p className="text-sm text-muted-foreground">Secure payment gateway</p>
              </div>
            </div>
            
            {bookingCreated && bookingId && (
              <div className="mt-4">
                <PaymentReceipt 
                  status="Unpaid"
                  amount={priceBreakdown.totalAmountDue}
                  currency={priceBreakdown.currency}
                  bookingReference={bookingReference || undefined}
                />
              </div>
            )}
          </div>
        </div>
        
        {paymentError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Payment Error</AlertTitle>
            <AlertDescription>{paymentError}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onBack} disabled={isLoading || isSubmitting}>
          Back
        </Button>
        <Button 
          onClick={handlePayment} 
          disabled={isLoading || isSubmitting || bookingCreated}
          className="bg-green-700 hover:bg-green-800"
        >
          {isLoading || isSubmitting ? 'Processing...' : 'Proceed to Payment'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PaymentStep;
