
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GuestInfo } from '@/types/booking';

interface GuestInfoStepProps {
  numberOfGuests: number;
  initialGuestInfo?: GuestInfo[];
  initialCustomerNotes?: string;
  onNext: (guestInfo: GuestInfo[], customerNotes?: string) => void;
  onBack: () => void;
}

const GuestInfoStep: React.FC<GuestInfoStepProps> = ({
  numberOfGuests,
  initialGuestInfo,
  initialCustomerNotes = '',
  onNext,
  onBack
}) => {
  const [guestInfo, setGuestInfo] = useState<GuestInfo[]>(() => {
    if (initialGuestInfo && initialGuestInfo.length === numberOfGuests) {
      return initialGuestInfo;
    }
    return Array(numberOfGuests).fill(0).map(() => ({ name: '', age: undefined }));
  });
  
  const [customerNotes, setCustomerNotes] = useState<string>(initialCustomerNotes);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  const handleGuestChange = (index: number, field: keyof GuestInfo, value: string | number) => {
    const updatedGuests = [...guestInfo];
    
    if (field === 'name') {
      updatedGuests[index].name = value as string;
    } else if (field === 'age') {
      updatedGuests[index].age = value ? parseInt(value as string) : undefined;
    }
    
    setGuestInfo(updatedGuests);
  };
  
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    guestInfo.forEach((guest, index) => {
      if (!guest.name.trim()) {
        newErrors[`guest-${index}-name`] = `Guest ${index + 1} name is required`;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = () => {
    if (validateForm()) {
      onNext(guestInfo, customerNotes);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-serif">Guest Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {guestInfo.map((guest, index) => (
            <div key={index} className="space-y-4 p-4 border rounded-md">
              <h3 className="font-medium">Guest {index + 1} {index === 0 ? '(Primary)' : ''}</h3>
              
              <div className="space-y-2">
                <Label htmlFor={`guest-${index}-name`}>Full Name</Label>
                <Input
                  id={`guest-${index}-name`}
                  value={guest.name}
                  onChange={(e) => handleGuestChange(index, 'name', e.target.value)}
                  required
                />
                {errors[`guest-${index}-name`] && (
                  <p className="text-sm text-red-500">{errors[`guest-${index}-name`]}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`guest-${index}-age`}>Age (Optional)</Label>
                <Input
                  id={`guest-${index}-age`}
                  type="number"
                  min={0}
                  max={120}
                  value={guest.age || ''}
                  onChange={(e) => handleGuestChange(index, 'age', e.target.value)}
                />
              </div>
            </div>
          ))}
          
          <div className="space-y-2">
            <Label htmlFor="customer-notes">Additional Notes (Optional)</Label>
            <textarea
              id="customer-notes"
              className="w-full min-h-[100px] p-2 border rounded-md"
              value={customerNotes}
              onChange={(e) => setCustomerNotes(e.target.value)}
              placeholder="Any other information you'd like us to know?"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleSubmit}>
          Continue
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GuestInfoStep;
