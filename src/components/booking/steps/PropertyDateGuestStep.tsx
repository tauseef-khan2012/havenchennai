
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UUID } from '@/types/booking';

interface PropertyDateGuestStepProps {
  propertyId: UUID;
  maxGuests: number;
  minNights?: number;
  onNext: (data: {
    checkInDate: Date;
    checkOutDate: Date;
    numberOfGuests: number;
    specialRequests?: string;
  }) => void;
}

const PropertyDateGuestStep: React.FC<PropertyDateGuestStepProps> = ({
  propertyId,
  maxGuests,
  minNights = 1,
  onNext
}) => {
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(undefined);
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(undefined);
  const [numberOfGuests, setNumberOfGuests] = useState<number>(1);
  const [specialRequests, setSpecialRequests] = useState<string>('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!checkInDate) {
      newErrors.checkInDate = 'Check-in date is required';
    }
    
    if (!checkOutDate) {
      newErrors.checkOutDate = 'Check-out date is required';
    } else if (checkInDate && checkOutDate <= checkInDate) {
      newErrors.checkOutDate = 'Check-out date must be after check-in date';
    }
    
    if (!numberOfGuests || numberOfGuests < 1) {
      newErrors.numberOfGuests = 'At least 1 guest is required';
    } else if (numberOfGuests > maxGuests) {
      newErrors.numberOfGuests = `Maximum ${maxGuests} guests allowed`;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm() && checkInDate && checkOutDate) {
      onNext({
        checkInDate,
        checkOutDate,
        numberOfGuests,
        specialRequests
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-serif">Select Your Dates & Guests</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="check-in">Check-in Date</Label>
              <DatePicker
                id="check-in"
                date={checkInDate}
                onDateChange={setCheckInDate}
                disabled={(date) => date < new Date()}
              />
              {errors.checkInDate && (
                <p className="text-sm text-red-500">{errors.checkInDate}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="check-out">Check-out Date</Label>
              <DatePicker
                id="check-out"
                date={checkOutDate}
                onDateChange={setCheckOutDate}
                disabled={(date) => 
                  date < new Date() || 
                  (checkInDate ? date <= checkInDate : false)
                }
              />
              {errors.checkOutDate && (
                <p className="text-sm text-red-500">{errors.checkOutDate}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="guests">Number of Guests</Label>
            <Input
              id="guests"
              type="number"
              min={1}
              max={maxGuests}
              value={numberOfGuests}
              onChange={(e) => setNumberOfGuests(parseInt(e.target.value) || 1)}
            />
            {errors.numberOfGuests && (
              <p className="text-sm text-red-500">{errors.numberOfGuests}</p>
            )}
            <p className="text-sm text-gray-500">Maximum {maxGuests} guests</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="requests">Special Requests (Optional)</Label>
            <textarea
              id="requests"
              className="w-full min-h-[100px] p-2 border rounded-md"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder="Any special requirements or requests?"
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleSubmit}>
          Continue
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PropertyDateGuestStep;
