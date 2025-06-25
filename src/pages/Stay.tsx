
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Stay = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to amenities page since overview is removed
    navigate('/stay/amenities', { replace: true });
  }, [navigate]);

  return null;
};

export default Stay;
