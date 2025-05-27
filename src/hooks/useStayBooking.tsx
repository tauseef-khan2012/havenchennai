
import { useNavigate } from 'react-router-dom';

export const useStayBooking = () => {
  const navigate = useNavigate();
  
  // Use a consistent property ID for the Haven property
  const havenPropertyId = "550e8400-e29b-41d4-a716-446655440000";

  const handleBookNowClick = () => {
    navigate(`/booking?propertyId=${havenPropertyId}`);
  };

  return {
    handleBookNowClick
  };
};
