
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { MapPin, X } from 'lucide-react';
import { Attraction } from '@/types/location';

interface AttractionModalProps {
  attraction: Attraction | null;
  onClose: () => void;
}

const AttractionModal = ({ attraction, onClose }: AttractionModalProps) => {
  if (!attraction) return null;
  
  return (
    <Dialog open={!!attraction} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <div>
          <div className="relative h-40 mb-4 -mt-6 -mx-6 overflow-hidden">
            <img 
              src={attraction.image} 
              alt={attraction.name} 
              className="w-full h-full object-cover"
            />
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-2 right-2 rounded-full bg-black/50 hover:bg-black/70 text-white"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-serif text-xl font-semibold">{attraction.name}</h3>
            <span className="bg-haven-beige bg-opacity-40 px-3 py-1 rounded-full text-sm">
              {attraction.distance}
            </span>
          </div>
          
          <p className="text-gray-700 mb-6">{attraction.description}</p>
          
          <div className="flex justify-between">
            <Button variant="outline" size="sm">
              <MapPin className="h-4 w-4 mr-2" />
              Get Directions
            </Button>
            
            <a href={attraction.website} target="_blank" rel="noopener noreferrer">
              <Button variant="default" size="sm" className="bg-haven-green hover:bg-haven-green/90">
                Visit Website
              </Button>
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AttractionModal;
