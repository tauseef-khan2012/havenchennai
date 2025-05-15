
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Experience } from '@/data/experiencesData';

interface BookingCardProps {
  experience: Experience;
}

const BookingCard = ({ experience }: BookingCardProps) => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [guests, setGuests] = useState(1);
  
  // Function to determine if a day is available based on the experience's availability
  const isDayAvailable = (day: Date) => {
    const dayName = day.toLocaleDateString('en-US', { weekday: 'long' });
    return experience.availability.includes(dayName);
  };
  
  // Calculate total price
  const totalPrice = experience.price * guests;
  
  return (
    <div className="md:col-span-1">
      <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
        <h3 className="font-serif text-xl font-bold mb-4">Book this Experience</h3>
        
        <div className="mb-4">
          <p className="text-gray-600 mb-1">From</p>
          <p className="text-2xl font-bold">${experience.price}<span className="text-sm font-normal text-gray-500"> / person</span></p>
        </div>
        
        <div className="mb-6">
          <Label htmlFor="date" className="block mb-2">Select a Date</Label>
          <div className="border rounded-md p-1">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={(date) => {
                // Disable dates in the past and dates not available for this experience
                return date < new Date() || !isDayAvailable(date);
              }}
              className="rounded-md"
            />
          </div>
        </div>
        
        <div className="mb-6">
          <Label htmlFor="guests" className="block mb-2">Number of Guests</Label>
          <Input
            id="guests"
            type="number"
            min={1}
            max={parseInt(experience.groupSize.replace(/\D/g, ''))}
            value={guests}
            onChange={(e) => setGuests(parseInt(e.target.value))}
            className="w-full"
          />
          <p className="mt-1 text-sm text-gray-500">{experience.groupSize}</p>
        </div>
        
        <div className="border-t border-gray-200 pt-4 mb-6">
          <div className="flex justify-between mb-2">
            <span>${experience.price} × {guests} {guests === 1 ? 'person' : 'people'}</span>
            <span>${totalPrice}</span>
          </div>
          <div className="font-bold flex justify-between text-lg">
            <span>Total</span>
            <span>${totalPrice}</span>
          </div>
        </div>
        
        <Button 
          className="w-full bg-haven-green hover:bg-haven-green/90"
          disabled={!date}
        >
          Reserve
        </Button>
        
        <p className="text-center text-sm text-gray-500 mt-4">You won't be charged yet</p>
      </div>
    </div>
  );
};

export default BookingCard;
