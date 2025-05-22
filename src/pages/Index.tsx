
import { useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSlider from '@/components/home/HeroSlider';
import ContainerHomeSection from '@/components/home/ContainerHomeSection';
import ExperiencesSection from '@/components/home/ExperiencesSection';
import MasonryGallery from '@/components/home/MasonryGallery';
import StickyBookingWidget from '@/components/home/StickyBookingWidget';
import CallToAction from '@/components/home/CallToAction';
import NewsletterSignup from '@/components/home/NewsletterSignup';

const Index = () => {
  // Implement network-aware image loading
  useEffect(() => {
    const checkNetworkSpeed = () => {
      if (navigator.connection && 'downlink' in navigator.connection) {
        const connection = navigator.connection as any;
        if (connection.downlink < 1) {
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
    
    // Implement intersection observer for animations
    const observeElements = () => {
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
    };
    
    observeElements();
    
    return () => {
      // Cleanup if needed
    };
  }, []);
  
  return (
    <>
      <Navbar />
      <main>
        <HeroSlider />
        <ContainerHomeSection />
        <ExperiencesSection />
        <MasonryGallery />
        <CallToAction />
        <NewsletterSignup />
        <StickyBookingWidget />
      </main>
      <Footer />
    </>
  );
};

export default Index;
