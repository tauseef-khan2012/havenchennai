
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, addDays, isBefore, isAfter, startOfDay } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { checkPropertyAvailability } from '@/services/bookingService';
import { UUID } from '@/types/booking';

interface PropertyBookingStep1Props {
  propertyId: UUID;
  onNext: (data: { 
    checkInDate: Date; 
    checkOutDate: Date; 
    numberOfGuests: number;
    specialRequests?: string;
  }) => void;
  initialValues?: {
    checkInDate?: Date;
    checkOutDate?: Date;
    numberOfGuests?: number;
    specialRequests?: string;
  };
  maxGuests: number;
  minNights?: number;
}

const PropertyBookingStep1_DatesGuests: React.FC<PropertyBookingStep1Props> = ({
  propertyId,
  onNext,
  initialValues,
  maxGuests,
  minNights = 1
}) => {
  const { toast } = useToast();
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(initialValues?.checkInDate);
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(initialValues?.checkOutDate);
  const [numberOfGuests, setNumberOfGuests] = useState<number>(initialValues?.numberOfGuests || 1);
  const [specialRequests, setSpecialRequests] = useState<string>(initialValues?.specialRequests || '');
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  // Reset checkout date if check-in date changes and creates invalid state
  useEffect(() => {
    if (checkInDate && checkOutDate && !isBefore(checkInDate, checkOutDate)) {
      setCheckOutDate(undefined);
    }
  }, [checkInDate, checkOutDate]);

  const handleDateSelect = async (date: Date | undefined) => {
    const today = startOfDay(new Date());
    
    if (!date || isBefore(date, today)) {
      toast({
        title: "Invalid date selection",
        description: "Please select a date in the future.",
        variant: "destructive"
      });
      return;
    }
    
    if (!checkInDate) {
      setCheckInDate(date);
    } else if (!checkOutDate && isAfter(date, checkInDate)) {
      const proposedCheckOut = date;
      setIsCheckingAvailability(true);
      
      try {
        const available = await checkPropertyAvailability(
          propertyId,
          checkInDate,
          proposedCheckOut
        );
        
        setIsAvailable(available);
        
        if (available) {
          setCheckOutDate(proposedCheckOut);
          toast({
            title: "Dates available!",
            description: "The property is available for your selected dates.",
          });
        } else {
          toast({
            title: "Not available",
            description: "Sorry, the property is not available for these dates.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Error checking availability:", error);
        toast({
          title: "Error",
          description: "Failed to check availability. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsCheckingAvailability(false);
      }
    } else {
      // Reset selection
      setCheckInDate(date);
      setCheckOutDate(undefined);
      setIsAvailable(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!checkInDate || !checkOutDate) {
      toast({
        title: "Missing dates",
        description: "Please select both check-in and check-out dates.",
        variant: "destructive"
      });
      return;
    }
    
    // Check minimum nights requirement
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    if (nights < minNights) {
      toast({
        title: "Minimum stay required",
        description: `This property requires a minimum stay of ${minNights} nights.`,
        variant: "destructive"
      });
      return;
    }
    
    if (isAvailable) {
      onNext({
        checkInDate,
        checkOutDate,
        numberOfGuests,
        specialRequests: specialRequests.trim() || undefined
      });
    } else {
      toast({
        title: "Availability check required",
        description: "Please select dates and wait for availability to be confirmed.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-serif">Select Dates & Guests</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="check-in">Check-in Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="check-in"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !checkInDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {checkInDate ? format(checkInDate, "PPP") : <span>Select check-in date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={checkInDate}
                    onSelect={handleDateSelect}
                    disabled={(date) => isBefore(date, startOfDay(new Date()))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="check-out">Check-out Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="check-out"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !checkOutDate && "text-muted-foreground"
                    )}
                    disabled={!checkInDate}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {checkOutDate ? format(checkOutDate, "PPP") : <span>Select check-out date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={checkOutDate}
                    onSelect={handleDateSelect}
                    disabled={(date) => !checkInDate || isBefore(date, addDays(checkInDate, minNights - 1))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="number-of-guests">Number of Guests</Label>
            <Select
              value={numberOfGuests.toString()}
              onValueChange={(value) => setNumberOfGuests(parseInt(value))}
            >
              <SelectTrigger id="number-of-guests">
                <SelectValue placeholder="Select number of guests" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: maxGuests }, (_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    {i + 1} {i === 0 ? 'Guest' : 'Guests'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="special-requests">Special Requests (Optional)</Label>
            <textarea
              id="special-requests"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder="Any special requests or preferences?"
            />
          </div>
          
          {isAvailable === false && (
            <div className="text-red-600 font-medium">
              Sorry, the property is not available for the selected dates.
            </div>
          )}
          
          <Button type="submit" className="w-full" disabled={!checkInDate || !checkOutDate || isCheckingAvailability || isAvailable === false}>
            {isCheckingAvailability ? "Checking Availability..." : "Continue to Next Step"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PropertyBookingStep1_DatesGuests;
