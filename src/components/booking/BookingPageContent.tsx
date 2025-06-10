
import React, { useState } from 'react';
import { BookingContent } from './BookingContent';
import { CheckoutStep } from './CheckoutStep';
import { EnhancedPaymentStep } from './EnhancedPaymentStep';
import { BookingConfirmationStep } from './BookingConfirmationStep';
import { EnhancedPriceBreakdown } from '@/services/enhancedPriceService';
import { DiscountApplication } from '@/services/discountService';
import { useToast } from '@/hooks/use-toast';
import { UUID } from '@/types/booking';
import { useBookingCreation } from './hooks/useBookingCreation';

interface BookingPageContentProps {
  property: any;
  propertyId: UUID;
  selectedCheckIn?: Date;
  selectedCheckOut?: Date;
  priceBreakdown: EnhancedPriceBreakdown | null;
  platformComparisons: any[];
  appliedDiscount?: DiscountApplication;
  isCalculatingPrice: boolean;
  onDateRangeSelect: (checkIn: Date, checkOut: Date) => void;
  onPlatformBooking: (platform: string, url?: string) => void;
  onDiscountApplied: (discount: DiscountApplication) => void;
  onProceedToPayment: () => void;
}

interface ContactInfo {
  fullName: string;
  email: string;
  phone: string;
}

interface GuestInfo {
  name: string;
  age?: number;
}

export const BookingPageContent: React.FC<BookingPageContentProps> = ({
  property,
  propertyId,
  selectedCheckIn,
  selectedCheckOut,
  priceBreakdown,
  platformComparisons,
  appliedDiscount,
  isCalculatingPrice,
  onDateRangeSelect,
  onPlatformBooking,
  onDiscountApplied,
  onProceedToPayment
}) => {
  const { toast } = useToast();
  const { createBookingWithValidation, isProcessing } = useBookingCreation();
  
  const [currentStep, setCurrentStep] = useState<'booking' | 'checkout' | 'payment' | 'confirmation'>('booking');
  const [guestCount, setGuestCount] = useState(2);
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    fullName: '',
    email: '',
    phone: ''
  });
  const [guestDetails, setGuestDetails] = useState<GuestInfo[]>([]);
  const [specialRequests, setSpecialRequests] = useState('');
  const [bookingId, setBookingId] = useState<UUID | null>(null);
  const [bookingReference, setBookingReference] = useState<string>('');

  const nights = selectedCheckIn && selectedCheckOut ? 
    Math.ceil((selectedCheckOut.getTime() - selectedCheckIn.getTime()) / (1000 * 60 * 60 * 24)) : 0;

  const handleProceedToCheckout = () => {
    setCurrentStep('checkout');
  };

  const handleProceedToPayment = async (contact: ContactInfo, requests: string, guests: GuestInfo[]) => {
    const result = await createBookingWithValidation(
      propertyId,
      selectedCheckIn,
      selectedCheckOut,
      guestCount,
      priceBreakdown,
      contact,
      requests,
      guests
    );

    if (result) {
      setContactInfo(contact);
      setGuestDetails(guests);
      setSpecialRequests(requests);
      setBookingId(result.bookingId);
      setBookingReference(result.bookingReference);
      setCurrentStep('payment');
    }
  };

  const handlePaymentSuccess = () => {
    setCurrentStep('confirmation');
  };

  const handlePaymentFailure = (error: string) => {
    console.error('Payment failed:', error);
    toast({
      title: "Payment failed",
      description: error,
      variant: "destructive"
    });
    // Stay on payment step to allow retry
  };

  const canProceedToCheckout = selectedCheckIn && selectedCheckOut && priceBreakdown && !isCalculatingPrice;

  if (currentStep === 'checkout' && canProceedToCheckout) {
    return (
      <div className="min-h-screen bg-navy-gradient py-8">
        <div className="absolute inset-0 bg-organic-texture opacity-20"></div>
        <div className="absolute inset-0 leaf-pattern opacity-15"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <CheckoutStep
            property={property}
            propertyId={propertyId}
            selectedCheckIn={selectedCheckIn}
            selectedCheckOut={selectedCheckOut}
            guestCount={guestCount}
            nights={nights}
            priceBreakdown={priceBreakdown}
            appliedDiscount={appliedDiscount}
            onDiscountApplied={onDiscountApplied}
            onProceedToPayment={handleProceedToPayment}
            isProcessing={isProcessing}
          />
        </div>
      </div>
    );
  }

  if (currentStep === 'payment' && bookingId && bookingReference && canProceedToCheckout) {
    // Calculate final total with additional guest charges
    const additionalGuestCharges = Math.max(0, guestCount - 2) * 500;
    const finalPriceBreakdown = {
      ...priceBreakdown,
      totalAmountDue: priceBreakdown.totalAmountDue + additionalGuestCharges
    };

    return (
      <EnhancedPaymentStep
        bookingId={bookingId}
        bookingReference={bookingReference}
        property={property}
        selectedCheckIn={selectedCheckIn}
        selectedCheckOut={selectedCheckOut}
        guestCount={guestCount}
        nights={nights}
        priceBreakdown={finalPriceBreakdown}
        contactInfo={contactInfo}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentFailure={handlePaymentFailure}
      />
    );
  }

  if (currentStep === 'confirmation' && bookingReference) {
    return (
      <BookingConfirmationStep
        bookingReference={bookingReference}
        onViewBookings={() => window.location.href = '/dashboard'}
      />
    );
  }

  // Default booking step with updated property description
  const updatedProperty = {
    ...property,
    long_description: `Experience sustainable luxury in our uniquely designed container home beside serene Muttukadu Lake. Two thoughtfully stacked shipping containers create an innovative retreat for up to 4 guests, featuring three distinct deck levels offering panoramic lake views. 

Located on Chennai's OMR in peaceful Padur, Haven combines modern amenities with eco-conscious design. Wake up to stunning sunrise views over the lake, enjoy your morning coffee on the rooftop deck, and unwind as you watch the rich birdlife including pelicans and flamingos in their natural habitat.

Perfect for couples seeking a romantic getaway, friends planning a unique escape, or anyone looking to disconnect from city life while staying conveniently connected to Chennai.`
  };

  return (
    <div className="min-h-screen bg-navy-gradient py-8">
      <div className="absolute inset-0 bg-organic-texture opacity-20"></div>
      <div className="absolute inset-0 leaf-pattern opacity-15"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <BookingContent
          propertyId={propertyId}
          property={updatedProperty}
          selectedCheckIn={selectedCheckIn}
          selectedCheckOut={selectedCheckOut}
          priceBreakdown={priceBreakdown}
          platformComparisons={platformComparisons}
          onDateRangeSelect={onDateRangeSelect}
          onPlatformBooking={onPlatformBooking}
          guestCount={guestCount}
          setGuestCount={setGuestCount}
          isCalculatingPrice={isCalculatingPrice}
          onProceedToPayment={handleProceedToCheckout}
        />
      </div>
    </div>
  );
};
