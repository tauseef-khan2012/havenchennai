
import { UUID } from '@/types/booking';

export interface SimplePriceBreakdown {
  basePrice: number;
  additionalGuestCharges: number;
  subtotal: number;
  gstAmount: number;
  totalAmount: number;
  currency: string;
  nights: number;
  guestCount: number;
}

/**
 * Simple and fast pricing calculation
 */
export const calculateSimplePropertyPrice = (
  checkInDate: Date,
  checkOutDate: Date,
  guestCount: number = 2
): SimplePriceBreakdown => {
  // Calculate nights
  const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Base price: ₹4000 per night
  const basePrice = 4000 * nights;
  
  // Additional guest charges: 3rd guest = ₹500, 4th = ₹1000, 5th = ₹1500
  let additionalGuestCharges = 0;
  if (guestCount > 2) {
    const additionalGuests = guestCount - 2;
    for (let i = 1; i <= additionalGuests; i++) {
      additionalGuestCharges += i * 500;
    }
  }
  
  // Subtotal
  const subtotal = basePrice + additionalGuestCharges;
  
  // GST: 18% (no breakdown)
  const gstAmount = subtotal * 0.18;
  
  // Total
  const totalAmount = subtotal + gstAmount;
  
  return {
    basePrice,
    additionalGuestCharges,
    subtotal,
    gstAmount,
    totalAmount,
    currency: 'INR',
    nights,
    guestCount
  };
};
