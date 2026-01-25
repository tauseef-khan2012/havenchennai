-- Migration: Add atomic increment function for discount code usage
-- This prevents race conditions when multiple bookings use the same discount code simultaneously

CREATE OR REPLACE FUNCTION increment_discount_usage(discount_code TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Atomically increment the used_count for the given discount code
  UPDATE discount_codes
  SET used_count = COALESCE(used_count, 0) + 1
  WHERE code = UPPER(discount_code)
    AND is_active = true;

  -- Return true if a row was updated, false otherwise
  RETURN FOUND;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION increment_discount_usage(TEXT) TO authenticated;

COMMENT ON FUNCTION increment_discount_usage IS 'Atomically increments the usage count for a discount code to prevent race conditions';
