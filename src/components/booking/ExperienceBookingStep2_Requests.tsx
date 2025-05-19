
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ExperienceBookingStep2_RequestsProps {
  specialRequests: string;
  onSpecialRequestsChange: (requests: string) => void;
  onBack: () => void;
  onContinue: () => void;
}

const ExperienceBookingStep2_Requests: React.FC<ExperienceBookingStep2_RequestsProps> = ({
  specialRequests,
  onSpecialRequestsChange,
  onBack,
  onContinue
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-serif">Special Requests</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="special-requests">Any special requests?</Label>
            <Textarea 
              id="special-requests"
              placeholder="Any special requests or notes for your booking"
              value={specialRequests}
              onChange={(e) => onSpecialRequestsChange(e.target.value)}
              rows={4}
            />
          </div>
          
          <div className="flex justify-between">
            <Button 
              onClick={onBack} 
              variant="outline"
            >
              Back
            </Button>
            <Button 
              onClick={onContinue}
            >
              Continue to Summary
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExperienceBookingStep2_Requests;
