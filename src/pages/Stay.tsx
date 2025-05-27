
import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import StayNavigation from '@/components/stay/StayNavigation';
import RecreationalFacilities from '@/components/location/RecreationalFacilities';
import { ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';

const Stay = () => {
  const navigate = useNavigate();
  
  // Refs for scroll sections
  const overviewRef = useRef<HTMLDivElement>(null);
  const amenitiesRef = useRef<HTMLDivElement>(null);
  const deckViewsRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  
  // Animation variants for sections
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };
  
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } }
  };

  // Use a consistent property ID for the Haven property
  const havenPropertyId = "550e8400-e29b-41d4-a716-446655440000";

  const handleBookNowClick = () => {
    navigate(`/booking?propertyId=${havenPropertyId}`);
  };
  
  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section 
        className="h-screen flex items-center justify-center relative snap-start scroll-mt-16"
        ref={overviewRef}
      >
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-kenBurns"
          style={{ 
            backgroundImage: 'url(/lovable-uploads/43aa0007-941b-4b51-b1a0-a2b67f4bc6d2.png)',
            filter: 'brightness(0.7)'
          }}
        />
        
        <div className="relative container-custom z-10 text-white">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="max-w-2xl"
          >
            <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4">
              Your Lakeside Haven
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Experience luxury and serenity in our custom-designed container home by Muttukadu Lake
            </p>
            <Button 
              className="bg-white text-haven-green hover:bg-opacity-90 text-lg px-8 py-6"
              onClick={handleBookNowClick}
            >
              Book Your Escape
            </Button>
          </motion.div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
          <button 
            onClick={() => scrollToSection(amenitiesRef)}
            aria-label="Scroll to learn more"
            className="flex flex-col items-center"
          >
            <span className="mb-2 text-sm font-light">Discover More</span>
            <ArrowDown className="h-6 w-6" />
          </button>
        </div>
      </section>
      
      {/* Navigation Section - Sticky */}
      <div className="sticky top-16 z-30 w-full">
        <StayNavigation />
      </div>
      
      {/* Overview/Introduction Section */}
      <section 
        className="min-h-screen py-16 bg-white snap-start scroll-mt-32"
        ref={amenitiesRef}
      >
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
            >
              <h2 className="font-serif text-3xl font-bold mb-6">The Haven Experience</h2>
              <p className="text-gray-700 mb-6">
                Our custom-designed container home offers the perfect blend of modern luxury and rustic charm, 
                situated on 5 acres of pristine woodland. Wake up to stunning views of nature through floor-to-ceiling 
                windows, enjoy your morning coffee on the private deck, and fall asleep to the gentle sounds of the forest.
              </p>
              
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center">
                  <div className="bg-haven-beige bg-opacity-30 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-2">
                    <svg className="h-8 w-8 text-haven-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <h3 className="font-medium">Peace</h3>
                </div>
                <div className="text-center">
                  <div className="bg-haven-beige bg-opacity-30 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-2">
                    <svg className="h-8 w-8 text-haven-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <h3 className="font-medium">Privacy</h3>
                </div>
                <div className="text-center">
                  <div className="bg-haven-beige bg-opacity-30 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-2">
                    <svg className="h-8 w-8 text-haven-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-medium">Views</h3>
                </div>
              </div>
              
              <Link to="/stay/amenities">
                <Button className="btn-primary mb-4 w-full">Explore Amenities</Button>
              </Link>
              <Link to="/stay/deck-views">
                <Button variant="outline" className="w-full">Discover Deck Views</Button>
              </Link>
            </motion.div>
            
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
              className="relative"
            >
              <div className="grid grid-cols-12 grid-rows-6 gap-2 h-[500px]">
                <div className="col-span-8 row-span-4 relative overflow-hidden rounded-lg shadow-lg">
                  <img 
                    src="/lovable-uploads/a768b355-2a53-4898-91c5-3372bc1fe662.png" 
                    alt="Container Home Exterior" 
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="col-span-4 row-span-3 relative overflow-hidden rounded-lg shadow-lg">
                  <img 
                    src="/lovable-uploads/c23dc9bb-c7f4-47d3-8c31-2c792d241ee2.png" 
                    alt="Container Home Interior" 
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="col-span-4 row-span-3 relative overflow-hidden rounded-lg shadow-lg">
                  <img 
                    src="/lovable-uploads/2d7b66e7-63b3-4b13-a6f3-9d253a5609aa.png" 
                    alt="Rooftop Deck" 
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="col-span-8 row-span-2 relative overflow-hidden rounded-lg shadow-lg">
                  <img 
                    src="/lovable-uploads/deda06e0-1382-4f56-875d-f5715e78fc08.png" 
                    alt="Container Home Bedroom" 
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Recreational Facilities Section */}
      <RecreationalFacilities />
      
      {/* Reviews Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-3xl font-bold mb-2">Why Guests Love This Place</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our guests have to say about their stay at Haven.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-100"
            >
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 flex mr-2">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <span className="text-gray-600 text-sm">5.0</span>
              </div>
              <p className="text-gray-700 mb-4">
                "The views from the rooftop deck were absolutely breathtaking. Watching the sunset over the lake was a highlight of our trip. Such a peaceful retreat!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-haven-green rounded-full flex items-center justify-center text-white font-medium mr-3">
                  RK
                </div>
                <div>
                  <p className="font-medium">Ravi Kumar</p>
                  <p className="text-gray-600 text-sm">April 2025</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-100"
              style={{ transitionDelay: "0.1s" }}
            >
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 flex mr-2">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <span className="text-gray-600 text-sm">5.0</span>
              </div>
              <p className="text-gray-700 mb-4">
                "The amenities were top-notch. From the premium coffee to the luxurious bed linens, every detail was thoughtfully curated. A perfect blend of comfort and style."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-haven-blue rounded-full flex items-center justify-center text-white font-medium mr-3">
                  AP
                </div>
                <div>
                  <p className="font-medium">Anika Patel</p>
                  <p className="text-gray-600 text-sm">March 2025</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-100"
              style={{ transitionDelay: "0.2s" }}
            >
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 flex mr-2">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <span className="text-gray-600 text-sm">5.0</span>
              </div>
              <p className="text-gray-700 mb-4">
                "The location is unbeatable. Close enough to attractions but secluded enough to feel like you're in your own world. The nearby trails were perfect for morning walks."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-haven-brown rounded-full flex items-center justify-center text-white font-medium mr-3">
                  MR
                </div>
                <div>
                  <p className="font-medium">Michael Rodriguez</p>
                  <p className="text-gray-600 text-sm">May 2025</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Floating Book Now Button */}
      <div className="fixed bottom-8 right-8 z-40">
        <Button 
          onClick={handleBookNowClick}
          className="bg-haven-green text-white hover:bg-opacity-90 shadow-lg px-6 py-6 rounded-full text-lg font-medium"
        >
          Book Now
        </Button>
      </div>
      
      <Footer />
    </div>
  );
};

export default Stay;
