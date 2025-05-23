
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
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { useErrorHandler } from '@/hooks/useErrorHandler';

// Hero slides data
const heroSlides = [
  {
    id: '1',
    image: '/lovable-uploads/ba10980e-eaed-41d2-950b-de5ba0f75e97.png',
    lowResImage: '/lovable-uploads/ba10980e-eaed-41d2-950b-de5ba0f75e97.png',
    title: 'Welcome to Haven',
    subtitle: 'Experience sustainable luxury in our unique container home retreat',
    cta: {
      text: 'Book Your Stay',
      href: '/booking'
    }
  },
  {
    id: '2',
    image: '/lovable-uploads/deda06e0-1382-4f56-875d-f5715e78fc08.png',
    lowResImage: '/lovable-uploads/deda06e0-1382-4f56-875d-f5715e78fc08.png',
    title: 'Reconnect with Nature',
    subtitle: 'Immerse yourself in breathtaking landscapes and pristine wilderness',
    cta: {
      text: 'Explore Location',
      href: '/location'
    }
  },
  {
    id: '3',
    image: '/lovable-uploads/c23dc9bb-c7f4-47d3-8c31-2c792d241ee2.png',
    lowResImage: '/lovable-uploads/c23dc9bb-c7f4-47d3-8c31-2c792d241ee2.png',
    title: 'Unforgettable Experiences',
    subtitle: 'Discover adventures that will create memories to last a lifetime',
    cta: {
      text: 'View Experiences',
      href: '/experiences'
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
