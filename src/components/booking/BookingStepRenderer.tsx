
import React from 'react';
import { PriceBreakdown, GuestInfo, UUID, BookingType } from '@/types/booking';
import PropertyBookingStep1_DatesGuests from './PropertyBookingStep1_DatesGuests';
import PropertyBookingStep2_Addons from './PropertyBookingStep2_Addons';
import ExperienceBookingStep1_Attendees from './ExperienceBookingStep1_Attendees';
import ExperienceBookingStep2_Requests from './ExperienceBookingStep2_Requests';
import BookingStep_GuestInfo from './BookingStep_GuestInfo';
import BookingStep_Summary from './BookingStep_Summary';
import PaymentStep from './steps/PaymentStep';
import BookingStep_Confirmation from './BookingStep_Confirmation';
import { useNavigate } from 'react-router-dom';
import { calculateNights } from '@/utils/bookingUtils';

interface BookingStepRendererProps {
  type: BookingType;
  formStep: number;
  propertyId?: UUID;
  instanceId?: UUID;
  checkInDate: string;
  checkOutDate: string;
  guestCount: number;
  attendeeCount: number;
  specialRequests: string;
  guests: GuestInfo[];
  maxGuests?: number;
  availableCapacity?: number;
  isLoading: boolean;
  priceBreakdown: PriceBreakdown | null;
  bookingInfo: { 
    bookingId: UUID; 
    bookingReference: string; 
    priceBreakdown: PriceBreakdown;
  } | null;
  contactInfo?: {
    fullName: string;
    email: string;
    phone: string;
  };
  onPropertyStep1Complete: (checkIn: string, checkOut: string, guests: number) => void;
  onAttendeeChange: (count: number) => void;
  onSpecialRequestsChange: (requests: string) => void;
  onGuestInfoUpdate: (guests: GuestInfo[], specialRequests?: string) => void;
  onCalculatePrice: () => Promise<void>;
  onContinue: () => void;
  onBack: (step: number) => void;
  onSubmit: () => void;
  onPayment: () => void;
}

const BookingStepRenderer: React.FC<BookingStepRendererProps> = ({
  type,
  formStep,
  propertyId,
  instanceId,
  checkInDate,
  checkOutDate,
  guestCount,
  attendeeCount,
  specialRequests,
  guests,
  maxGuests = 4,
  availableCapacity = 10,
  isLoading,
  priceBreakdown,
  bookingInfo,
  contactInfo = { fullName: '', email: '', phone: '' },
  onPropertyStep1Complete,
  onAttendeeChange,
  onSpecialRequestsChange,
  onGuestInfoUpdate,
  onCalculatePrice,
  onContinue,
  onBack,
  onSubmit,
  onPayment
}) => {
  const navigate = useNavigate();
  const nights = checkInDate && checkOutDate 
    ? calculateNights(new Date(checkInDate), new Date(checkOutDate))
    : 0;
  
  switch (formStep) {
    case 0:
      return type === 'property' ? (
        <PropertyBookingStep1_DatesGuests
          propertyId={propertyId as UUID}
          maxGuests={maxGuests}
          onNext={(data) => {
            onPropertyStep1Complete(
              data.checkInDate.toISOString(), 
              data.checkOutDate.toISOString(), 
              data.numberOfGuests
            );
          }}
        />
      ) : (
        <ExperienceBookingStep1_Attendees
          attendeeCount={attendeeCount}
          availableCapacity={availableCapacity}
          isLoading={isLoading}
          priceBreakdown={priceBreakdown}
          onAttendeeChange={onAttendeeChange}
          onCalculatePrice={onCalculatePrice}
          onContinue={onContinue}
        />
      );
      
    case 1:
      return type === 'property' ? (
        <BookingStep_GuestInfo
          numberOfGuests={guestCount}
          onNext={onGuestInfoUpdate}
          onBack={() => onBack(0)}
          initialGuestInfo={guests}
          initialCustomerNotes={specialRequests}
        />
      ) : (
        <ExperienceBookingStep2_Requests
          specialRequests={specialRequests}
          onSpecialRequestsChange={onSpecialRequestsChange}
          onBack={() => onBack(0)}
          onContinue={onContinue}
        />
      );
      
    case 2:
      return (
        <BookingStep_Summary
          type={type}
          checkInDate={checkInDate}
          checkOutDate={checkOutDate}
          guestCount={guestCount}
          attendeeCount={attendeeCount}
          guests={guests}
          specialRequests={specialRequests}
          priceBreakdown={priceBreakdown}
          onBack={() => onBack(1)}
          onSubmit={onSubmit}
          isLoading={isLoading}
        />
      );
      
    case 3:
      return bookingInfo ? (
        <PaymentStep
          bookingType={type}
          priceBreakdown={bookingInfo.priceBreakdown}
          propertyDetails={type === 'property' ? {
            propertyId: propertyId as UUID,
            checkInDate: new Date(checkInDate),
            checkOutDate: new Date(checkOutDate),
            numberOfGuests: guestCount,
            specialRequests,
            customerNotes: specialRequests
          } : undefined}
          experienceDetails={type === 'experience' ? {
            instanceId: instanceId as UUID,
            numberOfAttendees: attendeeCount,
            specialRequests
          } : undefined}
          guests={guests}
          selectedAddonExperiences={[]}
          contactInfo={contactInfo}
          onBack={() => onBack(2)}
          onSuccess={() => onPayment()}
          isLoading={isLoading}
        />
      ) : null;
      
    case 4:
      return bookingInfo ? (
        <BookingStep_Confirmation
          bookingReference={bookingInfo.bookingReference}
          onViewBookings={() => navigate('/dashboard')}
        />
      ) : null;
      
    default:
      return null;
  }
};

export default BookingStepRenderer;
