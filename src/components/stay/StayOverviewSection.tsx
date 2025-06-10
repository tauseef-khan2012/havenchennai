
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Building, Layers, Wifi, Car, Bed, ChefHat, Monitor, Volume2, Leaf, Heart } from 'lucide-react';
import CheckAvailabilityButton from './CheckAvailabilityButton';

interface StayOverviewSectionProps {
  forwardRef?: React.RefObject<HTMLDivElement>;
}

const StayOverviewSection: React.FC<StayOverviewSectionProps> = ({ forwardRef }) => {
  const amenities = [
    { icon: Wifi, label: "High-Speed Wi-Fi (500 Mbps)" },
    { icon: ChefHat, label: "Fully Equipped Kitchen" },
    { icon: Car, label: "Parking for 2 Cars" },
    { icon: Bed, label: "Wakefit 8-inch Foam-Spring Mattresses" },
    { icon: Monitor, label: "32-inch Monitor/Smart TV" },
    { icon: Volume2, label: "JBL Flip 5 Premium Speaker" }
  ];

  const keyFeatures = [
    {
      icon: <Building className="h-12 w-12 text-haven-yellow" />,
      title: "Sustainable Container Architecture",
      description: "Thoughtfully constructed using eco-friendly, upcycled shipping containers that showcase sustainable design without compromising on comfort. Our innovative approach to container living demonstrates how sustainable architecture can create unique, environmentally conscious accommodation experiences.",
      highlight: "Eco-Friendly Construction"
    },
    {
      icon: <MapPin className="h-12 w-12 text-haven-yellow" />,
      title: "Prime Lakeside Location with Rich Birdlife",
      description: "Situated in Padur along Chennai's OMR beside the serene Muttukadu Lake, offering unparalleled access to diverse wildlife including pelicans, flamingos, herons, and exotic bird species. The location provides the perfect balance of accessibility and natural immersion.",
      highlight: "Muttukadu Lake Sanctuary"
    },
    {
      icon: <Layers className="h-12 w-12 text-haven-yellow" />,
      title: "Three Unique Deck Spaces",
      description: "Experience multiple perspectives with our thoughtfully designed deck levels, including a spectacular 160 sq ft rooftop deck offering panoramic views of Muttukadu Lake. Each level provides different vantage points for relaxation, work, and nature observation.",
      highlight: "Panoramic Lake Views"
    }
  ];

  return (
    <section ref={forwardRef} className="py-16 bg-navy-gradient relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-organic-texture opacity-20"></div>
      <div className="absolute inset-0 leaf-pattern opacity-10"></div>
      
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Images */}
          <div className="space-y-6 animate-fade-in">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-navy">
              <img 
                src="/lovable-uploads/0bf49c3a-e3e0-4828-badd-a492dc4dd957.png" 
                alt="Haven Chennai - Unique container home accommodation beside Muttukadu Lake showcasing sustainable architecture and eco-friendly design"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-navy">
                <img 
                  src="/lovable-uploads/80ae807c-39e1-4519-b19a-ed92c4b221cd.png" 
                  alt="Rooftop deck at Haven container home Chennai with panoramic Muttukadu Lake views and outdoor seating"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              <div className="aspect-square rounded-2xl overflow-hidden shadow-navy">
                <img 
                  src="/lovable-uploads/032b0326-be0f-4d2f-bc40-e4873823e984.png" 
                  alt="Dedicated workspace in Haven Chennai container home featuring 32-inch monitor and ergonomic setup for digital nomads"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="space-y-8 animate-fade-in-delay">
            <div>
              <Badge variant="secondary" className="mb-4 bg-haven-yellow text-haven-navy">
                <MapPin className="h-3 w-3 mr-1" />
                Padur, Muttukadu Lake, Chennai OMR
              </Badge>
              <h1 className="text-4xl lg:text-5xl font-serif font-bold text-haven-beige mb-6">
                Haven: Sustainable Container Home
                <span className="block text-haven-yellow">Lakeside Accommodation</span>
              </h1>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-6">
              <div className="glass-panel-navy p-6 rounded-2xl text-center hover-lift">
                <div className="flex items-center justify-center mb-2">
                  <Users className="h-8 w-8 text-haven-yellow" />
                </div>
                <div className="text-3xl font-bold text-haven-beige animate-breathe">5</div>
                <div className="text-sm text-haven-beige/70 font-semibold">Max Guests</div>
              </div>
              <div className="glass-panel-navy p-6 rounded-2xl text-center hover-lift">
                <div className="flex items-center justify-center mb-2">
                  <Layers className="h-8 w-8 text-haven-yellow" />
                </div>
                <div className="text-3xl font-bold text-haven-beige animate-breathe" style={{ animationDelay: '0.5s' }}>3</div>
                <div className="text-sm text-haven-beige/70 font-semibold">Deck Levels</div>
              </div>
            </div>

            {/* Premium Amenities */}
            <div className="space-y-4">
              <h2 className="text-xl font-serif font-semibold text-haven-yellow">Premium Amenities</h2>
              <div className="grid grid-cols-2 gap-3">
                {amenities.map((amenity, index) => {
                  const Icon = amenity.icon;
                  return (
                    <div key={index} className="flex items-center gap-2 text-sm text-haven-beige/80">
                      <Icon className="h-4 w-4 text-haven-yellow" />
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

        {/* What Makes Haven Special - Featured Section */}
        <div className="mt-20">
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-1 bg-yellow-gradient rounded-full"></div>
              <span className="font-handwritten text-2xl text-haven-yellow">What Makes Haven Special</span>
              <div className="w-12 h-1 bg-yellow-gradient rounded-full"></div>
            </div>
            <h2 className="font-serif text-4xl lg:text-5xl font-bold text-haven-beige">
              Three Unique Elements That Define
              <span className="block text-haven-yellow">Your Haven Experience</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {keyFeatures.map((feature, index) => (
              <div
                key={index}
                className="glass-panel-navy rounded-3xl p-8 text-center hover-lift transition-all duration-500 animate-fade-in group"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <Badge className="mb-4 bg-haven-yellow/20 text-haven-yellow border-haven-yellow/30">
                  {feature.highlight}
                </Badge>
                <h3 className="font-serif text-xl font-bold mb-4 text-haven-beige group-hover:text-haven-yellow transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-haven-beige/80 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Property Information */}
        <div className="mt-16 grid md:grid-cols-2 gap-8">
          <div className="glass-panel-navy p-8 rounded-3xl shadow-navy">
            <h3 className="text-2xl font-serif font-bold mb-6 text-haven-yellow">Top Container (First Floor)</h3>
            <ul className="space-y-3 text-haven-beige/80">
              <li className="flex items-start">
                <Bed className="h-4 w-4 text-haven-yellow mt-1 mr-2 flex-shrink-0" />
                <span>Premium bunk bed configuration (queen-size bottom, single top with safety ladder)</span>
              </li>
              <li className="flex items-start">
                <Monitor className="h-4 w-4 text-haven-yellow mt-1 mr-2 flex-shrink-0" />
                <span>Professional workspace with 32-inch monitor, ergonomic keyboard, and wireless mouse</span>
              </li>
              <li className="flex items-start">
                <Volume2 className="h-4 w-4 text-haven-yellow mt-1 mr-2 flex-shrink-0" />
                <span>Curated library of 25 books and JBL Flip 5 premium speaker system</span>
              </li>
            </ul>
          </div>

          <div className="glass-panel-navy p-8 rounded-3xl shadow-navy">
            <h3 className="text-2xl font-serif font-bold mb-6 text-haven-yellow">Ground Floor Container</h3>
            <ul className="space-y-3 text-haven-beige/80">
              <li className="flex items-start">
                <Bed className="h-4 w-4 text-haven-yellow mt-1 mr-2 flex-shrink-0" />
                <span>Comfortable sofa-cum-bed for two guests (suitable for guests up to 6 feet tall)</span>
              </li>
              <li className="flex items-start">
                <ChefHat className="h-4 w-4 text-haven-yellow mt-1 mr-2 flex-shrink-0" />
                <span>Fully equipped kitchen with induction stove, premium utensils, spices, coffee, and specialty teas</span>
              </li>
              <li className="flex items-start">
                <Building className="h-4 w-4 text-haven-yellow mt-1 mr-2 flex-shrink-0" />
                <span>Modern bathroom with premium toiletries, fresh towels, and beautifully tiled interiors</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StayOverviewSection;
