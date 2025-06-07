
import { EnhancedPriceBreakdown } from '@/services/enhancedPriceService';

export const validateBookingData = (
  selectedCheckIn?: Date,
  selectedCheckOut?: Date,
  priceBreakdown?: EnhancedPriceBreakdown | null,
  guestCount?: number
): string[] => {
  const errors: string[] = [];
  
  if (!selectedCheckIn) {
    errors.push('Check-in date is required');
  }
  
  if (!selectedCheckOut) {
    errors.push('Check-out date is required');
  }
  
  if (selectedCheckIn && selectedCheckOut && selectedCheckIn >= selectedCheckOut) {
    errors.push('Check-out date must be after check-in date');
  }
  
  if (!priceBreakdown) {
    errors.push('Price calculation is missing. Please refresh and try again');
  } else if (priceBreakdown.totalAmountDue <= 0) {
    errors.push('Invalid booking amount. Please refresh and try again');
  }
  
  if (!guestCount || guestCount < 1) {
    errors.push('At least 1 guest is required');
  } else if (guestCount > 20) {
    errors.push('Maximum 20 guests allowed per booking');
  }
  
  return errors;
};
