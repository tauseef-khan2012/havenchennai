
import { supabase } from '@/integrations/supabase/client';
import { UUID } from '@/types/booking';

export interface DiscountCode {
  id: UUID;
  code: string;
  description?: string;
  discount_type: 'percentage' | 'fixed_amount';
  discount_value: number;
  minimum_amount: number;
  maximum_discount?: number;
  usage_limit?: number;
  used_count: number;
  valid_from: string;
  valid_until?: string;
  is_active: boolean;
  applicable_to: 'all' | 'properties' | 'experiences';
  property_ids?: UUID[];
  experience_ids?: UUID[];
}

export interface DiscountApplication {
  isValid: boolean;
  discountAmount: number;
  discountCode?: DiscountCode;
  errorMessage?: string;
}

/**
 * Validates and applies a discount code
 */
export const validateDiscountCode = async (
  code: string,
  bookingType: 'property' | 'experience',
  itemId: UUID,
  totalAmount: number
): Promise<DiscountApplication> => {
  try {
    const { data: discountCode, error } = await supabase
      .from('discount_codes')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .single();

    if (error || !discountCode) {
      return {
        isValid: false,
        discountAmount: 0,
        errorMessage: 'Invalid discount code'
      };
    }

    // Check if code is still valid
    const now = new Date();
    const validFrom = new Date(discountCode.valid_from);
    const validUntil = discountCode.valid_until ? new Date(discountCode.valid_until) : null;

    if (now < validFrom || (validUntil && now > validUntil)) {
      return {
        isValid: false,
        discountAmount: 0,
        errorMessage: 'Discount code has expired'
      };
    }

    // Check usage limit
    if (discountCode.usage_limit && discountCode.used_count >= discountCode.usage_limit) {
      return {
        isValid: false,
        discountAmount: 0,
        errorMessage: 'Discount code usage limit exceeded'
      };
    }

    // Check minimum amount
    if (totalAmount < discountCode.minimum_amount) {
      return {
        isValid: false,
        discountAmount: 0,
        errorMessage: `Minimum order amount of ₹${discountCode.minimum_amount} required`
      };
    }

    // Check applicability
    if (discountCode.applicable_to !== 'all') {
      if (bookingType === 'property' && discountCode.applicable_to !== 'properties') {
        return {
          isValid: false,
          discountAmount: 0,
          errorMessage: 'Discount code not applicable to properties'
        };
      }
      if (bookingType === 'experience' && discountCode.applicable_to !== 'experiences') {
        return {
          isValid: false,
          discountAmount: 0,
          errorMessage: 'Discount code not applicable to experiences'
        };
      }

      // Check specific property/experience IDs
      if (bookingType === 'property' && discountCode.property_ids && 
          !discountCode.property_ids.includes(itemId)) {
        return {
          isValid: false,
          discountAmount: 0,
          errorMessage: 'Discount code not applicable to this property'
        };
      }
      if (bookingType === 'experience' && discountCode.experience_ids && 
          !discountCode.experience_ids.includes(itemId)) {
        return {
          isValid: false,
          discountAmount: 0,
          errorMessage: 'Discount code not applicable to this experience'
        };
      }
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (discountCode.discount_type === 'percentage') {
      discountAmount = (totalAmount * discountCode.discount_value) / 100;
      if (discountCode.maximum_discount) {
        discountAmount = Math.min(discountAmount, discountCode.maximum_discount);
      }
    } else {
      discountAmount = discountCode.discount_value;
    }

    // Ensure discount doesn't exceed total amount
    discountAmount = Math.min(discountAmount, totalAmount);

    return {
      isValid: true,
      discountAmount,
      discountCode
    };
  } catch (error) {
    console.error('Error validating discount code:', error);
    return {
      isValid: false,
      discountAmount: 0,
      errorMessage: 'Error validating discount code'
    };
  }
};

/**
 * Increments the usage count of a discount code
 */
export const useDiscountCode = async (codeId: UUID): Promise<void> => {
  try {
    const { error } = await supabase
      .from('discount_codes')
      .update({ used_count: supabase.rpc('increment', { x: 1 }) })
      .eq('id', codeId);

    if (error) {
      console.error('Error updating discount code usage:', error);
    }
  } catch (error) {
    console.error('Error in useDiscountCode:', error);
  }
};
