
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { PriceSummary } from '@/components/booking/PriceSummary';
import { PriceBreakdown } from '@/types/booking';

interface ExperienceBookingStep1_AttendeesProps {
  attendeeCount: number;
  availableCapacity: number;
  isLoading: boolean;
  priceBreakdown: PriceBreakdown | null;
  onAttendeeChange: (count: number) => void;
  onCalculatePrice: () => Promise<void>;
  onContinue: () => void;
}

const ExperienceBookingStep1_Attendees: React.FC<ExperienceBookingStep1_AttendeesProps> = ({
  attendeeCount,
  availableCapacity,
  isLoading,
  priceBreakdown,
  onAttendeeChange,
  onCalculatePrice,
  onContinue
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-serif">Reserve Your Experience</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="attendees">Number of Attendees</Label>
            <select 
              id="attendees"
              value={attendeeCount}
              onChange={(e) => onAttendeeChange(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            >
              {Array.from({ length: availableCapacity }, (_, i) => i + 1).map(num => (
                <option key={num} value={num}>{num} {num === 1 ? 'Person' : 'People'}</option>
              ))}
            </select>
          </div>
          
          <Button 
            onClick={onCalculatePrice} 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Checking availability...' : 'Check Availability & Price'}
          </Button>
          
          {priceBreakdown && (
            <div className="mt-4">
              <PriceSummary priceBreakdown={priceBreakdown} />
              
              <Button 
                onClick={onContinue} 
                className="w-full mt-4"
              >
                Continue
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExperienceBookingStep1_Attendees;
