
-- Drop existing policies if they exist and recreate them with correct permissions
DROP POLICY IF EXISTS "Users can view their booking guests" ON public.booking_guests;
DROP POLICY IF EXISTS "Users can insert their booking guests" ON public.booking_guests;
DROP POLICY IF EXISTS "Users can update their booking guests" ON public.booking_guests;
DROP POLICY IF EXISTS "Users can view their payments" ON public.payments;

-- Add missing RLS policies for bookings table (only if they don't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'bookings' 
        AND policyname = 'Users can insert their own bookings'
    ) THEN
        CREATE POLICY "Users can insert their own bookings" 
        ON public.bookings 
        FOR INSERT 
        WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'bookings' 
        AND policyname = 'Users can update their own bookings'
    ) THEN
        CREATE POLICY "Users can update their own bookings" 
        ON public.bookings 
        FOR UPDATE 
        USING (auth.uid() = user_id OR user_id IS NULL);
    END IF;
END $$;

-- Add missing RLS policies for experience_bookings table
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'experience_bookings' 
        AND policyname = 'Users can insert their own experience bookings'
    ) THEN
        CREATE POLICY "Users can insert their own experience bookings" 
        ON public.experience_bookings 
        FOR INSERT 
        WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'experience_bookings' 
        AND policyname = 'Users can update their own experience bookings'
    ) THEN
        CREATE POLICY "Users can update their own experience bookings" 
        ON public.experience_bookings 
        FOR UPDATE 
        USING (auth.uid() = user_id OR user_id IS NULL);
    END IF;
END $$;

-- Recreate booking_guests policies with correct permissions
CREATE POLICY "Users can view their booking guests" 
ON public.booking_guests 
FOR SELECT 
USING ((SELECT user_id FROM public.bookings WHERE id = booking_id) = auth.uid());

CREATE POLICY "Users can insert their booking guests" 
ON public.booking_guests 
FOR INSERT 
WITH CHECK ((SELECT user_id FROM public.bookings WHERE id = booking_id) = auth.uid());

CREATE POLICY "Users can update their booking guests" 
ON public.booking_guests 
FOR UPDATE 
USING ((SELECT user_id FROM public.bookings WHERE id = booking_id) = auth.uid());

-- Recreate payments policy with correct permissions
CREATE POLICY "Users can view their payments" 
ON public.payments 
FOR SELECT 
USING (
  (booking_id IS NOT NULL AND (SELECT user_id FROM public.bookings WHERE id = booking_id) = auth.uid()) OR
  (experience_booking_id IS NOT NULL AND (SELECT user_id FROM public.experience_bookings WHERE id = experience_booking_id) = auth.uid())
);

-- Add RLS policies for payment_attempts table
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'payment_attempts' 
        AND policyname = 'Users can view their payment attempts'
    ) THEN
        CREATE POLICY "Users can view their payment attempts" 
        ON public.payment_attempts 
        FOR SELECT 
        USING (
          (booking_id IS NOT NULL AND (SELECT user_id FROM public.bookings WHERE id = booking_id) = auth.uid()) OR
          (experience_booking_id IS NOT NULL AND (SELECT user_id FROM public.experience_bookings WHERE id = experience_booking_id) = auth.uid())
        );
    END IF;
END $$;

-- Add constraints to ensure guest bookings have contact information (only if they don't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'check_guest_contact_info' 
        AND conrelid = 'public.bookings'::regclass
    ) THEN
        ALTER TABLE public.bookings 
        ADD CONSTRAINT check_guest_contact_info 
        CHECK (
          (user_id IS NOT NULL) OR 
          (user_id IS NULL AND guest_name IS NOT NULL AND guest_email IS NOT NULL AND guest_phone IS NOT NULL)
        );
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'check_guest_contact_info' 
        AND conrelid = 'public.experience_bookings'::regclass
    ) THEN
        ALTER TABLE public.experience_bookings 
        ADD CONSTRAINT check_guest_contact_info 
        CHECK (
          (user_id IS NOT NULL) OR 
          (user_id IS NULL AND guest_name IS NOT NULL AND guest_email IS NOT NULL AND guest_phone IS NOT NULL)
        );
    END IF;
END $$;
