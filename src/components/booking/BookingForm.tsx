
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
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

  const handleDateChange = (checkIn: Date, checkOut: Date) => {
    setSelectedCheckIn(checkIn);
    setSelectedCheckOut(checkOut);
  };

  const handleStep1Next = () => {
    setCurrentStep(2);
  };

  const handleStep2Next = () => {
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
            selectedCheckIn={selectedCheckIn}
            selectedCheckOut={selectedCheckOut}
            guestCount={guestCount}
            onDateChange={handleDateChange}
            onGuestCountChange={setGuestCount}
            onNext={handleStep1Next}
            isLoading={isCalculatingPrice}
          />
        );

      case 2:
        return (
          <PropertyBookingStep2_Addons
            selectedCheckIn={selectedCheckIn!}
            selectedCheckOut={selectedCheckOut!}
            guestCount={guestCount}
            onAddonExperiencesChange={setSelectedAddonExperiences}
            onNext={handleStep2Next}
            onBack={() => setCurrentStep(1)}
            isLoading={false}
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
