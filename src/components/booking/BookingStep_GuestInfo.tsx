
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { GuestInfo } from '@/types/booking';

interface BookingStepGuestInfoProps {
  numberOfGuests: number;
  onNext: (guestInfo: GuestInfo[], customerNotes?: string) => void;
  onBack: () => void;
  initialGuestInfo?: GuestInfo[];
  initialCustomerNotes?: string;
}

const BookingStep_GuestInfo: React.FC<BookingStepGuestInfoProps> = ({
  numberOfGuests,
  onNext,
  onBack,
  initialGuestInfo = [],
  initialCustomerNotes = ''
}) => {
  const { toast } = useToast();
  const [guestInfo, setGuestInfo] = useState<GuestInfo[]>(() => {
    if (initialGuestInfo.length >= numberOfGuests) {
      return initialGuestInfo.slice(0, numberOfGuests);
    }
    
    // Fill in missing guests with empty data
    return [
      ...initialGuestInfo,
      ...Array(numberOfGuests - initialGuestInfo.length).fill(null).map(() => ({ name: '' }))
    ];
  });
  const [customerNotes, setCustomerNotes] = useState(initialCustomerNotes);

  const updateGuestInfo = (index: number, field: keyof GuestInfo, value: string | number) => {
    setGuestInfo(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that all required guest names are filled
    const missingNames = guestInfo.filter(guest => !guest.name.trim());
    if (missingNames.length > 0) {
      toast({
        title: "Missing information",
        description: `Please provide names for all guests.`,
        variant: "destructive"
      });
      return;
    }
    
    onNext(guestInfo, customerNotes || undefined);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-serif">Guest Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {Array.from({ length: numberOfGuests }).map((_, index) => (
            <div key={index} className="space-y-4">
              <h3 className="font-medium">{index === 0 ? 'Primary Guest' : `Guest ${index + 1}`}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`guest-${index}-name`}>
                    Full Name<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id={`guest-${index}-name`}
                    value={guestInfo[index]?.name || ''}
                    onChange={(e) => updateGuestInfo(index, 'name', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`guest-${index}-age`}>Age</Label>
                  <Input
                    id={`guest-${index}-age`}
                    type="number"
                    min="0"
                    max="120"
                    value={guestInfo[index]?.age || ''}
                    onChange={(e) => updateGuestInfo(index, 'age', parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
              
              {index < numberOfGuests - 1 && <Separator />}
            </div>
          ))}
          
          <div className="space-y-2">
            <Label htmlFor="customer-notes">Additional Notes (Optional)</Label>
            <textarea
              id="customer-notes"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={3}
              value={customerNotes}
              onChange={(e) => setCustomerNotes(e.target.value)}
              placeholder="Any other information you'd like us to know?"
            />
          </div>
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button type="submit">
              Continue to Review & Payment
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default BookingStep_GuestInfo;
