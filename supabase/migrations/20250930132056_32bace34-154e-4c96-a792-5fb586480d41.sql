-- Phase 1 & 2: Fix critical security vulnerabilities in inquiries and booking_analytics tables

-- ============================================================================
-- FIX 1: Secure inquiries table - restrict PII access
-- ============================================================================

-- Drop overly permissive policy that allows anyone to view all inquiries
DROP POLICY IF EXISTS "Users can view their own inquiries" ON public.inquiries;

-- Create secure policy: users can only view inquiries they created (authenticated users)
CREATE POLICY "Users can view their own inquiries securely"
ON public.inquiries
FOR SELECT
TO authenticated
USING (
  (user_id IS NOT NULL AND auth.uid() = user_id) OR 
  (user_id IS NULL AND email = (auth.jwt()->>'email'))
);

-- Create secure policy: authenticated users can only view their own inquiries
CREATE POLICY "Authenticated users view own inquiries"
ON public.inquiries
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Keep the insert policy as-is (anyone can create inquiries - this is intentional for contact forms)
-- But add validation to ensure user_id is set correctly if authenticated
CREATE POLICY "Set user_id on insert if authenticated"
ON public.inquiries
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- ============================================================================
-- FIX 2: Strengthen booking_analytics security
-- ============================================================================

-- Drop overly permissive insert policy
DROP POLICY IF EXISTS "Allow insert for booking analytics" ON public.booking_analytics;

-- Create more restrictive insert policy with user context validation
CREATE POLICY "Users can insert their own analytics"
ON public.booking_analytics
FOR INSERT
TO authenticated
WITH CHECK (
  user_id IS NULL OR auth.uid() = user_id
);

-- Add policy for anonymous analytics (for guest bookings)
CREATE POLICY "Allow anonymous analytics for guest bookings"
ON public.booking_analytics
FOR INSERT
TO anon
WITH CHECK (
  user_id IS NULL AND 
  (booking_id IS NOT NULL OR experience_booking_id IS NOT NULL)
);

-- Improve SELECT policy to be more restrictive
DROP POLICY IF EXISTS "Users can view their own analytics" ON public.booking_analytics;
DROP POLICY IF EXISTS "Users can view their own booking analytics" ON public.booking_analytics;

CREATE POLICY "Users can view only their own analytics data"
ON public.booking_analytics
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id OR
  (booking_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM bookings b 
    WHERE b.id = booking_analytics.booking_id 
    AND b.user_id = auth.uid()
  )) OR
  (experience_booking_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM experience_bookings eb 
    WHERE eb.id = booking_analytics.experience_booking_id 
    AND eb.user_id = auth.uid()
  ))
);

-- ============================================================================
-- Security Comments
-- ============================================================================

COMMENT ON TABLE public.inquiries IS 'Customer inquiry data - users can only view their own inquiries to protect PII';
COMMENT ON TABLE public.booking_analytics IS 'Analytics data with strict user context validation to prevent data injection';