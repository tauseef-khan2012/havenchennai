
-- Ensure RLS is enabled for pricing_rules and booking_analytics tables
-- It's safe to run these even if RLS is already enabled.
ALTER TABLE IF EXISTS public.pricing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.booking_analytics ENABLE ROW LEVEL SECURITY;

-- Policies for payments table
-- The existing SELECT policy "Users can view their payments" from migration 20250522_add_rls_policies.sql is assumed to be appropriate.
-- This policy allows authenticated users to insert payment records linked to their own bookings or experience_bookings.
DROP POLICY IF EXISTS "Users can insert payments for their own bookings" ON public.payments;
CREATE POLICY "Users can insert payments for their own bookings"
ON public.payments
FOR INSERT
TO authenticated
WITH CHECK (
  (payments.booking_id IS NOT NULL AND EXISTS (SELECT 1 FROM public.bookings b WHERE b.id = payments.booking_id AND b.user_id = auth.uid())) OR
  (payments.experience_booking_id IS NOT NULL AND EXISTS (SELECT 1 FROM public.experience_bookings eb WHERE eb.id = payments.experience_booking_id AND eb.user_id = auth.uid()))
);

-- Policies for payment_attempts table
-- The existing SELECT policy "Users can view their payment attempts" from migration 20250610092647-1ccedf68-d4d3-4e7c-a8cb-1252f844073b.sql is assumed to be appropriate.
-- This policy allows authenticated users to insert payment attempt records linked to their own bookings or experience_bookings.
DROP POLICY IF EXISTS "Users can insert payment attempts for their own bookings" ON public.payment_attempts;
CREATE POLICY "Users can insert payment attempts for their own bookings"
ON public.payment_attempts
FOR INSERT
TO authenticated
WITH CHECK (
  (payment_attempts.booking_id IS NOT NULL AND EXISTS (SELECT 1 FROM public.bookings b WHERE b.id = payment_attempts.booking_id AND b.user_id = auth.uid())) OR
  (payment_attempts.experience_booking_id IS NOT NULL AND EXISTS (SELECT 1 FROM public.experience_bookings eb WHERE eb.id = payment_attempts.experience_booking_id AND eb.user_id = auth.uid()))
);

-- Policies for pricing_rules table
-- This policy allows any authenticated user to view all pricing rules.
-- For stricter control, this should ideally be restricted to specific admin roles.
DROP POLICY IF EXISTS "Authenticated users can view pricing rules" ON public.pricing_rules;
CREATE POLICY "Authenticated users can view pricing rules"
ON public.pricing_rules
FOR SELECT
TO authenticated
USING (true);
-- Note: INSERT/UPDATE/DELETE policies for pricing_rules are intentionally omitted
-- as these operations should typically be restricted to admin users via different mechanisms.

-- Policies for booking_analytics table
-- This policy allows any user (authenticated or anonymous) to insert analytics data.
-- The `WITH CHECK (true)` means any insert operation that reaches RLS will pass this policy check.
DROP POLICY IF EXISTS "Allow insert for booking analytics" ON public.booking_analytics;
CREATE POLICY "Allow insert for booking analytics"
ON public.booking_analytics
FOR INSERT
WITH CHECK (true);

-- This policy allows authenticated users to view booking analytics records associated with their user_id.
DROP POLICY IF EXISTS "Users can view their own booking analytics" ON public.booking_analytics;
CREATE POLICY "Users can view their own booking analytics"
ON public.booking_analytics
FOR SELECT
TO authenticated
USING (booking_analytics.user_id = auth.uid());
-- Note: Access for admin roles to view all analytics would require a separate, more privileged policy.
