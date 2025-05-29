
import { supabase } from '@/integrations/supabase/client';
import { UUID } from '@/types/booking';

export interface DiscountApplication {
  isValid: boolean;
  discountAmount: number;
  discountCode?: string;
  code?: string;
  discountType?: 'percentage' | 'fixed';
  discountValue?: number;
  discountPercentage?: number;
  reason?: string;
}

interface BookingDetails {
  propertyId: UUID;
  checkInDate: Date;
  checkOutDate: Date;
  numberOfGuests: number;
  subtotal: number;
}

/**
 * Applies a discount code to a booking
 */
export const applyDiscountCode = async (
  code: string,
  propertyId: UUID,
  checkInDate: Date,
  checkOutDate: Date,
  numberOfGuests: number,
  subtotal: number
): Promise<DiscountApplication> => {
  const bookingDetails: BookingDetails = {
    propertyId,
    checkInDate,
    checkOutDate,
    numberOfGuests,
    subtotal
  };
  
  const result = await validateDiscountCode(code, bookingDetails);
  
  // Add additional properties for UI display
  if (result.isValid) {
    result.code = code;
    result.discountCode = code;
    if (result.discountType === 'percentage' && result.discountValue) {
      result.discountPercentage = result.discountValue;
    }
  }
  
  return result;
};

/**
 * Validates a discount code against booking details
 */
export const validateDiscountCode = async (
  code: string,
  bookingDetails: BookingDetails
): Promise<DiscountApplication> => {
  try {
    const { data: discountCodes, error } = await supabase
      .from('discount_codes')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .single();

    if (error || !discountCodes) {
      return {
        isValid: false,
        discountAmount: 0,
        reason: 'Invalid discount code'
      };
    }

    // Check if discount code is still valid (date range)
    const now = new Date();
    const validFrom = new Date(discountCodes.valid_from);
    const validUntil = discountCodes.valid_until ? new Date(discountCodes.valid_until) : null;

    if (now < validFrom) {
      return {
        isValid: false,
        discountAmount: 0,
        reason: 'Discount code is not yet active'
      };
    }

    if (validUntil && now > validUntil) {
      return {
        isValid: false,
        discountAmount: 0,
        reason: 'Discount code has expired'
      };
    }

    // Check usage limit
    if (discountCodes.usage_limit && discountCodes.used_count >= discountCodes.usage_limit) {
      return {
        isValid: false,
        discountAmount: 0,
        reason: 'Discount code has reached its usage limit'
      };
    }

    // Check minimum amount requirement
    if (discountCodes.minimum_amount && bookingDetails.subtotal < discountCodes.minimum_amount) {
      return {
        isValid: false,
        discountAmount: 0,
        reason: `Minimum booking amount of ₹${discountCodes.minimum_amount} required`
      };
    }

    // Check if discount applies to this property
    if (discountCodes.applicable_to === 'specific_properties' && 
        discountCodes.property_ids && 
        !discountCodes.property_ids.includes(bookingDetails.propertyId)) {
      return {
        isValid: false,
        discountAmount: 0,
        reason: 'Discount code is not applicable to this property'
      };
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (discountCodes.discount_type === 'percentage') {
      discountAmount = (bookingDetails.subtotal * discountCodes.discount_value) / 100;
    } else if (discountCodes.discount_type === 'fixed') {
      discountAmount = discountCodes.discount_value;
    }

    // Apply maximum discount limit if specified
    if (discountCodes.maximum_discount && discountAmount > discountCodes.maximum_discount) {
      discountAmount = discountCodes.maximum_discount;
    }

    // Ensure discount doesn't exceed subtotal
    discountAmount = Math.min(discountAmount, bookingDetails.subtotal);

    return {
      isValid: true,
      discountAmount,
      discountCode: code,
      code: code,
      discountType: discountCodes.discount_type as 'percentage' | 'fixed',
      discountValue: discountCodes.discount_value,
      discountPercentage: discountCodes.discount_type === 'percentage' ? discountCodes.discount_value : undefined
    };

  } catch (error) {
    console.error('Error validating discount code:', error);
    return {
      isValid: false,
      discountAmount: 0,
      reason: 'Error validating discount code'
    };
  }
};

/**
 * Records the usage of a discount code
 */
export const recordDiscountUsage = async (
  code: string,
  bookingId: UUID
): Promise<boolean> => {
  try {
    // First, get the current used_count
    const { data: discountCode, error: fetchError } = await supabase
      .from('discount_codes')
      .select('used_count')
      .eq('code', code.toUpperCase())
      .single();

    if (fetchError || !discountCode) {
      console.error('Error fetching discount code:', fetchError);
      return false;
    }

    // Increment the used_count
    const { error: updateError } = await supabase
      .from('discount_codes')
      .update({ 
        used_count: (discountCode.used_count || 0) + 1
      })
      .eq('code', code.toUpperCase());

    if (updateError) {
      console.error('Error recording discount usage:', updateError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error recording discount usage:', error);
    return false;
  }
};

/**
 * Gets available discount codes for a property (for admin/marketing purposes)
 */
export const getAvailableDiscounts = async (
  propertyId?: UUID
): Promise<any[]> => {
  try {
    let query = supabase
      .from('discount_codes')
      .select('*')
      .eq('is_active', true);

    if (propertyId) {
      query = query.or(`applicable_to.eq.all,and(applicable_to.eq.specific_properties,property_ids.cs.{${propertyId}})`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching available discounts:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching available discounts:', error);
    return [];
  }
};
