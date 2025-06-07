
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { format, addDays } from 'date-fns';
import { Calendar, ChevronRight, X } from 'lucide-react';

const StickyBookingWidget = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [checkIn, setCheckIn] = useState<Date | undefined>(addDays(new Date(), 1));
  const [checkOut, setCheckOut] = useState<Date | undefined>(addDays(new Date(), 3));
  const [guests, setGuests] = useState(2);
  
  // Use consistent property ID for Haven
  const havenPropertyId = "550e8400-e29b-41d4-a716-446655440000";
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const threshold = window.innerHeight * 0.5;
      
      if (scrollY > threshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setIsOpen(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const toggleWidget = () => {
    setIsOpen(!isOpen);
  };
  
  const disablePastDates = (date: Date) => {
    return date < new Date();
  };
  
  const disableCheckoutDates = (date: Date) => {
    return checkIn ? date <= checkIn : false;
  };

  const handleContinue = () => {
    const params = new URLSearchParams({
      propertyId: havenPropertyId,
      ...(checkIn && { checkIn: format(checkIn, 'yyyy-MM-dd') }),
      ...(checkOut && { checkOut: format(checkOut, 'yyyy-MM-dd') }),
      guests: guests.toString()
    });
    
    navigate(`/booking?${params.toString()}`);
  };
  
  return (
    <div className={`fixed bottom-6 right-6 z-40 transition-transform duration-300 ${
      isVisible ? 'translate-y-0' : 'translate-y-20 pointer-events-none'
    }`}>
      {!isOpen ? (
        <Button 
          onClick={toggleWidget}
          className="bg-haven-teal text-white shadow-lg rounded-full py-6 px-8 hover:bg-opacity-90"
        >
          <Calendar className="h-5 w-5 mr-2" />
          Book Your Stay
        </Button>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-xl w-80 sm:w-96 animate-scale-up">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-serif font-semibold text-lg">Quick Booking</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0" 
              onClick={toggleWidget}
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="check-in" className="block text-sm font-medium text-gray-700 mb-1">
                Check-in
              </label>
              <DatePicker 
                id="check-in"
                date={checkIn}
                onDateChange={setCheckIn}
                disabled={disablePastDates}
              />
            </div>
            
            <div>
              <label htmlFor="check-out" className="block text-sm font-medium text-gray-700 mb-1">
                Check-out
              </label>
              <DatePicker 
                id="check-out"
                date={checkOut}
                onDateChange={setCheckOut}
                disabled={disableCheckoutDates}
              />
            </div>
            
            <div>
              <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-1">
                Guests
              </label>
              <select
                id="guests"
                value={guests}
                onChange={(e) => setGuests(parseInt(e.target.value))}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
              >
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Guest' : 'Guests'}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Step 1 of 3
                <div className="w-full bg-gray-200 h-1 mt-1 rounded-full overflow-hidden">
                  <div className="bg-haven-teal h-full w-1/3"></div>
                </div>
              </div>
              
              <Button 
                onClick={handleContinue}
                className="bg-haven-teal text-white hover:bg-opacity-90"
                disabled={!checkIn || !checkOut}
              >
                Continue
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StickyBookingWidget;
