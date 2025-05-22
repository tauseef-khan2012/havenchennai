
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PaymentReceipt } from '@/components/payment/PaymentReceipt';
import { PriceSummary } from '@/components/booking/PriceSummary';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { 
  UUID, 
  BookingType, 
  PriceBreakdown, 
  PropertyBookingDetails,
  ExperienceBookingDetails,
  GuestInfo,
  PaymentStatus
} from '@/types/booking';
import { createBooking } from '@/services/bookingService';
import { CreditCard, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export interface PaymentStepProps {
  bookingType: BookingType;
  priceBreakdown: PriceBreakdown;
  propertyDetails?: PropertyBookingDetails;
  experienceDetails?: ExperienceBookingDetails;
  guests?: GuestInfo[];
  selectedAddonExperiences?: {instanceId: UUID, attendees: number}[];
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
  onBack,
  onSuccess,
  isLoading = false
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [bookingCreated, setBookingCreated] = useState(false);
  const [bookingId, setBookingId] = useState<UUID | null>(null);
  const [bookingReference, setBookingReference] = useState<string | null>(null);

  const handlePayment = async () => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to complete your booking.',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }

    setIsSubmitting(true);
    setPaymentError(null);
    
    try {
      const bookingData = {
        type: bookingType,
        userId: user.id,
        priceBreakdown: priceBreakdown,
        guests: guests,
        selectedAddonExperiences: selectedAddonExperiences,
        property: propertyDetails,
        experience: experienceDetails
      };
      
      const result = await createBooking(bookingData);
      
      setBookingCreated(true);
      setBookingId(result.bookingId);
      setBookingReference(result.bookingReference);
      
      toast({
        title: 'Booking created!',
        description: 'Redirecting to payment...',
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
