-- Fix critical security vulnerability in bookings table
-- Remove overly permissive policies that don't verify email ownership

-- Drop the dangerous policies that allow unrestricted access to guest bookings
DROP POLICY IF EXISTS "Allow guest bookings" ON public.bookings;
DROP POLICY IF EXISTS "Allow updating guest bookings by email" ON public.bookings;
DROP POLICY IF EXISTS "Allow viewing guest bookings by email" ON public.bookings;

-- The secure policies remain in place:
-- 1. "Users and guests can view their own bookings" - properly checks auth.uid() OR JWT email claim
-- 2. "Users and guests can insert bookings" - properly validates user ownership
-- 3. "Users and guests can update their own bookings" - properly checks ownership
-- 4. "Users and guests can delete their own bookings" - properly checks ownership

-- These secure policies ensure:
-- - Authenticated users can only access their own bookings (auth.uid() = user_id)
-- - Guest bookings are only accessible when the JWT email claim matches guest_email
-- - No one can view/modify bookings without proper authentication

COMMENT ON TABLE public.bookings IS 'Customer booking data with strict RLS - guests can only access via authenticated JWT email claim';