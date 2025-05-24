
import { supabase } from '@/integrations/supabase/client';
import { UUID } from '@/types/booking';

export interface PricingRule {
  rule_type: string;
  discount_percentage?: number;
  markup_percentage?: number;
  conditions: any;
  priority: number;
}

/**
 * Fetches applicable pricing rules
 */
export const getPricingRules = async (
  propertyId?: UUID,
  experienceId?: UUID
): Promise<PricingRule[]> => {
  try {
    let query = supabase
      .from('pricing_rules')
      .select('*')
      .eq('is_active', true)
      .order('priority', { ascending: false });

    if (propertyId) {
      query = query.or(`property_id.eq.${propertyId},property_id.is.null`);
    }
    if (experienceId) {
      query = query.or(`experience_id.eq.${experienceId},experience_id.is.null`);
    }

    const { data: rules, error } = await query;

    if (error) {
      console.error('Error fetching pricing rules:', error);
      return [];
    }

    return rules || [];
  } catch (error) {
    console.error('Error in getPricingRules:', error);
    return [];
  }
};
