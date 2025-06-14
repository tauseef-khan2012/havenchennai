
// This file now acts as an aggregator for guest booking related services.
// Specific implementations are in subdirectories (data, validation, utils, rateLimit).

export { 
  createGuestBooking,
  type GuestBookingData 
} from './booking/data/createGuestBooking';
export { getGuestBookingsByEmail } from './booking/data/getGuestBookingsByEmail';
export { linkGuestBookingsToUser } from './booking/data/linkGuestBookingsToUser';

// Re-exporting other related services for a consistent import path if needed,
// though direct imports from their specific files are also encouraged for clarity.
export { validateGuestBookingData } from './booking/validation/guestBookingValidationService';
export { checkRateLimit } from './booking/rateLimit/guestBookingRateLimitService';
export { sanitizeTextInput } from './booking/utils/guestBookingSanitizationService';
export { generateBookingReference } from './booking/utils/bookingReferenceService';

