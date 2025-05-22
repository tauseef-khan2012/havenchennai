
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

const StayLocation = () => {
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null);
  
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <StayHero 
          title="Our Location"
          subtitle="Nestled beside the serene Muttukadu Lake, Haven offers the perfect balance of seclusion and accessibility."
          backgroundImage="/lovable-uploads/92fdb568-68f2-4ac8-9908-e0db6e29b56d.png"
        />
        <StayNavigation />
        
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
