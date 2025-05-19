
import { supabase } from '@/integrations/supabase/client';
import { 
  UUID, 
  BookingType, 
  PriceBreakdown, 
  BookingData,
  PropertyBookingDetails,
  ExperienceBookingDetails,
  GuestInfo
} from '@/types/booking';
import { generateBookingReference, calculateNights, applyDiscount, calculateTax } from '@/utils/bookingUtils';

/**
 * Checks if a property is available for the specified dates
 */
export const checkPropertyAvailability = async (
  propertyId: UUID, 
  checkInDate: Date, 
  checkOutDate: Date
): Promise<boolean> => {
  try {
    // Format dates for Supabase query
    const formattedCheckIn = checkInDate.toISOString().split('T')[0];
    const formattedCheckOut = checkOutDate.toISOString().split('T')[0];

    // Query bookings that overlap with requested dates
    const { data: overlappingBookings, error } = await supabase
      .from('bookings')
      .select('id')
      .eq('property_id', propertyId)
      .in('booking_status', ['Confirmed', 'Checked-In', 'Pending Payment'])
      .or(`check_in_date,lte.${formattedCheckOut},check_out_date,gte.${formattedCheckIn}`);

    if (error) {
      console.error('Error checking property availability:', error);
      throw new Error(`Error checking availability: ${error.message}`);
    }

    // Property is available if no overlapping bookings exist
    return !overlappingBookings || overlappingBookings.length === 0;
  } catch (error) {
    console.error('Error in checkPropertyAvailability:', error);
    throw error;
  }
};

/**
 * Checks if an experience instance has enough capacity for the requested attendees
 */
export const checkExperienceInstanceAvailability = async (
  instanceId: UUID, 
  numberOfAttendees: number
): Promise<boolean> => {
  try {
    // Query the experience instance
    const { data: instance, error } = await supabase
      .from('experience_instances')
      .select('max_capacity, current_attendees')
      .eq('id', instanceId)
      .single();

    if (error) {
      console.error('Error checking experience instance availability:', error);
      throw new Error(`Error checking experience availability: ${error.message}`);
    }

    if (!instance) {
      throw new Error('Experience instance not found');
    }

    // Check if there's enough capacity
    return (instance.current_attendees + numberOfAttendees) <= instance.max_capacity;
  } catch (error) {
    console.error('Error in checkExperienceInstanceAvailability:', error);
    throw error;
  }
};

/**
 * Calculates the price breakdown for a property booking
 */
export const calculatePropertyBookingPrice = async (
  propertyId: UUID,
  checkInDate: Date,
  checkOutDate: Date
): Promise<PriceBreakdown> => {
  try {
    // Get property details
    const { data: property, error } = await supabase
      .from('properties')
      .select('base_price_per_night, cleaning_fee, currency')
      .eq('id', propertyId)
      .single();

    if (error || !property) {
      console.error('Error fetching property details:', error);
      throw new Error('Error calculating price: Property not found');
    }

    // Constants
    const DISCOUNT_PERCENTAGE = 20;
    const TAX_PERCENTAGE = 5;
    
    // Calculate number of nights
    const nights = calculateNights(checkInDate, checkOutDate);
    
    // Original base price (before discount)
    const originalBasePrice = property.base_price_per_night * nights;
    
    // Apply 20% discount to base price
    const discountAmount = (originalBasePrice * DISCOUNT_PERCENTAGE) / 100;
    const discountedBasePrice = originalBasePrice - discountAmount;
    
    // Add cleaning fee
    const cleaningFee = property.cleaning_fee || 0;
    const subtotal = discountedBasePrice + cleaningFee;
    
    // Apply 5% tax
    const taxAmount = (subtotal * TAX_PERCENTAGE) / 100;
    
    // Calculate total
    const totalAmountDue = subtotal + taxAmount;

    return {
      basePrice: originalBasePrice,
      discountPercentage: DISCOUNT_PERCENTAGE,
      discountAmount,
      subtotalAfterDiscount: discountedBasePrice,
      taxPercentage: TAX_PERCENTAGE,
      taxAmount,
      cleaningFee,
      totalAmountDue,
      currency: property.currency
    };
  } catch (error) {
    console.error('Error in calculatePropertyBookingPrice:', error);
    throw error;
  }
};

/**
 * Calculates the price breakdown for an experience booking
 */
export const calculateExperienceBookingPrice = async (
  instanceId: UUID,
  numberOfAttendees: number
): Promise<PriceBreakdown> => {
  try {
    // Get experience instance details with its related experience
    const { data: instance, error: instanceError } = await supabase
      .from('experience_instances')
      .select(`
        id,
        price_per_person_override, 
        flat_fee_price_override,
        experience:experience_id (
          price_per_person,
          flat_fee_price,
          currency
        )
      `)
      .eq('id', instanceId)
      .single();

    if (instanceError || !instance) {
      console.error('Error fetching experience instance:', instanceError);
      throw new Error('Error calculating price: Experience instance not found');
    }

    // Constants
    const TAX_PERCENTAGE = 5;
    
    // Determine pricing model and price
    const useFlatFee = instance.flat_fee_price_override !== null || 
                        (instance.experience?.flat_fee_price !== null && instance.price_per_person_override === null);
    
    let subtotal = 0;
    
    if (useFlatFee) {
      // Use flat fee price (from instance override or experience)
      subtotal = instance.flat_fee_price_override ?? instance.experience?.flat_fee_price ?? 0;
    } else {
      // Use per person price (from instance override or experience)
      const pricePerPerson = instance.price_per_person_override ?? instance.experience?.price_per_person ?? 0;
      subtotal = pricePerPerson * numberOfAttendees;
    }
    
    // Apply 5% tax
    const taxAmount = (subtotal * TAX_PERCENTAGE) / 100;
    
    // Calculate total
    const totalAmountDue = subtotal + taxAmount;

    return {
      basePrice: subtotal,
      discountAmount: 0,
      subtotalAfterDiscount: subtotal,
      taxPercentage: TAX_PERCENTAGE,
      taxAmount,
      totalAmountDue,
      currency: instance.experience?.currency || 'INR'
    };
  } catch (error) {
    console.error('Error in calculateExperienceBookingPrice:', error);
    throw error;
  }
};

/**
 * Calculates the price for a booking based on type
 */
export const calculateBookingPrice = async (
  bookingDetails: {
    type: BookingType;
    propertyId?: UUID;
    instanceId?: UUID;
    checkInDate?: Date;
    checkOutDate?: Date;
    numberOfAttendees?: number;
  }
): Promise<PriceBreakdown> => {
  try {
    if (bookingDetails.type === 'property') {
      if (!bookingDetails.propertyId || !bookingDetails.checkInDate || !bookingDetails.checkOutDate) {
        throw new Error('Missing required details for property booking price calculation');
      }
      
      return calculatePropertyBookingPrice(
        bookingDetails.propertyId,
        bookingDetails.checkInDate,
        bookingDetails.checkOutDate
      );
    } else if (bookingDetails.type === 'experience') {
      if (!bookingDetails.instanceId || !bookingDetails.numberOfAttendees) {
        throw new Error('Missing required details for experience booking price calculation');
      }
      
      return calculateExperienceBookingPrice(
        bookingDetails.instanceId,
        bookingDetails.numberOfAttendees
      );
    } else {
      throw new Error('Invalid booking type');
    }
  } catch (error) {
    console.error('Error in calculateBookingPrice:', error);
    throw error;
  }
};

/**
 * Creates a property booking in the database
 */
export const createPropertyBooking = async (
  userId: UUID,
  propertyDetails: PropertyBookingDetails,
  priceBreakdown: PriceBreakdown,
  guests?: GuestInfo[],
  sourcePlatform?: string,
  sourceBookingId?: string
): Promise<{ bookingId: UUID, bookingReference: string }> => {
  // Generate booking reference
  const bookingReference = generateBookingReference();
  
  try {
    // Start a transaction
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        user_id: userId,
        property_id: propertyDetails.propertyId,
        check_in_date: propertyDetails.checkInDate.toISOString(),
        check_out_date: propertyDetails.checkOutDate.toISOString(),
        number_of_guests: propertyDetails.numberOfGuests,
        base_price_total: priceBreakdown.basePrice,
        cleaning_fee_total: priceBreakdown.cleaningFee || 0,
        taxes_total: priceBreakdown.taxAmount,
        discounts_total: priceBreakdown.discountAmount,
        total_amount_due: priceBreakdown.totalAmountDue,
        booking_reference: bookingReference,
        special_requests: propertyDetails.specialRequests,
        customer_notes: propertyDetails.customerNotes,
        currency: priceBreakdown.currency,
        booking_status: 'Pending Payment',
        payment_status: 'Unpaid',
        source_platform: sourcePlatform,
        source_booking_id: sourceBookingId
      })
      .select('id')
      .single();

    if (bookingError) {
      console.error('Error creating property booking:', bookingError);
      throw new Error(`Failed to create booking: ${bookingError.message}`);
    }

    // If guests information is provided, add it to the booking_guests table
    if (guests && guests.length > 0 && booking) {
      const guestsToInsert = guests.map(guest => ({
        booking_id: booking.id,
        guest_name: guest.name,
        guest_age: guest.age
      }));

      const { error: guestsError } = await supabase
        .from('booking_guests')
        .insert(guestsToInsert);

      if (guestsError) {
        console.error('Error adding guest information:', guestsError);
        // Continue despite guest info error, as the main booking was created
      }
    }

    if (!booking) {
      throw new Error('Failed to create booking - no data returned');
    }

    return {
      bookingId: booking.id,
      bookingReference
    };
  } catch (error) {
    console.error('Error in createPropertyBooking:', error);
    throw error;
  }
};

/**
 * Creates an experience booking in the database
 */
export const createExperienceBooking = async (
  userId: UUID,
  experienceDetails: ExperienceBookingDetails,
  priceBreakdown: PriceBreakdown,
  sourcePlatform?: string,
  sourceBookingId?: string
): Promise<{ bookingId: UUID, bookingReference: string }> => {
  // Generate booking reference
  const bookingReference = generateBookingReference();
  
  try {
    // Create the booking
    const { data: booking, error: bookingError } = await supabase
      .from('experience_bookings')
      .insert({
        user_id: userId,
        experience_instance_id: experienceDetails.instanceId,
        number_of_attendees: experienceDetails.numberOfAttendees,
        total_amount_due: priceBreakdown.totalAmountDue,
        booking_reference: bookingReference,
        special_requests: experienceDetails.specialRequests,
        currency: priceBreakdown.currency,
        booking_status: 'Pending Payment',
        payment_status: 'Unpaid',
        source_platform: sourcePlatform,
        source_booking_id: sourceBookingId
      })
      .select('id')
      .single();

    if (bookingError) {
      console.error('Error creating experience booking:', bookingError);
      throw new Error(`Failed to create experience booking: ${bookingError.message}`);
    }

    if (!booking) {
      throw new Error('Failed to create experience booking - no data returned');
    }

    // Update the current_attendees in the experience_instance
    const { error: updateError } = await supabase.rpc('increment_experience_attendees', {
      instance_id: experienceDetails.instanceId,
      attendees_count: experienceDetails.numberOfAttendees
    });

    if (updateError) {
      console.error('Error updating experience instance attendees:', updateError);
      // Consider rolling back the booking here if capacity update fails
      throw new Error(`Failed to update experience capacity: ${updateError.message}`);
    }

    return {
      bookingId: booking.id,
      bookingReference
    };
  } catch (error) {
    console.error('Error in createExperienceBooking:', error);
    throw error;
  }
};

/**
 * Creates a booking based on the booking type
 */
export const createBooking = async (
  bookingData: BookingData
): Promise<{ bookingId: UUID, bookingReference: string }> => {
  try {
    if (bookingData.type === 'property') {
      if (!bookingData.property) {
        throw new Error('Missing property booking details');
      }
      
      return await createPropertyBooking(
        bookingData.userId,
        bookingData.property,
        bookingData.priceBreakdown,
        bookingData.guests,
        bookingData.sourcePlatform,
        bookingData.sourceBookingId
      );
    } else if (bookingData.type === 'experience') {
      if (!bookingData.experience) {
        throw new Error('Missing experience booking details');
      }
      
      return await createExperienceBooking(
        bookingData.userId,
        bookingData.experience,
        bookingData.priceBreakdown,
        bookingData.sourcePlatform,
        bookingData.sourceBookingId
      );
    } else {
      throw new Error('Invalid booking type');
    }
  } catch (error) {
    console.error('Error in createBooking:', error);
    throw error;
  }
};

/**
 * Gets a booking by ID
 */
export const getBookingById = async (
  bookingId: UUID, 
  bookingType: BookingType
): Promise<any> => {
  try {
    let table, query;
    
    if (bookingType === 'property') {
      table = 'bookings';
      query = supabase
        .from(table)
        .select(`
          *,
          property:property_id (name, type, image_urls),
          user:user_id (email, full_name, phone_number),
          guests:booking_guests (guest_name, guest_age)
        `)
        .eq('id', bookingId)
        .single();
    } else {
      table = 'experience_bookings';
      query = supabase
        .from(table)
        .select(`
          *,
          instance:experience_instance_id (
            date, 
            time,
            experience:experience_id (name, type, image_urls)
          ),
          user:user_id (email, full_name, phone_number)
        `)
        .eq('id', bookingId)
        .single();
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error(`Error fetching ${bookingType} booking:`, error);
      throw new Error(`Failed to get booking: ${error.message}`);
    }
    
    return data;
  } catch (error) {
    console.error('Error in getBookingById:', error);
    throw error;
  }
};

/**
 * Updates a booking status
 */
export const updateBookingStatus = async (
  bookingId: UUID,
  bookingType: BookingType,
  status: string
): Promise<void> => {
  try {
    const table = bookingType === 'property' ? 'bookings' : 'experience_bookings';
    
    const { error } = await supabase
      .from(table)
      .update({ booking_status: status })
      .eq('id', bookingId);
    
    if (error) {
      console.error(`Error updating ${bookingType} booking status:`, error);
      throw new Error(`Failed to update booking status: ${error.message}`);
    }
  } catch (error) {
    console.error('Error in updateBookingStatus:', error);
    throw error;
  }
};

/**
 * Updates a booking payment status
 */
export const updateBookingPaymentStatus = async (
  bookingId: UUID,
  bookingType: BookingType,
  paymentStatus: string
): Promise<void> => {
  try {
    const table = bookingType === 'property' ? 'bookings' : 'experience_bookings';
    
    const { error } = await supabase
      .from(table)
      .update({ payment_status: paymentStatus })
      .eq('id', bookingId);
    
    if (error) {
      console.error(`Error updating ${bookingType} payment status:`, error);
      throw new Error(`Failed to update payment status: ${error.message}`);
    }
  } catch (error) {
    console.error('Error in updateBookingPaymentStatus:', error);
    throw error;
  }
};
