
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StayHero from '@/components/stay/StayHero';
import StayNavigation from '@/components/stay/StayNavigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { Wifi, Tv, Coffee, UtensilsCrossed, Wind, Sparkles, Bath, Shirt, Car, AirVent, X } from 'lucide-react';
import { motion } from 'framer-motion';

const StayAmenities = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Define animation variants
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

  // Categories of amenities
  const amenityCategories = [
    {
      id: 'comfort',
      name: 'Comfort & Entertainment',
      amenities: [
        { 
          name: 'Air Conditioning',
          description: 'Powerful split AC units in all rooms ensure comfort even on the hottest days.',
          icon: <Wind className="h-5 w-5" />,
          available: true
        },
        { 
          name: 'Smart TV',
          description: 'Enjoy streaming your favorite shows on our 55" 4K Smart TV with Netflix, Prime, and more.',
          icon: <Tv className="h-5 w-5" />,
          available: true
        },
        { 
          name: 'High-Speed WiFi',
          description: 'Stay connected with complimentary fiber-optic WiFi throughout the property.',
          icon: <Wifi className="h-5 w-5" />,
          available: true
        },
        { 
          name: 'Premium Bedding',
          description: 'Sleep soundly on our hotel-quality mattresses with 100% cotton linens.',
          icon: <Sparkles className="h-5 w-5" />,
          available: true
        }
      ]
    },
    {
      id: 'convenience',
      name: 'Kitchen & Convenience',
      amenities: [
        { 
          name: 'Fully Equipped Kitchen',
          description: 'Modern kitchen with refrigerator, induction cooktop, microwave, and all essentials.',
          icon: <UtensilsCrossed className="h-5 w-5" />,
          available: true
        },
        { 
          name: 'Coffee Maker',
          description: 'Start your day with freshly brewed coffee from our premium coffee maker.',
          icon: <Coffee className="h-5 w-5" />,
          available: true
        },
        { 
          name: 'Laundry Facilities',
          description: 'Washing machine available for longer stays with complimentary eco-friendly detergent.',
          icon: <Shirt className="h-5 w-5" />,
          available: true
        },
        { 
          name: 'Parking',
          description: 'Secure private parking directly at the property for your vehicle.',
          icon: <Car className="h-5 w-5" />,
          available: true
        }
      ]
    },
    {
      id: 'bathroom',
      name: 'Bathroom & Essentials',
      amenities: [
        { 
          name: 'Rainfall Shower',
          description: 'Luxurious rainfall shower with hot water and premium natural toiletries.',
          icon: <Bath className="h-5 w-5" />,
          available: true
        },
        { 
          name: 'Fresh Towels',
          description: 'Plush, hotel-quality towels provided for each guest.',
          icon: <Sparkles className="h-5 w-5" />,
          available: true
        },
        { 
          name: 'Hairdryer',
          description: 'Professional-grade hairdryer available in the bathroom.',
          icon: <AirVent className="h-5 w-5" />,
          available: true
        }
      ]
    }
  ];

  // Gallery images
  const galleryImages = [
    {
      src: '/lovable-uploads/15811ea8-1b7c-41c0-9b75-05f249f60154.png',
      alt: 'Living area with comfortable seating',
      category: 'Interior'
    },
    {
      src: '/lovable-uploads/3d09a878-2b77-4c76-b9dc-916c5572305e.png',
      alt: 'Modern kitchen with all amenities',
      category: 'Kitchen'
    },
    {
      src: '/lovable-uploads/15b485a2-1d79-4783-ba80-f0cf6d9d7a20.png',
      alt: 'Bedroom with premium bedding',
      category: 'Bedroom'
    },
    {
      src: '/lovable-uploads/a768b355-2a53-4898-91c5-3372bc1fe662.png',
      alt: 'Stylish bathroom with rainfall shower',
      category: 'Bathroom'
    },
    {
      src: '/lovable-uploads/92fdb568-68f2-4ac8-9908-e0db6e29b56d.png',
      alt: 'Outdoor deck with seating',
      category: 'Outdoor'
    },
    {
      src: '/lovable-uploads/6f37f539-1310-49d2-965a-0c02228f5ced.png',
      alt: 'Rooftop deck with lake view',
      category: 'Outdoor'
    }
  ];

  return (
    <>
      <Navbar />
      <main>
        <StayHero 
          title="Amenities & Features"
          subtitle="Every detail has been thoughtfully designed to enhance your comfort and convenience."
          backgroundImage="/lovable-uploads/15811ea8-1b7c-41c0-9b75-05f249f60154.png"
        />
        <StayNavigation />
        
        {/* Amenities Section */}
        <section className="py-16">
          <div className="container-custom">
            <motion.div 
              initial="hidden" 
              animate="visible" 
              variants={fadeInUp}
              className="text-center mb-12"
            >
              <h2 className="font-serif text-3xl font-bold mb-4">Exceptional Amenities</h2>
              <p className="text-gray-700 max-w-3xl mx-auto">
                Our container retreat is equipped with everything you need for a comfortable and memorable stay.
                We've carefully selected each amenity to enhance your experience while maintaining our commitment to sustainability.
              </p>
            </motion.div>
            
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="space-y-16"
            >
              {amenityCategories.map((category) => (
                <div key={category.id} className="space-y-8">
                  <motion.h3 
                    variants={fadeInUp}
                    className="font-serif text-2xl font-semibold text-center"
                  >
                    {category.name}
                  </motion.h3>
                  
                  <motion.div 
                    variants={staggerContainer}
                    className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
                  >
                    {category.amenities.map((amenity, index) => (
                      <motion.div 
                        key={index}
                        variants={fadeInUp}
                        className="bg-white rounded-lg p-6 shadow-md border border-gray-50 hover:shadow-lg transition-shadow"
                      >
                        <div className="flex items-center mb-4">
                          <div className="bg-haven-green bg-opacity-10 p-3 rounded-full mr-4">
                            <span className="text-haven-green">
                              {amenity.icon}
                            </span>
                          </div>
                          <h4 className="font-medium">{amenity.name}</h4>
                        </div>
                        <p className="text-gray-600 text-sm">{amenity.description}</p>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>
        
        {/* Gallery Section */}
        <section className="py-16 bg-haven-beige bg-opacity-10">
          <div className="container-custom">
            <motion.div 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true }}
              variants={fadeInUp}
              className="text-center mb-12"
            >
              <h2 className="font-serif text-3xl font-bold mb-4">Gallery</h2>
              <p className="text-gray-700 max-w-3xl mx-auto">
                Take a closer look at our thoughtfully designed spaces and amenities.
                Click on any image to view in full size.
              </p>
            </motion.div>
            
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mx-auto flex justify-center mb-8">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="Interior">Interior</TabsTrigger>
                <TabsTrigger value="Kitchen">Kitchen</TabsTrigger>
                <TabsTrigger value="Bedroom">Bedroom</TabsTrigger>
                <TabsTrigger value="Bathroom">Bathroom</TabsTrigger>
                <TabsTrigger value="Outdoor">Outdoor</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-0">
                <motion.div 
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {galleryImages.map((image, index) => (
                    <motion.div 
                      key={index}
                      variants={fadeInUp}
                      className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer group"
                      onClick={() => setSelectedImage(image.src)}
                    >
                      <div className="relative h-64 overflow-hidden">
                        <img 
                          src={image.src} 
                          alt={image.alt}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                          decoding="async"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                          <span className="text-white text-sm">{image.alt}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </TabsContent>
              
              {["Interior", "Kitchen", "Bedroom", "Bathroom", "Outdoor"].map((category) => (
                <TabsContent key={category} value={category} className="mt-0">
                  <motion.div 
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    {galleryImages
                      .filter(image => image.category === category)
                      .map((image, index) => (
                        <motion.div 
                          key={index}
                          variants={fadeInUp}
                          className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer group"
                          onClick={() => setSelectedImage(image.src)}
                        >
                          <div className="relative h-64 overflow-hidden">
                            <img 
                              src={image.src} 
                              alt={image.alt}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              loading="lazy"
                              decoding="async"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                              <span className="text-white text-sm">{image.alt}</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                  </motion.div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>
        
        {/* House Rules Section */}
        <section className="py-16">
          <div className="container-custom">
            <motion.div 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true }}
              variants={fadeInUp}
              className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md"
            >
              <h2 className="font-serif text-2xl font-bold mb-6 text-center">House Rules & Policies</h2>
              
              <div className="space-y-4">
                <div className="border-b border-gray-100 pb-4">
                  <h3 className="font-medium mb-2">Check-in / Check-out</h3>
                  <p className="text-gray-600 text-sm">Check-in: 2:00 PM - 8:00 PM</p>
                  <p className="text-gray-600 text-sm">Check-out: 11:00 AM</p>
                  <p className="text-gray-600 text-sm mt-2">Early check-in and late check-out may be available upon request, subject to availability.</p>
                </div>
                
                <div className="border-b border-gray-100 pb-4">
                  <h3 className="font-medium mb-2">General Rules</h3>
                  <ul className="text-gray-600 text-sm space-y-2">
                    <li>• No smoking inside the container home. Smoking is permitted only in designated outdoor areas.</li>
                    <li>• Quiet hours from 10:00 PM to 7:00 AM to respect our neighbors and wildlife.</li>
                    <li>• Please conserve water and electricity during your stay.</li>
                    <li>• Pets are not allowed due to the sensitive lakeside ecosystem.</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Cancellation Policy</h3>
                  <p className="text-gray-600 text-sm">Free cancellation up to 7 days before check-in. Cancellations made within 7 days of check-in are eligible for a 50% refund, excluding service fees.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      
      {/* Image Lightbox */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-0 bg-transparent border-none">
          <div className="relative">
            <DialogClose className="absolute top-2 right-2 z-10">
              <Button variant="ghost" size="icon" className="rounded-full bg-black/50 hover:bg-black/70 text-white">
                <X className="h-5 w-5" />
              </Button>
            </DialogClose>
            <img 
              src={selectedImage || ''} 
              alt="Enlarged view" 
              className="w-full rounded-lg object-contain max-h-[80vh]"
            />
          </div>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </>
  );
};

export default StayAmenities;
