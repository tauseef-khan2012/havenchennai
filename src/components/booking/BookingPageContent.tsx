
import React, { useState } from 'react';
import { BookingContent } from './BookingContent';
import { CheckoutStep } from './CheckoutStep';
import { EnhancedPaymentStep } from './EnhancedPaymentStep';
import { BookingConfirmationStep } from './BookingConfirmationStep';
import { EnhancedPriceBreakdown } from '@/services/enhancedPriceService';
import { DiscountApplication } from '@/services/discountService';
import { createBooking, createGuestBooking } from '@/services/bookingService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { UUID } from '@/types/booking';

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
  const { user } = useAuth();
  const { toast } = useToast();
  
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
  const [isProcessing, setIsProcessing] = useState(false);

  const nights = selectedCheckIn && selectedCheckOut ? 
    Math.ceil((selectedCheckOut.getTime() - selectedCheckIn.getTime()) / (1000 * 60 * 60 * 24)) : 0;

  const handleProceedToCheckout = () => {
    setCurrentStep('checkout');
  };

  const handleProceedToPayment = async (contact: ContactInfo, requests: string, guests: GuestInfo[]) => {
    if (!selectedCheckIn || !selectedCheckOut || !priceBreakdown) {
      toast({
        title: "Missing booking details",
        description: "Please ensure all booking details are complete.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setContactInfo(contact);
    setGuestDetails(guests);
    setSpecialRequests(requests);
    
    try {
      // Calculate additional guest charges
      const additionalGuestCharges = Math.max(0, guestCount - 2) * 500;
      const finalTotal = priceBreakdown.totalAmountDue + additionalGuestCharges;

      let result;

      if (user) {
        // Authenticated user booking
        const bookingData = {
          type: 'property' as const,
          userId: user.id,
          priceBreakdown: {
            ...priceBreakdown,
            totalAmountDue: finalTotal
          },
          guests: guests.map(guest => ({
            name: guest.name,
            age: guest.age
          })),
          property: {
            propertyId,
            checkInDate: selectedCheckIn,
            checkOutDate: selectedCheckOut,
            numberOfGuests: guestCount,
            specialRequests: requests,
            customerNotes: `Contact: ${contact.fullName} (${contact.email}, ${contact.phone})`
          }
        };
        
        result = await createBooking(bookingData);
      } else {
        // Guest booking - no authentication required
        const guestBookingData = {
          type: 'property' as const,
          guestName: contact.fullName,
          guestEmail: contact.email,
          guestPhone: contact.phone,
          priceBreakdown: {
            ...priceBreakdown,
            totalAmountDue: finalTotal
          },
          propertyId,
          checkInDate: selectedCheckIn,
          checkOutDate: selectedCheckOut,
          numberOfGuests: guestCount,
          specialRequests: requests
        };
        
        result = await createGuestBooking(guestBookingData);
      }
      
      setBookingId(result.bookingId);
      setBookingReference(result.bookingReference);
      setCurrentStep('payment');
      
      toast({
        title: "Booking created successfully",
        description: `Your booking reference is ${result.bookingReference}`,
      });
    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: "Booking creation failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
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

  // Default booking step
  return (
    <BookingContent
      propertyId={propertyId}
      property={property}
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
  );
};
