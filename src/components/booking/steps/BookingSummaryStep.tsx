
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PriceSummary } from '@/components/booking/PriceSummary';
import { GuestInfo, PriceBreakdown } from '@/types/booking';
import { calculateNights } from '@/utils/bookingUtils';
import { Calendar, Users, MessageSquare, CheckCircle, Clock } from 'lucide-react';

interface BookingSummaryStepProps {
  type: 'property' | 'experience';
  checkInDate?: string;
  checkOutDate?: string;
  guestCount?: number;
  attendeeCount?: number;
  guests?: GuestInfo[];
  specialRequests?: string;
  priceBreakdown: PriceBreakdown | null;
  onBack: () => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const BookingSummaryStep: React.FC<BookingSummaryStepProps> = ({
  type,
  checkInDate,
  checkOutDate,
  guestCount,
  attendeeCount,
  guests,
  specialRequests,
  priceBreakdown,
  onBack,
  onSubmit,
  isLoading
}) => {
  // Calculate nights for property bookings
  const nights = (checkInDate && checkOutDate) 
    ? calculateNights(new Date(checkInDate), new Date(checkOutDate))
    : 0;

  if (!priceBreakdown) return null;

  return (
    <div className="min-h-screen bg-navy-gradient py-8">
      <div className="absolute inset-0 bg-organic-texture opacity-20"></div>
      <div className="absolute inset-0 leaf-pattern opacity-15"></div>
      
      {/* Floating decorative elements */}
      <div className="absolute top-16 left-8 w-20 h-20 rounded-organic bg-haven-yellow/10 animate-float-gentle"></div>
      <div className="absolute bottom-20 right-12 w-16 h-16 rounded-organic-2 bg-haven-navy-light/20 animate-float-gentle" style={{ animationDelay: '1s' }}></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <Card className="w-full max-w-3xl mx-auto glass-panel-navy border-haven-yellow/20 shadow-navy animate-fade-in">
          <CardHeader className="text-center">
            <div className="inline-flex items-center gap-3 mb-4 justify-center">
              <div className="w-12 h-1 bg-yellow-gradient rounded-full"></div>
              <span className="font-handwritten text-2xl text-haven-yellow">Final Review</span>
              <div className="w-12 h-1 bg-yellow-gradient rounded-full"></div>
            </div>
            <CardTitle className="text-3xl font-serif text-haven-beige">Booking Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {type === 'property' && checkInDate && checkOutDate && guestCount && (
                <div className="glass-panel rounded-3xl p-6 border-l-4 border-haven-yellow space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="h-5 w-5 text-haven-yellow" />
                    <h3 className="font-medium text-haven-beige">Stay Details</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex justify-between">
                      <span className="text-haven-beige/80">Check-in</span>
                      <span className="text-haven-beige">{new Date(checkInDate).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-haven-beige/80">Check-out</span>
                      <span className="text-haven-beige">{new Date(checkOutDate).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-haven-beige/80">Guests</span>
                      <span className="text-haven-beige">{guestCount}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-haven-beige/80">Nights</span>
                      <span className="text-haven-beige">{nights}</span>
                    </div>
                  </div>
                  
                  <Separator className="my-4 bg-haven-yellow/20" />
                  
                  {guests && guests.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-haven-yellow" />
                        <span className="text-haven-beige font-medium">Guest Names</span>
                      </div>
                      <div className="glass-panel rounded-2xl p-3">
                        <ul className="space-y-1">
                          {guests.map((guest, index) => (
                            <li key={index} className="text-haven-beige/80 flex items-center gap-2">
                              <CheckCircle className="h-3 w-3 text-haven-yellow" />
                              {guest.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {type === 'experience' && attendeeCount && (
                <div className="glass-panel rounded-3xl p-6 border-l-4 border-haven-yellow">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="h-5 w-5 text-haven-yellow" />
                    <h3 className="font-medium text-haven-beige">Experience Details</h3>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-haven-beige/80">Attendees</span>
                    <span className="text-haven-beige">{attendeeCount}</span>
                  </div>
                </div>
              )}
              
              {specialRequests && (
                <div className="glass-panel rounded-3xl p-6 border-l-4 border-haven-yellow">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquare className="h-5 w-5 text-haven-yellow" />
                    <h3 className="font-medium text-haven-beige">Special Requests</h3>
                  </div>
                  <div className="bg-haven-navy-dark/30 p-3 rounded-2xl">
                    <p className="text-haven-beige/80 text-sm italic">{specialRequests}</p>
                  </div>
                </div>
              )}
              
              <div className="glass-panel rounded-3xl p-6 border-l-4 border-haven-yellow">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="h-5 w-5 text-haven-yellow" />
                  <h3 className="font-medium text-haven-beige">Price Breakdown</h3>
                </div>
                <PriceSummary priceBreakdown={priceBreakdown} nights={type === 'property' ? nights : undefined} />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between bg-haven-navy-dark/20 rounded-b-lg p-6">
            <Button 
              onClick={onBack} 
              variant="outline"
              className="glass-panel border-haven-yellow/30 text-haven-beige hover:bg-haven-navy-light/50"
            >
              Back
            </Button>
            <Button 
              onClick={onSubmit} 
              disabled={isLoading}
              className="bg-yellow-gradient hover:shadow-yellow text-haven-navy font-semibold px-8 py-3 text-lg transition-all duration-300 transform hover:scale-105 ripple-effect"
            >
              {isLoading ? 'Processing...' : 'Confirm Booking'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default BookingSummaryStep;
