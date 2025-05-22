
-- Enable Row Level Security on all tables that don't have it yet
ALTER TABLE IF EXISTS public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.booking_guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.experience_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.reviews ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for bookings table
CREATE POLICY "Users can view their own bookings" 
ON public.bookings 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bookings" 
ON public.bookings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings" 
ON public.bookings 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create RLS policies for booking_guests table
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

-- Create RLS policies for experience_bookings table
CREATE POLICY "Users can view their experience bookings" 
ON public.experience_bookings 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their experience bookings" 
ON public.experience_bookings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their experience bookings" 
ON public.experience_bookings 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create RLS policies for payments table
CREATE POLICY "Users can view their payments" 
ON public.payments 
FOR SELECT 
USING (
  (booking_id IS NOT NULL AND (SELECT user_id FROM public.bookings WHERE id = booking_id) = auth.uid()) OR
  (experience_booking_id IS NOT NULL AND (SELECT user_id FROM public.experience_bookings WHERE id = experience_booking_id) = auth.uid())
);

-- Create RLS policies for profiles table
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

-- Create RLS policies for reviews table
CREATE POLICY "Users can view reviews" 
ON public.reviews 
FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own reviews" 
ON public.reviews 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id OR
  (booking_id IS NOT NULL AND (SELECT user_id FROM public.bookings WHERE id = booking_id) = auth.uid()) OR
  (experience_booking_id IS NOT NULL AND (SELECT user_id FROM public.experience_bookings WHERE id = experience_booking_id) = auth.uid())
);

CREATE POLICY "Users can update their own reviews" 
ON public.reviews 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create public viewing policies for properties and experiences tables
CREATE POLICY "Everyone can view published properties" 
ON public.properties 
FOR SELECT 
USING (is_published = true);

CREATE POLICY "Everyone can view published experiences" 
ON public.experiences 
FOR SELECT 
USING (is_published = true);

-- Create policies for packages
CREATE POLICY "Everyone can view active packages" 
ON public.packages 
FOR SELECT 
USING (is_active = true);

-- Create policy for package items
CREATE POLICY "Everyone can view package items" 
ON public.package_items 
FOR SELECT 
USING (true);
