
import { supabase } from '@/integrations/supabase/client';
import { 
  UUID, 
  BookingType, 
  PriceBreakdown
} from '@/types/booking';

/**
 * Calculates the price breakdown for a property booking
 */
export const calculatePropertyBookingPrice = async (
  propertyId: UUID,
  checkInDate: Date,
  checkOutDate: Date,
  selectedAddonExperiences?: {instanceId: UUID, attendees: number}[]
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
    
    // Calculate addon experiences cost if any
    let addonExperiencesTotal = 0;
    
    if (selectedAddonExperiences && selectedAddonExperiences.length > 0) {
      const instanceIds = selectedAddonExperiences.map(addon => addon.instanceId);
      
      const { data: experienceInstances, error: experiencesError } = await supabase
        .from('experience_instances')
        .select(`
          id,
          price_per_person_override,
          flat_fee_price_override,
          experience:experience_id (
            price_per_person,
            flat_fee_price
          )
        `)
        .in('id', instanceIds);
      
      if (experiencesError) {
        console.error('Error fetching addon experiences:', experiencesError);
        throw new Error('Error calculating price: Could not fetch addon experiences');
      }
      
      if (experienceInstances) {
        for (const instance of experienceInstances) {
          const addon = selectedAddonExperiences.find(a => a.instanceId === instance.id);
          
          if (addon) {
            if (instance.flat_fee_price_override !== null) {
              // Use flat fee price override
              addonExperiencesTotal += instance.flat_fee_price_override;
            } else if (instance.experience?.flat_fee_price !== null) {
              // Use experience flat fee price
              addonExperiencesTotal += instance.experience.flat_fee_price;
            } else {
              // Use per person price (from override or experience)
              const pricePerPerson = instance.price_per_person_override ?? instance.experience?.price_per_person ?? 0;
              addonExperiencesTotal += pricePerPerson * addon.attendees;
            }
          }
        }
      }
    }
    
    // Calculate subtotal
    const subtotal = discountedBasePrice + cleaningFee + addonExperiencesTotal;
    
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
      addonExperiencesTotal: addonExperiencesTotal > 0 ? addonExperiencesTotal : undefined,
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
    selectedAddonExperiences?: {instanceId: UUID, attendees: number}[];
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
        bookingDetails.checkOutDate,
        bookingDetails.selectedAddonExperiences
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
 * Calculates the number of nights between two dates
 */
const calculateNights = (checkInDate: Date, checkOutDate: Date): number => {
  const differenceInTime = checkOutDate.getTime() - checkInDate.getTime();
  return Math.ceil(differenceInTime / (1000 * 3600 * 24));
};
