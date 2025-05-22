
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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
  GuestInfo 
} from '@/types/booking';
import { createBooking } from '@/services/bookingService';

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
      
      const { bookingId, bookingReference } = await createBooking(bookingData);
      
      toast({
        title: 'Booking created!',
        description: 'Redirecting to payment...',
      });

      onSuccess(bookingId, bookingReference);
    } catch (error: any) {
      console.error('Error creating booking:', error);
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
      <CardContent>
        <PriceSummary priceBreakdown={priceBreakdown} />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handlePayment} disabled={isLoading || isSubmitting}>
          {isLoading || isSubmitting ? 'Processing...' : 'Confirm & Pay'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PaymentStep;
