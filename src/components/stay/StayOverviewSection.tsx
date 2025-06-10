
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Building, Layers, Wifi, Car, Bed, ChefHat, Monitor, Volume2 } from 'lucide-react';
import CheckAvailabilityButton from './CheckAvailabilityButton';

interface StayOverviewSectionProps {
  forwardRef?: React.RefObject<HTMLDivElement>;
}

const StayOverviewSection: React.FC<StayOverviewSectionProps> = ({ forwardRef }) => {
  const amenities = [
    { icon: Wifi, label: "Wi-Fi (100 Mbps)" },
    { icon: ChefHat, label: "Fully Equipped Kitchen" },
    { icon: Car, label: "Parking for 2 Cars" },
    { icon: Bed, label: "Wakefit Mattresses" },
    { icon: Monitor, label: "32-inch Monitor/Smart TV" },
    { icon: Volume2, label: "JBL Flip 5 Speaker" }
  ];

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
                  alt="Rooftop deck with panoramic lake views"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square rounded-lg overflow-hidden">
                <img 
                  src="/lovable-uploads/032b0326-be0f-4d2f-bc40-e4873823e984.png" 
                  alt="Dedicated workspace with monitor"
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
                Haven: Two Stacked Container Houses
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                Haven is an intimate getaway thoughtfully built using two stacked container houses, aimed at bringing people closer together. 
                Nestled beside the serene Muttukadu Lake, it blends minimal living with expansive views.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Inspired by personal travels and the quiet magic of container living, Haven is more than a stay—it's a feeling. 
                Every element, from its upcycled materials to its minimal interiors, is rooted in sustainability and mindful living.
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
                  <span className="text-gray-700">Two stacked containers with sustainable, upcycled construction</span>
                </li>
                <li className="flex items-start">
                  <MapPin className="h-5 w-5 text-haven-teal mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Lakeside location with rich birdlife including pelicans, flamingos, and herons</span>
                </li>
                <li className="flex items-start">
                  <Layers className="h-5 w-5 text-haven-teal mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Three deck spaces including a 160 sq ft rooftop deck with panoramic views</span>
                </li>
              </ul>
            </div>

            {/* Amenities Grid */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Amenities</h3>
              <div className="grid grid-cols-2 gap-3">
                {amenities.map((amenity, index) => {
                  const Icon = amenity.icon;
                  return (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                      <Icon className="h-4 w-4 text-haven-teal" />
                      <span>{amenity.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Check Availability Button */}
            <div className="pt-4">
              <CheckAvailabilityButton />
            </div>
          </div>
        </div>

        {/* Detailed Property Information */}
        <div className="mt-16 grid md:grid-cols-2 gap-8">
          <div className="bg-gray-50 p-8 rounded-lg">
            <h3 className="text-2xl font-serif font-bold mb-6 text-gray-900">Top Container (First Floor)</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <Bed className="h-4 w-4 text-haven-teal mt-1 mr-2 flex-shrink-0" />
                <span>Bunk bed setup (queen-size bottom, single top with ladder)</span>
              </li>
              <li className="flex items-start">
                <Monitor className="h-4 w-4 text-haven-teal mt-1 mr-2 flex-shrink-0" />
                <span>Dedicated workspace with 32-inch monitor, keyboard, and mouse</span>
              </li>
              <li className="flex items-start">
                <Volume2 className="h-4 w-4 text-haven-teal mt-1 mr-2 flex-shrink-0" />
                <span>25 curated books and JBL Flip 5 speaker</span>
              </li>
            </ul>
          </div>

          <div className="bg-gray-50 p-8 rounded-lg">
            <h3 className="text-2xl font-serif font-bold mb-6 text-gray-900">Ground Floor Container</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <Bed className="h-4 w-4 text-haven-teal mt-1 mr-2 flex-shrink-0" />
                <span>Sofa-cum-bed for two (suitable for guests up to 6 feet tall)</span>
              </li>
              <li className="flex items-start">
                <ChefHat className="h-4 w-4 text-haven-teal mt-1 mr-2 flex-shrink-0" />
                <span>Fully equipped kitchen with induction stove, utensils, spices, coffee, and teas</span>
              </li>
              <li className="flex items-start">
                <Building className="h-4 w-4 text-haven-teal mt-1 mr-2 flex-shrink-0" />
                <span>Bathroom with soap, shampoo, towels, and beautifully tiled interiors</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StayOverviewSection;
