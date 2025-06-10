
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StayHero from '@/components/stay/StayHero';
import StayNavigation from '@/components/stay/StayNavigation';
import { Attraction } from '@/types/location';
import MapSection from '@/components/location/MapSection';
import AttractionsSection from '@/components/location/AttractionsSection';
import NaturalSurroundings from '@/components/location/NaturalSurroundings';
import AttractionModal from '@/components/location/AttractionModal';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Car } from 'lucide-react';

const StayLocation = () => {
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null);
  
  const locationHighlights = [
    {
      icon: <MapPin className="h-6 w-6 text-haven-yellow" />,
      title: "Prime OMR Location",
      description: "Easily accessible from Chennai city center via the OMR highway, offering the perfect balance of connectivity and tranquility."
    },
    {
      icon: <Clock className="h-6 w-6 text-haven-yellow" />,
      title: "Quick Access",
      description: "45 minutes from Chennai Airport, 30 minutes from IT Corridor, making it ideal for business travelers and weekend getaways."
    },
    {
      icon: <Car className="h-6 w-6 text-haven-yellow" />,
      title: "Convenient Parking",
      description: "Covered parking for 2 cars with direct access to the container home and easy loading/unloading."
    }
  ];
  
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <StayHero 
          title="Our Location"
          subtitle="Nestled beside serene Muttukadu Lake on Chennai's OMR, offering perfect accessibility with natural beauty."
          backgroundImage="/lovable-uploads/92fdb568-68f2-4ac8-9908-e0db6e29b56d.png"
        />
        <StayNavigation />
        
        {/* Location Overview */}
        <section className="py-16 bg-navy-gradient relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-organic-texture opacity-20"></div>
          <div className="absolute inset-0 leaf-pattern opacity-10"></div>
          
          <div className="container-custom relative z-10">
            <div className="text-center mb-12 animate-fade-in">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="w-12 h-1 bg-yellow-gradient rounded-full"></div>
                <span className="font-handwritten text-2xl text-haven-yellow">Strategic Location</span>
                <div className="w-12 h-1 bg-yellow-gradient rounded-full"></div>
              </div>
              <h1 className="text-4xl lg:text-5xl font-serif font-bold text-haven-beige mb-6">
                Padur, Chennai OMR
                <span className="block text-haven-yellow">Beside Muttukadu Lake</span>
              </h1>
              <p className="text-haven-beige/90 text-lg leading-relaxed max-w-3xl mx-auto">
                Strategically located on Chennai's Old Mahabalipuram Road (OMR), Haven offers easy access to the city while providing a peaceful lakeside retreat experience.
              </p>
            </div>

            {/* Location Highlights */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {locationHighlights.map((highlight, index) => (
                <div
                  key={index}
                  className="glass-panel-navy rounded-3xl p-8 text-center hover-lift transition-all duration-500 animate-fade-in group"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300 flex justify-center">
                    {highlight.icon}
                  </div>
                  <h3 className="font-serif text-xl font-bold mb-4 text-haven-beige group-hover:text-haven-yellow transition-colors duration-300">
                    {highlight.title}
                  </h3>
                  <p className="text-haven-beige/80 leading-relaxed text-sm">
                    {highlight.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Quick Access Info */}
            <div className="glass-panel-navy rounded-3xl p-8 text-center">
              <Badge className="mb-4 bg-haven-yellow/20 text-haven-yellow border-haven-yellow/30">
                Travel Times
              </Badge>
              <h3 className="font-serif text-2xl font-bold mb-6 text-haven-beige">
                Easy Access from Key Locations
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <div className="text-3xl font-bold text-haven-yellow mb-2">45</div>
                  <div className="text-sm text-haven-beige/70">Minutes from Chennai Airport</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-haven-yellow mb-2">30</div>
                  <div className="text-sm text-haven-beige/70">Minutes from IT Corridor</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-haven-yellow mb-2">60</div>
                  <div className="text-sm text-haven-beige/70">Minutes from Chennai Central</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-haven-yellow mb-2">15</div>
                  <div className="text-sm text-haven-beige/70">Minutes to Mahabalipuram</div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Map Section */}
        <MapSection />
        
        <div className="container-custom">
          {/* Nearby Attractions */}
          <AttractionsSection onSelectAttraction={setSelectedAttraction} />
        </div>
        
        {/* Natural Surroundings Section */}
        <NaturalSurroundings />
      </main>
      
      {/* Attraction Detail Modal */}
      <AttractionModal 
        attraction={selectedAttraction} 
        onClose={() => setSelectedAttraction(null)} 
      />
      
      <Footer />
    </>
  );
};

export default StayLocation;
