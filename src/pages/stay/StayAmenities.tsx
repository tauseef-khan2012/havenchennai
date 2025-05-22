
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StayHero from '@/components/stay/StayHero';
import StayNavigation from '@/components/stay/StayNavigation';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Bed, Wifi, Tv, Bath, Fan, Utensils, Snowflake, Book, X } from 'lucide-react';
import { motion } from 'framer-motion';

const StayAmenities = () => {
  const [activeAmenity, setActiveAmenity] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState('');
  
  // Group amenities by category for better organization
  const amenities = {
    bedroom: [
      { name: 'Queen-sized bed with premium organic linens', icon: Bed },
      { name: 'Extra pillows and blankets', icon: Bed },
      { name: 'Blackout curtains', icon: Bed },
      { name: 'Bedside tables with reading lamps', icon: Bed },
    ],
    entertainment: [
      { name: 'Smart TV with Netflix access', icon: Tv },
      { name: 'Mood lighting throughout', icon: Tv },
      { name: 'Bluetooth sound system', icon: Tv },
      { name: 'Curated selection of books', icon: Book },
    ],
    bathroom: [
      { name: 'Modern bathroom with rainfall shower', icon: Bath },
      { name: 'Organic toiletries', icon: Bath },
      { name: 'Hair dryer', icon: Bath },
      { name: 'Plush towels', icon: Bath },
    ],
    workspace: [
      { name: 'Dedicated work desk with ergonomic chair', icon: Wifi },
      { name: 'Fast Wi-Fi connection', icon: Wifi },
      { name: 'Multiple power outlets', icon: Wifi },
      { name: 'Natural lighting', icon: Wifi },
    ],
    kitchen: [
      { name: 'Fully equipped kitchenette', icon: Utensils },
      { name: 'Local coffee and tea', icon: Utensils },
      { name: 'Mini refrigerator', icon: Utensils },
      { name: 'Microwave', icon: Utensils },
    ],
    comfort: [
      { name: 'Sustainable climate control', icon: Snowflake },
      { name: 'Ceiling fan', icon: Fan },
      { name: 'Multiple deck spaces', icon: Fan },
      { name: 'Indoor plants for fresh air', icon: Fan },
    ],
  };

  // Featured amenity images
  const featuredAmenities = [
    {
      name: 'Entertainment Center with Netflix',
      image: '/lovable-uploads/0f776507-f284-4d7c-9893-068e9aafd374.png',
      description: 'Relax with your favorite shows and movies on our smart TV with Netflix access and ambient mood lighting.'
    },
    {
      name: 'Curated Book Collection',
      image: '/lovable-uploads/e017493d-c2c0-467e-a191-28fe62a406ab.png',
      description: 'Enjoy our carefully selected books during your stay, perfect for quiet afternoons on the deck.'
    },
    {
      name: 'Work Desk Setup',
      image: '/lovable-uploads/d2fe6d2c-b060-49a3-99d0-62891571bc97.png',
      description: 'Stay productive with our comfortable work space, fast WiFi, and all the amenities you need.'
    }
  ];
  
  const openLightbox = (imageSrc: string) => {
    setCurrentImage(imageSrc);
    setLightboxOpen(true);
  };
  
  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <StayHero 
          title="Amenities & Features"
          subtitle="Every detail of our container home is designed for comfort and convenience."
          backgroundImage="/lovable-uploads/c23dc9bb-c7f4-47d3-8c31-2c792d241ee2.png"
        />
        <StayNavigation />
        
        <section className="py-16">
          <div className="container-custom">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="max-w-3xl mx-auto"
            >
              <h2 className="font-serif text-3xl font-bold mb-8 text-center">Everything You Need for a Perfect Stay</h2>
              <p className="text-gray-700 mb-10 text-center">
                Our container home is thoughtfully equipped with premium amenities to ensure your comfort and convenience.
                From the plush bedding to the sustainable climate control, we've thought of everything so you don't have to.
              </p>
              
              {/* Featured amenities with images */}
              <div className="mb-20 space-y-24">
                {featuredAmenities.map((amenity, index) => (
                  <motion.div 
                    key={index} 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={fadeInUp}
                    className={`flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 items-center`}
                  >
                    <div className="md:w-1/2">
                      <div 
                        className="relative overflow-hidden rounded-lg shadow-lg cursor-pointer group"
                        onClick={() => openLightbox(amenity.image)}
                      >
                        <img 
                          src={amenity.image} 
                          alt={amenity.name} 
                          className="w-full h-[300px] object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                          decoding="async"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                          <div className="text-white text-sm font-medium bg-black/50 px-3 py-1 rounded-full">
                            Click to enlarge
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="md:w-1/2">
                      <h3 className="font-serif text-2xl font-semibold mb-3">{amenity.name}</h3>
                      <p className="text-gray-700">{amenity.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeInUp}
                className="space-y-12"
              >
                {Object.entries(amenities).map(([category, items]) => (
                  <div key={category}>
                    <h3 className="font-serif text-xl font-semibold mb-4 capitalize">{category} Amenities</h3>
                    <motion.div 
                      variants={staggerContainer}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      className="grid md:grid-cols-2 gap-4"
                    >
                      {items.map((amenity, index) => (
                        <motion.div key={index} variants={fadeInUp}>
                          <Card 
                            className={`border-haven-green/20 hover:border-haven-green transition-all duration-300 cursor-pointer ${activeAmenity === `${category}-${index}` ? 'border-haven-green bg-haven-beige bg-opacity-10' : ''}`}
                            onClick={() => setActiveAmenity(activeAmenity === `${category}-${index}` ? null : `${category}-${index}`)}
                          >
                            <CardContent className="p-4 flex items-start space-x-3">
                              <amenity.icon className="h-5 w-5 text-haven-green flex-shrink-0 mt-0.5" />
                              <div>
                                <span className="block">{amenity.name}</span>
                                {activeAmenity === `${category}-${index}` && (
                                  <motion.p 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="text-sm text-gray-600 mt-1"
                                  >
                                    {getAmenityDescription(category, amenity.name)}
                                  </motion.p>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                ))}
              </motion.div>
              
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeInUp}
                className="mt-16 bg-haven-beige bg-opacity-20 p-6 rounded-lg"
              >
                <h3 className="font-serif text-xl font-semibold mb-3">Special Touches</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-haven-green mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Complimentary local wine upon arrival</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-haven-green mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Fresh organic breakfast basket (weekends only)</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-haven-green mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Yoga mats and meditation cushions</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-haven-green mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Curated guidebook to local attractions</span>
                  </li>
                </ul>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>
      
      {/* Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-transparent border-none">
          <div className="relative">
            <img 
              src={currentImage} 
              alt="Enlarged view" 
              className="w-full max-h-[80vh] object-contain"
            />
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-2 right-2 rounded-full bg-black/50 hover:bg-black/70 text-white"
              onClick={() => setLightboxOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </>
  );
};

// Helper function to get amenity descriptions
const getAmenityDescription = (category: string, name: string) => {
  const descriptions: Record<string, Record<string, string>> = {
    bedroom: {
      'Queen-sized bed with premium organic linens': 'Our custom queen bed features 100% organic cotton linens with a 600 thread count for the ultimate sleeping experience.',
      'Extra pillows and blankets': 'Different firmness options available to ensure your perfect night's sleep.',
      'Blackout curtains': 'Block out early morning light for uninterrupted rest.',
      'Bedside tables with reading lamps': 'Perfect for late-night reading with adjustable brightness.'
    },
    entertainment: {
      'Smart TV with Netflix access': 'A 50-inch smart TV with complimentary Netflix, Prime Video, and other streaming services.',
      'Mood lighting throughout': 'Adjustable lighting to create the perfect ambiance for any occasion.',
      'Bluetooth sound system': 'Connect your devices and enjoy your favorite music throughout your stay.',
      'Curated selection of books': 'A handpicked collection of books about local culture, nature, and fiction for your enjoyment.'
    },
    workspace: {
      'Dedicated work desk with ergonomic chair': 'A comfortable workspace designed for productivity with natural lighting.',
      'Fast Wi-Fi connection': 'High-speed fiber internet (100+ Mbps) for seamless video calls and streaming.',
      'Multiple power outlets': 'Conveniently placed outlets with USB ports throughout the space.',
      'Natural lighting': 'The desk is positioned to take advantage of natural light throughout the day.'
    }
  };
  
  return descriptions[category]?.[name] || 'Thoughtfully selected for your comfort and convenience.';
};

export default StayAmenities;
