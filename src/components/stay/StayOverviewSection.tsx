
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Building, Layers } from 'lucide-react';
import CheckAvailabilityButton from './CheckAvailabilityButton';

interface StayOverviewSectionProps {
  forwardRef?: React.RefObject<HTMLDivElement>;
}

const StayOverviewSection: React.FC<StayOverviewSectionProps> = ({ forwardRef }) => {
  return (
    <section ref={forwardRef} className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Images */}
          <div className="space-y-6">
            <div className="aspect-[4/3] rounded-lg overflow-hidden">
              <img 
                src="/lovable-uploads/0bf49c3a-e3e0-4828-badd-a492dc4dd957.png" 
                alt="Haven Container Home Exterior"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square rounded-lg overflow-hidden">
                <img 
                  src="/lovable-uploads/80ae807c-39e1-4519-b19a-ed92c4b221cd.png" 
                  alt="Rooftop deck view"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square rounded-lg overflow-hidden">
                <img 
                  src="/lovable-uploads/032b0326-be0f-4d2f-bc40-e4873823e984.png" 
                  alt="Interior workspace"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="space-y-8">
            <div>
              <Badge variant="secondary" className="mb-4">
                <MapPin className="h-3 w-3 mr-1" />
                Muttukadu Lake, Chennai
              </Badge>
              <h2 className="text-4xl font-serif font-bold text-gray-900 mb-6">
                Haven: Your Lakeside Container Retreat
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Escape to our unique stacked container home overlooking the serene Muttukadu Lake. 
                This architectural marvel combines sustainable living with modern luxury, offering 
                an intimate retreat perfect for couples, solo travelers, or small groups seeking 
                tranquility and connection with nature.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="h-8 w-8 text-haven-teal" />
                </div>
                <div className="text-3xl font-bold text-gray-900">5</div>
                <div className="text-sm text-gray-600">Max Guests</div>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <div className="flex items-center justify-center mb-2">
                  <Layers className="h-8 w-8 text-haven-teal" />
                </div>
                <div className="text-3xl font-bold text-gray-900">3</div>
                <div className="text-sm text-gray-600">Deck Levels</div>
              </div>
            </div>

            {/* Key Features */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">What Makes Haven Special</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Building className="h-5 w-5 text-haven-teal mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Sustainable architecture using repurposed shipping containers</span>
                </li>
                <li className="flex items-start">
                  <MapPin className="h-5 w-5 text-haven-teal mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Prime lakeside location with panoramic water views</span>
                </li>
                <li className="flex items-start">
                  <Layers className="h-5 w-5 text-haven-teal mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Multi-level deck spaces for work, relaxation, and dining</span>
                </li>
              </ul>
            </div>

            {/* Check Availability Button */}
            <div className="pt-4">
              <CheckAvailabilityButton />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StayOverviewSection;
