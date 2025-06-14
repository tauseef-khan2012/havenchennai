
-- Phase 1: Guest Booking Security

-- 1. Add/select RLS policies for public access (minimal public read for property/experience lookups is already handled via published columns)
-- 2. Restrict guest booking access:
--    - Only the matching guest email (with verified code) or the user (user_id) can update/read their booking.
--    - For now, provide SELECT/UPDATE/DELETE to user_id and restrict by guest_email for guest/anonymous bookings.

-- BOOKINGS TABLE

DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;
CREATE POLICY "Users and guests can view their own bookings"
ON public.bookings
FOR SELECT
USING (
  (user_id IS NOT NULL AND auth.uid() = user_id)
  OR
  (user_id IS NULL AND guest_email = current_setting('request.jwt.claims', true)::json->>'email')
);

DROP POLICY IF EXISTS "Users can insert their own bookings" ON public.bookings;
CREATE POLICY "Users and guests can insert bookings"
ON public.bookings
FOR INSERT
WITH CHECK (
  (user_id IS NOT NULL AND auth.uid() = user_id)
  OR
  (user_id IS NULL AND guest_email IS NOT NULL AND guest_name IS NOT NULL AND guest_phone IS NOT NULL)
);

DROP POLICY IF EXISTS "Users can update their own bookings" ON public.bookings;
CREATE POLICY "Users and guests can update their own bookings"
ON public.bookings
FOR UPDATE
USING (
  (user_id IS NOT NULL AND auth.uid() = user_id)
  OR
  (user_id IS NULL AND guest_email = current_setting('request.jwt.claims', true)::json->>'email')
);

DROP POLICY IF EXISTS "Users can delete their own bookings" ON public.bookings;
CREATE POLICY "Users and guests can delete their own bookings"
ON public.bookings
FOR DELETE
USING (
  (user_id IS NOT NULL AND auth.uid() = user_id)
  OR
  (user_id IS NULL AND guest_email = current_setting('request.jwt.claims', true)::json->>'email')
);

-- EXPERIENCE BOOKINGS TABLE
DROP POLICY IF EXISTS "Users can view their experience bookings" ON public.experience_bookings;
CREATE POLICY "Users and guests can view their own experience bookings"
ON public.experience_bookings
FOR SELECT
USING (
  (user_id IS NOT NULL AND auth.uid() = user_id)
  OR
  (user_id IS NULL AND guest_email = current_setting('request.jwt.claims', true)::json->>'email')
);

DROP POLICY IF EXISTS "Users can insert their experience bookings" ON public.experience_bookings;
CREATE POLICY "Users and guests can insert experience bookings"
ON public.experience_bookings
FOR INSERT
WITH CHECK (
  (user_id IS NOT NULL AND auth.uid() = user_id)
  OR
  (user_id IS NULL AND guest_email IS NOT NULL AND guest_name IS NOT NULL AND guest_phone IS NOT NULL)
);

DROP POLICY IF EXISTS "Users can update their experience bookings" ON public.experience_bookings;
CREATE POLICY "Users and guests can update their own experience bookings"
ON public.experience_bookings
FOR UPDATE
USING (
  (user_id IS NOT NULL AND auth.uid() = user_id)
  OR
  (user_id IS NULL AND guest_email = current_setting('request.jwt.claims', true)::json->>'email')
);

DROP POLICY IF EXISTS "Users can delete their experience bookings" ON public.experience_bookings;
CREATE POLICY "Users and guests can delete their own experience bookings"
ON public.experience_bookings
FOR DELETE
USING (
  (user_id IS NOT NULL AND auth.uid() = user_id)
  OR
  (user_id IS NULL AND guest_email = current_setting('request.jwt.claims', true)::json->>'email')
);

-- BOOKING GUESTS TABLE (linked by booking; only booking owner can view/manage guest records)
DROP POLICY IF EXISTS "Users can view their booking guests" ON public.booking_guests;
CREATE POLICY "Users and guests can view their booking guests"
ON public.booking_guests
FOR SELECT
USING (
  (SELECT user_id FROM public.bookings WHERE id = booking_id) = auth.uid()
  OR
  (SELECT guest_email FROM public.bookings WHERE id = booking_id) = current_setting('request.jwt.claims', true)::json->>'email'
);

DROP POLICY IF EXISTS "Users can insert their booking guests" ON public.booking_guests;
CREATE POLICY "Users and guests can insert their booking guests"
ON public.booking_guests
FOR INSERT
WITH CHECK (
  (SELECT user_id FROM public.bookings WHERE id = booking_id) = auth.uid()
  OR
  (SELECT guest_email FROM public.bookings WHERE id = booking_id) = current_setting('request.jwt.claims', true)::json->>'email'
);

DROP POLICY IF EXISTS "Users can update their booking guests" ON public.booking_guests;
CREATE POLICY "Users and guests can update their booking guests"
ON public.booking_guests
FOR UPDATE
USING (
  (SELECT user_id FROM public.bookings WHERE id = booking_id) = auth.uid()
  OR
  (SELECT guest_email FROM public.bookings WHERE id = booking_id) = current_setting('request.jwt.claims', true)::json->>'email'
);

DROP POLICY IF EXISTS "Users can delete their booking guests" ON public.booking_guests;
CREATE POLICY "Users and guests can delete their booking guests"
ON public.booking_guests
FOR DELETE
USING (
  (SELECT user_id FROM public.bookings WHERE id = booking_id) = auth.uid()
  OR
  (SELECT guest_email FROM public.bookings WHERE id = booking_id) = current_setting('request.jwt.claims', true)::json->>'email'
);

-- FINAL NOTE:
-- The above policies leverage email claim from JWT for guest access.
-- If you support anonymous bookings or bookings with email entered at lookup time, consider a view/login/OTP-based lookup instead for more secure flows.
