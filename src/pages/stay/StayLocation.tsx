
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LocationHero from '@/components/location/LocationHero';
import MapSection from '@/components/location/MapSection';
import NaturalSurroundings from '@/components/location/NaturalSurroundings';
import StayNavigation from '@/components/stay/StayNavigation';

const StayLocation = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <LocationHero />
      
      {/* Navigation Section - Sticky */}
      <div className="sticky top-16 z-30 w-full">
        <StayNavigation />
      </div>
      
      {/* Map Section */}
      <MapSection />
      
      {/* Natural Surroundings */}
      <NaturalSurroundings />
      
      <Footer />
    </div>
  );
};

export default StayLocation;
