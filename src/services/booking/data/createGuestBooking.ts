
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

// Enforce validation on all guest bookings
export const createGuestBooking = async (data: GuestBookingData) => {
  // Validate shape and basic rules
  const result = guestBookingSchema.safeParse(data);
  if (!result.success) {
    throw new Error(
      result.error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`).join('. ')
    );
  }

  // Insert logic (property or experience)
  if (data.type === 'property') {
    const { error, data: booking } = await supabase
      .from('bookings')
      .insert({
        guest_name: data.guestName,
        guest_email: data.guestEmail.trim().toLowerCase(),
        guest_phone: data.guestPhone,
        property_id: data.propertyId,
        check_in_date: data.checkInDate,
        check_out_date: data.checkOutDate,
        number_of_guests: data.numberOfGuests,
        special_requests: data.specialRequests,
        total_amount_due: data.priceBreakdown.totalAmountDue,
        base_price_total: data.priceBreakdown.basePrice,
        currency: data.priceBreakdown.currency
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return booking;
  } else {
    // Insert for experience booking
    const { error, data: booking } = await supabase
      .from('experience_bookings')
      .insert({
        guest_name: data.guestName,
        guest_email: data.guestEmail.trim().toLowerCase(),
        guest_phone: data.guestPhone,
        experience_instance_id: data.instanceId,
        number_of_attendees: data.numberOfAttendees,
        special_requests: data.specialRequests,
        total_amount_due: data.priceBreakdown.totalAmountDue,
        currency: data.priceBreakdown.currency
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return booking;
  }
};
