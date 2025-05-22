
CREATE OR REPLACE FUNCTION increment_experience_attendees(instance_id UUID, attendees_count INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE experience_instances
  SET current_attendees = current_attendees + attendees_count
  WHERE id = instance_id;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public';
