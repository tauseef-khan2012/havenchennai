
-- Add indexes for bookings table
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_property_id ON public.bookings(property_id);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_id ON public.bookings(payment_id);
CREATE INDEX IF NOT EXISTS idx_bookings_check_in_date ON public.bookings(check_in_date);
CREATE INDEX IF NOT EXISTS idx_bookings_check_out_date ON public.bookings(check_out_date);
CREATE INDEX IF NOT EXISTS idx_bookings_booking_status ON public.bookings(booking_status);

-- Add indexes for booking_guests table
CREATE INDEX IF NOT EXISTS idx_booking_guests_booking_id ON public.booking_guests(booking_id);

-- Add indexes for experience_bookings table
CREATE INDEX IF NOT EXISTS idx_experience_bookings_user_id ON public.experience_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_experience_bookings_experience_instance_id ON public.experience_bookings(experience_instance_id);
CREATE INDEX IF NOT EXISTS idx_experience_bookings_payment_id ON public.experience_bookings(payment_id);
CREATE INDEX IF NOT EXISTS idx_experience_bookings_booking_status ON public.experience_bookings(booking_status);

-- Add indexes for payments table
CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON public.payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_experience_booking_id ON public.payments(experience_booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_payment_status ON public.payments(payment_status);

-- Add indexes for profiles table
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- Add indexes for experiences table
CREATE INDEX IF NOT EXISTS idx_experiences_is_published ON public.experiences(is_published);

-- Add indexes for experience_instances table
CREATE INDEX IF NOT EXISTS idx_experience_instances_experience_id ON public.experience_instances(experience_id);
CREATE INDEX IF NOT EXISTS idx_experience_instances_date ON public.experience_instances(date);
CREATE INDEX IF NOT EXISTS idx_experience_instances_status ON public.experience_instances(status);

-- Add indexes for properties table
CREATE INDEX IF NOT EXISTS idx_properties_is_published ON public.properties(is_published);

-- Add indexes for reviews table
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_booking_id ON public.reviews(booking_id);
CREATE INDEX IF NOT EXISTS idx_reviews_experience_booking_id ON public.reviews(experience_booking_id);
CREATE INDEX IF NOT EXISTS idx_reviews_is_approved ON public.reviews(is_approved);

-- Add indexes for package items
CREATE INDEX IF NOT EXISTS idx_package_items_package_id ON public.package_items(package_id);
CREATE INDEX IF NOT EXISTS idx_package_items_property_id ON public.package_items(property_id);
CREATE INDEX IF NOT EXISTS idx_package_items_experience_id ON public.package_items(experience_id);
