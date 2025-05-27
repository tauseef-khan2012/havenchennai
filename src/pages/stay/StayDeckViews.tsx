
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StayHero from '@/components/stay/StayHero';
import StayNavigation from '@/components/stay/StayNavigation';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, X } from 'lucide-react';
import { motion } from 'framer-motion';

const StayDeckViews = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState('');
  const [soundPlaying, setSoundPlaying] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);
  
  const deckViews = [
    {
      name: 'Rooftop Deck',
      description: 'Our spectacular rooftop deck offers 360-degree panoramic views of Muttukadu Lake and surrounding landscapes, complete with yoga mats and ambient lighting for magical evenings.',
      image: '/lovable-uploads/fdf4ae09-782a-476b-b866-173bf4816200.png',
      features: [
        'Panoramic views of Muttukadu Lake and distant hills',
        'Dedicated yoga and meditation space with provided mats',
        'Perfect spot for watching sunrises and golden hour sunsets',
        'Nighttime stargazing with unobstructed sky views',
        'Ambient LED lighting for evening relaxation'
      ]
    },
    {
      name: 'First Floor Deck',
      description: 'The elevated first floor deck provides a comfortable outdoor living space with stunning lake views, perfect for morning coffee or evening relaxation.',
      image: '/lovable-uploads/4d8ae28d-5b42-4bd6-9ed3-83acb04bb29b.png',
      features: [
        'Comfortable seating area with lake views',
        'Perfect elevation for photography and bird watching',
        'Protected from ground-level activities for privacy',
        'Ideal spot for morning coffee or afternoon tea',
        'Easy access from the first floor living area'
      ]
    },
    {
      name: 'Ground Floor Deck',
      description: 'A spacious ground-level deck surrounded by lush greenery and flowering plants, offering direct access to the surrounding gardens and outdoor spaces.',
      image: '/lovable-uploads/913eeb57-1adb-4da7-a61b-ba718b4849d7.png',
      features: [
        'Direct access to landscaped gardens',
        'Surrounded by tropical plants and flowers',
        'Multiple seating arrangements for groups',
        'Easy access to outdoor recreational areas',
        'Natural shade from surrounding vegetation'
      ]
    }
  ];
  
  const galleryImages = [
    {
      src: '/lovable-uploads/54bc279a-b178-45ae-a1a2-5d06ad1c435d.png',
      alt: 'Rooftop Deck Night Views',
      time: 'Evening'
    },
    {
      src: '/lovable-uploads/dca2b7eb-af54-4c6e-8739-8add4f661dba.png',
      alt: 'Sunset Views from Upper Deck',
      time: 'Sunset'
    },
    {
      src: '/lovable-uploads/d62143b5-3f29-4040-9d6c-f00ea43f861e.png',
      alt: 'Multi-level Deck Overview',
      time: 'Afternoon'
    },
    {
      src: '/lovable-uploads/44941cd5-2bc4-4e82-8698-7916b158ebd5.png',
      alt: 'Ground Level Deck & Entrance',
      time: 'Golden Hour'
    }
  ];
  
  const openLightbox = (imageSrc: string) => {
    setCurrentImage(imageSrc);
    setLightboxOpen(true);
  };
  
  const toggleSound = () => {
    if (soundPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setSoundPlaying(!soundPlaying);
  };
  
  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <StayHero 
          title="Deck Views"
          subtitle="Experience breathtaking panoramas from our thoughtfully designed multi-level deck spaces."
          backgroundImage="/lovable-uploads/fdf4ae09-782a-476b-b866-173bf4816200.png"
        />
        <StayNavigation />
        
        <section className="py-16 relative">
          {/* Ambient sound toggle */}
          <div className="absolute top-8 right-8 z-10">
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-full p-2 bg-white/80 backdrop-blur-sm"
              onClick={toggleSound}
              aria-label={soundPlaying ? "Mute lake sounds" : "Play lake sounds"}
            >
              {soundPlaying ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Button>
            <audio ref={audioRef} loop className="hidden">
              <source src="https://soundbible.com/mp3/Lake_Waves_Lapping-Mike_Koenig-591240633.mp3" type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
          
          <div className="container-custom">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="max-w-3xl mx-auto text-center mb-12"
            >
              <h2 className="font-serif text-3xl font-bold mb-4">Spectacular Views from Every Level</h2>
              <p className="text-gray-700">
                Our container home features multiple deck spaces across three levels, each offering unique perspectives of Muttukadu Lake and the surrounding natural beauty. 
                From intimate ground-level gardens to panoramic rooftop vistas, every deck provides a different way to connect with nature.
              </p>
            </motion.div>
            
            <div className="space-y-32">
              {deckViews.map((deck, index) => (
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
                      className="relative overflow-hidden rounded-lg shadow-lg cursor-pointer transform transition-transform duration-300 hover:scale-[1.02] group"
                      onClick={() => openLightbox(deck.image)}
                    >
                      <img 
                        src={deck.image} 
                        alt={deck.name} 
                        className="w-full h-[400px] object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="text-white text-sm font-medium bg-black bg-opacity-50 px-3 py-1 rounded-full">
                          Click to enlarge
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="md:w-1/2">
                    <h3 className="font-serif text-2xl font-semibold mb-3">{deck.name}</h3>
                    <p className="text-gray-700 mb-4">{deck.description}</p>
                    <h4 className="font-medium mb-2">Key Features:</h4>
                    <ul className="space-y-2">
                      {deck.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <svg className="h-5 w-5 text-haven-green mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="mt-24"
            >
              <h3 className="font-serif text-2xl font-semibold mb-6 text-center">Capture Every Moment</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {galleryImages.map((image, index) => (
                  <div 
                    key={index} 
                    className="relative group cursor-pointer overflow-hidden rounded-lg"
                    onClick={() => openLightbox(image.src)}
                  >
                    <img 
                      src={image.src} 
                      alt={image.alt} 
                      className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                      <h4 className="text-white font-medium">{image.alt}</h4>
                      <p className="text-white/80 text-sm">{image.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="mt-24 bg-haven-beige bg-opacity-20 p-8 rounded-xl"
            >
              <div className="max-w-3xl mx-auto text-center">
                <h3 className="font-serif text-2xl font-semibold mb-4">The Perfect Deck for Every Moment</h3>
                <p className="text-gray-700 mb-6">
                  Each deck level offers unique experiences throughout the day. From sunrise yoga on the rooftop to evening conversations on the ground floor, 
                  discover the magic of Muttukadu Lake from every perspective.
                </p>
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div className="p-4">
                    <div className="text-haven-green font-medium mb-1">Dawn</div>
                    <div className="text-sm text-gray-600">Rooftop yoga, lake mist</div>
                  </div>
                  <div className="p-4">
                    <div className="text-haven-green font-medium mb-1">Midday</div>
                    <div className="text-sm text-gray-600">Clear panoramic views</div>
                  </div>
                  <div className="p-4">
                    <div className="text-haven-green font-medium mb-1">Golden Hour</div>
                    <div className="text-sm text-gray-600">Sunset photography</div>
                  </div>
                  <div className="p-4">
                    <div className="text-haven-green font-medium mb-1">Evening</div>
                    <div className="text-sm text-gray-600">Stargazing, night lights</div>
                  </div>
                </div>
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

export default StayDeckViews;
