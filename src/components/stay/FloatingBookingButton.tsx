
import { Button } from '@/components/ui/button';

interface FloatingBookingButtonProps {
  onBookNowClick: () => void;
}

const FloatingBookingButton = ({ onBookNowClick }: FloatingBookingButtonProps) => {
  return (
    <div className="fixed bottom-8 right-8 z-40">
      <Button 
        onClick={onBookNowClick}
        className="bg-haven-green text-white hover:bg-opacity-90 shadow-lg px-6 py-6 rounded-full text-lg font-medium"
      >
        Book Now
      </Button>
    </div>
  );
};

export default FloatingBookingButton;
