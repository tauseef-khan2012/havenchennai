
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
 * Simplified discount code validation
 */
export const validateDiscountCode = async (
  code: string,
  bookingDetails: BookingDetails
): Promise<DiscountApplication> => {
  try {
    console.log('Validating discount code:', code);
    
    const { data: discountCode, error } = await supabase
      .from('discount_codes')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .maybeSingle();

    if (error) {
      console.error('Error fetching discount code:', error);
      return {
        isValid: false,
        discountAmount: 0,
        reason: 'Error validating discount code'
      };
    }

    if (!discountCode) {
      return {
        isValid: false,
        discountAmount: 0,
        reason: 'Invalid discount code'
      };
    }

    // Check if discount code is still valid (date range)
    const now = new Date();
    const validFrom = new Date(discountCode.valid_from);
    const validUntil = discountCode.valid_until ? new Date(discountCode.valid_until) : null;

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
    if (discountCode.usage_limit && discountCode.used_count >= discountCode.usage_limit) {
      return {
        isValid: false,
        discountAmount: 0,
        reason: 'Discount code has reached its usage limit'
      };
    }

    // Check minimum amount requirement
    if (discountCode.minimum_amount && bookingDetails.subtotal < discountCode.minimum_amount) {
      return {
        isValid: false,
        discountAmount: 0,
        reason: `Minimum booking amount of ₹${discountCode.minimum_amount} required`
      };
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (discountCode.discount_type === 'percentage') {
      discountAmount = (bookingDetails.subtotal * discountCode.discount_value) / 100;
    } else if (discountCode.discount_type === 'fixed') {
      discountAmount = discountCode.discount_value;
    }

    // Apply maximum discount limit if specified
    if (discountCode.maximum_discount && discountAmount > discountCode.maximum_discount) {
      discountAmount = discountCode.maximum_discount;
    }

    // Ensure discount doesn't exceed subtotal
    discountAmount = Math.min(discountAmount, bookingDetails.subtotal);

    console.log('Discount validation successful:', { code, discountAmount });

    return {
      isValid: true,
      discountAmount,
      discountCode: code,
      code: code,
      discountType: discountCode.discount_type as 'percentage' | 'fixed',
      discountValue: discountCode.discount_value,
      discountPercentage: discountCode.discount_type === 'percentage' ? discountCode.discount_value : undefined
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
 * Simple apply discount function for compatibility
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
  
  return await validateDiscountCode(code, bookingDetails);
};
