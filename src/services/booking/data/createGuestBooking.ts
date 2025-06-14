
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

// Comprehensive Zod schema for guest bookings input validation
export const guestBookingSchema = z.object({
  type: z.enum(['property', 'experience']),
  guestName: z.string().min(1, 'Name is required').max(100),
  guestEmail: z.string().email(),
  guestPhone: z.string().min(7, 'Phone is required').max(25),
  priceBreakdown: z.object({
    basePrice: z.number(),
    subtotalAfterDiscount: z.number(),
    discountAmount: z.number(),
    taxPercentage: z.number(),
    taxAmount: z.number(),
    totalAmountDue: z.number().min(0),
    currency: z.string(),
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
});

export type GuestBookingData = z.infer<typeof guestBookingSchema>;

// Simple booking reference generator (could be improved to make more robust)
function generateBookingReference(): string {
  // e.g. "BK-20240614-xxxxxx"
  const date = new Date();
  return (
    'BK-' +
    date.getFullYear().toString().slice(-2) +
    ('0' + (date.getMonth() + 1)).slice(-2) +
    ('0' + date.getDate()).slice(-2) +
    '-' +
    Math.random().toString(36).substr(2, 6).toUpperCase()
  );
}

// Enforce validation on all guest bookings
export const createGuestBooking = async (data: GuestBookingData) => {
  // Validate shape and basic rules
  const result = guestBookingSchema.safeParse(data);
  if (!result.success) {
    throw new Error(
      result.error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`).join('. ')
    );
  }

  // Generate booking reference
  const bookingReference = generateBookingReference();

  // Insert logic (property or experience)
  if (data.type === 'property') {
    const { error, data: booking } = await supabase
      .from('bookings')
      .insert([{
        guest_name: data.guestName,
        guest_email: data.guestEmail.trim().toLowerCase(),
        guest_phone: data.guestPhone,
        property_id: data.propertyId,
        check_in_date: data.checkInDate ? (typeof data.checkInDate === 'string'
          ? data.checkInDate
          : data.checkInDate.toISOString().slice(0, 10)) : undefined,
        check_out_date: data.checkOutDate ? (typeof data.checkOutDate === 'string'
          ? data.checkOutDate
          : data.checkOutDate.toISOString().slice(0, 10)) : undefined,
        number_of_guests: data.numberOfGuests,
        special_requests: data.specialRequests,
        total_amount_due: data.priceBreakdown.totalAmountDue,
        base_price_total: data.priceBreakdown.basePrice,
        currency: data.priceBreakdown.currency,
        booking_reference: bookingReference,
        booking_status: 'Pending Payment',
        payment_status: 'Unpaid',
      }])
      .select()
      .maybeSingle();
    if (error) throw new Error(error.message);
    return {
      ...booking,
      bookingReference
    };
  } else {
    // Insert for experience booking
    const { error, data: booking } = await supabase
      .from('experience_bookings')
      .insert([{
        guest_name: data.guestName,
        guest_email: data.guestEmail.trim().toLowerCase(),
        guest_phone: data.guestPhone,
        experience_instance_id: data.instanceId,
        number_of_attendees: data.numberOfAttendees,
        special_requests: data.specialRequests,
        total_amount_due: data.priceBreakdown.totalAmountDue,
        currency: data.priceBreakdown.currency,
        booking_reference: bookingReference,
        booking_status: 'Pending Payment',
        payment_status: 'Unpaid',
      }])
      .select()
      .maybeSingle();
    if (error) throw new Error(error.message);
    return {
      ...booking,
      bookingReference
    };
  }
};
