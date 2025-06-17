
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';
import { secureContactSchema, validateBookingAmount } from '@/services/security/inputSanitization';

// Enhanced Zod schema for guest bookings with security validation
export const guestBookingSchema = z.object({
  type: z.enum(['property', 'experience']),
  guestName: z.string().min(1, 'Name is required').max(100),
  guestEmail: z.string().email(),
  guestPhone: z.string().min(7, 'Phone is required').max(25),
  priceBreakdown: z.object({
    basePrice: z.number().min(0),
    subtotalAfterDiscount: z.number().min(0),
    discountAmount: z.number().min(0),
    taxPercentage: z.number().min(0).max(100),
    taxAmount: z.number().min(0),
    totalAmountDue: z.number().min(0).max(1000000), // Max 10 lakh INR
    currency: z.enum(['INR', 'USD']),
  }),
  // Property fields (for stay bookings)
  propertyId: z.string().uuid().optional(),
  checkInDate: z.coerce.date().optional(),
  checkOutDate: z.coerce.date().optional(),
  numberOfGuests: z.number().int().min(1).max(15).optional(),
  specialRequests: z.string().max(500).optional(),
  // Experience booking fields
  instanceId: z.string().uuid().optional(),
  numberOfAttendees: z.number().int().min(1).max(25).optional()
}).refine(data => {
  // Enhanced date validation
  if (data.type === 'property' && data.checkInDate && data.checkOutDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (data.checkInDate < today) return false;
    if (data.checkInDate >= data.checkOutDate) return false;
    
    // Max 2 years advance booking
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 2);
    if (data.checkInDate > maxDate) return false;
  }
  return true;
}, {
  message: 'Invalid booking dates'
});

export type GuestBookingData = z.infer<typeof guestBookingSchema>;

// Enhanced booking reference generator
function generateBookingReference(): string {
  const date = new Date();
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  
  return (
    'BK-' +
    date.getFullYear().toString().slice(-2) +
    ('0' + (date.getMonth() + 1)).slice(-2) +
    ('0' + date.getDate()).slice(-2) +
    '-' +
    timestamp.slice(-4).toUpperCase() +
    random
  );
}

// Rate limiting tracking
const bookingAttempts = new Map<string, number[]>();

function checkBookingRateLimit(email: string): boolean {
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;
  const attempts = bookingAttempts.get(email) || [];
  
  // Clean old attempts
  const recentAttempts = attempts.filter(timestamp => now - timestamp < oneHour);
  
  // Check if exceeded limit (3 bookings per hour)
  if (recentAttempts.length >= 3) {
    return false;
  }
  
  // Record this attempt
  recentAttempts.push(now);
  bookingAttempts.set(email, recentAttempts);
  
  return true;
}

// Enhanced validation on all guest bookings
export const createGuestBooking = async (data: GuestBookingData) => {
  // Validate shape and basic rules
  const result = guestBookingSchema.safeParse(data);
  if (!result.success) {
    throw new Error(
      result.error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`).join('. ')
    );
  }

  // Additional security validation
  const contactValidation = secureContactSchema.safeParse({
    guestName: data.guestName,
    guestEmail: data.guestEmail,
    guestPhone: data.guestPhone,
    specialRequests: data.specialRequests
  });

  if (!contactValidation.success) {
    throw new Error('Invalid contact information provided');
  }

  // Validate booking amount
  const amountValidation = validateBookingAmount(data.priceBreakdown.totalAmountDue);
  if (!amountValidation.isValid) {
    throw new Error(amountValidation.error);
  }

  // Rate limiting check
  if (!checkBookingRateLimit(data.guestEmail)) {
    throw new Error('Too many booking attempts. Please try again later.');
  }

  // Use sanitized data
  const sanitizedData = contactValidation.data;
  const bookingReference = generateBookingReference();

  // Insert logic (property or experience)
  if (data.type === 'property') {
    const { error, data: booking } = await supabase
      .from('bookings')
      .insert([{
        guest_name: sanitizedData.guestName,
        guest_email: sanitizedData.guestEmail,
        guest_phone: sanitizedData.guestPhone,
        property_id: data.propertyId,
        check_in_date: data.checkInDate ? (typeof data.checkInDate === 'string'
          ? data.checkInDate
          : data.checkInDate.toISOString().slice(0, 10)) : undefined,
        check_out_date: data.checkOutDate ? (typeof data.checkOutDate === 'string'
          ? data.checkOutDate
          : data.checkOutDate.toISOString().slice(0, 10)) : undefined,
        number_of_guests: data.numberOfGuests,
        special_requests: sanitizedData.specialRequests,
        total_amount_due: data.priceBreakdown.totalAmountDue,
        base_price_total: data.priceBreakdown.basePrice,
        currency: data.priceBreakdown.currency,
        booking_reference: bookingReference,
        booking_status: 'Pending Payment',
        payment_status: 'Unpaid',
      }])
      .select()
      .maybeSingle();
      
    if (error) throw new Error('Failed to create booking. Please try again.');
    return {
      ...booking,
      bookingReference
    };
  } else {
    // Insert for experience booking
    const { error, data: booking } = await supabase
      .from('experience_bookings')
      .insert([{
        guest_name: sanitizedData.guestName,
        guest_email: sanitizedData.guestEmail,
        guest_phone: sanitizedData.guestPhone,
        experience_instance_id: data.instanceId,
        number_of_attendees: data.numberOfAttendees,
        special_requests: sanitizedData.specialRequests,
        total_amount_due: data.priceBreakdown.totalAmountDue,
        currency: data.priceBreakdown.currency,
        booking_reference: bookingReference,
        booking_status: 'Pending Payment',
        payment_status: 'Unpaid',
      }])
      .select()
      .maybeSingle();
      
    if (error) throw new Error('Failed to create booking. Please try again.');
    return {
      ...booking,
      bookingReference
    };
  }
};
