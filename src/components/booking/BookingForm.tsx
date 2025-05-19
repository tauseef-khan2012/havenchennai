
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useBooking } from '@/hooks/useBooking';
import { Button } from '@/components/ui/button';
import { PriceSummary } from '@/components/booking/PriceSummary';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { calculateNights } from '@/utils/bookingUtils';
import { UUID, PriceBreakdown, GuestInfo } from '@/types/booking';

interface BookingFormProps {
  type: 'property' | 'experience';
  propertyId?: UUID;
  instanceId?: UUID;
  maxGuests?: number;
  availableCapacity?: number;
}

export const BookingForm = ({ 
  type, 
  propertyId, 
  instanceId,
  maxGuests = 4,
  availableCapacity = 10
}: BookingFormProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    isLoading, 
    priceBreakdown, 
    checkAvailability, 
    calculatePrice, 
    makeBooking, 
    processPayment 
  } = useBooking();

  // Form state
  const [checkInDate, setCheckInDate] = useState<string>('');
  const [checkOutDate, setCheckOutDate] = useState<string>('');
  const [guestCount, setGuestCount] = useState<number>(1);
  const [attendeeCount, setAttendeeCount] = useState<number>(1);
  const [specialRequests, setSpecialRequests] = useState<string>('');
  const [guests, setGuests] = useState<GuestInfo[]>([{ name: '' }]);
  const [formStep, setFormStep] = useState<number>(0);
  const [bookingInfo, setBookingInfo] = useState<{ 
    bookingId: UUID; 
    bookingReference: string; 
    priceBreakdown: PriceBreakdown;
  } | null>(null);

  // Calculate price when dates or guest count changes
  const handleCalculatePrice = async () => {
    if (type === 'property' && propertyId && checkInDate && checkOutDate) {
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);
      
      // Check if dates are valid
      if (checkIn >= checkOut) {
        return;
      }
      
      // Check availability first
      const available = await checkAvailability('property', {
        propertyId,
        checkInDate: checkIn,
        checkOutDate: checkOut
      });
      
      if (available) {
        await calculatePrice('property', {
          propertyId,
          checkInDate: checkIn,
          checkOutDate: checkOut
        });
      }
    } else if (type === 'experience' && instanceId && attendeeCount > 0) {
      // Check availability first
      const available = await checkAvailability('experience', {
        instanceId,
        numberOfAttendees: attendeeCount
      });
      
      if (available) {
        await calculatePrice('experience', {
          instanceId,
          numberOfAttendees: attendeeCount
        });
      }
    }
  };

  // Continue to next step of the booking process
  const handleContinue = async () => {
    if (formStep === 0) {
      // Validate first step
      if (type === 'property' && (!checkInDate || !checkOutDate || guestCount < 1)) {
        return;
      } else if (type === 'experience' && attendeeCount < 1) {
        return;
      }
      
      await handleCalculatePrice();
      
      if (priceBreakdown) {
        setFormStep(1);
      }
    } else if (formStep === 1) {
      // Validate second step (guest info)
      let valid = true;
      
      if (type === 'property') {
        valid = guests.every(guest => guest.name.trim() !== '');
      }
      
      if (valid) {
        setFormStep(2);
      }
    }
  };

  // Submit the booking
  const handleSubmit = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (type === 'property' && propertyId && checkInDate && checkOutDate) {
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);
      
      const result = await makeBooking('property', {
        propertyId,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        numberOfGuests: guestCount,
        specialRequests,
        guests
      });
      
      if (result && priceBreakdown) {
        setBookingInfo({
          bookingId: result.bookingId,
          bookingReference: result.bookingReference,
          priceBreakdown
        });
        setFormStep(3);
      }
    } else if (type === 'experience' && instanceId) {
      const result = await makeBooking('experience', {
        instanceId,
        numberOfAttendees: attendeeCount,
        specialRequests
      });
      
      if (result && priceBreakdown) {
        setBookingInfo({
          bookingId: result.bookingId,
          bookingReference: result.bookingReference,
          priceBreakdown
        });
        setFormStep(3);
      }
    }
  };

  // Process payment
  const handlePayment = async () => {
    if (!bookingInfo) return;
    
    const paymentSuccess = await processPayment(
      bookingInfo.bookingId,
      type,
      bookingInfo.priceBreakdown.totalAmountDue,
      bookingInfo.priceBreakdown.currency,
      bookingInfo.bookingReference
    );
    
    if (paymentSuccess) {
      setFormStep(4);
    }
  };

  // Add or remove guest fields
  const handleAddGuest = () => {
    if (guests.length < maxGuests) {
      setGuests([...guests, { name: '' }]);
    }
  };

  const handleRemoveGuest = (index: number) => {
    if (guests.length > 1) {
      const newGuests = [...guests];
      newGuests.splice(index, 1);
      setGuests(newGuests);
    }
  };

  const handleGuestNameChange = (index: number, name: string) => {
    const newGuests = [...guests];
    newGuests[index].name = name;
    setGuests(newGuests);
  };

  // Calculate nights
  const nights = checkInDate && checkOutDate 
    ? calculateNights(new Date(checkInDate), new Date(checkOutDate))
    : 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {formStep === 0 && (
        <div className="space-y-4">
          <h3 className="font-serif text-xl font-semibold mb-4">
            {type === 'property' ? 'Book Your Stay' : 'Reserve Your Spot'}
          </h3>
          
          {type === 'property' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="check-in">Check-in Date</Label>
                  <Input 
                    id="check-in" 
                    type="date" 
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="check-out">Check-out Date</Label>
                  <Input 
                    id="check-out" 
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    min={checkInDate || new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="guests">Guests</Label>
                <select 
                  id="guests"
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  {Array.from({ length: maxGuests }, (_, i) => i + 1).map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                  ))}
                </select>
              </div>
            </>
          )}
          
          {type === 'experience' && (
            <div>
              <Label htmlFor="attendees">Number of Attendees</Label>
              <select 
                id="attendees"
                value={attendeeCount}
                onChange={(e) => setAttendeeCount(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                {Array.from({ length: availableCapacity }, (_, i) => i + 1).map(num => (
                  <option key={num} value={num}>{num} {num === 1 ? 'Person' : 'People'}</option>
                ))}
              </select>
            </div>
          )}
          
          <Button 
            onClick={handleCalculatePrice} 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Checking availability...' : 'Check Availability & Price'}
          </Button>
          
          {priceBreakdown && (
            <div className="mt-4">
              <PriceSummary priceBreakdown={priceBreakdown} nights={type === 'property' ? nights : undefined} />
              
              <Button 
                onClick={handleContinue} 
                className="w-full mt-4"
              >
                Continue
              </Button>
            </div>
          )}
        </div>
      )}
      
      {formStep === 1 && (
        <div className="space-y-4">
          <h3 className="font-serif text-xl font-semibold mb-4">Guest Information</h3>
          
          {type === 'property' && (
            <div className="space-y-4">
              {guests.map((guest, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={`guest-${index}`}>
                      Guest {index + 1} {index === 0 ? '(Primary)' : ''}
                    </Label>
                    {index > 0 && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleRemoveGuest(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  
                  <Input 
                    id={`guest-${index}`}
                    placeholder="Full Name"
                    value={guest.name}
                    onChange={(e) => handleGuestNameChange(index, e.target.value)}
                    required
                  />
                </div>
              ))}
              
              {guests.length < guestCount && (
                <Button 
                  variant="outline" 
                  onClick={handleAddGuest}
                  className="w-full"
                >
                  + Add Another Guest
                </Button>
              )}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="special-requests">Special Requests</Label>
            <Textarea 
              id="special-requests"
              placeholder="Any special requests or notes for your booking"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              rows={4}
            />
          </div>
          
          <div className="space-y-2 pt-4">
            <Button onClick={() => setFormStep(0)} variant="outline" className="mr-2">
              Back
            </Button>
            <Button onClick={handleContinue}>
              Continue to Summary
            </Button>
          </div>
        </div>
      )}
      
      {formStep === 2 && priceBreakdown && (
        <div className="space-y-4">
          <h3 className="font-serif text-xl font-semibold mb-4">Booking Summary</h3>
          
          <div className="space-y-4">
            {type === 'property' && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Dates</span>
                  <span>{new Date(checkInDate).toLocaleDateString()} - {new Date(checkOutDate).toLocaleDateString()}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Guests</span>
                  <span>{guestCount}</span>
                </div>
                
                <Separator className="my-2" />
                
                <div className="space-y-1">
                  <span className="text-gray-600">Guest Names</span>
                  <ul className="list-disc list-inside">
                    {guests.map((guest, index) => (
                      <li key={index}>{guest.name}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            
            {type === 'experience' && (
              <div className="flex justify-between">
                <span className="text-gray-600">Attendees</span>
                <span>{attendeeCount}</span>
              </div>
            )}
            
            {specialRequests && (
              <div className="space-y-1">
                <span className="text-gray-600">Special Requests</span>
                <p className="border p-2 rounded bg-gray-50 text-sm">{specialRequests}</p>
              </div>
            )}
            
            <PriceSummary priceBreakdown={priceBreakdown} nights={type === 'property' ? nights : undefined} />
          </div>
          
          <div className="pt-4">
            <Button onClick={() => setFormStep(1)} variant="outline" className="mr-2">
              Back
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Confirm Booking'}
            </Button>
          </div>
        </div>
      )}
      
      {formStep === 3 && bookingInfo && (
        <div className="space-y-4">
          <h3 className="font-serif text-xl font-semibold mb-4">Payment</h3>
          
          <div className="bg-green-50 border border-green-200 p-4 rounded-md mb-4">
            <p className="font-medium">Your booking is created!</p>
            <p className="text-sm">Booking Reference: {bookingInfo.bookingReference}</p>
          </div>
          
          <PriceSummary priceBreakdown={bookingInfo.priceBreakdown} nights={type === 'property' ? nights : undefined} />
          
          <Button onClick={handlePayment} className="w-full" disabled={isLoading}>
            {isLoading ? 'Processing...' : 'Proceed to Payment'}
          </Button>
          
          <p className="text-sm text-gray-500 text-center mt-2">
            You will be redirected to our secure payment provider.
          </p>
        </div>
      )}
      
      {formStep === 4 && bookingInfo && (
        <div className="space-y-4 text-center">
          <div className="text-haven-green text-5xl mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h3 className="font-serif text-2xl font-semibold">Booking Confirmed!</h3>
          
          <p>Thank you for your booking. Your reservation is now confirmed.</p>
          
          <div className="bg-gray-50 border p-4 rounded-md my-4">
            <p className="font-medium">Booking Reference</p>
            <p className="text-xl font-mono">{bookingInfo.bookingReference}</p>
          </div>
          
          <p className="text-sm text-gray-600">
            A confirmation email has been sent to your registered email address.
          </p>
          
          <div className="pt-4">
            <Button onClick={() => navigate('/dashboard')} className="w-full">
              View My Bookings
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
