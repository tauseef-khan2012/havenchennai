
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { UUID } from '@/types/booking';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

interface ExperienceAddon {
  instanceId: UUID;
  experienceId: UUID;
  name: string;
  date: string;
  time: string;
  pricePerPerson: number;
  flatFeePrice: number | null;
  maxCapacity: number;
  currentAttendees: number;
  description: string;
  imageUrl?: string;
}

interface SelectedAddon {
  instanceId: UUID;
  attendees: number;
}

interface PropertyBookingStep2Props {
  checkInDate: Date;
  checkOutDate: Date;
  numberOfGuests: number;
  onNext: (addons: SelectedAddon[]) => void;
  onBack: () => void;
  initialSelectedAddons?: SelectedAddon[];
}

const PropertyBookingStep2_Addons: React.FC<PropertyBookingStep2Props> = ({
  checkInDate,
  checkOutDate,
  numberOfGuests,
  onNext,
  onBack,
  initialSelectedAddons = []
}) => {
  const { toast } = useToast();
  const [availableAddons, setAvailableAddons] = useState<ExperienceAddon[]>([]);
  const [selectedAddons, setSelectedAddons] = useState<SelectedAddon[]>(initialSelectedAddons);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAvailableExperiences = async () => {
      setIsLoading(true);
      try {
        // Format dates for Supabase query
        const formattedCheckIn = checkInDate.toISOString().split('T')[0];
        const formattedCheckOut = checkOutDate.toISOString().split('T')[0];

        // Query experience instances that overlap with the stay dates
        const { data, error } = await supabase
          .from('experience_instances')
          .select(`
            id,
            date,
            time,
            max_capacity,
            current_attendees,
            status,
            price_per_person_override,
            flat_fee_price_override,
            location_details,
            experience:experience_id (
              id,
              name,
              price_per_person,
              flat_fee_price,
              short_description,
              image_urls
            )
          `)
          .gte('date', formattedCheckIn)
          .lte('date', formattedCheckOut)
          .eq('status', 'Scheduled')
          .order('date', { ascending: true })
          .order('time', { ascending: true });

        if (error) {
          throw error;
        }

        // Transform into our addon format
        const addons: ExperienceAddon[] = data.map(instance => ({
          instanceId: instance.id,
          experienceId: instance.experience.id,
          name: instance.experience.name,
          date: instance.date,
          time: instance.time,
          pricePerPerson: instance.price_per_person_override ?? instance.experience.price_per_person ?? 0,
          flatFeePrice: instance.flat_fee_price_override ?? instance.experience.flat_fee_price,
          maxCapacity: instance.max_capacity,
          currentAttendees: instance.current_attendees,
          description: instance.experience.short_description || '',
          imageUrl: instance.experience.image_urls?.[0]
        }));

        setAvailableAddons(addons);
      } catch (error) {
        console.error('Error fetching experiences:', error);
        toast({
          title: 'Error',
          description: 'Failed to load available experiences. Please try again.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvailableExperiences();
  }, [checkInDate, checkOutDate, toast]);

  const toggleAddon = (instanceId: UUID) => {
    // Check if this addon is already selected
    const existingIndex = selectedAddons.findIndex(addon => addon.instanceId === instanceId);
    
    if (existingIndex >= 0) {
      // Remove the addon
      setSelectedAddons(prev => prev.filter(addon => addon.instanceId !== instanceId));
    } else {
      // Add the addon with default attendees (all guests)
      const addon = availableAddons.find(a => a.instanceId === instanceId);
      if (addon) {
        const availableSpots = addon.maxCapacity - addon.currentAttendees;
        const defaultAttendees = Math.min(numberOfGuests, availableSpots);
        
        if (defaultAttendees <= 0) {
          toast({
            title: 'Experience Full',
            description: 'This experience has no available spots left.',
            variant: 'destructive'
          });
          return;
        }
        
        setSelectedAddons(prev => [...prev, { instanceId, attendees: defaultAttendees }]);
      }
    }
  };

  const updateAttendees = (instanceId: UUID, attendees: number) => {
    setSelectedAddons(prev => 
      prev.map(addon => 
        addon.instanceId === instanceId 
          ? { ...addon, attendees } 
          : addon
      )
    );
  };

  const isAddonSelected = (instanceId: UUID) => {
    return selectedAddons.some(addon => addon.instanceId === instanceId);
  };

  const getAvailableSpots = (addon: ExperienceAddon) => {
    return addon.maxCapacity - addon.currentAttendees;
  };

  const handleSubmit = () => {
    onNext(selectedAddons);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-serif">Add Experiences to Your Stay</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-[100px] w-full" />
            <Skeleton className="h-[100px] w-full" />
            <Skeleton className="h-[100px] w-full" />
          </div>
        ) : availableAddons.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No experiences available during your stay dates.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {availableAddons.map((addon) => {
              const isSelected = isAddonSelected(addon.instanceId);
              const availableSpots = getAvailableSpots(addon);
              const selected = selectedAddons.find(a => a.instanceId === addon.instanceId);
              
              return (
                <div key={addon.instanceId} className="border rounded-lg p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    {addon.imageUrl && (
                      <div className="w-full md:w-1/4">
                        <img 
                          src={addon.imageUrl} 
                          alt={addon.name} 
                          className="h-32 w-full object-cover rounded-md"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-lg">{addon.name}</h3>
                          <p className="text-sm text-gray-500">
                            {format(new Date(addon.date), 'EEE, MMM d')} at {addon.time}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {addon.flatFeePrice !== null 
                              ? `₹${addon.flatFeePrice} per booking`
                              : `₹${addon.pricePerPerson} per person`
                            }
                          </p>
                          <p className="text-sm text-gray-500">
                            {availableSpots} {availableSpots === 1 ? 'spot' : 'spots'} left
                          </p>
                        </div>
                      </div>
                      
                      <p className="mt-2 text-sm">{addon.description}</p>
                      
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id={`addon-${addon.instanceId}`}
                            checked={isSelected}
                            onCheckedChange={() => toggleAddon(addon.instanceId)}
                            disabled={availableSpots <= 0 && !isSelected}
                          />
                          <Label 
                            htmlFor={`addon-${addon.instanceId}`}
                            className="font-medium"
                          >
                            Add to booking
                          </Label>
                        </div>
                        
                        {isSelected && addon.flatFeePrice === null && (
                          <div className="flex items-center space-x-2">
                            <Label htmlFor={`attendees-${addon.instanceId}`}>
                              Attendees:
                            </Label>
                            <Select
                              value={selected?.attendees.toString()}
                              onValueChange={(value) => updateAttendees(addon.instanceId, parseInt(value))}
                            >
                              <SelectTrigger 
                                id={`attendees-${addon.instanceId}`}
                                className="w-20"
                              >
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from(
                                  { length: Math.min(availableSpots + (selected?.attendees || 0), numberOfGuests) }, 
                                  (_, i) => i + 1
                                ).map(num => (
                                  <SelectItem key={num} value={num.toString()}>
                                    {num}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        <Separator className="my-6" />
        
        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            Continue to Guest Information
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyBookingStep2_Addons;
