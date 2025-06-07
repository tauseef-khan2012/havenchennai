
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';

const CheckAvailabilityButton = () => {
  const navigate = useNavigate();
  
  // Use consistent property ID for Haven
  const havenPropertyId = "550e8400-e29b-41d4-a716-446655440000";

  const handleCheckAvailability = () => {
    navigate(`/booking?propertyId=${havenPropertyId}`);
  };

  return (
    <Button 
      onClick={handleCheckAvailability}
      className="w-full bg-haven-teal text-white hover:bg-opacity-90 py-3 text-lg font-medium rounded-lg"
    >
      <Calendar className="h-5 w-5 mr-2" />
      Check Availability
    </Button>
  );
};

export default CheckAvailabilityButton;
