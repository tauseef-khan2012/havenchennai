
import React, { useState } from 'react';
import { 
  UUID,
  BookingType,
  PriceBreakdown,
  GuestInfo
} from '@/types/booking';
import PropertyBookingStep1_DatesGuests from './PropertyBookingStep1_DatesGuests';
import PropertyBookingStep2_Addons from './PropertyBookingStep2_Addons';
import PaymentStep from './steps/PaymentStep';
import BookingConfirmationStep from './steps/BookingConfirmationStep';
import { useBookingCreation } from '@/hooks/useBookingCreation';

interface BookingFormProps {
  property: any;
  propertyId: UUID;
  bookingType?: BookingType;
}

const BookingForm: React.FC<BookingFormProps> = ({ 
  property, 
  propertyId, 
  bookingType = 'property' 
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCheckIn, setSelectedCheckIn] = useState<Date | null>(null);
  const [selectedCheckOut, setSelectedCheckOut] = useState<Date | null>(null);
  const [guestCount, setGuestCount] = useState(1);
  const [specialRequests, setSpecialRequests] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');
  const [selectedAddonExperiences, setSelectedAddonExperiences] = useState<{instanceId: UUID, attendees: number}[]>([]);
  const [priceBreakdown, setPriceBreakdown] = useState<PriceBreakdown | null>(null);
  const [bookingId, setBookingId] = useState<UUID | null>(null);
  const [bookingReference, setBookingReference] = useState<string | null>(null);
  const { makeBooking, isLoading: isCreatingBooking } = useBookingCreation();
  const [isCalculatingPrice, setIsCalculatingPrice] = useState(false);
  const [guests, setGuests] = useState<GuestInfo[]>([]);

  const [contactInfo, setContactInfo] = useState({
    fullName: '',
    email: '',
    phone: ''
  });

  const handleStep1Next = (data: { 
    checkInDate: Date; 
    checkOutDate: Date; 
    numberOfGuests: number;
    specialRequests?: string;
  }) => {
    setSelectedCheckIn(data.checkInDate);
    setSelectedCheckOut(data.checkOutDate);
    setGuestCount(data.numberOfGuests);
    setSpecialRequests(data.specialRequests || '');
    
    // Calculate a basic price breakdown for now
    const basePrice = data.numberOfGuests * 2000; // ₹2000 per guest per night
    const nights = Math.ceil((data.checkOutDate.getTime() - data.checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    const subtotal = basePrice * nights;
    const taxAmount = subtotal * 0.18; // 18% GST
    const totalAmountDue = subtotal + taxAmount;
    
    setPriceBreakdown({
      basePrice: subtotal,
      discountAmount: 0,
      subtotalAfterDiscount: subtotal,
      taxPercentage: 18,
      taxAmount: taxAmount,
      totalAmountDue: totalAmountDue,
      currency: 'INR'
    });
    
    setCurrentStep(2);
  };

  const handleStep2Next = (addons: {instanceId: UUID, attendees: number}[]) => {
    setSelectedAddonExperiences(addons);
    setCurrentStep(3);
  };

  const handlePaymentSuccess = (bookingId: UUID, bookingReference: string) => {
    setBookingId(bookingId);
    setBookingReference(bookingReference);
    setCurrentStep(4);
  };

  const handleContactInfoChange = (info: { fullName: string; email: string; phone: string }) => {
    setContactInfo(info);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <PropertyBookingStep1_DatesGuests
            propertyId={propertyId}
            onNext={handleStep1Next}
            initialValues={{
              checkInDate: selectedCheckIn || undefined,
              checkOutDate: selectedCheckOut || undefined,
              numberOfGuests: guestCount,
              specialRequests: specialRequests
            }}
            maxGuests={property?.max_guests || 10}
            minNights={property?.min_nights || 1}
          />
        );

      case 2:
        return (
          <PropertyBookingStep2_Addons
            checkInDate={selectedCheckIn!}
            checkOutDate={selectedCheckOut!}
            numberOfGuests={guestCount}
            onNext={handleStep2Next}
            onBack={() => setCurrentStep(1)}
            initialSelectedAddons={selectedAddonExperiences}
          />
        );

      case 3:
        return (
          <PaymentStep
            bookingType={bookingType}
            priceBreakdown={priceBreakdown!}
            propertyDetails={{
              propertyId,
              checkInDate: selectedCheckIn!,
              checkOutDate: selectedCheckOut!,
              numberOfGuests: guestCount,
              specialRequests: specialRequests,
              customerNotes: customerNotes
            }}
            guests={guests}
            selectedAddonExperiences={selectedAddonExperiences}
            contactInfo={contactInfo}
            onBack={() => setCurrentStep(2)}
            onSuccess={handlePaymentSuccess}
            isLoading={isCreatingBooking}
          />
        );

      case 4:
        return (
          <BookingConfirmationStep
            bookingReference={bookingReference!}
            onViewBookings={() => {
              // Navigate to bookings page
              window.location.href = '/dashboard';
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div>
      {renderStepContent()}
    </div>
  );
};

export default BookingForm;
