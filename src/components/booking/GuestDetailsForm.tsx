
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

interface GuestInfo {
  name: string;
  age?: number;
}

interface GuestDetailsFormProps {
  guestDetails: GuestInfo[];
  onGuestDetailsChange: (index: number, field: keyof GuestInfo, value: string | number) => void;
  errors: Record<string, string>;
}

export const GuestDetailsForm: React.FC<GuestDetailsFormProps> = ({
  guestDetails,
  onGuestDetailsChange,
  errors
}) => {
  return (
    <div className="space-y-4">
      {guestDetails.map((guest, index) => (
        <div key={index} className="space-y-4">
          <h4 className="font-medium text-gray-900">
            {index === 0 ? 'Primary Guest' : `Guest ${index + 1}`}
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`guest-${index}-name`}>Full Name *</Label>
              <Input
                id={`guest-${index}-name`}
                value={guest.name}
                onChange={(e) => onGuestDetailsChange(index, 'name', e.target.value)}
                placeholder="Enter guest name"
                className={errors[`guest_${index}_name`] ? 'border-red-500' : ''}
              />
              {errors[`guest_${index}_name`] && (
                <p className="text-sm text-red-600">{errors[`guest_${index}_name`]}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`guest-${index}-age`}>Age (optional)</Label>
              <Input
                id={`guest-${index}-age`}
                type="number"
                min="0"
                max="120"
                value={guest.age || ''}
                onChange={(e) => onGuestDetailsChange(index, 'age', parseInt(e.target.value) || undefined)}
                placeholder="Age"
                className={errors[`guest_${index}_age`] ? 'border-red-500' : ''}
              />
              {errors[`guest_${index}_age`] && (
                <p className="text-sm text-red-600">{errors[`guest_${index}_age`]}</p>
              )}
            </div>
          </div>
          
          {index < guestDetails.length - 1 && <Separator />}
        </div>
      ))}
    </div>
  );
};
