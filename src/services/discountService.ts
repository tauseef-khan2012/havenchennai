
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

    // Cast to proper type
    const typedDiscountCode = discountCode as unknown as DiscountCode;

    // Check if code is still valid
    const now = new Date();
    const validFrom = new Date(typedDiscountCode.valid_from);
    const validUntil = typedDiscountCode.valid_until ? new Date(typedDiscountCode.valid_until) : null;

    if (now < validFrom || (validUntil && now > validUntil)) {
      return {
        isValid: false,
        discountAmount: 0,
        errorMessage: 'Discount code has expired'
      };
    }

    // Check usage limit
    if (typedDiscountCode.usage_limit && typedDiscountCode.used_count >= typedDiscountCode.usage_limit) {
      return {
        isValid: false,
        discountAmount: 0,
        errorMessage: 'Discount code usage limit exceeded'
      };
    }

    // Check minimum amount
    if (totalAmount < typedDiscountCode.minimum_amount) {
      return {
        isValid: false,
        discountAmount: 0,
        errorMessage: `Minimum order amount of ₹${typedDiscountCode.minimum_amount} required`
      };
    }

    // Check applicability
    if (typedDiscountCode.applicable_to !== 'all') {
      if (bookingType === 'property' && typedDiscountCode.applicable_to !== 'properties') {
        return {
          isValid: false,
          discountAmount: 0,
          errorMessage: 'Discount code not applicable to properties'
        };
      }
      if (bookingType === 'experience' && typedDiscountCode.applicable_to !== 'experiences') {
        return {
          isValid: false,
          discountAmount: 0,
          errorMessage: 'Discount code not applicable to experiences'
        };
      }

      // Check specific property/experience IDs
      if (bookingType === 'property' && typedDiscountCode.property_ids && 
          !typedDiscountCode.property_ids.includes(itemId)) {
        return {
          isValid: false,
          discountAmount: 0,
          errorMessage: 'Discount code not applicable to this property'
        };
      }
      if (bookingType === 'experience' && typedDiscountCode.experience_ids && 
          !typedDiscountCode.experience_ids.includes(itemId)) {
        return {
          isValid: false,
          discountAmount: 0,
          errorMessage: 'Discount code not applicable to this experience'
        };
      }
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (typedDiscountCode.discount_type === 'percentage') {
      discountAmount = (totalAmount * typedDiscountCode.discount_value) / 100;
      if (typedDiscountCode.maximum_discount) {
        discountAmount = Math.min(discountAmount, typedDiscountCode.maximum_discount);
      }
    } else {
      discountAmount = typedDiscountCode.discount_value;
    }

    // Ensure discount doesn't exceed total amount
    discountAmount = Math.min(discountAmount, totalAmount);

    return {
      isValid: true,
      discountAmount,
      discountCode: typedDiscountCode
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
    // Get current usage count
    const { data: currentCode, error: fetchError } = await supabase
      .from('discount_codes')
      .select('used_count')
      .eq('id', codeId)
      .single();

    if (fetchError || !currentCode) {
      console.error('Error fetching current discount code:', fetchError);
      return;
    }

    // Update with incremented count
    const { error: updateError } = await supabase
      .from('discount_codes')
      .update({ used_count: currentCode.used_count + 1 })
      .eq('id', codeId);

    if (updateError) {
      console.error('Error updating discount code usage:', updateError);
    }
  } catch (error) {
    console.error('Error in useDiscountCode:', error);
  }
};
