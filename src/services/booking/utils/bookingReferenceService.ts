
import { BookingType } from '@/types/booking';

/**
 * Generates a unique booking reference
 */
export function generateBookingReference(type: BookingType): string {
  const prefix = type === 'property' ? 'PROP' : 'EXP';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `${prefix}-${timestamp}${random}`;
}
