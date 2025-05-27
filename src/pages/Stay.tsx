
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StayNavigation from '@/components/stay/StayNavigation';
import StayHeroSection from '@/components/stay/StayHeroSection';
import StayOverviewSection from '@/components/stay/StayOverviewSection';
import FloatingBookingButton from '@/components/stay/FloatingBookingButton';
import RecreationalFacilities from '@/components/location/RecreationalFacilities';
import TestimonialsSection from '@/components/testimonials/TestimonialsSection';
import { useStayBooking } from '@/hooks/useStayBooking';
import { useStayNavigation } from '@/hooks/useStayNavigation';

const Stay = () => {
  const { handleBookNowClick } = useStayBooking();
  const { amenitiesRef, scrollToSection } = useStayNavigation();
  
  const handleScrollToNext = () => scrollToSection(amenitiesRef);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <StayHeroSection 
        onBookNowClick={handleBookNowClick}
        onScrollToNext={handleScrollToNext}
      />
      
      {/* Navigation Section - Sticky */}
      <div className="sticky top-16 z-30 w-full">
        <StayNavigation />
      </div>
      
      {/* Overview/Introduction Section */}
      <StayOverviewSection forwardRef={amenitiesRef} />
      
      {/* Recreational Facilities Section */}
      <RecreationalFacilities />
      
      {/* Enhanced Testimonials Section */}
      <TestimonialsSection 
        category="stay"
        maxItems={6}
        title="Why Guests Love This Place"
        subtitle="Don't just take our word for it. Here's what our guests have to say about their stay at Haven."
      />
      
      {/* Floating Book Now Button */}
      <FloatingBookingButton onBookNowClick={handleBookNowClick} />
      
      <Footer />
    </div>
  );
};

export default Stay;
