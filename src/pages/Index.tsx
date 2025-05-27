import { useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { EnhancedHeroSlider } from '@/components/home/EnhancedHeroSlider';
import ContainerHomeSection from '@/components/home/ContainerHomeSection';
import ExperiencesSection from '@/components/home/ExperiencesSection';
import MasonryGallery from '@/components/home/MasonryGallery';
import StickyBookingWidget from '@/components/home/StickyBookingWidget';
import CallToAction from '@/components/home/CallToAction';
import NewsletterSignup from '@/components/home/NewsletterSignup';
import FeaturedTestimonials from '@/components/testimonials/FeaturedTestimonials';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { useErrorHandler } from '@/hooks/useErrorHandler';

// Hero slides data with best scenic deck shots
const heroSlides = [
  {
    id: '1',
    image: '/lovable-uploads/fdf4ae09-782a-476b-b866-173bf4816200.png',
    lowResImage: '/lovable-uploads/fdf4ae09-782a-476b-b866-173bf4816200.png',
    title: 'Welcome to Haven',
    subtitle: 'Experience sustainable luxury in our unique container home retreat',
    cta: {
      text: 'Book Your Stay',
      href: '/booking'
    }
  },
  {
    id: '2',
    image: '/lovable-uploads/dca2b7eb-af54-4c6e-8739-8add4f661dba.png',
    lowResImage: '/lovable-uploads/dca2b7eb-af54-4c6e-8739-8add4f661dba.png',
    title: 'Spectacular Sunset Views',
    subtitle: 'Watch breathtaking sunsets from our multi-level deck spaces',
    cta: {
      text: 'Explore Deck Views',
      href: '/stay/deck-views'
    }
  },
  {
    id: '3',
    image: '/lovable-uploads/54bc279a-b178-45ae-a1a2-5d06ad1c435d.png',
    lowResImage: '/lovable-uploads/54bc279a-b178-45ae-a1a2-5d06ad1c435d.png',
    title: 'Rooftop Serenity',
    subtitle: 'Find peace and tranquility on our panoramic rooftop deck',
    cta: {
      text: 'View Amenities',
      href: '/stay/amenities'
    }
  },
  {
    id: '4',
    image: '/lovable-uploads/d62143b5-3f29-4040-9d6c-f00ea43f861e.png',
    lowResImage: '/lovable-uploads/d62143b5-3f29-4040-9d6c-f00ea43f861e.png',
    title: 'Multi-Level Living',
    subtitle: 'Experience unique perspectives from every deck level',
    cta: {
      text: 'Discover More',
      href: '/stay'
    }
  },
  {
    id: '5',
    image: '/lovable-uploads/44941cd5-2bc4-4e82-8698-7916b158ebd5.png',
    lowResImage: '/lovable-uploads/44941cd5-2bc4-4e82-8698-7916b158ebd5.png',
    title: 'Golden Hour Magic',
    subtitle: 'Capture unforgettable moments during the golden hour',
    cta: {
      text: 'Book Your Escape',
      href: '/booking'
    }
  }
];

const Index = () => {
  const { handleError } = useErrorHandler();

  // Implement network-aware image loading and animations
  useEffect(() => {
    try {
      // Network speed detection
      const checkNetworkSpeed = () => {
        const nav = navigator as any;
        if (nav.connection && typeof nav.connection.downlink === 'number') {
          if (nav.connection.downlink < 1) {
            document.querySelectorAll('img[data-lowres]').forEach(img => {
              const element = img as HTMLImageElement;
              if (element.dataset.lowres) {
                element.src = element.dataset.lowres;
              }
            });
          }
        }
      };
      
      checkNetworkSpeed();
      
      // Intersection observer for animations
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      
      document.querySelectorAll('section').forEach(section => {
        section.classList.add('opacity-0', 'translate-y-8', 'transition-all', 'duration-700');
        observer.observe(section);
      });
      
      return () => observer.disconnect();
    } catch (error) {
      handleError(error, { showToast: false, title: "Animation setup failed" });
    }
  }, [handleError]);
  
  return (
    <ErrorBoundary>
      <Navbar />
      <main>
        <EnhancedHeroSlider slides={heroSlides} />
        
        <ErrorBoundary fallback={
          <div className="py-16 text-center">
            <p>Unable to load container home section</p>
          </div>
        }>
          <ContainerHomeSection />
        </ErrorBoundary>
        
        <ErrorBoundary fallback={
          <div className="py-16 text-center">
            <p>Unable to load experiences section</p>
          </div>
        }>
          <ExperiencesSection />
        </ErrorBoundary>
        
        <ErrorBoundary fallback={
          <div className="py-16 text-center">
            <p>Unable to load gallery section</p>
          </div>
        }>
          <MasonryGallery />
        </ErrorBoundary>
        
        <ErrorBoundary fallback={
          <div className="py-16 text-center">
            <p>Unable to load testimonials section</p>
          </div>
        }>
          <FeaturedTestimonials />
        </ErrorBoundary>
        
        <ErrorBoundary>
          <CallToAction />
        </ErrorBoundary>
        
        <ErrorBoundary>
          <NewsletterSignup />
        </ErrorBoundary>
        
        <StickyBookingWidget />
      </main>
      <Footer />
    </ErrorBoundary>
  );
};

export default Index;
