
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookingContent } from './BookingContent';
import { CheckoutStep } from './CheckoutStep';
import { EnhancedPaymentStep } from './EnhancedPaymentStep';
import { BookingConfirmationStep } from './BookingConfirmationStep';
import { EnhancedPriceBreakdown } from '@/services/enhancedPriceService';
import { DiscountApplication } from '@/services/discountService';
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
  const [currentStep, setCurrentStep] = useState<'booking' | 'checkout' | 'payment' | 'confirmation'>('booking');
  const [guestCount, setGuestCount] = useState(2);
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    fullName: '',
    email: '',
    phone: ''
  });
  const [specialRequests, setSpecialRequests] = useState('');
  const [bookingId, setBookingId] = useState<UUID | null>(null);
  const [bookingReference, setBookingReference] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const nights = selectedCheckIn && selectedCheckOut ? 
    Math.ceil((selectedCheckOut.getTime() - selectedCheckIn.getTime()) / (1000 * 60 * 60 * 24)) : 0;

  const handleProceedToCheckout = () => {
    setCurrentStep('checkout');
  };

  const handleProceedToPayment = async (contact: ContactInfo, requests: string) => {
    setIsProcessing(true);
    setContactInfo(contact);
    setSpecialRequests(requests);
    
    try {
      // Create booking logic here
      // For now, we'll simulate the booking creation
      const mockBookingId = 'booking_' + Date.now();
      const mockBookingReference = 'HVN' + Date.now().toString().slice(-6);
      
      setBookingId(mockBookingId);
      setBookingReference(mockBookingReference);
      setCurrentStep('payment');
    } catch (error) {
      console.error('Error creating booking:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = () => {
    setCurrentStep('confirmation');
  };

  const handlePaymentFailure = (error: string) => {
    console.error('Payment failed:', error);
    // Handle payment failure - could show error message or return to checkout
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
    return (
      <EnhancedPaymentStep
        bookingId={bookingId}
        bookingReference={bookingReference}
        property={property}
        selectedCheckIn={selectedCheckIn}
        selectedCheckOut={selectedCheckOut}
        guestCount={guestCount}
        nights={nights}
        priceBreakdown={priceBreakdown}
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
