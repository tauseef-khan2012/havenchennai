
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StayHero from '@/components/stay/StayHero';
import StayNavigation from '@/components/stay/StayNavigation';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Eye, Camera, Sunrise, Sunset } from 'lucide-react';
import { motion } from 'framer-motion';

const StayDeckViews = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState('');
  
  const deckLevels = [
    {
      name: 'Rooftop Deck',
      size: '160 sq ft',
      description: 'Panoramic 360-degree views of Muttukadu Lake with dedicated yoga space and ambient lighting.',
      image: '/lovable-uploads/fdf4ae09-782a-476b-b866-173bf4816200.png',
      highlights: ['Panoramic lake views', 'Yoga & meditation space', 'Sunset photography', 'Stargazing']
    },
    {
      name: 'First Floor Deck',
      size: 'Elevated',
      description: 'Perfect mid-level perspective with comfortable seating and privacy for morning coffee.',
      image: '/lovable-uploads/4d8ae28d-5b42-4bd6-9ed3-83acb04bb29b.png',
      highlights: ['Lake views', 'Bird watching', 'Private seating', 'Morning coffee spot']
    },
    {
      name: 'Ground Floor Deck',
      size: 'Spacious',
      description: 'Garden-level deck surrounded by tropical plants with multiple seating arrangements.',
      image: '/lovable-uploads/913eeb57-1adb-4da7-a61b-ba718b4849d7.png',
      highlights: ['Garden access', 'Tropical plants', 'Group seating', 'Natural shade']
    }
  ];
  
  const timeOfDay = [
    { icon: Sunrise, label: 'Dawn', activity: 'Rooftop yoga, lake mist' },
    { icon: Eye, label: 'Midday', activity: 'Clear panoramic views' },
    { icon: Camera, label: 'Golden Hour', activity: 'Sunset photography' },
    { icon: Sunset, label: 'Evening', activity: 'Stargazing, night lights' }
  ];
  
  const openLightbox = (imageSrc: string) => {
    setCurrentImage(imageSrc);
    setLightboxOpen(true);
  };
  
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <StayHero 
          title="Multi-Level Deck Views"
          subtitle="Experience Muttukadu Lake from three unique perspectives across our thoughtfully designed deck levels."
          backgroundImage="/lovable-uploads/fdf4ae09-782a-476b-b866-173bf4816200.png"
        />
        <StayNavigation />
        
        <section className="py-16 bg-navy-gradient relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-organic-texture opacity-20"></div>
          <div className="absolute inset-0 leaf-pattern opacity-10"></div>
          
          <div className="container-custom relative z-10">
            {/* Header */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="w-12 h-1 bg-yellow-gradient rounded-full"></div>
                <span className="font-handwritten text-2xl text-haven-yellow">Three Perspectives</span>
                <div className="w-12 h-1 bg-yellow-gradient rounded-full"></div>
              </div>
              <h1 className="font-serif text-4xl lg:text-5xl font-bold text-haven-beige mb-6">
                Spectacular Views from
                <span className="block text-haven-yellow">Every Level</span>
              </h1>
              <p className="text-haven-beige/90 text-lg leading-relaxed max-w-3xl mx-auto">
                Each deck level offers unique perspectives of Muttukadu Lake, from intimate ground-level gardens to breathtaking rooftop panoramas.
              </p>
            </motion.div>
            
            {/* Deck Levels */}
            <div className="space-y-16 mb-16">
              {deckLevels.map((deck, index) => (
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
                      className="relative overflow-hidden rounded-3xl shadow-navy cursor-pointer group hover-lift transition-all duration-500"
                      onClick={() => openLightbox(deck.image)}
                    >
                      <img 
                        src={deck.image} 
                        alt={`${deck.name} at Haven Chennai lakeside container home`}
                        className="w-full h-[350px] object-cover transition-transform duration-700 group-hover:scale-105" 
                        loading="lazy" 
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="text-haven-beige text-sm font-medium bg-black bg-opacity-50 px-3 py-1 rounded-full">
                          Click to enlarge
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="md:w-1/2 glass-panel-navy rounded-3xl p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <Badge className="bg-haven-yellow/20 text-haven-yellow border-haven-yellow/30">
                        {deck.size}
                      </Badge>
                      <h3 className="font-serif text-2xl font-semibold text-haven-beige">{deck.name}</h3>
                    </div>
                    <p className="text-haven-beige/80 mb-6 leading-relaxed">{deck.description}</p>
                    <div className="grid grid-cols-2 gap-3">
                      {deck.highlights.map((highlight, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-haven-yellow rounded-full"></div>
                          <span className="text-sm text-haven-beige/80">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Time of Day Experience */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="glass-panel-navy rounded-3xl p-8"
            >
              <div className="text-center mb-8">
                <Badge className="mb-4 bg-haven-yellow/20 text-haven-yellow border-haven-yellow/30">
                  Perfect for Every Moment
                </Badge>
                <h3 className="font-serif text-2xl font-semibold text-haven-beige">
                  Experience the Lake Throughout the Day
                </h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {timeOfDay.map((time, index) => {
                  const Icon = time.icon;
                  return (
                    <div key={index} className="text-center p-4 rounded-2xl bg-haven-navy-dark/30 hover-lift transition-all duration-300">
                      <Icon className="h-8 w-8 text-haven-yellow mx-auto mb-3" />
                      <div className="font-semibold text-haven-yellow mb-2">{time.label}</div>
                      <div className="text-sm text-haven-beige/70">{time.activity}</div>
                    </div>
                  );
                })}
              </div>
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
              alt="Enlarged deck view" 
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

export default StayDeckViews;
